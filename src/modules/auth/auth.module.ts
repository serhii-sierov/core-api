import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from 'modules/user';
import { SessionEntity } from 'modules/user/entities';
import { SessionService } from 'modules/user/services';

import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies';

@Module({
  imports: [TypeOrmModule.forFeature([SessionEntity]), UserModule],
  providers: [AuthResolver, AuthService, JwtService, SessionService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AuthModule {}
