import { Module, Session } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { UserModule } from '../user/user.module';
import { Request } from 'express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from '../../config/database.config';
import appConfig from '../../config/app.config';
import { validate as validateConfig } from '../../config/env.validation';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateConfig,
      load: [appConfig, databaseConfig],
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres' as const,
        host: config.get<string>('database.host'),
        port: config.get<number>('database.port'),
        username: config.get<string>('database.username'),
        password: config.get<string>('database.password'),
        database: config.get<string>('database.name'),
        ssl: config.get<boolean>('database.ssl'),
        autoLoadEntities: true,
        synchronize: process.env.NODE_ENV === 'development', // use migrations instead
        logging:
          process.env.NODE_ENV === 'development'
            ? ['query', 'error', 'schema']
            : false,
        entities: [User, Session],
      }),
    }),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      graphiql: true,
      autoSchemaFile: join(process.cwd(), 'src/graphql/schema.gql'),
      sortSchema: true,
      playground: true,
      subscriptions: { 'graphql-ws': true },
      context: ({ req }: { req: Request }) => ({ req }), // attach user later
    }),

    UserModule,
    // AuthModule,
    // ChatModule,
  ],
})
export class AppModule {}
