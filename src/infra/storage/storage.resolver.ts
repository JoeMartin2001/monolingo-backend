import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { StorageService } from './storage.service';
import { randomUUID } from 'crypto';
import path from 'path';
import { PresignedUrl } from './dto/presigned-url.type';

@Resolver()
export class StorageResolver {
  constructor(private readonly storageService: StorageService) {}

  @Mutation(() => PresignedUrl, {
    description: 'Get presigned PUT URL for avatar',
  })
  async requestAvatarUploadUrl(
    @Args('filename') filename: string,
    @Args('mime') mime: string,
  ): Promise<PresignedUrl> {
    const ext = path.extname(filename).toLowerCase() || '.jpg';
    // Put new uploads in a temp area; we’ll “promote” after user is created
    const key = `tmp/avatars/${randomUUID()}${ext}`;
    const { url } = await this.storageService.presignPut(key, mime, 15 * 60);
    // Return {url,key} if you prefer; here I keep it simple: URL contains the key path
    // but you should also return the key explicitly to store it client-side:
    // return JSON.stringify({ url, key });
    return { url, key };
  }
}
