// Noi dung SQL, giu nguyen y tu ghi chu goc.
// Khoi noi dung: p (doan van), h (tieu de), table, code, hint, big, demo (vi du bam duoc).
window.SQL_CHAPTERS = [
  {
    id: "sql1",
    title: "JOIN trong PostgreSQL",
    subtitle: "INNER, LEFT, RIGHT và mệnh đề ON",
    intro: "Ghép dữ liệu giữa hai bảng bằng điều kiện ON. Ba loại JOIN khác nhau ở cách xử lý các dòng không khớp.",
    blocks: [
      { t: "h", text: "Nhớ nhanh" },
      { t: "table", head: ["Loại", "Giữ dòng nào?"],
        rows: [
          ["<b>INNER JOIN</b>", "Chỉ các cặp khớp ở cả hai bảng."],
          ["<b>LEFT JOIN</b>", "Mọi dòng bên trái. Không khớp thì phía phải là NULL."],
          ["<b>RIGHT JOIN</b>", "Mọi dòng bên phải. Không khớp thì phía trái là NULL."]
        ] },
      { t: "p", html: "Viết <code>JOIN</code> không thôi thì đó chính là <code>INNER JOIN</code>. Trái và phải là vị trí của bảng trong câu SQL, không phải vị trí trên màn hình." },

      { t: "h", text: "Thử từng loại JOIN" },
      { t: "demo" },
      { t: "p", html: "Dữ liệu giả định: <code>S9</code> không tồn tại trong bảng skus để minh họa dòng không khớp. Khóa ngoại trong thực tế thường ngăn trường hợp này xảy ra." },

      { t: "h", text: "ON khác WHERE thế nào" },
      { t: "p", html: "<code>ON</code> quyết định dòng nào được coi là khớp. <code>WHERE</code> lọc kết quả sau khi đã ghép." },
      { t: "code", text: "FROM skus s\nLEFT JOIN order_items oi\n  ON oi.\"skuId\" = s.id\n AND oi.qty >= 5" },
      { t: "p", html: "Giữ mọi SKU, chỉ ghép những dòng hàng có số lượng từ 5 trở lên." },
      { t: "code", text: "FROM skus s\nLEFT JOIN order_items oi ON oi.\"skuId\" = s.id\nWHERE oi.qty >= 5" },
      { t: "p", html: "Loại luôn cả SKU không có dòng hàng phù hợp, vì NULL không thỏa điều kiện WHERE." },
      { t: "hint", html: "<b>Dễ nhầm:</b> <code>LEFT JOIN ... WHERE b.id IS NOT NULL</code> loại hết dòng không khớp, làm mất tác dụng giữ dòng của LEFT JOIN. Ngoài ra một dòng bên trái có thể khớp nhiều dòng bên phải, nên chú ý bị cộng lặp khi dùng SUM." }
    ]
  },
  {
    id: "sql2",
    title: "Tổng hợp dữ liệu trong PostgreSQL",
    subtitle: "SUM, COUNT, ép kiểu ::int, GROUP BY",
    intro: "Bốn thứ hay đi cùng nhau khi tính toán số liệu trong PostgreSQL. Cùng một bộ dữ liệu qty = 3, 5, 2 xuyên suốt để dễ so sánh.",
    blocks: [
      { t: "h", text: "SUM cộng số lượng" },
      { t: "table", head: ["Dòng", "qty"], rows: [["OI1", "3"], ["OI2", "5"], ["OI3", "2"]] },
      { t: "big", text: "3 + 5 + 2 = 10" },
      { t: "code", text: "SELECT SUM(oi.qty) AS sold\nFROM order_items oi;\n-- sold = 10" },
      { t: "hint", html: "<b>Nhớ:</b> SUM cộng giá trị chứ không đếm số dòng. SUM bỏ qua NULL, và nếu không có giá trị nào để cộng thì trả về NULL chứ không phải 0." },

      { t: "h", text: "COUNT đếm số dòng" },
      { t: "p", html: "Vẫn bộ dữ liệu qty = 3, 5, 2: tổng là 10 nhưng số dòng chỉ là 3." },
      { t: "table", head: ["Biểu thức", "Kết quả", "Ý nghĩa"],
        rows: [
          ["<code>SUM(oi.qty)</code>", "10", "Cộng số lượng"],
          ["<code>COUNT(*)</code>", "3", "Đếm mọi dòng"],
          ["<code>COUNT(oi.qty)</code>", "3", "Đếm các qty khác NULL"]
        ] },
      { t: "code", text: "SELECT SUM(oi.qty) AS total_qty,\n       COUNT(*) AS item_rows\nFROM order_items oi;" },
      { t: "hint", html: "Số dòng hàng không phải số đơn. Muốn đếm số đơn khác nhau thì dùng <code>COUNT(DISTINCT oi.\"orderId\")</code>." },

      { t: "h", text: "Dấu :: để ép kiểu" },
      { t: "code", text: "SUM(oi.qty)::int AS sold\n└─ cộng qty   └─ đổi sang integer" },
      { t: "p", html: "<code>::int</code> không phải phép đếm, nó chỉ đổi kiểu dữ liệu của kết quả. Đây là cú pháp riêng của PostgreSQL, dạng <code>biểu_thức::kiểu</code>." },
      { t: "code", text: "SUM(oi.qty)::int\nCAST(SUM(oi.qty) AS integer)" },
      { t: "p", html: "Hai cách viết trên tương đương. Trong schema thì qty là Int, nhưng PostgreSQL trả <code>SUM(integer)</code> dưới dạng bigint, nên <code>::int</code> đưa tổng về lại integer." },
      { t: "hint", html: "Nếu tổng vượt phạm vi integer (−2.147.483.648 đến 2.147.483.647) thì phép ép kiểu sẽ báo lỗi." },

      { t: "h", text: "GROUP BY gom nhóm" },
      { t: "p", html: "Chia dữ liệu thành từng nhóm rồi tính SUM hoặc COUNT cho mỗi nhóm." },
      { t: "table", head: ["Size", "Các qty", "SUM", "COUNT(*)"],
        rows: [["M", "3, 5", "8", "2"], ["L", "2", "2", "1"]] },
      { t: "code", text: "SELECT s.option2 AS size,\n       SUM(oi.qty)::int AS sold\nFROM order_items oi\nJOIN skus s ON s.id = oi.\"skuId\"\nGROUP BY s.option2;" },
      { t: "hint", html: "Cùng size sẽ được cộng chung kể cả khác màu. Không có <code>ORDER BY</code> thì thứ tự kết quả trả về không được bảo đảm." }
    ]
  },
  {
    id: "sql3",
    title: "Truy vấn thống kê size (PostgreSQL + Prisma)",
    subtitle: "Schema b2b.kamito.vn và cách ráp truy vấn",
    intro: "Đọc lại truy vấn thật của bạn theo quan hệ giữa các bảng, kèm những chỗ dễ hiểu sai.",
    blocks: [
      { t: "h", text: "Quan hệ giữa các bảng" },
      { t: "code", text: "products  1 → N  skus  1 → N  order_items  N ← 1  orders" },
      { t: "p", html: "<code>oi.\"skuId\" → s.id</code> để lấy size từ SKU.<br><code>oi.\"orderId\" → o.id</code> để lấy trạng thái và ngày tạo đơn." },
      { t: "p", html: "Truy vấn của bạn dùng hai <b>INNER JOIN</b>, lọc đơn CONFIRMED hoặc EXPORTED tạo trong 12 tháng gần đây, rồi <code>SUM(oi.qty)</code> theo <code>s.option2</code>. Size nào không có dòng hàng phù hợp sẽ không xuất hiện trong kết quả." },

      { t: "h", text: "Điều kiện cần nhớ" },
      { t: "p", html: "<code>option2 ~ '^[A-Za-z]+$'</code> nhận M, XL, XXL nhưng loại 2XL, loại 38 và loại cả chuỗi có khoảng trắng." },
      { t: "p", html: "<code>createdAt</code> là ngày tạo đơn, không phải ngày xuất hàng." },
      { t: "p", html: "Schema có cả <code>option2</code> lẫn <code>Size</code>, truy vấn hiện tại đang dùng <code>option2</code>." },
      { t: "p", html: "<code>sold</code> chỉ là tên cột kết quả, bản thân nó không chứng minh đơn đã giao hay đã thanh toán." },
      { t: "hint", html: "Vì dùng INNER JOIN nên size chưa bán được cái nào sẽ biến mất khỏi báo cáo. Muốn hiện đủ mọi size kể cả bằng 0 thì phải đổi sang LEFT JOIN từ bảng skus." }
    ]
  }
];
