import { Query, Resolver } from '@nestjs/graphql';

import { User } from 'graphql';
import { CurrentUser } from 'modules/auth/decorators';
import { ContextUser } from 'types';

import { UserService } from './services';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query('user')
  getUser(@CurrentUser() contextUser: ContextUser): Promise<User> {
    return this.userService.findOne({ where: { id: contextUser.id } });
  }
}
