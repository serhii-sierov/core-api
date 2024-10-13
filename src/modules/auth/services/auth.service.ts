import { AppCookie } from '@constants';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import ms from 'ms';
import { DataSource } from 'typeorm';

import { JwtConfig } from 'config';
import { SignInInput, SignInResponse, SignUpInput, SignUpResponse } from 'graphql';
import { AppConfigService } from 'modules/shared/modules/config';
import { UserEntity } from 'modules/user/entities/user.entity';
import { UserService } from 'modules/user/services';
import { compareHash, hash } from 'utils';

import { RefreshTokenService } from './refresh-token.service';

import { ErrorMessage } from '../constants';
import { AdditionalJwtPayload, RefreshTokenOptions, SignOutOptions, Tokens } from '../types';

@Injectable()
export class AuthService {
  private readonly jwtConfig: JwtConfig;

  constructor(
    private readonly dataSource: DataSource,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly configService: AppConfigService,
  ) {
    this.jwtConfig = this.configService.get('jwt');
  }

  signUp = async (input: SignUpInput, res: Response): Promise<SignUpResponse> => {
    const { email, password, device } = input;

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

      const tokens = await this.generateTokens(newUser.id, { email, device });

      this.setTokensCookie(tokens, res);

      const expiresAt = new Date(Date.now() + ms(this.jwtConfig.refreshToken.expiresIn));

      await this.refreshTokenService.create(
        { userId: newUser.id, token: tokens.refreshToken, expiresAt, device },
        manager,
      );

      return { user: newUser };
    });
  };

  signIn = async (input: SignInInput, res: Response, requestRefreshToken?: string): Promise<SignInResponse> => {
    const { email, password, device } = input;

    const user = await this.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException(ErrorMessage.INVALID_CREDENTIALS);
    }

    const tokens = await this.generateTokens(user.id, { email, device });

    this.setTokensCookie(tokens, res);

    const expiresAt = new Date(Date.now() + ms(this.jwtConfig.refreshToken.expiresIn));

    await this.refreshTokenService.insertOrUpdateToken(requestRefreshToken, {
      userId: user.id,
      token: tokens.refreshToken,
      expiresAt,
      device,
    });

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

    if (user && (await this.validatePassword(password, user.password))) {
      return user;
    }

    return null;
  };

  signOut = async (options: SignOutOptions, res: Response): Promise<void> => {
    const { userId, refreshToken, isAllDevices } = options;

    if (isAllDevices) {
      await this.refreshTokenService.destroy({ userId });
    } else {
      await this.refreshTokenService.destroy({ token: refreshToken });
    }

    this.clearTokensCookie(res);
  };

  refreshToken = async (options: RefreshTokenOptions, res: Response): Promise<boolean> => {
    const { refreshToken, device } = options;
    const refreshTokenEntity = await this.refreshTokenService.findOne({ where: { token: refreshToken } });

    if (!refreshTokenEntity) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.findOne({ where: { id: refreshTokenEntity.userId } });

    if (!user) {
      throw new UnauthorizedException();
    }

    const tokens = await this.generateTokens(user.id, {
      email: user.email,
      device: device ?? refreshTokenEntity.device,
    });

    this.setTokensCookie(tokens, res);

    const expiresAt = new Date(Date.now() + ms(this.jwtConfig.refreshToken.expiresIn));

    await this.refreshTokenService.update(
      { token: refreshToken },
      { token: tokens.refreshToken, expiresAt, device: refreshTokenEntity.device },
    );

    return true;
  };

  forgotPassword = async (email: string): Promise<void> => {
    const user = await this.userService.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException();
    }
    // Send email with reset link or token
  };

  // Validate password using bcrypt
  private readonly validatePassword = (plainPassword: string, hashedPassword: string): Promise<boolean> => {
    return compareHash(plainPassword, hashedPassword);
  };

  private readonly setTokensCookie = (tokens: Tokens, res: Response) => {
    res.cookie(AppCookie.ACCESS_TOKEN, tokens.accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: ms(this.jwtConfig.accessToken.expiresIn),
    });
    res.cookie(AppCookie.REFRESH_TOKEN, tokens.refreshToken, {
      secure: true,
      httpOnly: true,
      maxAge: ms(this.jwtConfig.refreshToken.expiresIn),
    });
  };

  private readonly clearTokensCookie = (res: Response) => {
    res.clearCookie(AppCookie.ACCESS_TOKEN);
    res.clearCookie(AppCookie.REFRESH_TOKEN);
  };
}
