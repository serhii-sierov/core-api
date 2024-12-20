import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SignInResponse {
  @Field(() => Int)
  userId: number;
}
