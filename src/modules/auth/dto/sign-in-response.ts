import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SignInResponse {
  @Field()
  id: number;
}
