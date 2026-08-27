import { writeFileSync } from "node:fs";
import { Document, Packer, Paragraph, HeadingLevel, Table, TableRow, TableCell, TextRun, ImageRun } from "docx";
import { PDFDocument, StandardFonts } from "pdf-lib";

const dir = "tests/fixtures";

// --- 1x1 PNG đỏ, dùng cho cả fixture ảnh lẫn ảnh nhúng trong docx ---
const png = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);
writeFileSync(`${dir}/sample-image.png`, png);

// --- docx có heading, đậm/nghiêng, danh sách, bảng, ảnh ---
const doc = new Document({
  sections: [{
    children: [
      new Paragraph({ text: "Hợp đồng thuê nhà", heading: HeadingLevel.HEADING_1 }),
      new Paragraph({ children: [
        new TextRun("Bên A cho "),
        new TextRun({ text: "Bên B", bold: true }),
        new TextRun(" thuê căn hộ với giá "),
        new TextRun({ text: "8 triệu đồng", italics: true }),
        new TextRun(" mỗi tháng."),
      ]}),
      new Paragraph({ text: "Điều khoản", heading: HeadingLevel.HEADING_2 }),
      new Paragraph({ text: "Thanh toán trước ngày 5", bullet: { level: 0 } }),
      new Paragraph({ text: "Đặt cọc 2 tháng", bullet: { level: 0 } }),
      new Table({ rows: [
        new TableRow({ children: [
          new TableCell({ children: [new Paragraph("Khoản mục")] }),
          new TableCell({ children: [new Paragraph("Số tiền")] }),
        ]}),
        new TableRow({ children: [
          new TableCell({ children: [new Paragraph("Tiền thuê")] }),
          new TableCell({ children: [new Paragraph("8.000.000")] }),
        ]}),
      ]}),
      new Paragraph({ children: [new ImageRun({
        data: png, type: "png", transformation: { width: 40, height: 40 },
      })]}),
    ],
  }],
});
writeFileSync(`${dir}/sample-contract.docx`, await Packer.toBuffer(doc));

// --- PDF có lớp text, nhiều trang ---
const pdf = await PDFDocument.create();
const font = await pdf.embedFont(StandardFonts.Helvetica);
for (let i = 1; i <= 3; i++) {
  const page = pdf.addPage([595, 842]);
  page.drawText(`Page ${i} - Rental agreement summary`, { x: 50, y: 780, size: 18, font });
  page.drawText(`Monthly rent is 8 million VND. Deposit equals two months.`, { x: 50, y: 740, size: 12, font });
}
writeFileSync(`${dir}/sample-text.pdf`, await pdf.save());

// --- PDF không có lớp text (giả lập bản scan) ---
const scan = await PDFDocument.create();
const embedded = await scan.embedPng(png);
const sp = scan.addPage([595, 842]);
sp.drawImage(embedded, { x: 0, y: 0, width: 595, height: 842 });
writeFileSync(`${dir}/sample-scanned.pdf`, await scan.save());

// --- markdown có code, bảng, link ---
writeFileSync(`${dir}/sample-notes.md`, `# Ghi chú dự án

Nội dung **in đậm** và *in nghiêng*, có [liên kết](https://example.com).

## Bảng chi phí

| Khoản | Số tiền |
|---|---|
| Thuê nhà | 8.000.000 |
| Điện nước | 500.000 |

## Mã nguồn

\`\`\`typescript
function tinhTong(a: number, b: number): number {
  return a + b;
}
\`\`\`

- [ ] Việc chưa xong
- [x] Việc đã xong
`);

// --- file code ---
writeFileSync(`${dir}/sample-code.ts`, `export function chao(ten: string): string {\n  return \`Xin chào \${ten}\`;\n}\n`);

// --- JSON ---
writeFileSync(`${dir}/sample-data.json`, '{"ten":"Hợp đồng","gia":8000000,"dieuKhoan":["đặt cọc","thanh toán"]}');

// --- CSV ---
writeFileSync(`${dir}/sample-table.csv`, "Khoản mục,Số tiền\nTiền thuê,8000000\nĐiện nước,500000\n");

// --- HTML độc hại ---
writeFileSync(`${dir}/malicious.html`, '<h1>Tiêu đề</h1><script>alert("xss")</script><img src=x onerror="alert(1)"><p style="background:url(http://evil.com/track)">theo dõi</p><p>nội dung an toàn</p>');

// --- file nhị phân không nhận dạng được ---
const bin = Buffer.alloc(2048);
for (let i = 0; i < bin.length; i++) bin[i] = (i * 7) % 256;
writeFileSync(`${dir}/random-binary.bin`, bin);

console.log("fixtures đã tạo xong");
