# Phase 06 — Keep-style UI

**Context:** [plan.md](plan.md) · [Phase 04](phase-04-note-crud-api-and-search.md) · [Phase 05](phase-05-file-upload-and-converter-pipeline.md)

## Overview
- **Priority:** P0
- **Status:** ⬜ Not started
- Giao diện masonry kiểu Google Keep, editor gõ trực tiếp có autosave,
  và viewer đọc file đính kèm.

## Key Insights
- **Autosave không có nút Save.** Debounce 500ms, hiện trạng thái nhỏ
  "Đang lưu… / Đã lưu" để người dùng tin tưởng. Lưu nốt khi đóng editor và khi `beforeunload`.
- **Optimistic update là bắt buộc** cho pin/archive/color — chờ round-trip mới đổi màu
  là cảm giác chậm ngay lập tức.
- Masonry: CSS `columns` đơn giản và đủ tốt, không cần thư viện. Nhược điểm là note
  xếp theo cột dọc chứ không theo thứ tự trái-phải — Keep cũng vậy, chấp nhận được.
- **Chế độ đọc file tách khỏi chế độ sửa note.** Attachment là read-only. Ranh giới này
  giữ cho project không lún vào hố "sửa file Word trong browser".

## Requirements
**Functional**
- Ô "Ghi chú…" ở đầu trang, bấm vào nở ra thành editor.
- Board masonry: note ghim ở trên, phần còn lại xếp theo `updatedAt`.
- Note card hiện: title, trích đoạn body, checklist rút gọn, chip attachment, nhãn màu.
- Bấm card → mở editor dạng modal.
- Editor: title, body markdown (Tiptap), chuyển đổi text ↔ checklist,
  chọn màu, ghim, thêm nhãn, đính kèm file, archive, xoá.
- Kéo thả file vào editor, dán ảnh từ clipboard.
- Bấm attachment → mở viewer toàn màn hình đọc nội dung, có nút tải file gốc.
- Thanh tìm kiếm ở header, gõ là lọc board (debounce 300ms).
- Sidebar: Notes, Nhắc nhở(ẩn), Nhãn, Lưu trữ, Thùng rác.
- Responsive: 1 cột trên mobile, 2–4 cột trên desktop.

**Non-functional**
- First paint board dưới 1.5s với 100 note.
- Bàn phím dùng được: Esc đóng editor, Ctrl+Enter lưu và đóng.
- Dark mode theo hệ thống.

## Architecture
```
src/app/(app)/
├── layout.tsx               # sidebar + header
├── page.tsx                 # board chính
├── archive/page.tsx
├── trash/page.tsx
└── label/[name]/page.tsx

src/components/note/
├── note-board.tsx           # masonry, chia ghim / thường
├── note-card.tsx            # thẻ tóm tắt
├── note-editor-dialog.tsx   # modal sửa
├── note-body-editor.tsx     # Tiptap + markdown
├── note-checklist.tsx
├── note-color-picker.tsx
├── note-label-picker.tsx
├── note-toolbar.tsx
└── quick-create-bar.tsx     # ô "Ghi chú…"

src/components/attachment/
├── attachment-chip.tsx      # hiện trong card và editor
├── attachment-dropzone.tsx  # kéo thả + dán
└── attachment-viewer.tsx    # modal đọc, render renderedHtml

src/components/viewer/
├── html-content.tsx         # render HTML đã sanitize, style prose
├── pdf-page-list.tsx
└── unsupported-preview.tsx  # hex + nút tải về

src/hooks/
├── use-autosave.ts
├── use-notes.ts             # TanStack Query
└── use-paste-upload.ts
```

## Related Code Files
**Create:** toàn bộ file trong sơ đồ trên
**Modify:** `src/app/globals.css` (style prose cho viewer)

## Implementation Steps
1. `npm i @tanstack/react-query @tiptap/react @tiptap/starter-kit tiptap-markdown`
2. Dựng layout: sidebar + header có search, provider TanStack Query.
3. Viết `use-notes.ts` — query list, mutation create/update/delete có optimistic update.
4. Viết `note-card.tsx` và `note-board.tsx` với CSS `columns-1 sm:columns-2 lg:columns-4`
   và `break-inside-avoid` trên card.
5. Viết `quick-create-bar.tsx` — bấm vào tạo note rỗng rồi mở editor luôn.
6. Viết `use-autosave.ts` — debounce 500ms, flush khi unmount và `beforeunload`.
7. Viết `note-editor-dialog.tsx` gộp các phần con.
8. Viết `note-body-editor.tsx` — Tiptap có markdown input rules, serialize ra markdown.
9. Viết `attachment-dropzone.tsx` và `use-paste-upload.ts`.
10. Viết `attachment-viewer.tsx` + `html-content.tsx`, style prose bằng
    `@tailwindcss/typography`, đo dòng tối đa 70ch, line-height 1.6.
11. Nối search vào board, debounce 300ms, sync vào URL query param.
12. Kiểm tra responsive và dark mode.

## Todo List
- [ ] Layout, sidebar, header search
- [ ] TanStack Query provider + `use-notes.ts`
- [ ] Note card + masonry board
- [ ] Quick create bar
- [ ] `use-autosave.ts`
- [ ] Editor dialog + Tiptap markdown
- [ ] Checklist, color picker, label picker
- [ ] Dropzone + dán clipboard
- [ ] Attachment viewer + prose styling
- [ ] Trang archive / trash / label
- [ ] Search nối vào board
- [ ] Responsive + dark mode + phím tắt

## Success Criteria
- Gõ note, chờ 1s, refresh trang → nội dung còn nguyên.
- Ghim note → nhảy lên đầu ngay, không giật, không chờ server.
- Kéo file `.docx` vào editor → thấy chip, bấm vào đọc được nội dung.
- Dán ảnh từ clipboard → thành attachment ảnh.
- Gõ vào ô tìm kiếm → board lọc lại, tìm được cả chữ trong file.
- Thu nhỏ về 375px → 1 cột, không tràn ngang.

## Risk Assessment
| Rủi ro | Giảm thiểu |
|---|---|
| Tiptap markdown serialize mất định dạng | Test round-trip md → editor → md trước khi làm tiếp |
| Autosave xung đột khi mở 2 tab | 409 từ server → hiện toast, giữ bản local để người dùng chọn |
| Masonry nhảy layout khi ảnh load | Đặt `aspect-ratio` cho ảnh, dùng skeleton chiều cao cố định |
| Board chậm khi có 1000 note | Phân trang cursor, `IntersectionObserver` tải thêm |

## Security Considerations
- `renderedHtml` render qua `dangerouslySetInnerHTML` — **chỉ an toàn vì đã sanitize
  ở server** (Phase 05). Không bao giờ render HTML chưa qua `sanitize-html.ts`.
- Không đưa signed URL của attachment vào query string chia sẻ được.
- Escape nội dung note khi hiện trong card (React tự lo, nhưng đừng dùng innerHTML ở card).

## Next Steps
→ [Phase 07 — Write tests](phase-07-write-tests.md)
