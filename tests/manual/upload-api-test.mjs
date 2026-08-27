import { readFileSync } from "node:fs";
const B = "http://localhost:3000";
let pass = 0, fail = 0;
const check = (label, actual, expected) => {
  const ok = String(actual) === String(expected);
  ok ? pass++ : fail++;
  console.log(`  ${ok ? "PASS" : "FAIL"}  ${label}: ${actual}${ok ? "" : ` (mong đợi ${expected})`}`);
};

const res = await fetch(`${B}/api/auth/sign-up/email`, {
  method: "POST",
  headers: { "Content-Type": "application/json", Origin: B },
  body: JSON.stringify({ name: "Up", email: `up${Date.now()}@t.vn`, password: "matkhau12345" }),
});
const cookie = res.headers.getSetCookie().map((c) => c.split(";")[0]).join("; ");
const api = (p, i = {}) => fetch(`${B}${p}`, { ...i, headers: { Origin: B, cookie, ...(i.headers ?? {}) } });

const note = await (await api("/api/notes", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title: "Giấy tờ", body: "ghi chú tự viết" }),
})).json();

async function upload(file, mime) {
  const fd = new FormData();
  fd.append("file", new File([readFileSync(`tests/fixtures/${file}`)], file, { type: mime }));
  const r = await api(`/api/notes/${note.id}/attachments`, { method: "POST", body: fd });
  return { status: r.status, body: await r.json() };
}

const DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const uploads = [
  ["sample-contract.docx", DOCX, "docx", "ready"],
  ["sample-text.pdf", "application/pdf", "pdf", "ready"],
  ["sample-notes.md", "text/markdown", "markdown", "ready"],
  ["sample-image.png", "image/png", "image", "ready"],
  ["random-binary.bin", "application/octet-stream", "unknown", "unsupported"],
  ["malicious.html", "text/html", "html", "ready"],
];
const ids = {};
for (const [file, mime, kind, status] of uploads) {
  const { status: code, body } = await upload(file, mime);
  ids[file] = body.id;
  check(`upload ${file}`, `${code}/${body.kind}/${body.status}`, `201/${kind}/${status}`);
}

console.log("\n--- search xuyên qua nội dung file ---");
const search = async (q) => (await (await api(`/api/notes?q=${encodeURIComponent(q)}`)).json()).notes.length;
check("tìm 'Bên B' (chỉ có trong docx)", await search("Bên B"), 1);
check("tìm 'ben b' (không dấu)", await search("ben b"), 1);
check("tìm 'Monthly rent' (chỉ có trong PDF)", await search("Monthly rent"), 1);
check("tìm 'tinhTong' (chỉ có trong .md)", await search("tinhTong"), 1);
check("tìm 'ghi chú tự viết' (note tự gõ)", await search("ghi chu tu viet"), 1);
check("tìm từ không tồn tại", await search("xyzkhongcogi"), 0);

console.log("\n--- xem nội dung ---");
const content = await (await api(`/api/attachments/${ids["sample-contract.docx"]}/content`)).json();
check("docx trả HTML có heading", content.html.includes("<h1>Hợp đồng thuê nhà</h1>"), "true");
check("docx trả HTML có bảng", content.html.includes("<table>"), "true");
const evil = await (await api(`/api/attachments/${ids["malicious.html"]}/content`)).json();
check("html độc hại đã bị lọc script", !evil.html.includes("<script"), "true");

console.log("\n--- phục vụ file ---");
const raw = await api(`/api/attachments/${ids["sample-image.png"]}/raw`);
check("ảnh raw content-type", raw.headers.get("content-type"), "image/png");
check("ảnh raw inline", raw.headers.get("content-disposition").startsWith("inline"), "true");
check("ảnh raw nosniff", raw.headers.get("x-content-type-options"), "nosniff");
const rawHtml = await api(`/api/attachments/${ids["malicious.html"]}/raw`);
check("html raw BỊ ÉP tải về", rawHtml.headers.get("content-disposition").startsWith("attachment"), "true");
check("html raw không trả text/html", rawHtml.headers.get("content-type"), "application/octet-stream");
const dl = await api(`/api/attachments/${ids["sample-contract.docx"]}/download`);
check("download trả file gốc", (await dl.arrayBuffer()).byteLength, readFileSync("tests/fixtures/sample-contract.docx").length);

console.log("\n--- ảnh tách từ docx ---");
const asset = await api(`/api/attachments/${ids["sample-contract.docx"]}/asset/img-0.png`);
check("asset ảnh docx", asset.status, 200);
check("path traversal bị chặn", (await api(`/api/attachments/${ids["sample-contract.docx"]}/asset/original`)).status, 404);

console.log("\n--- cô lập người dùng ---");
const res2 = await fetch(`${B}/api/auth/sign-up/email`, {
  method: "POST", headers: { "Content-Type": "application/json", Origin: B },
  body: JSON.stringify({ name: "Kẻ lạ", email: `x${Date.now()}@t.vn`, password: "matkhau12345" }),
});
const cookie2 = res2.headers.getSetCookie().map((c) => c.split(";")[0]).join("; ");
const other = (p) => fetch(`${B}${p}`, { headers: { Origin: B, cookie: cookie2 } });
check("người khác không xem được nội dung", (await other(`/api/attachments/${ids["sample-contract.docx"]}/content`)).status, 404);
check("người khác không tải được file", (await other(`/api/attachments/${ids["sample-contract.docx"]}/download`)).status, 404);
check("người khác không xoá được", (await fetch(`${B}/api/attachments/${ids["sample-image.png"]}`, { method: "DELETE", headers: { Origin: B, cookie: cookie2 } })).status, 404);

console.log("\n--- xoá đính kèm ---");
check("xoá", (await api(`/api/attachments/${ids["sample-image.png"]}`, { method: "DELETE" })).status, 200);
check("searchableText cập nhật lại sau khi xoá", await search("Monthly rent"), 1);

console.log(`\n${pass} pass, ${fail} fail`);
process.exit(fail === 0 ? 0 : 1);
