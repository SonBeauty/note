// Truy van con. Vi du lay tu chinh cau cong no 1C.
window.SQL_SUBQUERY = [
  {
    id: "sqlc6",
    title: "Truy vấn con: subquery, derived table, CTE",
    subtitle: "Ba tên gọi của cùng một ý tưởng",
    intro: "Cùng một ý: lấy kết quả của truy vấn này làm đầu vào cho truy vấn kia. Khác nhau chỉ ở chỗ đặt nó ở đâu. Chương này mổ đúng câu công nợ 1C.",
    blocks: [
      { t: "h", text: "Ba chỗ đặt, ba tên gọi" },
      { t: "table", head: ["Tên", "Đặt ở đâu", "Trả về", "Bắt buộc"],
        rows: [
          ["Subquery", "Trong <code>SELECT</code> / <code>WHERE</code>", "Một giá trị, hoặc một danh sách", "—"],
          ["<b>Derived table</b>", "Trong <code>FROM</code>", "Một <b>bảng tạm</b>", "<b>Phải có bí danh</b>"],
          ["CTE", "Trong <code>WITH</code> đặt trước <code>SELECT</code>", "Một bảng tạm có tên", "MySQL 8+ mới có"]
        ] },

      { t: "h", text: "Derived table là cái gì" },
      { t: "p", html: "Là một câu <code>SELECT</code> đặt trong ngoặc, nằm ở vị trí của một cái bảng. Máy chạy nó trước, ra một <b>bảng tạm trong bộ nhớ</b>, rồi câu ngoài dùng bảng tạm đó y như một bảng thật." },
      { t: "code", text: "SELECT ... FROM ( SELECT ... ) x\n                ^^^^^^^^^^^^^^^^ ^\n                bang tam         bi danh — thieu la loi cu phap" },
      { t: "hint", html: "Trong câu công nợ 1C, chữ <code>x</code> đứng ngay sau dấu ngoặc đóng chính là bí danh đó. <code>JOIN ... ON d.Ref_Key = x.AccountingDimension...</code> — <code>x</code> được dùng như tên bảng." },

      { t: "h", text: "Vì sao câu công nợ phải bọc derived table" },
      { t: "code", text: "-- Bang tam x: loc dong hop le + doi dau mot lan\nSELECT\n  CASE WHEN RecordType = 'Receipt' THEN Debt ELSE -Debt END AS sign_debt,\n  PlannedRepaymentDate,\n  AccountingDimensionByPartners_Key\nFROM CustomersARAPAccountingByDueDates_RecordType\nWHERE IFNULL(ReversingEntry, 0) = 0\n  AND IFNULL(Active, 0) = 1" },
      { t: "p", html: "Lý do là <b>đặt tên cho một biểu thức để dùng lại</b>. Cột <code>sign_debt</code> bị dùng <b>hai lần</b> ở câu ngoài: một lần trong <code>SUM(x.sign_debt)</code>, một lần trong <code>SUM(CASE WHEN ... THEN x.sign_debt ...)</code>." },
      { t: "code", text: "-- Neu KHONG boc derived table, phai chep nguyen cuc CASE hai lan:\nSUM(CASE WHEN RecordType = 'Receipt' THEN Debt ELSE -Debt END)\nSUM(CASE WHEN LEFT(PlannedRepaymentDate,10) < ...\n         THEN CASE WHEN RecordType = 'Receipt' THEN Debt ELSE -Debt END\n         ELSE 0 END)\n-- CASE long CASE, sua mot cho quen sua cho kia -> sai so am tham" },
      { t: "hint", html: "Nhớ thứ tự chạy: bí danh <code>sign_debt</code> chỉ ra đời ở bước <code>SELECT</code>, nên <b>không</b> dùng lại được ngay trong cùng câu đó. Muốn dùng lại thì phải đẩy nó xuống một tầng — đó chính là derived table." },

      { t: "h", text: "Ba lý do dùng derived table" },
      { t: "table", head: ["Lý do", "Ví dụ"],
        rows: [
          ["Đặt tên biểu thức để dùng lại", "<code>sign_debt</code> ở câu công nợ"],
          ["Gộp hai tầng: gộp xong rồi gộp tiếp", "Tổng theo đơn, rồi lấy trung bình các tổng đó"],
          ["Lọc bớt sớm cho nhẹ phần sau", "Vứt dòng đảo bút toán trước khi JOIN 2 bảng"]
        ] },

      { t: "h", text: "CTE: cùng một thứ, dễ đọc hơn" },
      { t: "code", text: "WITH x AS (\n  SELECT CASE WHEN RecordType = 'Receipt' THEN Debt ELSE -Debt END AS sign_debt,\n         PlannedRepaymentDate, AccountingDimensionByPartners_Key\n  FROM CustomersARAPAccountingByDueDates_RecordType\n  WHERE IFNULL(ReversingEntry, 0) = 0 AND IFNULL(Active, 0) = 1\n)\nSELECT ... FROM x JOIN ... ;" },
      { t: "p", html: "Đọc từ trên xuống thay vì từ trong ngoặc ra. Khai báo được <b>nhiều</b> bảng tạm nối tiếp nhau, và bảng sau dùng được bảng trước — derived table không làm được." },

      { t: "h", text: "Đặt điều kiện lọc ở tầng nào" },
      { t: "p", html: "Lọc một đại lý cụ thể: điều kiện nằm trên bảng <code>Partners</code>, mà bảng đó chỉ được JOIN vào ở <b>câu ngoài</b>. Nên điều kiện phải đặt ở câu ngoài — bảng tạm <code>x</code> chưa biết gì về đại lý, nó chỉ có cột <code>AccountingDimensionByPartners_Key</code>." },
      { t: "code", text: "-- Dung: loc o cau ngoai, sau khi da JOIN toi Partners\n...\nJOIN Partners p ON p.Ref_Key = d.Partner_Key\nWHERE p.Ref_Key = ?          -- hoac IN (?, ?, ?) cho nhieu dai ly\nGROUP BY p.Ref_Key, p.Code, p.Description" },
      { t: "hint", html: "Quy tắc chung: lọc <b>càng sớm càng tốt</b> để tầng sau nhẹ đi — nhưng chỉ sớm được tới chỗ mà cột cần lọc đã tồn tại. Cột chưa có ở tầng đó thì đành lọc ở tầng ngoài." }
    ],
    dataset: [
      { name: "x (bảng tạm sau khi chạy derived table)",
        head: ["sign_debt", "PlannedRepaymentDate", "AccountingDimensionByPartners_Key"],
        rows: [["5000000", "2026-08-01T00:00:00", "D1"],
               ["-2000000", "2026-08-01T00:00:00", "D1"],
               ["3000000", "2026-12-31T00:00:00", "D2"]] },
      { name: "Partners", head: ["Ref_Key", "Code", "Description"],
        rows: [["PK1", "DL001", "Đại lý Hà Nội"], ["PK2", "DL002", "Đại lý Đà Nẵng"]] }
    ]
  }
];
