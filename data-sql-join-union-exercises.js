// Bai tap cho sqlc3 (JOIN), sqlc4 (UNION), sqlc5 (index).
window.SQL_JOIN_UNION_EXERCISES = {
  sqlc3: [
    {
      id: "c3x1", type: "query",
      prompt: "Liệt kê tên mọi đại lý kèm id đơn CONFIRMED của họ. Đại lý chưa có đơn CONFIRMED nào vẫn phải xuất hiện, cột đơn để trống.",
      want: "Kết quả mong đợi: 3 dòng — Hà Nội/O1, Đà Nẵng/O3, Cần Thơ/NULL.",
      hint: "Điều kiện lọc áp lên bảng PHẢI của LEFT JOIN. Đặt nó ở WHERE là mất dòng Cần Thơ.",
      must: [
        { re: "select", label: "SELECT" },
        { re: "from\\s+partners", label: "FROM partners (bảng trái)" },
        { re: "left\\s+join\\s+orders", label: "LEFT JOIN orders" },
        { re: "on\\s+.*\"?partnerid\"?\\s*=", label: "ON o.\"partnerId\" = p.id" },
        { re: "and\\s+.*status", label: "AND ... status = 'CONFIRMED' nằm TRONG ON" }
      ],
      answers: ["SELECT p.name, o.id FROM partners p LEFT JOIN orders o ON o.\"partnerId\" = p.id AND o.status = 'CONFIRMED';"]
    },
    {
      id: "c3x2", type: "query",
      prompt: "Tìm những đại lý chưa đặt đơn nào, dùng LEFT JOIN.",
      want: "Kết quả mong đợi: Đại lý Cần Thơ.",
      hint: "Ghép xong thì dòng không khớp có phía bảng phải toàn NULL. Giữ lại đúng những dòng đó.",
      must: [
        { re: "select", label: "SELECT" },
        { re: "from\\s+partners", label: "FROM partners" },
        { re: "left\\s+join\\s+orders", label: "LEFT JOIN orders" },
        { re: "where\\s+o?\\.?\"?id\"?\\s+is\\s+null", label: "WHERE o.id IS NULL" }
      ],
      answers: ["SELECT p.id, p.name FROM partners p LEFT JOIN orders o ON o.\"partnerId\" = p.id WHERE o.id IS NULL;"]
    },
    {
      id: "c3x3", type: "query",
      prompt: "Vẫn là đại lý chưa đặt đơn nào, nhưng viết theo cách thứ hai — không dùng JOIN.",
      want: "Kết quả mong đợi: Đại lý Cần Thơ.",
      hint: "Hỏi ngược: với mỗi đại lý, có tồn tại đơn nào trỏ về nó không?",
      must: [
        { re: "not\\s+exists", label: "NOT EXISTS" },
        { re: "select\\s+1\\s+from\\s+orders", label: "SELECT 1 FROM orders (truy vấn con)" },
        { re: "\"?partnerid\"?\\s*=", label: "điều kiện nối o.\"partnerId\" = p.id" }
      ],
      answers: ["SELECT p.id, p.name FROM partners p WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.\"partnerId\" = p.id);"]
    },
    {
      id: "c3x4", type: "query",
      prompt: "Doanh thu theo TÊN đại lý: tổng total các đơn CONFIRMED. Đại lý chưa có đơn phải hiện số 0, sắp xếp giảm dần.",
      want: "Kết quả mong đợi: Hà Nội = 1200000, Đà Nẵng = 500000, Cần Thơ = 0.",
      hint: "Ba thứ ghép lại: LEFT JOIN với điều kiện status nằm trong ON, COALESCE để NULL thành 0, GROUP BY theo tên.",
      must: [
        { re: "select", label: "SELECT" },
        { re: "from\\s+partners", label: "FROM partners" },
        { re: "left\\s+join\\s+orders", label: "LEFT JOIN orders" },
        { re: "and\\s+.*status", label: "AND status = 'CONFIRMED' nằm trong ON" },
        { re: "coalesce\\s*\\(\\s*sum", label: "COALESCE(SUM(...), 0)" },
        { re: "group\\s+by\\s+p?\\.?name", label: "GROUP BY p.name" },
        { re: "order\\s+by", label: "ORDER BY" }
      ],
      answers: ["SELECT p.name, COALESCE(SUM(o.total), 0) AS doanh_thu FROM partners p LEFT JOIN orders o ON o.\"partnerId\" = p.id AND o.status = 'CONFIRMED' GROUP BY p.name ORDER BY doanh_thu DESC;"]
    }
  ],

  sqlc4: [
    {
      id: "c4x1", type: "query",
      prompt: "Gộp đơn của hai hệ vào một danh sách: bảng orders (cột id, total) và bảng one_c_sales_orders (cột id, amount). Thêm một cột cho biết dòng đó đến từ hệ nào, giữ nguyên cả dòng trùng.",
      want: "Kết quả mong đợi: mọi dòng của cả hai bảng, cột nguồn ghi 'b2b' hoặc '1c'.",
      hint: "Giữ nguyên dòng trùng thì không dùng phép có khử trùng lặp. Cột hằng đặt bí danh như cột thường.",
      must: [
        { re: "select", label: "SELECT" },
        { re: "union\\s+all", label: "UNION ALL" },
        { re: "from\\s+orders", label: "FROM orders" },
        { re: "from\\s+one_c_sales_orders", label: "FROM one_c_sales_orders" },
        { re: "'b2b'", label: "'b2b' AS nguon" },
        { re: "'1c'", label: "'1c' AS nguon" }
      ],
      answers: ["SELECT id, total, 'b2b' AS nguon FROM orders UNION ALL SELECT id, amount, '1c' AS nguon FROM one_c_sales_orders;"]
    },
    {
      id: "c4x2", type: "query",
      prompt: "Lấy danh sách partnerId xuất hiện ở CẢ hai bảng orders và one_c_sales_orders.",
      want: "Kết quả mong đợi: phần giao của hai danh sách.",
      hint: "Có một phép chuyên làm việc này, không cần JOIN.",
      must: [
        { re: "select", label: "SELECT" },
        { re: "intersect", label: "INTERSECT" },
        { re: "from\\s+orders", label: "FROM orders" },
        { re: "from\\s+one_c_sales_orders", label: "FROM one_c_sales_orders" }
      ],
      answers: ["SELECT \"partnerId\" FROM orders INTERSECT SELECT \"partnerId\" FROM one_c_sales_orders;"]
    },
    {
      id: "c4x3", type: "query",
      prompt: "Lấy partnerId có đơn trên b2b nhưng CHƯA có đơn nào bên 1C.",
      want: "Kết quả mong đợi: phần của bảng orders trừ đi phần của one_c_sales_orders.",
      hint: "Phép hiệu của hai tập. MySQL không có phép này, nó gọi tên khác.",
      must: [
        { re: "select", label: "SELECT" },
        { re: "except", label: "EXCEPT" },
        { re: "from\\s+orders", label: "FROM orders" },
        { re: "from\\s+one_c_sales_orders", label: "FROM one_c_sales_orders" }
      ],
      answers: ["SELECT \"partnerId\" FROM orders EXCEPT SELECT \"partnerId\" FROM one_c_sales_orders;"]
    }
  ],

  sqlc5: [
    {
      id: "c5x1", type: "query",
      prompt: "Cột \"createdAt\" đã có index nhưng câu WHERE EXTRACT(YEAR FROM \"createdAt\") = 2026 vẫn quét cả bảng. Viết lại điều kiện cho dùng được index.",
      want: "Kết quả mong đợi: mọi đơn trong năm 2026.",
      hint: "Đừng đụng vào cột. Đổi một điểm so sánh thành một khoảng, chặn dưới lấy bằng, chặn trên lấy nhỏ hơn thật sự.",
      must: [
        { re: "select", label: "SELECT" },
        { re: "from\\s+orders", label: "FROM orders" },
        { re: "\"?createdat\"?\\s*>=", label: "\"createdAt\" >= '2026-01-01'" },
        { re: "\"?createdat\"?\\s*<", label: "\"createdAt\" < '2027-01-01'" },
        { re: "2026-01-01", label: "'2026-01-01'" },
        { re: "2027-01-01", label: "'2027-01-01'" }
      ],
      answers: ["SELECT * FROM orders WHERE \"createdAt\" >= '2026-01-01' AND \"createdAt\" < '2027-01-01';"]
    },
    {
      id: "c5x2", type: "query",
      prompt: "Câu WHERE total::text LIKE '12%' đang làm mất index trên total. Viết lại điều kiện \"tổng đơn từ 1200000 trở lên\" cho đúng cách.",
      want: "Kết quả mong đợi: O1.",
      hint: "Ép kiểu ở phía cột là hỏng. So sánh số với số.",
      must: [
        { re: "select", label: "SELECT" },
        { re: "from\\s+orders", label: "FROM orders" },
        { re: "where\\s+total\\s*>=", label: "WHERE total >= ..." },
        { re: "1200000", label: "1200000" }
      ],
      answers: ["SELECT * FROM orders WHERE total >= 1200000;"]
    },
    {
      id: "c5x3", type: "query",
      prompt: "Viết câu lệnh để xem kế hoạch thực thi kèm thời gian chạy thật của một truy vấn đếm đơn theo đại lý.",
      want: "Kết quả mong đợi: dòng đầu cho biết Index Scan hay Seq Scan.",
      hint: "Hai từ khóa đứng trước truy vấn. Chỉ một từ thì mới là ước lượng, chưa chạy thật.",
      must: [
        { re: "select", label: "SELECT" },
        { re: "from\\s+orders", label: "FROM orders" },
        { re: "explain", label: "EXPLAIN" },
        { re: "analyze", label: "ANALYZE" },
        { re: "select", label: "truy vấn đặt ngay sau" }
      ],
      answers: ["EXPLAIN ANALYZE SELECT \"partnerId\", COUNT(*) FROM orders GROUP BY \"partnerId\";"]
    }
  ]
};
