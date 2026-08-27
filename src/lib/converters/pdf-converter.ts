import path from "node:path";
import { pathToFileURL } from "node:url";
import { sanitizeHtml } from "./sanitize-html";
import type { Converter } from "./types";

/** Trần số trang để PDF vài nghìn trang không treo request. */
const MAX_PAGES = 300;

/** Chênh lệch toạ độ y đủ để coi là sang dòng mới. */
const LINE_BREAK_THRESHOLD = 1;

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

type TextLikeItem = { str: string; hasEOL?: boolean; transform?: number[] };

/**
 * Ghép các mảnh text của một trang thành từng dòng.
 *
 * pdfjs trả về nhiều mảnh rời rạc. Nối thẳng bằng "" sẽ dính chữ cuối dòng này
 * vào chữ đầu dòng sau ("summaryMonthly"), khiến full-text search tách token sai
 * và không tìm ra. Nên phải ngắt dòng theo hasEOL hoặc theo thay đổi toạ độ y.
 */
function itemsToLines(items: unknown[]): string[] {
  const lines: string[] = [];
  let current = "";
  let lastY: number | null = null;

  for (const raw of items) {
    if (!raw || typeof raw !== "object" || !("str" in raw)) continue;
    const item = raw as TextLikeItem;

    const y = Array.isArray(item.transform) ? (item.transform[5] ?? null) : null;

    if (
      lastY !== null &&
      y !== null &&
      Math.abs(y - lastY) > LINE_BREAK_THRESHOLD &&
      current.length > 0
    ) {
      lines.push(current);
      current = "";
    }

    current += item.str;
    lastY = y;

    if (item.hasEOL) {
      lines.push(current);
      current = "";
    }
  }

  if (current.length > 0) lines.push(current);

  return lines.map((l) => l.replace(/[ \t]+/g, " ").trim()).filter((l) => l.length > 0);
}

/**
 * PDF -> text theo từng trang.
 *
 * Dùng bản legacy vì bản mặc định cần API trình duyệt. next.config.ts phải khai
 * pdfjs-dist trong serverExternalPackages, nếu không bundler viết lại dynamic
 * import của worker và getDocument sẽ báo "Setting up fake worker failed".
 *
 * PDF scan (ảnh chụp) không có lớp text -> trả về rỗng, và convert-file
 * sẽ chuyển sang trạng thái "unsupported" kèm lời giải thích, thay vì im lặng.
 */
export const convertPdf: Converter = async (buffer) => {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");

  // pdfjs đòi một URL kết thúc bằng dấu gạch chéo. path.join trên Windows sinh
  // backslash nên phải đổi sang file:// URL, nếu không getDocument sẽ ném lỗi.
  const standardFontDataUrl = pathToFileURL(
    path.join(process.cwd(), "node_modules", "pdfjs-dist", "standard_fonts") + path.sep,
  ).href;

  // pdfjs v6: destroy() nằm ở loading task, không phải document proxy.
  const loadingTask = pdfjs.getDocument({
    data: new Uint8Array(buffer),
    standardFontDataUrl,
    useSystemFonts: true,
    verbosity: 0,
  });
  const doc = await loadingTask.promise;

  const pageCount = Math.min(doc.numPages, MAX_PAGES);
  const pagesHtml: string[] = [];
  const pagesText: string[] = [];

  for (let i = 1; i <= pageCount; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const lines = itemsToLines(content.items);

    pagesText.push(lines.join("\n"));

    const body = lines.map((l) => `<p>${escapeHtml(l)}</p>`).join("");
    pagesHtml.push(
      `<section data-page="${i}"><h3>Trang ${i}</h3>${body || "<p><em>(trang trống)</em></p>"}</section>`,
    );

    page.cleanup();
  }

  if (doc.numPages > MAX_PAGES) {
    pagesHtml.push(
      `<p><em>Chỉ hiển thị ${MAX_PAGES} trang đầu trong tổng số ${doc.numPages} trang. Tải file gốc để xem đầy đủ.</em></p>`,
    );
  }

  await loadingTask.destroy();

  return {
    html: sanitizeHtml(pagesHtml.join("")),
    text: pagesText.join("\n\n"),
  };
};
