// src/modules/user/dto/create-user.input.ts
import { InputType, Field, GraphQLISODateTime } from '@nestjs/graphql';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
  IsUrl,
  IsBoolean,
  IsArray,
} from 'class-validator';
import {
  IUserRole,
  IUserAuthProvider,
  LanguageLevel,
  IUser,
} from 'src/interfaces/User';

@InputType()
export class CreateUserInput implements Partial<IUser> {
  @Field(() => String)
  @IsEmail()
  email!: string;

  @Field(() => String)
  @IsString()
  @MinLength(3)
  username!: string;

  // Optional: for OAuth-created users you can omit password
  @Field(() => String, { nullable: true })
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
  @IsUrl()
  avatarUrl?: string;

  // Admin/server-controlled knobs (optional)
  @Field(() => IUserRole, { nullable: true })
  @IsOptional()
  @IsEnum(IUserRole)
  role?: IUserRole;

  @Field(() => IUserAuthProvider, { nullable: true })
  @IsOptional()
  @IsEnum(IUserAuthProvider)
  authProvider?: IUserAuthProvider;

  @Field(() => String, {
    nullable: true,
    description: 'Google account ID if linking',
  })
  @IsOptional()
  @IsString()
  googleId?: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  emailVerified?: boolean;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @IsOptional()
  emailVerifiedAt?: Date | null;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languagesLearning?: string[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languagesTeaching?: string[];

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isStudent?: boolean;
}
