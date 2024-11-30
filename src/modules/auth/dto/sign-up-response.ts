import { Field, ObjectType } from '@nestjs/graphql';

import { UserEntity } from 'modules/user/entities';

@ObjectType()
export class SignUpResponse {
  @Field()
  user: UserEntity;
}
