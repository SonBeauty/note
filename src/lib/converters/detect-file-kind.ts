import type { AttachmentKind } from "@/types/note";

/**
 * Nhận dạng loại file.
 *
 * KHÔNG TIN mimeType client gửi lên — nó do trình duyệt (hoặc kẻ tấn công) khai báo.
 * Ưu tiên magic bytes, sau đó tới đuôi file, mime chỉ là gợi ý cuối cùng.
 */

const CODE_EXTENSIONS = new Set([
  "js", "jsx", "ts", "tsx", "mjs", "cjs", "py", "rb", "go", "rs", "java", "kt",
  "swift", "c", "h", "cpp", "hpp", "cs", "php", "sh", "bash", "zsh", "ps1",
  "sql", "css", "scss", "less", "vue", "svelte", "dart", "lua", "r", "pl",
]);

const DATA_EXTENSIONS = new Set(["json", "yaml", "yml", "xml", "toml", "csv", "tsv"]);
const TEXT_EXTENSIONS = new Set(["txt", "log", "env", "ini", "conf", "gitignore"]);
const MARKDOWN_EXTENSIONS = new Set(["md", "markdown", "mdx"]);
const HTML_EXTENSIONS = new Set(["html", "htm"]);

function extensionOf(fileName: string): string {
  const dot = fileName.lastIndexOf(".");
  return dot === -1 ? "" : fileName.slice(dot + 1).toLowerCase();
}

function startsWith(buffer: Buffer, bytes: number[]): boolean {
  if (buffer.length < bytes.length) return false;
  return bytes.every((b, i) => buffer[i] === b);
}

/** true nếu buffer là zip — .docx, .xlsx, .pptx đều là zip. */
function isZip(buffer: Buffer): boolean {
  return startsWith(buffer, [0x50, 0x4b]); // "PK"
}

export function detectFileKind(
  buffer: Buffer,
  fileName: string,
  mimeType: string,
): AttachmentKind {
  const ext = extensionOf(fileName);

  // --- Tầng 1: magic bytes, đáng tin nhất ---
  if (startsWith(buffer, [0x25, 0x50, 0x44, 0x46])) return "pdf"; // %PDF
  if (startsWith(buffer, [0x89, 0x50, 0x4e, 0x47])) return "image"; // PNG
  if (startsWith(buffer, [0xff, 0xd8, 0xff])) return "image"; // JPEG
  if (startsWith(buffer, [0x47, 0x49, 0x46, 0x38])) return "image"; // GIF8
  if (startsWith(buffer, [0x42, 0x4d])) return "image"; // BMP
  if (
    startsWith(buffer, [0x52, 0x49, 0x46, 0x46]) &&
    buffer.length > 11 &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return "image";
  }

  // Zip: chỉ coi là docx khi đuôi file cũng nói vậy.
  // Một file .zip thường sẽ rơi xuống fallback, đúng như mong muốn.
  if (isZip(buffer)) {
    return ext === "docx" ? "docx" : "unknown";
  }

  // --- Tầng 2: đuôi file ---
  if (MARKDOWN_EXTENSIONS.has(ext)) return "markdown";
  if (HTML_EXTENSIONS.has(ext)) return "html";
  if (CODE_EXTENSIONS.has(ext)) return "code";
  if (DATA_EXTENSIONS.has(ext)) return "data";
  if (TEXT_EXTENSIONS.has(ext)) return "text";
  if (ext === "svg") return "image";

  // --- Tầng 3: mime của client, chỉ dùng khi hai tầng trên bó tay ---
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType === "text/markdown") return "markdown";
  if (mimeType === "text/html") return "html";
  if (mimeType.startsWith("text/")) return "text";

  return "unknown";
}
