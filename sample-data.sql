-- MySQL. Sinh tu build-sample-data.js, dung sua tay.
-- Moi chuong mot database rieng. Nap: Get-Content sample-data.sql | mysql -u root -p

-- ============ SQL căn bản ============
DROP DATABASE IF EXISTS nb_sql0;
CREATE DATABASE nb_sql0 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE nb_sql0;

CREATE TABLE `orders` (
  `id` INT,
  `customer` VARCHAR(24),
  `amount` INT,
  `status` VARCHAR(24)
);

INSERT INTO `orders` (`id`, `customer`, `amount`, `status`) VALUES
  (1, 'An', 100, 'paid'),
  (2, 'Bình', 50, 'new'),
  (3, 'An', 30, 'paid'),
  (4, 'Chi', 200, 'paid');

-- ============ Vì sao SUM phải nằm trong SELECT ============
DROP DATABASE IF EXISTS nb_sqla1;
CREATE DATABASE nb_sqla1 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE nb_sqla1;

CREATE TABLE `ar_entries` (
  `RecordType` VARCHAR(27),
  `Debt` INT,
  `PlannedRepaymentDate` DATE,
  `Partner` VARCHAR(24)
);

INSERT INTO `ar_entries` (`RecordType`, `Debt`, `PlannedRepaymentDate`, `Partner`) VALUES
  ('Receipt', 100, '2026-08-01', 'An'),
  ('Payment', 40, '2026-12-31', 'An'),
  ('Receipt', 60, '2026-09-01', 'Bình');

-- ============ Mệnh đề SQL: cái nào làm gì, chạy lúc nào ============
DROP DATABASE IF EXISTS nb_sqlc1;
CREATE DATABASE nb_sqlc1 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE nb_sqlc1;

CREATE TABLE `orders` (
  `id` VARCHAR(22),
  `partnerId` VARCHAR(22),
  `total` INT,
  `status` VARCHAR(29),
  `createdAt` DATE
);

INSERT INTO `orders` (`id`, `partnerId`, `total`, `status`, `createdAt`) VALUES
  ('O1', 'P1', 1200000, 'CONFIRMED', '2026-01-05'),
  ('O2', 'P1', 800000, 'DRAFT', '2026-02-11'),
  ('O3', 'P2', 500000, 'CONFIRMED', '2026-02-20'),
  ('O4', NULL, 300000, 'CONFIRMED', '2026-03-02');

CREATE TABLE `partners` (
  `id` VARCHAR(22),
  `name` VARCHAR(34),
  `isActive` TINYINT(1)
);

INSERT INTO `partners` (`id`, `name`, `isActive`) VALUES
  ('P1', 'Đại lý Hà Nội', 1),
  ('P2', 'Đại lý Đà Nẵng', 1),
  ('P3', 'Đại lý Cần Thơ', 0);

-- ============ NULL và hàm gộp ============
DROP DATABASE IF EXISTS nb_sqlc2;
CREATE DATABASE nb_sqlc2 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE nb_sqlc2;

CREATE TABLE `orders` (
  `id` VARCHAR(22),
  `partnerId` VARCHAR(22),
  `total` INT,
  `status` VARCHAR(29),
  `createdAt` DATE
);

INSERT INTO `orders` (`id`, `partnerId`, `total`, `status`, `createdAt`) VALUES
  ('O1', 'P1', 1200000, 'CONFIRMED', '2026-01-05'),
  ('O2', 'P1', 800000, 'DRAFT', '2026-02-11'),
  ('O3', 'P2', 500000, 'CONFIRMED', '2026-02-20'),
  ('O4', NULL, 300000, 'CONFIRMED', '2026-03-02');

-- ============ JOIN: đặt điều kiện ở ON hay ở WHERE ============
DROP DATABASE IF EXISTS nb_sqlc3;
CREATE DATABASE nb_sqlc3 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE nb_sqlc3;

CREATE TABLE `partners` (
  `id` VARCHAR(22),
  `name` VARCHAR(34),
  `isActive` TINYINT(1)
);

INSERT INTO `partners` (`id`, `name`, `isActive`) VALUES
  ('P1', 'Đại lý Hà Nội', 1),
  ('P2', 'Đại lý Đà Nẵng', 1),
  ('P3', 'Đại lý Cần Thơ', 0);

CREATE TABLE `orders` (
  `id` VARCHAR(22),
  `partnerId` VARCHAR(22),
  `total` INT,
  `status` VARCHAR(29),
  `createdAt` DATE
);

INSERT INTO `orders` (`id`, `partnerId`, `total`, `status`, `createdAt`) VALUES
  ('O1', 'P1', 1200000, 'CONFIRMED', '2026-01-05'),
  ('O2', 'P1', 800000, 'DRAFT', '2026-02-11'),
  ('O3', 'P2', 500000, 'CONFIRMED', '2026-02-20'),
  ('O4', NULL, 300000, 'CONFIRMED', '2026-03-02');

-- ============ UNION: nối kết quả theo chiều dọc ============
DROP DATABASE IF EXISTS nb_sqlc4;
CREATE DATABASE nb_sqlc4 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE nb_sqlc4;

CREATE TABLE `orders` (
  `id` VARCHAR(22),
  `partnerId` VARCHAR(22),
  `total` INT,
  `status` VARCHAR(29)
);

INSERT INTO `orders` (`id`, `partnerId`, `total`, `status`) VALUES
  ('O1', 'P1', 1200000, 'CONFIRMED'),
  ('O2', 'P1', 800000, 'DRAFT'),
  ('O3', 'P2', 500000, 'CONFIRMED'),
  ('O4', NULL, 300000, 'CONFIRMED');

CREATE TABLE `one_c_sales_orders` (
  `id` VARCHAR(24),
  `partnerId` VARCHAR(22),
  `amount` INT
);

INSERT INTO `one_c_sales_orders` (`id`, `partnerId`, `amount`) VALUES
  ('S501', 'P1', 700),
  ('S502', 'P3', 250);

-- ============ Index và chuyện làm mất index ============
DROP DATABASE IF EXISTS nb_sqlc5;
CREATE DATABASE nb_sqlc5 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE nb_sqlc5;

CREATE TABLE `orders` (
  `id` VARCHAR(22),
  `partnerId` VARCHAR(22),
  `total` INT,
  `status` VARCHAR(29),
  `createdAt` DATE
);

INSERT INTO `orders` (`id`, `partnerId`, `total`, `status`, `createdAt`) VALUES
  ('O1', 'P1', 1200000, 'CONFIRMED', '2026-01-05'),
  ('O2', 'P1', 800000, 'DRAFT', '2026-02-11'),
  ('O3', 'P2', 500000, 'CONFIRMED', '2026-02-20'),
  ('O4', NULL, 300000, 'CONFIRMED', '2026-03-02');

-- ============ Truy vấn con: subquery, derived table, CTE ============
DROP DATABASE IF EXISTS nb_sqlc6;
CREATE DATABASE nb_sqlc6 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE nb_sqlc6;

CREATE TABLE `Partners` (
  `Ref_Key` VARCHAR(23),
  `Code` VARCHAR(25),
  `Description` VARCHAR(34)
);

INSERT INTO `Partners` (`Ref_Key`, `Code`, `Description`) VALUES
  ('PK1', 'DL001', 'Đại lý Hà Nội'),
  ('PK2', 'DL002', 'Đại lý Đà Nẵng');

CREATE TABLE `CustomersARAPAccountingByDueDates_RecordType` (
  `RecordType` VARCHAR(27),
  `Debt` INT,
  `PlannedRepaymentDate` DATE,
  `AccountingDimensionByPartners_Key` VARCHAR(22),
  `ReversingEntry` INT,
  `Active` INT
);

INSERT INTO `CustomersARAPAccountingByDueDates_RecordType` (`RecordType`, `Debt`, `PlannedRepaymentDate`, `AccountingDimensionByPartners_Key`, `ReversingEntry`, `Active`) VALUES
  ('Receipt', 100, '2026-08-01', 'D1', 0, 1),
  ('Payment', 40, '2026-12-31', 'D1', 0, 1),
  ('Receipt', 60, '2026-09-01', 'D2', 0, 1);

CREATE TABLE `DimensionKeysOfAccountingByPartners` (
  `Ref_Key` VARCHAR(22),
  `Partner_Key` VARCHAR(23)
);

INSERT INTO `DimensionKeysOfAccountingByPartners` (`Ref_Key`, `Partner_Key`) VALUES
  ('D1', 'P01'),
  ('D2', 'P02');

-- ============ Tuổi nợ (AR aging) ============
DROP DATABASE IF EXISTS nb_sqlc7;
CREATE DATABASE nb_sqlc7 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE nb_sqlc7;

CREATE TABLE `x` (
  `sign_debt` INT,
  `PlannedRepaymentDate` DATE,
  `AccountingDimensionByPartners_Key` VARCHAR(22)
);

INSERT INTO `x` (`sign_debt`, `PlannedRepaymentDate`, `AccountingDimensionByPartners_Key`) VALUES
  (100, '2026-08-01', 'D1'),
  (-40, '2026-12-31', 'D1'),
  (60, '2026-09-01', 'D2');

CREATE TABLE `DimensionKeysOfAccountingByPartners` (
  `Ref_Key` VARCHAR(22),
  `Partner_Key` VARCHAR(23)
);

INSERT INTO `DimensionKeysOfAccountingByPartners` (`Ref_Key`, `Partner_Key`) VALUES
  ('D1', 'P01'),
  ('D2', 'P02');

CREATE TABLE `t` (
  `partnerKey` VARCHAR(23),
  `du_no` INT,
  `so_ngay` INT
);

INSERT INTO `t` (`partnerKey`, `du_no`, `so_ngay`) VALUES
  ('P01', 100, 46),
  ('P01', 40, -106),
  ('P02', 60, 15);

-- ============ Soi lỗi câu công nợ 1C: số ngày quá hạn bị thổi phồng ============
DROP DATABASE IF EXISTS nb_sqlc8;
CREATE DATABASE nb_sqlc8 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE nb_sqlc8;

CREATE TABLE `x` (
  `sign_debt` INT,
  `PlannedRepaymentDate` DATE,
  `AccountingDimensionByPartners_Key` VARCHAR(22)
);

INSERT INTO `x` (`sign_debt`, `PlannedRepaymentDate`, `AccountingDimensionByPartners_Key`) VALUES
  (100, '2026-08-01', 'D1'),
  (-40, '2026-12-31', 'D1'),
  (60, '2026-09-01', 'D2');

CREATE TABLE `DimensionKeysOfAccountingByPartners` (
  `Ref_Key` VARCHAR(22),
  `Partner_Key` VARCHAR(23)
);

INSERT INTO `DimensionKeysOfAccountingByPartners` (`Ref_Key`, `Partner_Key`) VALUES
  ('D1', 'P01'),
  ('D2', 'P02');

CREATE TABLE `t` (
  `partnerKey` VARCHAR(23),
  `ngay_hen` DATE,
  `du_no` INT
);

INSERT INTO `t` (`partnerKey`, `ngay_hen`, `du_no`) VALUES
  ('P01', '2026-08-01', 100),
  ('P01', '2026-12-31', -40),
  ('P02', '2026-09-01', 60);

-- ============ JOIN trong PostgreSQL ============
DROP DATABASE IF EXISTS nb_sql1;
CREATE DATABASE nb_sql1 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE nb_sql1;

CREATE TABLE `order_items` (
  `id` VARCHAR(23),
  `sku_id` VARCHAR(22)
);

INSERT INTO `order_items` (`id`, `sku_id`) VALUES
  ('OI1', 'S1'),
  ('OI2', 'S9');

CREATE TABLE `skus` (
  `id` VARCHAR(22),
  `size` VARCHAR(21)
);

INSERT INTO `skus` (`id`, `size`) VALUES
  ('S1', 'M'),
  ('S2', 'L');

-- ============ Tổng hợp dữ liệu trong PostgreSQL ============
DROP DATABASE IF EXISTS nb_sql2;
CREATE DATABASE nb_sql2 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE nb_sql2;

CREATE TABLE `order_items` (
  `id` VARCHAR(23),
  `sku_id` VARCHAR(22),
  `qty` INT
);

INSERT INTO `order_items` (`id`, `sku_id`, `qty`) VALUES
  ('OI1', 'S1', 3),
  ('OI2', 'S1', 5),
  ('OI3', 'S2', 2);

CREATE TABLE `skus` (
  `id` VARCHAR(22),
  `size` VARCHAR(21)
);

INSERT INTO `skus` (`id`, `size`) VALUES
  ('S1', 'M'),
  ('S2', 'L');

-- ============ Truy vấn thống kê size (PostgreSQL + Prisma) ============
DROP DATABASE IF EXISTS nb_sql3;
CREATE DATABASE nb_sql3 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE nb_sql3;

CREATE TABLE `order_items` (
  `id` VARCHAR(23),
  `skuId` VARCHAR(22),
  `orderId` VARCHAR(22),
  `qty` INT
);

INSERT INTO `order_items` (`id`, `skuId`, `orderId`, `qty`) VALUES
  ('OI1', 'S1', 'O1', 3),
  ('OI2', 'S2', 'O2', 5);

CREATE TABLE `skus` (
  `id` VARCHAR(22),
  `option2` VARCHAR(21)
);

INSERT INTO `skus` (`id`, `option2`) VALUES
  ('S1', 'M'),
  ('S2', 'L');

CREATE TABLE `orders` (
  `id` VARCHAR(22),
  `status` VARCHAR(29)
);

INSERT INTO `orders` (`id`, `status`) VALUES
  ('O1', 'CONFIRMED'),
  ('O2', 'DRAFT');

-- ============ Báo cáo công nợ trong MySQL ============
DROP DATABASE IF EXISTS nb_my1;
CREATE DATABASE nb_my1 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE nb_my1;

CREATE TABLE `ar_entries` (
  `RecordType` VARCHAR(27),
  `Debt` INT,
  `PlannedRepaymentDate` DATE,
  `Partner` VARCHAR(24),
  `sign_debt` INT
);

INSERT INTO `ar_entries` (`RecordType`, `Debt`, `PlannedRepaymentDate`, `Partner`, `sign_debt`) VALUES
  ('Receipt', 100, '2026-08-01', 'An', 100),
  ('Payment', 40, '2026-12-31', 'An', -40),
  ('Receipt', 60, '2026-09-01', 'Bình', 60);
