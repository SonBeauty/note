// Hai chuong bao mat tang API, rut tu code that cua b2b.kamito.vn.
window.API_SECURITY_CHAPTERS = [
  {
    id: "sec2",
    title: "Tham số hóa truy vấn (NestJS + TypeORM)",
    subtitle: "Vì sao không được nối chuỗi vào câu SQL",
    intro: "Ghép giá trị của người dùng vào câu SQL bằng dấu cộng hay template string là lỗ hổng SQL injection. Chương này dùng đúng file one-c-sales-order.query.ts của dự án.",
    blocks: [
      { t: "h", text: "Chuyện gì xảy ra khi nối chuỗi" },
      { t: "code", text: "// SAI\nconst sql = `SELECT * FROM Partners WHERE Code = '${code}'`;\n\n// Nguoi dung gui code = x' OR '1'='1\n// Cau SQL thanh:\nSELECT * FROM Partners WHERE Code = 'x' OR '1'='1'\n// -> tra ve TOAN BO dai ly\n\n// Gui code = x'; DROP TABLE Partners; --\n// -> mat bang" },
      { t: "p", html: "Gốc rễ: máy chủ CSDL nhận về <b>một chuỗi văn bản</b> rồi mới phân tích. Nó không phân biệt được đâu là câu lệnh lập trình viên viết, đâu là dữ liệu người dùng nhập — tất cả đã trộn thành một." },

      { t: "h", text: "Tham số hóa: gửi câu lệnh và dữ liệu tách rời" },
      { t: "code", text: "// DUNG — dung khuon mau cua du an\nconst SQL = `\n  SELECT p.Ref_Key AS refKey, p.Code AS code, ROUND(SUM(x.sign_debt)) AS tongAr\n  FROM ( ... ) x\n  JOIN Partners p ON p.Ref_Key = d.Partner_Key\n  WHERE p.Ref_Key = ?\n  GROUP BY p.Ref_Key, p.Code`;\n\nconst rows = await dataSource.query(SQL, [refKey]);" },
      { t: "p", html: "Dấu <code>?</code> là một <b>chỗ trống</b>. Driver gửi câu lệnh đi trước để máy chủ phân tích xong cấu trúc, rồi mới gửi giá trị vào chỗ trống. Lúc đó giá trị <b>chỉ có thể là dữ liệu</b>, không còn đường nào thành câu lệnh nữa." },
      { t: "hint", html: "Đây không phải chuyện \"lọc dấu nháy cho sạch\". Escape thủ công luôn sót. Tham số hóa là cắt đứt hẳn con đường, không phải bịt bớt." },

      { t: "h", text: "Ba hệ, ba kiểu chỗ trống" },
      { t: "table", head: ["Nơi dùng", "Viết", "Ví dụ"],
        rows: [
          ["TypeORM + MySQL (1C)", "<code>?</code> theo thứ tự", "<code>dataSource.query(SQL, [from, to])</code>"],
          ["TypeORM + PostgreSQL", "<code>$1</code>, <code>$2</code>", "<code>query(SQL, [id])</code>"],
          ["Prisma", "<code>$queryRaw</code> với template", "<code>Prisma.$queryRaw`... WHERE id = ${id}`</code>"]
        ] },
      { t: "hint", html: "Prisma lừa mắt: <code>$queryRaw</code> trông y như template string nhưng Prisma chặn lại và biến <code>${id}</code> thành tham số thật. Còn <code>$queryRawUnsafe</code> thì <b>không</b> — đúng như tên nó, chỉ dùng khi tự ghép câu lệnh và đã chắc chắn." },

      { t: "h", text: "Danh sách nhiều giá trị" },
      { t: "code", text: "// Loc nhieu dai ly: so dau ? phai khop so phan tu\nconst holes = refKeys.map(() => '?').join(', ');\nconst SQL = `... WHERE p.Ref_Key IN (${holes}) ...`;\nawait dataSource.query(SQL, refKeys);" },
      { t: "p", html: "Chỗ này <b>có</b> nối chuỗi, nhưng chỉ nối mấy dấu <code>?</code> do chính mình sinh ra — không có byte nào của người dùng lọt vào câu lệnh. Giá trị vẫn đi đường tham số." },

      { t: "h", text: "Cái tham số hóa KHÔNG làm được" },
      { t: "table", head: ["Chỗ", "Tham số được?"],
        rows: [
          ["Giá trị so sánh <code>WHERE col = ?</code>", "Được"],
          ["<code>LIMIT ?</code> / <code>OFFSET ?</code>", "Được"],
          ["<b>Tên bảng</b>, <b>tên cột</b>", "<b>Không</b> — phải đối chiếu với danh sách trắng tự viết"],
          ["<code>ORDER BY ?</code>", "<b>Không</b> — người dùng chọn cột sắp xếp thì map qua whitelist"]
        ] },
      { t: "code", text: "// Nguoi dung chon cot sap xep\nconst ALLOWED = { ar: 'tongAr', code: 'p.Code' };\nconst col = ALLOWED[sortBy] ?? 'tongAr';       // khong khop thi lay mac dinh\nconst dir = dir === 'asc' ? 'ASC' : 'DESC';    // chi hai gia tri, khong co duong khac\nconst SQL = `... ORDER BY ${col} ${dir}`;" }
    ]
  },

  {
    id: "sec3",
    title: "Đừng tin client: lấy danh tính từ token",
    subtitle: "Lỗi IDOR và chỗ đặt phân quyền",
    intro: "Câu hỏi quyết định: id đại lý dùng để lọc dữ liệu đến từ đâu? Từ request của người dùng, hay từ token đã được máy chủ xác thực? Trả lời sai là rò dữ liệu của đại lý khác.",
    blocks: [
      { t: "h", text: "Lỗ hổng IDOR" },
      { t: "code", text: "// SAI: id lay tu URL\n@Get('debt/:partnerId')\ngetDebt(@Param('partnerId') partnerId: string) {\n  return this.service.getDebt(partnerId);   // ai doi so cung xem duoc\n}" },
      { t: "p", html: "<b>IDOR</b> — Insecure Direct Object Reference. Máy chủ dùng thẳng id do người dùng gửi lên để lấy dữ liệu, mà không kiểm tra người này có quyền với id đó không." },
      { t: "hint", html: "Lập luận \"đại lý không biết id của đại lý khác\" <b>không phải là bảo mật</b> — nó gọi là <i>security by obscurity</i>. Id lộ ra ở rất nhiều chỗ: tab Network của trình duyệt, log, file Excel xuất ra, một cái id cũ chép lại. Và kể cả không biết thì vẫn đoán được." },

      { t: "h", text: "Nguồn sự thật: req.user" },
      { t: "code", text: "// jwt.strategy.ts — validate() nap User tu DB roi gan vao request\nasync validate(payload: JwtPayload) {\n  const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });\n  if (!user || !user.isActive) throw new UnauthorizedException();\n  return user;                 // -> req.user, day du ca partnerId\n}" },
      { t: "code", text: "// DUNG: id den tu token, khong phai tu URL\n@Get('debt/me')\ngetMyDebt(@CurrentUser() user: User) {\n  return this.service.getDebt(user);\n}" },
      { t: "p", html: "Token được ký bằng <code>JWT_SECRET</code>. Người dùng sửa một ký tự trong đó là chữ ký hỏng, request bị chặn ngay ở guard. Nên <code>user.partnerId</code> là thứ <b>duy nhất</b> đáng tin." },

      { t: "h", text: "Ba tầng chặn, mỗi tầng một việc" },
      { t: "table", head: ["Tầng", "Trả lời câu hỏi", "Trong dự án"],
        rows: [
          ["<code>JwtAuthGuard</code>", "Anh là ai? Token còn hạn không?", "<code>common/guards/jwt-auth.guard.ts</code>"],
          ["<code>RolesGuard</code> + <code>@Roles()</code>", "Vai trò này có được vào cửa này không?", "<code>common/guards/roles.guard.ts</code>"],
          ["<b>Service</b> — lọc theo dữ liệu", "Trong cửa rồi thì được thấy <b>những dòng nào</b>?", "<code>orders.service.ts</code> → <code>getSubordinateQuery()</code>"]
        ] },
      { t: "hint", html: "Guard chỉ trả lời được câu <i>vào được hay không</i>. Nó không biết dòng nào của ai, nên <b>không</b> thay được việc lọc ở service. Hai thứ khác nhau, cần cả hai." },

      { t: "h", text: "Khuôn mẫu lọc theo vai trò đang dùng trong dự án" },
      { t: "code", text: "// orders.service.ts:35 — rut gon\nif (canViewAllData(role)) return {};              // ADMIN, DIRECTOR: thay het\n\nif (role === 'AGENT' || role === 'AGENT_STAFF') { // dai ly: chi partner cua minh\n  const me = await this.prisma.user.findUnique({\n    where: { id: userId }, select: { partnerId: true },\n  });\n  if (me?.partnerId) return { OR: [{ userId }, { partnerId: me.partnerId }] };\n  return { userId };\n}\n// MANAGER / LEADER: thay cap duoi cua minh..." },
      { t: "p", html: "Hai hàm trợ giúp có sẵn ở <code>common/utils/role.util.ts</code>: <code>canViewAllData(role)</code> và <code>isDealerRole(role)</code>. Viết tính năng mới thì dùng lại, đừng so chuỗi <code>'ADMIN'</code> rải rác khắp nơi." },

      { t: "h", text: "Lọc trong câu SQL là đúng — nhưng giá trị phải sạch nguồn" },
      { t: "code", text: "// Dung: service tu quyet dinh loc cai gi, dua tren req.user\nasync getDebt(user: User, partnerId?: string) {\n  let target = partnerId;\n\n  if (isDealerRole(user.role)) {\n    if (!user.partnerId) throw new ForbiddenException('Tài khoản chưa gắn đại lý');\n    target = user.partnerId;          // DE len tren, bo qua thu client gui\n  } else if (!canViewAllData(user.role)) {\n    throw new ForbiddenException();\n  }\n\n  const partner = await this.prisma.partner.findUnique({ where: { id: target } });\n  if (!partner?.ref1C) return { rows: [] };\n  return this.oneC.fetchDebt(partner.ref1C);   // ref1C moi la khoa ben 1C\n}" },
      { t: "hint", html: "Mấu chốt là dòng <code>target = user.partnerId</code>: với đại lý thì tham số client gửi lên bị <b>ghi đè</b>, không phải bị \"kiểm tra rồi cho qua\". Không có nhánh nào để client tự chọn id." },

      { t: "h", text: "Bốn cái bẫy" },
      { t: "table", head: ["Bẫy", "Hậu quả"],
        rows: [
          ["Lấy id từ <code>@Param</code> / <code>@Body</code> rồi dùng thẳng", "IDOR — xem được dữ liệu đại lý khác"],
          ["Chỉ ẩn nút bên web", "API vẫn gọi được bằng Postman"],
          ["Chỉ đặt <code>@Roles()</code>, quên lọc ở service", "Vào đúng cửa nhưng thấy dữ liệu của tất cả"],
          ["Quên trường hợp <code>partnerId</code> là null", "Điều kiện lọc rỗng → trả về toàn bộ"]
        ] }
    ]
  }
];
