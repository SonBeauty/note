// Chuong sinh ra tu dung cho mac ket: vi sao SUM phai nam trong SELECT.
window.SQL_AGGREGATE_CHAPTERS = [
  {
    id: "sqla1",
    title: "Vì sao SUM phải nằm trong SELECT",
    subtitle: "Thứ tự viết, thứ tự chạy, và chỗ đặt hàm gộp",
    intro: "Lỗi 1064 kinh điển khi mới học gom nhóm. Gốc rễ là hiểu nhầm SQL thành danh sách các bước làm, trong khi nó là bản mô tả bảng kết quả.",
    blocks: [
      { t: "h", text: "Câu sai và lỗi nhận được" },
      { t: "code", text: "SELECT CASE WHEN RecordType='Receipt' THEN Debt ELSE -Debt END AS sign_debt\nFROM ar_entries\nGROUP BY Partner\nSUM(sign_debt)          -- ← lỗi ở đây" },
      { t: "code", text: "SQL Error [1064]: You have an error in your SQL syntax ...\nnear 'SUM(sign_debt)' at line 3" },
      { t: "p", html: "Suy nghĩ dẫn tới câu này rất tự nhiên: <i>gom nhóm xong rồi cộng</i>. Máy chạy đúng như vậy thật. Nhưng SQL không cho bạn viết theo kiểu liệt kê các bước." },

      { t: "h", text: "SQL là tờ đơn đặt hàng, không phải công thức nấu ăn" },
      { t: "p", html: "Bạn không ra lệnh <i>làm cái này rồi làm cái kia</i>. Bạn <b>mô tả bảng kết quả</b> muốn nhận, máy tự lo các bước. Nên trước khi viết, hãy vẽ bảng kết quả ra:" },
      { t: "table", head: ["Partner", "tong_ar"], rows: [["An", "60"], ["Bình", "60"]] },
      { t: "p", html: "Rồi điền vào tờ đơn bằng ba câu hỏi:" },
      { t: "table", head: ["Câu hỏi", "Trả lời", "Mệnh đề"],
        rows: [
          ["Kết quả có những cột nào?", "Partner và tong_ar", "<code>SELECT</code>"],
          ["Dữ liệu lấy từ đâu?", "bảng ar_entries", "<code>FROM</code>"],
          ["Mỗi dòng kết quả ứng với một gì?", "một đại lý", "<code>GROUP BY</code>"]
        ] },
      { t: "p", html: "<code>SUM</code> nằm ở đâu trong tờ đơn này? Nó là <b>cách tính ra cột <code>tong_ar</code></b>. Nó không phải một bước, nó là <b>định nghĩa của một cột</b>. Mà cột thì khai ở <code>SELECT</code>." },
      { t: "code", text: "SELECT Partner,                                      -- cột 1\n       SUM(CASE WHEN RecordType='Receipt'\n                THEN Debt ELSE -Debt END) AS tong_ar  -- cột 2, tính bằng SUM\nFROM ar_entries\nGROUP BY Partner;                                    -- mỗi dòng = một đại lý" },
      { t: "hint", html: "<b>Câu chốt:</b> <code>GROUP BY</code> không tạo ra cột nào cả, nó chỉ trả lời <i>mỗi dòng kết quả là một gì</i>. Nên viết <code>SUM</code> sau nó là nhét định nghĩa cột vào chỗ không phải để khai cột." },

      { t: "h", text: "Chạy tay với ba dòng dữ liệu" },
      { t: "code", text: "Bước 1  FROM ar_entries        lấy cả 3 dòng ra\n\nBước 3  GROUP BY Partner       chia thành từng đống, CHƯA tính gì\n        nhóm \"An\"   →  { Receipt 100 }, { Payment 40 }\n        nhóm \"Bình\" →  { Receipt 60 }\n\nBước 5  SELECT                 với MỖI nhóm, tính từng cột\n        nhóm \"An\"   →  Partner = \"An\"\n                       SUM(...) = (+100) + (-40) = 60\n        nhóm \"Bình\" →  Partner = \"Bình\"\n                       SUM(...) = (+60)          = 60" },
      { t: "p", html: "<code>SUM</code> biết cộng cho ai vì lúc nó chạy, nó đang đứng <b>bên trong một nhóm cụ thể</b> và chỉ nhìn thấy các dòng của nhóm đó." },

      { t: "h", text: "Hai tầng lồng nhau" },
      { t: "code", text: "SUM( CASE WHEN RecordType = 'Receipt' THEN Debt ELSE -Debt END )\n │    └────────── tầng trong: chạy trên TỪNG DÒNG ──────────┘\n └─── tầng ngoài: gom kết quả của CẢ NHÓM thành một số" },
      { t: "table", head: ["", "Chạy trên", "Trả về"],
        rows: [
          ["<code>CASE</code>", "từng dòng một", "một số cho mỗi dòng"],
          ["<code>SUM</code>", "cả nhóm", "một số cho cả nhóm"]
        ] },
      { t: "p", html: "Nói theo JavaScript: <code>CASE</code> là hàm truyền vào <code>map</code>, <code>SUM</code> là <code>reduce</code>." },
      { t: "code", text: "const groups = groupBy(rows, r => r.Partner);          // GROUP BY Partner\n\nObject.entries(groups).map(([partner, g]) => ({\n  Partner: partner,                                   // SELECT Partner\n  tong_ar: g.reduce((s, r) =>                         // SELECT SUM(...) AS tong_ar\n    s + (r.RecordType === 'Receipt' ? r.Debt : -r.Debt), 0)\n}));" },
      { t: "hint", html: "Để ý <code>reduce</code> nằm <b>bên trong object đang dựng cho mỗi dòng kết quả</b>, không đứng riêng một dòng sau <code>groupBy</code>. Bạn sẽ không bao giờ viết <code>groupBy(...); reduce(...);</code> vì cộng xong chẳng biết gán vào đâu. Câu SQL sai lúc nãy chính là phiên bản SQL của đoạn vô nghĩa đó." },

      { t: "h", text: "Vì sao viết sau mà lại chạy trước" },
      { t: "table", head: ["", "Thứ tự"],
        rows: [
          ["<b>Viết</b>", "SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY → LIMIT"],
          ["<b>Chạy</b>", "FROM → WHERE → GROUP BY → HAVING → <b>SELECT</b> → ORDER BY → LIMIT"]
        ] },
      { t: "p", html: "Hai thứ tự này phục vụ hai việc khác nhau. Thứ tự <b>viết</b> là luật chính tả để máy <i>đọc hiểu</i> câu lệnh. Thứ tự <b>chạy</b> là cơ chế bên trong sau khi đã đọc hiểu xong. Học thứ tự viết để viết cho đúng, học thứ tự chạy để hiểu vì sao có chỗ được có chỗ không." },
      { t: "code", text: "SELECT Partner, SUM(Debt) AS tong\nFROM ar_entries\nWHERE tong > 100      -- ✗ lỗi: WHERE chạy TRƯỚC SELECT, lúc đó chưa có tong\nGROUP BY Partner\nORDER BY tong DESC;   -- ✓ được: ORDER BY chạy SAU SELECT nên tong đã tồn tại" },
      { t: "hint", html: "Vẫn thắc mắc <i>sao không cho viết tự do khi mỗi mệnh đề đã có từ khóa riêng</i>? Về kỹ thuật thì làm được, SQL chỉ chọn không làm vậy. Lý do chính: truy vấn lồng nhau sẽ hóa mơ hồ, có hai <code>FROM</code> thì không biết cái nào thuộc truy vấn nào. Các ngôn ngữ sinh sau như LINQ hay PRQL đặt <code>from</code> lên đầu cho khớp thứ tự chạy, nhưng SQL đã phổ biến 50 năm nên không đổi được nữa." }
    ],
    dataset: [
      { name: "ar_entries", head: ["RecordType", "Debt", "PlannedRepaymentDate", "Partner"],
        rows: [
          ["Receipt", "100", "2026-08-01", "An"],
          ["Payment", "40", "2026-12-31", "An"],
          ["Receipt", "60", "2026-09-01", "Bình"]
        ] }
    ]
  }
];
