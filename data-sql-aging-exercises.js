// Bai tap chuong tuoi no.
window.SQL_AGING_EXERCISES = {
  sqlc7: [
    { id: "c7x1", type: "guess",
      prompt: "Lô nợ đến hạn 2026-02-01 đã thu đủ nên dư nợ bằng 0. Hôm nay là 2026-09-11. Lô này có được tính vào phần quá hạn không?",
      hint: "Quá hạn nghĩa là tới hạn rồi mà VẪN CÒN nợ.",
      answers: ["không", "khong", "no"] },

    { id: "c7x2", type: "query",
      prompt: "Viết tầng 1: gom theo (Partner_Key, PlannedRepaymentDate), tính dư nợ của từng lô và số ngày quá hạn, chỉ giữ lô còn dư lớn hơn 0. Bảng nguồn là derived table x đã có sẵn cột sign_debt.",
      want: "Kết quả mong đợi: mỗi lô còn nợ một dòng, kèm số ngày.",
      hint: "PlannedRepaymentDate là text nên phải đổi về kiểu ngày mới trừ được. Lọc theo kết quả hàm gộp thì dùng mệnh đề nào?",
      must: [
        { re: "select", label: "SELECT" },
        { re: "from\\s+x", label: "FROM x" },
        { re: "datediff\\s*\\(", label: "DATEDIFF(...)" },
        { re: "str_to_date\\s*\\(", label: "STR_TO_DATE(...) — cột đang là text" },
        { re: "group\\s+by\\s+d?\\.?partner_key\\s*,", label: "GROUP BY Partner_Key, PlannedRepaymentDate" },
        { re: "plannedrepaymentdate", label: "gom theo PlannedRepaymentDate" },
        { re: "having\\s+sum\\s*\\(", label: "HAVING SUM(...) > 0" }
      ],
      answers: ["SELECT d.Partner_Key AS partnerKey, SUM(x.sign_debt) AS du_no, DATEDIFF(CURDATE(), STR_TO_DATE(LEFT(x.PlannedRepaymentDate,10), '%Y-%m-%d')) AS so_ngay FROM x JOIN DimensionKeysOfAccountingByPartners d ON d.Ref_Key = x.AccountingDimensionByPartners_Key GROUP BY d.Partner_Key, x.PlannedRepaymentDate HAVING SUM(x.sign_debt) > 0;"] },

    { id: "c7x3", type: "query",
      prompt: "Viết tầng 2: từ kết quả tầng 1 (các cột partnerKey, du_no, so_ngay), tính cho mỗi đại lý: tổng AR, tổng quá hạn, bốn mốc 1-30 / 31-60 / 61-90 / trên 90, và số ngày quá hạn lâu nhất. Chỉ MỘT câu.",
      want: "Kết quả mong đợi: mỗi đại lý một dòng, bảy con số.",
      hint: "Gộp có điều kiện: mỗi mốc là một cột SUM(CASE WHEN ... THEN du_no ELSE 0 END). Các mốc không được chồng lấn nhau.",
      must: [
        { re: "select", label: "SELECT" },
        { re: "from\\s+t", label: "FROM t" },
        { re: "sum\\s*\\(\\s*du_no\\s*\\)", label: "SUM(du_no) AS tong_ar" },
        { re: "between\\s+1\\s+and\\s+30", label: "BETWEEN 1 AND 30" },
        { re: "between\\s+31\\s+and\\s+60", label: "BETWEEN 31 AND 60" },
        { re: "between\\s+61\\s+and\\s+90", label: "BETWEEN 61 AND 90" },
        { re: "so_ngay\\s*>\\s*90", label: "so_ngay > 90" },
        { re: "max\\s*\\(", label: "MAX(...) cho số ngày lâu nhất" },
        { re: "group\\s+by\\s+partnerkey", label: "GROUP BY partnerKey" }
      ],
      answers: ["SELECT partnerKey, SUM(du_no) AS tong_ar, SUM(CASE WHEN so_ngay > 0 THEN du_no ELSE 0 END) AS qua_han, SUM(CASE WHEN so_ngay BETWEEN 1 AND 30 THEN du_no ELSE 0 END) AS qh_1_30, SUM(CASE WHEN so_ngay BETWEEN 31 AND 60 THEN du_no ELSE 0 END) AS qh_31_60, SUM(CASE WHEN so_ngay BETWEEN 61 AND 90 THEN du_no ELSE 0 END) AS qh_61_90, SUM(CASE WHEN so_ngay > 90 THEN du_no ELSE 0 END) AS qh_tren_90, MAX(CASE WHEN so_ngay > 0 THEN so_ngay ELSE 0 END) AS so_ngay_max FROM t GROUP BY partnerKey;"] },

    { id: "c7x4", type: "guess",
      prompt: "Bạn viết bốn mốc là so_ngay > 0, so_ngay > 30, so_ngay > 60, so_ngay > 90. Cộng bốn cột đó lại thì so với tổng quá hạn sẽ thế nào?",
      hint: "Một khoản quá hạn 100 ngày thỏa mãn mấy điều kiện trong bốn cái đó?",
      answers: ["lớn hơn", "lon hon", "lớn hơn tổng", "bị cộng trùng", "trùng", "nhiều hơn"] },

    { id: "c7x5", type: "fill",
      prompt: "Khoản nợ đến hạn đúng hôm nay thì số ngày quá hạn bằng ___, và KHÔNG được tính vào phần quá hạn.",
      hint: "Hôm nay trừ hôm nay.",
      answers: ["0", "không", "khong"] }
  ],

  sqlc8: [
    { id: "c8x1", type: "fill",
      prompt: "Với câu SQL hiện tại trong plan, so_ngay_qua_han_max của P01 là ___ ngày.",
      hint: "MIN chạy trên cả dòng a và b. Từ 01/06 tới 15/09 là bao nhiêu ngày?",
      answers: ["106"] },

    { id: "c8x2", type: "fill",
      prompt: "Sau khi sửa đúng, so_ngay_qua_han_max của P01 là ___ ngày.",
      hint: "Lô 01/06 dư 0, lô 01/10 chưa tới hạn. Còn lại lô nào?",
      answers: ["45"] },

    { id: "c8x3", type: "fill",
      prompt: "Viết GROUP BY Partner_Key, PlannedRepaymentDate, sign_debt thì ngày 01/06 của P01 ra ___ nhóm.",
      hint: "+10tr và −10tr có phải cùng một giá trị không?",
      answers: ["2", "hai"] },

    { id: "c8x4", type: "query",
      prompt: "Viết tầng 2: từ derived table x (có sign_debt, PlannedRepaymentDate, AccountingDimensionByPartners_Key), JOIN sang DimensionKeysOfAccountingByPartners để lấy Partner_Key, rồi tính số dư của từng lô (đại lý, ngày hẹn). Không lọc bằng HAVING.",
      want: "Kết quả mong đợi: P01 có 3 dòng. 01/06 = 0, 01/08 = 5.000.000, 01/10 = −3.000.000.",
      hint: "sign_debt là cột cộng, chỉ được nằm trong SUM. x chưa có Partner_Key nên phải JOIN trước khi gom.",
      must: [
        { re: "select", label: "SELECT" },
        { re: "from\\s+x\\b", label: "FROM x" },
        { re: "join\\s+dimensionkeysofaccountingbypartners", label: "JOIN DimensionKeysOfAccountingByPartners" },
        { re: "sum\\s*\\(\\s*(x\\.)?sign_debt\\s*\\)", label: "SUM(sign_debt)" },
        { re: "group\\s+by[^;]*partner_?key", label: "GROUP BY có Partner_Key" },
        { re: "group\\s+by[^;]*(plannedrepaymentdate|ngay_hen)", label: "GROUP BY có ngày hẹn" },
        { re: "group\\s+by((?!sign_debt|having|order\\s+by).)*(having|order\\s+by|$)", label: "GROUP BY không được chứa sign_debt" }
      ],
      answers: ["SELECT d.Partner_Key AS partnerKey, STR_TO_DATE(LEFT(x.PlannedRepaymentDate, 10), '%Y-%m-%d') AS ngay_hen, SUM(x.sign_debt) AS du_no FROM x JOIN DimensionKeysOfAccountingByPartners d ON d.Ref_Key = x.AccountingDimensionByPartners_Key GROUP BY d.Partner_Key, ngay_hen;"] },

    { id: "c8x5", type: "query",
      prompt: "Viết tầng 3: từ bảng t (partnerKey, ngay_hen, du_no), tính cho mỗi đại lý tong_ar và so_ngay_qua_han_max. Số ngày chỉ tính trên lô vừa đã quá hạn vừa còn dư.",
      want: "Kết quả mong đợi: P01 có tong_ar = 2.000.000, so_ngay_qua_han_max = 45.",
      hint: "Hai điều kiện trong cùng một CASE. Quá hạn lâu nhất là ngày hẹn cũ nhất, tức MIN của ngày.",
      must: [
        { re: "select", label: "SELECT" },
        { re: "from\\s+t\\b", label: "FROM t" },
        { re: "sum\\s*\\(\\s*du_no\\s*\\)", label: "SUM(du_no) AS tong_ar" },
        { re: "(min|max)\\s*\\(\\s*case\\s+when", label: "MIN(CASE WHEN ...) hoặc MAX(CASE WHEN ...)" },
        { re: "du_no\\s*>\\s*0", label: "chỉ lô còn dư: du_no > 0" },
        { re: "ngay_hen\\s*<\\s*curdate|curdate\\s*\\(\\s*\\)\\s*>\\s*ngay_hen|so_ngay\\s*>\\s*0", label: "chỉ lô đã quá hạn: ngay_hen < CURDATE()" },
        { re: "group\\s+by\\s+partnerkey", label: "GROUP BY partnerKey" }
      ],
      answers: ["SELECT partnerKey, SUM(du_no) AS tong_ar, DATEDIFF(CURDATE(), MIN(CASE WHEN du_no > 0 AND ngay_hen < CURDATE() THEN ngay_hen END)) AS so_ngay_qua_han_max FROM t GROUP BY partnerKey;"] },

    { id: "c8x6", type: "fill",
      prompt: "Đại lý không có lô nào vừa quá hạn vừa còn dư thì MIN(CASE WHEN ... THEN ngay_hen END) trả về ___.",
      hint: "CASE không có ELSE thì dòng không khớp ra gì? Nhớ bọc COALESCE(..., 0) cho số ngày.",
      answers: ["null"] },

    { id: "c8x7", type: "fill",
      prompt: "Thêm HAVING SUM(x.sign_debt) > 0 ở tầng 2 thì tong_ar của P01 thành ___ triệu.",
      hint: "HAVING loại những lô nào? Lô dư 0 và lô dư −3tr.",
      answers: ["5", "5.000.000", "5000000"] }
  ]
};
