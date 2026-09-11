// Bai tap cho sqlc1, sqlc2. Cham theo thanh phan bat buoc trong "must".
window.SQL_CLAUSES_EXERCISES = {
  sqlc1: [
    {
      id: "c1x1", type: "query",
      prompt: "Lấy 10 đơn mới nhất, mới nhất lên đầu.",
      want: "Kết quả mong đợi: O4, O3, O2, O1 (bảng mẫu chỉ có 4 dòng).",
      hint: "Sắp xếp giảm dần theo createdAt rồi cắt bớt. Cột camelCase nhớ bọc nháy kép.",
      must: [
        { re: "select", label: "SELECT" },
        { re: "from\\s+orders", label: "FROM orders" },
        { re: "order\\s+by\\s+\"?createdat\"?", label: "ORDER BY \"createdAt\"" },
        { re: "desc", label: "DESC" },
        { re: "limit\\s+10", label: "LIMIT 10" }
      ],
      answers: ["SELECT * FROM orders ORDER BY \"createdAt\" DESC LIMIT 10;"]
    },
    {
      id: "c1x2", type: "query",
      prompt: "Tổng total theo từng đại lý, chỉ giữ đại lý có tổng lớn hơn 1000000, sắp xếp tổng giảm dần.",
      want: "Kết quả mong đợi: P1 = 2000000.",
      hint: "Lọc NHÓM thì không phải WHERE. Và ở PostgreSQL, HAVING phải viết lại cả hàm gộp chứ không dùng được bí danh.",
      must: [
        { re: "select", label: "SELECT" },
        { re: "from\\s+orders", label: "FROM orders" },
        { re: "sum\\s*\\(\\s*total", label: "SUM(total)" },
        { re: "group\\s+by\\s+\"?partnerid\"?", label: "GROUP BY \"partnerId\"" },
        { re: "having\\s+sum\\s*\\(\\s*total\\s*\\)\\s*>", label: "HAVING SUM(total) > ..." },
        { re: "order\\s+by", label: "ORDER BY" },
        { re: "desc", label: "DESC" }
      ],
      answers: ["SELECT \"partnerId\", SUM(total) AS tong FROM orders GROUP BY \"partnerId\" HAVING SUM(total) > 1000000 ORDER BY tong DESC;"]
    },
    {
      id: "c1x3", type: "query",
      prompt: "Câu này lỗi \"column tong does not exist\", viết lại cho chạy được: SELECT \"partnerId\", SUM(total) AS tong FROM orders WHERE tong > 500000 GROUP BY \"partnerId\";",
      want: "Kết quả mong đợi: P1 = 2000000, P2 = 500000 nếu điều kiện là > 400000.",
      hint: "Bí danh ra đời ở bước SELECT, mà WHERE chạy trước đó. Điều kiện dựa trên hàm gộp thì thuộc về mệnh đề nào?",
      must: [
        { re: "select", label: "SELECT" },
        { re: "from\\s+orders", label: "FROM orders" },
        { re: "group\\s+by", label: "GROUP BY" },
        { re: "having", label: "HAVING (thay cho WHERE)" },
        { re: "sum\\s*\\(\\s*total\\s*\\)\\s*>", label: "SUM(total) > ... viết lại trong HAVING" }
      ],
      answers: ["SELECT \"partnerId\", SUM(total) AS tong FROM orders GROUP BY \"partnerId\" HAVING SUM(total) > 500000;"]
    },
    {
      id: "c1x4", type: "query",
      prompt: "Đếm số đơn của từng cặp (đại lý, trạng thái).",
      want: "Kết quả mong đợi: P1/CONFIRMED = 1, P1/DRAFT = 1, P2/CONFIRMED = 1, NULL/CONFIRMED = 1.",
      hint: "Cột nào xuất hiện trong SELECT mà không nằm trong hàm gộp thì phải có mặt ở GROUP BY.",
      must: [
        { re: "select", label: "SELECT" },
        { re: "from\\s+orders", label: "FROM orders" },
        { re: "count\\s*\\(", label: "COUNT(...)" },
        { re: "group\\s+by\\s+\"?partnerid\"?\\s*,\\s*status", label: "GROUP BY \"partnerId\", status" }
      ],
      answers: ["SELECT \"partnerId\", status, COUNT(*) FROM orders GROUP BY \"partnerId\", status;"]
    },
    {
      id: "c1x5", type: "query",
      prompt: "Phân trang danh sách đơn: mỗi trang 20 dòng, lấy trang thứ 3, mới nhất lên đầu, thứ tự phải ổn định giữa các lần chạy.",
      want: "Kết quả mong đợi: bỏ 40 dòng đầu, lấy 20 dòng tiếp.",
      hint: "OFFSET = (số trang - 1) × cỡ trang. Thứ tự ổn định thì cần thêm một cột chốt đằng sau createdAt.",
      must: [
        { re: "select", label: "SELECT" },
        { re: "from\\s+orders", label: "FROM orders" },
        { re: "order\\s+by\\s+\"?createdat\"?", label: "ORDER BY \"createdAt\"" },
        { re: ",\\s*\"?(o\\.)?id\"?", label: "thêm , id để chốt thứ tự" },
        { re: "limit\\s+20", label: "LIMIT 20" },
        { re: "offset\\s+40", label: "OFFSET 40" }
      ],
      answers: ["SELECT * FROM orders ORDER BY \"createdAt\" DESC, id LIMIT 20 OFFSET 40;"]
    }
  ],

  sqlc2: [
    {
      id: "c2x1", type: "query",
      prompt: "Trên một dòng, trả về: tổng số đơn, số đơn có gắn đại lý, và số đại lý khác nhau đã đặt đơn.",
      want: "Kết quả mong đợi: 4, 3, 2.",
      hint: "Ba kiểu COUNT khác nhau. Cột có NULL thì COUNT(cột) bỏ qua nó.",
      must: [
        { re: "select", label: "SELECT" },
        { re: "from\\s+orders", label: "FROM orders" },
        { re: "count\\s*\\(\\s*\\*\\s*\\)", label: "COUNT(*)" },
        { re: "count\\s*\\(\\s*\"?partnerid\"?\\s*\\)", label: "COUNT(\"partnerId\")" },
        { re: "count\\s*\\(\\s*distinct", label: "COUNT(DISTINCT ...)" }
      ],
      answers: ["SELECT COUNT(*), COUNT(\"partnerId\"), COUNT(DISTINCT \"partnerId\") FROM orders;"]
    },
    {
      id: "c2x2", type: "query",
      prompt: "Tổng total của các đơn status = 'CANCELLED'. Bảng không có đơn nào như vậy, nhưng API phải nhận được số 0 chứ không phải null.",
      want: "Kết quả mong đợi: 0.",
      hint: "SUM của tập rỗng trả về NULL. Cần một hàm đổi NULL thành giá trị mặc định.",
      must: [
        { re: "select", label: "SELECT" },
        { re: "from\\s+orders", label: "FROM orders" },
        { re: "coalesce\\s*\\(", label: "COALESCE(...)" },
        { re: "sum\\s*\\(\\s*total", label: "SUM(total)" },
        { re: ",\\s*0\\s*\\)", label: ", 0)" },
        { re: "where\\s+status", label: "WHERE status = 'CANCELLED'" }
      ],
      answers: ["SELECT COALESCE(SUM(total), 0) AS tong FROM orders WHERE status = 'CANCELLED';"]
    },
    {
      id: "c2x3", type: "query",
      prompt: "Liệt kê các đơn chưa gắn đại lý nào.",
      want: "Kết quả mong đợi: O4.",
      hint: "Không so sánh bằng với NULL được.",
      must: [
        { re: "select", label: "SELECT" },
        { re: "from\\s+orders", label: "FROM orders" },
        { re: "where\\s+\"?partnerid\"?\\s+is\\s+null", label: "WHERE \"partnerId\" IS NULL" }
      ],
      answers: ["SELECT * FROM orders WHERE \"partnerId\" IS NULL;"]
    },
    {
      id: "c2x4", type: "query",
      prompt: "Mỗi đại lý một dòng, gồm: tổng tiền các đơn CONFIRMED và tổng tiền các đơn DRAFT. Chỉ chạy MỘT câu, không UNION.",
      want: "Kết quả mong đợi: P1 → 1200000 và 800000; P2 → 500000 và 0.",
      hint: "Đưa điều kiện vào bên trong hàm gộp: CASE WHEN ... THEN total ELSE 0 END, hoặc FILTER (WHERE ...).",
      must: [
        { re: "select", label: "SELECT" },
        { re: "from\\s+orders", label: "FROM orders" },
        { re: "sum\\s*\\(", label: "SUM(...)" },
        { re: "(case\\s+when|filter\\s*\\(\\s*where)", label: "CASE WHEN hoặc FILTER (WHERE ...)" },
        { re: "confirmed", label: "điều kiện 'CONFIRMED'" },
        { re: "draft", label: "điều kiện 'DRAFT'" },
        { re: "group\\s+by\\s+\"?partnerid\"?", label: "GROUP BY \"partnerId\"" }
      ],
      answers: ["SELECT \"partnerId\", SUM(CASE WHEN status = 'CONFIRMED' THEN total ELSE 0 END) AS da_chot, SUM(CASE WHEN status = 'DRAFT' THEN total ELSE 0 END) AS con_nhap FROM orders GROUP BY \"partnerId\";"]
    },
    {
      id: "c2x5", type: "query",
      prompt: "Giá trị trung bình mỗi đơn, làm tròn 0 chữ số thập phân, và trả 0 nếu bảng rỗng.",
      want: "Kết quả mong đợi: 700000.",
      hint: "AVG cũng bỏ qua NULL và cũng trả NULL khi không có dòng nào. ROUND trong PostgreSQL cần kiểu numeric.",
      must: [
        { re: "select", label: "SELECT" },
        { re: "from\\s+orders", label: "FROM orders" },
        { re: "avg\\s*\\(\\s*total", label: "AVG(total)" },
        { re: "coalesce\\s*\\(", label: "COALESCE(...)" },
        { re: "round\\s*\\(", label: "ROUND(...)" }
      ],
      answers: ["SELECT COALESCE(ROUND(AVG(total)::numeric, 0), 0) AS trung_binh FROM orders;"]
    }
  ]
};
