import { createReadStream } from "node:fs";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import type { StorageAdapter, StoredObject } from "./storage-adapter";

/** Lưu file ra đĩa. Chỉ dùng cho dev — serverless không giữ được đĩa. */
export class LocalStorage implements StorageAdapter {
  constructor(private readonly root: string) {}

  private resolve(key: string): string {
    // key do server sinh bằng cuid nên vốn đã an toàn, nhưng vẫn chặn path
    // traversal một lần nữa phòng khi có đường gọi khác lọt vào sau này.
    const root = path.resolve(this.root);
    const full = path.resolve(root, path.normalize(key));
    if (full !== root && !full.startsWith(root + path.sep)) {
      throw new Error("Đường dẫn lưu trữ không hợp lệ");
    }
    return full;
  }

  async put(key: string, body: Buffer, _contentType: string): Promise<void> {
    const full = this.resolve(key);
    await mkdir(path.dirname(full), { recursive: true });
    await writeFile(full, body);
  }

  async get(key: string): Promise<StoredObject> {
    const full = this.resolve(key);
    const chunks: Buffer[] = [];
    for await (const chunk of createReadStream(full)) {
      chunks.push(chunk as Buffer);
    }
    return { body: Buffer.concat(chunks), contentType: "application/octet-stream" };
  }

  async delete(key: string): Promise<void> {
    await unlink(this.resolve(key)).catch(() => {
      // Xoá file không tồn tại không phải lỗi — mục tiêu là "file không còn đó".
    });
  }
}
