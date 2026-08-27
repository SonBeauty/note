# Phase 03 — Authentication

**Context:** [plan.md](plan.md) · [Phase 02](phase-02-database-schema.md)

## Overview
- **Priority:** P0
- **Status:** ⬜ Not started
- Đăng nhập bằng email/password và Google OAuth, dùng Better Auth.

## Key Insights
- Better Auth tự sinh bảng `User`/`Session`/`Account`/`Verification` qua Prisma adapter —
  chạy `npx @better-auth/cli generate` rồi migrate, **không viết tay** các bảng này.
- Middleware Next.js chỉ nên kiểm tra **sự tồn tại của session cookie** để redirect.
  Việc xác thực thật phải làm lại ở từng route handler / server component —
  cookie có thể giả, middleware không phải hàng rào bảo mật.

## Requirements
**Functional**
- Đăng ký, đăng nhập, đăng xuất bằng email + mật khẩu.
- Đăng nhập Google (tuỳ chọn, bật được bằng env var).
- Truy cập `/` khi chưa đăng nhập → redirect `/login`.
- Truy cập `/login` khi đã đăng nhập → redirect `/`.

**Non-functional**
- Session cookie `httpOnly`, `secure` ở production, `sameSite=lax`.
- Rate limit đăng nhập để chặn dò mật khẩu.

## Architecture
```
src/lib/auth.ts              # betterAuth() config, prismaAdapter
src/lib/auth-client.ts       # createAuthClient cho React
src/lib/get-session.ts       # helper server-side, dùng trong mọi API route
src/app/api/auth/[...all]/route.ts
src/middleware.ts            # chỉ redirect, không phải hàng rào bảo mật
src/app/(auth)/login/page.tsx
src/app/(auth)/register/page.tsx
```

`get-session.ts` là chốt chặn duy nhất mọi API route dùng:
```ts
export async function requireUser() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new UnauthorizedError()
  return session.user
}
```

## Related Code Files
**Create:** `src/lib/auth.ts`, `src/lib/auth-client.ts`, `src/lib/get-session.ts`,
`src/app/api/auth/[...all]/route.ts`, `src/middleware.ts`,
`src/app/(auth)/login/page.tsx`, `src/app/(auth)/register/page.tsx`,
`src/components/auth/login-form.tsx`, `src/components/auth/register-form.tsx`
**Modify:** `prisma/schema.prisma`, `.env.example`

## Implementation Steps
1. `npm i better-auth`
2. Viết `src/lib/auth.ts`: `emailAndPassword: { enabled: true }`, `socialProviders.google`
   chỉ bật khi có `GOOGLE_CLIENT_ID`. Bật `rateLimit`.
3. `npx @better-auth/cli generate` → merge bảng auth vào schema → `npx prisma migrate dev`.
4. Viết catch-all route handler `/api/auth/[...all]`.
5. Viết `get-session.ts` với `requireUser()`.
6. Viết `middleware.ts` — matcher loại trừ `/api/auth`, `/_next`, static.
7. Dựng form login/register bằng shadcn + `authClient.signIn` / `signUp`.
8. Thêm `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` vào `.env.example`.

## Todo List
- [ ] Cài và cấu hình Better Auth
- [ ] Generate + migrate bảng auth
- [ ] API route catch-all
- [ ] `requireUser()` helper
- [ ] Middleware redirect
- [ ] Form login / register
- [ ] Bật rate limit
- [ ] Test thủ công đủ luồng đăng ký → đăng nhập → đăng xuất

## Success Criteria
- Đăng ký tài khoản mới → tự đăng nhập → thấy trang chính.
- Xoá cookie → refresh → bật về `/login`.
- Gọi thẳng `/api/notes` khi chưa đăng nhập → 401, không phải 500.

## Risk Assessment
| Rủi ro | Giảm thiểu |
|---|---|
| Nhầm tưởng middleware là bảo mật | Mọi API route bắt buộc gọi `requireUser()`, có test riêng |
| Google OAuth chưa có credential | Feature flag theo env, email/password vẫn chạy độc lập |

## Security Considerations
- Mật khẩu do Better Auth hash (scrypt) — không tự viết logic hash.
- Không log giá trị session token hay password ở bất kỳ đâu.
- `BETTER_AUTH_URL` phải khớp domain production, nếu không OAuth callback sẽ hỏng.

## Next Steps
→ [Phase 04 — Note CRUD API & search](phase-04-note-crud-api-and-search.md)
