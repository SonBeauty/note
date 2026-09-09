// Bai tap SQL. type: fill (dien tu khoa), guess (doan ket qua), sql (viet menh de).
// Ca ba deu cham khong phan biet hoa thuong vi tu khoa SQL viet kieu nao cung dung.
window.SQL_EXERCISES = {
  sql1: [
    { id: "q1e1", type: "fill", prompt: "Muốn giữ mọi dòng của bảng bên trái thì dùng ___ JOIN.",
      hint: "Bảng bên trái là bảng viết sau FROM.",
      answers: ["LEFT"] },
    { id: "q1e2", type: "fill", prompt: "Viết JOIN không thôi thì thực chất là ___ JOIN.",
      hint: "Loại chỉ giữ các cặp khớp ở cả hai bảng.",
      answers: ["INNER"] },
    { id: "q1e3", type: "fill", prompt: "Điều kiện ghép hai bảng được viết sau từ khóa ___.",
      hint: "Không phải WHERE.",
      answers: ["ON"] },
    { id: "q1e4", type: "guess", prompt: "order_items có OI1→S1 và OI2→S9, bảng skus chỉ có S1 và S2. INNER JOIN trả về mấy dòng?",
      hint: "Chỉ đếm cặp khớp được ở cả hai bên. S9 không tồn tại.",
      answers: ["1", "1 dòng", "một"] },
    { id: "q1e5", type: "guess", prompt: "Vẫn dữ liệu đó, LEFT JOIN từ order_items sang skus trả về mấy dòng?",
      hint: "Giữ hết dòng bên trái, dòng không khớp thì phía phải là NULL.",
      answers: ["2", "2 dòng", "hai"] }
  ],
  sql2: [
    { id: "q2e1", type: "guess", prompt: "Ba dòng hàng có qty là 3, 5 và 2. SUM(oi.qty) bằng bao nhiêu?",
      hint: "Cộng lại, đừng đếm số dòng.",
      answers: ["10"] },
    { id: "q2e2", type: "guess", prompt: "Vẫn ba dòng đó, COUNT(*) bằng bao nhiêu?",
      hint: "COUNT đếm số dòng chứ không cộng giá trị.",
      answers: ["3"] },
    { id: "q2e3", type: "fill", prompt: "Ép tổng về kiểu integer trong PostgreSQL: SUM(oi.qty)___",
      hint: "Hai dấu hai chấm rồi tới tên kiểu.",
      answers: ["::int", "::integer"] },
    { id: "q2e4", type: "guess", prompt: "Gom nhóm theo size: M có qty 3 và 5, L có qty 2. SUM của nhóm M bằng bao nhiêu?",
      hint: "Chỉ cộng các qty thuộc nhóm M.",
      answers: ["8"] },
    { id: "q2e5", type: "sql", prompt: "Viết mệnh đề gom nhóm kết quả theo cột s.option2.",
      hint: "Hai từ khóa rồi tới tên cột.",
      answers: ["GROUP BY s.option2"] }
  ],
  sql3: [
    { id: "q3e1", type: "fill", prompt: "Cột dùng để nối order_items sang bảng skus là oi.___",
      hint: "Trong schema nó được viết có dấu nháy kép vì chữ hoa chữ thường.",
      answers: ["skuId", "\"skuId\""] },
    { id: "q3e2", type: "guess", prompt: "Điều kiện option2 ~ '^[A-Za-z]+$' có nhận giá trị 2XL không?",
      hint: "Mẫu này chỉ cho phép chữ cái, mà 2XL bắt đầu bằng chữ số.",
      answers: ["không", "khong", "no", "không nhận"] },
    { id: "q3e3", type: "fill", prompt: "createdAt là ngày ___ đơn, không phải ngày xuất hàng.",
      hint: "Một từ tiếng Việt.",
      answers: ["tạo", "tao"] },
    { id: "q3e4", type: "sql", prompt: "Viết mệnh đề ghép bảng skus vào order_items, đặt bí danh là s.",
      hint: "Dạng JOIN <bảng> <bí danh> ON <điều kiện>. Cột skuId cần dấu nháy kép.",
      answers: ["JOIN skus s ON s.id = oi.\"skuId\"", "INNER JOIN skus s ON s.id = oi.\"skuId\""] }
  ]
};
