import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SessionEntity } from './entities';
import { IdentityEntity } from './entities/identity.entity';
import { UserEntity } from './entities/user.entity';
import { SessionService, UserService } from './services';
import { UserResolver } from './user.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, IdentityEntity, SessionEntity])],
  providers: [UserService, UserResolver, SessionService],
  exports: [UserService, SessionService],
})
export class UserModule {}
