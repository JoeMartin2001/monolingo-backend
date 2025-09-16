import { InputType, Field } from '@nestjs/graphql';
import { IsString, Matches, MinLength } from 'class-validator';

@InputType()
export class ResetPasswordInput {
  @Field(() => String)
  @IsString()
  // if you use 32 bytes hex = 64 hex chars:
  @Matches(/^[0-9a-f]{64}$/i, { message: 'Invalid token format' })
  token!: string;

  @Field(() => String)
  @IsString()
  @MinLength(6)
  newPassword!: string;
}
