import { DynamicModule, Module } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
import { S3_CLIENT, STORAGE_OPTS, type StorageOptions } from './storage.tokens';
import { ConfigService } from '@nestjs/config';

@Module({})
export class StorageModule {
  static forRoot(opts?: {
    endpoint: string; // e.g. http://minio:9000
    region?: string;
    accessKeyId: string;
    secretAccessKey: string;
    forcePathStyle?: boolean; // true for MinIO/B2
    bucket: string;
    publicBaseUrl?: string;
  }): DynamicModule {
    const s3Provider = {
      provide: S3_CLIENT,
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        new S3Client({
          region: opts?.region ?? config.get('s3Region') ?? '',
          endpoint: opts?.endpoint ?? config.get('s3Endpoint') ?? '',
          credentials: {
            accessKeyId: opts?.accessKeyId ?? config.get('s3Key') ?? '',
            secretAccessKey:
              opts?.secretAccessKey ?? config.get('s3Secret') ?? '',
          },
          forcePathStyle:
            opts?.forcePathStyle ?? config.get('s3ForcePathStyle') ?? false,
        }),
    };

    const optionsProvider = {
      provide: STORAGE_OPTS,
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        ({
          bucket: opts?.bucket ?? config.get('s3Bucket') ?? '',
          publicBaseUrl:
            opts?.publicBaseUrl ?? config.get('s3PublicBaseUrl') ?? '',
        }) as StorageOptions,
    };

    return {
      module: StorageModule,
      providers: [s3Provider, optionsProvider],
      exports: [s3Provider, optionsProvider],
    };
  }
}
