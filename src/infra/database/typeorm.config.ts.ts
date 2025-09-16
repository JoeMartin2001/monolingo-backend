import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/modules/user/entities/user.entity';
import { PasswordResetToken } from 'src/modules/auth/entities/password-reset-token.entity';

export const typeOrmConfig = (config: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres' as const,
  host: config.get<string>('database.host'),
  port: config.get<number>('database.port'),
  username: config.get<string>('database.username'),
  password: config.get<string>('database.password'),
  database: config.get<string>('database.name'),
  ssl: config.get<boolean>('database.ssl'),
  autoLoadEntities: true,
  synchronize: ['development', 'local'].includes(
    config.get<string>('app.nodeEnv')!,
  ), // use migrations instead
  logging: ['development', 'local'].includes(config.get<string>('app.nodeEnv')!)
    ? ['query', 'error', 'schema']
    : false,
  entities: [User, PasswordResetToken],
});
