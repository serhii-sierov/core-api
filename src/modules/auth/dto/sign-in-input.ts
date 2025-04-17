import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SignInInput {
  @Field({ nullable: true })
  forceNewSession?: boolean;
}
