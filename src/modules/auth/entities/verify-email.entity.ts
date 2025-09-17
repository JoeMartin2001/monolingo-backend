import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { IsNotEmpty } from 'class-validator';
import { User } from 'src/modules/user/entities/user.entity';

@ObjectType()
export class VerifyEmail {
  @Field(() => Boolean)
  @IsBoolean()
  @IsNotEmpty()
  success!: boolean;

  @Field(() => Boolean)
  @IsBoolean()
  @IsOptional()
  alreadyVerified!: boolean;

  @Field(() => Boolean)
  @IsBoolean()
  @IsOptional()
  tokenExpired!: boolean;

  @Field(() => User)
  @IsOptional()
  user!: User;

  @Field(() => String)
  @IsOptional()
  @IsString()
  accessToken!: string;

  @Field(() => String)
  @IsOptional()
  @IsString()
  refreshToken!: string;
}
