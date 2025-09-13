import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import appConfig from 'src/config/app.config';
import databaseConfig from 'src/config/database.config';
import { validate } from 'src/config/env.validation';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      validate,
      load: [appConfig, databaseConfig],
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
    }),
  ],
})
export class ConfigModule {}
