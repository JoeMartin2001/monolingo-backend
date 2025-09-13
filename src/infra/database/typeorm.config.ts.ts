import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/modules/user/entities/user.entity';

export const typeOrmConfig = (config: ConfigService): TypeOrmModuleOptions => ({
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
  entities: [User],
});
