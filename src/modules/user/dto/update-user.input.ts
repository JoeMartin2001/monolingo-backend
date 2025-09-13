import { CreateUserInput } from './create-user.input';
import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  id!: string;
}
