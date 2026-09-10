// Ba muc chinh cua so tay. Phai nap sau cac file du lieu kia.
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
    tocIntro: "Ba chương đầu là PostgreSQL, dùng cho b2b.kamito.vn chạy Prisma. " +
      "Chương cuối là MySQL trên hệ ERP, kèm bảng đối chiếu cú pháp giữa hai hệ.",
    kind: "blocks",
    chapters: window.SQL_CHAPTERS.concat(window.MYSQL_CHAPTERS)
  },
  {
    id: "code",
    title: "Lập trình",
    tagline: "NestJS, TypeScript, Next.js — ghi chú rút từ code của bạn",
    tocIntro: "Những đoạn code đáng nhớ trong dự án, kèm lý do vì sao nó được viết như vậy " +
      "và những chỗ nếu làm khác đi thì hỏng.",
    kind: "blocks",
    chapters: window.SECURITY_CHAPTERS
  }
];

// Gop bai tap cua moi mon vao mot bang tra cuu chung theo id chuong.
window.ALL_EXERCISES = Object.assign(
  {}, window.EXERCISES, window.SQL_EXERCISES, window.MYSQL_EXERCISES, window.SECURITY_EXERCISES
);
