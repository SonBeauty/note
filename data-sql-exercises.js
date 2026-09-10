// Bai tap PostgreSQL, dang viet truy van tren bo du lieu mau cua tung chuong.
window.SQL_EXERCISES = {
  sql1: [
    {
      id: "c1q1", type: "query",
      prompt: "Ghép order_items với skus để mỗi dòng hàng có thêm cột size.",
      want: "Kết quả mong đợi: 1 dòng, OI1 với size M.",
      hint: "JOIN không kèm gì thì là INNER JOIN, chỉ giữ cặp khớp cả hai bên.",
      must: [
        { re: "from\\s+order_items", label: "FROM order_items" },
        { re: "join\\s+skus", label: "JOIN skus" },
        { re: "\\bon\\b", label: "ON điều kiện ghép" }
      ],
      answers: ["SELECT oi.id, s.size FROM order_items oi JOIN skus s ON s.id = oi.sku_id;"]
    },
    {
      id: "c1q2", type: "query",
      prompt: "Lấy mọi dòng hàng, kể cả dòng không khớp SKU nào.",
      want: "Kết quả mong đợi: OI1 với size M, và OI2 với size NULL.",
      hint: "Giữ hết bảng bên trái thì dùng loại JOIN nào?",
      must: [
        { re: "from\\s+order_items", label: "FROM order_items" },
        { re: "left\\s+join\\s+skus", label: "LEFT JOIN skus" },
        { re: "\\bon\\b", label: "ON điều kiện ghép" }
      ],
      answers: ["SELECT oi.id, s.size FROM order_items oi LEFT JOIN skus s ON s.id = oi.sku_id;"]
    },
    {
      id: "c1q3", type: "query",
      prompt: "Đi từ bảng skus, lấy mọi SKU kể cả SKU chưa bán được cái nào.",
      want: "Kết quả mong đợi: S1 khớp OI1, S2 không khớp gì nên phía dòng hàng là NULL.",
      hint: "Đổi bảng đứng đầu FROM rồi vẫn dùng LEFT JOIN, không cần RIGHT JOIN.",
      must: [
        { re: "from\\s+skus", label: "FROM skus" },
        { re: "left\\s+join\\s+order_items", label: "LEFT JOIN order_items" },
        { re: "\\bon\\b", label: "ON điều kiện ghép" }
      ],
      answers: ["SELECT s.id, oi.id FROM skus s LEFT JOIN order_items oi ON oi.sku_id = s.id;"]
    },
    {
      id: "c1q4", type: "query",
      prompt: "Đếm số dòng hàng của từng size, size chưa bán được cái nào vẫn phải hiện với số 0.",
      want: "Kết quả mong đợi: M = 1, L = 0.",
      hint: "LEFT JOIN từ skus, rồi đếm cột bên bảng order_items chứ đừng đếm COUNT(*), vì COUNT(*) đếm cả dòng NULL thành 1.",
      must: [
        { re: "from\\s+skus", label: "FROM skus" },
        { re: "left\\s+join\\s+order_items", label: "LEFT JOIN order_items" },
        { re: "count\\s*\\(", label: "COUNT(...)" },
        { re: "group\\s+by", label: "GROUP BY" }
      ],
      answers: ["SELECT s.size, COUNT(oi.id) FROM skus s LEFT JOIN order_items oi ON oi.sku_id = s.id GROUP BY s.size;"]
    }
  ],

  sql2: [
    {
      id: "c2q1", type: "query",
      prompt: "Tính tổng qty của toàn bộ dòng hàng.",
      want: "Kết quả mong đợi: 10.",
      hint: "Không cần GROUP BY khi gộp cả bảng thành một con số.",
      must: [
        { re: "sum\\s*\\(\\s*(oi\\.)?qty", label: "SUM(qty)" },
        { re: "from\\s+order_items", label: "FROM order_items" }
      ],
      answers: ["SELECT SUM(qty) AS sold FROM order_items;"]
    },
    {
      id: "c2q2", type: "query",
      prompt: "Đếm xem có bao nhiêu dòng hàng.",
      want: "Kết quả mong đợi: 3, khác hẳn con số 10 ở câu trên.",
      hint: "Đếm dòng chứ không cộng giá trị.",
      must: [
        { re: "count\\s*\\(", label: "COUNT(...)" },
        { re: "from\\s+order_items", label: "FROM order_items" }
      ],
      answers: ["SELECT COUNT(*) AS item_rows FROM order_items;"]
    },
    {
      id: "c2q3", type: "query",
      prompt: "Tính tổng qty theo từng size.",
      want: "Kết quả mong đợi: M = 8, L = 2.",
      hint: "size nằm ở bảng skus nên phải ghép bảng trước rồi mới gom nhóm.",
      must: [
        { re: "sum\\s*\\(\\s*(oi\\.)?qty", label: "SUM(qty)" },
        { re: "join\\s+skus", label: "JOIN skus" },
        { re: "group\\s+by", label: "GROUP BY size" }
      ],
      answers: ["SELECT s.size, SUM(oi.qty) AS sold FROM order_items oi JOIN skus s ON s.id = oi.sku_id GROUP BY s.size;"]
    },
    {
      id: "c2q4", type: "query",
      prompt: "Vẫn tổng qty theo size, nhưng chỉ giữ size bán được từ 5 trở lên.",
      want: "Kết quả mong đợi: chỉ còn M = 8.",
      hint: "Điều kiện đặt trên kết quả của SUM nên không thể để trong WHERE.",
      must: [
        { re: "sum\\s*\\(\\s*(oi\\.)?qty", label: "SUM(qty)" },
        { re: "group\\s+by", label: "GROUP BY size" },
        { re: "having", label: "HAVING" }
      ],
      answers: ["SELECT s.size, SUM(oi.qty) AS sold FROM order_items oi JOIN skus s ON s.id = oi.sku_id GROUP BY s.size HAVING SUM(oi.qty) >= 5;"]
    },
    {
      id: "c2q5", type: "query",
      prompt: "Tính tổng qty theo size và ép kết quả về kiểu integer, viết theo cú pháp PostgreSQL.",
      want: "Kết quả mong đợi: M = 8, L = 2, kiểu integer thay vì bigint.",
      hint: "Hai dấu hai chấm rồi tới tên kiểu, hoặc dùng CAST.",
      must: [
        { re: "sum\\s*\\(\\s*(oi\\.)?qty", label: "SUM(qty)" },
        { re: "::\\s*int|cast\\s*\\(", label: "::int hoặc CAST" },
        { re: "group\\s+by", label: "GROUP BY size" }
      ],
      answers: ["SELECT s.size, SUM(oi.qty)::int AS sold FROM order_items oi JOIN skus s ON s.id = oi.sku_id GROUP BY s.size;"]
    }
  ],

  sql3: [
    {
      id: "c3q1", type: "query",
      prompt: "Tính số lượng bán theo từng size, ghép order_items với skus và gom theo cột option2.",
      want: "Đây là bộ khung của truy vấn thống kê size trong b2b.",
      hint: "Tên cột có chữ hoa trong PostgreSQL thì bọc trong nháy kép: oi.\"skuId\".",
      must: [
        { re: "sum\\s*\\(", label: "SUM(...)" },
        { re: "join\\s+skus", label: "JOIN skus" },
        { re: "group\\s+by", label: "GROUP BY" },
        { re: "option2", label: "option2" }
      ],
      answers: ["SELECT s.option2 AS size, SUM(oi.qty)::int AS sold FROM order_items oi JOIN skus s ON s.id = oi.\"skuId\" GROUP BY s.option2;"]
    },
    {
      id: "c3q2", type: "query",
      prompt: "Thêm điều kiện chỉ tính những đơn có status là CONFIRMED hoặc EXPORTED.",
      want: "Phải ghép thêm bảng orders mới có cột status để lọc.",
      hint: "Ghép thêm orders rồi lọc bằng IN, vì đây là điều kiện trên từng dòng nên đặt ở WHERE.",
      must: [
        { re: "join\\s+orders", label: "JOIN orders" },
        { re: "where", label: "WHERE" },
        { re: "status", label: "điều kiện trên status" },
        { re: "confirmed", label: "CONFIRMED" },
        { re: "exported", label: "EXPORTED" }
      ],
      answers: ["SELECT s.option2, SUM(oi.qty)::int FROM order_items oi JOIN skus s ON s.id = oi.\"skuId\" JOIN orders o ON o.id = oi.\"orderId\" WHERE o.status IN ('CONFIRMED', 'EXPORTED') GROUP BY s.option2;"]
    },
    {
      id: "c3q3", type: "query",
      prompt: "Sửa lại để size chưa bán được cái nào vẫn xuất hiện trong báo cáo.",
      want: "Đổi chiều: đi từ bảng skus và dùng LEFT JOIN.",
      hint: "INNER JOIN làm biến mất size không có dòng hàng. Đặt skus lên đầu FROM rồi LEFT JOIN sang order_items.",
      must: [
        { re: "from\\s+skus", label: "FROM skus" },
        { re: "left\\s+join\\s+order_items", label: "LEFT JOIN order_items" },
        { re: "group\\s+by", label: "GROUP BY" }
      ],
      answers: ["SELECT s.option2, COALESCE(SUM(oi.qty), 0)::int AS sold FROM skus s LEFT JOIN order_items oi ON oi.\"skuId\" = s.id GROUP BY s.option2;"]
    }
  ]
};
