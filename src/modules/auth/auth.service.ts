import { AppCookie } from '@constants';
import { BadRequestException, Inject, Injectable, LoggerService, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import * as jwt from 'jsonwebtoken';
import ms from 'ms';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { DataSource } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { AppConfigService } from 'modules/shared/modules/config';
import { GoogleConfig, JwtConfig } from 'modules/shared/modules/config/loaders';
import { SessionEntity } from 'modules/user/entities';
import { UserEntity } from 'modules/user/entities/user.entity';
import { SessionService, UserService } from 'modules/user/services';
import { IdentityProvider } from 'modules/user/types';
import { compareHash, generateRandomSecret, hash } from 'utils';

import { ErrorMessage } from './constants';
import { SignInCredentialsInput, SignInGoogleInput, SignUpInput } from './dto';
import { AdditionalJwtPayload, DeviceInfo, GenerateTokensResult, JwtPayload, Tokens } from './types';
import { SignInOptions, SignInOptionsBase } from './types/sign-in-options';

@Injectable()
export class AuthService {
  private readonly jwtConfig: JwtConfig;
  private readonly googleConfig: GoogleConfig;
  private readonly isProduction: boolean;

  constructor(
    private readonly dataSource: DataSource,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly sessionService: SessionService,
    private readonly configService: AppConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly loggerService: LoggerService,
  ) {
    this.jwtConfig = this.configService.get('jwt');
    this.googleConfig = this.configService.get('google');
    this.isProduction = this.configService.isProduction();
  }

  signUp = async (input: SignUpInput, res: Response, deviceInfo?: DeviceInfo): Promise<SessionEntity> => {
    const { email, password } = input;
    const { ipAddress, device } = deviceInfo ?? {};
    const location = ipAddress && (await this.resolveLocation(ipAddress));

    // Check if user exists
    const user = await this.userService.findOne({
      where: { email },
    });

    if (user) {
      throw new BadRequestException(ErrorMessage.USER_ALREADY_EXISTS);
    }

    const hashedPassword = await hash(password);

    return this.dataSource.transaction(async manager => {
      const newUser = await this.userService.create(
        {
          ...input,
          password: hashedPassword,
        },
        manager,
      );

      const sessionId = uuid();

      const tokens = await this.generateTokens(newUser.id, { email, sessionId });

      this.setTokensCookie(tokens, res);

      const expiresAt = new Date(Date.now() + ms(this.jwtConfig.refreshToken.expiresIn));

      const jtiHash = await hash(tokens.jti);

      return this.sessionService.create(
        {
          sessionId,
          userId: newUser.id,
          jtiHash,
          expiresAt,
          ipAddress,
          location,
          device,
        },
        manager,
      );
    });
  };

  signIn = async (user: UserEntity, res: Response, options: SignInOptions): Promise<SessionEntity> => {
    const { forceNewSession, deviceInfo, requestRefreshToken, provider } = options;
    const { ipAddress, device } = deviceInfo ?? {};
    const location = ipAddress && (await this.resolveLocation(ipAddress));

    let sessionId = uuid();
    let isExistingSession = false;

    if (requestRefreshToken) {
      const { sessionId: prevSessionId, jti } = jwt.verify(
        requestRefreshToken,
        this.jwtConfig.refreshToken.secret,
      ) as JwtPayload;

      const existingSession = sessionId
        ? await this.sessionService.findOne({
            where: { userId: user.id, sessionId: prevSessionId },
          })
        : null;

      if (existingSession && jti && (await compareHash(jti, existingSession.jtiHash))) {
        if (forceNewSession) {
          await this.sessionService.destroy({ sessionId: prevSessionId });
        } else {
          sessionId = existingSession?.sessionId;
          isExistingSession = true;
        }
      }
    }

    const tokens = await this.generateTokens(user.id, { email: user.email, sessionId, provider });

    this.setTokensCookie(tokens, res);

    const expiresAt = new Date(Date.now() + ms(this.jwtConfig.refreshToken.expiresIn));

    const jtiHash = await hash(tokens.jti);

    const session: Partial<SessionEntity> = {
      userId: user.id,
      jtiHash,
      expiresAt,
      ipAddress,
      location,
      device,
    };

    if (isExistingSession) {
      await this.sessionService.update({ sessionId }, session);
    } else {
      await this.sessionService.create({ sessionId, ...session });
    }

    return this.sessionService.findOneOrFail({
      where: { sessionId },
      relations: { user: { identities: true } },
    });
  };

  signInCredentials = async (
    input: SignInCredentialsInput,
    res: Response,
    options: SignInOptionsBase,
  ): Promise<SessionEntity> => {
    const { email, password, forceNewSession } = input;
    const user = await this.validateCredentialsAndGetUser(email, password);

    if (!user) {
      throw new UnauthorizedException(ErrorMessage.INVALID_CREDENTIALS);
    }

    const identity = user.identities?.find(item => item.provider === IdentityProvider.CREDENTIALS);

    if (!identity) {
      await this.userService.addIdentity(user, {
        provider: IdentityProvider.CREDENTIALS,
        providerId: String(user.id),
      });
    }

    return this.signIn(user, res, { ...options, forceNewSession, provider: IdentityProvider.CREDENTIALS });
  };

  signInGoogle = async (
    input: SignInGoogleInput,
    res: Response,
    options: SignInOptionsBase,
  ): Promise<SessionEntity> => {
    const { idToken, forceNewSession } = input;

    const client = new OAuth2Client(this.googleConfig.clientId);

    const ticket = await client.verifyIdToken({
      idToken,
      audience: this.googleConfig.clientId,
    });

    const payload = ticket.getPayload();

    // TODO: Check if user exists, if not create user, and create identity
    const [user] = await this.userService.findOrCreate(
      { where: { email: payload?.email }, relations: { identities: true } },
      { email: payload?.email, name: payload?.name, picture: payload?.picture },
    );

    if (!user) {
      throw new UnauthorizedException(ErrorMessage.INVALID_GOOGLE_ID_TOKEN);
    }

    console.log({ payload });
    console.log({ user });

    if (!user.picture && payload?.picture) {
      await this.userService.update({ id: user.id }, { picture: payload.picture });
    }

    if (!user.name && payload?.name) {
      await this.userService.update({ id: user.id }, { name: payload.name });
    }

    const identity = user.identities?.find(item => item.provider === IdentityProvider.GOOGLE);

    if (!identity) {
      await this.userService.addIdentity(user, { provider: IdentityProvider.GOOGLE, providerId: payload?.sub });
    }

    return this.signIn(user, res, { ...options, forceNewSession, provider: IdentityProvider.GOOGLE });
  };

  generateTokens = async (userId: number, payload: AdditionalJwtPayload): Promise<GenerateTokensResult> => {
    const jti = generateRandomSecret();

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        subject: String(userId),
        ...this.jwtConfig.accessToken,
      }),
      this.jwtService.signAsync(
        { ...payload, jti },
        {
          subject: String(userId),
          ...this.jwtConfig.refreshToken,
        },
      ),
    ]);

    return { accessToken, refreshToken, jti };
  };

  validateCredentialsAndGetUser = async (email: string, password: string): Promise<UserEntity | null> => {
    if (!email || !password) {
      throw new BadRequestException(ErrorMessage.INVALID_CREDENTIALS);
    }

    const user = await this.userService.findOne({ where: { email }, relations: { identities: true } });

    if (user?.password && (await this.validatePassword(password, user.password))) {
      return user;
    }

    return null;
  };

  signOut = async (res: Response, sessionId?: string): Promise<boolean> => {
    this.clearTokensCookie(res);

    if (sessionId) {
      const deletedRows = await this.sessionService.destroy({ sessionId });

      return Boolean(deletedRows);
    }

    return true;
  };

  refreshToken = async (refreshToken: string, deviceInfo: DeviceInfo, res: Response): Promise<SessionEntity | null> => {
    const { ipAddress, device } = deviceInfo;
    const location = ipAddress && (await this.resolveLocation(ipAddress));

    const { sessionId, jti = '' } = jwt.verify(refreshToken, this.jwtConfig.refreshToken.secret) as JwtPayload;

    const session = sessionId
      ? await this.sessionService.findOne({ where: { sessionId }, relations: { user: true } })
      : null;

    if (!session) {
      this.clearTokensCookie(res);

      throw new UnauthorizedException();
    }

    const user = session.user;

    if (!(await compareHash(jti, session.jtiHash))) {
      await this.sessionService.destroy({ sessionId });
      this.clearTokensCookie(res);

      this.loggerService.error(ErrorMessage.INVALID_GWT_ID_HASH, { userId: user.id, sessionId });

      throw new UnauthorizedException();
    }

    const tokens = await this.generateTokens(user.id, { email: user.email, sessionId });

    console.log({ 'OLD TOKEN': refreshToken, 'NEW TOKEN': tokens.refreshToken });

    this.setTokensCookie(tokens, res);

    const expiresAt = new Date(Date.now() + ms(this.jwtConfig.refreshToken.expiresIn));

    const jtiHash = await hash(tokens.jti);

    const [, updatedSession] = await this.sessionService.update(
      { sessionId: session.sessionId },
      { jtiHash, expiresAt, ipAddress, location, device },
    );

    return updatedSession?.[0] ?? null;
  };

  changePassword = async (oldPassword: string, newPassword: string, userId: number): Promise<boolean> => {
    const user = await this.userService.findOne({ where: { id: userId } });

    const isPasswordValid = Boolean(user?.password && (await this.validatePassword(oldPassword, user.password)));

    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }

    const hashedPassword = await hash(newPassword);

    await this.userService.update({ id: userId }, { password: hashedPassword });

    return true;
  };

  forgotPassword = async (email: string): Promise<void> => {
    const user = await this.userService.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException();
    }
    // Send email with reset link or token
  };

  private readonly resolveLocation = (_ipAddress: string): Promise<string | null> => {
    // TODO: Implement ip address geo location lookup using https://ipgeolocation.io/
    // TODO: Consider caching the results
    return Promise.resolve(null);
  };

  // Validate password using bcrypt
  private readonly validatePassword = (plainPassword: string, hashedPassword: string): Promise<boolean> => {
    return compareHash(plainPassword, hashedPassword);
  };

  private readonly setTokensCookie = (tokens: Tokens, res: Response): void => {
    res.cookie(AppCookie.ACCESS_TOKEN, tokens.accessToken, {
      httpOnly: true,
      secure: this.isProduction,
      maxAge: ms(this.jwtConfig.accessToken.expiresIn),
    });
    res.cookie(AppCookie.REFRESH_TOKEN, tokens.refreshToken, {
      httpOnly: true,
      secure: this.isProduction,
      maxAge: ms(this.jwtConfig.refreshToken.expiresIn),
    });
  };

  private readonly clearTokensCookie = (res: Response): void => {
    res.clearCookie(AppCookie.ACCESS_TOKEN);
    res.clearCookie(AppCookie.REFRESH_TOKEN);
  };
}
