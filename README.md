# Sổ tay học tập

Sổ tay học cá nhân gồm hai phần: **Tiếng Anh** và **Lập trình**. Chạy offline bằng trình duyệt,
không cần server, không cần cài gì.

## Mở sổ

Nháy đúp vào `index.html`, hoặc kéo file đó thả vào cửa sổ Chrome/Edge.

## Hai mục chính

Hai tab trên đầu sổ, mỗi tab giữ tiến độ và trang đang đọc riêng:

| Mục | Nội dung | Số bài tập |
|---|---|---|
| Tiếng Anh | 5 chương: giới thiệu bản thân, kinh nghiệm, dự án, công việc hằng ngày, du lịch | 25 |
| Lập trình | 3 chương SQL: ghép bảng JOIN, tổng hợp dữ liệu, áp dụng vào dự án | 14 |

Phần SQL có ví dụ JOIN bấm được để so sánh INNER, LEFT và RIGHT, kèm các ô cảnh báo chỗ dễ nhầm.

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
- **39 bài tập** năm dạng: dịch sang tiếng Anh, sửa câu sai, điền vào chỗ trống, đoán kết quả, viết mệnh đề SQL
- **Chấm điểm tự động**: gõ đáp án rồi bấm Kiểm tra (hoặc nhấn Enter)
  - ✓ Chính xác
  - ⚠ Gần đúng — đúng từ nhưng sai viết hoa hoặc dấu câu
  - ✗ Chưa đúng — hiện gợi ý
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

Mọi nội dung nằm trong ba file dữ liệu, sửa trực tiếp là xong, không cần đụng vào code:

| File | Chứa gì |
|---|---|
| `data-chapters.js` | Chương, câu mẫu, bảng quy tắc |
| `data-vocabulary.js` | Từ vựng theo chương |
| `data-exercises.js` | Bài tập và đáp án |

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
Dạng `fill` chấm không phân biệt hoa thường, hai dạng còn lại có phân biệt
vì viết hoa cũng là một phần bài học.

## Học trên điện thoại

Giao diện tự co giãn: máy tính thì cột bookmark nằm dọc bên phải, điện thoại thì bookmark
thành hàng tab ngang dính trên đầu, thanh lật trang dính dưới đáy, ô nhập chữ 16px để iOS
không tự phóng to.

**Cách 1 — một file duy nhất (dễ nhất, dùng offline)**

```bash
node build-single-file.js
```

Tạo ra `so-tay-tieng-anh.html`, khoảng 41 KB, đã nhét sẵn toàn bộ CSS và JS vào trong.
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
├── index.html            khung sổ, hai tab chính, ngăn kéo mục lục
├── notebook-styles.css   giao diện tờ giấy, tab, bookmark, ngăn kéo
├── notebook-content.css  khối code, bảng dữ liệu, ô cảnh báo cho phần SQL
├── notebook-state.js     lưu trữ localStorage, chấm điểm, đếm điểm theo chương và theo mục
├── notebook-speech.js    đọc mẫu tiếng Anh bằng Web Speech API
├── notebook-blocks.js    dựng khối nội dung SQL và ví dụ JOIN bấm được
├── notebook-render.js    dựng HTML cho mục lục, trang bài học, trang bài tập
├── notebook-app.js       đổi mục, lật trang, bắt sự kiện
├── notebook-toolbar.js   các nút trên thanh công cụ
├── data-chapters.js      nội dung tiếng Anh
├── data-vocabulary.js    từ vựng tiếng Anh
├── data-exercises.js     bài tập tiếng Anh
├── data-sql-chapters.js  nội dung SQL
├── data-sql-exercises.js bài tập SQL
├── data-subjects.js      khai báo hai mục chính
├── build-single-file.js  gộp tất cả thành 1 file cho điện thoại
├── serve-lan.js          mở sổ từ điện thoại qua WiFi
└── deploy.sh             đẩy bản mới lên GitHub Pages
```

Thư mục này độc lập hoàn toàn với app Next.js ở repo gốc, có thể di chuyển đi nơi khác tùy ý.
