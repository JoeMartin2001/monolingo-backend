export const S3_CLIENT = Symbol('S3_CLIENT');
export const S3_SIGNER = Symbol('S3_SIGNER');
export const STORAGE_OPTS = Symbol('STORAGE_OPTS');

export type StorageOptions = {
  bucket: string;
  publicBaseUrl?: string; // e.g. https://cdn.example.com (optional)
};
