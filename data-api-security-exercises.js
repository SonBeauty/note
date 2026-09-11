// Bai tap hai chuong bao mat tang API.
window.API_SECURITY_EXERCISES = {
  sec2: [
    { id: "s2e1", type: "guess",
      prompt: "Câu `SELECT * FROM Partners WHERE Code = '${code}'` với code người dùng gửi lên là: x' OR '1'='1 — truy vấn trả về gì?",
      hint: "Thay chuỗi đó vào rồi đọc lại điều kiện WHERE thành tiếng Việt.",
      answers: ["toàn bộ", "toan bo", "tất cả", "tat ca", "all", "toàn bộ đại lý", "mọi dòng"] },
    { id: "s2e2", type: "fill",
      prompt: "Driver gửi câu lệnh đi trước cho máy chủ phân tích cấu trúc, sau đó mới gửi giá trị vào chỗ trống. Nhờ vậy giá trị người dùng không bao giờ trở thành ___.",
      hint: "Thứ đối lập với dữ liệu trong một câu SQL.",
      answers: ["câu lệnh", "cau lenh", "lệnh", "code", "sql"] },
    { id: "s2e3", type: "code",
      prompt: "Viết lại cho an toàn: const sql = `SELECT * FROM Partners WHERE Ref_Key = '${refKey}'`; const rows = await dataSource.query(sql);",
      want: "Kết quả mong đợi: câu lệnh không còn chứa giá trị nào của người dùng.",
      hint: "MySQL dùng dấu chỗ trống theo thứ tự, giá trị đi ở tham số thứ hai của query().",
      must: [
        { re: "ref_key\\s*=\\s*\\?", label: "Ref_Key = ?" },
        { re: "query\\s*\\(.*,\\s*\\[", label: "query(sql, [ ... ]) — giá trị đi đường tham số" },
        { re: "refkey", label: "refKey nằm trong mảng tham số" }
      ],
      answers: ["const sql = `SELECT * FROM Partners WHERE Ref_Key = ?`; const rows = await dataSource.query(sql, [refKey]);"] },
    { id: "s2e4", type: "code",
      prompt: "Lọc nhiều đại lý: viết đoạn sinh chuỗi dấu chỗ trống khớp với số phần tử của mảng refKeys rồi gọi query.",
      want: "Kết quả mong đợi: mảng 3 phần tử thì câu lệnh có IN (?, ?, ?).",
      hint: "map ra dấu ?, nối bằng dấu phẩy, rồi nhét vào IN (...). Mảng truyền nguyên vào tham số.",
      must: [
        { re: "map\\s*\\(", label: "refKeys.map(...)" },
        { re: "join\\s*\\(", label: ".join(', ')" },
        { re: "in\\s*\\(", label: "IN (...)" },
        { re: "query\\s*\\(.*,\\s*refkeys", label: "query(sql, refKeys)" }
      ],
      answers: ["const holes = refKeys.map(() => '?').join(', '); const sql = `SELECT * FROM Partners WHERE Ref_Key IN (${holes})`; const rows = await dataSource.query(sql, refKeys);"] },
    { id: "s2e5", type: "guess",
      prompt: "Người dùng chọn cột sắp xếp, bạn viết ORDER BY ? rồi truyền tên cột vào tham số. Có chạy không?",
      hint: "Tham số hóa chỉ thay được chỗ đứng của một GIÁ TRỊ, không thay được tên cột hay tên bảng.",
      answers: ["không", "khong", "no"] },
    { id: "s2e6", type: "fill",
      prompt: "Prisma: `$queryRaw` chặn được injection, còn hàm ___ thì không — đúng như tên gọi của nó.",
      hint: "Cùng tên, thêm hậu tố cảnh báo.",
      answers: ["$queryRawUnsafe", "queryRawUnsafe"] }
  ],

  sec3: [
    { id: "s3e1", type: "fill",
      prompt: "Máy chủ dùng thẳng id do người dùng gửi lên để lấy dữ liệu mà không kiểm tra quyền. Lỗ hổng này tên viết tắt là ___.",
      hint: "Bốn chữ cái, Insecure Direct Object Reference.",
      answers: ["IDOR", "idor"] },
    { id: "s3e2", type: "guess",
      prompt: "Lập luận \"đại lý không xem được công nợ đại lý khác vì họ không biết id của nhau\" thuộc kiểu bảo mật nào?",
      hint: "Che giấu thay vì chặn thật. Cụm từ tiếng Anh có chữ obscurity.",
      answers: ["security by obscurity", "obscurity", "che giấu", "che giau"] },
    { id: "s3e3", type: "fill",
      prompt: "Trong controller NestJS của dự án, thứ DUY NHẤT đáng tin để biết người gọi là ai: decorator ___.",
      hint: "Nó lấy request.user do JwtStrategy gán vào.",
      answers: ["@CurrentUser", "CurrentUser", "@CurrentUser()", "currentuser"] },
    { id: "s3e4", type: "guess",
      prompt: "Endpoint đã có @Roles(Role.AGENT) rồi thì còn cần lọc theo partnerId ở service nữa không?",
      hint: "Guard trả lời câu 'vào được cửa này không'. Nó có biết dòng dữ liệu nào thuộc về ai không?",
      answers: ["có", "co", "vẫn cần", "van can", "yes"] },
    { id: "s3e5", type: "code",
      prompt: "Viết thân hàm getDebt(user, partnerId?) : với đại lý thì GHI ĐÈ partnerId bằng partnerId lấy từ user, tài khoản chưa gắn đại lý thì ném ForbiddenException; vai trò không xem được toàn bộ dữ liệu thì cũng ném ForbiddenException.",
      want: "Kết quả mong đợi: không có nhánh nào để client tự chọn id đại lý.",
      hint: "Dùng hai hàm sẵn có trong common/utils/role.util.ts: isDealerRole và canViewAllData.",
      must: [
        { re: "isdealerrole\\s*\\(", label: "isDealerRole(user.role)" },
        { re: "=\\s*user\\.partnerid", label: "target = user.partnerId — ghi đè" },
        { re: "canviewalldata\\s*\\(", label: "canViewAllData(user.role)" },
        { re: "throw\\s+new\\s+forbiddenexception", label: "throw new ForbiddenException(...)" }
      ],
      answers: ["let target = partnerId; if (isDealerRole(user.role)) { if (!user.partnerId) throw new ForbiddenException('Tài khoản chưa gắn đại lý'); target = user.partnerId; } else if (!canViewAllData(user.role)) { throw new ForbiddenException(); }"] },
    { id: "s3e6", type: "fill",
      prompt: "Khóa để ghép một Partner bên Postgres sang bảng Partners của 1C là cột ___ (khớp với Ref_Key).",
      hint: "Tên cột trong prisma/schema.prisma, có chữ số 1 và chữ C.",
      answers: ["ref1C", "ref1c"] }
  ]
};
