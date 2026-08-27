/**
 * Xoá DỮ LIỆU TEST và chỉ dữ liệu test.
 *
 * Trước đây tôi dọn bằng `DELETE FROM "User"` không điều kiện — nó xoá luôn tài
 * khoản thật của người dùng đang dùng app. Không bao giờ làm vậy nữa: các script
 * test luôn tạo email theo khuôn mẫu cố định, nên chỉ xoá đúng những email đó.
 */
import { Client } from "pg";
import { readFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(".env", "utf8")
    .split(/\r?\n/)
    .filter((l) => l.includes("=") && !l.trim().startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^"|"$/g, "")];
    }),
);

// Khớp đúng các email do tests/manual/*.mjs sinh ra.
const TEST_EMAIL_PATTERNS = ["an%@test.vn", "binh%@test.vn", "up%@t.vn", "x%@t.vn"];

const client = new Client({ connectionString: env.DATABASE_URL });
await client.connect();

let total = 0;
for (const pattern of TEST_EMAIL_PATTERNS) {
  // Note/Attachment/Session xoá theo cascade khi User bị xoá.
  const res = await client.query('DELETE FROM "User" WHERE email LIKE $1', [pattern]);
  if (res.rowCount > 0) console.log(`  xoá ${res.rowCount} tài khoản khớp ${pattern}`);
  total += res.rowCount;
}

const { rows } = await client.query('SELECT count(*)::int AS n FROM "User"');
console.log(`\nĐã xoá ${total} tài khoản test. Còn lại ${rows[0].n} tài khoản thật.`);

await client.end();
