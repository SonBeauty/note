export type StoredObject = {
  body: Buffer;
  contentType: string;
};

/**
 * Trừu tượng hoá nơi lưu file gốc.
 * Dev dùng đĩa local, production dùng S3/R2 — code gọi không cần biết.
 */
export interface StorageAdapter {
  put(key: string, body: Buffer, contentType: string): Promise<void>;
  get(key: string): Promise<StoredObject>;
  delete(key: string): Promise<void>;
}
