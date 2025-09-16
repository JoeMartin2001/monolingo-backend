import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { LoginInput } from './dto/login.input';
import { CreateUserInput } from '../user/dto/create-user.input';
import { ResetPasswordInput } from './dto/reset-password.input';
import { RequestPasswordResetInput } from './dto/request-password-reset.input';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => Auth)
  async googleAuth(@Args('token') token: string): Promise<Auth> {
    return await this.authService.googleAuth(token);
  }

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

  @Mutation(() => Boolean)
  async requestPasswordReset(
    @Args('input') input: RequestPasswordResetInput,
    @Context()
    {
      req,
    }: {
      req: {
        ip: string;
        headers: {
          'user-agent': string;
        };
      };
    },
  ) {
    await this.authService.requestPasswordReset(
      input.email,
      req?.ip,
      req?.headers['user-agent'],
    );

    return true; // Always true (no user enumeration)
  }

  @Mutation(() => Boolean)
  async resetPassword(@Args('input') input: ResetPasswordInput) {
    await this.authService.resetPassword(input.token, input.newPassword);

    return true;
  }
}
