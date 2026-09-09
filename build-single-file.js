// Gop toan bo so tay thanh MOT file HTML duy nhat de mang sang dien thoai.
// Chay: node build-single-file.js
const fs = require("fs");
const path = require("path");

const dir = __dirname;
const out = path.join(dir, "so-tay-tieng-anh.html");
const read = (f) => fs.readFileSync(path.join(dir, f), "utf8");

let html = read("index.html");

// Nhung CSS vao thay cho the <link>
html = html.replace(
  /<link rel="stylesheet" href="([^"]+)">/g,
  (_, file) => "<style>\n" + read(file) + "\n</style>"
);

// Nhung tung file JS vao thay cho the <script src>
html = html.replace(
  /<script src="([^"]+)"><\/script>/g,
  (_, file) => "<script>\n" + read(file) + "\n</script>"
);

fs.writeFileSync(out, html, "utf8");
const kb = (Buffer.byteLength(html, "utf8") / 1024).toFixed(1);
console.log("Đã tạo " + path.basename(out) + " (" + kb + " KB)");
console.log("Gửi file này qua Zalo hoặc Google Drive rồi mở bằng Chrome trên điện thoại.");
