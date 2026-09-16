-- PostgreSQL. Sinh tu build-sample-data.js, dung sua tay.
-- Mot database notebook, moi chuong mot schema. Khong dung toi database cua du an.
-- Nap: psql -U postgres -d notebook -f sample-data-postgres.sql

-- ============ SQL căn bản ============
DROP SCHEMA IF EXISTS sql0 CASCADE;
CREATE SCHEMA sql0;
SET search_path TO sql0;

CREATE TABLE orders (
  id INTEGER,
  customer VARCHAR(24),
  amount INTEGER,
  status VARCHAR(24)
);

INSERT INTO orders (id, customer, amount, status) VALUES
  (1, 'An', 100, 'paid'),
  (2, 'Bình', 50, 'new'),
  (3, 'An', 30, 'paid'),
  (4, 'Chi', 200, 'paid');

-- ============ Vì sao SUM phải nằm trong SELECT ============
DROP SCHEMA IF EXISTS sqla1 CASCADE;
CREATE SCHEMA sqla1;
SET search_path TO sqla1;

CREATE TABLE ar_entries (
  recordtype VARCHAR(27),
  debt INTEGER,
  plannedrepaymentdate DATE,
  partner VARCHAR(24)
);

INSERT INTO ar_entries (recordtype, debt, plannedrepaymentdate, partner) VALUES
  ('Receipt', 100, '2026-08-01', 'An'),
  ('Payment', 40, '2026-12-31', 'An'),
  ('Receipt', 60, '2026-09-01', 'Bình');

-- ============ Mệnh đề SQL: cái nào làm gì, chạy lúc nào ============
DROP SCHEMA IF EXISTS sqlc1 CASCADE;
CREATE SCHEMA sqlc1;
SET search_path TO sqlc1;

CREATE TABLE orders (
  id VARCHAR(22),
  "partnerId" VARCHAR(22),
  total INTEGER,
  status VARCHAR(29),
  "createdAt" DATE
);

INSERT INTO orders (id, "partnerId", total, status, "createdAt") VALUES
  ('O1', 'P1', 1200000, 'CONFIRMED', '2026-01-05'),
  ('O2', 'P1', 800000, 'DRAFT', '2026-02-11'),
  ('O3', 'P2', 500000, 'CONFIRMED', '2026-02-20'),
  ('O4', NULL, 300000, 'CONFIRMED', '2026-03-02');

CREATE TABLE partners (
  id VARCHAR(22),
  name VARCHAR(34),
  isactive BOOLEAN
);

INSERT INTO partners (id, name, isactive) VALUES
  ('P1', 'Đại lý Hà Nội', true),
  ('P2', 'Đại lý Đà Nẵng', true),
  ('P3', 'Đại lý Cần Thơ', false);

-- ============ NULL và hàm gộp ============
DROP SCHEMA IF EXISTS sqlc2 CASCADE;
CREATE SCHEMA sqlc2;
SET search_path TO sqlc2;

CREATE TABLE orders (
  id VARCHAR(22),
  "partnerId" VARCHAR(22),
  total INTEGER,
  status VARCHAR(29),
  createdat DATE
);

INSERT INTO orders (id, "partnerId", total, status, createdat) VALUES
  ('O1', 'P1', 1200000, 'CONFIRMED', '2026-01-05'),
  ('O2', 'P1', 800000, 'DRAFT', '2026-02-11'),
  ('O3', 'P2', 500000, 'CONFIRMED', '2026-02-20'),
  ('O4', NULL, 300000, 'CONFIRMED', '2026-03-02');

-- ============ JOIN: đặt điều kiện ở ON hay ở WHERE ============
DROP SCHEMA IF EXISTS sqlc3 CASCADE;
CREATE SCHEMA sqlc3;
SET search_path TO sqlc3;

CREATE TABLE partners (
  id VARCHAR(22),
  name VARCHAR(34),
  isactive BOOLEAN
);

INSERT INTO partners (id, name, isactive) VALUES
  ('P1', 'Đại lý Hà Nội', true),
  ('P2', 'Đại lý Đà Nẵng', true),
  ('P3', 'Đại lý Cần Thơ', false);

CREATE TABLE orders (
  id VARCHAR(22),
  "partnerId" VARCHAR(22),
  total INTEGER,
  status VARCHAR(29),
  createdat DATE
);

INSERT INTO orders (id, "partnerId", total, status, createdat) VALUES
  ('O1', 'P1', 1200000, 'CONFIRMED', '2026-01-05'),
  ('O2', 'P1', 800000, 'DRAFT', '2026-02-11'),
  ('O3', 'P2', 500000, 'CONFIRMED', '2026-02-20'),
  ('O4', NULL, 300000, 'CONFIRMED', '2026-03-02');

-- ============ UNION: nối kết quả theo chiều dọc ============
DROP SCHEMA IF EXISTS sqlc4 CASCADE;
CREATE SCHEMA sqlc4;
SET search_path TO sqlc4;

CREATE TABLE orders (
  id VARCHAR(22),
  "partnerId" VARCHAR(22),
  total INTEGER,
  status VARCHAR(29)
);

INSERT INTO orders (id, "partnerId", total, status) VALUES
  ('O1', 'P1', 1200000, 'CONFIRMED'),
  ('O2', 'P1', 800000, 'DRAFT'),
  ('O3', 'P2', 500000, 'CONFIRMED'),
  ('O4', NULL, 300000, 'CONFIRMED');

CREATE TABLE one_c_sales_orders (
  id VARCHAR(24),
  "partnerId" VARCHAR(22),
  amount INTEGER
);

INSERT INTO one_c_sales_orders (id, "partnerId", amount) VALUES
  ('S501', 'P1', 700),
  ('S502', 'P3', 250);

-- ============ Index và chuyện làm mất index ============
DROP SCHEMA IF EXISTS sqlc5 CASCADE;
CREATE SCHEMA sqlc5;
SET search_path TO sqlc5;

CREATE TABLE orders (
  id VARCHAR(22),
  "partnerId" VARCHAR(22),
  total INTEGER,
  status VARCHAR(29),
  "createdAt" DATE
);

INSERT INTO orders (id, "partnerId", total, status, "createdAt") VALUES
  ('O1', 'P1', 1200000, 'CONFIRMED', '2026-01-05'),
  ('O2', 'P1', 800000, 'DRAFT', '2026-02-11'),
  ('O3', 'P2', 500000, 'CONFIRMED', '2026-02-20'),
  ('O4', NULL, 300000, 'CONFIRMED', '2026-03-02');

-- ============ Truy vấn con: subquery, derived table, CTE ============
DROP SCHEMA IF EXISTS sqlc6 CASCADE;
CREATE SCHEMA sqlc6;
SET search_path TO sqlc6;

CREATE TABLE partners (
  ref_key VARCHAR(23),
  code VARCHAR(25),
  description VARCHAR(34)
);

INSERT INTO partners (ref_key, code, description) VALUES
  ('PK1', 'DL001', 'Đại lý Hà Nội'),
  ('PK2', 'DL002', 'Đại lý Đà Nẵng');

CREATE TABLE customersarapaccountingbyduedates_recordtype (
  recordtype VARCHAR(27),
  debt INTEGER,
  plannedrepaymentdate DATE,
  accountingdimensionbypartners_key VARCHAR(22),
  reversingentry INTEGER,
  active INTEGER
);

INSERT INTO customersarapaccountingbyduedates_recordtype (recordtype, debt, plannedrepaymentdate, accountingdimensionbypartners_key, reversingentry, active) VALUES
  ('Receipt', 100, '2026-08-01', 'D1', 0, 1),
  ('Payment', 40, '2026-12-31', 'D1', 0, 1),
  ('Receipt', 60, '2026-09-01', 'D2', 0, 1);

CREATE TABLE dimensionkeysofaccountingbypartners (
  ref_key VARCHAR(22),
  partner_key VARCHAR(23)
);

INSERT INTO dimensionkeysofaccountingbypartners (ref_key, partner_key) VALUES
  ('D1', 'P01'),
  ('D2', 'P02');

-- ============ Tuổi nợ (AR aging) ============
DROP SCHEMA IF EXISTS sqlc7 CASCADE;
CREATE SCHEMA sqlc7;
SET search_path TO sqlc7;

CREATE TABLE x (
  sign_debt INTEGER,
  plannedrepaymentdate DATE,
  accountingdimensionbypartners_key VARCHAR(22)
);

INSERT INTO x (sign_debt, plannedrepaymentdate, accountingdimensionbypartners_key) VALUES
  (100, '2026-08-01', 'D1'),
  (-40, '2026-12-31', 'D1'),
  (60, '2026-09-01', 'D2');

CREATE TABLE dimensionkeysofaccountingbypartners (
  ref_key VARCHAR(22),
  partner_key VARCHAR(23)
);

INSERT INTO dimensionkeysofaccountingbypartners (ref_key, partner_key) VALUES
  ('D1', 'P01'),
  ('D2', 'P02');

CREATE TABLE t (
  partnerkey VARCHAR(23),
  du_no INTEGER,
  so_ngay INTEGER
);

INSERT INTO t (partnerkey, du_no, so_ngay) VALUES
  ('P01', 100, 46),
  ('P01', 40, -106),
  ('P02', 60, 15);

-- ============ Soi lỗi câu công nợ 1C: số ngày quá hạn bị thổi phồng ============
DROP SCHEMA IF EXISTS sqlc8 CASCADE;
CREATE SCHEMA sqlc8;
SET search_path TO sqlc8;

CREATE TABLE x (
  sign_debt INTEGER,
  plannedrepaymentdate DATE,
  accountingdimensionbypartners_key VARCHAR(22)
);

INSERT INTO x (sign_debt, plannedrepaymentdate, accountingdimensionbypartners_key) VALUES
  (100, '2026-08-01', 'D1'),
  (-40, '2026-12-31', 'D1'),
  (60, '2026-09-01', 'D2');

CREATE TABLE dimensionkeysofaccountingbypartners (
  ref_key VARCHAR(22),
  partner_key VARCHAR(23)
);

INSERT INTO dimensionkeysofaccountingbypartners (ref_key, partner_key) VALUES
  ('D1', 'P01'),
  ('D2', 'P02');

CREATE TABLE t (
  partnerkey VARCHAR(23),
  ngay_hen DATE,
  du_no INTEGER
);

INSERT INTO t (partnerkey, ngay_hen, du_no) VALUES
  ('P01', '2026-08-01', 100),
  ('P01', '2026-12-31', -40),
  ('P02', '2026-09-01', 60);

-- ============ JOIN trong PostgreSQL ============
DROP SCHEMA IF EXISTS sql1 CASCADE;
CREATE SCHEMA sql1;
SET search_path TO sql1;

CREATE TABLE order_items (
  id VARCHAR(23),
  sku_id VARCHAR(22)
);

INSERT INTO order_items (id, sku_id) VALUES
  ('OI1', 'S1'),
  ('OI2', 'S9');

CREATE TABLE skus (
  id VARCHAR(22),
  size VARCHAR(21)
);

INSERT INTO skus (id, size) VALUES
  ('S1', 'M'),
  ('S2', 'L');

-- ============ Tổng hợp dữ liệu trong PostgreSQL ============
DROP SCHEMA IF EXISTS sql2 CASCADE;
CREATE SCHEMA sql2;
SET search_path TO sql2;

CREATE TABLE order_items (
  id VARCHAR(23),
  sku_id VARCHAR(22),
  qty INTEGER
);

INSERT INTO order_items (id, sku_id, qty) VALUES
  ('OI1', 'S1', 3),
  ('OI2', 'S1', 5),
  ('OI3', 'S2', 2);

CREATE TABLE skus (
  id VARCHAR(22),
  size VARCHAR(21)
);

INSERT INTO skus (id, size) VALUES
  ('S1', 'M'),
  ('S2', 'L');

-- ============ Truy vấn thống kê size (PostgreSQL + Prisma) ============
DROP SCHEMA IF EXISTS sql3 CASCADE;
CREATE SCHEMA sql3;
SET search_path TO sql3;

CREATE TABLE order_items (
  id VARCHAR(23),
  "skuId" VARCHAR(22),
  "orderId" VARCHAR(22),
  qty INTEGER
);

INSERT INTO order_items (id, "skuId", "orderId", qty) VALUES
  ('OI1', 'S1', 'O1', 3),
  ('OI2', 'S2', 'O2', 5);

CREATE TABLE skus (
  id VARCHAR(22),
  option2 VARCHAR(21)
);

INSERT INTO skus (id, option2) VALUES
  ('S1', 'M'),
  ('S2', 'L');

CREATE TABLE orders (
  id VARCHAR(22),
  status VARCHAR(29)
);

INSERT INTO orders (id, status) VALUES
  ('O1', 'CONFIRMED'),
  ('O2', 'DRAFT');

-- ============ Báo cáo công nợ trong MySQL ============
DROP SCHEMA IF EXISTS my1 CASCADE;
CREATE SCHEMA my1;
SET search_path TO my1;

CREATE TABLE ar_entries (
  recordtype VARCHAR(27),
  debt INTEGER,
  plannedrepaymentdate DATE,
  partner VARCHAR(24),
  sign_debt INTEGER
);

INSERT INTO ar_entries (recordtype, debt, plannedrepaymentdate, partner, sign_debt) VALUES
  ('Receipt', 100, '2026-08-01', 'An', 100),
  ('Payment', 40, '2026-12-31', 'An', -40),
  ('Receipt', 60, '2026-09-01', 'Bình', 60);
