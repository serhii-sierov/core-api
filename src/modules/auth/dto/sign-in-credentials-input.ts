import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';

import { SignInInput } from './sign-in-input';

@InputType()
export class SignInCredentialsInput extends SignInInput {
  @IsEmail()
  @Field()
  email: string;

  @IsNotEmpty()
  @Field()
  password: string;
}
