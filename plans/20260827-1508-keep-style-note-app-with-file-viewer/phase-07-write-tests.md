# Phase 07 — Write Tests

**Context:** [plan.md](plan.md) · tất cả các phase trước

## Overview
- **Priority:** P1
- **Status:** ⬜ Not started
- Vitest cho unit/integration, Playwright cho E2E các luồng chính.

## Key Insights
- **Converter pipeline là nơi đáng test nhất.** Nó nhận input không kiểm soát được
  và có nhiều nhánh fallback — chính là chỗ dễ hỏng âm thầm.
- Test IDOR phải có thật: tạo 2 user, xác nhận user B không đọc được gì của user A.
  Đây là lỗi bảo mật dễ mắc nhất trong app đa người dùng.
- File mẫu để trong `tests/fixtures/`, **dùng file thật**, không mock buffer.
  Mock ở đây là tự lừa mình.

## Requirements
**Functional**
- Unit: converter (mỗi định dạng + nhánh fallback), sanitize, detect-file-kind,
  search query builder, rebuildSearchableText.
- Integration: từng API route với DB thật (Postgres test riêng).
- E2E: đăng ký → tạo note → gõ → autosave → upload docx → đọc → search ra.

**Non-functional**
- Coverage tối thiểu 70% cho `src/lib/`.
- Test suite chạy dưới 60s (không tính E2E).

## Architecture
```
tests/
├── fixtures/
│   ├── sample-with-table-and-image.docx
│   ├── sample-50-pages.pdf
│   ├── sample-with-code-and-math.md
│   ├── sample-image.png
│   ├── malicious-script.html
│   └── random-binary.zip
├── unit/
│   ├── converters/*.test.ts
│   ├── sanitize-html.test.ts
│   └── search-query.test.ts
├── integration/
│   ├── notes-api.test.ts
│   ├── attachments-api.test.ts
│   └── auth-isolation.test.ts
└── e2e/
    └── note-lifecycle.spec.ts
```

## Related Code Files
**Create:** toàn bộ thư mục `tests/`, `vitest.config.ts`, `playwright.config.ts`
**Modify:** `package.json` (scripts `test`, `test:e2e`, `test:coverage`)

## Implementation Steps
1. `npm i -D vitest @vitest/coverage-v8 @playwright/test`
2. Cấu hình Vitest với `environment: 'node'`, path alias khớp tsconfig.
3. Chuẩn bị file fixture thật cho đủ 6 trường hợp ở trên.
4. Viết unit test converter — với mỗi định dạng khẳng định `html` không rỗng
   và `text` chứa từ khoá đã biết trong file.
5. Viết test sanitize: `<script>`, `onerror=`, `javascript:` href đều phải bị loại bỏ.
6. Viết test fallback: nạp `random-binary.zip`, khẳng định `status='unsupported'`
   và vẫn trả về HTML preview — **không được ném lỗi**.
7. Viết integration test dùng Postgres test, reset DB giữa các test.
8. Viết `auth-isolation.test.ts`: user A tạo note, user B gọi GET/PATCH/DELETE → đều 404.
9. Viết E2E Playwright cho vòng đời note đầy đủ.
10. Thêm scripts vào `package.json`, chạy toàn bộ, sửa cho tới khi xanh hết.

## Todo List
- [ ] Cấu hình Vitest + Playwright
- [ ] Chuẩn bị 6 file fixture thật
- [ ] Unit test cho từng converter
- [ ] Test sanitize chống XSS
- [ ] Test nhánh fallback không ném lỗi
- [ ] Integration test API notes
- [ ] Integration test API attachments
- [ ] Test cô lập dữ liệu giữa 2 user
- [ ] E2E vòng đời note
- [ ] Đạt coverage 70% cho `src/lib/`

## Success Criteria
- `npm test` xanh toàn bộ, không có test bị skip.
- `npm run test:coverage` — `src/lib/` đạt ≥ 70%.
- `npm run test:e2e` xanh trên Chromium.
- **Không có test nào dùng dữ liệu giả để né lỗi thật.**

## Risk Assessment
| Rủi ro | Giảm thiểu |
|---|---|
| Integration test cần DB thật | Docker compose dịch vụ `postgres-test` riêng cổng khác |
| E2E chập chờn vì autosave bất đồng bộ | Chờ đúng chỉ báo "Đã lưu", không dùng `waitForTimeout` |
| Fixture PDF/docx nặng làm repo phình | Giữ file nhỏ nhất có thể mà vẫn đại diện đúng, tổng dưới 5MB |

## Security Considerations
- Test XSS và IDOR là **bắt buộc**, không phải tuỳ chọn — hai lỗi này ảnh hưởng
  trực tiếp tới người dùng thật.
- Test không được dùng credential thật; `.env.test` riêng, không commit.

## Next Steps
- Chạy `code-reviewer` rà soát toàn bộ
- Cập nhật `docs/project-changelog.md` và `docs/development-roadmap.md`
- Cân nhắc giai đoạn 2: hỏi đáp AI trên note + file, LibreOffice, OCR
