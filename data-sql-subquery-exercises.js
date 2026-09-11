// Bai tap chuong truy van con.
window.SQL_SUBQUERY_EXERCISES = {
  sqlc6: [
    {
      id: "c6x1", type: "query",
      prompt: "Viết derived table tên x: lấy từ bảng CustomersARAPAccountingByDueDates_RecordType, đổi dấu Debt (RecordType = 'Receipt' thì dương, còn lại âm) thành cột sign_debt, chỉ giữ dòng ReversingEntry = 0 và Active = 1. Bọc nó trong FROM của một câu SELECT đếm số dòng.",
      want: "Kết quả mong đợi: một bảng tạm có cột sign_debt, câu ngoài đếm được số dòng của nó.",
      hint: "Derived table bắt buộc phải có bí danh đứng ngay sau dấu ngoặc đóng. Cột có thể NULL thì bọc IFNULL trước khi so sánh.",
      must: [
        { re: "select", label: "SELECT" },
        { re: "from\\s*\\(", label: "FROM ( — mở derived table" },
        { re: "case\\s+when\\s+recordtype", label: "CASE WHEN RecordType = 'Receipt'" },
        { re: "as\\s+sign_debt", label: "AS sign_debt" },
        { re: "\\)\\s*x", label: ") x — bí danh của derived table" },
        { re: "count\\s*\\(", label: "COUNT(...) ở câu ngoài" }
      ],
      answers: ["SELECT COUNT(*) FROM (SELECT CASE WHEN RecordType = 'Receipt' THEN Debt ELSE -Debt END AS sign_debt FROM CustomersARAPAccountingByDueDates_RecordType WHERE IFNULL(ReversingEntry,0) = 0 AND IFNULL(Active,0) = 1) x;"]
    },
    {
      id: "c6x2", type: "query",
      prompt: "Viết lại chính derived table đó dưới dạng CTE, câu ngoài vẫn đếm số dòng.",
      want: "Kết quả mong đợi: giống hệt bài trên, chỉ khác cách viết.",
      hint: "Từ khóa đặt trước SELECT, khai báo tên bảng tạm rồi mới tới câu chính.",
      must: [
        { re: "select", label: "SELECT" },
        { re: "with\\s+x\\s+as\\s*\\(", label: "WITH x AS (" },
        { re: "as\\s+sign_debt", label: "AS sign_debt" },
        { re: "from\\s+x", label: "FROM x ở câu ngoài" }
      ],
      answers: ["WITH x AS (SELECT CASE WHEN RecordType = 'Receipt' THEN Debt ELSE -Debt END AS sign_debt FROM CustomersARAPAccountingByDueDates_RecordType WHERE IFNULL(ReversingEntry,0) = 0 AND IFNULL(Active,0) = 1) SELECT COUNT(*) FROM x;"]
    },
    {
      id: "c6x3", type: "query",
      prompt: "Câu công nợ đang trả top 20 đại lý. Sửa lại thành: lọc theo MỘT DANH SÁCH đại lý truyền vào theo Ref_Key, trả thêm cột Ref_Key để ghép về bảng partners bên Postgres, bỏ LIMIT. Chỉ cần viết phần từ JOIN trở xuống.",
      want: "Kết quả mong đợi: mỗi đại lý trong danh sách một dòng, có refKey, code, tổng AR.",
      hint: "Điều kiện lọc nằm trên bảng Partners nên phải đặt ở câu ngoài. Cột nào có trong SELECT mà không nằm trong hàm gộp thì phải có mặt ở GROUP BY. Giá trị truyền vào dùng dấu chỗ trống, đừng nối chuỗi.",
      must: [
        { re: "join\\s+partners\\s+p", label: "JOIN Partners p" },
        { re: "p\\.ref_key\\s+in\\s*\\(", label: "WHERE p.Ref_Key IN (...)" },
        { re: "\\?", label: "dấu ? thay cho giá trị" },
        { re: "group\\s+by\\s+p\\.ref_key", label: "GROUP BY p.Ref_Key" },
        { re: "sum\\s*\\(\\s*x\\.sign_debt", label: "SUM(x.sign_debt)" }
      ],
      answers: ["JOIN DimensionKeysOfAccountingByPartners d ON d.Ref_Key = x.AccountingDimensionByPartners_Key JOIN Partners p ON p.Ref_Key = d.Partner_Key WHERE p.Ref_Key IN (?, ?) GROUP BY p.Ref_Key, p.Code, p.Description HAVING SUM(x.sign_debt) <> 0 ORDER BY SUM(x.sign_debt) DESC;"]
    },
    {
      id: "c6x4", type: "query",
      prompt: "HAVING tong_ar <> 0 chạy được trên MySQL nhưng lỗi trên PostgreSQL. Viết lại mệnh đề HAVING đó cho chạy được ở cả hai hệ.",
      want: "Kết quả mong đợi: chỉ giữ đại lý có tổng AR khác 0.",
      hint: "PostgreSQL VẪN CÓ HAVING. Vấn đề nằm ở chỗ khác: HAVING chạy trước SELECT nên chưa nhìn thấy thứ được đặt tên trong SELECT.",
      must: [
        { re: "having\\s+sum\\s*\\(", label: "HAVING SUM(...) — viết lại cả hàm gộp" },
        { re: "<>|!=", label: "<> 0" }
      ],
      answers: ["HAVING SUM(x.sign_debt) <> 0"]
    }
  ]
};
