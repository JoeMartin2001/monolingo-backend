import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { IsNotEmpty } from 'class-validator';

@ObjectType()
export class Auth {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  accessToken!: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}
