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
  }
];
