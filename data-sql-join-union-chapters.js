// JOIN (ON khac WHERE), UNION va index. Bang mau theo schema that cua b2b.kamito.vn.
window.SQL_JOIN_UNION = [
  {
    id: "sqlc3",
    title: "JOIN: đặt điều kiện ở ON hay ở WHERE",
    subtitle: "Cái bẫy làm LEFT JOIN âm thầm thành INNER JOIN",
    intro: "Cùng một điều kiện, đặt ở ON thì ra kết quả này, đặt ở WHERE thì ra kết quả khác. Đây là chỗ sai nhiều nhất khi làm báo cáo có đại lý chưa phát sinh đơn.",
    blocks: [
      { t: "h", text: "Bốn kiểu JOIN" },
      { t: "table", head: ["Kiểu", "Giữ dòng nào"],
        rows: [
          ["<code>INNER JOIN</code>", "Chỉ dòng khớp được ở <b>cả hai</b> bảng"],
          ["<code>LEFT JOIN</code>", "Giữ <b>hết</b> bảng trái; bên phải không khớp thì điền NULL"],
          ["<code>RIGHT JOIN</code>", "Ngược lại — ít dùng, đổi chỗ hai bảng rồi LEFT JOIN cho dễ đọc"],
          ["<code>FULL JOIN</code>", "Giữ hết cả hai bên, chỗ nào thiếu thì NULL"]
        ] },
      { t: "p", html: "<code>JOIN</code> viết trống không = <code>INNER JOIN</code>. Nhớ: <b>LEFT</b> nghĩa là bảng viết ở <code>FROM</code>." },

      { t: "h", text: "Hai câu chỉ khác chỗ đặt điều kiện" },
      { t: "code", text: "-- A: dieu kien nam trong ON\nSELECT p.name, o.id\nFROM partners p\nLEFT JOIN orders o ON o.\"partnerId\" = p.id AND o.status = 'CONFIRMED';\n\n-- B: dieu kien nam trong WHERE\nSELECT p.name, o.id\nFROM partners p\nLEFT JOIN orders o ON o.\"partnerId\" = p.id\nWHERE o.status = 'CONFIRMED';" },
      { t: "table", head: ["", "A — điều kiện ở ON", "B — điều kiện ở WHERE"],
        rows: [
          ["Đại lý Hà Nội", "O1", "O1"],
          ["Đại lý Đà Nẵng", "O3", "O3"],
          ["Đại lý Cần Thơ", "<i>NULL</i> — vẫn có mặt", "<b>bị mất</b>"],
          ["Số dòng", "<b>3</b>", "<b>2</b>"]
        ] },
      { t: "p", html: "Vì sao? Nhớ thứ tự chạy: <code>JOIN</code> (bước 2) xong mới tới <code>WHERE</code> (bước 3). Câu B ghép xong thì Cần Thơ có <code>o.status = NULL</code>; tới <code>WHERE</code>, phép so <code>NULL = 'CONFIRMED'</code> ra <i>unknown</i> nên dòng đó bị vứt. <code>LEFT JOIN</code> coi như thành <code>INNER JOIN</code>." },
      { t: "hint", html: "Quy tắc gọn: điều kiện áp lên <b>bảng phải</b> của LEFT JOIN thì đặt trong <code>ON</code>. Điều kiện áp lên <b>bảng trái</b> thì đặt ở <code>WHERE</code>. Với <code>INNER JOIN</code> thì đặt đâu cũng như nhau." },

      { t: "h", text: "Anti-join: tìm đại lý chưa đặt đơn nào" },
      { t: "code", text: "-- Cach 1: LEFT JOIN roi giu dong khong khop\nSELECT p.id, p.name\nFROM partners p\nLEFT JOIN orders o ON o.\"partnerId\" = p.id\nWHERE o.id IS NULL;          -- day la truong hop DUY NHAT nen loc NULL o WHERE\n\n-- Cach 2: NOT EXISTS — thuong nhanh hon va khong so NULL\nSELECT p.id, p.name\nFROM partners p\nWHERE NOT EXISTS (\n  SELECT 1 FROM orders o WHERE o.\"partnerId\" = p.id\n);" },
      { t: "p", html: "Đây chính là bộ lọc \"đại lý chưa đặt đơn\" trong dự án — lý do bảng <code>orders</code> có <code>@@index([userId])</code>." },

      { t: "h", text: "Cột camelCase của Prisma phải bọc nháy kép" },
      { t: "code", text: "SELECT partnerId  FROM orders;    -- loi: column \"partnerid\" does not exist\nSELECT \"partnerId\" FROM orders;   -- dung" },
      { t: "hint", html: "PostgreSQL tự hạ mọi tên không bọc nháy về chữ thường. Prisma tạo cột tên <code>partnerId</code> có hoa, nên viết SQL thô (<code>$queryRaw</code>) là phải bọc <code>\"</code>. Nháy đơn <code>'</code> dành cho <b>giá trị</b>, nháy kép <code>\"</code> dành cho <b>tên cột</b>." }
    ],
    dataset: [
      { name: "partners", head: ["id", "name", "isActive"],
        rows: [["P1", "Đại lý Hà Nội", "true"], ["P2", "Đại lý Đà Nẵng", "true"],
               ["P3", "Đại lý Cần Thơ", "false"]] },
      { name: "orders", head: ["id", "partnerId", "total", "status", "createdAt"],
        rows: [["O1", "P1", "1200000", "CONFIRMED", "2026-01-05"],
               ["O2", "P1", "800000", "DRAFT", "2026-02-11"],
               ["O3", "P2", "500000", "CONFIRMED", "2026-02-20"],
               ["O4", "NULL", "300000", "CONFIRMED", "2026-03-02"]] }
    ]
  },

  {
    id: "sqlc4",
    title: "UNION: nối kết quả theo chiều dọc",
    subtitle: "UNION, UNION ALL, INTERSECT, EXCEPT",
    intro: "JOIN nối theo chiều NGANG — thêm cột. UNION nối theo chiều DỌC — thêm dòng. Nhầm hai cái này là chọn sai công cụ ngay từ đầu.",
    blocks: [
      { t: "h", text: "Ngang và dọc" },
      { t: "code", text: "JOIN:   bang A |  bang B      ->  mot dong dai hon (nhieu cot hon)\nUNION:  bang A\n        -----\n        bang B                ->  nhieu dong hon (van bay nhieu cot)" },

      { t: "h", text: "Ví dụ: gom đơn của hai nguồn vào một danh sách" },
      { t: "code", text: "SELECT id, total, 'b2b' AS nguon FROM orders\nUNION ALL\nSELECT id, amount, '1c'  AS nguon FROM one_c_sales_orders\nORDER BY total DESC\nLIMIT 20;" },
      { t: "p", html: "Cột thứ nhất ghép với cột thứ nhất, thứ hai với thứ hai — ghép <b>theo vị trí</b>, không theo tên. Tên cột kết quả lấy theo câu đầu tiên." },

      { t: "h", text: "Bốn phép, khác nhau ở chỗ xử lý dòng trùng" },
      { t: "table", head: ["Phép", "Trả về", "Ghi chú"],
        rows: [
          ["<code>UNION ALL</code>", "Toàn bộ dòng của A rồi tới B", "<b>Nhanh nhất</b> — không phải đi khử trùng"],
          ["<code>UNION</code>", "Như trên nhưng <b>bỏ dòng trùng</b>", "Phải sắp xếp lại toàn bộ để dò trùng nên chậm hơn"],
          ["<code>INTERSECT</code>", "Chỉ dòng có ở <b>cả hai</b>", "Giống phần giao"],
          ["<code>EXCEPT</code>", "Dòng có ở A mà không có ở B", "MySQL/Oracle gọi là <code>MINUS</code>"]
        ] },
      { t: "hint", html: "Mặc định nên dùng <code>UNION ALL</code>. Chỉ dùng <code>UNION</code> khi thật sự cần khử trùng lặp — nó âm thầm tốn công sắp xếp cả tập kết quả." },

      { t: "h", text: "Ba luật bắt buộc" },
      { t: "table", head: ["Luật", "Sai thì bị gì"],
        rows: [
          ["Số cột hai bên phải <b>bằng nhau</b>", "<code>each UNION query must have the same number of columns</code>"],
          ["Kiểu dữ liệu từng cột phải tương thích", "<code>UNION types text and integer cannot be matched</code>"],
          ["<code>ORDER BY</code> chỉ được đặt <b>một lần ở cuối</b>", "Đặt giữa chừng là lỗi cú pháp"]
        ] },
      { t: "code", text: "-- Muon sap xep rieng tung phan thi phai boc ngoac\n( SELECT id, total FROM orders WHERE status = 'CONFIRMED' ORDER BY total DESC LIMIT 5 )\nUNION ALL\n( SELECT id, total FROM orders WHERE status = 'DRAFT'     ORDER BY total DESC LIMIT 5 );" },

      { t: "h", text: "Khi nào UNION, khi nào không" },
      { t: "table", head: ["Tình huống", "Dùng gì"],
        rows: [
          ["Hai bảng khác nhau, cùng ý nghĩa dòng (đơn b2b + đơn 1C)", "<code>UNION ALL</code>"],
          ["Cùng một bảng, chỉ khác điều kiện lọc", "<b>Không</b> UNION — dùng <code>WHERE ... IN (...)</code>"],
          ["Cần hai con số theo hai điều kiện trên cùng một dòng", "<b>Không</b> UNION — dùng gộp có điều kiện (chương NULL và hàm gộp)"],
          ["Cần thêm cột từ bảng liên quan", "<code>JOIN</code>, không phải UNION"]
        ] }
    ],
    dataset: [
      { name: "orders", head: ["id", "partnerId", "total", "status"],
        rows: [["O1", "P1", "1200000", "CONFIRMED"], ["O2", "P1", "800000", "DRAFT"],
               ["O3", "P2", "500000", "CONFIRMED"], ["O4", "NULL", "300000", "CONFIRMED"]] }
    ]
  },

  {
    id: "sqlc5",
    title: "Index và chuyện làm mất index",
    subtitle: "Vì sao YEAR(created_at) = 2026 lại chậm",
    intro: "Index là mục lục của bảng. Nhưng mục lục chỉ tra được khi điều kiện áp lên ĐÚNG cái cột đã đánh mục lục, chưa bị bóp méo đi.",
    blocks: [
      { t: "h", text: "Index hoạt động thế nào" },
      { t: "p", html: "Index B-tree giữ sẵn <b>giá trị của cột đã sắp xếp</b>, kèm con trỏ tới dòng. Tra nó giống tra từ điển: nhảy vài bước là tới nơi, thay vì đọc cả triệu dòng (gọi là <i>seq scan</i> — quét tuần tự)." },
      { t: "p", html: "Mấu chốt: index lưu giá trị <b>gốc</b> của cột, ví dụ <code>2026-01-05</code>. Nó không lưu <code>YEAR(created_at)</code>." },

      { t: "h", text: "Bọc cột trong hàm là index thành vô dụng" },
      { t: "code", text: "-- CHAM: phai lay tung dong ra, chay YEAR() roi moi so sanh -> quet ca bang\nWHERE YEAR(\"createdAt\") = 2026\n\n-- NHANH: cot dung mot minh, may doi nguoc lai thanh mot khoang tren index\nWHERE \"createdAt\" >= '2026-01-01'\n  AND \"createdAt\" <  '2027-01-01'" },
      { t: "p", html: "Điều kiện dùng được index gọi là <b>sargable</b>. Quy tắc một câu: <i>đừng đụng vào cột, hãy biến đổi phía giá trị đem so sánh</i>." },

      { t: "h", text: "Những cách làm mất index hay gặp" },
      { t: "table", head: ["Viết như này thì mất index", "Viết lại"],
        rows: [
          ["<code>WHERE LOWER(name) = 'abc'</code>", "Tạo index trên biểu thức, hoặc dùng <code>ILIKE</code>"],
          ["<code>WHERE name LIKE '%kamito'</code>", "<code>LIKE 'kamito%'</code> dùng được; bắt đầu bằng <code>%</code> thì không"],
          ["<code>WHERE id::text = '123'</code>", "<code>WHERE id = 123</code> — ép kiểu phía giá trị"],
          ["<code>WHERE total + 0 &gt; 100</code>", "<code>WHERE total &gt; 100</code>"],
          ["<code>WHERE a = 1 OR b = 2</code>", "Hai index rời khó dùng chung; cân nhắc <code>UNION ALL</code> hai câu"]
        ] },

      { t: "h", text: "Index nhiều cột: đi từ trái sang" },
      { t: "code", text: "-- Trong schema du an\n@@index([partnerId, createdAt])\n\nWHERE \"partnerId\" = 'P1'                            -- dung duoc (cot trai)\nWHERE \"partnerId\" = 'P1' AND \"createdAt\" > '...'    -- dung duoc ca hai\nWHERE \"createdAt\" > '...'                           -- KHONG dung duoc, thieu cot trai" },
      { t: "hint", html: "Giống danh bạ sắp theo (họ, tên): biết họ thì tra nhanh, chỉ biết tên thì vẫn phải lật từng trang. Thứ tự cột trong index là một quyết định thiết kế, không phải viết bừa." },

      { t: "h", text: "Muốn biết thật sự nhanh chậm thì hỏi máy" },
      { t: "code", text: "EXPLAIN ANALYZE\nSELECT ... ;\n\n-- Doc dong dau:\n-- Index Scan using orders_partnerId_createdAt_idx   -> dung index, tot\n-- Seq Scan on orders                                -> quet ca bang" },
      { t: "hint", html: "Index không miễn phí: mỗi <code>INSERT</code>/<code>UPDATE</code> đều phải cập nhật index, và nó chiếm ổ đĩa. Đánh index cho cột hay lọc, hay join, hay sắp xếp — chứ không đánh cho tất cả." }
    ],
    dataset: [
      { name: "orders", head: ["id", "partnerId", "total", "status", "createdAt"],
        rows: [["O1", "P1", "1200000", "CONFIRMED", "2026-01-05"],
               ["O2", "P1", "800000", "DRAFT", "2026-02-11"],
               ["O3", "P2", "500000", "CONFIRMED", "2026-02-20"],
               ["O4", "NULL", "300000", "CONFIRMED", "2026-03-02"]] }
    ]
  }
];
