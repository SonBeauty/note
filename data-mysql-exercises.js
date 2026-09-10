// Bai tap cho chuong bao cao cong no MySQL.
window.MYSQL_EXERCISES = {
  my1: [
    { id: "m1e1", type: "fill", prompt: "Truy vấn con nằm trong FROM và bắt buộc phải có bí danh gọi là ___ table (tiếng Anh).",
      hint: "Nghĩa là bảng được dẫn xuất ra từ một truy vấn khác.",
      answers: ["derived"] },
    { id: "m1e2", type: "guess", prompt: "MySQL dùng IFNULL, PostgreSQL dùng hàm nào tương đương?",
      hint: "Hàm chuẩn SQL, cả hai hệ đều hiểu, nhận nhiều đối số.",
      answers: ["COALESCE"] },
    { id: "m1e3", type: "guess", prompt: "HAVING tong_ar <> 0 dùng bí danh của cột kết quả. Câu này chạy được trên PostgreSQL không?",
      hint: "PostgreSQL chỉ cho dùng bí danh trong GROUP BY và ORDER BY.",
      answers: ["không", "khong", "no"] },
    { id: "m1e4", type: "fill", prompt: "Bọc cột trong hàm ở WHERE làm mất khả năng dùng index, thuật ngữ tiếng Anh là non-___",
      hint: "Từ này bắt nguồn từ Search ARGument ABLE.",
      answers: ["sargable"] },
    { id: "m1e5", type: "guess", prompt: "Điều kiện IFNULL(Active, 0) = 1 rút gọn được thành gì?",
      hint: "NULL thay bằng 0 thì không bao giờ bằng 1, nên nhánh NULL là thừa.",
      answers: ["Active = 1", "Active=1"] },
    { id: "m1e6", type: "guess", prompt: "CURDATE() của MySQL tương ứng với gì trong PostgreSQL?",
      hint: "Hai từ nối bằng gạch dưới, không có dấu ngoặc.",
      answers: ["CURRENT_DATE"] },
    { id: "m1e7", type: "sql", prompt: "Viết lại điều kiện lọc ngày quá hạn cho dùng được index, giả sử cột đúng kiểu DATE.",
      hint: "Bỏ hết LEFT và DATE_FORMAT đi, so thẳng cột với hàm ngày hôm nay.",
      answers: ["x.PlannedRepaymentDate < CURDATE()", "PlannedRepaymentDate < CURDATE()"] }
  ]
};
