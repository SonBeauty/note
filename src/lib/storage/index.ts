import { LocalStorage } from "./local-storage";
import { S3Storage } from "./s3-storage";
import type { StorageAdapter } from "./storage-adapter";

let cached: StorageAdapter | null = null;

/** Chọn nơi lưu file theo STORAGE_DRIVER. Khởi tạo một lần rồi tái dùng. */
export function getStorage(): StorageAdapter {
  if (cached) return cached;

  if (process.env.STORAGE_DRIVER === "s3") {
    const bucket = process.env.S3_BUCKET;
    const accessKeyId = process.env.S3_ACCESS_KEY_ID;
    const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;

    if (!bucket || !accessKeyId || !secretAccessKey) {
      throw new Error("STORAGE_DRIVER=s3 nhưng thiếu S3_BUCKET / khoá truy cập");
    }

    cached = new S3Storage(bucket, {
      endpoint: process.env.S3_ENDPOINT || undefined,
      region: process.env.S3_REGION ?? "auto",
      accessKeyId,
      secretAccessKey,
    });
  } else {
    cached = new LocalStorage(process.env.LOCAL_STORAGE_DIR ?? "./storage");
  }

  return cached;
}

export type { StorageAdapter } from "./storage-adapter";
