import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsUUID, IsNotEmpty, MinLength, IsString } from 'class-validator';
import { CreateUserInput } from 'src/modules/user/dto/create-user.input';

@InputType()
export class RegisterInput extends PartialType(CreateUserInput) {
  @Field(() => String)
  @IsUUID()
  @IsNotEmpty()
  id!: string;

  @Field(() => String)
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password!: string;
}
