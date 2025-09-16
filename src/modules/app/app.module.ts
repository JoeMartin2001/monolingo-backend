import { Module } from '@nestjs/common';
import { ConfigModule } from 'src/infra/config/config.module';
import { DatabaseModule } from 'src/infra/database/database.module';
import { GqlModule } from 'src/infra/graphql/graphql.module';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    GqlModule,
    UserModule,
    AuthModule,
    EmailModule,
  ],
})
export class AppModule {}
