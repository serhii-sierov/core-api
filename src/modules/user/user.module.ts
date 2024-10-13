import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProviderEntity } from './entities/provider.entity';
import { UserEntity } from './entities/user.entity';
import { UserService } from './services';
import { UserResolver } from './user.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, ProviderEntity])],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
