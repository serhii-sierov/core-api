import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SignUpResponse {
  @Field()
  id: number;
}
