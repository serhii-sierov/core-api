import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class ChangePasswordInput {
  @IsNotEmpty()
  @Field()
  oldPassword: string;

  @IsNotEmpty()
  @Field()
  newPassword: string;
}
