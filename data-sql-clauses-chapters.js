// Menh de SQL va NULL/ham gop. Du lieu mau lay theo schema that cua b2b.kamito.vn.
window.SQL_CLAUSES = [
  {
    id: "sqlc1",
    title: "Mệnh đề SQL: cái nào làm gì, chạy lúc nào",
    subtitle: "GROUP BY, ORDER BY, HAVING, LIMIT và chuyện bí danh",
    intro: "Đọc một truy vấn lạ mà biết ngay mệnh đề nào chạy trước thì hết bị bất ngờ. Chương này dùng đúng bảng của dự án: orders, partners.",
    blocks: [
      { t: "h", text: "Nhớ nhanh" },
      { t: "table", head: ["Mệnh đề", "Trả lời câu hỏi", "Ví dụ trên orders"],
        rows: [
          ["<code>FROM</code>", "Lấy dữ liệu từ đâu", "<code>FROM orders</code>"],
          ["<code>JOIN</code>", "Ghép thêm bảng nào", "<code>JOIN partners p ON p.id = o.\"partnerId\"</code>"],
          ["<code>WHERE</code>", "Giữ lại những <b>dòng</b> nào", "<code>WHERE o.status = 'CONFIRMED'</code>"],
          ["<code>GROUP BY</code>", "Gom dòng thành nhóm theo cái gì", "<code>GROUP BY o.\"partnerId\"</code>"],
          ["<code>HAVING</code>", "Giữ lại những <b>nhóm</b> nào", "<code>HAVING SUM(o.total) &gt; 1000000</code>"],
          ["<code>SELECT</code>", "Trả về cột nào", "<code>SELECT p.name, SUM(o.total)</code>"],
          ["<code>ORDER BY</code>", "Sắp xếp theo gì", "<code>ORDER BY SUM(o.total) DESC</code>"],
          ["<code>LIMIT</code>", "Lấy mấy dòng", "<code>LIMIT 10</code>"]
        ] },

      { t: "h", text: "Thứ tự viết khác thứ tự chạy" },
      { t: "code", text: "Thu tu BAT BUOC phai viet:\nSELECT -> FROM -> JOIN -> WHERE -> GROUP BY -> HAVING -> ORDER BY -> LIMIT\n\nThu tu may THUC SU chay:\n1. FROM      lay bang goc\n2. JOIN      ghep bang, luc nay con du moi dong\n3. WHERE     vut bot DONG\n4. GROUP BY  gom dong con lai thanh NHOM\n5. HAVING    vut bot NHOM\n6. SELECT    tinh cot tra ve, BI DANH ra doi o buoc nay\n7. ORDER BY  sap xep\n8. LIMIT     cat lay N dong dau" },
      { t: "p", html: "Bí danh (<code>AS tong</code>) chỉ ra đời ở <b>bước 6</b>. Mọi mệnh đề chạy trước bước 6 đều chưa biết nó là gì." },

      { t: "h", text: "Vì sao WHERE không dùng được bí danh" },
      { t: "code", text: "-- SAI: loi \"column tong does not exist\"\nSELECT \"partnerId\", SUM(total) AS tong\nFROM orders\nWHERE tong > 1000000          -- buoc 3, luc nay tong chua ton tai\nGROUP BY \"partnerId\";\n\n-- DUNG: loc nhom thi dung HAVING, va phai viet lai ca ham gop\nSELECT \"partnerId\", SUM(total) AS tong\nFROM orders\nGROUP BY \"partnerId\"\nHAVING SUM(total) > 1000000   -- buoc 5\nORDER BY tong DESC;           -- buoc 7, sau SELECT nen dung bi danh thoai mai" },
      { t: "hint", html: "PostgreSQL theo đúng chuẩn: <code>HAVING</code> phải viết lại <code>SUM(total)</code>, không cho dùng <code>tong</code>. MySQL nới lỏng nên cho. Nhớ thứ tự chạy là tự suy ra được, khỏi học thuộc." },

      { t: "h", text: "GROUP BY: gom theo cái gì thì SELECT được cái đó" },
      { t: "p", html: "Sau khi gom, mỗi nhóm chỉ còn <b>một</b> dòng kết quả. Nên cột trong <code>SELECT</code> chỉ được phép là: cột đã có trong <code>GROUP BY</code>, hoặc một hàm gộp." },
      { t: "code", text: "-- SAI: loi \"column orders.status must appear in the GROUP BY clause\"\nSELECT \"partnerId\", status, SUM(total)\nFROM orders GROUP BY \"partnerId\";\n-- Mot dai ly co nhieu don voi status khac nhau, may khong biet chon cai nao\n\n-- Cach 1: gom theo ca hai cot\nSELECT \"partnerId\", status, SUM(total) FROM orders GROUP BY \"partnerId\", status;\n\n-- Cach 2: bao may chon giup bang mot ham gop\nSELECT \"partnerId\", MAX(status), SUM(total) FROM orders GROUP BY \"partnerId\";" },

      { t: "h", text: "ORDER BY: bốn cách viết đều hợp lệ" },
      { t: "table", head: ["Viết", "Nghĩa"],
        rows: [
          ["<code>ORDER BY total DESC</code>", "Theo tên cột, giảm dần. Không ghi gì thì mặc định <code>ASC</code>"],
          ["<code>ORDER BY tong DESC</code>", "Theo bí danh — được, vì chạy sau <code>SELECT</code>"],
          ["<code>ORDER BY 2 DESC</code>", "Theo <b>vị trí cột</b> thứ 2 trong SELECT. Ngắn nhưng sửa SELECT là sai"],
          ["<code>ORDER BY p.name, o.total DESC</code>", "Nhiều tiêu chí: bằng tên thì mới xét tới total"]
        ] },
      { t: "code", text: "-- NULL xep o dau?\nORDER BY \"partnerId\" ASC NULLS LAST    -- PostgreSQL: ASC mac dinh da la NULLS LAST\nORDER BY \"partnerId\" DESC NULLS LAST   -- DESC mac dinh NULLS FIRST, muon khac phai ghi ro" },
      { t: "hint", html: "MySQL coi NULL là nhỏ nhất nên <code>ASC</code> đẩy NULL lên đầu — ngược với PostgreSQL. Chuyển truy vấn giữa hai hệ thì để ý chỗ này." },

      { t: "h", text: "LIMIT và OFFSET" },
      { t: "code", text: "ORDER BY o.\"createdAt\" DESC, o.id\nLIMIT 20 OFFSET 40;   -- bo 40 dong dau, lay 20 dong tiep = trang thu 3" },
      { t: "hint", html: "<code>LIMIT</code> mà không có <code>ORDER BY</code> thì thứ tự <b>không được đảm bảo</b>: chạy hai lần có thể ra hai kết quả khác nhau. Phân trang luôn phải kèm <code>ORDER BY</code>, và thêm <code>, id</code> để chốt thứ tự khi có nhiều dòng trùng ngày." }
    ],
    dataset: [
      { name: "orders", head: ["id", "partnerId", "total", "status", "createdAt"],
        rows: [["O1", "P1", "1200000", "CONFIRMED", "2026-01-05"],
               ["O2", "P1", "800000", "DRAFT", "2026-02-11"],
               ["O3", "P2", "500000", "CONFIRMED", "2026-02-20"],
               ["O4", "NULL", "300000", "CONFIRMED", "2026-03-02"]] },
      { name: "partners", head: ["id", "name", "isActive"],
        rows: [["P1", "Đại lý Hà Nội", "true"], ["P2", "Đại lý Đà Nẵng", "true"],
               ["P3", "Đại lý Cần Thơ", "false"]] }
    ]
  },

  {
    id: "sqlc2",
    title: "NULL và hàm gộp",
    subtitle: "COUNT ba kiểu, SUM rỗng, gộp có điều kiện",
    intro: "NULL nghĩa là KHÔNG BIẾT — không phải rỗng, cũng không phải 0. Hiểu sai chỗ này thì báo cáo ra sai số mà không ai phát hiện.",
    blocks: [
      { t: "h", text: "COUNT có ba kiểu, ra ba số khác nhau" },
      { t: "table", head: ["Viết", "Đếm cái gì", "Trên bảng orders ở dưới"],
        rows: [
          ["<code>COUNT(*)</code>", "Số <b>dòng</b>, kể cả dòng toàn NULL", "<b>4</b>"],
          ["<code>COUNT(\"partnerId\")</code>", "Số <b>giá trị khác NULL</b> của cột đó", "<b>3</b> — O4 có partnerId NULL"],
          ["<code>COUNT(DISTINCT \"partnerId\")</code>", "Số giá trị khác nhau, vẫn bỏ NULL", "<b>2</b> — P1 và P2"]
        ] },
      { t: "hint", html: "Đây là lỗi hay gặp nhất khi làm báo cáo: <code>COUNT(cột)</code> âm thầm bỏ qua NULL nên ra số nhỏ hơn thực tế. Muốn đếm dòng thì luôn dùng <code>COUNT(*)</code>." },

      { t: "h", text: "Mọi hàm gộp đều bỏ qua NULL" },
      { t: "code", text: "-- Gia su bang co 5 dong, trong do 1 dong co total = NULL\nSUM(total)   -- cong 4 so, bo qua dong NULL\nAVG(total)   -- chia cho 4 chu khong phai 5 (mau so khong tinh dong NULL)\nMIN / MAX    -- cung bo qua NULL\nCOUNT(*)     -- NGOAI LE duy nhat, van dem du 5" },

      { t: "h", text: "SUM của tập rỗng trả về NULL, không phải 0" },
      { t: "code", text: "-- Khong co don nao status = 'CANCELLED'\nSELECT SUM(total) FROM orders WHERE status = 'CANCELLED';\n-- Ket qua: NULL  (KHONG phai 0)\n\n-- Ben TypeScript: total.toFixed(0) se no vi total la null\nSELECT COALESCE(SUM(total), 0) AS tong\nFROM orders WHERE status = 'CANCELLED';\n-- Ket qua: 0" },
      { t: "p", html: "<code>COALESCE(a, b, c)</code> trả về giá trị <b>đầu tiên khác NULL</b>. Hàm gộp trả thẳng ra API thì gần như luôn phải bọc <code>COALESCE(..., 0)</code>, không thì phía web nhận <code>null</code> rồi vỡ." },

      { t: "h", text: "NULL không bằng gì cả, kể cả chính nó" },
      { t: "code", text: "WHERE \"partnerId\" = NULL         -- luon khong khop dong nao\nWHERE \"partnerId\" IS NULL        -- dung cach\nWHERE \"partnerId\" IS NOT NULL    -- nguoc lai\n\n-- Bay: NOT IN gap NULL thi tra ve rong\nWHERE \"partnerId\" NOT IN (SELECT id FROM partners WHERE \"groupId\" IS NULL);\n-- Neu danh sach ben trong co du MOT gia tri NULL, ca cau tra ve 0 dong.\n-- Dung NOT EXISTS thay cho NOT IN de tranh hoan toan." },
      { t: "table", head: ["Phép tính", "Kết quả"],
        rows: [
          ["<code>100 + NULL</code>", "<code>NULL</code> — một NULL làm hỏng cả biểu thức"],
          ["<code>'Đại lý ' || NULL</code>", "<code>NULL</code> trong PostgreSQL. Dùng <code>CONCAT()</code> thì NULL bị coi là chuỗi rỗng"],
          ["<code>NULL = NULL</code>", "Không phải true, mà là <i>unknown</i> → dòng bị loại"],
          ["<code>NULL IS NOT DISTINCT FROM NULL</code>", "<code>true</code> — cách so sánh coi hai NULL là bằng nhau"]
        ] },

      { t: "h", text: "Gộp có điều kiện: một lần quét, nhiều con số" },
      { t: "p", html: "Cần cả \"tổng đã chốt\" lẫn \"tổng còn nháp\" trên <b>cùng một dòng</b> thì đừng chạy hai câu rồi ghép ở code. Đưa điều kiện vào trong hàm gộp." },
      { t: "code", text: "-- Cach 1: CASE WHEN — chay o moi he CSDL\nSELECT \"partnerId\",\n       SUM(CASE WHEN status = 'CONFIRMED' THEN total ELSE 0 END) AS da_chot,\n       SUM(CASE WHEN status = 'DRAFT'     THEN total ELSE 0 END) AS con_nhap\nFROM orders\nGROUP BY \"partnerId\";\n\n-- Cach 2: FILTER — chi PostgreSQL, de doc hon\nSELECT \"partnerId\",\n       SUM(total)  FILTER (WHERE status = 'CONFIRMED') AS da_chot,\n       SUM(total)  FILTER (WHERE status = 'DRAFT')     AS con_nhap,\n       COUNT(*)    FILTER (WHERE status = 'DRAFT')     AS so_don_nhap\nFROM orders GROUP BY \"partnerId\";" },
      { t: "hint", html: "Khác nhau nhỏ mà quan trọng: <code>CASE ... ELSE 0</code> ra <b>0</b> khi nhóm không có dòng nào khớp, còn <code>FILTER</code> ra <b>NULL</b>. Muốn chắc thì bọc <code>COALESCE</code>." },

      { t: "h", text: "Bốn cái bẫy nên thuộc" },
      { t: "table", head: ["Bẫy", "Hậu quả"],
        rows: [
          ["<code>COUNT(cột)</code> thay vì <code>COUNT(*)</code>", "Đếm thiếu đúng bằng số dòng NULL"],
          ["Quên <code>COALESCE</code> quanh <code>SUM</code>", "API trả <code>null</code>, phía web vỡ"],
          ["<code>= NULL</code>", "Lọc ra 0 dòng, tưởng là không có dữ liệu"],
          ["<code>NOT IN</code> với danh sách có NULL", "Trả về rỗng mà không báo lỗi gì"]
        ] }
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
