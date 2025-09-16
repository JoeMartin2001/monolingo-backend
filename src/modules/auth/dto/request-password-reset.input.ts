import { InputType, Field } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType()
export class RequestPasswordResetInput {
  @Field(() => String)
  @IsEmail()
  email!: string;
}
