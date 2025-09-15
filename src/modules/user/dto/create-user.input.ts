import { InputType, Field } from '@nestjs/graphql';
import { IUser, IUserAuthProvider, LanguageLevel } from 'src/interfaces/User';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateUserInput implements Partial<IUser> {
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Email' })
  email!: string;

  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Google ID', nullable: true })
  googleId?: string;

  @IsString()
  @IsOptional()
  @Field(() => IUserAuthProvider, { description: 'Auth Provider' })
  authProvider!: IUserAuthProvider;

  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Username' })
  username!: string;

  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Native Language' })
  nativeLanguage!: string;

  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Target Language' })
  targetLanguage!: string;

  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Password' })
  password!: string;

  @IsEnum(LanguageLevel)
  @IsNotEmpty()
  @Field(() => LanguageLevel, { description: 'Language Level' })
  level!: LanguageLevel;

  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Bio' })
  bio!: string;

  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Avatar URL' })
  avatarUrl!: string;
}
