// Nội dung 5 chương, rút ra từ các buổi học thực tế trong chat.
window.CHAPTERS = [
  {
    id: "ch1",
    title: "Giới thiệu bản thân",
    subtitle: "Self-introduction",
    intro: "Câu đầu tiên bạn nói với người nước ngoài, với nhà tuyển dụng, với khách hàng. Học thuộc mẫu này.",
    samples: [
      {
        wrong: "Hi my name is Son. I am a Software developer. I want to learn English because i want to earn money, discovery many country in the world.",
        right: "Hi, my name is Son. I'm a software developer. I want to learn English because I want to earn more money and discover many countries in the world.",
        native: "Hi, I'm Son. I work as a software developer. I'm learning English to boost my income and travel the world."
      }
    ],
    rules: [
      { wrong: "Hi my name", right: "Hi, my name", note: "Sau lời chào luôn có dấu phẩy." },
      { wrong: "a Software developer", right: "a software developer", note: "Nghề nghiệp KHÔNG viết hoa trong tiếng Anh, khác tiếng Việt." },
      { wrong: "i want", right: "I want", note: "Chữ I luôn viết hoa ở mọi vị trí, kể cả I'm, I've, I'll." },
      { wrong: "discovery many country", right: "discover many countries", note: "discovery là danh từ, discover mới là động từ. Sau many phải dùng danh từ số nhiều." },
      { wrong: "money, discover", right: "money and discover", note: "Nối 2 hành động bằng and, không dùng dấu phẩy." }
    ]
  },
  {
    id: "ch2",
    title: "Kinh nghiệm & kỹ năng",
    subtitle: "Experience & skills",
    intro: "Phần bạn sẽ dùng nhiều nhất khi phỏng vấn hoặc viết CV. Hai giới từ of và as là chìa khóa.",
    samples: [
      {
        wrong: "I have nearly 4 years experience for software developer. My mainly is ReactJS, NodeJS.",
        right: "I have nearly four years of experience as a software developer. I mainly work with React and Node.js.",
        native: "I've been working as a software developer for almost four years. My main tech stack is React and Node.js."
      }
    ],
    rules: [
      { wrong: "4 years experience", right: "four years of experience", note: "Bắt buộc có of. Số từ 1 đến 10 nên viết bằng chữ trong văn viết." },
      { wrong: "experience for a developer", right: "experience as a developer", note: "as dùng cho vai trò, nghề nghiệp. for nghĩa là cho ai đó." },
      { wrong: "My mainly is React", right: "I mainly work with React", note: "mainly là trạng từ, không thể làm chủ ngữ. Hoặc dùng My main tech stack is React." }
    ]
  },
  {
    id: "ch3",
    title: "Nói về dự án đang làm",
    subtitle: "Talking about your project",
    intro: "Khi ai đó hỏi What are you working on, bạn cần trả lời gọn trong 2 câu. Chú ý trật tự danh từ ghép.",
    samples: [
      {
        wrong: "i'm working on b2b project to give the sale data product, sale can online, check order from customer.",
        right: "I'm working on a B2B project that provides product data to the sales team. Salespeople can sell online and check orders from customers.",
        native: "I'm currently building a B2B platform that gives our sales team access to product data. It lets sales reps sell online and track customer orders in real time."
      }
    ],
    rules: [
      { wrong: "on b2b project", right: "on a B2B project", note: "Danh từ đếm được số ít bắt buộc có a/an/the đứng trước. Viết tắt phải viết hoa: B2B, API, SQL." },
      { wrong: "sale data product", right: "product data", note: "Tiếng Anh ngược tiếng Việt: cái phụ đứng TRƯỚC, cái chính đứng SAU. customer order, login page, sales report." },
      { wrong: "the sale (chỉ người)", right: "the sales team / a salesperson", note: "sale số ít nghĩa là một lần bán hoặc đợt giảm giá, không phải người." },
      { wrong: "sale can online", right: "salespeople can sell online", note: "Sau can BẮT BUỘC có động từ nguyên mẫu. online chỉ là trạng từ." },
      { wrong: "I working on", right: "I'm working on", note: "Hiện tại tiếp diễn = be + V-ing. Thiếu am/is/are là sai ngữ pháp." },
      { wrong: "My team have", right: "My team has", note: "team, company, group là danh từ tập hợp, chia như số ít." }
    ]
  },
  {
    id: "ch4",
    title: "Công việc hằng ngày",
    subtitle: "Daily work",
    intro: "Từ vựng để kể một ngày làm việc của dev: review code, fix bug, họp, deploy.",
    samples: [
      {
        wrong: "I work remote everyday and I join meeting at 9 am.",
        right: "I work remotely every day, and I join a meeting at 9 a.m.",
        native: "I work remotely every day and usually jump on a standup at 9 a.m."
      }
    ],
    rules: [
      { wrong: "everyday (mỗi ngày)", right: "every day", note: "every day 2 từ = mỗi ngày (trạng từ). everyday 1 từ = thường ngày (tính từ): everyday tasks." },
      { wrong: "I work remote", right: "I work remotely", note: "Bổ nghĩa cho động từ phải dùng trạng từ, thêm -ly." },
      { wrong: "join meeting", right: "join a meeting", note: "meeting là danh từ đếm được, cần mạo từ." },
      { wrong: "I'm working and fix bugs", right: "I'm working and I fix bugs", note: "Hai vế khác thì thì phải lặp lại chủ ngữ." }
    ]
  },
  {
    id: "ch5",
    title: "Du lịch & sở thích",
    subtitle: "Travel & hobbies",
    intro: "Chủ đề small talk số một. Nhớ kỹ: visit không có to, nhưng travel và go thì có.",
    samples: [
      {
        wrong: "i want visit to Japan because i really like anime and the food in Japan is delecious like ramen.",
        right: "I want to visit Japan because I really like anime, and the food there is delicious, especially ramen.",
        native: "I'd love to visit Japan. I'm really into anime, and the food there is amazing, especially ramen."
      }
    ],
    rules: [
      { wrong: "want visit", right: "want to visit", note: "Sau want LUÔN có to + động từ, không ngoại lệ." },
      { wrong: "visit to Japan", right: "visit Japan", note: "visit là ngoại động từ, không cần to. Nhưng travel to Japan và go to Japan thì CẦN to." },
      { wrong: "delecious", right: "delicious", note: "Nhớ chữ i ở giữa. Phát âm: đi-LI-shợs." },
      { wrong: "is delicious like ramen", right: "is delicious, especially ramen", note: "Dùng especially để nêu ví dụ nổi bật, không dùng like." }
    ]
  }
];
