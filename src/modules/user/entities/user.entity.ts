import { ObjectType, Field, ID } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { IUser, IUserRole, LanguageLevel } from 'src/interfaces/User';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { TableName } from 'src/common/constants/TableName';

@ObjectType()
@Entity(TableName.USER)
export class User implements IUser {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string; // don’t expose in GraphQL schema

  @Field()
  @Column({ default: IUserRole.STUDENT })
  role!: IUserRole;

  @Field(() => [String])
  @Column('text', { array: true, default: [] })
  languagesLearning!: string[];

  @Field(() => [String])
  @Column('text', { array: true, default: [] })
  languagesTeaching!: string[];

  @Field()
  @Column({ default: false })
  isStudent!: boolean;

  @Field()
  @Column({ default: LanguageLevel.A1 })
  level!: LanguageLevel;

  @Field()
  @IsOptional()
  @Column({ default: '' })
  bio!: string;

  @Field()
  @IsOptional()
  @Column({ default: '' })
  avatarUrl!: string;

  @Field()
  @Column({ default: new Date() })
  createdAt!: Date;

  @Field()
  @Column({ default: new Date() })
  updatedAt!: Date;

  @Field()
  @Column({ default: '' })
  username!: string;

  @Field()
  @Column({ default: '' })
  nativeLanguage!: string;

  @Field()
  @Column({ default: '' })
  targetLanguage!: string;
}
