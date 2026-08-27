import { readFileSync } from "node:fs";
import { beforeAll, describe, expect, it } from "vitest";
import { convertFile } from "@/lib/converters/convert-file";

beforeAll(() => {
  process.env.STORAGE_DRIVER = "local";
  process.env.LOCAL_STORAGE_DIR = "./storage";
});

const fixture = (name: string) => readFileSync(`tests/fixtures/${name}`);
const convert = (name: string, mimeType: string, id = "att_test") =>
  convertFile(fixture(name), { fileName: name, mimeType, attachmentId: id });

const DOCX_MIME =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

describe("nhận dạng và trạng thái", () => {
  it.each([
    ["sample-notes.md", "text/markdown", "markdown", "ready"],
    ["sample-contract.docx", DOCX_MIME, "docx", "ready"],
    ["sample-text.pdf", "application/pdf", "pdf", "ready"],
    ["sample-image.png", "image/png", "image", "ready"],
    ["sample-code.ts", "text/plain", "code", "ready"],
    ["sample-data.json", "application/json", "data", "ready"],
    ["sample-table.csv", "text/csv", "data", "ready"],
    ["malicious.html", "text/html", "html", "ready"],
  ])("%s -> kind=%s status=%s", async (file, mime, kind, status) => {
    const r = await convert(file, mime);
    expect(r.kind).toBe(kind);
    expect(r.status).toBe(status);
    expect(r.html.length).toBeGreaterThan(0);
  });
});

describe("thác đổ — không bao giờ màn hình trắng", () => {
  it("file nhị phân lạ vẫn ra hex dump, không ném lỗi", async () => {
    const r = await convert("random-binary.bin", "application/octet-stream");
    expect(r.status).toBe("unsupported");
    expect(r.html).toContain("00000000");
    expect(r.html.length).toBeGreaterThan(100);
  });

  it("PDF scan báo rõ là cần OCR thay vì trang trắng", async () => {
    const r = await convert("sample-scanned.pdf", "application/pdf");
    expect(r.status).toBe("unsupported");
    expect(r.errorMessage).toContain("OCR");
    expect(r.html).toContain("scan");
  });

  it("mime type client khai man không đánh lừa được", async () => {
    // Khai là ảnh, thực chất là PDF -> magic bytes phải thắng.
    const r = await convert("sample-text.pdf", "image/png");
    expect(r.kind).toBe("pdf");
  });
});

describe("docx", () => {
  it("giữ heading, in đậm, bảng và trích được text tiếng Việt", async () => {
    const r = await convert("sample-contract.docx", DOCX_MIME, "att_docx");
    expect(r.html).toContain("<h1>Hợp đồng thuê nhà</h1>");
    expect(r.html).toContain("<strong>Bên B</strong>");
    expect(r.html).toContain("<table>");
    expect(r.html).toContain("8.000.000");
    expect(r.text).toContain("Hợp đồng thuê nhà");
  });

  it("tách ảnh ra storage thay vì nhúng base64 làm phình DB", async () => {
    const r = await convert("sample-contract.docx", DOCX_MIME, "att_docx");
    expect(r.html).toContain("/api/attachments/att_docx/asset/");
    expect(r.html).not.toContain("base64");
  });
});

describe("pdf", () => {
  it("chia trang và trích được text", async () => {
    const r = await convert("sample-text.pdf", "application/pdf");
    expect(r.html).toContain('data-page="1"');
    expect(r.html).toContain('data-page="3"');
    expect(r.text).toContain("Monthly rent");
  });
});

describe("markdown", () => {
  it("render bảng, tô màu code, chặn link ngoài", async () => {
    const r = await convert("sample-notes.md", "text/markdown");
    expect(r.html).toContain("<table>");
    expect(r.html).toMatch(/shiki/);
    expect(r.html).toContain('rel="noopener noreferrer"');
  });
});

describe("html độc hại", () => {
  it("loại script, onerror và url() theo dõi, giữ nội dung lành", async () => {
    const r = await convert("malicious.html", "text/html");
    expect(r.html).not.toContain("<script");
    expect(r.html).not.toContain("onerror");
    expect(r.html).not.toContain("evil.com");
    expect(r.html).toContain("nội dung an toàn");
  });
});
