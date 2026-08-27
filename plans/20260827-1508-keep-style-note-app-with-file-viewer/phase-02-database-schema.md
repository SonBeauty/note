# Phase 02 — Database Schema

**Context:** [plan.md](plan.md) · [Phase 01](phase-01-setup-environment.md)

## Overview
- **Priority:** P0 (chặn 03, 04, 05)
- **Status:** ⬜ Not started
- Thiết kế schema Prisma cho note, attachment, label, và full-text search tiếng Việt.

## Key Insights
- **Search tiếng Việt:** Postgres không có text search config cho tiếng Việt.
  Dùng config `simple` + extension `unaccent` để "hop dong" tìm ra "hợp đồng".
- **`searchableText` là cột dẫn xuất**, không phải nguồn sự thật. Nó = `body` +
  concat mọi `attachment.extractedText`. Cập nhật lại mỗi khi note hoặc attachment đổi.
- Chừa sẵn `NoteChunk` cho giai đoạn 2 (RAG) nhưng **chưa dùng tới** —
  tạo bảng rẻ hơn nhiều so với migrate dữ liệu sau này.
- Checklist lưu dạng JSON trong note, không tách bảng riêng. Luôn đọc/ghi cả cụm,
  không bao giờ query lẻ từng item → tách bảng chỉ tổ phức tạp (KISS).

## Requirements
**Functional**
- Note có: title, body (markdown), checklist, màu, pin, archive, trash, labels, attachments.
- Attachment lưu: tên gốc, mime, kích thước, key trên storage, HTML đã render,
  text đã trích, trạng thái convert, thông báo lỗi.
- Soft delete: note vào thùng rác trước, xoá hẳn sau 30 ngày.

**Non-functional**
- Mọi query note phải lọc theo `userId` — không rò rỉ dữ liệu giữa các tài khoản.
- Index đủ để list note và search chạy dưới 100ms với ~10k note.

## Architecture
```prisma
model Note {
  id             String   @id @default(cuid())
  userId         String
  title          String   @default("")
  body           String   @default("")        // markdown
  checklist      Json?                        // [{id, text, checked, order}]
  color          String   @default("default")
  isPinned       Boolean  @default(false)
  isArchived     Boolean  @default(false)
  deletedAt      DateTime?
  searchableText String   @default("")        // body + extractedText của attachments
  attachments    Attachment[]
  labels         Label[]  @relation("NoteLabels")
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@index([userId, isArchived, deletedAt, isPinned, updatedAt])
}

model Attachment {
  id            String   @id @default(cuid())
  noteId        String
  userId        String
  fileName      String
  mimeType      String
  sizeBytes     Int
  storageKey    String                        // key trên R2/local
  kind          String                        // markdown|docx|pdf|image|code|data|html|unknown
  renderedHtml  String?  @db.Text             // HTML đã sanitize, cache để đọc ngay
  extractedText String?  @db.Text             // text thô, dùng cho search + RAG sau này
  status        String   @default("pending")  // pending|ready|failed|unsupported
  errorMessage  String?
  createdAt     DateTime @default(now())

  @@index([noteId])
}

model Label {
  id     String @id @default(cuid())
  userId String
  name   String
  notes  Note[] @relation("NoteLabels")

  @@unique([userId, name])
}

model NoteChunk {          // giai đoạn 2 — RAG. Tạo trước, chưa dùng.
  id        String @id @default(cuid())
  noteId    String
  content   String @db.Text
  ordinal   Int
  @@index([noteId])
}
```

Bảng auth (`User`, `Session`, `Account`, `Verification`) do Better Auth sinh ở Phase 03.

## Related Code Files
**Create:** `prisma/schema.prisma`, `prisma/migrations/`, `src/types/note.ts`
**Modify:** `src/lib/db.ts`

## Implementation Steps
1. Viết `prisma/schema.prisma` theo mẫu trên.
2. `CREATE EXTENSION IF NOT EXISTS unaccent;` — thêm vào migration đầu tiên bằng
   `npx prisma migrate dev --create-only` rồi sửa file SQL.
3. Thêm index GIN vào migration SQL (Prisma chưa hỗ trợ `to_tsvector` index qua schema):
   `CREATE INDEX note_search_idx ON "Note" USING GIN (to_tsvector('simple', unaccent("searchableText")));`
4. Chạy `npx prisma migrate dev --name init`.
5. Viết `src/types/note.ts` — type cho checklist item và các union kiểu `kind`, `status`.
6. Viết seed script tạo vài note mẫu để dev.

## Todo List
- [ ] Viết schema.prisma
- [ ] Migration bật extension `unaccent`
- [ ] Migration tạo index GIN cho full-text search
- [ ] Chạy migrate, xác nhận DB có bảng
- [ ] Viết `src/types/note.ts`
- [ ] Seed script

## Success Criteria
- `npx prisma migrate dev` chạy sạch trên DB trống.
- `npx prisma studio` mở ra thấy đủ bảng.
- Query thử `to_tsvector('simple', unaccent('Hợp đồng'))` trả về kết quả không dấu.

## Risk Assessment
| Rủi ro | Giảm thiểu |
|---|---|
| `unaccent` không có trên Postgres managed | Neon/Supabase đều có sẵn; nếu không, fallback dùng `ILIKE` |
| `renderedHtml` làm phình row | Postgres TOAST tự nén ngoài row; đặt trần 25MB/file ở Phase 05 |
| Checklist JSON không type-safe | Zod schema validate ở tầng API, không tin cột Json |

## Security Considerations
- Mọi model có dữ liệu người dùng đều mang `userId`. Không có query nào được phép
  bỏ điều kiện này — viết helper `scopedNote(userId)` để khỏi quên.
- `NoteChunk` chưa có `userId` vì luôn join qua note; nếu giai đoạn 2 query trực tiếp
  thì phải thêm cột.

## Next Steps
→ [Phase 03 — Authentication](phase-03-authentication.md)
