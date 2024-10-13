import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from 'modules/user';

import { AuthResolver } from './auth.resolver';
import { RefreshTokenEntity } from './entities/refresh-token.entity';
import { AuthService, RefreshTokenService } from './services';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies';

@Module({
  imports: [TypeOrmModule.forFeature([RefreshTokenEntity]), UserModule],
  providers: [AuthResolver, AuthService, JwtService, RefreshTokenService, AccessTokenStrategy, RefreshTokenStrategy],
  exports: [],
})
export class AuthModule {}
