import { Module } from '@nestjs/common';
import { ConfigModule } from 'src/infra/config/config.module';
import { DatabaseModule } from 'src/infra/database/database.module';
import { GqlModule } from 'src/infra/graphql/graphql.module';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { EmailModule } from '../email/email.module';
import { I18nModule } from 'src/infra/i18n/i18n.module';
import { AppController } from './app.controller';
import { StorageModule } from 'src/infra/storage/storage.module';

@Module({
  controllers: [AppController],
  providers: [],

  imports: [
    ConfigModule,
    DatabaseModule,
    GqlModule,
    I18nModule,
    StorageModule,

    UserModule,
    AuthModule,
    EmailModule,
  ],
})
export class AppModule {}
