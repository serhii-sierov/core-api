import { Field, InputType } from '@nestjs/graphql';

import { SignInInput } from './sign-in-input';

@InputType()
export class SignInCredentialsInput extends SignInInput {
  @Field()
  email: string;

  @Field()
  password: string;
}
