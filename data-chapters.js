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
  },
  {
    id: "ch6",
    title: "Nhờ người nước ngoài luyện tiếng Anh",
    subtitle: "Asking for a language partner",
    intro: "Bạn gặp một người nước ngoài và muốn nhờ họ nói chuyện để luyện tiếng Anh. Ba việc phải làm đúng: bắt chuyện lịch sự, đề nghị đổi lại thứ gì đó, và xin họ sửa lỗi cho mình.",
    samples: [
      {
        wrong: "Hello, can you teach English for me? I very want to speak English fluent.",
        right: "Hi, sorry to bother you. Would you mind helping me practice my English? I really want to speak English fluently.",
        native: "Hey, sorry to bother you — do you have a minute? I'm trying to practice my English, and I'd love to chat if you're up for it."
      },
      {
        wrong: "I hope you can talk with me every week. I will teach you Vietnamese for exchange, do you agree?",
        right: "I hope we can talk every week. I can teach you Vietnamese in exchange. Would that work for you?",
        native: "Maybe we could do a language exchange — an hour of English, an hour of Vietnamese. Would that work for you?"
      },
      {
        wrong: "Please correct me if I say wrong. Don't mind about my mistake, I am not good English.",
        right: "Please correct me if I say something wrong. Don't worry about my mistakes — my English isn't good yet.",
        native: "Feel free to jump in and correct me. I'd rather hear it than keep making the same mistake."
      }
    ],
    rules: [
      { wrong: "teach English for me", right: "teach me English", note: "teach + người + môn học, không có for. Với người lạ nên nói nhẹ hơn: help me practice English." },
      { wrong: "Can you teach me?", right: "Would you mind helping me?", note: "Can you nghe như sai khiến. Với người mới quen dùng Could you hoặc Would you mind + V-ing." },
      { wrong: "I very want", right: "I really want", note: "very không bao giờ đứng trước động từ. Bổ nghĩa cho động từ dùng really." },
      { wrong: "speak English fluent", right: "speak English fluently", note: "fluent là tính từ, fluently là trạng từ. Sau động từ speak phải dùng trạng từ." },
      { wrong: "for exchange", right: "in exchange", note: "Cụm cố định: in exchange, hoặc in exchange for something." },
      { wrong: "if I say wrong", right: "if I say something wrong", note: "say là ngoại động từ, luôn cần tân ngữ đứng sau." },
      { wrong: "Don't mind about my mistake", right: "Don't worry about my mistakes", note: "worry about mới là lo lắng về. mistake đếm được nên thêm -s." },
      { wrong: "I am not good English", right: "My English isn't good yet", note: "Không nói I am not good + danh từ. Nói My English isn't good, hoặc I'm not good at English." },
      { wrong: "Where are you come from?", right: "Where are you from?", note: "Một câu chỉ có một động từ chính. Hoặc Where do you come from, không dùng cả are lẫn come." },
      { wrong: "Can you repeat again?", right: "Could you say that again?", note: "repeat đã có nghĩa lặp lại rồi, thêm again là thừa." }
    ]
  },
  {
    id: "ch7",
    title: "Đọc tên cột bảng tài chính",
    subtitle: "Reading finance table columns",
    intro: "Tên cột trong bảng kế toán ERP viết tắt rất nhiều. Thuộc 5 quy ước đặt tên là đoán được gần hết bảng: hậu tố _Key, _Type, Local, Man và tiền tố Cor.",
    samples: [
      {
        wrong: "This column is prepayment of man, I don't know what is it mean.",
        right: "I'm not sure what this column means. Does PrepaymentMan stand for the prepayment amount in the management currency?",
        native: "Quick question about PrepaymentMan — is that the prepayment amount in management currency? The naming isn't obvious to me."
      },
      {
        wrong: "Debt is money customer must pay to we, DebtLocal is same but local money.",
        right: "Debt is the amount the customer owes us in the document currency, and DebtLocal is the same amount converted into our local currency.",
        native: "Debt holds the balance in the original document currency; DebtLocal is that same balance converted to our local currency."
      },
      {
        wrong: "ReversingEntry mean the record is cancel, right? I want confirm with you.",
        right: "Does ReversingEntry mean the row cancels an earlier entry? I'd like to confirm with you.",
        native: "Just to confirm — a row flagged ReversingEntry reverses an earlier posting, right?"
      }
    ],
    rules: [
      { wrong: "PrepaymentMan = trả trước cho một người", right: "PrepaymentMan = prepayment in the management currency", note: "Man viết tắt của Management (kế toán quản trị), không phải man là người. Cùng bộ: Prepayment (nguyên tệ) → PrepaymentLocal (bản tệ) → PrepaymentMan (tiền tệ quản trị)." },
      { wrong: "Local nghĩa là ở địa phương", right: "local currency = bản tệ, đồng tiền hạch toán của công ty", note: "Cột kết thúc bằng Local luôn là số tiền đã quy đổi sang bản tệ, ví dụ VND. Cột không có đuôi là nguyên tệ trên chứng từ." },
      { wrong: "Cor... nghĩa là correct", right: "Cor = corresponding, nghĩa là đối ứng", note: "CorARAPObject_Key là đối tượng công nợ ĐỐI ỨNG. Trong kế toán, corresponding account = tài khoản đối ứng." },
      { wrong: "_Key là chìa khóa", right: "_Key = foreign key, trỏ sang bảng danh mục khác", note: "Currency_Key không chứa chữ USD, nó chứa id của dòng bên bảng tiền tệ. Phải JOIN mới ra tên thật." },
      { wrong: "Recorder = người ghi sổ", right: "recorder = chứng từ đã sinh ra dòng này", note: "Trong ERP, Recorder là chứng từ ghi sổ chứ không phải người. Recorder_Type cho biết đó là loại chứng từ nào, vì mỗi loại nằm ở một bảng khác nhau." },
      { wrong: "ARAP là một tên riêng", right: "AR + AP = Accounts Receivable + Accounts Payable", note: "AR = phải thu (khách nợ mình). AP = phải trả (mình nợ nhà cung cấp). Ghép lại thành công nợ nói chung." },
      { wrong: "Debt nghĩa là nợ xấu", right: "debt = số dư công nợ còn lại", note: "Debt chỉ là số tiền còn nợ theo chứng từ, không mang nghĩa xấu. Nợ khó đòi tiếng Anh là bad debt hoặc doubtful debt." },
      { wrong: "Active = đang hoạt động", right: "active = dòng này có được tính vào số dư hay không", note: "Active bằng false thì bản ghi vẫn nằm trong bảng nhưng bị bỏ qua khi cộng số dư. Luôn lọc WHERE Active = true." },
      { wrong: "OccurrenceDate = ngày tạo bản ghi", right: "occurrence date = ngày nghiệp vụ thực sự phát sinh", note: "Khác PlannedRepaymentDate là ngày DỰ KIẾN thanh toán. Thời điểm ghi sổ nằm ở cột Period." },
      { wrong: "ReversingEntry = xóa dòng cũ", right: "reversing entry = bút toán đảo", note: "Kế toán không xóa. Họ ghi thêm một dòng ngược dấu để hủy dòng cũ. Tiếng Việt gọi là bút toán đảo hoặc storno." }
    ]
  }
];
