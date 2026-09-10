// Ghi chu rut tu apps/api/src/storage/upload-validation.util.ts cua du an b2b.kamito.vn.
window.SECURITY_CHAPTERS = [
  {
    id: "sec1",
    title: "Kiểm tra file tải lên",
    subtitle: "Content-Type khai báo và magic bytes",
    intro: "Content-Type do client tự khai nên không tin được. Magic bytes nằm trong chính nội dung file mới là bằng chứng. Hàm sniffMime trong dự án b2b làm đúng việc này.",
    blocks: [
      { t: "h", text: "Vì sao không tin Content-Type" },
      { t: "p", html: "Trong <code>multipart/form-data</code>, Content-Type của từng phần là do phía gửi tự điền. Trình duyệt điền tử tế, nhưng người dùng curl thì điền gì cũng được." },
      { t: "code", text: "curl -F 'file=@shell.exe;type=image/png' https://api.example.com/upload" },
      { t: "p", html: "Server nhận được <code>mimetype = \"image/png\"</code> trong khi nội dung là file thực thi. Nếu chỉ kiểm tra Content-Type thì file này lọt." },

      { t: "h", text: "Magic bytes là gì" },
      { t: "p", html: "Vài byte đầu tiên của file, do chính định dạng quy định, không đổi được mà vẫn giữ file hợp lệ." },
      { t: "table", head: ["Định dạng", "Byte đầu (hex)", "Đọc ra"],
        rows: [
          ["JPEG", "<code>FF D8 FF</code>", "không phải chữ"],
          ["PNG", "<code>89 50 4E 47</code>", "<code>\\x89PNG</code>"],
          ["WebP", "<code>52 49 46 46</code> … <code>57 45 42 50</code>", "<code>RIFF</code> … <code>WEBP</code>"],
          ["PDF", "<code>25 50 44 46</code>", "<code>%PDF</code>"]
        ] },
      { t: "code", text: "export function sniffMime(buf: Buffer): AllowedMime | null {\n  if (startsWith(buf, [0xff, 0xd8, 0xff])) return 'image/jpeg';\n  if (startsWith(buf, [0x89, 0x50, 0x4e, 0x47])) return 'image/png';\n  // \"RIFF\" .... \"WEBP\"\n  if (startsWith(buf, [0x52, 0x49, 0x46, 0x46]) && startsWith(buf, [0x57, 0x45, 0x42, 0x50], 8)) {\n    return 'image/webp';\n  }\n  if (startsWith(buf, [0x25, 0x50, 0x44, 0x46])) return 'application/pdf';\n  return null;\n}" },
      { t: "p", html: "WebP phải kiểm tra hai chỗ vì <code>RIFF</code> chỉ là vỏ container dùng chung, WAV và AVI cũng bắt đầu bằng <code>RIFF</code>. Chữ <code>WEBP</code> nằm ở byte thứ 8 mới là dấu hiệu thật." },
      { t: "hint", html: "<b>Chi tiết dễ bỏ sót:</b> <code>startsWith</code> kiểm tra <code>buf.length</code> trước khi so byte. Thiếu bước này thì một file cụt vài byte sẽ khiến <code>buf[offset + i]</code> trả <code>undefined</code>, so sánh ra kết quả khó lường thay vì trả null gọn gàng." },

      { t: "h", text: "Kiểm tra chéo hai nguồn" },
      { t: "code", text: "const sniffed = sniffMime(file.buffer);\nif (!sniffed) {\n  throw new BadRequestException('Chỉ chấp nhận ảnh JPEG/PNG/WebP hoặc PDF');\n}\nif (file.mimetype !== sniffed) {\n  throw new BadRequestException('Nội dung tệp không khớp với định dạng khai báo');\n}\nreturn sniffed;" },
      { t: "p", html: "Đây mới là chỗ hay. Không chỉ sniff rồi tin kết quả sniff, mà còn bắt Content-Type khai báo phải <b>trùng</b> với thứ sniff được." },
      { t: "table", head: ["Tình huống", "Content-Type khai", "Sniff ra", "Kết quả"],
        rows: [
          [".exe đổi tên thành .png", "<code>image/png</code>", "<code>null</code>", "Chặn ở bước sniff"],
          ["SVG khai là ảnh", "<code>image/png</code>", "<code>null</code>", "Chặn, SVG không có trong whitelist"],
          ["PNG thật nhưng khai sai", "<code>application/pdf</code>", "<code>image/png</code>", "Chặn ở bước đối chiếu"],
          ["PNG thật khai đúng", "<code>image/png</code>", "<code>image/png</code>", "Cho qua"]
        ] },
      { t: "p", html: "Dòng thứ ba là lý do phải đối chiếu. Nội dung file vô hại nhưng ý đồ khai sai thì vẫn loại, vì downstream có thể dựa vào mime khai báo để chọn cách xử lý." },
      { t: "hint", html: "SVG bị loại khỏi whitelist là có chủ đích. SVG là XML, chứa được <code>&lt;script&gt;</code>, mở trực tiếp trên cùng domain là dính stored XSS." },

      { t: "h", text: "Tên file người dùng không chạm tới ổ đĩa" },
      { t: "code", text: "export function buildStorageKey(mime, now = new Date(), folder = 'tickets') {\n  const yyyy = now.getUTCFullYear();\n  const mm = String(now.getUTCMonth() + 1).padStart(2, '0');\n  return `${folder}/${yyyy}-${mm}/${randomUUID()}.${EXTENSION_BY_MIME[mime]}`;\n}" },
      { t: "p", html: "Đuôi file lấy từ mime đã sniff, tên file là UUID ngẫu nhiên. Không một ký tự nào từ tên gốc lọt vào đường dẫn, nên chặn luôn hai chiêu quen thuộc: <code>../../etc/passwd</code> và đuôi kép kiểu <code>avatar.png.php</code>." },

      { t: "h", text: "Magic bytes không phải thuốc tiên" },
      { t: "p", html: "Nó chỉ trả lời được câu hỏi <i>đây có đúng là định dạng đó không</i>, không trả lời được <i>nội dung bên trong có sạch không</i>. Một file PDF hợp lệ vẫn nhúng được JavaScript, một ảnh JPEG hợp lệ vẫn giấu được payload." },
      { t: "hint", html: "Vì vậy vẫn cần đủ các lớp còn lại: giới hạn dung lượng và số file (dự án đang để 5MB và 5 file, đọc từ env), phục vụ file từ domain riêng, gắn <code>Content-Disposition: attachment</code>, và tuyệt đối không bao giờ thực thi file người dùng tải lên." }
    ]
  }
];
