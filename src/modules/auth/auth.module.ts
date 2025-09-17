import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { User } from '../user/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { UserService } from '../user/user.service';
import { EmailModule } from '../email/email.module';
import { PasswordResetToken } from './entities/password-reset-token.entity';
import { EmailService } from '../email/email.service';
import { EmailVerificationToken } from './entities/email-verification-token.entity';

@Module({
  providers: [
    AuthResolver,
    AuthService,
    JwtStrategy,
    LocalStrategy,
    EmailService,
    UserService,
  ],
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([
      User,
      PasswordResetToken,
      EmailVerificationToken,
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),

    UserModule,
    EmailModule,
  ],
  exports: [AuthService],
})
export class AuthModule {}
