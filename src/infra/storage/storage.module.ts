// src/storage/storage.module.ts
import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';
import {
  S3_CLIENT,
  S3_SIGNER,
  STORAGE_OPTS,
  type StorageOptions,
} from './storage.tokens';
import { StorageService } from './storage.service';

const bool = (v: unknown, def = false) => {
  if (v === undefined) {
    return def;
  }

  if (typeof v === 'object') {
    v = JSON.stringify(v);
  }

  return ['true', '1', 'yes', 'on'].includes(String(v).toLowerCase());
};

@Global()
@Module({})
export class StorageModule {
  static forRoot(opts?: {
    endpoint?: string; // e.g. http://minio:9000 (internal)
    publicEndpoint?: string; // e.g. http://localhost:9000 (browser)
    region?: string;
    accessKeyId?: string;
    secretAccessKey?: string;
    forcePathStyle?: boolean; // true for MinIO/B2
    bucket?: string;
    publicBaseUrl?: string;
  }): DynamicModule {
    const s3Provider = {
      provide: S3_CLIENT,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const region =
          opts?.region ?? config.get<string>('app.s3Region') ?? 'us-east-1';
        const endpoint = opts?.endpoint ?? config.get<string>('app.s3Endpoint');
        const accessKeyId =
          opts?.accessKeyId ?? config.get<string>('app.s3Key');
        const secretAccessKey =
          opts?.secretAccessKey ?? config.get<string>('app.s3Secret');
        const forcePathStyle =
          opts?.forcePathStyle ??
          bool(config.get('app.s3ForcePathStyle'), true);

        if (!endpoint) throw new Error('S3_ENDPOINT is required');
        if (!accessKeyId || !secretAccessKey)
          throw new Error('app.s3Key/app.s3Secret are required');

        return new S3Client({
          region,
          endpoint,
          credentials: { accessKeyId, secretAccessKey },
          forcePathStyle,
        });
      },
    };

    const signerProvider = {
      provide: S3_SIGNER,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const region =
          opts?.region ?? config.get<string>('app.s3Region') ?? 'us-east-1';
        const endpoint =
          opts?.publicEndpoint ??
          config.get<string>('app.s3PublicEndpoint') ??
          config.get<string>('app.s3Endpoint'); // fallback
        const accessKeyId =
          opts?.accessKeyId ?? config.get<string>('app.s3Key');
        const secretAccessKey =
          opts?.secretAccessKey ?? config.get<string>('app.s3Secret');
        const forcePathStyle =
          opts?.forcePathStyle ??
          bool(config.get('app.s3ForcePathStyle'), true);

        if (!endpoint)
          throw new Error(
            'app.s3PublicEndpoint or app.s3Endpoint is required for presigning',
          );

        return new S3Client({
          region,
          endpoint,
          credentials: {
            accessKeyId: accessKeyId ?? '',
            secretAccessKey: secretAccessKey ?? '',
          },
          forcePathStyle,
        });
      },
    };

    const optionsProvider = {
      provide: STORAGE_OPTS,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const bucket = opts?.bucket ?? config.get<string>('app.s3Bucket');
        const publicBaseUrl =
          opts?.publicBaseUrl ??
          config.get<string>('app.s3PublicBaseUrl') ??
          undefined;
        if (!bucket) throw new Error('app.s3Bucket is required');
        return { bucket, publicBaseUrl } as StorageOptions;
      },
    };

    return {
      module: StorageModule,
      imports: [ConfigModule], // so ConfigService is available here
      providers: [s3Provider, signerProvider, optionsProvider, StorageService],
      exports: [s3Provider, signerProvider, optionsProvider, StorageService],
    };
  }
}
