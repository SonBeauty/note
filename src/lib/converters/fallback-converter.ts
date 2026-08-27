import { sanitizeHtml } from "./sanitize-html";
import type { ConversionResult, ConvertMeta } from "./types";

const HEX_PREVIEW_BYTES = 512;
const TEXT_PREVIEW_LIMIT = 200_000;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Tỉ lệ byte đọc được dưới dạng văn bản. Dùng để đoán file có phải text không. */
function printableRatio(buffer: Buffer): number {
  const sample = buffer.subarray(0, 4096);
  if (sample.length === 0) return 0;

  let printable = 0;
  for (const byte of sample) {
    // tab, LF, CR, và dải ASCII in được; byte >= 0x80 coi là hợp lệ (UTF-8 nhiều byte)
    if (byte === 9 || byte === 10 || byte === 13 || (byte >= 32 && byte < 127) || byte >= 128) {
      printable++;
    }
  }
  return printable / sample.length;
}

function toHexDump(buffer: Buffer): string {
  const slice = buffer.subarray(0, HEX_PREVIEW_BYTES);
  const lines: string[] = [];

  for (let i = 0; i < slice.length; i += 16) {
    const chunk = slice.subarray(i, i + 16);
    const offset = i.toString(16).padStart(8, "0");
    const hex = Array.from(chunk)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join(" ")
      .padEnd(47, " ");
    const ascii = Array.from(chunk)
      .map((b) => (b >= 32 && b < 127 ? String.fromCharCode(b) : "."))
      .join("");
    lines.push(`${offset}  ${hex}  ${ascii}`);
  }

  return lines.join("\n");
}

/**
 * Tầng cuối cùng của thác đổ — KHÔNG BAO GIỜ được ném lỗi.
 *
 * Đây là thứ đảm bảo lời hứa "bấm vào là đọc được bất kể file gì":
 * decode được thành text thì hiện text, không thì hiện hex dump.
 * Màn hình trắng là thất bại của tính năng, không phải lỗi phụ.
 */
export function convertFallback(
  buffer: Buffer,
  meta: ConvertMeta,
): ConversionResult & { looksLikeText: boolean } {
  const looksLikeText = printableRatio(buffer) > 0.9;

  if (looksLikeText) {
    const text = buffer.toString("utf8").slice(0, TEXT_PREVIEW_LIMIT);
    return {
      html: sanitizeHtml(`<pre><code>${escapeHtml(text)}</code></pre>`),
      text,
      looksLikeText: true,
    };
  }

  const dump = toHexDump(buffer);
  const sizeKb = (buffer.length / 1024).toFixed(1);
  const html = sanitizeHtml(
    `<p>Không đọc được nội dung của <strong>${escapeHtml(meta.fileName)}</strong> ` +
      `(${sizeKb} KB). Dưới đây là ${HEX_PREVIEW_BYTES} byte đầu tiên — ` +
      `bạn vẫn tải được file gốc.</p>` +
      `<pre><code>${escapeHtml(dump)}</code></pre>`,
  );

  return { html, text: meta.fileName, looksLikeText: false };
}
