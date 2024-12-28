import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SignInInput {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field({ nullable: true })
  forceNewSession?: boolean;
}
