// Bai tap dang viet truy van. Cham theo thanh phan bat buoc trong "must",
// nen viet hoa thuong hay xuong dong kieu nao cung duoc.
window.SQL_BASICS_EXERCISES = {
  sql0: [
    {
      id: "b1e1", type: "query",
      prompt: "Lấy toàn bộ các cột của mọi đơn hàng.",
      want: "Kết quả mong đợi: cả 4 dòng.",
      hint: "Dấu sao thay cho danh sách cột.",
      must: [
        { re: "select", label: "SELECT" },
        { re: "\\*", label: "*" },
        { re: "from\\s+orders", label: "FROM orders" }
      ],
      answers: ["SELECT * FROM orders;"]
    },
    {
      id: "b1e2", type: "query",
      prompt: "Chỉ lấy những đơn có status là paid.",
      want: "Kết quả mong đợi: 3 dòng của An, An và Chi.",
      hint: "Lọc từng dòng thì dùng WHERE, giá trị chữ đặt trong nháy đơn.",
      must: [
        { re: "select", label: "SELECT" },
        { re: "from\\s+orders", label: "FROM orders" },
        { re: "where", label: "WHERE" },
        { re: "status", label: "điều kiện trên cột status" },
        { re: "paid", label: "'paid'" }
      ],
      answers: ["SELECT * FROM orders WHERE status = 'paid';"]
    },
    {
      id: "b1e3", type: "query",
      prompt: "Tính tổng amount của từng khách hàng.",
      want: "Kết quả mong đợi: An = 130, Bình = 50, Chi = 200.",
      hint: "Gom nhóm theo customer rồi cộng amount trong mỗi nhóm.",
      must: [
        { re: "select", label: "SELECT" },
        { re: "sum\\s*\\(\\s*amount", label: "SUM(amount)" },
        { re: "from\\s+orders", label: "FROM orders" },
        { re: "group\\s+by\\s+customer", label: "GROUP BY customer" }
      ],
      answers: ["SELECT customer, SUM(amount) AS tong FROM orders GROUP BY customer;"]
    },
    {
      id: "b1e4", type: "query",
      prompt: "Viết lại cả truy vấn, chỉ giữ khách có tổng amount lớn hơn 100.",
      want: "Kết quả mong đợi: An = 130, Chi = 200.",
      hint: "Điều kiện dựa trên kết quả hàm gộp thì phải đặt sau khi đã gom nhóm.",
      must: [
        { re: "select", label: "SELECT" },
        { re: "from\\s+orders", label: "FROM orders" },
        { re: "sum\\s*\\(\\s*amount", label: "SUM(amount)" },
        { re: "group\\s+by\\s+customer", label: "GROUP BY customer" },
        { re: "having", label: "HAVING" }
      ],
      answers: ["SELECT customer, SUM(amount) AS tong FROM orders GROUP BY customer HAVING SUM(amount) > 100;"]
    },
    {
      id: "b1e5", type: "query",
      prompt: "Lấy 2 khách có tổng amount cao nhất, sắp xếp giảm dần.",
      want: "Kết quả mong đợi: Chi = 200 rồi tới An = 130.",
      hint: "Sắp xếp giảm dần rồi cắt lấy 2 dòng đầu.",
      must: [
        { re: "select", label: "SELECT" },
        { re: "from\\s+orders", label: "FROM orders" },
        { re: "sum\\s*\\(\\s*amount", label: "SUM(amount)" },
        { re: "group\\s+by\\s+customer", label: "GROUP BY customer" },
        { re: "order\\s+by", label: "ORDER BY" },
        { re: "desc", label: "DESC" },
        { re: "limit\\s*2", label: "LIMIT 2" }
      ],
      answers: ["SELECT customer, SUM(amount) AS tong FROM orders GROUP BY customer ORDER BY tong DESC LIMIT 2;"]
    }
  ]
};
