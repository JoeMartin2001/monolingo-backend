import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsString,
  IsBooleanString,
  IsOptional,
  Max,
  Min,
  validateSync,
} from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
  Provision = 'provision',
}

class EnvironmentVariables {
  // ───── Core App Config ─────
  @IsEnum(Environment)
  NODE_ENV!: Environment;

  @IsNumber()
  @Min(0)
  @Max(65535)
  PORT!: number;

  @IsString()
  FRONTEND_URL!: string;

  // ───── Security ─────
  @IsString()
  JWT_SECRET!: string;

  @IsString()
  JWT_EXPIRES_IN!: string; // e.g. "1d", "3600s"

  // ───── Database ─────
  @IsString()
  DB_HOST!: string;

  @IsNumber()
  DB_PORT!: number;

  @IsString()
  DB_USER!: string;

  @IsString()
  DB_PASSWORD!: string;

  @IsString()
  DB_NAME!: string;

  @IsBooleanString()
  DB_SSL!: string; // "true" | "false"

  // ───── AI Provider (optional) ─────
  @IsOptional()
  @IsString()
  OPENAI_API_KEY!: string;

  // ───── Google ─────
  @IsString()
  GOOGLE_CLIENT_ID!: string;

  @IsString()
  GOOGLE_CLIENT_SECRET!: string;

  @IsString()
  GOOGLE_REDIRECT_URL!: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true, // converts strings → numbers/booleans
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false, // fail if anything required is missing
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
