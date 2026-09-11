// Bai tap chuong JavaScript, dang viet code.
window.JS_EXERCISES = {
  js1: [
    {
      id: "j1e1", type: "code",
      prompt: "Duyệt object filters bằng for...of, phá cấu trúc ra key và value.",
      want: "Một vòng lặp, không dùng Object.keys rồi tra ngược.",
      hint: "for (const [k, v] of ...) rồi tới hàm biến object thành mảng cặp.",
      must: [
        { re: "for\\s*\\(", label: "for (...)" },
        { re: "\\bof\\b", label: "of" },
        { re: "\\[\\s*\\w+\\s*,\\s*\\w+\\s*\\]", label: "phá cấu trúc [key, value]" },
        { re: "object\\.entries", label: "Object.entries" }
      ],
      answers: ["for (const [key, value] of Object.entries(filters)) { }"]
    },
    {
      id: "j1e2", type: "code",
      prompt: "Lọc bỏ mọi cặp có value là undefined khỏi object query, trả về một object mới.",
      want: "Mở ra thành mảng, lọc, rồi gói lại.",
      hint: "Bộ ba Object.entries → filter → Object.fromEntries.",
      must: [
        { re: "object\\.entries", label: "Object.entries" },
        { re: "filter", label: "filter" },
        { re: "undefined", label: "so sánh với undefined" },
        { re: "object\\.fromentries", label: "Object.fromEntries" }
      ],
      answers: ["const clean = Object.fromEntries(Object.entries(query).filter(([, v]) => v !== undefined));"]
    },
    {
      id: "j1e3", type: "code",
      prompt: "Đổi mọi key của object sku sang chữ hoa, giữ nguyên value.",
      want: "{ id: 'S1' } thành { ID: 'S1' }.",
      hint: "Lần này dùng map thay cho filter.",
      must: [
        { re: "object\\.entries", label: "Object.entries" },
        { re: "map", label: "map" },
        { re: "touppercase", label: "toUpperCase" },
        { re: "object\\.fromentries", label: "Object.fromEntries" }
      ],
      answers: ["const upper = Object.fromEntries(Object.entries(sku).map(([k, v]) => [k.toUpperCase(), v]));"]
    },
    {
      id: "j1e4", type: "code",
      prompt: "Kiểm tra obj có thuộc tính 'label' của chính nó hay không, không tính thứ kế thừa từ prototype.",
      want: "Toán tử in sẽ cho kết quả sai vì nó tìm cả trên chuỗi prototype.",
      hint: "Có một hàm tĩnh trên Object làm đúng việc này.",
      must: [
        { re: "hasown", label: "Object.hasOwn hoặc hasOwnProperty" },
        { re: "label", label: "'label'" }
      ],
      answers: ["Object.hasOwn(obj, 'label');", "Object.prototype.hasOwnProperty.call(obj, 'label');"]
    },
    {
      id: "j1e5", type: "code",
      prompt: "Lấy ra object cha đang được nối vào obj.",
      want: "Cách chuẩn, không dùng __proto__.",
      hint: "Một hàm tĩnh trên Object, tên có chữ prototype ở giữa.",
      must: [
        { re: "getprototypeof", label: "Object.getPrototypeOf" }
      ],
      answers: ["Object.getPrototypeOf(obj);"]
    },
    {
      id: "j1e6", type: "code",
      prompt: "Tạo một object hoàn toàn không có prototype để dùng làm từ điển an toàn.",
      want: "Object này không có cả toString lẫn constructor.",
      hint: "Cùng hàm mà new dùng ở bên trong, nhưng truyền vào một giá trị đặc biệt.",
      must: [
        { re: "object\\.create", label: "Object.create" },
        { re: "null", label: "null" }
      ],
      answers: ["const dict = Object.create(null);"]
    }
  ]
};
