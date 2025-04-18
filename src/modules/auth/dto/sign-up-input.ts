import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, Matches, MaxLength, MinLength } from 'class-validator';

import { PASSWORD_PATTERN } from 'constants/password-pattern';

@InputType()
export class SignUpInput {
  @IsEmail()
  @Field()
  email: string;

  @MinLength(4)
  @MaxLength(20)
  @Matches(PASSWORD_PATTERN, { message: 'password too weak' })
  @Field()
  password: string;
}
