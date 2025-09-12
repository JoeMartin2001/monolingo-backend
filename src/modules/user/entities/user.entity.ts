import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@ObjectType()
@Entity()
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string; // don’t expose in GraphQL schema

  @Field()
  @Column({ default: 'student' })
  role!: string;

  @Field(() => [String])
  @Column('text', { array: true, default: [] })
  languagesLearning!: string[];

  @Field(() => [String])
  @Column('text', { array: true, default: [] })
  languagesTeaching!: string[];
}
