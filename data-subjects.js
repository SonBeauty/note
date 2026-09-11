// Ba muc chinh cua so tay. Phai nap sau cac file du lieu kia.

// Gop nhieu nhom chuong lai, bo qua nhom nao chua nap duoc.
// Khong co ham nay thi concat(undefined) se chen mot phan tu rong va lam vo trang.
function chapterGroups() {
  var out = [];
  for (var i = 0; i < arguments.length; i++) {
    if (Array.isArray(arguments[i])) out = out.concat(arguments[i]);
    else console.warn("Thiếu một nhóm chương, bỏ qua:", i);
  }
  return out;
}

window.SUBJECTS = [
  {
    id: "en",
    title: "Tiếng Anh",
    tagline: "Học theo chủ đề, làm bài và chấm điểm ngay trong sổ",
    tocIntro: "Sổ tay này ghi lại đúng những gì bạn đã học và những lỗi bạn đã mắc. " +
      "Mỗi chương gồm một trang bài học và một trang bài tập.",
    kind: "en",
    chapters: window.CHAPTERS
  },
  {
    id: "sql",
    title: "SQL",
    tagline: "PostgreSQL và MySQL, rút từ truy vấn thật trong dự án",
    tocIntro: "Bắt đầu bằng chương căn bản: từng mệnh đề là gì và chạy lúc nào. " +
      "Sau đó tới PostgreSQL của b2b, cuối cùng là MySQL trên hệ ERP. " +
      "Bài tập đều là cho sẵn bảng dữ liệu rồi bạn tự viết truy vấn.",
    kind: "blocks",
    chapters: chapterGroups(window.SQL_BASICS, window.SQL_CHAPTERS, window.MYSQL_CHAPTERS)
  },
  {
    id: "code",
    title: "Lập trình",
    tagline: "NestJS, TypeScript, Next.js — ghi chú rút từ code của bạn",
    tocIntro: "Những đoạn code đáng nhớ trong dự án, kèm lý do vì sao nó được viết như vậy " +
      "và những chỗ nếu làm khác đi thì hỏng.",
    kind: "blocks",
    chapters: chapterGroups(window.SECURITY_CHAPTERS, window.TRANSACTION_CHAPTERS, window.ALGO_CHAPTERS)
  }
];

// Gop bai tap cua moi mon vao mot bang tra cuu chung theo id chuong.
window.ALL_EXERCISES = Object.assign(
  {}, window.EXERCISES, window.SQL_BASICS_EXERCISES, window.SQL_EXERCISES,
  window.MYSQL_EXERCISES, window.SECURITY_EXERCISES, window.TRANSACTION_EXERCISES, window.ALGO_EXERCISES
);
