import { Mutation, Query, Resolver, Args } from '@nestjs/graphql';
import { User } from './user.entity';
import { UserService } from '../user.service';
import { CreateUserDto } from '../dto/create-user.dto';

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => [User])
  async users() {
    return this.userService.findAll();
  }

  @Mutation(() => User)
  async createUser(@Args('input') input: CreateUserDto) {
    return this.userService.create(input);
  }
}
