import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SignUpResponse {
  @Field(() => Int)
  userId: number;
}
