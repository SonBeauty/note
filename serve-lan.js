// Mo so tay tu dien thoai qua WiFi nha ban. Chay: node serve-lan.js
// May tinh va dien thoai phai cung mot mang WiFi.
const http = require("http");
const fs = require("fs");
const os = require("os");
const path = require("path");

const PORT = 8899;
const ROOT = __dirname;
const TYPES = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".json": "application/json" };

http.createServer((req, res) => {
  const rel = decodeURIComponent(req.url.split("?")[0]);
  const file = path.join(ROOT, rel === "/" ? "index.html" : rel);
  // Chan truy cap ra ngoai thu muc so tay
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end("Không được phép"); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end("Không tìm thấy"); }
    res.writeHead(200, { "Content-Type": (TYPES[path.extname(file)] || "text/plain") + "; charset=utf-8" });
    res.end(data);
  });
}).listen(PORT, "0.0.0.0", () => {
  console.log("Sổ tay đang chạy. Mở các địa chỉ sau trên điện thoại:\n");
  const nets = os.networkInterfaces();
  Object.keys(nets).forEach((name) => {
    nets[name].forEach((net) => {
      if (net.family === "IPv4" && !net.internal) {
        console.log("   http://" + net.address + ":" + PORT + "   (" + name + ")");
      }
    });
  });
  console.log("\nTrên máy tính:  http://localhost:" + PORT);
  console.log("Bấm Ctrl+C để tắt.");
});
