import { sanitizeHtml } from "./sanitize-html";
import type { Converter } from "./types";

/**
 * Ảnh không cần convert — chỉ trỏ tới route phục vụ file gốc.
 * Không nhúng base64 vào HTML: ảnh 5MB sẽ thành ~6.7MB text nhét vào DB.
 */
export const convertImage: Converter = async (_buffer, meta) => {
  const src = `/api/attachments/${meta.attachmentId}/raw`;
  const alt = meta.fileName;

  const html = sanitizeHtml(
    `<figure><img src="${src}" alt="${alt}" /><figcaption>${alt}</figcaption></figure>`,
  );

  // Ảnh chưa OCR nên chỉ có tên file để tìm kiếm (OCR nằm ở giai đoạn 2).
  return { html, text: meta.fileName };
};
