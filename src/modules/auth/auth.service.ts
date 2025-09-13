import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserInput } from '../user/dto/create-user.input';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signupInput: CreateUserInput) {
    const existingUser = await this.usersService.findByEmail(signupInput.email);
    if (existingUser) throw new ConflictException('Email already in use');

    const existingUsername = await this.usersService.findByUsername(
      signupInput.username,
    );
    if (existingUsername)
      throw new ConflictException('Username already in use');

    const hashedPassword = await bcrypt.hash(signupInput.password, 10);

    const user = await this.usersService.create({
      ...signupInput,
      password: hashedPassword,
    });

    const payload = { sub: user.id, email: user.email };

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        expiresIn: '15m',
      }),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
      }),
      user,
    };
  }

  async signIn(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string; user: User }> {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException();

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException();

    const payload = { sub: user.id, email: user.email };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      refreshToken: await this.jwtService.signAsync(payload),
      user,
    };
  }

  async refreshToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync<{
        sub: string;
        email: string;
      }>(token);

      const newAccessToken = await this.jwtService.signAsync(
        { sub: payload.sub, email: payload.email },
        { expiresIn: '15m' },
      );

      return { accessToken: newAccessToken };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.findByEmail(email);

    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) throw new UnauthorizedException();

      return user;
    }

    return null;
  }
}
