import { InputType, Field } from '@nestjs/graphql';
import { IUser, LanguageLevel } from 'src/interfaces/User';

@InputType()
export class CreateUserDto implements IUser {
  @Field(() => String, { description: 'Example field (placeholder)' })
  id!: string;

  @Field(() => String, { description: 'Example field (placeholder)' })
  email!: string;

  @Field(() => String, { description: 'Example field (placeholder)' })
  username!: string;

  @Field(() => String, { description: 'Example field (placeholder)' })
  nativeLanguage!: string;

  @Field(() => String, { description: 'Example field (placeholder)' })
  targetLanguage!: string;

  @Field(() => LanguageLevel, { description: 'Example field (placeholder)' })
  level!: LanguageLevel;

  @Field(() => String, { description: 'Example field (placeholder)' })
  bio!: string;

  @Field(() => String, { description: 'Example field (placeholder)' })
  avatarUrl!: string;

  @Field(() => Date, { description: 'Example field (placeholder)' })
  createdAt!: Date;

  @Field(() => Date, { description: 'Example field (placeholder)' })
  updatedAt!: Date;
}
