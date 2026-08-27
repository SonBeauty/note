# Keep-style Note App with Universal File Viewer

Ứng dụng ghi chú kiểu Google Keep, có đăng nhập, deploy lên web.
Note vừa gõ trực tiếp được, vừa đính kèm file và **đọc được nội dung file ngay trong app**.

## Core Concept

Một note = một thực thể duy nhất, chứa cả nội dung tự viết lẫn file đính kèm.
Search chạy trên `searchable_text` = body + text trích xuất từ tất cả attachment,
nên tìm một lần ra cả hai nguồn.

## Tech Stack

| Layer | Chọn | Lý do |
|---|---|---|
| Framework | Next.js 15 (App Router) + TypeScript | Fullstack một repo, deploy dễ |
| DB | Postgres + Prisma | FTS sẵn có, quen thuộc |
| Auth | Better Auth | Email/password + Google OAuth |
| Storage | S3-compatible (R2) qua adapter | Dev dùng local disk, prod dùng R2 |
| UI | Tailwind + shadcn/ui | Nhanh, nhất quán |
| Editor | Tiptap + markdown serialize | Gõ markdown thấy ngay, lưu dạng .md |
| Convert | mammoth, pdfjs-dist, shiki, markdown-it | Thuần JS, deploy đâu cũng chạy |

## Định dạng hỗ trợ (Giai đoạn 1)

`.md` `.txt` · `.docx` · `.pdf` (có text) · ảnh · file code · `.json`/`.yaml`/`.xml` · `.html`
Định dạng lạ → fallback text thô + nút tải về. Không bao giờ màn hình trắng.

## Phases

| # | Phase | Status |
|---|---|---|
| 01 | [Setup environment](phase-01-setup-environment.md) | ⬜ Not started |
| 02 | [Database schema](phase-02-database-schema.md) | ⬜ Not started |
| 03 | [Authentication](phase-03-authentication.md) | ⬜ Not started |
| 04 | [Note CRUD API & search](phase-04-note-crud-api-and-search.md) | ⬜ Not started |
| 05 | [File upload & converter pipeline](phase-05-file-upload-and-converter-pipeline.md) | ⬜ Not started |
| 06 | [Keep-style UI](phase-06-keep-style-ui.md) | ⬜ Not started |
| 07 | [Tests](phase-07-write-tests.md) | ⬜ Not started |

## Key Dependencies

- Phase 02 chặn 03, 04, 05 (cần schema trước)
- Phase 05 phụ thuộc 04 (attachment gắn vào note)
- Phase 06 phụ thuộc 04 + 05 (UI cần API)
- Phase 07 chạy sau cùng, nhưng test từng phase viết ngay khi xong phase đó

## Out of Scope (Giai đoạn 2)

- Hỏi đáp AI trên nội dung note + file (RAG, có trích dẫn)
- LibreOffice cho `.doc` cũ / `.odt` / `.rtf`
- OCR cho PDF scan (Tesseract hoặc vision API)
- Chia sẻ note cho người khác, realtime collaboration
- Mobile app native

Schema đã chừa sẵn bảng `note_chunks` và cột `extracted_text` để giai đoạn 2 gắn vào
mà không phải migrate lại dữ liệu.
