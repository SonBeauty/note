import DOMPurify from "isomorphic-dompurify";

/**
 * Allowlist chặt cho HTML sinh ra từ file người dùng upload.
 *
 * MỌI HTML đi vào renderedHtml đều phải qua đây, không có ngoại lệ — kể cả HTML
 * do mammoth sinh từ .docx, vì .docx nhúng được HTML tuỳ ý qua altChunk.
 */
const ALLOWED_TAGS = [
  "p", "br", "hr", "div", "span", "section", "article",
  "h1", "h2", "h3", "h4", "h5", "h6",
  "strong", "b", "em", "i", "u", "s", "del", "ins", "mark", "sub", "sup", "small",
  "ul", "ol", "li", "dl", "dt", "dd",
  "blockquote", "pre", "code", "kbd", "samp",
  "table", "thead", "tbody", "tfoot", "tr", "th", "td", "caption", "colgroup", "col",
  "a", "img", "figure", "figcaption",
];

const ALLOWED_ATTR = [
  "href", "title", "alt", "src", "width", "height",
  "colspan", "rowspan", "class", "id",
  "data-page", "data-lang",
  // Shiki tô màu code bằng inline style — xem filterStyle() bên dưới.
  "style",
];

/** Thuộc tính CSS duy nhất được giữ lại. Mọi thứ khác bị bỏ. */
const SAFE_STYLE_PROPS = new Set([
  "color",
  "background-color",
  "font-weight",
  "font-style",
  "text-decoration",
  "text-align",
]);

/** Shiki dual-theme phát ra biến CSS dạng --shiki-light / --shiki-dark. */
const SHIKI_VAR_PREFIX = "--shiki";

/**
 * DOMPurify KHÔNG tự lọc nội dung thuộc tính style — đã kiểm chứng:
 * background:url(http://evil.com) lọt qua nguyên vẹn, đủ để lộ IP người đọc.
 * Nên phải tự lọc: chỉ giữ đúng vài thuộc tính màu chữ, và chặn mọi giá trị
 * có dấu ngoặc (url, expression, calc...) hoặc at-rule.
 */
function filterStyle(value: string): string {
  const kept: string[] = [];

  for (const declaration of value.split(";")) {
    const colon = declaration.indexOf(":");
    if (colon === -1) continue;

    const prop = declaration.slice(0, colon).trim().toLowerCase();
    const val = declaration.slice(colon + 1).trim();
    if (!prop || !val) continue;
    if (/[(){}@]/.test(val)) continue;
    if (/url|expression|import|javascript/i.test(val)) continue;

    if (prop.startsWith(SHIKI_VAR_PREFIX) || SAFE_STYLE_PROPS.has(prop)) {
      kept.push(`${prop}:${val}`);
    }
  }

  return kept.join(";");
}

let hookInstalled = false;

function installHooks() {
  if (hookInstalled) return;
  hookInstalled = true;

  DOMPurify.addHook("uponSanitizeAttribute", (_node, data) => {
    if (data.attrName !== "style") return;
    data.attrValue = filterStyle(data.attrValue);
    if (!data.attrValue) data.keepAttr = false;
  });
}

export function sanitizeHtml(dirty: string): string {
  installHooks();

  const clean = DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    FORBID_ATTR: ["srcset", "formaction", "form"],
    FORBID_TAGS: ["style", "script", "iframe", "object", "embed", "form", "input"],
    // Chỉ cho phép giao thức an toàn; chặn javascript: và file:
    ALLOWED_URI_REGEXP:
      /^(?:https?:|mailto:|tel:|data:image\/(?:png|jpe?g|gif|webp);base64,|[/])/i,
    ADD_ATTR: ["target", "rel"],
  });

  return String(clean);
}

/** Link ra ngoài phải mở tab mới và cắt quyền truy cập window.opener. */
export function hardenExternalLinks(html: string): string {
  return html.replace(
    /<a\s+([^>]*href="https?:[^"]*"[^>]*)>/gi,
    (_match, attrs: string) => {
      const withoutTarget = attrs.replace(/\s*(target|rel)="[^"]*"/gi, "");
      return `<a ${withoutTarget} target="_blank" rel="noopener noreferrer">`;
    },
  );
}
