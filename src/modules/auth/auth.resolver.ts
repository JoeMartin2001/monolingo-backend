import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { LoginInput } from './dto/login.input';
import { CreateUserInput } from '../user/dto/create-user.input';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => Auth)
  async signup(@Args('input') input: CreateUserInput) {
    return this.authService.signup(input);
  }

  @Mutation(() => Auth)
  async login(@Args('input') input: LoginInput) {
    return this.authService.signIn(input.email, input.password);
  }

  @Mutation(() => Auth)
  async refreshToken(@Args('token') token: string): Promise<any> {
    return this.authService.refreshToken(token);
  }
}
