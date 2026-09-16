// Bai tap chuong "Vi sao SUM phai nam trong SELECT", chay duoc tren nb_sqla1.
window.SQL_AGGREGATE_EXERCISES = {
  sqla1: [
    {
      id: "g1e1", type: "query",
      prompt: "Tính tổng công nợ của từng đại lý. Receipt cộng vào, loại khác trừ ra.",
      want: "Kết quả mong đợi: An = 60, Bình = 60.",
      hint: "Đặt cả CASE vào bên trong SUM, rồi gom nhóm theo Partner.",
      must: [
        { re: "select", label: "SELECT" },
        { re: "from\\s+ar_entries", label: "FROM ar_entries" },
        { re: "sum\\s*\\(\\s*case", label: "SUM(CASE ...)" },
        { re: "group\\s+by\\s+partner", label: "GROUP BY Partner" }
      ],
      answers: ["SELECT Partner, SUM(CASE WHEN RecordType = 'Receipt' THEN Debt ELSE -Debt END) AS tong_ar FROM ar_entries GROUP BY Partner;"]
    },
    {
      id: "g1e2", type: "query",
      prompt: "Đếm xem mỗi đại lý có bao nhiêu dòng bút toán.",
      want: "Kết quả mong đợi: An = 2, Bình = 1.",
      hint: "Đếm dòng thì dùng COUNT, vẫn gom nhóm theo Partner.",
      must: [
        { re: "select", label: "SELECT" },
        { re: "from\\s+ar_entries", label: "FROM ar_entries" },
        { re: "count\\s*\\(", label: "COUNT(...)" },
        { re: "group\\s+by\\s+partner", label: "GROUP BY Partner" }
      ],
      answers: ["SELECT Partner, COUNT(*) AS so_dong FROM ar_entries GROUP BY Partner;"]
    },
    {
      id: "g1e3", type: "query",
      prompt: "Tính tổng công nợ theo đại lý, nhưng chỉ giữ đại lý có tổng lớn hơn 50.",
      want: "Điều kiện đặt trên kết quả của SUM nên không thể để ở WHERE.",
      hint: "Lọc nhóm thì dùng HAVING, và nó viết sau GROUP BY.",
      must: [
        { re: "select", label: "SELECT" },
        { re: "from\\s+ar_entries", label: "FROM ar_entries" },
        { re: "sum\\s*\\(", label: "SUM(...)" },
        { re: "group\\s+by\\s+partner", label: "GROUP BY Partner" },
        { re: "having", label: "HAVING" }
      ],
      answers: ["SELECT Partner, SUM(Debt) AS tong FROM ar_entries GROUP BY Partner HAVING SUM(Debt) > 50;"]
    },
    {
      id: "g1e4", type: "query",
      prompt: "Lấy đại lý nợ nhiều nhất, sắp xếp giảm dần và chỉ lấy một dòng.",
      want: "Dùng được bí danh ở ORDER BY vì nó chạy sau SELECT.",
      hint: "Thêm ORDER BY ... DESC rồi LIMIT 1 vào cuối câu.",
      must: [
        { re: "select", label: "SELECT" },
        { re: "from\\s+ar_entries", label: "FROM ar_entries" },
        { re: "sum\\s*\\(", label: "SUM(...)" },
        { re: "group\\s+by\\s+partner", label: "GROUP BY Partner" },
        { re: "order\\s+by", label: "ORDER BY" },
        { re: "desc", label: "DESC" },
        { re: "limit\\s*1", label: "LIMIT 1" }
      ],
      answers: ["SELECT Partner, SUM(Debt) AS tong FROM ar_entries GROUP BY Partner ORDER BY tong DESC LIMIT 1;"]
    }
  ]
};
