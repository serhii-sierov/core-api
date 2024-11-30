import { Query, Resolver } from '@nestjs/graphql';

import { CurrentUser } from 'modules/auth/decorators';
import { ContextUser } from 'types';

import { UserEntity } from './entities';
import { UserService } from './services';

@Resolver(() => UserEntity)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserEntity, { name: 'user' })
  getUser(@CurrentUser() contextUser: ContextUser): Promise<UserEntity | null> {
    return this.userService.findOne({ where: { id: contextUser.id } });
  }
}
