import { Field, InputType } from '@nestjs/graphql';

import { SignInInput } from './sign-in-input';

@InputType()
export class SignInGoogleInput extends SignInInput {
  @Field()
  idToken: string;
}
