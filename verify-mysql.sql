-- Chay het dap an mau de chung minh cau nao cung chay duoc.
-- Nap du lieu truoc:  Get-Content sample-data.sql | mysql -u root -p
-- Roi chay file nay:  Get-Content verify-mysql.sql | mysql -u root -p
-- Khong in ra loi nao nghia la tat ca deu chay duoc.

-- ---- SQL căn bản
USE nb_sql0;
-- b1e1
SELECT * FROM orders;
-- b1e2
SELECT * FROM orders WHERE status = 'paid';
-- b1e3
SELECT customer, SUM(amount) AS tong FROM orders GROUP BY customer;
-- b1e4
SELECT customer, SUM(amount) AS tong FROM orders GROUP BY customer HAVING SUM(amount) > 100;
-- b1e5
SELECT customer, SUM(amount) AS tong FROM orders GROUP BY customer ORDER BY tong DESC LIMIT 2;

-- ---- Vì sao SUM phải nằm trong SELECT
USE nb_sqla1;
-- g1e1
SELECT Partner, SUM(CASE WHEN RecordType = 'Receipt' THEN Debt ELSE -Debt END) AS tong_ar FROM ar_entries GROUP BY Partner;
-- g1e2
SELECT Partner, COUNT(*) AS so_dong FROM ar_entries GROUP BY Partner;
-- g1e3
SELECT Partner, SUM(Debt) AS tong FROM ar_entries GROUP BY Partner HAVING SUM(Debt) > 50;
-- g1e4
SELECT Partner, SUM(Debt) AS tong FROM ar_entries GROUP BY Partner ORDER BY tong DESC LIMIT 1;

-- ---- Mệnh đề SQL: cái nào làm gì, chạy lúc nào
USE nb_sqlc1;
-- c1x1
SELECT * FROM orders ORDER BY "createdAt" DESC LIMIT 10;
-- c1x2
SELECT "partnerId", SUM(total) AS tong FROM orders GROUP BY "partnerId" HAVING SUM(total) > 1000000 ORDER BY tong DESC;
-- c1x3
SELECT "partnerId", SUM(total) AS tong FROM orders GROUP BY "partnerId" HAVING SUM(total) > 500000;
-- c1x4
SELECT "partnerId", status, COUNT(*) FROM orders GROUP BY "partnerId", status;
-- c1x5
SELECT * FROM orders ORDER BY "createdAt" DESC, id LIMIT 20 OFFSET 40;

-- ---- NULL và hàm gộp
USE nb_sqlc2;
-- c2x1
SELECT COUNT(*), COUNT("partnerId"), COUNT(DISTINCT "partnerId") FROM orders;
-- c2x2
SELECT COALESCE(SUM(total), 0) AS tong FROM orders WHERE status = 'CANCELLED';
-- c2x3
SELECT * FROM orders WHERE "partnerId" IS NULL;
-- c2x4
SELECT "partnerId", SUM(CASE WHEN status = 'CONFIRMED' THEN total ELSE 0 END) AS da_chot, SUM(CASE WHEN status = 'DRAFT' THEN total ELSE 0 END) AS con_nhap FROM orders GROUP BY "partnerId";
-- c2x5
SELECT COALESCE(ROUND(AVG(total)::numeric, 0), 0) AS trung_binh FROM orders;

-- ---- JOIN: đặt điều kiện ở ON hay ở WHERE
USE nb_sqlc3;
-- c3x1
SELECT p.name, o.id FROM partners p LEFT JOIN orders o ON o."partnerId" = p.id AND o.status = 'CONFIRMED';
-- c3x2
SELECT p.id, p.name FROM partners p LEFT JOIN orders o ON o."partnerId" = p.id WHERE o.id IS NULL;
-- c3x3
SELECT p.id, p.name FROM partners p WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o."partnerId" = p.id);
-- c3x4
SELECT p.name, COALESCE(SUM(o.total), 0) AS doanh_thu FROM partners p LEFT JOIN orders o ON o."partnerId" = p.id AND o.status = 'CONFIRMED' GROUP BY p.name ORDER BY doanh_thu DESC;

-- ---- UNION: nối kết quả theo chiều dọc
USE nb_sqlc4;
-- c4x1
SELECT id, total, 'b2b' AS nguon FROM orders UNION ALL SELECT id, amount, '1c' AS nguon FROM one_c_sales_orders;
-- c4x2
SELECT "partnerId" FROM orders INTERSECT SELECT "partnerId" FROM one_c_sales_orders;
-- c4x3
SELECT "partnerId" FROM orders EXCEPT SELECT "partnerId" FROM one_c_sales_orders;

-- ---- Index và chuyện làm mất index
USE nb_sqlc5;
-- c5x1
SELECT * FROM orders WHERE "createdAt" >= '2026-01-01' AND "createdAt" < '2027-01-01';
-- c5x2
SELECT * FROM orders WHERE total >= 1200000;
-- c5x3
EXPLAIN ANALYZE SELECT "partnerId", COUNT(*) FROM orders GROUP BY "partnerId";

-- ---- Truy vấn con: subquery, derived table, CTE
USE nb_sqlc6;
-- c6x1
SELECT COUNT(*) FROM (SELECT CASE WHEN RecordType = 'Receipt' THEN Debt ELSE -Debt END AS sign_debt FROM CustomersARAPAccountingByDueDates_RecordType WHERE IFNULL(ReversingEntry,0) = 0 AND IFNULL(Active,0) = 1) x;
-- c6x2
WITH x AS (SELECT CASE WHEN RecordType = 'Receipt' THEN Debt ELSE -Debt END AS sign_debt FROM CustomersARAPAccountingByDueDates_RecordType WHERE IFNULL(ReversingEntry,0) = 0 AND IFNULL(Active,0) = 1) SELECT COUNT(*) FROM x;

-- ---- Tuổi nợ (AR aging)
USE nb_sqlc7;
-- c7x2
SELECT d.Partner_Key AS partnerKey, SUM(x.sign_debt) AS du_no, DATEDIFF(CURDATE(), STR_TO_DATE(LEFT(x.PlannedRepaymentDate,10), '%Y-%m-%d')) AS so_ngay FROM x JOIN DimensionKeysOfAccountingByPartners d ON d.Ref_Key = x.AccountingDimensionByPartners_Key GROUP BY d.Partner_Key, x.PlannedRepaymentDate HAVING SUM(x.sign_debt) > 0;
-- c7x3
SELECT partnerKey, SUM(du_no) AS tong_ar, SUM(CASE WHEN so_ngay > 0 THEN du_no ELSE 0 END) AS qua_han, SUM(CASE WHEN so_ngay BETWEEN 1 AND 30 THEN du_no ELSE 0 END) AS qh_1_30, SUM(CASE WHEN so_ngay BETWEEN 31 AND 60 THEN du_no ELSE 0 END) AS qh_31_60, SUM(CASE WHEN so_ngay BETWEEN 61 AND 90 THEN du_no ELSE 0 END) AS qh_61_90, SUM(CASE WHEN so_ngay > 90 THEN du_no ELSE 0 END) AS qh_tren_90, MAX(CASE WHEN so_ngay > 0 THEN so_ngay ELSE 0 END) AS so_ngay_max FROM t GROUP BY partnerKey;

-- ---- Soi lỗi câu công nợ 1C: số ngày quá hạn bị thổi phồng
USE nb_sqlc8;
-- c8x4
SELECT d.Partner_Key AS partnerKey, STR_TO_DATE(LEFT(x.PlannedRepaymentDate, 10), '%Y-%m-%d') AS ngay_hen, SUM(x.sign_debt) AS du_no FROM x JOIN DimensionKeysOfAccountingByPartners d ON d.Ref_Key = x.AccountingDimensionByPartners_Key GROUP BY d.Partner_Key, ngay_hen;
-- c8x5
SELECT partnerKey, SUM(du_no) AS tong_ar, DATEDIFF(CURDATE(), MIN(CASE WHEN du_no > 0 AND ngay_hen < CURDATE() THEN ngay_hen END)) AS so_ngay_qua_han_max FROM t GROUP BY partnerKey;

-- ---- JOIN trong PostgreSQL
USE nb_sql1;
-- c1q1
SELECT oi.id, s.size FROM order_items oi JOIN skus s ON s.id = oi.sku_id;
-- c1q2
SELECT oi.id, s.size FROM order_items oi LEFT JOIN skus s ON s.id = oi.sku_id;
-- c1q3
SELECT s.id, oi.id FROM skus s LEFT JOIN order_items oi ON oi.sku_id = s.id;
-- c1q4
SELECT s.size, COUNT(oi.id) FROM skus s LEFT JOIN order_items oi ON oi.sku_id = s.id GROUP BY s.size;

-- ---- Tổng hợp dữ liệu trong PostgreSQL
USE nb_sql2;
-- c2q1
SELECT SUM(qty) AS sold FROM order_items;
-- c2q2
SELECT COUNT(*) AS item_rows FROM order_items;
-- c2q3
SELECT s.size, SUM(oi.qty) AS sold FROM order_items oi JOIN skus s ON s.id = oi.sku_id GROUP BY s.size;
-- c2q4
SELECT s.size, SUM(oi.qty) AS sold FROM order_items oi JOIN skus s ON s.id = oi.sku_id GROUP BY s.size HAVING SUM(oi.qty) >= 5;
-- c2q5
SELECT s.size, SUM(oi.qty)::int AS sold FROM order_items oi JOIN skus s ON s.id = oi.sku_id GROUP BY s.size;

-- ---- Truy vấn thống kê size (PostgreSQL + Prisma)
USE nb_sql3;
-- c3q1
SELECT s.option2 AS size, SUM(oi.qty)::int AS sold FROM order_items oi JOIN skus s ON s.id = oi."skuId" GROUP BY s.option2;
-- c3q2
SELECT s.option2, SUM(oi.qty)::int FROM order_items oi JOIN skus s ON s.id = oi."skuId" JOIN orders o ON o.id = oi."orderId" WHERE o.status IN ('CONFIRMED', 'EXPORTED') GROUP BY s.option2;
-- c3q3
SELECT s.option2, COALESCE(SUM(oi.qty), 0)::int AS sold FROM skus s LEFT JOIN order_items oi ON oi."skuId" = s.id GROUP BY s.option2;

-- ---- Báo cáo công nợ trong MySQL
USE nb_my1;
-- m1q2
SELECT Partner, SUM(sign_debt) AS tong_ar FROM ar_entries GROUP BY Partner;
-- m1q3
SELECT Partner, SUM(sign_debt) AS tong_ar, SUM(CASE WHEN PlannedRepaymentDate < CURDATE() THEN sign_debt ELSE 0 END) AS qua_han FROM ar_entries GROUP BY Partner;
