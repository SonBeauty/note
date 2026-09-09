// Dung HTML cho tung trang cua cuon so, dung chung cho ca hai mon.
window.NBRender = (function () {
  var esc = window.NB.esc;
  var say = function (t) { return window.NBSpeech.btn(t); };
  var KIND = {
    translate: "Dịch sang tiếng Anh", fix: "Sửa câu sai", fill: "Điền vào chỗ trống",
    guess: "Đoán kết quả", sql: "Viết mệnh đề SQL"
  };

  function subjectById(id) {
    return window.SUBJECTS.filter(function (s) { return s.id === id; })[0] || window.SUBJECTS[0];
  }

  // Trang 0 la muc luc, moi chuong chiem 2 trang: bai hoc va bai tap.
  function buildPages(subjectId) {
    var subject = subjectById(subjectId);
    var pages = [{ kind: "toc", subject: subject.id, title: "Mục lục", label: "Mục lục" }];
    subject.chapters.forEach(function (ch, i) {
      pages.push({ kind: "learn", subject: subject.id, chapter: ch.id, title: ch.title, no: i + 1 });
      pages.push({ kind: "practice", subject: subject.id, chapter: ch.id, title: ch.title, no: i + 1 });
    });
    return pages;
  }

  function chapterScore(chId) {
    return window.NB.correctCount(chId) + "/" + window.NB.totalCount(chId);
  }

  function subjectTabsHtml(currentId) {
    return window.SUBJECTS.map(function (s) {
      return '<button class="subject-tab' + (s.id === currentId ? " on" : "") +
        '" data-subject="' + s.id + '">' + esc(s.title) +
        '<small>' + window.NB.correctCount(s.id) + "/" + window.NB.totalCount(s.id) + "</small></button>";
    }).join("");
  }

  function tocHtml(subjectId) {
    var subject = subjectById(subjectId);
    var h = '<div class="page-head"><h2>Mục lục</h2>' +
      '<span class="kicker">' + esc(subject.title) + " · bấm vào chương để mở</span></div>" +
      '<p class="intro">' + esc(subject.tocIntro) + "</p><ol class=\"contents\">";
    subject.chapters.forEach(function (ch, i) {
      h += '<li data-goto="' + (i * 2 + 1) + '"><span class="c-score">' + chapterScore(ch.id) + "</span>" +
        esc(ch.title) + '<span class="c-sub"> — ' + esc(ch.subtitle) + "</span></li>";
    });
    return h + "</ol>";
  }

  function headHtml(ch, label) {
    return '<div class="page-head"><h2>' + esc(ch.title) + "</h2>" +
      '<span class="kicker">' + esc(ch.subtitle) + " · " + label + "</span></div>";
  }

  function tabsHtml(pageIndex, kind) {
    var learn = kind === "learn" ? pageIndex : pageIndex - 1;
    return '<div class="tabs">' +
      '<button data-goto="' + learn + '" class="' + (kind === "learn" ? "on" : "") + '">Bài học</button>' +
      '<button data-goto="' + (learn + 1) + '" class="' + (kind === "practice" ? "on" : "") + '">Bài tập</button>' +
      "</div>";
  }

  // Trang bai hoc mon tieng Anh: cau mau, quy tac, tu vung.
  function learnEnHtml(ch) {
    var st = window.NB.get();
    var h = '<p class="intro">' + esc(ch.intro) + "</p>";

    h += '<h3 class="sub">Câu mẫu</h3>';
    ch.samples.forEach(function (s) {
      h += '<div class="card">' +
        '<div class="line-wrong"><span class="tag">SAI</span>' + esc(s.wrong) + "</div>" +
        '<div class="line-right"><span class="tag">ĐÚNG</span>' + esc(s.right) + say(s.right) + "</div>" +
        '<div class="line-native"><span class="tag">TỰ NHIÊN</span>' + esc(s.native) + say(s.native) + "</div></div>";
    });

    h += '<h3 class="sub">Quy tắc cần thuộc</h3><div class="card">';
    ch.rules.forEach(function (r) {
      h += '<div class="rule"><div class="r-wrong">✗ ' + esc(r.wrong) + "</div>" +
        '<div class="r-right">✓ ' + esc(r.right) + say(r.right) + "</div>" +
        '<div class="r-note">' + esc(r.note) + "</div></div>";
    });
    h += "</div>";

    h += '<h3 class="sub">Từ vựng</h3><div class="card"><table class="vocab">';
    (window.VOCABULARY[ch.id] || []).forEach(function (v) {
      h += '<tr><td class="en">' + esc(v.en) + say(v.en) + "</td>" +
        '<td class="vi' + (st.hideVocab ? " hidden" : "") + '" data-vocab="1">' +
        esc(v.vi) + "</td></tr>";
    });
    return h + "</table></div>";
  }

  // Trang bai hoc mon Lap trinh: cac khoi noi dung tu do.
  function learnBlocksHtml(ch) {
    return '<p class="intro">' + esc(ch.intro) + "</p>" + window.NBBlocks.render(ch.blocks);
  }

  function exerciseHtml(ex, n) {
    var st = window.NB.get();
    var val = st.answers[ex.id] || "";
    var cls = st.status[ex.id] || "";
    return '<div class="ex ' + cls + '" id="ex-' + ex.id + '">' +
      '<div class="kind">' + KIND[ex.type] + "</div>" +
      '<div class="prompt-vi"><b>Câu ' + n + ".</b> " + esc(ex.prompt) + "</div>" +
      '<input class="answer" type="text" placeholder="Gõ câu trả lời của bạn..." value="' +
      esc(val) + '" data-id="' + ex.id + '">' +
      '<div class="actions">' +
      '<button class="primary" data-act="check" data-id="' + ex.id + '">Kiểm tra</button>' +
      '<button data-act="hint" data-id="' + ex.id + '">Gợi ý</button>' +
      '<button data-act="reveal" data-id="' + ex.id + '">Xem đáp án</button>' +
      '</div><div class="feedback" id="fb-' + ex.id + '"></div></div>';
  }

  function practiceHtml(ch) {
    var st = window.NB.get();
    var h = '<p class="intro">Gõ đáp án rồi bấm Kiểm tra, hoặc nhấn Enter. Chương này bạn đang đúng ' +
      '<span id="ch-progress" data-ch="' + ch.id + '">' + chapterScore(ch.id) + "</span> câu.</p>";
    (window.ALL_EXERCISES[ch.id] || []).forEach(function (ex, i) { h += exerciseHtml(ex, i + 1); });
    return h + '<h3 class="sub">Ghi chú của bạn</h3><textarea class="notes" data-notes="' + ch.id +
      '" placeholder="Viết thêm ví dụ, từ mới, hoặc chỗ bạn hay quên...">' +
      esc(st.notes[ch.id] || "") + "</textarea>" +
      '<div class="saved-hint">Tự lưu khi bạn gõ.</div>';
  }

  function pageHtml(pages, i) {
    var p = pages[i];
    if (p.kind === "toc") return tocHtml(p.subject);
    var subject = subjectById(p.subject);
    var ch = subject.chapters.filter(function (c) { return c.id === p.chapter; })[0];
    var head = headHtml(ch, p.kind === "learn" ? "Bài học" : "Bài tập") + tabsHtml(i, p.kind);
    if (p.kind === "practice") return head + practiceHtml(ch);
    return head + (subject.kind === "en" ? learnEnHtml(ch) : learnBlocksHtml(ch));
  }

  function bookmarksHtml(pages, cur) {
    var subject = subjectById(pages[cur].subject);
    var curCh = pages[cur].chapter;
    var h = '<button data-goto="0" class="' + (pages[cur].kind === "toc" ? "on" : "") + '">' +
      '<span class="bm-title">Mục lục</span></button>';
    subject.chapters.forEach(function (ch, i) {
      h += '<button data-goto="' + (i * 2 + 1) + '" class="' + (curCh === ch.id ? "on" : "") + '">' +
        '<span class="bm-title">' + (i + 1) + ". " + esc(ch.title) + "</span>" +
        '<span class="bm-sub">' + chapterScore(ch.id) + " câu đúng</span></button>";
    });
    return h;
  }

  return {
    buildPages: buildPages, pageHtml: pageHtml, bookmarksHtml: bookmarksHtml,
    chapterScore: chapterScore, subjectTabsHtml: subjectTabsHtml, subjectById: subjectById
  };
})();
