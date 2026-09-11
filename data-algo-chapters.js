// Thuat toan LCS, chinh la thu dang chay trong notebook-diff.js cua so tay nay.
window.ALGO_CHAPTERS = [
  {
    id: "algo1",
    title: "Thuật toán LCS (JavaScript)",
    subtitle: "Tìm chỗ khác nhau giữa hai dãy",
    intro: "Longest Common Subsequence: dãy con chung dài nhất của hai dãy. Đây là thứ đứng sau mọi công cụ diff, và cũng là thứ đang chấm bài tiếng Anh trong chính cuốn sổ này.",
    blocks: [
      { t: "h", text: "Subsequence khác substring" },
      { t: "p", html: "Subsequence được phép <b>bỏ bớt</b> phần tử nhưng <b>không được đổi thứ tự</b> những phần tử giữ lại. Không cần nằm liền nhau." },
      { t: "code", text: "a = A B C B D A B\nb = B D C A B A\nLCS = B C B A   (dài 4)" },
      { t: "p", html: "Với câu tiếng Anh thì đơn vị là <b>từ</b> chứ không phải ký tự:" },
      { t: "code", text: "bạn viết : I want to visit to Korea    (6 từ)\nđáp án   : I want to visit Korea       (5 từ)\nLCS      : I want to visit Korea       (5 từ)" },
      { t: "p", html: "Bạn có 6 từ mà LCS chỉ 5, vậy đúng một từ dư. Đó là chữ <code>to</code> bị thừa." },

      { t: "h", text: "Vì sao nó giải được bài toán diff" },
      { t: "p", html: "Biết chỗ <i>giống</i> thì suy ra ngay chỗ <i>khác</i>. Phần tử có ở cả hai thì giữ nguyên, chỉ có ở bên A thì bị xóa, chỉ có ở bên B thì được thêm." },
      { t: "p", html: "LCS càng dài thì số thao tác sửa càng ít. Có công thức:" },
      { t: "big", text: "số thao tác = len(a) + len(b) − 2 × len(LCS)" },
      { t: "p", html: "Ví dụ trên: 6 + 5 − 2×5 = 1, đúng một thao tác xóa. Công thức này chỉ tính chèn và xóa, không tính thay thế." },

      { t: "h", text: "Dùng ở đâu" },
      { t: "table", head: ["Chỗ dùng", "Đơn vị so sánh"],
        rows: [
          ["<code>git diff</code>, lệnh <code>diff</code>", "dòng văn bản"],
          ["Track changes trong trình soạn thảo", "từ"],
          ["So chuỗi DNA, protein", "nucleotide"],
          ["Kiểm tra đạo văn", "câu"],
          ["So danh sách UI để cập nhật DOM tối thiểu", "phần tử"],
          ["Sổ tay này", "từ trong câu"]
        ] },
      { t: "p", html: "Thuật toán không quan tâm phần tử là gì, miễn là so được hai phần tử có bằng nhau hay không." },

      { t: "h", text: "Bảng quy hoạch động" },
      { t: "p", html: "<code>dp[i][j]</code> là độ dài LCS của <code>i</code> phần tử đầu bên a và <code>j</code> phần tử đầu bên b. Hai đầu khớp thì cộng 1 vào ô chéo, khác thì bỏ một đầu và lấy bên lớn hơn." },
      { t: "code", text: "function lcsTable(a, b) {\n  const m = a.length, n = b.length;\n  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));\n  for (let i = 1; i <= m; i++) {\n    for (let j = 1; j <= n; j++) {\n      dp[i][j] = a[i - 1] === b[j - 1]\n        ? dp[i - 1][j - 1] + 1\n        : Math.max(dp[i - 1][j], dp[i][j - 1]);\n    }\n  }\n  return dp;\n}" },

      { t: "h", text: "Truy vết để biết sai ở đâu" },
      { t: "p", html: "Bảng trên mới cho độ dài. Muốn biết chỗ khác nhau thì đi ngược từ góc dưới phải về gốc, mỗi bước hỏi ô này đến từ đâu." },
      { t: "code", text: "function diff(a, b) {\n  const dp = lcsTable(a, b);\n  const ops = [];\n  let i = a.length, j = b.length;\n\n  while (i > 0 && j > 0) {\n    if (a[i - 1] === b[j - 1]) {\n      ops.unshift({ t: 'same', v: a[i - 1] });  // đi chéo\n      i--; j--;\n    } else if (dp[i - 1][j] >= dp[i][j - 1]) {\n      ops.unshift({ t: 'del', v: a[i - 1] });   // a có, b không\n      i--;\n    } else {\n      ops.unshift({ t: 'add', v: b[j - 1] });   // b có, a không\n      j--;\n    }\n  }\n  while (i > 0) { i--; ops.unshift({ t: 'del', v: a[i] }); }\n  while (j > 0) { j--; ops.unshift({ t: 'add', v: b[j] }); }\n\n  return ops;\n}" },
      { t: "code", text: "diff('I want to visit to Korea'.split(' '),\n     'I want to visit Korea'.split(' '));\n// same I | same want | same to | same visit | del to | same Korea" },
      { t: "p", html: "Cái <code>del to</code> đó chính là từ bị tô đỏ gạch ngang khi bạn làm sai bài tiếng Anh." },

      { t: "h", text: "Vài điều đáng biết" },
      { t: "hint", html: "Độ phức tạp <code>O(m × n)</code> cả thời gian lẫn bộ nhớ. Hai câu 10 từ là 100 ô, tức thì. Hai file 10.000 dòng là 100 triệu ô nên <code>git</code> không dùng LCS thuần mà dùng <b>Myers diff</b>, độ phức tạp <code>O(N·D)</code> với D là số khác biệt, file càng giống nhau chạy càng nhanh." },
      { t: "hint", html: "Một cặp dãy có thể có <b>nhiều LCS cùng độ dài</b>. Viết <code>dp[i-1][j] >= dp[i][j-1]</code> hay <code>&gt;</code> sẽ quyết định báo <i>thừa</i> trước hay <i>thiếu</i> trước. Không sai, chỉ khác cách trình bày." },
      { t: "hint", html: "Đừng nhầm với <b>Levenshtein</b>: nó cho phép thay thế trực tiếp một phần tử, LCS thì phải xóa rồi chèn. Sổ tay dùng cả hai, LCS để căn hai câu rồi Levenshtein trên từng cặp từ để phân biệt <i>sai chính tả</i> với <i>dùng nhầm từ</i>." }
    ]
  }
];
