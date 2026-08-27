const B = "http://localhost:3000";
let pass = 0, fail = 0;

function check(label, actual, expected) {
  const ok = String(actual) === String(expected);
  ok ? pass++ : fail++;
  console.log(`  ${ok ? "PASS" : "FAIL"}  ${label}: ${actual}${ok ? "" : ` (mong đợi ${expected})`}`);
}

async function signUp(name, email) {
  const res = await fetch(`${B}/api/auth/sign-up/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: B },
    body: JSON.stringify({ name, email, password: "matkhau12345" }),
  });
  const cookie = res.headers.getSetCookie().map((c) => c.split(";")[0]).join("; ");
  return { status: res.status, cookie };
}

const api = (cookie) => (path, init = {}) =>
  fetch(`${B}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", Origin: B, cookie, ...(init.headers ?? {}) },
  });

const a = await signUp("An", `an${Date.now()}@test.vn`);
check("A đăng ký", a.status, 200);
const A = api(a.cookie);

const created = await (await A("/api/notes", {
  method: "POST",
  body: JSON.stringify({ title: "Nhà cửa", body: "Hợp đồng thuê nhà năm 2026, giá 8 triệu" }),
})).json();
const id = created.id;
check("tiêu đề lưu đúng UTF-8", created.title, "Nhà cửa");

const s1 = await (await A("/api/notes?q=" + encodeURIComponent("hop dong"))).json();
check("search 'hop dong' (không dấu)", s1.notes.length, 1);

const s2 = await (await A("/api/notes?q=" + encodeURIComponent("Hợp đồng"))).json();
check("search 'Hợp đồng' (có dấu)", s2.notes.length, 1);

const s3 = await (await A("/api/notes?q=" + encodeURIComponent("thue nha"))).json();
check("search 'thue nha'", s3.notes.length, 1);

const s4 = await (await A("/api/notes?q=khongcogi")).json();
check("search từ không tồn tại", s4.notes.length, 0);

check("ghim note", (await A(`/api/notes/${id}`, { method: "PATCH", body: JSON.stringify({ isPinned: true }) })).status, 200);

const b = await signUp("Binh", `binh${Date.now()}@test.vn`);
const Bx = api(b.cookie);
check("IDOR GET", (await Bx(`/api/notes/${id}`)).status, 404);
check("IDOR PATCH", (await Bx(`/api/notes/${id}`, { method: "PATCH", body: JSON.stringify({ title: "hack" }) })).status, 404);
check("IDOR DELETE", (await Bx(`/api/notes/${id}`, { method: "DELETE" })).status, 404);
check("B không thấy note của A", (await (await Bx("/api/notes")).json()).notes.length, 0);
check("chưa đăng nhập", (await fetch(`${B}/api/notes`, { headers: { Origin: B } })).status, 401);
check("B search không ra note của A", (await (await Bx("/api/notes?q=" + encodeURIComponent("hop dong"))).json()).notes.length, 0);

check("xoá vào thùng rác", (await A(`/api/notes/${id}`, { method: "DELETE" })).status, 200);
check("có trong thùng rác", (await (await A("/api/notes?view=trash")).json()).notes.length, 1);
check("không còn active", (await (await A("/api/notes")).json()).notes.length, 0);
check("khôi phục", (await A(`/api/notes/${id}/restore`, { method: "POST" })).status, 200);
check("active sau khôi phục", (await (await A("/api/notes")).json()).notes.length, 1);

console.log(`\n${pass} pass, ${fail} fail`);
process.exit(fail === 0 ? 0 : 1);
