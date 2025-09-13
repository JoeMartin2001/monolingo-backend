import { CreateUserDto } from './create-user.dto';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @Field(() => String)
  id!: string;
}
