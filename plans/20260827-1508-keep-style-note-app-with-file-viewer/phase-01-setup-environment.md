# Phase 01 — Setup Environment

**Context:** [plan.md](plan.md)

## Overview
- **Priority:** P0 (chặn tất cả phase khác)
- **Status:** ⬜ Not started
- Khởi tạo Next.js 15 + TypeScript + Tailwind + shadcn/ui, cấu hình Prisma, dựng
  cấu trúc thư mục và các file docs nền.

## Key Insights
- Node v24.14.0, npm 11.9.0 đã có sẵn trên máy.
- Thư mục `D:/develop/new_note` đang trống — scaffold trực tiếp, không cần migrate.
- `pdfjs-dist` và `mammoth` chạy được ở Node runtime nhưng **không chạy trên Edge runtime**.
  Mọi route xử lý file phải khai báo `export const runtime = 'nodejs'`.

## Requirements
**Functional**
- `npm run dev` chạy được, mở `localhost:3000` thấy trang trắng có layout.
- `npm run build` và `npm run lint` pass, không có lỗi type.

**Non-functional**
- Mọi file code < 200 dòng.
- Tên file kebab-case, mô tả rõ mục đích.
- Biến môi trường qua `.env`, có `.env.example` commit kèm; `.env` nằm trong `.gitignore`.

## Architecture
```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # trang login/register
│   ├── (app)/              # trang chính, cần đăng nhập
│   └── api/                # route handlers
├── components/
│   ├── ui/                 # shadcn primitives
│   ├── note/               # note card, editor, board
│   └── viewer/             # renderer cho từng định dạng
├── lib/
│   ├── db.ts               # Prisma client singleton
│   ├── auth.ts             # Better Auth config
│   ├── storage/            # storage adapter (local | s3)
│   └── converters/         # docx, pdf, md, code, image
└── types/
prisma/schema.prisma
docs/                       # system-architecture, code-standards, changelog, roadmap
```

## Related Code Files
**Create:** `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`,
`.env.example`, `.gitignore`, `prisma/schema.prisma`, `src/lib/db.ts`,
`docs/system-architecture.md`, `docs/code-standards.md`, `docs/project-changelog.md`,
`docs/development-roadmap.md`

## Implementation Steps
1. `npx create-next-app@latest . --typescript --tailwind --app --src-dir --eslint`
2. `npx shadcn@latest init`, thêm sẵn: button, input, textarea, dialog, dropdown-menu,
   badge, card, tooltip, sonner.
3. Cài Prisma: `npm i -D prisma && npm i @prisma/client && npx prisma init`
4. Viết `src/lib/db.ts` — Prisma client singleton chống tạo lại khi hot reload.
5. Tạo `.env.example` với `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`,
   `STORAGE_DRIVER`, `S3_*`. Xác nhận `.env` đã bị `.gitignore` bỏ qua.
6. Khởi tạo git repo, commit đầu tiên.
7. Viết 4 file trong `docs/` ở mức khung sườn.

## Todo List
- [ ] Scaffold Next.js + Tailwind + shadcn
- [ ] Cài và init Prisma, viết db client singleton
- [ ] Tạo `.env.example` và kiểm tra `.gitignore`
- [ ] Dựng cây thư mục `src/lib`, `src/components`
- [ ] Viết khung 4 file docs
- [ ] `npm run build` và `npm run lint` pass
- [ ] Git init + commit `chore: scaffold project`

## Success Criteria
- `npm run dev` lên được trang chủ không lỗi console.
- `npm run build` exit code 0.
- `npx prisma validate` pass.

## Risk Assessment
| Rủi ro | Giảm thiểu |
|---|---|
| Chưa có Postgres trên máy | Dùng Docker `postgres:17`, hoặc Neon free tier |
| shadcn init xung đột Tailwind v4 | Theo đúng doc shadcn mới nhất, không tự sửa config tay |

## Security Considerations
- `.env` không bao giờ được commit — kiểm tra trước commit đầu tiên.
- `BETTER_AUTH_SECRET` sinh bằng `openssl rand -base64 32`, không dùng giá trị mẫu.

## Next Steps
→ [Phase 02 — Database schema](phase-02-database-schema.md)
