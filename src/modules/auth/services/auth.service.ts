import { AppCookie } from '@constants';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import ms from 'ms';
import { DataSource } from 'typeorm';

import { AppConfigService } from 'modules/shared/modules/config';
import { JwtConfig } from 'modules/shared/modules/config/loaders';
import { UserEntity } from 'modules/user/entities/user.entity';
import { UserService } from 'modules/user/services';
import { compareHash, hash } from 'utils';

import { RefreshTokenService } from './refresh-token.service';

import { ErrorMessage } from '../constants';
import { SignInInput, SignInResponse, SignUpInput, SignUpResponse } from '../dto';
import { AdditionalJwtPayload, DeviceInfo, SignOutOptions, Tokens } from '../types';

@Injectable()
export class AuthService {
  private readonly jwtConfig: JwtConfig;
  private readonly isProduction: boolean;

  constructor(
    private readonly dataSource: DataSource,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly configService: AppConfigService,
  ) {
    this.jwtConfig = this.configService.get('jwt');
    this.isProduction = this.configService.isProduction();
  }

  signUp = async (input: SignUpInput, res: Response, deviceInfo?: DeviceInfo): Promise<SignUpResponse> => {
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

      const tokens = await this.generateTokens(newUser.id, { email });

      this.setTokensCookie(tokens, res);

      const expiresAt = new Date(Date.now() + ms(this.jwtConfig.refreshToken.expiresIn));

      await this.refreshTokenService.create(
        { userId: newUser.id, token: tokens.refreshToken, expiresAt, ipAddress, location, device },
        manager,
      );

      return { user: newUser };
    });
  };

  signIn = async (
    input: SignInInput,
    res: Response,
    deviceInfo?: DeviceInfo,
    requestRefreshToken?: string,
  ): Promise<SignInResponse> => {
    const { email, password } = input;
    const { ipAddress, device } = deviceInfo ?? {};
    const location = ipAddress && (await this.resolveLocation(ipAddress));

    const user = await this.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException(ErrorMessage.INVALID_CREDENTIALS);
    }

    const tokens = await this.generateTokens(user.id, { email });

    this.setTokensCookie(tokens, res);

    const expiresAt = new Date(Date.now() + ms(this.jwtConfig.refreshToken.expiresIn));

    await this.refreshTokenService.insertOrUpdateToken(
      {
        userId: user.id,
        token: tokens.refreshToken,
        expiresAt,
        ipAddress,
        location,
        device,
      },
      requestRefreshToken,
    );

    return { user };
  };

  generateTokens = async (userId: number, payload: AdditionalJwtPayload): Promise<Tokens> => {
    const [accessToken, refreshToken] = await Promise.all([
      // Access token
      this.jwtService.signAsync(payload, {
        subject: String(userId),
        ...this.jwtConfig.accessToken,
      }),
      // Refresh token
      this.jwtService.signAsync(payload, {
        subject: String(userId),
        ...this.jwtConfig.refreshToken,
      }),
    ]);

    return { accessToken, refreshToken };
  };

  validateUser = async (email: string, password: string): Promise<UserEntity | null> => {
    const user = await this.userService.findOne({ where: { email } });

    if (user?.password && (await this.validatePassword(password, user.password))) {
      return user;
    }

    return null;
  };

  signOut = async (options: SignOutOptions, res: Response): Promise<void> => {
    const { userId, refreshToken, useAllDevices } = options;

    if (useAllDevices) {
      await this.refreshTokenService.destroy({ userId });
    } else {
      await this.refreshTokenService.destroy({ token: refreshToken });
    }

    this.clearTokensCookie(res);
  };

  refreshToken = async (refreshToken: string, deviceInfo: DeviceInfo, res: Response): Promise<boolean> => {
    const { ipAddress, device } = deviceInfo;
    const location = ipAddress && (await this.resolveLocation(ipAddress));

    const refreshTokenEntity =
      (Boolean(refreshToken) || null) && (await this.refreshTokenService.findOne({ where: { token: refreshToken } }));

    if (!refreshTokenEntity) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.findOne({ where: { id: refreshTokenEntity.userId } });

    if (!user) {
      throw new UnauthorizedException();
    }

    const tokens = await this.generateTokens(user.id, { email: user.email });

    this.setTokensCookie(tokens, res);

    const expiresAt = new Date(Date.now() + ms(this.jwtConfig.refreshToken.expiresIn));

    await this.refreshTokenService.update(
      { token: refreshToken },
      { token: tokens.refreshToken, expiresAt, ipAddress, location, device },
    );

    return true;
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
