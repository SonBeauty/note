// Bản ESM của js-yaml chỉ có named export — default import sẽ hỏng khi build.
import { dump as yamlDump, load as yamlLoad } from "js-yaml";
import { highlightCode } from "./highlighter";
import { sanitizeHtml } from "./sanitize-html";
import type { Converter } from "./types";

function extensionOf(fileName: string): string {
  return fileName.slice(fileName.lastIndexOf(".") + 1).toLowerCase();
}

/** CSV/TSV -> bảng HTML. Parser tối giản, đủ cho file thường gặp. */
function csvToTable(source: string, delimiter: string): string {
  const rows = source
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0)
    .slice(0, 2000) // trần dòng để file khổng lồ không treo trình duyệt
    .map((line) => line.split(delimiter));

  if (rows.length === 0) return "<p>File rỗng</p>";

  const [header, ...body] = rows;
  const th = header.map((c) => `<th>${escapeHtml(c)}</th>`).join("");
  const trs = body
    .map((r) => `<tr>${r.map((c) => `<td>${escapeHtml(c)}</td>`).join("")}</tr>`)
    .join("");

  return `<table><thead><tr>${th}</tr></thead><tbody>${trs}</tbody></table>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export const convertData: Converter = async (buffer, meta) => {
  const source = buffer.toString("utf8");
  const ext = extensionOf(meta.fileName);

  if (ext === "csv") {
    return { html: sanitizeHtml(csvToTable(source, ",")), text: source };
  }
  if (ext === "tsv") {
    return { html: sanitizeHtml(csvToTable(source, "\t")), text: source };
  }

  // JSON/YAML: format lại cho dễ đọc rồi tô màu.
  let pretty = source;
  let lang = ext === "xml" ? "xml" : ext === "toml" ? "text" : "json";

  try {
    if (ext === "json") {
      pretty = JSON.stringify(JSON.parse(source), null, 2);
    } else if (ext === "yaml" || ext === "yml") {
      // load rồi dump lại để chuẩn hoá thụt lề; lỗi cú pháp thì giữ nguyên bản gốc.
      pretty = yamlDump(yamlLoad(source), { indent: 2, lineWidth: 100 });
      lang = "yaml";
    }
  } catch {
    // File hỏng cú pháp vẫn phải đọc được — giữ nguyên nội dung thô.
    pretty = source;
  }

  const html = sanitizeHtml(await highlightCode(pretty, lang));
  return { html, text: source };
};
