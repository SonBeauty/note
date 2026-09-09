// Dung HTML cho tung trang cua cuon so.
window.NBRender = (function () {
  var esc = window.NB.esc;
  var say = function (t) { return window.NBSpeech.btn(t); };
  var KIND = { translate: "Dịch sang tiếng Anh", fix: "Sửa câu sai", fill: "Điền vào chỗ trống" };

  // Trang 0 la muc luc, moi chuong chiem 2 trang: bai hoc va bai tap.
  function buildPages() {
    var pages = [{ kind: "toc", title: "Mục lục", label: "Mục lục" }];
    window.CHAPTERS.forEach(function (ch, i) {
      pages.push({ kind: "learn", chapter: ch.id, title: ch.title, label: "Bài học", no: i + 1 });
      pages.push({ kind: "practice", chapter: ch.id, title: ch.title, label: "Bài tập", no: i + 1 });
    });
    return pages;
  }

  function tocHtml() {
    var h = '<div class="page-head"><h2>Mục lục</h2>' +
      '<span class="kicker">Bấm vào chương để mở</span></div>' +
      '<p class="intro">Sổ tay này ghi lại đúng những gì bạn đã học và những lỗi bạn đã mắc. ' +
      'Mỗi chương gồm một trang bài học và một trang bài tập.</p><ol class="contents">';
    window.CHAPTERS.forEach(function (ch, i) {
      var done = window.NB.correctCount(ch.id), all = window.NB.totalCount(ch.id);
      h += '<li data-goto="' + (i * 2 + 1) + '"><span class="c-score">' + done + "/" + all + '</span>' +
        esc(ch.title) + '<span class="c-sub"> — ' + esc(ch.subtitle) + '</span></li>';
    });
    h += "</ol>";
    return h;
  }

  function chapterScore(chId) {
    return window.NB.correctCount(chId) + "/" + window.NB.totalCount(chId);
  }

  function headHtml(ch, label) {
    return '<div class="page-head"><h2>' + esc(ch.title) + '</h2>' +
      '<span class="kicker">' + esc(ch.subtitle) + " · " + label + "</span></div>";
  }

  function tabsHtml(pageIndex, kind) {
    var learn = kind === "learn" ? pageIndex : pageIndex - 1;
    return '<div class="tabs">' +
      '<button data-goto="' + learn + '" class="' + (kind === "learn" ? "on" : "") + '">Bài học</button>' +
      '<button data-goto="' + (learn + 1) + '" class="' + (kind === "practice" ? "on" : "") + '">Bài tập</button>' +
      "</div>";
  }

  function learnHtml(ch, pageIndex) {
    var st = window.NB.get();
    var h = headHtml(ch, "Bài học") + tabsHtml(pageIndex, "learn") +
      '<p class="intro">' + esc(ch.intro) + "</p>";

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
    h += "</table></div>";
    return h;
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

  function practiceHtml(ch, pageIndex) {
    var st = window.NB.get();
    var h = headHtml(ch, "Bài tập") + tabsHtml(pageIndex, "practice") +
      '<p class="intro">Gõ đáp án rồi bấm Kiểm tra, hoặc nhấn Enter. Chương này bạn đang đúng ' +
      '<span id="ch-progress" data-ch="' + ch.id + '">' + chapterScore(ch.id) + "</span> câu.</p>";
    (window.EXERCISES[ch.id] || []).forEach(function (ex, i) { h += exerciseHtml(ex, i + 1); });
    h += '<h3 class="sub">Ghi chú của bạn</h3><textarea class="notes" data-notes="' + ch.id +
      '" placeholder="Viết thêm câu bạn tự đặt, từ mới, hoặc lỗi bạn hay quên...">' +
      esc(st.notes[ch.id] || "") + "</textarea>" +
      '<div class="saved-hint">Tự lưu khi bạn gõ.</div>';
    return h;
  }

  function pageHtml(pages, i) {
    var p = pages[i];
    if (p.kind === "toc") return tocHtml();
    var ch = window.CHAPTERS.filter(function (c) { return c.id === p.chapter; })[0];
    return p.kind === "learn" ? learnHtml(ch, i) : practiceHtml(ch, i);
  }

  function bookmarksHtml(pages, cur) {
    var curCh = pages[cur].chapter;
    var h = '<button data-goto="0" class="' + (pages[cur].kind === "toc" ? "on" : "") + '">' +
      '<span class="bm-title">Mục lục</span></button>';
    window.CHAPTERS.forEach(function (ch, i) {
      h += '<button data-goto="' + (i * 2 + 1) + '" class="' + (curCh === ch.id ? "on" : "") + '">' +
        '<span class="bm-title">' + (i + 1) + ". " + esc(ch.title) + "</span>" +
        '<span class="bm-sub">' + window.NB.correctCount(ch.id) + "/" + window.NB.totalCount(ch.id) + " câu đúng</span></button>";
    });
    return h;
  }

  return {
    buildPages: buildPages, pageHtml: pageHtml,
    bookmarksHtml: bookmarksHtml, chapterScore: chapterScore
  };
})();
