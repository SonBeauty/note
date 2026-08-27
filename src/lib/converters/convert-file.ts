import type { AttachmentKind } from "@/types/note";
import { convertCode } from "./code-converter";
import { convertData } from "./data-converter";
import { detectFileKind } from "./detect-file-kind";
import { convertDocx } from "./docx-converter";
import { convertFallback } from "./fallback-converter";
import { convertImage } from "./image-converter";
import { convertMarkdown } from "./markdown-converter";
import { convertPdf } from "./pdf-converter";
import { hardenExternalLinks, sanitizeHtml } from "./sanitize-html";
import type { Converter, ConvertMeta, ConvertOutcome } from "./types";

const CONVERT_TIMEOUT_MS = 30_000;

/** .html upload lên: chỉ cần sanitize, không cần parse gì thêm. */
const convertHtml: Converter = async (buffer) => {
  const source = buffer.toString("utf8");
  return {
    html: hardenExternalLinks(sanitizeHtml(source)),
    text: source.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
  };
};

const CONVERTERS: Partial<Record<AttachmentKind, Converter>> = {
  markdown: convertMarkdown,
  docx: convertDocx,
  pdf: convertPdf,
  image: convertImage,
  code: convertCode,
  data: convertData,
  html: convertHtml,
};

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Quá ${ms / 1000}s chưa xử lý xong`)), ms),
    ),
  ]);
}

/**
 * Thác đổ: trình đọc chuyên dụng -> text thô -> hex dump.
 *
 * Hàm này KHÔNG BAO GIỜ được ném lỗi. Rơi xuống tầng nào cũng phải trả về
 * thứ đọc được — màn hình trắng là thất bại của tính năng.
 */
export async function convertFile(
  buffer: Buffer,
  meta: ConvertMeta,
): Promise<ConvertOutcome> {
  const kind = detectFileKind(buffer, meta.fileName, meta.mimeType);
  const converter = CONVERTERS[kind];

  if (converter) {
    try {
      const result = await withTimeout(converter(buffer, meta), CONVERT_TIMEOUT_MS);

      // PDF scan không có lớp text: convert "thành công" nhưng rỗng.
      // Nói thẳng cho người dùng biết vì sao, thay vì hiện trang trắng.
      if (kind === "pdf" && result.text.trim().length === 0) {
        return {
          ...result,
          html:
            sanitizeHtml(
              "<p>PDF này không có lớp văn bản — nhiều khả năng là bản scan hoặc ảnh chụp. " +
                "Cần OCR mới đọc được nội dung. Bạn vẫn tải được file gốc.</p>",
            ) + result.html,
          kind,
          status: "unsupported",
          errorMessage: "PDF không có lớp văn bản (cần OCR)",
        };
      }

      return { ...result, kind, status: "ready" };
    } catch (error) {
      // Converter chuyên dụng hỏng -> vẫn cố cho người dùng đọc được gì đó.
      const message = error instanceof Error ? error.message : "Lỗi không xác định";
      console.error(`[convert] ${kind} thất bại cho ${meta.fileName}:`, error);

      const fallback = convertFallback(buffer, meta);
      return {
        ...fallback,
        kind,
        status: "failed",
        errorMessage: message,
      };
    }
  }

  // Không nhận dạng được: text thô nếu decode được, không thì hex dump.
  const fallback = convertFallback(buffer, meta);
  return {
    html: fallback.html,
    text: fallback.text,
    kind: fallback.looksLikeText ? "text" : "unknown",
    status: fallback.looksLikeText ? "ready" : "unsupported",
    ...(fallback.looksLikeText
      ? {}
      : { errorMessage: "Định dạng chưa hỗ trợ xem trực tiếp" }),
  };
}
