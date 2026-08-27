import { highlightCode } from "./highlighter";
import { sanitizeHtml } from "./sanitize-html";
import type { Converter } from "./types";

const EXT_TO_LANG: Record<string, string> = {
  js: "javascript", mjs: "javascript", cjs: "javascript", jsx: "jsx",
  ts: "typescript", tsx: "tsx", py: "python", rb: "ruby", go: "go",
  rs: "rust", java: "java", kt: "kotlin", swift: "swift", c: "c", h: "c",
  cpp: "cpp", hpp: "cpp", cs: "csharp", php: "php", sh: "bash",
  bash: "bash", zsh: "bash", ps1: "shell", sql: "sql", css: "css",
  scss: "scss", less: "css", dart: "dart", lua: "lua", r: "r", pl: "perl",
};

function langOf(fileName: string): string {
  const ext = fileName.slice(fileName.lastIndexOf(".") + 1).toLowerCase();
  return EXT_TO_LANG[ext] ?? "text";
}

export const convertCode: Converter = async (buffer, meta) => {
  const source = buffer.toString("utf8");
  const html = sanitizeHtml(await highlightCode(source, langOf(meta.fileName)));
  return { html, text: source };
};
