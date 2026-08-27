import MarkdownIt from "markdown-it";
import { getHighlighter, isSupportedLang } from "./highlighter";
import { hardenExternalLinks, sanitizeHtml } from "./sanitize-html";
import type { Converter } from "./types";

/**
 * Markdown -> HTML, có tô màu code.
 *
 * html: true cho phép HTML thô trong markdown (nhiều file .md thật có dùng),
 * an toàn vì đầu ra vẫn đi qua sanitizeHtml() ở cuối.
 */
export const convertMarkdown: Converter = async (buffer) => {
  const source = buffer.toString("utf8");
  const highlighter = await getHighlighter();

  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    breaks: false,
    // codeToHtml đồng bộ sau khi highlighter đã khởi tạo xong.
    highlight: (code, lang) => {
      try {
        return highlighter.codeToHtml(code, {
          lang: lang && isSupportedLang(lang) ? lang : "text",
          themes: { light: "github-light", dark: "github-dark" },
          defaultColor: false,
        });
      } catch {
        return ""; // để markdown-it tự escape theo cách mặc định
      }
    },
  });

  const rendered = md.render(source);
  const html = hardenExternalLinks(sanitizeHtml(rendered));

  // Text cho search lấy từ markdown gốc — vốn đã gần như là plain text,
  // và giữ được cả nội dung trong khối code.
  return { html, text: source };
};
