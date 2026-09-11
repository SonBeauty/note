// Bai tap LCS, dang viet code.
window.ALGO_EXERCISES = {
  algo1: [
    {
      id: "a1e1", type: "code",
      prompt: "Khi hai phần tử cuối khớp nhau, dp[i][j] bằng gì?",
      want: "Lấy ô chéo trên bên trái rồi cộng thêm một.",
      hint: "Ô chéo là dp[i-1][j-1].",
      must: [
        { re: "dp\\[\\s*i\\s*-\\s*1\\s*\\]\\[\\s*j\\s*-\\s*1\\s*\\]", label: "dp[i-1][j-1]" },
        { re: "\\+\\s*1", label: "+ 1" }
      ],
      answers: ["dp[i][j] = dp[i - 1][j - 1] + 1;"]
    },
    {
      id: "a1e2", type: "code",
      prompt: "Khi hai phần tử cuối khác nhau, dp[i][j] bằng gì?",
      want: "Bỏ một trong hai đầu, giữ bên cho kết quả lớn hơn.",
      hint: "So hai ô: bên trên và bên trái.",
      must: [
        { re: "max", label: "Math.max" },
        { re: "dp\\[\\s*i\\s*-\\s*1\\s*\\]\\[\\s*j\\s*\\]", label: "dp[i-1][j]" },
        { re: "dp\\[\\s*i\\s*\\]\\[\\s*j\\s*-\\s*1\\s*\\]", label: "dp[i][j-1]" }
      ],
      answers: ["dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);"]
    },
    {
      id: "a1e3", type: "code",
      prompt: "Tạo bảng dp kích thước (m+1) × (n+1), mọi ô bằng 0.",
      want: "Thừa một hàng và một cột để làm biên rỗng.",
      hint: "Array.from kết hợp new Array(...).fill(0), hoặc hai vòng lặp gán 0.",
      must: [
        { re: "m\\s*\\+\\s*1", label: "m + 1" },
        { re: "n\\s*\\+\\s*1", label: "n + 1" },
        { re: "fill\\s*\\(\\s*0|=\\s*0", label: "điền giá trị 0" }
      ],
      answers: ["const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));"]
    },
    {
      id: "a1e4", type: "code",
      prompt: "Trong lúc truy vết, gặp hai phần tử bằng nhau thì lùi chỉ số thế nào?",
      want: "Đi chéo, tức là lùi cả hai.",
      hint: "Hai lệnh giảm, mỗi biến một lệnh.",
      must: [
        { re: "i\\s*--|i\\s*-=\\s*1|i\\s*=\\s*i\\s*-\\s*1", label: "lùi i" },
        { re: "j\\s*--|j\\s*-=\\s*1|j\\s*=\\s*j\\s*-\\s*1", label: "lùi j" }
      ],
      answers: ["i--; j--;"]
    },
    {
      id: "a1e5", type: "code",
      prompt: "Viết công thức tính số thao tác chèn và xóa tối thiểu, biết độ dài hai dãy là m, n và độ dài LCS là lcs.",
      want: "Một dòng, không cần vòng lặp.",
      hint: "Phần chung bị tính hai lần nên phải trừ đi hai lần.",
      must: [
        { re: "m\\s*\\+\\s*n", label: "m + n" },
        { re: "-\\s*2\\s*\\*", label: "− 2 ×" },
        { re: "lcs", label: "lcs" }
      ],
      answers: ["const ops = m + n - 2 * lcs;"]
    }
  ]
};
