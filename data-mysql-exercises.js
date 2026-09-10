// Bai tap MySQL, dang viet truy van tren bang ar_entries rut gon.
window.MYSQL_EXERCISES = {
  my1: [
    {
      id: "m1q1", type: "query",
      prompt: "Viết cột sign_debt: dòng Receipt giữ nguyên Debt, dòng còn lại đảo thành số âm.",
      want: "Kết quả mong đợi: 100, −40, 60.",
      hint: "Dùng CASE WHEN ... THEN ... ELSE ... END rồi đặt tên bằng AS.",
      must: [
        { re: "case\\s+when", label: "CASE WHEN" },
        { re: "recordtype", label: "điều kiện trên RecordType" },
        { re: "receipt", label: "'Receipt'" },
        { re: "else", label: "ELSE" },
        { re: "-\\s*debt", label: "-Debt" },
        { re: "sign_debt", label: "AS sign_debt" }
      ],
      answers: ["CASE WHEN RecordType = 'Receipt' THEN Debt ELSE -Debt END AS sign_debt"]
    },
    {
      id: "m1q2", type: "query",
      prompt: "Tính tổng công nợ của từng đại lý, dùng cột sign_debt vừa tạo.",
      want: "Kết quả mong đợi: An = 60, Bình = 60.",
      hint: "Gom nhóm theo Partner rồi cộng sign_debt.",
      must: [
        { re: "sum\\s*\\(", label: "SUM(...)" },
        { re: "group\\s+by\\s+partner", label: "GROUP BY Partner" }
      ],
      answers: ["SELECT Partner, SUM(sign_debt) AS tong_ar FROM ar_entries GROUP BY Partner;"]
    },
    {
      id: "m1q3", type: "query",
      prompt: "Thêm một cột nữa chỉ cộng phần đã quá hạn, tính trong cùng một lần quét bảng.",
      want: "Cột thứ hai chỉ cộng những dòng có ngày hẹn trả nhỏ hơn hôm nay.",
      hint: "Đặt CASE WHEN vào bên trong SUM, nhánh không thỏa thì cộng 0.",
      must: [
        { re: "sum\\s*\\(\\s*case\\s+when", label: "SUM(CASE WHEN ...)" },
        { re: "group\\s+by\\s+partner", label: "GROUP BY Partner" }
      ],
      answers: ["SELECT Partner, SUM(sign_debt) AS tong_ar, SUM(CASE WHEN PlannedRepaymentDate < CURDATE() THEN sign_debt ELSE 0 END) AS qua_han FROM ar_entries GROUP BY Partner;"]
    },
    {
      id: "m1q4", type: "query",
      prompt: "Viết điều kiện lọc dòng đã quá hạn sao cho MySQL vẫn dùng được index, biết PlannedRepaymentDate đúng kiểu DATE.",
      want: "Không bọc cột trong bất kỳ hàm nào.",
      hint: "Bỏ hết LEFT và DATE_FORMAT, so thẳng cột với hàm ngày hôm nay của MySQL.",
      must: [
        { re: "plannedrepaymentdate\\s*<", label: "PlannedRepaymentDate đứng một mình rồi tới dấu <" },
        { re: "curdate\\s*\\(\\s*\\)", label: "CURDATE()" }
      ],
      answers: ["WHERE PlannedRepaymentDate < CURDATE()"]
    }
  ]
};
