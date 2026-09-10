// Ghi chu tu truy van bao cao cong no tren he ERP (MySQL, schema kieu 1C voi Ref_Key).
window.MYSQL_CHAPTERS = [
  {
    id: "my1",
    title: "Báo cáo công nợ trong MySQL",
    subtitle: "Derived table, gộp có điều kiện, HAVING",
    intro: "Truy vấn lấy top 10 đại lý theo tổng công nợ kèm phần quá hạn. Chạy trên MySQL, schema kiểu ERP 1C với Ref_Key. Khác hẳn PostgreSQL của b2b nên có vài chỗ cần đối chiếu.",
    blocks: [
      { t: "h", text: "Truy vấn gốc" },
      { t: "code", text: "SELECT\n  p.Code AS ma_dl,\n  p.Description AS ten_dai_ly,\n  ROUND(SUM(x.sign_debt)) AS tong_ar,\n  ROUND(SUM(CASE WHEN LEFT(x.PlannedRepaymentDate, 10) < DATE_FORMAT(CURDATE(), '%Y-%m-%d')\n                 THEN x.sign_debt ELSE 0 END)) AS qua_han\nFROM (\n  SELECT\n    CASE WHEN RecordType = 'Receipt' THEN Debt ELSE -Debt END AS sign_debt,\n    PlannedRepaymentDate,\n    AccountingDimensionByPartners_Key\n  FROM CustomersARAPAccountingByDueDates_RecordType\n  WHERE IFNULL(ReversingEntry, 0) = 0\n    AND IFNULL(Active, 0) = 1\n) x\nJOIN DimensionKeysOfAccountingByPartners d ON d.Ref_Key = x.AccountingDimensionByPartners_Key\nJOIN Partners p ON p.Ref_Key = d.Partner_Key\nGROUP BY p.Code, p.Description\nHAVING tong_ar <> 0\nORDER BY tong_ar DESC\nLIMIT 10;" },

      { t: "h", text: "Đọc từ trong ra ngoài" },
      { t: "table", head: ["Lớp", "Làm gì"],
        rows: [
          ["Bảng con <code>x</code>", "Lọc bút toán còn hiệu lực, đổi dấu Debt theo RecordType"],
          ["Hai <code>JOIN</code>", "Ref_Key → Partner_Key → Partners để lấy mã và tên đại lý"],
          ["<code>GROUP BY</code>", "Gom về từng đại lý"],
          ["<code>HAVING</code>", "Bỏ đại lý có tổng bằng 0"],
          ["<code>ORDER BY</code> + <code>LIMIT</code>", "Lấy 10 đại lý nợ nhiều nhất"]
        ] },
      { t: "p", html: "Truy vấn con nằm trong <code>FROM</code> gọi là <b>derived table</b>. MySQL bắt buộc phải đặt bí danh cho nó, ở đây là <code>x</code>, thiếu là báo lỗi ngay." },

      { t: "h", text: "Mẹo đổi dấu để một SUM làm được hai việc" },
      { t: "code", text: "CASE WHEN RecordType = 'Receipt' THEN Debt ELSE -Debt END AS sign_debt" },
      { t: "p", html: "Thay vì chạy hai truy vấn rồi lấy <i>tổng phải thu trừ tổng phải trả</i>, đổi dấu ngay từ từng dòng dữ liệu rồi cộng một lần. Phải thu để dương, còn lại đảo âm, <code>SUM</code> tự ra số dư." },

      { t: "h", text: "Gộp có điều kiện" },
      { t: "code", text: "SUM(CASE WHEN <điều kiện quá hạn> THEN x.sign_debt ELSE 0 END) AS qua_han" },
      { t: "p", html: "Tính hai chỉ số trong <b>một lần quét bảng</b> thay vì quét hai lần rồi ghép. Dòng nào không thỏa điều kiện thì cộng 0 nên không ảnh hưởng tổng." },
      { t: "hint", html: "Bỏ <code>ELSE 0</code> thì <code>CASE</code> trả <code>NULL</code>, mà <code>SUM</code> bỏ qua <code>NULL</code> nên kết quả vẫn đúng. Nhưng nếu đổi sang <code>COUNT</code> thì khác hẳn: <code>COUNT</code> đếm cả số 0, chỉ bỏ qua <code>NULL</code>. Lúc đó <code>ELSE 0</code> làm sai kết quả." },

      { t: "h", text: "Hai chỗ nên sửa" },
      { t: "p", html: "<b>1. So sánh ngày dưới dạng chuỗi.</b>" },
      { t: "code", text: "LEFT(x.PlannedRepaymentDate, 10) < DATE_FORMAT(CURDATE(), '%Y-%m-%d')" },
      { t: "p", html: "Cắt 10 ký tự đầu rồi so chuỗi với chuỗi. Chạy ra đúng vì định dạng <code>yyyy-mm-dd</code> có thứ tự chuỗi trùng với thứ tự ngày. Nhưng bọc cột trong hàm <code>LEFT()</code> khiến MySQL không dùng được index trên cột đó, phải quét toàn bộ bảng. Thuật ngữ gọi là <b>non-sargable</b>." },
      { t: "code", text: "x.PlannedRepaymentDate < CURDATE()" },
      { t: "p", html: "Nếu cột đúng kiểu <code>DATE</code> hoặc <code>DATETIME</code> thì so trực tiếp, vừa gọn vừa dùng được index. Nếu cột đang là <code>VARCHAR</code> thì gốc rễ nằm ở thiết kế bảng." },

      { t: "p", html: "<b>2. IFNULL bọc quanh cột trong WHERE.</b>" },
      { t: "code", text: "WHERE IFNULL(ReversingEntry, 0) = 0\n  AND IFNULL(Active, 0) = 1" },
      { t: "p", html: "Cũng mất index vì lý do trên. Viết lại được thành:" },
      { t: "code", text: "WHERE (ReversingEntry = 0 OR ReversingEntry IS NULL)\n  AND Active = 1" },
      { t: "hint", html: "Để ý vế thứ hai: <code>IFNULL(Active, 0) = 1</code> chính là <code>Active = 1</code>, vì <code>NULL</code> thay bằng 0 thì không bao giờ bằng 1. Cái <code>IFNULL</code> ở đó là thừa. Cách sạch nhất vẫn là để cột <code>NOT NULL DEFAULT 0</code> ngay từ schema." },

      { t: "h", text: "HAVING dùng bí danh: MySQL cho, PostgreSQL không" },
      { t: "code", text: "-- MySQL: chạy được\nHAVING tong_ar <> 0\n\n-- PostgreSQL: lỗi column \"tong_ar\" does not exist\n-- phải viết lại cả biểu thức\nHAVING ROUND(SUM(x.sign_debt)) <> 0" },
      { t: "p", html: "Đây là chỗ dễ dính nhất khi bê truy vấn từ MySQL sang PostgreSQL. PostgreSQL cho dùng bí danh trong <code>GROUP BY</code> và <code>ORDER BY</code>, nhưng <b>không</b> cho trong <code>HAVING</code> và <code>WHERE</code>." },

      { t: "h", text: "Bảng đối chiếu MySQL và PostgreSQL" },
      { t: "table", head: ["Việc cần làm", "MySQL", "PostgreSQL"],
        rows: [
          ["Thay giá trị NULL", "<code>IFNULL(a, 0)</code>", "<code>COALESCE(a, 0)</code>"],
          ["Ngày hôm nay", "<code>CURDATE()</code>", "<code>CURRENT_DATE</code>"],
          ["Định dạng ngày", "<code>DATE_FORMAT(d, '%Y-%m-%d')</code>", "<code>TO_CHAR(d, 'YYYY-MM-DD')</code>"],
          ["Ép kiểu số nguyên", "<code>CAST(x AS SIGNED)</code>", "<code>x::int</code>"],
          ["Bí danh trong HAVING", "Được", "Không"],
          ["Tên cột có chữ hoa", "<code>`Ref_Key`</code> (dấu huyền)", "<code>\"Ref_Key\"</code> (nháy kép)"],
          ["Giới hạn số dòng", "<code>LIMIT 10</code>", "<code>LIMIT 10</code>"]
        ] },
      { t: "hint", html: "<code>COALESCE</code> là chuẩn SQL nên MySQL cũng hiểu. Muốn truy vấn chạy được cả hai bên thì dùng <code>COALESCE</code> thay vì <code>IFNULL</code> ngay từ đầu." },

      { t: "h", text: "Hai điều dễ bỏ sót" },
      { t: "hint", html: "<code>GROUP BY p.Code, p.Description</code> phải liệt kê đủ mọi cột không nằm trong hàm gộp. MySQL đời cũ cho phép thiếu và trả về giá trị bất kỳ, nhưng từ 5.7 chế độ <code>ONLY_FULL_GROUP_BY</code> bật mặc định thì sẽ báo lỗi. PostgreSQL thì luôn bắt buộc." },
      { t: "hint", html: "Hai mệnh đề <code>JOIN</code> đều là <code>INNER JOIN</code>, nên đại lý chưa phát sinh bút toán nào sẽ không xuất hiện trong báo cáo. Với báo cáo công nợ thì thường đúng ý, nhưng nếu muốn thấy cả đại lý dư nợ bằng 0 thì phải đổi sang <code>LEFT JOIN</code> đi từ bảng <code>Partners</code>." }
    ]
  }
];
