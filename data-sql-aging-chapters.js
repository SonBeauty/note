// Tuoi no (AR aging) - khai niem ke toan + ky thuat SQL hai tang.
window.SQL_AGING = [
  {
    id: "sqlc7",
    title: "Tuổi nợ (AR aging)",
    subtitle: "Nợ quá hạn bao lâu rồi, và tính bằng SQL kiểu gì",
    intro: "AR = Accounts Receivable, khoản phải thu. Tuổi nợ là số ngày một khoản đã quá hạn. Chương này vừa là khái niệm kế toán, vừa là bài gộp hai tầng trên đúng dữ liệu 1C.",
    blocks: [
      { t: "h", text: "Vì sao một con số tổng là không đủ" },
      { t: "p", html: "Báo cáo ghi <i>\"Đại lý A quá hạn 50 triệu\"</i> — nghe thì rõ, nhưng thiếu mất thông tin quan trọng nhất: <b>quá hạn từ bao giờ</b>." },
      { t: "table", head: ["Tình huống", "Tổng quá hạn", "Ý nghĩa thật"],
        rows: [
          ["50tr quá hạn 10 ngày", "50.000.000", "Bình thường, gọi nhắc là thu được"],
          ["50tr quá hạn 200 ngày", "50.000.000", "Gần như mất trắng, phải trích lập dự phòng"],
          ["25tr quá 10 ngày + 25tr quá 200 ngày", "50.000.000", "Một nửa lành, một nửa hỏng"]
        ] },
      { t: "p", html: "Ba trường hợp ra <b>cùng một con số</b> nhưng phải xử lý hoàn toàn khác nhau. Nên báo cáo công nợ chuẩn luôn kèm bảng chia mốc." },

      { t: "h", text: "Chia mốc — quy ước thường dùng" },
      { t: "table", head: ["Mốc", "Nghĩa", "Việc cần làm"],
        rows: [
          ["Chưa tới hạn", "Ngày đến hạn còn ở tương lai", "Không phải nợ xấu, chỉ theo dõi"],
          ["1–30 ngày", "Vừa quá hạn", "Gọi nhắc"],
          ["31–60 ngày", "Chậm rõ rệt", "Sale phải vào cuộc"],
          ["61–90 ngày", "Đáng lo", "Cân nhắc khóa đơn mới"],
          ["Trên 90 ngày", "Nợ khó đòi", "Trích lập dự phòng, có thể chuyển pháp lý"]
        ] },
      { t: "hint", html: "Mốc 30/60/90 là thông lệ chứ không phải luật. Công ty đặt mốc khác cũng được, miễn thống nhất — nhưng đã chốt rồi thì đừng đổi giữa chừng, số liệu sẽ không so sánh được với kỳ trước." },

      { t: "h", text: "Điểm mấu chốt: tuổi nợ thuộc về TỪNG LÔ, không phải về tổng" },
      { t: "p", html: "Trong 1C, mỗi dòng AR gắn một <code>PlannedRepaymentDate</code> — ngày đến hạn. Tiền thu về cũng ghi vào đúng ngày đến hạn của lô mà nó trả. Nên phải <b>gom theo cặp (đại lý, ngày đến hạn)</b> trước, mới biết lô nào còn dư." },
      { t: "code", text: "Dai ly A, hom nay 2026-09-11:\n\n  ngay den han   phat sinh   da thu    du no    so ngay qua han\n  2026-02-01     30.000.000  30.000.000       0    -- da thu du, BO QUA\n  2026-06-15     20.000.000   5.000.000  15.000.000        88\n  2026-08-20     10.000.000           0  10.000.000        22\n  2026-12-31     50.000.000           0  50.000.000   chua toi han\n\n  => qua han 1-30  : 10.000.000\n     qua han 61-90 : 15.000.000\n     tong qua han  : 25.000.000\n     qua han lau nhat: 88 ngay" },
      { t: "hint", html: "Lô 2026-02-01 đã thu đủ nên dư bằng 0 — <b>không</b> được tính là quá hạn dù ngày đến hạn đã trôi qua rất lâu. Gộp thẳng một tầng là dính lỗi này." },

      { t: "h", text: "Tầng 1: dư nợ và số ngày của từng lô" },
      { t: "code", text: "SELECT\n  d.Partner_Key AS partnerKey,\n  SUM(x.sign_debt) AS du_no,\n  DATEDIFF(CURDATE(), STR_TO_DATE(LEFT(x.PlannedRepaymentDate, 10), '%Y-%m-%d')) AS so_ngay\nFROM ( ... ) x\nJOIN DimensionKeysOfAccountingByPartners d\n  ON d.Ref_Key = x.AccountingDimensionByPartners_Key\nGROUP BY d.Partner_Key, x.PlannedRepaymentDate\nHAVING SUM(x.sign_debt) > 0          -- chi giu lo con du" },
      { t: "p", html: "<code>PlannedRepaymentDate</code> trong 1C là kiểu <b>text</b>, nên <code>DATEDIFF</code> không nhận thẳng. Phải cắt 10 ký tự đầu rồi <code>STR_TO_DATE</code> đổi về kiểu ngày. Chỗ này bọc hàm vào cột là chấp nhận được vì nó nằm trong <code>SELECT</code>, không phải điều kiện lọc." },

      { t: "h", text: "Tầng 2: chia mốc bằng gộp có điều kiện" },
      { t: "code", text: "SELECT\n  partnerKey,\n  SUM(du_no)                                                  AS tong_ar,\n  SUM(CASE WHEN so_ngay > 0                  THEN du_no ELSE 0 END) AS qua_han,\n  SUM(CASE WHEN so_ngay BETWEEN  1 AND 30    THEN du_no ELSE 0 END) AS qh_1_30,\n  SUM(CASE WHEN so_ngay BETWEEN 31 AND 60    THEN du_no ELSE 0 END) AS qh_31_60,\n  SUM(CASE WHEN so_ngay BETWEEN 61 AND 90    THEN du_no ELSE 0 END) AS qh_61_90,\n  SUM(CASE WHEN so_ngay > 90                 THEN du_no ELSE 0 END) AS qh_tren_90,\n  MAX(CASE WHEN so_ngay > 0 THEN so_ngay ELSE 0 END)                AS so_ngay_max\nFROM ( tang_1 ) t\nGROUP BY partnerKey;" },
      { t: "hint", html: "<b>Một</b> lần quét ra đủ sáu con số. Đừng chạy bốn câu riêng cho bốn mốc rồi ghép ở tầng code — vừa chậm gấp bốn, vừa có nguy cơ bốn câu đọc phải bốn ảnh chụp dữ liệu khác nhau." },

      { t: "h", text: "Lưu kết quả thế nào cho dễ dùng" },
      { t: "p", html: "Lưu một dòng mỗi đại lý với các cột mốc sẵn. Mọi câu hỏi nghiệp vụ sau đó đều thành một điều kiện đơn giản:" },
      { t: "code", text: "WHERE \"qhTren90\" > 0                     -- dai ly co no kho doi\nWHERE \"quaHan\" > 0 AND \"soNgayMax\" > 60   -- can sale vao cuoc\nORDER BY \"qhTren90\" DESC                  -- xep theo muc do nguy hiem" },

      { t: "h", text: "Bốn cái bẫy" },
      { t: "table", head: ["Bẫy", "Hậu quả"],
        rows: [
          ["Gộp một tầng, không gom theo ngày đến hạn", "Lô đã thu đủ vẫn bị tính quá hạn"],
          ["Quên <code>HAVING SUM(...) &gt; 0</code>", "Lô dư âm (thu thừa) kéo tụt số quá hạn"],
          ["Tính ngày đến hạn hôm nay là quá hạn", "Lệch một ngày trên toàn bộ báo cáo"],
          ["Mốc viết <code>&gt; 30</code> và <code>&gt; 60</code> chồng nhau", "Cộng bốn mốc lại lớn hơn tổng quá hạn"]
        ] }
    ],
    dataset: [
      { name: "Lô nợ của đại lý A (hôm nay 2026-09-11)",
        head: ["PlannedRepaymentDate", "du_no", "so_ngay"],
        rows: [["2026-02-01", "0", "222"], ["2026-06-15", "15000000", "88"],
               ["2026-08-20", "10000000", "22"], ["2026-12-31", "50000000", "-111"]] }
    ]
  },
  {
    id: "sqlc8",
    title: "Soi lỗi câu công nợ 1C: số ngày quá hạn bị thổi phồng",
    subtitle: "GROUP BY gom theo cái gì, SUM cộng cái gì, và vì sao MIN phải chạy sau khi gom",
    intro: "Chữa lỗi trên câu SQL thật trong plan công nợ (phase 02, ngày 15/09). Tổng nợ và bốn mốc tuổi nợ ra đúng, riêng cột số ngày quá hạn lâu nhất bị sai vì MIN chạy trên từng dòng phát sinh chứ không chạy trên lô còn dư.",
    blocks: [
      { t: "h", text: "Dữ liệu: đại lý P01, hôm nay 2026-09-15" },
      { t: "table", head: ["Dòng", "PlannedRepaymentDate", "RecordType", "sign_debt"],
        rows: [
          ["a", "2026-06-01", "Receipt", "+10.000.000"],
          ["b", "2026-06-01", "Expense", "−10.000.000"],
          ["c", "2026-08-01", "Receipt", "+5.000.000"],
          ["d", "2026-10-01", "Expense", "−3.000.000"]
        ] },
      { t: "p", html: "Lô 01/06 đã trả đủ. Lô 01/08 còn nợ 5tr, quá hạn 45 ngày. Dòng 01/10 là tiền trả trước cho một lô chưa tới hạn." },

      { t: "h", text: "Câu SQL hiện tại ra gì" },
      { t: "code", text: "MIN(\n  CASE WHEN LEFT(x.PlannedRepaymentDate,10) < DATE_FORMAT(CURDATE(), '%Y-%m-%d')\n       THEN x.PlannedRepaymentDate END\n)\n-- chay tren TUNG DONG a, b, c, d" },
      { t: "table", head: ["Dòng", "Ngày đã qua?", "Vào MIN?"],
        rows: [["a", "có", "có"], ["b", "có", "có"], ["c", "có", "có"], ["d", "không", "không"]] },
      { t: "big", text: "MIN(01/06, 01/06, 01/08) = 01/06  →  106 ngày" },
      { t: "p", html: "Điều kiện chặn duy nhất là <code>SUM(quá hạn) &gt; 0</code> tính trên <b>cả đại lý</b>: 10 − 10 + 5 = 5tr, vẫn qua. Nên cột ra <b>106 ngày</b>, trong khi đúng phải là <b>45 ngày</b>." },
      { t: "hint", html: "<b>Hậu quả trên UI:</b> đại lý bị tô đỏ vì quá hạn trên 90 ngày, nhưng ô <code>agingOver90</code> lại bằng 0. Hai con số trên cùng một thẻ tự mâu thuẫn. Bốn mốc thì vẫn đúng, vì SUM của dòng a và b tự triệt tiêu." },

      { t: "h", text: "CASE chỉ nhìn thấy một dòng" },
      { t: "p", html: "<code>CASE WHEN</code> chạy trên từng dòng, nó chỉ biết ngày của dòng đó. Nó <b>không biết</b> dòng a đã bị dòng b trả hết, vì chuyện đã trả hết chỉ lộ ra khi cộng a với b. Muốn biết lô nào còn dư thì phải <b>gom trước, hỏi sau</b>." },

      { t: "h", text: "Luật: cột gom khác cột cộng" },
      { t: "table", head: ["Vai trò", "Nằm ở đâu", "Trong bài này"],
        rows: [
          ["Cột gom: chia nhóm theo cái gì", "<code>GROUP BY</code>", "đại lý, ngày hẹn"],
          ["Cột cộng: tính gì trong mỗi nhóm", "<code>SUM(...)</code> trong SELECT", "<code>sign_debt</code>"]
        ] },
      { t: "p", html: "Một cột <b>không</b> đứng ở cả hai chỗ. Đưa <code>sign_debt</code> vào GROUP BY thì +10tr và −10tr có giá trị khác nhau nên thành <b>hai nhóm riêng</b>, không bao giờ cộng được với nhau:" },
      { t: "code", text: "GROUP BY Partner_Key, PlannedRepaymentDate, sign_debt   -- SAI\n\n  P01  2026-06-01  +10.000.000  -> SUM = +10.000.000\n  P01  2026-06-01  -10.000.000  -> SUM = -10.000.000\n  -- hai nhom rieng, lo 01/06 van bi coi la con du\n\nGROUP BY Partner_Key, PlannedRepaymentDate              -- DUNG\n\n  P01  2026-06-01  -> SUM = 0\n  P01  2026-08-01  -> SUM = 5.000.000\n  P01  2026-10-01  -> SUM = -3.000.000" },
      { t: "hint", html: "Mẹo tự kiểm: gom xong mà mỗi nhóm vẫn chỉ có đúng một dòng gốc thì GROUP BY đang vô dụng. Gần như chắc chắn bạn đã nhét cột cộng vào GROUP BY." },

      { t: "h", text: "Quá hạn lâu nhất = ngày hẹn CŨ nhất còn dư" },
      { t: "table", head: ["Điều kiện", "Đúng", "Hay nhầm"],
        rows: [
          ["Thế nào là quá hạn", "ngày hẹn <b>&lt;</b> hôm nay", "ngày hẹn &gt; hôm nay: đó là <i>chưa tới hạn</i>"],
          ["Lô nào được tính", "số dư của lô <b>&gt; 0</b>", "mọi dòng có ngày đã qua"],
          ["Chọn lô nào", "ngày <b>cũ nhất</b>: <code>MIN(ngày)</code>, hoặc <code>MAX(số ngày)</code>", "ngày <i>gần nhất</i>: ra số ngày quá hạn <b>ít</b> nhất"]
        ] },

      { t: "h", text: "Khung ba tầng (tự điền chỗ ___)" },
      { t: "code", text: "SELECT                                   -- tang 3: moi dai ly 1 dong\n  partnerKey,\n  SUM(du_no) AS tong_ar,\n  SUM(CASE WHEN ___ THEN du_no ELSE 0 END) AS qua_han,\n  ...bon moc tuoi no...,\n  DATEDIFF(CURDATE(), MIN(CASE WHEN ___ AND ___ THEN ngay_hen END)) AS so_ngay_qua_han_max\nFROM (\n  SELECT                                 -- tang 2 (MOI): moi lo 1 dong\n    d.Partner_Key AS partnerKey,\n    ___ AS ngay_hen,\n    SUM(x.sign_debt) AS du_no\n  FROM ( ... ) x                          -- tang 1: tung dong phat sinh\n  JOIN DimensionKeysOfAccountingByPartners d ON ...\n  JOIN Partners p ON ...\n  GROUP BY ___, ___\n) t\nGROUP BY partnerKey;" },
      { t: "p", html: "Ở tầng 1 chưa có cột đại lý. <code>x</code> chỉ có <code>AccountingDimensionByPartners_Key</code>, phải JOIN sang <code>DimensionKeysOfAccountingByPartners</code> mới có <code>Partner_Key</code>. Nên gom theo đại lý phải làm <b>sau</b> JOIN." },
      { t: "p", html: "<code>PlannedRepaymentDate</code> là kiểu text. Dòng Receipt và Expense của cùng một lô phải ra <b>đúng cùng một chuỗi</b> thì mới gom chung được, nên cắt 10 ký tự đầu rồi đổi về ngày, và GROUP BY theo đúng biểu thức đó." },
      { t: "hint", html: "Bốn mốc tuổi nợ ở tầng 3 viết gần như y cũ, chỉ đổi <code>x.sign_debt</code> thành <code>du_no</code>. SUM của các SUM vẫn ra đúng tổng, vì ngày hẹn là cột gom nên mỗi lô rơi trọn vào đúng một mốc. Điều này chỉ đúng khi tầng 2 <b>không lọc bớt lô</b>, xem mục dưới." },

      { t: "h", text: "Có nên thêm HAVING SUM(...) > 0 ở tầng 2?" },
      { t: "p", html: "Chương <b>Tuổi nợ</b> lọc lô còn dư ngay khi gom bằng HAVING. Lọc như vậy thì tầng trên gọn hơn, nhưng <b>đổi luôn tổng dư nợ</b>:" },
      { t: "table", head: ["Cách", "tong_ar của P01", "Ý nghĩa"],
        rows: [
          ["Không HAVING, lọc bằng <code>du_no &gt; 0</code> trong CASE", "5 − 3 = <b>2.000.000</b>", "Tổng đã trừ tiền trả trước"],
          ["<code>HAVING SUM(x.sign_debt) &gt; 0</code> ở tầng 2", "<b>5.000.000</b>", "Bỏ mất lô âm, tổng cao hơn số dư thật"]
        ] },
      { t: "hint", html: "Không cách nào đúng tuyệt đối. Đây là <b>quyết định nghiệp vụ</b>: số dư nợ hiện cho đại lý có trừ tiền trả trước hay không. Hỏi kế toán rồi ghi vào plan, đừng để câu SQL tự quyết." },

      { t: "h", text: "Thêm một tầng thì có chậm hơn không" },
      { t: "p", html: "Tầng 2 gom 1,58 triệu dòng thành các lô (đại lý × ngày hẹn), số lô ít hơn nhiều. Tầng 3 chỉ chạy trên tập nhỏ đó. Thường không chậm hơn đáng kể, nhưng <b>phải đo lại</b> chứ không đoán." },
      { t: "p", html: "Hướng tối ưu thêm: gom theo <code>AccountingDimensionByPartners_Key</code> + ngày hẹn <b>trước khi JOIN</b>, rồi mới JOIN tập đã thu nhỏ sang <code>DimensionKeysOfAccountingByPartners</code> và <code>Partners</code>. JOIN vài chục nghìn lô rẻ hơn nhiều so với JOIN 1,58 triệu dòng." },
      { t: "hint", html: "<b>Kiểm dữ liệu trước khi dùng hướng này:</b> một đại lý có mấy <code>Ref_Key</code> trong <code>DimensionKeysOfAccountingByPartners</code>? Nếu tiền trả ghi dưới key khác với khoản nợ thì gom theo key sẽ không triệt tiêu được nhau, và kết quả lại sai y như lỗi ban đầu." },

      { t: "h", text: "Bài học rút ra" },
      { t: "p", html: "Chương <b>Tuổi nợ</b> đã gom đúng theo (đại lý, ngày hẹn), còn câu SQL trong plan ngày 15/09 không có tầng đó. Tối ưu tốc độ xong, ngoài đo thời gian còn phải <b>chạy lại ca kiểm thử đúng sai</b>. Chỉ cần một đại lý có lô đã trả đủ từ lâu là bắt được lỗi này ngay." }
    ],
    dataset: [
      { name: "Sổ nợ đại lý P01 (hôm nay 2026-09-15)",
        head: ["Partner_Key", "PlannedRepaymentDate", "RecordType", "sign_debt"],
        rows: [["P01", "2026-06-01", "Receipt", "10000000"], ["P01", "2026-06-01", "Expense", "-10000000"],
               ["P01", "2026-08-01", "Receipt", "5000000"], ["P01", "2026-10-01", "Expense", "-3000000"]] },
      { name: "Kết quả tầng 2 (bảng t)",
        head: ["partnerKey", "ngay_hen", "du_no"],
        rows: [["P01", "2026-06-01", "0"], ["P01", "2026-08-01", "5000000"], ["P01", "2026-10-01", "-3000000"]] }
    ]
  }
];
