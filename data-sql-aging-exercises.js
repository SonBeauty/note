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
  ]
};
