import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsOptional } from 'class-validator';
import { IsNotEmpty } from 'class-validator';

@ObjectType()
export class ResendVerification {
  @Field(() => Boolean)
  @IsBoolean()
  @IsNotEmpty()
  success!: boolean;

  @Field(() => Boolean)
  @IsBoolean()
  @IsOptional()
  alreadyVerified?: boolean;
}
