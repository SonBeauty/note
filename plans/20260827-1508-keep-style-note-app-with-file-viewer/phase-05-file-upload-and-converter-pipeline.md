# Phase 05 — File Upload & Converter Pipeline

**Context:** [plan.md](plan.md) · [Phase 04](phase-04-note-crud-api-and-search.md)

## Overview
- **Priority:** P0 — đây là tính năng khác biệt chính so với Google Keep
- **Status:** ⬜ Not started
- Upload file vào note, convert sang HTML đọc được, cache lại, và trích text cho search.

## Key Insights
- **Nguyên tắc thác đổ:** trình đọc chuyên dụng → text thô → hex + tải về.
  Rơi xuống tầng nào cũng phải ra được thứ đọc được. **Không bao giờ màn hình trắng** —
  đây là yêu cầu cốt lõi của tính năng, không phải chuyện xử lý lỗi phụ.
- Convert **một lần lúc upload**, lưu HTML vào DB. Mở note sau đó là đọc cache,
  không parse lại, không tải thư viện nặng về client.
- `mammoth` và `pdfjs-dist` chỉ chạy ở Node runtime. Route phải `runtime = 'nodejs'`,
  và `pdfjs-dist` cần import bản `legacy/build/pdf.mjs` với `standardFontDataUrl`.
- Ảnh trong `.docx` là base64 nhúng thẳng vào HTML. File Word nhiều ảnh sẽ phình rất to →
  mammoth `convertImage` phải tách ảnh ra storage thay vì nhúng, nếu ảnh > 100KB.
- Sanitize là **bắt buộc, không có ngoại lệ**. HTML từ docx và html upload đều là
  nội dung không tin cậy.

## Requirements
**Functional**
- Upload qua nút chọn file, kéo thả vào note, hoặc dán ảnh từ clipboard.
- Định dạng giai đoạn 1: `.md` `.txt` · `.docx` · `.pdf` · ảnh · file code ·
  `.json`/`.yaml`/`.xml` · `.html`
- Định dạng ngoài danh sách → thử decode UTF-8; ra text thì hiện text,
  không thì hiện hex preview 512 byte đầu + nút tải về, `status = 'unsupported'`.
- Xoá attachment khỏi note, xoá luôn file trên storage.
- Tải về file gốc nguyên vẹn.

**Non-functional**
- Trần 25MB/file, 100MB tổng mỗi note.
- Convert xong dưới 5s cho file 50 trang.
- HTML sau sanitize không còn `<script>`, `on*=`, `javascript:`.

## Architecture
```
src/lib/storage/
├── storage-adapter.ts       # interface: put, get, delete, signedUrl
├── local-storage.ts         # dev — ghi vào ./storage/
└── s3-storage.ts            # prod — R2/S3

src/lib/converters/
├── convert-file.ts          # điều phối: detect kind → gọi converter → sanitize
├── detect-file-kind.ts      # dựa magic bytes + extension, KHÔNG tin mime client gửi
├── markdown-converter.ts    # markdown-it + shiki + KaTeX
├── docx-converter.ts        # mammoth
├── pdf-converter.ts         # pdfjs-dist → text theo trang
├── code-converter.ts        # shiki
├── data-converter.ts        # json/yaml/xml pretty-print
├── image-converter.ts       # thẻ <img> trỏ signed URL
├── fallback-converter.ts    # text thô → hex preview
└── sanitize-html.ts         # isomorphic-dompurify, allowlist chặt

src/app/api/notes/[id]/attachments/route.ts        # POST upload
src/app/api/attachments/[id]/route.ts              # DELETE
src/app/api/attachments/[id]/download/route.ts     # GET file gốc
```

Luồng upload:
```
POST multipart → requireUser() → kiểm tra note thuộc user
  → kiểm tra size + số lượng
  → đọc magic bytes, xác định kind thật (không tin mime client)
  → lưu file gốc lên storage
  → tạo Attachment status='pending', trả response ngay
  → convert (cùng request, có timeout 30s)
      → thành công: renderedHtml + extractedText, status='ready'
      → thất bại:  chạy fallbackConverter, status='unsupported' | 'failed'
  → rebuildSearchableText(noteId)
```

## Related Code Files
**Create:** toàn bộ file trong sơ đồ trên
**Modify:** `src/lib/notes/rebuild-searchable-text.ts`, `prisma/schema.prisma` (nếu cần)

## Implementation Steps
1. `npm i mammoth pdfjs-dist markdown-it shiki isomorphic-dompurify js-yaml @aws-sdk/client-s3`
2. Viết `storage-adapter.ts` interface + hai bản cài đặt, chọn theo `STORAGE_DRIVER`.
3. Viết `detect-file-kind.ts` — đọc 8 byte đầu (`PK` = zip/docx, `%PDF`, magic ảnh),
   kết hợp extension. Mime từ client chỉ dùng làm gợi ý cuối cùng.
4. Viết `sanitize-html.ts` **trước** mọi converter — allowlist thẻ và thuộc tính,
   cấm `style` có `url()`, ép `target="_blank" rel="noopener noreferrer"` cho link.
5. Viết từng converter, mỗi file dưới 200 dòng, cùng chung interface
   `(buffer, meta) => { html, text }`.
6. Viết `convert-file.ts` điều phối, bọc try/catch từng tầng, luôn có fallback.
7. Viết 3 route handler upload/delete/download, tất cả `runtime = 'nodejs'`.
8. Gọi `rebuildSearchableText()` sau khi convert xong.
9. Test thủ công với: 1 file docx có ảnh và bảng, 1 PDF 50 trang, 1 file `.md` có code
   và công thức, 1 ảnh PNG, 1 file `.zip` (để kiểm chứng nhánh fallback).

## Todo List
- [ ] Storage adapter (local + S3)
- [ ] `detect-file-kind.ts` theo magic bytes
- [ ] `sanitize-html.ts` với allowlist chặt
- [ ] Converter: markdown, docx, pdf, code, data, image, fallback
- [ ] `convert-file.ts` điều phối có thác đổ
- [ ] Route upload / delete / download
- [ ] Nối vào `rebuildSearchableText()`
- [ ] Kéo thả + dán clipboard ở client (làm cùng Phase 06)
- [ ] Test đủ 5 loại file mẫu, gồm cả file rác

## Success Criteria
- Upload `.docx` có bảng và ảnh → bấm vào đọc được, giữ đúng heading và bảng.
- Upload PDF 50 trang → đọc được, chia trang rõ ràng.
- Upload file `.zip` → **không lỗi**, hiện hex preview và nút tải về.
- Search từ khoá chỉ nằm bên trong file Word → tìm ra note đó.
- Thử upload HTML có `<script>alert(1)</script>` → render ra không chạy script.

## Risk Assessment
| Rủi ro | Giảm thiểu |
|---|---|
| Convert lâu làm timeout request | Trần 25MB + timeout 30s, quá thì `status='failed'` kèm lý do rõ |
| `pdfjs-dist` lỗi worker ở server | Dùng bản legacy, tắt worker, đặt `standardFontDataUrl` |
| docx nhiều ảnh làm phình DB | `convertImage` đẩy ảnh > 100KB lên storage, HTML chỉ giữ URL |
| Serverless không giữ được file tạm | Xử lý hoàn toàn trong buffer, không ghi disk tạm |

## Security Considerations
- **Không tin mime type client gửi** — luôn xác định lại bằng magic bytes.
- Sanitize mọi HTML sinh ra, kể cả từ `.docx` (docx nhúng được HTML qua `altChunk`).
- `storageKey` sinh bằng cuid, **không dùng tên file gốc** — chặn path traversal.
- File tải về phải kiểm tra quyền sở hữu qua note; signed URL hết hạn sau 15 phút.
- Đặt `Content-Disposition: attachment` và `X-Content-Type-Options: nosniff`
  cho route download, tránh XSS qua file HTML upload lên.
- Zip bomb: `.docx` là zip — giới hạn tỉ lệ giải nén, từ chối nếu vượt 100×.

## Next Steps
→ [Phase 06 — Keep-style UI](phase-06-keep-style-ui.md)
