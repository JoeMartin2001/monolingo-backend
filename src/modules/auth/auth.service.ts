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
import { OAuth2Client } from 'google-auth-library';
import { Auth } from './entities/auth.entity';
import { IUserAuthProvider, LanguageLevel } from 'src/interfaces/User';
import { randomUUID } from 'node:crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;

  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.googleClient = new OAuth2Client(
      this.configService.get('googleClientId'),
    );
  }

  private async signPair(user: { id: string; email: string }) {
    const payload = { sub: user.id, email: user.email };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  async googleAuth(token: string): Promise<Auth> {
    try {
      // 1. Verify the Google access token
      const ticket = await this.googleClient.verifyIdToken({
        idToken: token,
        audience: this.configService.get('googleClientId'),
      });
      const payload = ticket.getPayload();

      if (!payload || !payload.email) {
        throw new UnauthorizedException('Invalid Google token');
      }

      if (!payload?.email || !payload?.email_verified)
        throw new UnauthorizedException('Unverified Google email');

      const googleId = payload?.sub;
      const email = payload?.email;
      const name = payload.name || email.split('@')[0];
      const picture = payload.picture || '';

      // Link precedence: googleId → email
      let user = await this.usersService.findByGoogleId?.(googleId);

      if (!user) {
        user = await this.usersService.findByEmail(email);
        if (user) {
          user.authProvider = IUserAuthProvider.GOOGLE;
          user.googleId = googleId;
          user.avatarUrl = picture;

          if (!user.avatarUrl && picture) user.avatarUrl = picture;
          if (!user.username && name)
            user.username = name.replace(/\s+/g, '').toLowerCase();

          user = await this.usersService.create(user);
        } else {
          // Create new OAuth user; avoid plaintext dummy passwords
          const randomHash = await bcrypt.hash(randomUUID(), 10);

          const input: Partial<CreateUserInput> & { password: string } = {
            email,
            username: name.replace(/\s+/g, '').toLowerCase(),
            password: randomHash, // only if password is non-nullable
            nativeLanguage: 'uz', // choose sensible defaults for your app
            targetLanguage: 'en',
            level: LanguageLevel.A1, // or set a default
            bio: '',
            avatarUrl: picture,
          };

          // If your entity now allows nullable password, set password: undefined and omit this
          user = await this.usersService.create({
            ...input,
            email,
            googleId,
            authProvider: IUserAuthProvider.GOOGLE,
            avatarUrl: picture,
            username: name.replace(/\s+/g, '').toLowerCase(),
            nativeLanguage: 'uz',
            targetLanguage: 'en',
            level: LanguageLevel.A1,
            bio: '',
          });
        }
      }

      const { accessToken, refreshToken } = await this.signPair(user);

      return { accessToken, refreshToken, user };
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('Google authentication failed');
    }
  }

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

    const { accessToken, refreshToken } = await this.signPair(user);

    return {
      accessToken,
      refreshToken,
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

    const { accessToken, refreshToken } = await this.signPair(user);

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  async refreshToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync<{
        sub: string;
        email: string;
      }>(token);

      const { accessToken, refreshToken } = await this.signPair({
        id: payload.sub,
        email: payload.email,
      });

      return {
        accessToken,
        refreshToken,
        user: payload,
      };
    } catch (error) {
      console.log(error);
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
