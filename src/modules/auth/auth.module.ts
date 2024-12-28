import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from 'modules/user';

import { AuthResolver } from './auth.resolver';
import { SessionEntity } from './entities/session.entity';
import { AuthService, SessionService } from './services';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies';

@Module({
  imports: [TypeOrmModule.forFeature([SessionEntity]), UserModule],
  providers: [AuthResolver, AuthService, JwtService, SessionService, AccessTokenStrategy, RefreshTokenStrategy],
  exports: [SessionService],
})
export class AuthModule {}
