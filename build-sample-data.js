// Sinh du lieu mau tu chinh cac bang hien trong so tay.
//   sample-data.sql          MySQL, moi chuong mot database  nb_<id>
//   sample-data-postgres.sql PostgreSQL, mot database notebook, moi chuong mot schema
// Phai tach ra vi nhieu chuong dung bang cung ten "orders" nhung khac cot.
// Chay: node build-sample-data.js
const fs = require("fs");

process.chdir(__dirname);
const html = fs.readFileSync("index.html", "utf8");
global.window = {};
[...html.matchAll(/src="(data-[^"]+)"/g)]
  .map((m) => m[1])
  .forEach((f) => eval(fs.readFileSync(f, "utf8")));

const IDENT = /^[A-Za-z_][A-Za-z0-9_]*$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const INT = /^-?\d+$/;
const DEC = /^-?\d+\.\d+$/;
const BOOL = /^(true|false)$/i;

function plain(v) {
  return String(v).replace(/<[^>]+>/g, "").trim();
}

function columnType(values) {
  const clean = values.filter((v) => v !== "" && v.toUpperCase() !== "NULL");
  if (!clean.length) return { my: "VARCHAR(50)", pg: "VARCHAR(50)", kind: "text" };
  if (clean.every((v) => DATE.test(v))) return { my: "DATE", pg: "DATE", kind: "date" };
  if (clean.every((v) => BOOL.test(v))) return { my: "TINYINT(1)", pg: "BOOLEAN", kind: "bool" };
  if (clean.every((v) => INT.test(v))) return { my: "INT", pg: "INTEGER", kind: "num" };
  if (clean.every((v) => INT.test(v) || DEC.test(v))) {
    return { my: "DECIMAL(18,2)", pg: "NUMERIC(18,2)", kind: "num" };
  }
  const max = Math.max(20, ...clean.map((v) => v.length + 20));
  const t = "VARCHAR(" + Math.min(255, max) + ")";
  return { my: t, pg: t, kind: "text" };
}

function sqlValue(v, type, dialect) {
  if (v === "" || v.toUpperCase() === "NULL") return "NULL";
  if (type.kind === "num") return v;
  if (type.kind === "bool") {
    const yes = /^true$/i.test(v);
    return dialect === "pg" ? String(yes) : yes ? "1" : "0";
  }
  return "'" + v.replace(/'/g, "''") + "'";
}

// Postgres phan biet hoa thuong khi ten duoc boc nhay kep. Dap an cua chuong nao
// co boc nhay kep thi DDL phai boc y het; con lai de chu thuong khong nhay,
// nhu vay viet khong nhay trong cau lenh van tim thay.
function quotedNames(chapterId) {
  const set = new Set();
  for (const ex of window.ALL_EXERCISES[chapterId] || []) {
    for (const a of ex.answers || []) {
      for (const m of String(a).matchAll(/"([A-Za-z_][A-Za-z0-9_]*)"/g)) set.add(m[1]);
    }
  }
  return set;
}

const q = {
  my: (n) => "`" + n + "`",
  pg: (n, quoted) => (quoted.has(n) ? '"' + n + '"' : n.toLowerCase())
};

const sqlSubject = window.SUBJECTS.find((s) => s.id === "sql");
const my = [], pg = [], index = [];

my.push("-- MySQL. Sinh tu build-sample-data.js, dung sua tay.");
my.push("-- Moi chuong mot database rieng. Nap: Get-Content sample-data.sql | mysql -u root -p");
my.push("");

pg.push("-- PostgreSQL. Sinh tu build-sample-data.js, dung sua tay.");
pg.push("-- Mot database notebook, moi chuong mot schema. Khong dung toi database cua du an.");
pg.push("-- Nap: psql -U postgres -d notebook -f sample-data-postgres.sql");
pg.push("");

for (const ch of sqlSubject.chapters) {
  const tables = (ch.dataset || []).filter((t) => IDENT.test(t.name));
  if (!tables.length) continue;

  index.push({ id: ch.id, title: ch.title, tables: tables.map((t) => t.name) });
  const quoted = quotedNames(ch.id);
  const banner = "-- ============ " + ch.title + " ============";

  my.push(banner);
  my.push("DROP DATABASE IF EXISTS nb_" + ch.id + ";");
  my.push("CREATE DATABASE nb_" + ch.id + " DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;");
  my.push("USE nb_" + ch.id + ";");
  my.push("");

  pg.push(banner);
  pg.push("DROP SCHEMA IF EXISTS " + ch.id + " CASCADE;");
  pg.push("CREATE SCHEMA " + ch.id + ";");
  pg.push("SET search_path TO " + ch.id + ";");
  pg.push("");

  for (const t of tables) {
    const cols = t.head.map(plain);
    const rows = t.rows.map((r) => r.map(plain));
    const types = cols.map((c, i) => columnType(rows.map((r) => r[i])));

    for (const [lines, d] of [[my, "my"], [pg, "pg"]]) {
      const name = (n) => q[d](n, quoted);
      lines.push("CREATE TABLE " + name(t.name) + " (");
      lines.push(cols.map((c, i) => "  " + name(c) + " " + types[i][d]).join(",\n"));
      lines.push(");");
      lines.push("");
      if (!rows.length) continue;
      lines.push("INSERT INTO " + name(t.name) + " (" + cols.map(name).join(", ") + ") VALUES");
      lines.push(rows.map((r) => "  (" + r.map((v, i) => sqlValue(v, types[i], d)).join(", ") + ")").join(",\n") + ";");
      lines.push("");
    }
  }
}

// File kiem chung: chay het dap an mau tren MySQL. Co cau nao loi la psql/mysql bao ngay.
const verify = [
  "-- Chay het dap an mau de chung minh cau nao cung chay duoc.",
  "-- Nap du lieu truoc:  Get-Content sample-data.sql | mysql -u root -p",
  "-- Roi chay file nay:  Get-Content verify-mysql.sql | mysql -u root -p",
  "-- Khong in ra loi nao nghia la tat ca deu chay duoc.",
  ""
];
for (const ch of sqlSubject.chapters) {
  const tables = (ch.dataset || []).filter((t) => IDENT.test(t.name));
  if (!tables.length) continue;
  const list = (window.ALL_EXERCISES[ch.id] || []).filter(
    (ex) => ex.type === "query" && /\bselect\b/i.test(ex.answers[0]) &&
      /\bfrom\b/i.test(ex.answers[0]) && !ex.answers[0].includes("?")
  );
  if (!list.length) continue;
  verify.push("-- ---- " + ch.title);
  verify.push("USE nb_" + ch.id + ";");
  list.forEach((ex) => {
    verify.push("-- " + ex.id);
    verify.push(ex.answers[0].replace(/;\s*$/, "") + ";");
  });
  verify.push("");
}

fs.writeFileSync("sample-data.sql", my.join("\n"), "utf8");
fs.writeFileSync("sample-data-postgres.sql", pg.join("\n"), "utf8");
fs.writeFileSync("verify-mysql.sql", verify.join("\n"), "utf8");
fs.writeFileSync("sample-data-index.json", JSON.stringify(index, null, 2), "utf8");

console.log("Da sinh sample-data.sql va sample-data-postgres.sql: " + index.length + " chuong");
index.forEach((i) => console.log("  " + i.id.padEnd(8) + " " + i.tables.join(", ")));
