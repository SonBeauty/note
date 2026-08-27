/**
 * Header bắt buộc cho MỌI response trả file người dùng upload.
 *
 * nosniff chặn trình duyệt tự đoán kiểu nội dung — không có nó, một file .txt
 * chứa HTML có thể bị render thành trang web và chạy script trên origin của app.
 */
export function fileSecurityHeaders(): Record<string, string> {
  return {
    "X-Content-Type-Options": "nosniff",
    "Content-Security-Policy": "default-src 'none'; img-src 'self'; sandbox",
    "Cache-Control": "private, max-age=300",
  };
}

/**
 * Content-Disposition có tên file tiếng Việt.
 * Header HTTP chỉ chịu được ASCII nên phải kèm biến thể filename* theo RFC 5987.
 */
export function contentDisposition(type: "inline" | "attachment", fileName: string): string {
  const asciiFallback = fileName.replace(/[^\x20-\x7e]/g, "_").replace(/"/g, "");
  const encoded = encodeURIComponent(fileName);
  return `${type}; filename="${asciiFallback}"; filename*=UTF-8''${encoded}`;
}
