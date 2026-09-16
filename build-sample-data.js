// Sinh file sample-data.sql tu chinh cac bang mau trong so tay.
// Moi chuong mot database rieng, vi bang "orders" co nhieu hinh dang khac nhau
// giua cac chuong nen khong the dung chung mot schema.
// Chay: node build-sample-data.js
const fs = require("fs");
const path = require("path");

const dir = __dirname;
process.chdir(dir);

const html = fs.readFileSync("index.html", "utf8");
global.window = {};
[...html.matchAll(/src="(data-[^"]+)"/g)]
  .map((m) => m[1])
  .forEach((f) => eval(fs.readFileSync(f, "utf8")));

const IDENT = /^[A-Za-z_][A-Za-z0-9_]*$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const INT = /^-?\d+$/;
const DEC = /^-?\d+\.\d+$/;

// Doan kieu cot tu toan bo gia tri cua cot do
function columnType(name, values) {
  const clean = values.map((v) => String(v).trim()).filter((v) => v !== "" && v.toUpperCase() !== "NULL");
  if (clean.length && clean.every((v) => DATE.test(v))) return "DATE";
  if (clean.length && clean.every((v) => INT.test(v))) {
    return /id$/i.test(name) ? "INT" : "INT";
  }
  if (clean.length && clean.every((v) => INT.test(v) || DEC.test(v))) return "DECIMAL(18,2)";
  if (clean.length && clean.every((v) => /^(true|false)$/i.test(v))) return "TINYINT(1)";
  const max = Math.max(20, ...clean.map((v) => v.length + 20));
  return "VARCHAR(" + Math.min(255, max) + ")";
}

function sqlValue(v, type) {
  const s = String(v).trim();
  if (s === "" || s.toUpperCase() === "NULL") return "NULL";
  if (type === "INT" || type.startsWith("DECIMAL")) return s;
  if (type === "TINYINT(1)") return /^true$/i.test(s) ? "1" : "0";
  return "'" + s.replace(/'/g, "''") + "'";
}

// Bo thang HTML lot trong o du lieu, vi bang mau hien tren trang co the co the <code>
function plain(v) {
  return String(v).replace(/<[^>]+>/g, "").trim();
}

const sqlSubject = window.SUBJECTS.find((s) => s.id === "sql");
const out = [];
const index = [];

out.push("-- Du lieu mau cua so tay, sinh tu build-sample-data.js. Dung sua tay.");
out.push("-- Moi chuong mot database rieng vi cac chuong dung bang cung ten nhung khac cot.");
out.push("-- Nap: mysql -u root -p < sample-data.sql");
out.push("");

for (const ch of sqlSubject.chapters) {
  const tables = (ch.dataset || []).filter((t) => IDENT.test(t.name));
  if (!tables.length) continue;

  const db = "nb_" + ch.id;
  index.push({ db: db, title: ch.title, tables: tables.map((t) => t.name) });

  out.push("-- ===================================================================");
  out.push("-- " + ch.title);
  out.push("-- ===================================================================");
  out.push("DROP DATABASE IF EXISTS " + db + ";");
  out.push("CREATE DATABASE " + db + " DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;");
  out.push("USE " + db + ";");
  out.push("");

  for (const t of tables) {
    const cols = t.head.map(plain);
    const rows = t.rows.map((r) => r.map(plain));
    const types = cols.map((c, i) => columnType(c, rows.map((r) => r[i])));

    out.push("CREATE TABLE `" + t.name + "` (");
    out.push(cols.map((c, i) => "  `" + c + "` " + types[i]).join(",\n"));
    out.push(") ENGINE=InnoDB;");
    out.push("");

    if (rows.length) {
      out.push("INSERT INTO `" + t.name + "` (" + cols.map((c) => "`" + c + "`").join(", ") + ") VALUES");
      out.push(rows.map((r) => "  (" + r.map((v, i) => sqlValue(v, types[i])).join(", ") + ")").join(",\n") + ";");
      out.push("");
    }
  }
}

fs.writeFileSync("sample-data.sql", out.join("\n"), "utf8");
fs.writeFileSync("sample-data-index.json", JSON.stringify(index, null, 2), "utf8");

console.log("Da sinh sample-data.sql: " + index.length + " database");
index.forEach((i) => console.log("  " + i.db.padEnd(12) + " " + i.tables.join(", ")));
