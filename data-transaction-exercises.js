// Bai tap dang viet code, cham theo thanh phan bat buoc.
window.TRANSACTION_EXERCISES = {
  tx1: [
    {
      id: "t1e1", type: "code",
      prompt: "Viết khung transaction kiểu interactive của Prisma, đặt tên tham số callback là tx.",
      want: "Chỉ cần cái khung, chưa cần nội dung bên trong.",
      hint: "await this.prisma.$transaction(async (tx) => { ... })",
      must: [
        { re: "\\$transaction", label: "$transaction" },
        { re: "async", label: "async" },
        { re: "\\(\\s*tx\\s*\\)", label: "tham số (tx)" }
      ],
      answers: ["await this.prisma.$transaction(async (tx) => { });"]
    },
    {
      id: "t1e2", type: "code",
      prompt: "Bên trong transaction, tạo một bản ghi order. Nhớ gọi qua tx chứ không phải this.prisma.",
      want: "Sai chỗ này thì rollback sẽ không cuốn theo thao tác đó.",
      hint: "Dạng tx.<model>.create({ data: ... }).",
      must: [
        { re: "tx\\.order\\.create", label: "tx.order.create" },
        { re: "data", label: "data: { ... }" }
      ],
      answers: ["const created = await tx.order.create({ data: { userId, status: 'CREATED' } });"]
    },
    {
      id: "t1e3", type: "code",
      prompt: "Viết câu SQL thô khóa dòng sku theo id để người khác phải chờ, dùng bên trong transaction.",
      want: "Đây chính là chỗ chặn bán vượt tồn.",
      hint: "SELECT ... FROM skus WHERE ... rồi thêm hai chữ khóa ở cuối.",
      must: [
        { re: "select", label: "SELECT" },
        { re: "from\\s+skus", label: "FROM skus" },
        { re: "where", label: "WHERE" },
        { re: "for\\s+update", label: "FOR UPDATE" }
      ],
      answers: ["await tx.$queryRaw`SELECT id, \"qtyReserved\" FROM skus WHERE id = ${skuId} FOR UPDATE`;"]
    },
    {
      id: "t1e4", type: "code",
      prompt: "Trước khi khóa nhiều SKU cùng lúc, xử lý danh sách id thế nào để tránh deadlock?",
      want: "Một lời gọi hàm duy nhất là đủ.",
      hint: "Mọi transaction phải đi theo cùng một thứ tự thì mới không khóa chéo nhau.",
      must: [
        { re: "sort\\s*\\(", label: "sort()" }
      ],
      answers: ["const lockSkuIds = [...qtyBySkuId.keys()].sort();"]
    },
    {
      id: "t1e5", type: "code",
      prompt: "Trong transaction, nếu tồn kho không đủ thì viết gì để mọi thay đổi trước đó bị hủy hết?",
      want: "Không có hàm rollback nào cần gọi cả.",
      hint: "Prisma tự rollback khi callback ném exception.",
      must: [
        { re: "throw", label: "throw" }
      ],
      answers: ["throw new BadRequestException('Không đủ tồn kho');"]
    },
    {
      id: "t1e6", type: "code",
      prompt: "Cập nhật qtyReserved của một sku bên trong transaction, cộng thêm số lượng vừa đặt.",
      want: "Vẫn phải gọi qua tx.",
      hint: "tx.sku.update cần cả where lẫn data.",
      must: [
        { re: "tx\\.sku\\.update", label: "tx.sku.update" },
        { re: "where", label: "where" },
        { re: "qtyreserved", label: "qtyReserved" }
      ],
      answers: ["await tx.sku.update({ where: { id: skuId }, data: { qtyReserved: locked.qtyReserved + qty } });"]
    },
    {
      id: "t1e7", type: "code",
      prompt: "Viết tham số tùy chọn cho $transaction để nới thời gian chạy tối đa lên 30 giây.",
      want: "Đối số thứ hai của $transaction, đơn vị mili giây.",
      hint: "Một object có khóa timeout.",
      must: [
        { re: "timeout", label: "timeout" },
        { re: "30_?000", label: "30000 hoặc 30_000" }
      ],
      answers: ["{ timeout: 30_000, maxWait: 10_000 }"]
    }
  ]
};
