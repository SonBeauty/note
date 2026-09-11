# Sổ tay học tập

Sổ tay học cá nhân gồm ba phần: **Tiếng Anh**, **SQL** và **Lập trình**. Chạy offline bằng
trình duyệt, không cần server, không cần cài gì.

## Mở sổ

Nháy đúp vào `index.html`, hoặc kéo file đó thả vào cửa sổ Chrome/Edge.

## Ba mục chính

Ba tab trên đầu sổ, mỗi tab giữ tiến độ và trang đang đọc riêng. Tiêu đề chương luôn ghi rõ
công nghệ để nhìn là biết đang nói về hệ nào:

| Mục | Nội dung | Số bài tập |
|---|---|---|
| Tiếng Anh | 5 chương: giới thiệu bản thân, kinh nghiệm, dự án, công việc hằng ngày, du lịch | 25 |
| SQL | SQL căn bản + 3 chương PostgreSQL + 1 chương MySQL | 21 |
| Lập trình | Upload validation (NestJS), Transaction (Prisma), Thuật toán LCS, Object và prototype | 24 |

Chương **SQL căn bản** đi trước, giải thích từng mệnh đề là gì và dùng làm gì, thứ tự chạy
thật của một câu SELECT, WHERE khác HAVING chỗ nào, hàm gộp, subquery và index. Các chương
sau mới đi vào code thật của dự án:

- **PostgreSQL + Prisma 6** — truy vấn thống kê size của `b2b.kamito.vn`, có ví dụ JOIN bấm được để so sánh INNER, LEFT, RIGHT
- **MySQL** — truy vấn báo cáo công nợ trên hệ ERP kiểu 1C, kèm bảng đối chiếu cú pháp MySQL với PostgreSQL
- **NestJS 10 + TypeScript** — `upload-validation.util.ts`, vì sao không tin Content-Type và cách đối chiếu chéo với magic bytes
- **Prisma $transaction + PostgreSQL** — `orders.service.ts`, khóa dòng bằng FOR UPDATE để không bán vượt tồn, sắp xếp id để tránh deadlock
- **Thuật toán LCS** — nền tảng của mọi công cụ diff, và cũng là thứ đang chấm bài tiếng Anh trong chính cuốn sổ này
- **JavaScript** — Object.entries và prototype, nối nhau ở câu hỏi thuộc tính là của chính object hay đi mượn

## Lật sổ

- Trang 1 là **Mục lục**, bấm vào chương để mở
- Cột **bookmark** bên phải: nhảy thẳng tới chương bất kỳ, có hiện điểm từng chương
- Màn hình nhỏ thì cột bookmark ẩn đi, thay bằng nút **☰ Mục lục** bên phải mở ngăn kéo chọn chương
- Trong mỗi chương có hai tab: **Bài học** và **Bài tập**
- Nút **Trang trước / Trang sau** ở dưới, hoặc dùng phím mũi tên ← →
- Sổ nhớ trang bạn đang đọc, mở lại là vào đúng chỗ cũ

## Có gì trong sổ

- **5 chương theo chủ đề**: giới thiệu bản thân, kinh nghiệm & kỹ năng, nói về dự án, công việc hằng ngày, du lịch & sở thích
- Mỗi chương gồm: câu mẫu (sai → đúng → cách nói tự nhiên), bảng quy tắc, từ vựng, bài tập, ô ghi chú
- **70 bài tập**. Phần tiếng Anh là dịch câu, sửa câu sai và điền chỗ trống.
  Phần SQL là **21 bài viết truy vấn**: mỗi chương cho sẵn bảng dữ liệu mẫu kèm kết quả mong đợi,
  bạn tự viết câu lệnh vào ô nhiều dòng rồi bấm Kiểm tra (hoặc Ctrl+Enter).
  Phần Lập trình là **24 bài viết code**, chấm theo cùng cơ chế.
- **Chấm điểm tự động**: gõ đáp án rồi bấm Kiểm tra (hoặc nhấn Enter)
  - ✓ Chính xác
  - ⚠ Gần đúng — đúng từ nhưng sai viết hoa hoặc dấu câu
  - ✗ Chưa đúng — đánh dấu từng chỗ sai ngay trên câu bạn vừa viết
- Bài tiếng Anh sai thì **so từng từ với đáp án** rồi tô màu ngay trên câu của bạn:
  đỏ gạch ngang là từ thừa, đỏ gạch chân là từ sai, cam chấm chân là sai viết hoa,
  dấu ▾ đỏ là chỗ thiếu từ. Bên dưới liệt kê rõ loại lỗi: *sai chính tả*, *sai số ít hay số nhiều*,
  *thừa từ*, *thiếu một từ ở dấu ▾*. Không lộ từ đúng, muốn biết thì bấm Xem đáp án.
- Bài viết truy vấn chấm theo **thành phần bắt buộc** chứ không so từng ký tự: viết hoa hay thường,
  xuống dòng kiểu nào, đặt bí danh gì cũng được. Sai thì nó chỉ đúng chỗ còn thiếu, ví dụ *Còn thiếu: HAVING*.
- Nút **Gợi ý** và **Xem đáp án** cho từng câu
- Từ vựng có chế độ **học thẻ**: ẩn nghĩa tiếng Việt, bấm vào ô để lật

## Dữ liệu được lưu ở đâu

Trong `localStorage` của trình duyệt, tức là ghi xuống ổ cứng trong thư mục profile của trình duyệt.
Tắt trình duyệt hay tắt máy đều không mất. Chỉ mất khi:

- Bạn xóa dữ liệu duyệt web (Clear browsing data)
- Bạn mở sổ bằng cửa sổ ẩn danh
- Bạn đổi sang trình duyệt khác (mỗi trình duyệt có kho riêng)

Muốn chắc chắn thì bấm **Xuất file backup** để tải về `english-notebook-backup.json`,
sau này bấm **Nạp lại backup** để khôi phục.

## Thêm bài mới

Mọi nội dung nằm trong các file `data-*.js`, sửa trực tiếp là xong, không cần đụng vào code.

Thêm một bài tập mới vào chương 1:

```js
{
  id: "c1e6",                       // id duy nhất, không trùng
  type: "translate",                // translate | fix | fill
  prompt: "Tôi là một lập trình viên.",
  hint: "Nghề nghiệp cần mạo từ a.",
  answers: ["I am a developer", "I'm a developer"]   // mọi cách viết được chấp nhận
}
```

Lưu ý khi chấm: dấu chấm cuối câu và khoảng trắng thừa được bỏ qua.
Dạng `fill` chấm không phân biệt hoa thường, `translate` và `fix` thì có phân biệt
vì viết hoa cũng là một phần bài học.

Bài viết truy vấn thì khai báo khác, chấm theo thành phần bắt buộc:

```js
{
  id: "b1e6",
  type: "query",              // query cho SQL, code cho JS/TS
  prompt: "Đếm số đơn của từng khách hàng.",
  want: "Kết quả mong đợi: An = 2, Bình = 1, Chi = 1.",
  hint: "Đếm dòng chứ không cộng amount.",
  must: [                                   // thiếu cái nào thì báo đúng cái đó
    { re: "count\\s*\\(", label: "COUNT(...)" },
    { re: "group\\s+by\\s+customer", label: "GROUP BY customer" }
  ],
  answers: ["SELECT customer, COUNT(*) FROM orders GROUP BY customer;"]
}
```

`re` là biểu thức chính quy chạy trên câu trả lời đã hạ về chữ thường và gộp khoảng trắng,
`label` là tên hiển thị khi người học còn thiếu phần đó. Chương chứa bài dạng này cần thêm
mảng `dataset` để hiện bảng dữ liệu mẫu ở đầu trang bài tập.

## Học trên điện thoại

Giao diện tự co giãn: máy tính thì cột bookmark nằm dọc bên phải, điện thoại thì bookmark
thành hàng tab ngang dính trên đầu, thanh lật trang dính dưới đáy, ô nhập chữ 16px để iOS
không tự phóng to.

**Cách 1 — một file duy nhất (dễ nhất, dùng offline)**

```bash
node build-single-file.js
```

Tạo ra `so-tay-tieng-anh.html`, khoảng 100 KB, đã nhét sẵn toàn bộ CSS và JS vào trong.
Gửi file đó qua Zalo hoặc Google Drive, tải về máy rồi mở bằng Chrome. Không cần mạng.
Nhớ chạy lại lệnh này mỗi khi bạn sửa nội dung bài học.

**Cách 2 — mở từ máy tính qua WiFi**

```bash
node serve-lan.js
```

Lệnh in ra địa chỉ kiểu `http://192.168.1.x:8899`, gõ vào Chrome trên điện thoại là xong.
Máy tính phải đang bật và cùng mạng WiFi. Cách này tiện khi bạn vừa sửa nội dung vừa xem thử.

**Cách 3 — thêm vào màn hình chính**

Sau khi mở sổ trên Chrome điện thoại, bấm menu ba chấm rồi chọn Thêm vào màn hình chính.
Sổ sẽ có icon riêng như một app.

Lưu ý: bài làm trên điện thoại và trên máy tính là hai kho riêng, vì localStorage gắn với
từng trình duyệt. Muốn đồng bộ thì dùng nút Xuất file backup ở máy này rồi Nạp lại backup ở máy kia.

## Cập nhật bản đang chạy trên mạng

Sổ tay đang chạy tại **https://sonbeauty.github.io/note/** (nhánh `gh-pages` của repo).
Sau khi sửa nội dung bài học, chạy một lệnh này là xong:

```bash
./deploy.sh
```

Hoặc kèm mô tả riêng: `./deploy.sh "feat: thêm chương 6"`.

Script sẽ tự gộp lại file một-file cho điện thoại, lấy nhánh `gh-pages` mới nhất về một
worktree tạm, chép file sang, commit và push. Nếu không có gì đổi thì nó báo và dừng,
không tạo commit rác. Thư mục tạm luôn được dọn kể cả khi script lỗi giữa chừng.

Đợi khoảng 1-2 phút cho GitHub build xong rồi tải lại trang.

## Font tiếng Việt

Sổ dùng font **Cambria** (dự phòng: Constantia, Palatino Linotype, Times New Roman).
Không dùng Georgia vì Georgia thiếu bộ glyph Latin Extended Additional, khiến các chữ như
`ề`, `ố`, `ỗ` bị tách dấu ra khỏi chữ. Nếu máy nào vẫn hiển thị lệch, đổi biến `--serif`
ở đầu file `notebook-styles.css`.

## Cấu trúc

```
english-notebook/
├── index.html            khung sổ, ba tab chính, ngăn kéo mục lục
├── notebook-styles.css   giao diện tờ giấy, tab, bookmark, ngăn kéo
├── notebook-content.css  khối code, bảng dữ liệu, ô cảnh báo cho phần SQL
├── notebook-state.js     lưu trữ localStorage, chấm điểm, đếm điểm theo chương và theo mục
├── notebook-speech.js    đọc mẫu tiếng Anh bằng Web Speech API
├── notebook-diff.js      so từng từ với đáp án để chỉ ra sai ở đâu, sai kiểu gì
├── notebook-blocks.js    dựng khối nội dung SQL và ví dụ JOIN bấm được
├── notebook-render.js    dựng HTML cho mục lục, trang bài học, trang bài tập
├── notebook-app.js       đổi mục, lật trang, bắt sự kiện
├── notebook-toolbar.js   các nút trên thanh công cụ
├── data-chapters.js      nội dung tiếng Anh
├── data-vocabulary.js    từ vựng tiếng Anh
├── data-exercises.js     bài tập tiếng Anh
├── data-sql-basics.js          chương SQL căn bản
├── data-sql-basics-exercises.js bài tập chương đó
├── data-sql-chapters.js  nội dung PostgreSQL
├── data-sql-exercises.js bài tập PostgreSQL
├── data-mysql-chapters.js      ghi chú truy vấn công nợ MySQL
├── data-mysql-exercises.js     bài tập chương đó
├── data-security-chapters.js   ghi chú kiểm tra file tải lên
├── data-security-exercises.js  bài tập chương đó
├── data-transaction-chapters.js  ghi chú transaction và khóa dòng
├── data-transaction-exercises.js bài tập chương đó
├── data-algo-chapters.js         ghi chú thuật toán LCS
├── data-algo-exercises.js        bài tập chương đó
├── data-js-chapters.js           ghi chú JavaScript, thêm chương mới thì nối vào mảng này
├── data-js-exercises.js          bài tập chương JavaScript
├── data-subjects.js      khai báo ba mục chính
├── build-single-file.js  gộp tất cả thành 1 file cho điện thoại
├── serve-lan.js          mở sổ từ điện thoại qua WiFi
└── deploy.sh             đẩy bản mới lên GitHub Pages
```

Thư mục này độc lập hoàn toàn với app Next.js ở repo gốc, có thể di chuyển đi nơi khác tùy ý.
