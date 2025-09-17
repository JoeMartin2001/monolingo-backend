import { InputType, Field } from '@nestjs/graphql';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { IUser, LanguageLevel } from 'src/interfaces/User';

@InputType()
export class RegisterInput implements Partial<IUser> {
  @Field(() => String)
  @IsEmail()
  email!: string;

  @Field(() => String)
  @IsString()
  @MinLength(3)
  username!: string;

  @Field(() => String)
  @IsString()
  @MinLength(6)
  password!: string;

  @Field(() => String)
  @IsString()
  nativeLanguage!: string;

  @Field(() => String)
  @IsString()
  targetLanguage!: string;

  @Field(() => LanguageLevel)
  @IsEnum(LanguageLevel)
  level!: LanguageLevel;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  bio?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
