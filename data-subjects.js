// Hai muc chinh cua so tay. Phai nap sau cac file du lieu kia.
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
    title: "Lập trình",
    tagline: "Ghi chú SQL rút từ chính truy vấn trong dự án của bạn",
    tocIntro: "Phần này đi từ cách ghép bảng tới cách tổng hợp số liệu, rồi soi lại " +
      "truy vấn thống kê size trong dự án. Mỗi chương cũng có một trang bài tập.",
    kind: "blocks",
    chapters: window.SQL_CHAPTERS
  }
];

// Gop bai tap cua moi mon vao mot bang tra cuu chung theo id chuong.
window.ALL_EXERCISES = Object.assign({}, window.EXERCISES, window.SQL_EXERCISES);

// Tra ve mon chua chuong nay.
window.subjectOfChapter = function (chapterId) {
  for (var i = 0; i < window.SUBJECTS.length; i++) {
    var s = window.SUBJECTS[i];
    for (var j = 0; j < s.chapters.length; j++) {
      if (s.chapters[j].id === chapterId) return s;
    }
  }
  return window.SUBJECTS[0];
};
