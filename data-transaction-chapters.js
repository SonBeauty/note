// Ghi chu ve transaction, minh hoa bang code that trong apps/api/src cua b2b.kamito.vn.
window.TRANSACTION_CHAPTERS = [
  {
    id: "tx1",
    title: "Transaction (Prisma + PostgreSQL)",
    subtitle: "Khóa dòng, tránh bán vượt tồn, tránh deadlock",
    intro: "Transaction gom nhiều thao tác ghi thành một khối: hoặc thành công hết, hoặc hỏng hết và mọi thứ quay về như cũ. Dự án b2b dùng nó ở 15 file, chỗ khó nhất là đặt hàng vì phải trừ tồn kho.",
    blocks: [
      { t: "h", text: "Transaction là gì" },
      { t: "p", html: "Ví dụ chuyển khoản: trừ tiền tài khoản A rồi cộng tiền tài khoản B. Nếu server sập giữa hai bước thì tiền bốc hơi. Transaction bảo đảm hoặc cả hai bước cùng xong, hoặc không bước nào có hiệu lực." },
      { t: "p", html: "Khối lệnh chỉ thật sự ghi xuống khi <b>commit</b>. Gặp lỗi thì <b>rollback</b>, mọi thay đổi bên trong bị hủy như chưa từng chạy." },

      { t: "h", text: "Khi nào cần, khi nào không" },
      { t: "table", head: ["Tình huống", "Cần transaction?"],
        rows: [
          ["Một câu <code>INSERT</code> hoặc <code>UPDATE</code> duy nhất", "Không, mỗi câu lệnh vốn đã là một transaction"],
          ["Tạo đơn hàng rồi trừ tồn kho", "Có, hai việc phải cùng thành công"],
          ["Đọc nhiều bảng để hiển thị", "Không, trừ khi cần ảnh chụp nhất quán"],
          ["Đếm tổng và lấy trang dữ liệu cho phân trang", "Nên, để tổng khớp với danh sách"],
          ["Gọi API bên ngoài rồi mới ghi", "Có, nhưng để lời gọi API <b>ngoài</b> transaction"]
        ] },

      { t: "h", text: "Hai kiểu viết trong Prisma" },
      { t: "p", html: "<b>Kiểu mảng</b> cho các thao tác độc lập, chạy tuần tự trong cùng một transaction. Dự án dùng cho phân trang, để tổng và danh sách cùng nhìn một ảnh chụp dữ liệu:" },
      { t: "code", text: "const [rows, total] = await this.prisma.$transaction([\n  this.prisma.activityLog.findMany({ where, skip, take }),\n  this.prisma.activityLog.count({ where }),\n]);" },
      { t: "p", html: "<b>Kiểu interactive</b> khi bước sau cần kết quả của bước trước, hoặc cần rẽ nhánh theo điều kiện:" },
      { t: "code", text: "const order = await this.prisma.$transaction(async (tx) => {\n  // mọi thao tác bên trong phải gọi qua tx\n  const created = await tx.order.create({ data: ... });\n  await tx.sku.update({ where: { id }, data: { qtyReserved: ... } });\n  return created;\n});" },

      { t: "h", text: "Lỗi kinh điển: quên dùng tx" },
      { t: "code", text: "await this.prisma.$transaction(async (tx) => {\n  await tx.order.create({ ... });        // nằm trong transaction\n  await this.prisma.sku.update({ ... }); // SAI: nằm NGOÀI transaction\n});" },
      { t: "p", html: "Dòng thứ hai dùng lại <code>this.prisma</code> nên nó chạy trên kết nối khác, không thuộc transaction. Khi rollback, thao tác đó vẫn còn nguyên và dữ liệu lệch." },
      { t: "hint", html: "Quy tắc: bên trong callback chỉ được gọi <code>tx</code>. Thấy <code>this.prisma</code> hay <code>prisma.</code> trong đó là sai, không có ngoại lệ." },

      { t: "h", text: "Vì sao cần khóa dòng" },
      { t: "p", html: "Tồn còn 1 cái, hai người bấm đặt hàng cùng lúc:" },
      { t: "table", head: ["Thời điểm", "Người A", "Người B"],
        rows: [
          ["1", "Đọc tồn = 1", ""],
          ["2", "", "Đọc tồn = 1"],
          ["3", "Thấy đủ, ghi tồn = 0", ""],
          ["4", "", "Cũng thấy đủ, ghi tồn = 0"],
          ["Kết quả", "Bán được 2 cái trong khi chỉ có 1", ""]
        ] },
      { t: "p", html: "Transaction không tự cứu được chuyện này, vì cả hai đều đọc trước khi ai kịp ghi. Phải <b>khóa dòng</b> ngay lúc đọc." },
      { t: "code", text: "await tx.$queryRaw`\n  SELECT id, \"qtyAvailable\", \"qtyReserved\"\n  FROM skus\n  WHERE id IN (${Prisma.join(lockSkuIds)})\n  ORDER BY id\n  FOR UPDATE`;" },
      { t: "p", html: "<code>FOR UPDATE</code> giữ dòng lại tới khi transaction kết thúc. Người B chạm vào cùng dòng sẽ phải xếp hàng chờ, đọc xong thì đã thấy số mới." },

      { t: "h", text: "Khóa theo thứ tự cố định để tránh deadlock" },
      { t: "p", html: "Hai transaction khóa chéo nhau thì cả hai cùng đứng chờ, gọi là <b>deadlock</b>. A giữ SKU 1 đợi SKU 2, B giữ SKU 2 đợi SKU 1." },
      { t: "code", text: "const lockSkuIds = [...qtyBySkuId.keys()].sort();\n// rồi khóa kèm ORDER BY id" },
      { t: "hint", html: "Sắp xếp id trước khi khóa là mẹo chống deadlock kinh điển. Mọi transaction cùng đi theo một thứ tự thì không bao giờ khóa chéo nhau được. Trong dự án, cả mảng id lẫn câu SQL đều sắp theo <code>id</code>." },

      { t: "h", text: "Ném lỗi là rollback" },
      { t: "code", text: "if (effectiveAvailable < requestedQty) {\n  throw new BadRequestException('Không đủ tồn kho');\n}" },
      { t: "p", html: "Không cần gọi rollback thủ công. Callback ném exception thì Prisma tự hủy toàn bộ transaction, kể cả những dòng đã update ở vòng lặp trước." },

      { t: "h", text: "Giữ transaction càng ngắn càng tốt" },
      { t: "p", html: "Transaction đang mở là đang giữ khóa, mọi request khác chạm vào dòng đó đều phải chờ. Nên đừng gọi HTTP, đừng gửi email, đừng xử lý ảnh ở bên trong." },
      { t: "code", text: "await this.prisma.$transaction(async (tx) => {\n  ...\n}, { timeout: 30_000, maxWait: 10_000 });" },
      { t: "hint", html: "<code>timeout</code> là thời gian tối đa transaction được phép chạy, <code>maxWait</code> là thời gian chờ xin được kết nối. Prisma mặc định 5 giây và 2 giây. Dự án nới lên vì luồng đặt hàng khóa nhiều SKU một lúc. Nới số là chữa triệu chứng, gốc rễ vẫn là làm cho transaction ngắn lại." }
    ]
  }
];
