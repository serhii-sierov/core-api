import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

import { SignInInput } from './sign-in-input';

@InputType()
export class SignInGoogleInput extends SignInInput {
  @IsNotEmpty()
  @Field()
  idToken: string;
}
