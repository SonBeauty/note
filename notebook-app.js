// Dieu khien cuon so: doi mon, lat trang, cham diem, luu tru.
(function () {
  var NB = window.NB, R = window.NBRender;
  var PAGES = R.buildPages(NB.get().subject);
  var say = function (t) { return window.NBSpeech.btn(t); };
  var el = {
    sheet: document.getElementById("sheet"),
    marks: document.getElementById("bookmarks"),
    subjectTabs: document.getElementById("subject-tabs"),
    drawer: document.getElementById("drawer"),
    drawerList: document.getElementById("drawer-list"),
    drawerTitle: document.getElementById("drawer-title"),
    num: document.getElementById("page-num"),
    prev: document.getElementById("btn-prev"),
    next: document.getElementById("btn-next"),
    scoreText: document.getElementById("score-text"),
    scorePct: document.getElementById("score-pct"),
    scoreFill: document.getElementById("score-fill")
  };

  function clampPage(i) { return Math.max(0, Math.min(PAGES.length - 1, i)); }

  function refreshScore() {
    var subject = R.subjectById(NB.get().subject);
    var done = NB.correctCount(subject.id), all = NB.totalCount(subject.id);
    el.scoreText.textContent = subject.title + ": " + done + " / " + all + " câu đúng";
    el.scorePct.textContent = Math.round((done / all) * 100) + "%";
    el.scoreFill.style.width = (done / all) * 100 + "%";
  }

  function refreshNav() {
    el.marks.innerHTML = R.bookmarksHtml(PAGES, NB.page());
    el.drawerList.innerHTML = el.marks.innerHTML;
    el.subjectTabs.innerHTML = R.subjectTabsHtml(NB.get().subject);
  }

  // Cap nhat diem tong, danh sach chuong va dong diem cua chuong dang mo.
  function refreshCounters() {
    refreshScore();
    refreshNav();
    var chp = document.getElementById("ch-progress");
    if (chp) chp.textContent = R.chapterScore(chp.dataset.ch);
  }

  // Danh dau tung tu sai trong cau nguoi hoc vua viet, kem danh sach loi cu the.
  function diffBlock(ex, id) {
    var val = NB.get().answers[id] || "";
    if (!val.trim()) return "";
    var d = window.NBDiff.explain(ex.answers, val);
    if (!d.notes.length) return "";
    return '<div class="diff">' + d.html + "</div>" +
      '<ul class="diff-notes"><li>' + d.notes.join("</li><li>") + "</li></ul>";
  }

  function showFeedback(id, kind) {
    var ex = NB.findEx(id);
    var fb = document.getElementById("fb-" + id);
    var box = document.getElementById("ex-" + id);
    if (!fb || !box || !ex) return;
    var readable = ex.type === "translate" || ex.type === "fix";
    box.classList.remove("correct", "close", "wrong");
    fb.classList.add("show");
    if (kind === "correct") {
      box.classList.add("correct");
      fb.innerHTML = '<span class="fb-ok">✓ Chính xác!</span> ' + (readable ? say(ex.answers[0]) : "");
    } else if (kind === "close") {
      box.classList.add("close");
      fb.innerHTML = '<span class="fb-warn">⚠ Gần đúng.</span> Từ ngữ đúng rồi, chỉ vướng mấy chỗ này:' +
        diffBlock(ex, id) +
        '<div class="solution">Đáp án: ' + NB.esc(ex.answers[0]) + ". " +
        (readable ? say(ex.answers[0]) : "") + "</div>";
    } else if (kind === "reveal") {
      box.classList.add("close");
      fb.innerHTML = '<span class="fb-warn">Đáp án:</span> ' + NB.esc(ex.answers[0]) + ". " +
        (readable ? say(ex.answers[0]) : "") +
        (ex.answers.length > 1 ? '<div class="solution">Cách khác: ' + NB.esc(ex.answers[1]) + ".</div>" : "");
    } else if (kind === "hint") {
      fb.innerHTML = '<span class="fb-warn">Gợi ý:</span> ' + NB.esc(ex.hint);
    } else if (kind === "empty") {
      fb.innerHTML = '<span class="fb-bad">Bạn chưa viết gì cả.</span>';
    } else if (NB.isMustType(ex)) {
      // Chi ra thanh phan con thieu thay vi chi bao sai.
      box.classList.add("wrong");
      var miss = NB.missingParts(ex, document.querySelector('.answer[data-id="' + id + '"]').value);
      fb.innerHTML = '<span class="fb-bad">✗ Còn thiếu:</span> ' +
        miss.map(function (m) { return "<code>" + NB.esc(m) + "</code>"; }).join(", ") +
        '<div class="solution-hint">Gợi ý: ' + NB.esc(ex.hint) + "</div>";
    } else {
      box.classList.add("wrong");
      fb.innerHTML = '<span class="fb-bad">✗ Chưa đúng.</span> Soi lại mấy chỗ được đánh dấu:' +
        diffBlock(ex, id) +
        '<div class="solution-hint">Gợi ý: ' + NB.esc(ex.hint) + "</div>";
    }
  }

  function render(animate) {
    var st = NB.get();
    NB.setPage(clampPage(NB.page()));
    el.sheet.innerHTML = R.pageHtml(PAGES, NB.page());
    window.NBBlocks.wireDemo(el.sheet);
    refreshNav();
    el.num.textContent = "Trang " + (NB.page() + 1) + " / " + PAGES.length;
    el.prev.disabled = NB.page() === 0;
    el.next.disabled = NB.page() === PAGES.length - 1;
    Object.keys(st.status).forEach(function (id) { showFeedback(id, st.status[id]); });
    refreshScore();
    if (animate) {
      el.sheet.classList.remove("flip");
      void el.sheet.offsetWidth;
      el.sheet.classList.add("flip");
    }
  }

  function closeDrawer() { el.drawer.classList.remove("open"); }

  function goTo(i) {
    i = clampPage(i);
    closeDrawer();
    if (i === NB.page()) return;
    NB.setPage(i); NB.save(); render(true);
    document.getElementById("book-top").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function switchSubject(id) {
    var st = NB.get();
    closeDrawer();
    if (st.subject === id) return;
    st.subject = id; NB.save();
    PAGES = R.buildPages(id);
    render(true);
    document.getElementById("book-top").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  document.addEventListener("click", function (e) {
    var t = e.target.closest
      ? e.target.closest("[data-say],[data-subject],[data-goto],[data-act],[data-vocab]") : null;
    if (!t) return;
    if (t.dataset.say !== undefined) { window.NBSpeech.say(t.dataset.say, NB.get().slowSpeech); return; }
    if (t.dataset.subject !== undefined) { switchSubject(t.dataset.subject); return; }
    if (t.dataset.goto !== undefined) { goTo(parseInt(t.dataset.goto, 10)); return; }
    if (t.dataset.vocab) { t.classList.toggle("hidden"); return; }

    var st = NB.get(), id = t.dataset.id, act = t.dataset.act;
    if (act === "hint") { showFeedback(id, "hint"); return; }
    if (act === "reveal") {
      st.status[id] = "close"; NB.save();
      showFeedback(id, "reveal"); refreshCounters();
      return;
    }
    var input = document.querySelector('.answer[data-id="' + id + '"]');
    var res = NB.grade(NB.findEx(id), input.value);
    st.answers[id] = input.value;
    if (res !== "empty") st.status[id] = res;
    NB.save(); showFeedback(id, res); refreshCounters();
  });

  document.addEventListener("input", function (e) {
    var t = e.target, st = NB.get();
    if (t.classList.contains("answer")) { st.answers[t.dataset.id] = t.value; NB.save(); }
    if (t.dataset && t.dataset.notes) { st.notes[t.dataset.notes] = t.value; NB.save(); }
  });

  document.addEventListener("keydown", function (e) {
    var typing = /^(INPUT|TEXTAREA)$/.test(e.target.tagName);
    var multiline = e.target.tagName === "TEXTAREA";
    if (e.key === "Enter" && typing && e.target.classList.contains("answer") && (!multiline || e.ctrlKey)) {
      document.querySelector('button[data-act="check"][data-id="' + e.target.dataset.id + '"]').click();
      return;
    }
    if (e.key === "Escape") closeDrawer();
    if (typing) return;
    if (e.key === "ArrowRight") goTo(NB.page() + 1);
    if (e.key === "ArrowLeft") goTo(NB.page() - 1);
  });

  el.prev.addEventListener("click", function () { goTo(NB.page() - 1); });
  el.next.addEventListener("click", function () { goTo(NB.page() + 1); });

  document.getElementById("btn-toc").addEventListener("click", function () {
    el.drawerTitle.textContent = R.subjectById(NB.get().subject).title;
    el.drawer.classList.add("open");
  });
  document.getElementById("drawer-close").addEventListener("click", closeDrawer);
  el.drawer.addEventListener("click", function (e) {
    if (e.target === el.drawer) closeDrawer();
  });

  // Thanh cong cu nam o notebook-toolbar.js, nap sau file nay.
  window.NBApp = {
    render: render,
    rebuild: function () { PAGES = R.buildPages(NB.get().subject); render(true); }
  };

  if (NB.get().hideVocab) {
    document.getElementById("btn-hide-vocab").textContent = "Hiện nghĩa từ vựng";
  }
  render(false);
})();
