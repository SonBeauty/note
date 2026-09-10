// Bai tap cho chuong kiem tra file tai len.
window.SECURITY_EXERCISES = {
  sec1: [
    { id: "s1e1", type: "fill", prompt: "Bốn byte 89 50 4E 47 ở đầu file đọc ra thành chữ gì?",
      hint: "Ba byte sau là mã ASCII của ba chữ cái viết hoa.",
      answers: ["PNG"] },
    { id: "s1e2", type: "guess", prompt: "File .exe đổi tên thành avatar.png và khai Content-Type là image/png. sniffMime(buf) trả về gì?",
      hint: "Magic bytes của .exe không nằm trong whitelist.",
      answers: ["null", "trả về null"] },
    { id: "s1e3", type: "guess", prompt: "File PNG thật nhưng khai Content-Type là application/pdf. assertUploadAllowed có cho qua không?",
      hint: "Sniff ra image/png, khai báo lại là application/pdf. Hai thứ có khớp nhau không?",
      answers: ["không", "khong", "no"] },
    { id: "s1e4", type: "guess", prompt: "Thấy bốn byte RIFF ở đầu file đã đủ kết luận đó là WebP chưa?",
      hint: "WAV và AVI cũng mở đầu bằng RIFF.",
      answers: ["chưa", "chua", "không", "khong", "no"] },
    { id: "s1e5", type: "fill", prompt: "Định dạng ảnh bị loại khỏi whitelist vì nó là XML và nhúng được thẻ script: ___",
      hint: "Ảnh vector, đuôi ba chữ cái.",
      answers: ["SVG"] },
    { id: "s1e6", type: "fill", prompt: "Đuôi file trong storage key được lấy từ ___ đã sniff, không lấy từ tên file người dùng gửi lên.",
      hint: "Ba chữ cái, viết tắt của Multipurpose Internet Mail Extensions.",
      answers: ["mime", "mime type"] }
  ]
};
