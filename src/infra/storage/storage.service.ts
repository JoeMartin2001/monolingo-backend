import { Inject, Injectable } from '@nestjs/common';
import { S3_CLIENT, STORAGE_OPTS, type StorageOptions } from './storage.tokens';
import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  S3Client,
  HeadObjectCommand,
  CopyObjectCommand,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Readable } from 'stream';

@Injectable()
export class StorageService {
  constructor(
    @Inject(S3_CLIENT) private readonly s3: S3Client,
    @Inject(STORAGE_OPTS) private readonly opts: StorageOptions,
  ) {}

  getPublicUrl(key: string) {
    // Prefer CDN/custom domain if provided; else synthesize S3/MinIO URL (may need endpoint if you want direct).
    return this.opts.publicBaseUrl
      ? `${this.opts.publicBaseUrl}/${key}`
      : `/${key}`;
  }

  async exists(key: string) {
    try {
      await this.s3.send(
        new HeadObjectCommand({ Bucket: this.opts.bucket, Key: key }),
      );
      return true;
    } catch {
      return false;
    }
  }

  async presignPut(key: string, contentType: string, expiresIn = 900) {
    const cmd = new PutObjectCommand({
      Bucket: this.opts.bucket,
      Key: key,
      ContentType: contentType,
    });
    const url = await getSignedUrl(this.s3, cmd, { expiresIn });
    return { url, key };
  }

  async move(srcKey: string, dstKey: string) {
    // S3 "rename" = Copy then Delete
    await this.s3.send(
      new CopyObjectCommand({
        Bucket: this.opts.bucket,
        Key: dstKey,
        CopySource: `/${this.opts.bucket}/${encodeURIComponent(srcKey)}`,
      }),
    );
    await this.s3.send(
      new DeleteObjectCommand({ Bucket: this.opts.bucket, Key: srcKey }),
    );
    return dstKey;
  }

  async presignGet(key: string, expiresIn = 900) {
    const cmd = new GetObjectCommand({ Bucket: this.opts.bucket, Key: key });
    return getSignedUrl(this.s3, cmd, { expiresIn });
  }

  async uploadStream(key: string, body: Readable, contentType?: string) {
    const uploader = new Upload({
      client: this.s3,
      params: {
        Bucket: this.opts.bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
      },
      queueSize: 4,
      partSize: 5 * 1024 * 1024,
      leavePartsOnError: false,
    });
    await uploader.done();
    return this.getPublicUrl(key);
  }

  async delete(key: string) {
    await this.s3.send(
      new DeleteObjectCommand({ Bucket: this.opts.bucket, Key: key }),
    );
  }
}
