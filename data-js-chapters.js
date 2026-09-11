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
  }
];
