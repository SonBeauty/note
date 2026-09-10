// Chuong nen tang: tung menh de la gi, dung lam gi. Khong gan voi du an nao.
window.SQL_BASICS = [
  {
    id: "sql0",
    title: "SQL căn bản",
    subtitle: "Các mệnh đề và thứ tự chạy",
    intro: "Mỗi mệnh đề trả lời một câu hỏi khác nhau. Nắm được nó làm gì và chạy lúc nào thì đọc truy vấn lạ cũng hiểu ngay.",
    blocks: [
      { t: "h", text: "Bộ khung một câu SELECT" },
      { t: "code", text: "SELECT   cột hoặc hàm gộp\nFROM     bảng chính\nJOIN     bảng khác ON điều kiện ghép\nWHERE    lọc từng dòng\nGROUP BY gom nhóm\nHAVING   lọc nhóm\nORDER BY sắp xếp\nLIMIT    giới hạn số dòng" },
      { t: "p", html: "Thiếu mệnh đề nào cũng được, nhưng không đảo được thứ tự viết." },

      { t: "h", text: "Từng mệnh đề dùng làm gì" },
      { t: "table", head: ["Mệnh đề", "Là gì", "Dùng khi"],
        rows: [
          ["<code>SELECT</code>", "Chọn cột trả về", "Luôn có"],
          ["<code>FROM</code>", "Nguồn dữ liệu", "Luôn có"],
          ["<code>JOIN</code>", "Ghép thêm bảng theo điều kiện", "Dữ liệu cần nằm ở bảng khác"],
          ["<code>WHERE</code>", "Lọc từng dòng riêng lẻ", "Bỏ bớt dòng không quan tâm"],
          ["<code>GROUP BY</code>", "Gom các dòng cùng giá trị thành một nhóm", "Muốn tính theo từng nhóm"],
          ["<code>HAVING</code>", "Lọc nhóm sau khi đã gom", "Điều kiện dựa trên kết quả hàm gộp"],
          ["<code>ORDER BY</code>", "Sắp xếp kết quả", "Muốn thứ tự cố định"],
          ["<code>LIMIT</code>", "Cắt lấy N dòng đầu", "Lấy top N"]
        ] },

      { t: "h", text: "Thứ tự chạy khác thứ tự viết" },
      { t: "code", text: "FROM → JOIN → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT" },
      { t: "p", html: "<code>SELECT</code> chạy gần cuối. Đó là lý do <code>WHERE</code> không dùng được bí danh đặt trong <code>SELECT</code>: lúc <code>WHERE</code> chạy thì bí danh chưa tồn tại. Ngược lại <code>ORDER BY</code> chạy sau <code>SELECT</code> nên dùng bí danh thoải mái." },
      { t: "hint", html: "MySQL nới lỏng quy tắc này nên cho dùng bí danh trong <code>HAVING</code>, PostgreSQL theo đúng chuẩn nên không cho. Nhớ thứ tự chạy là suy ra được chỗ nào dùng bí danh được." },

      { t: "h", text: "WHERE và HAVING khác nhau chỗ nào" },
      { t: "table", head: ["", "WHERE", "HAVING"],
        rows: [
          ["Lọc cái gì", "Từng dòng", "Từng nhóm"],
          ["Chạy lúc nào", "Trước GROUP BY", "Sau GROUP BY"],
          ["Dùng được hàm gộp", "Không", "Có"],
          ["Ví dụ", "<code>WHERE qty > 0</code>", "<code>HAVING SUM(qty) > 100</code>"]
        ] },
      { t: "p", html: "Quy tắc thực dụng: lọc được bằng <code>WHERE</code> thì đừng để tới <code>HAVING</code>. <code>WHERE</code> cắt bớt dòng từ sớm nên phần việc còn lại nhẹ hơn." },

      { t: "h", text: "Hàm gộp là gì" },
      { t: "p", html: "Hàm nhận vào nhiều dòng và trả về đúng một giá trị. Đi kèm <code>GROUP BY</code> thì trả về một giá trị cho mỗi nhóm." },
      { t: "table", head: ["Hàm", "Trả về"],
        rows: [
          ["<code>COUNT(*)</code>", "Số dòng, tính cả dòng toàn NULL"],
          ["<code>COUNT(cột)</code>", "Số giá trị khác NULL của cột đó"],
          ["<code>SUM(cột)</code>", "Tổng"],
          ["<code>AVG(cột)</code>", "Trung bình"],
          ["<code>MIN</code> / <code>MAX</code>", "Nhỏ nhất và lớn nhất"]
        ] },
      { t: "hint", html: "Mọi hàm gộp đều bỏ qua NULL, trừ <code>COUNT(*)</code>. Và <code>SUM</code> của tập rỗng trả về NULL chứ không phải 0." },

      { t: "h", text: "Truy vấn con, derived table, CTE" },
      { t: "p", html: "Cùng một ý tưởng: lấy kết quả của truy vấn này làm đầu vào cho truy vấn kia. Khác nhau ở chỗ đặt nó ở đâu." },
      { t: "table", head: ["Tên gọi", "Đặt ở đâu", "Ghi chú"],
        rows: [
          ["Subquery", "Trong <code>SELECT</code> hoặc <code>WHERE</code>", "Trả về một giá trị hoặc một danh sách"],
          ["Derived table", "Trong <code>FROM</code>", "Bắt buộc phải có bí danh"],
          ["CTE", "Trong <code>WITH</code> đặt trước <code>SELECT</code>", "Dễ đọc nhất, đặt tên được, tái dùng trong cùng câu"]
        ] },
      { t: "code", text: "WITH doanh_thu AS (\n  SELECT customer, SUM(amount) AS tong\n  FROM orders\n  GROUP BY customer\n)\nSELECT * FROM doanh_thu WHERE tong > 100;" },

      { t: "h", text: "Index và chuyện làm mất index" },
      { t: "p", html: "Index giống mục lục của cuốn sách: thay vì lật từng trang, cơ sở dữ liệu tra thẳng tới nơi. Nhưng chỉ tra được khi điều kiện áp lên <b>chính cột</b> đó." },
      { t: "code", text: "-- Bọc cột trong hàm: index vô dụng, phải quét cả bảng\nWHERE YEAR(created_at) = 2026\n\n-- Để cột đứng một mình: dùng được index\nWHERE created_at >= '2026-01-01'\n  AND created_at <  '2027-01-01'" },
      { t: "hint", html: "Điều kiện dùng được index gọi là <b>sargable</b>. Quy tắc dễ nhớ: đừng bọc cột trong hàm ở mệnh đề <code>WHERE</code>, hãy biến đổi phía giá trị so sánh thay vì phía cột." },

      { t: "h", text: "NULL không bằng gì cả" },
      { t: "code", text: "WHERE col = NULL      -- luôn sai, không bao giờ khớp dòng nào\nWHERE col IS NULL     -- đúng cách" },
      { t: "hint", html: "NULL nghĩa là <i>không biết</i>, nên so sánh nó với bất cứ thứ gì cũng ra <i>không biết</i>, kể cả so với chính nó. Muốn thay NULL bằng giá trị mặc định thì dùng <code>COALESCE(col, 0)</code>." }
    ],
    dataset: [
      { name: "orders", head: ["id", "customer", "amount", "status"],
        rows: [["1", "An", "100", "paid"], ["2", "Bình", "50", "new"],
               ["3", "An", "30", "paid"], ["4", "Chi", "200", "paid"]] }
    ]
  }
];
