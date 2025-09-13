import { InputType, Field } from '@nestjs/graphql';
import { IUser, LanguageLevel } from 'src/interfaces/User';

@InputType()
export class CreateUserInput implements Partial<IUser> {
  @Field(() => String, { description: 'Email' })
  email!: string;

  @Field(() => String, { description: 'Username' })
  username!: string;

  @Field(() => String, { description: 'Native Language' })
  nativeLanguage!: string;

  @Field(() => String, { description: 'Target Language' })
  targetLanguage!: string;

  @Field(() => LanguageLevel, { description: 'Language Level' })
  level!: LanguageLevel;

  @Field(() => String, { description: 'Bio' })
  bio!: string;

  @Field(() => String, { description: 'Avatar URL' })
  avatarUrl!: string;
}
