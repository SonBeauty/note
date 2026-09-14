// Chuong JavaScript. Them chuong moi thi noi vao mang nay.
window.JS_CHAPTERS = [
  {
    id: "js1",
    title: "Object và prototype (JavaScript)",
    subtitle: "Thuộc tính của chính nó và thuộc tính đi mượn",
    intro: "Hai chủ đề này dính nhau ở một câu hỏi: thuộc tính đó là của chính object, hay nó đi mượn từ prototype? Trả lời được câu đó là hiểu vì sao spread làm mất method và vì sao JSON.stringify bỏ sót thứ bạn tưởng có.",
    blocks: [
      { t: "h", text: "Object.entries mở khóa kho hàm của mảng" },
      { t: "p", html: "Object không có <code>map</code>, <code>filter</code>, <code>reduce</code>. Chuyển nó thành mảng các cặp <code>[key, value]</code> là dùng được hết." },
      { t: "code", text: "const sku = { id: 'S1', size: 'M', qty: 3 };\n\nObject.entries(sku);\n// [ ['id', 'S1'], ['size', 'M'], ['qty', 3] ]" },
      { t: "table", head: ["Hàm", "Trả về"],
        rows: [
          ["<code>Object.keys(o)</code>", "<code>['id', 'size', 'qty']</code>"],
          ["<code>Object.values(o)</code>", "<code>['S1', 'M', 3]</code>"],
          ["<code>Object.entries(o)</code>", "<code>[['id','S1'], ['size','M'], ['qty',3]]</code>"]
        ] },
      { t: "code", text: "for (const [key, value] of Object.entries(filters)) {\n  console.log(`${key} = ${value}`);\n}" },

      { t: "h", text: "Object.fromEntries là chiều ngược lại" },
      { t: "p", html: "<code>entries</code> mở ra, <code>fromEntries</code> gói lại. Nó nhận bất cứ thứ gì lặp ra được cặp:" },
      { t: "code", text: "Object.fromEntries(new URLSearchParams('page=2&size=M')); // { page: '2', size: 'M' }\nObject.fromEntries(new Map([['a', 1]]));                 // { a: 1 }\nObject.fromEntries(new FormData(form));                  // object từ form" },
      { t: "p", html: "Mẫu hay dùng nhất: lọc bỏ giá trị rỗng trước khi đưa vào điều kiện truy vấn." },
      { t: "code", text: "const where = Object.fromEntries(\n  Object.entries(query).filter(([, v]) => v !== undefined && v !== '')\n);" },
      { t: "p", html: "Dấu phẩy đứng một mình trong <code>([, v])</code> là bỏ trống chỗ key, chỉ lấy value." },

      { t: "h", text: "Prototype là object cha mà JS hỏi khi không tìm thấy" },
      { t: "code", text: "const sku = { id: 'S1' };\n\nsku.id;          // 'S1'  — có sẵn trên chính nó\nsku.toString();  // chạy được, mà mình có viết toString đâu?" },
      { t: "p", html: "<code>toString</code> nằm trên <code>Object.prototype</code>. Không thấy trên <code>sku</code> thì JS đi lên một bậc tìm tiếp." },
      { t: "code", text: "sku ──▸ Object.prototype ──▸ null\n[]  ──▸ Array.prototype  ──▸ Object.prototype ──▸ null" },
      { t: "p", html: "Đi tới <code>null</code> là hết chuỗi, không thấy thì trả <code>undefined</code>. Đó là lý do <code>[].map</code> chạy được dù <code>map</code> không nằm trên mảng của bạn." },

      { t: "h", text: "prototype khác __proto__" },
      { t: "table", head: ["", "Nằm trên", "Là gì"],
        rows: [
          ["<code>Fn.prototype</code>", "hàm", "Cái khuôn, sẽ thành cha của instance tạo bằng <code>new Fn()</code>"],
          ["<code>obj.__proto__</code>", "mọi object", "Sợi dây thật đang nối lên cha"]
        ] },
      { t: "code", text: "function Sku(id) { this.id = id; }\nSku.prototype.label = function () { return 'SKU ' + this.id; };\n\nconst s = new Sku('S1');\nObject.getPrototypeOf(s) === Sku.prototype;  // true\ns.prototype;                                 // undefined — instance không có" },
      { t: "hint", html: "Dùng <code>Object.getPrototypeOf(obj)</code> thay cho <code>obj.__proto__</code>, sạch hơn và là cách chuẩn." },

      { t: "h", text: "new và class không có phép màu nào" },
      { t: "code", text: "function myNew(Fn, ...args) {\n  const obj = Object.create(Fn.prototype);  // tạo object, nối dây lên Fn.prototype\n  const ret = Fn.apply(obj, args);          // chạy hàm với this là object đó\n  return typeof ret === 'object' && ret !== null ? ret : obj;\n}" },
      { t: "p", html: "<code>class</code> chỉ là lớp vỏ của đúng cơ chế trên. Field nằm trên từng instance, method nằm trên prototype và dùng chung:" },
      { t: "code", text: "class Sku {\n  constructor(id) { this.id = id; }\n  label() { return 'SKU ' + this.id; }\n}\n\nconst a = new Sku('S1'), b = new Sku('S2');\na.label === b.label;  // true — một triệu instance vẫn chỉ một bản hàm label" },

      { t: "h", text: "Chỗ nối hai chủ đề: của chính nó hay đi mượn" },
      { t: "code", text: "const s = new Sku('S1');\n\n'label' in s;               // true  — tìm cả trên chuỗi prototype\nObject.hasOwn(s, 'label');  // false — không phải của nó\nObject.hasOwn(s, 'id');     // true\n\nObject.keys(s);             // ['id']        — mất label\nJSON.stringify(s);          // '{\"id\":\"S1\"}' — mất label\n({ ...s });                 // { id: 'S1' }  — mất label" },
      { t: "p", html: "<code>Object.keys</code>, <code>Object.entries</code>, spread và <code>JSON.stringify</code> đều <b>chỉ lấy thuộc tính của chính object</b>. Không lấy thứ kế thừa, không lấy Symbol, không lấy thứ non-enumerable." },

      { t: "h", text: "Bốn cái bẫy hay gặp" },
      { t: "hint", html: "<b>Spread làm mất hết method.</b> <code>const dto = { ...entity }</code> giữ được data nhưng gọi <code>dto.hidePassword()</code> là lỗi ngay. Thư viện <code>class-transformer</code> với <code>plainToInstance</code> sinh ra chính vì chuyện này." },
      { t: "hint", html: "<b>Thứ tự key không phải thứ tự bạn viết.</b> Key trông giống số nguyên bị đẩy lên đầu và sắp tăng dần: <code>Object.entries({ b: 1, 2: 'hai', a: 3, 1: 'mot' })</code> ra <code>[['1',...], ['2',...], ['b',...], ['a',...]]</code>. Cần giữ thứ tự thì dùng <code>Map</code>. Key cũng luôn là chuỗi, kể cả khi bạn viết số." },
      { t: "hint", html: "<b>TypeScript làm mất kiểu của key.</b> <code>Object.entries(status)</code> trả về <code>[string, T][]</code> chứ không giữ literal. Tự bọc một hàm ép kiểu thì được, nhưng phải hiểu TS cố tình làm vậy vì lúc chạy object có thể mang thêm thuộc tính ngoài <code>keyof T</code>." },
      { t: "hint", html: "<b>Prototype pollution.</b> Deep merge JSON từ client mà không chặn key thì <code>{ \"__proto__\": { \"isAdmin\": true } }</code> làm mọi object trong tiến trình đột nhiên có <code>isAdmin</code>. Chặn ba key <code>__proto__</code>, <code>constructor</code>, <code>prototype</code>, hoặc merge vào <code>Object.create(null)</code>, hoặc dùng <code>Map</code>." }
    ]
  },
  {
    id: "js2",
    title: "Tối ưu duyệt mảng: tính tiền và đếm đơn (JavaScript)",
    subtitle: "Rút gọn 2 vòng lặp về 1, tránh filter().length và bẫy NaN",
    intro: "Đoạn code tính monthlyRevenue và sentCount rút từ b2b.kamito.vn. Bài toán kinh điển khi xử lý dữ liệu: làm sao chỉ duyệt mảng một lần (single-pass), không cấp phát bộ nhớ thừa và chặn đứng lỗi số học.",
    blocks: [
      { t: "h", text: "Đoạn code ban đầu từ b2b.kamito.vn" },
      { t: "p", html: "Trong màn hình thống kê doanh thu, ta cần tính tổng tiền các đơn hoàn thành trong tháng và đếm số lượng đơn đó:" },
      { t: "code", text: "const monthlyRevenue = orderList.reduce((total, order) => {\n  const createdAt = new Date(order.createdAt);\n  const isSameMonth = createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear();\n  if (!isSameMonth || !REVENUE_STATUSES.includes(order.status)) return total;\n  return total + order.total;\n}, 0);\n\nconst sentCount = orderList.filter((order) => {\n  const createdAt = new Date(order.createdAt);\n  const isSameMonth = createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear();\n  return isSameMonth && REVENUE_STATUSES.includes(order.status);\n}).length;" },
      { t: "p", html: "Code chạy ra kết quả đúng, nhưng tồn tại <b>4 điểm nghẽn hiệu năng</b> và <b>1 bẫy dữ liệu</b> âm thầm." },

      { t: "h", text: "1. Hai vòng lặp duyệt mảng O(2N) và mảng rác từ filter" },
      { t: "p", html: "<code>reduce</code> duyệt hết danh sách một lần. Ngay sau đó <code>filter</code> lại duyệt lại từ đầu thêm một lần nữa. Với 10.000 đơn hàng, chương trình phải chạy 20.000 lượt kiểm tra." },
      { t: "p", html: "Tệ hơn, <code>filter().length</code> buộc JavaScript cấp phát bộ nhớ tạo một <b>mảng mới hoàn toàn</b> trong heap chỉ để đọc thuộc tính <code>.length</code>, rồi lập tức vứt đi cho Garbage Collector dọn dẹp." },

      { t: "h", text: "2. Khởi tạo Date và gọi now.getMonth() lặp vô ích" },
      { t: "p", html: "Trong cả hai vòng lặp, <code>now.getMonth()</code> và <code>now.getFullYear()</code> bị gọi đi gọi lại hàng ngàn lần dù <code>now</code> không hề đổi. Mỗi phần tử lại bị <code>new Date(order.createdAt)</code> tới 2 lần." },
      { t: "hint", html: "<b>Hoisting hằng số ra ngoài vòng lặp:</b> Tính trước <code>const currentMonth = now.getMonth(); const currentYear = now.getFullYear();</code> trước khi bắt đầu duyệt mảng." },

      { t: "h", text: "3. Dùng Set có thực sự nhanh hơn Array không? Vì sao?" },
      { t: "p", html: "<b>Câu trả lời:</b> Đúng! Với mảng nhiều đơn hàng và duyệt lặp đi lặp lại, <code>Set.has()</code> nhanh hơn vượt trội so với <code>Array.includes()</code> nhờ sự khác biệt về cấu trúc dữ liệu bên dưới V8 Engine:" },
      { t: "table", head: ["Tiêu chí", "Array.includes()", "Set.has()"],
        rows: [
          ["<b>Cấu trúc dữ liệu</b>", "Mảng tuần tự (Array/Vector)", "Bảng băm (Hash Table)"],
          ["<b>Cách tìm kiếm</b>", "Duyệt tuyến tính: so từng phần tử từ đầu đến cuối", "Băm giá trị (Hash) rồi nhảy thẳng vào ô nhớ (Bucket)"],
          ["<b>Độ phức tạp tra cứu</b>", "<code>O(K)</code> — tập trạng thái càng dài tìm càng chậm", "<code>O(1)</code> — thời gian hằng số, không đổi"],
          ["<b>Số phép tính với N đơn</b>", "<code>N × K</code> phép so sánh chuỗi", "<code>K</code> (băm tạo Set) + <code>N × 1</code> (tra cứu)"]
        ] },
      { t: "p", html: "<b>Thử làm một phép tính:</b> Danh sách có <code>N = 10.000</code> đơn hàng, tập trạng thái có <code>K = 5</code> phần tử:" },
      { t: "code", text: "// Dùng Array.includes:\n// 10.000 đơn × 5 trạng thái = 50.000 phép so sánh chuỗi tuần tự\n\n// Dùng Set.has (tạo Set ngoài loop):\n// 5 phép băm khởi tạo + 10.000 lần nhảy ô nhớ = 10.005 thao tác (nhanh gấp ~5 lần)" },
      { t: "hint", html: "<b>CÁI BẪY NGUY HIỂM:</b> Set chỉ nhanh khi bạn <b>khởi tạo nó NGOÀI vòng lặp</b> (hoặc ở cấp module)! Nếu bạn viết <code>new Set(REVENUE_STATUSES).has(...)</code> ở BÊN TRONG vòng lặp, mỗi phần tử lại cấp phát 1 bảng băm mới, code sẽ chậm hơn dùng mảng gấp nhiều lần và gây rác bộ nhớ." },

      { t: "h", text: "4. Bẫy NaN phá hủy toàn bộ kết quả doanh thu" },
      { t: "p", html: "Trong JavaScript: <code>1000000 + undefined = NaN</code>. Nếu một đơn hàng bất kỳ bị thiếu trường <code>total</code> (hoặc bằng <code>null</code>), toàn bộ <code>monthlyRevenue</code> tích lũy sẽ lập tức biến thành <code>NaN</code>!" },
      { t: "hint", html: "Luôn phòng vệ khi cộng dồn số liệu tiền tệ: <code>acc.monthlyRevenue += Number(order.total) || 0;</code>" },

      { t: "h", text: "Cách 1: Gộp vào 1 lần reduce duy nhất (Single-pass)" },
      { t: "p", html: "Duyệt đúng một lượt, gom cả Doanh thu và Số lượng đơn vào một object tích lũy:" },
      { t: "code", text: "const revenueStatusSet = new Set(REVENUE_STATUSES);\nconst currentMonth = now.getMonth();\nconst currentYear = now.getFullYear();\n\nconst { monthlyRevenue, sentCount } = orderList.reduce(\n  (acc, order) => {\n    if (!order.createdAt) return acc;\n    const createdAt = new Date(order.createdAt);\n    const isSameMonth =\n      createdAt.getMonth() === currentMonth &&\n      createdAt.getFullYear() === currentYear;\n\n    if (isSameMonth && revenueStatusSet.has(order.status)) {\n      acc.monthlyRevenue += Number(order.total) || 0;\n      acc.sentCount += 1;\n    }\n    return acc;\n  },\n  { monthlyRevenue: 0, sentCount: 0 }\n);" },

      { t: "h", text: "Cách 2: Vòng lặp for...of (Hiệu năng cao nhất & dễ debug)" },
      { t: "p", html: "Trong V8 Engine, vòng lặp <code>for...of</code> không tốn chi phí gọi callback function qua mỗi phần tử và không tạo object gom tạm:" },
      { t: "code", text: "const revenueStatusSet = new Set(REVENUE_STATUSES);\nconst currentMonth = now.getMonth();\nconst currentYear = now.getFullYear();\n\nlet monthlyRevenue = 0;\nlet sentCount = 0;\n\nfor (const order of orderList) {\n  if (!order.createdAt || !revenueStatusSet.has(order.status)) continue;\n  const createdAt = new Date(order.createdAt);\n  if (\n    createdAt.getMonth() === currentMonth &&\n    createdAt.getFullYear() === currentYear\n  ) {\n    monthlyRevenue += Number(order.total) || 0;\n    sentCount++;\n  }\n}" },

      { t: "h", text: "Bài học kiến trúc: Đừng tính việc này ở Frontend!" },
      { t: "p", html: "Nếu danh sách có 50.000 đơn hàng, việc kéo toàn bộ dữ liệu qua mạng về trình duyệt rồi mới filter/reduce là lãng phí tài nguyên. Trong hệ thống B2B/ERP thực tế, bài toán này nên để Database giải quyết trong vài mili-giây bằng SQL gộp:" },
      { t: "code", text: "SELECT \n  COALESCE(SUM(total), 0) AS monthly_revenue,\n  COUNT(*) AS sent_count\nFROM orders\nWHERE \"createdAt\" >= date_trunc('month', NOW())\n  AND \"createdAt\" <  date_trunc('month', NOW()) + INTERVAL '1 month'\n  AND status = ANY($1);" }
    ]
  }
];
