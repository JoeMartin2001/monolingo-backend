import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'src/infra/database/database.module';
import { GqlModule } from 'src/infra/graphql/graphql.module';

@Module({
  imports: [ConfigModule, DatabaseModule, GqlModule],
})
export class AppModule {}
