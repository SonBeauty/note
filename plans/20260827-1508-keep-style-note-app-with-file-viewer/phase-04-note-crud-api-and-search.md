# Phase 04 — Note CRUD API & Search

**Context:** [plan.md](plan.md) · [Phase 02](phase-02-database-schema.md) · [Phase 03](phase-03-authentication.md)

## Overview
- **Priority:** P0
- **Status:** ⬜ Not started
- API cho note: tạo, sửa, xoá, pin, archive, label, và full-text search
  chạy trên cả nội dung tự viết lẫn nội dung file đính kèm.

## Key Insights
- **Autosave tạo rất nhiều PATCH.** Client debounce 500ms, server dùng
  `updatedAt` làm optimistic concurrency để request đến trễ không ghi đè bản mới hơn.
- `searchableText` phải được tính lại ở **một chỗ duy nhất** — hàm
  `rebuildSearchableText(noteId)`. Gọi sau khi sửa note và sau khi convert xong attachment.
  Rải logic này ra nhiều nơi là nguồn bug chắc chắn.
- Search dùng `websearch_to_tsquery` để người dùng gõ được `"hợp đồng" -nháp`.

## Requirements
**Functional**
- `POST /api/notes` — tạo note rỗng, trả về ngay để client mở editor.
- `GET /api/notes` — list, lọc theo `archived` / `trashed` / `label` / `q`, phân trang cursor.
- `PATCH /api/notes/:id` — cập nhật từng phần (title, body, checklist, color, pin, archive).
- `DELETE /api/notes/:id` — soft delete vào thùng rác; `?permanent=true` xoá hẳn.
- `GET /api/notes/:id` — chi tiết kèm attachments.
- `POST /api/labels`, `GET /api/labels`, `DELETE /api/labels/:id`.

**Non-functional**
- Mọi input validate bằng Zod trước khi chạm DB.
- List 50 note đầu trả về dưới 100ms.
- Note ghim luôn xếp trước, sau đó sắp theo `updatedAt` giảm dần.

## Architecture
```
src/app/api/notes/route.ts           # GET list, POST create
src/app/api/notes/[id]/route.ts      # GET, PATCH, DELETE
src/app/api/labels/route.ts
src/lib/notes/note-service.ts        # business logic, mọi query đều scope userId
src/lib/notes/search-query.ts        # dựng tsquery từ chuỗi người dùng gõ
src/lib/notes/rebuild-searchable-text.ts
src/lib/validation/note-schema.ts    # Zod
src/lib/api/handler.ts               # wrapper bắt lỗi → JSON chuẩn
```

Search SQL:
```sql
SELECT * FROM "Note"
WHERE "userId" = $1 AND "deletedAt" IS NULL
  AND to_tsvector('simple', unaccent("searchableText"))
      @@ websearch_to_tsquery('simple', unaccent($2))
ORDER BY "isPinned" DESC, "updatedAt" DESC
```

## Related Code Files
**Create:** toàn bộ file trong sơ đồ Architecture ở trên
**Modify:** `src/types/note.ts`

## Implementation Steps
1. Viết `src/lib/api/handler.ts` — wrapper chuyển `UnauthorizedError`/`ZodError`/
   `NotFoundError` thành status code đúng, mọi lỗi khác thành 500 và log server-side.
2. Viết Zod schema cho create/update note và checklist item.
3. Viết `note-service.ts`: mọi hàm nhận `userId` là tham số đầu tiên, không có ngoại lệ.
4. Viết `rebuild-searchable-text.ts` — đọc note + attachments, ghép, cắt trần 1MB, update.
5. Viết `search-query.ts` — làm sạch input, bỏ ký tự phá tsquery, gọi `websearch_to_tsquery`.
6. Viết route handlers, tất cả `export const runtime = 'nodejs'`.
7. Viết PATCH có optimistic concurrency: client gửi kèm `updatedAt` đang giữ;
   nếu DB mới hơn thì trả 409 và client merge lại.
8. Test bằng `curl` hoặc `.http` file cho đủ 6 endpoint.

## Todo List
- [ ] Error handler wrapper
- [ ] Zod schemas
- [ ] `note-service.ts` với scope userId
- [ ] `rebuildSearchableText()`
- [ ] Search query builder
- [ ] 6 route handlers
- [ ] Optimistic concurrency cho PATCH
- [ ] Test thủ công toàn bộ endpoint

## Success Criteria
- Tạo note, sửa, ghim, archive, xoá — đủ vòng đời qua API.
- Search "hop dong" tìm ra note chứa "Hợp đồng".
- Đăng nhập tài khoản B, gọi `GET /api/notes/:id` với id của A → 404 (không phải 403,
  tránh lộ sự tồn tại của note).

## Risk Assessment
| Rủi ro | Giảm thiểu |
|---|---|
| Autosave spam làm nghẽn DB | Debounce client + concurrency check server |
| `searchableText` lệch với thực tế | Chỉ một hàm được phép ghi cột này |
| Zod schema và Prisma type lệch nhau | Suy ra type từ Zod (`z.infer`), không khai báo hai lần |

## Security Considerations
- **IDOR là rủi ro lớn nhất phase này.** Mọi hàm service nhận `userId` bắt buộc;
  không có hàm nào query note chỉ bằng `id`.
- Note không tồn tại và note của người khác đều trả 404 giống hệt nhau.
- Không trả `userId` của người khác trong bất kỳ response nào.

## Next Steps
→ [Phase 05 — File upload & converter pipeline](phase-05-file-upload-and-converter-pipeline.md)
