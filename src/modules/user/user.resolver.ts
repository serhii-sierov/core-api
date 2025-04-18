import { Inject, LoggerService } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { CurrentUser } from 'modules/auth/decorators';
import { ContextUser } from 'types';

import { UserEntity } from './entities';
import { UserService } from './services';

@Resolver(() => UserEntity)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly loggerService: LoggerService,
  ) {}

  @Query(() => UserEntity, { name: 'user' })
  getUser(@CurrentUser() contextUser: ContextUser): Promise<UserEntity | null> {
    this.loggerService.log({ contextUser }, this.constructor.name);

    return this.userService.findOne({
      where: { id: contextUser.id },
      relations: { identities: true, sessions: { identity: true } },
    });
  }
}
