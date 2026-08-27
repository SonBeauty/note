import { createHighlighter, type Highlighter } from "shiki";

/**
 * Shiki tải grammar khá nặng — khởi tạo một lần rồi tái dùng cho mọi lần convert.
 * Chỉ nạp các ngôn ngữ hay gặp; ngôn ngữ lạ sẽ render dạng plaintext.
 */
const LANGS = [
  "javascript", "typescript", "jsx", "tsx", "python", "go", "rust", "java",
  "kotlin", "swift", "c", "cpp", "csharp", "php", "ruby", "bash", "shell",
  "sql", "json", "yaml", "xml", "html", "css", "scss", "markdown", "diff",
] as const;

let instance: Promise<Highlighter> | null = null;

export function getHighlighter(): Promise<Highlighter> {
  instance ??= createHighlighter({
    themes: ["github-light", "github-dark"],
    langs: [...LANGS],
  });
  return instance;
}

export function isSupportedLang(lang: string): boolean {
  return (LANGS as readonly string[]).includes(lang);
}

/** Sinh HTML cho một khối code, có sẵn cả hai theme sáng/tối. */
export async function highlightCode(code: string, lang: string): Promise<string> {
  const highlighter = await getHighlighter();
  return highlighter.codeToHtml(code, {
    lang: isSupportedLang(lang) ? lang : "text",
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
  });
}
