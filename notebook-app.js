// Dieu khien cuon so: lat trang, cham diem, luu tru.
(function () {
  var NB = window.NB, R = window.NBRender;
  var PAGES = R.buildPages();
  var el = {
    sheet: document.getElementById("sheet"),
    marks: document.getElementById("bookmarks"),
    num: document.getElementById("page-num"),
    prev: document.getElementById("btn-prev"),
    next: document.getElementById("btn-next"),
    scoreText: document.getElementById("score-text"),
    scorePct: document.getElementById("score-pct"),
    scoreFill: document.getElementById("score-fill")
  };

  function clampPage(i) { return Math.max(0, Math.min(PAGES.length - 1, i)); }

  function refreshScore() {
    var done = NB.correctCount(), all = NB.totalCount();
    el.scoreText.textContent = done + " / " + all + " câu đúng";
    el.scorePct.textContent = Math.round((done / all) * 100) + "%";
    el.scoreFill.style.width = (done / all) * 100 + "%";
  }

  // Cap nhat diem tong, tab bookmark va dong diem cua chuong dang mo.
  function refreshCounters() {
    refreshScore();
    el.marks.innerHTML = R.bookmarksHtml(PAGES, NB.get().page);
    var chp = document.getElementById("ch-progress");
    if (chp) chp.textContent = R.chapterScore(chp.dataset.ch);
  }

  function showFeedback(id, kind) {
    var ex = NB.findEx(id);
    var fb = document.getElementById("fb-" + id);
    var box = document.getElementById("ex-" + id);
    if (!fb || !box) return;
    box.classList.remove("correct", "close", "wrong");
    fb.classList.add("show");
    if (kind === "correct") {
      box.classList.add("correct");
      fb.innerHTML = '<span class="fb-ok">✓ Chính xác!</span>';
    } else if (kind === "close") {
      box.classList.add("close");
      fb.innerHTML = '<span class="fb-warn">⚠ Gần đúng.</span> Từ ngữ đúng rồi, nhưng sai viết hoa hoặc dấu câu.' +
        '<div class="solution">Đáp án: ' + NB.esc(ex.answers[0]) + ".</div>";
    } else if (kind === "reveal") {
      box.classList.add("close");
      fb.innerHTML = '<span class="fb-warn">Đáp án:</span> ' + NB.esc(ex.answers[0]) + "." +
        (ex.answers.length > 1 ? '<div class="solution">Cách khác: ' + NB.esc(ex.answers[1]) + ".</div>" : "");
    } else if (kind === "hint") {
      fb.innerHTML = '<span class="fb-warn">Gợi ý:</span> ' + NB.esc(ex.hint);
    } else if (kind === "empty") {
      fb.innerHTML = '<span class="fb-bad">Bạn chưa viết gì cả.</span>';
    } else {
      box.classList.add("wrong");
      fb.innerHTML = '<span class="fb-bad">✗ Chưa đúng.</span> Thử lại nhé. Gợi ý: ' + NB.esc(ex.hint);
    }
  }

  function render(animate) {
    var st = NB.get();
    st.page = clampPage(st.page);
    el.sheet.innerHTML = R.pageHtml(PAGES, st.page);
    el.marks.innerHTML = R.bookmarksHtml(PAGES, st.page);
    el.num.textContent = "Trang " + (st.page + 1) + " / " + PAGES.length;
    el.prev.disabled = st.page === 0;
    el.next.disabled = st.page === PAGES.length - 1;
    Object.keys(st.status).forEach(function (id) { showFeedback(id, st.status[id]); });
    refreshScore();
    if (animate) {
      el.sheet.classList.remove("flip");
      void el.sheet.offsetWidth;
      el.sheet.classList.add("flip");
    }
  }

  function goTo(i) {
    var st = NB.get();
    i = clampPage(i);
    if (i === st.page) return;
    st.page = i; NB.save(); render(true);
    document.getElementById("book-top").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  document.addEventListener("click", function (e) {
    var t = e.target.closest ? e.target.closest("[data-goto],[data-act],[data-vocab]") : null;
    if (!t) return;
    if (t.dataset.goto !== undefined) { goTo(parseInt(t.dataset.goto, 10)); return; }
    if (t.dataset.vocab) { t.classList.toggle("hidden"); return; }

    var st = NB.get(), id = t.dataset.id, act = t.dataset.act;
    if (act === "hint") { showFeedback(id, "hint"); return; }
    if (act === "reveal") {
      st.status[id] = "close"; NB.save();
      showFeedback(id, "reveal"); refreshCounters();
      return;
    }
    var input = document.querySelector('input[data-id="' + id + '"]');
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
    if (e.key === "Enter" && typing && e.target.classList.contains("answer")) {
      document.querySelector('button[data-act="check"][data-id="' + e.target.dataset.id + '"]').click();
      return;
    }
    if (typing) return;
    if (e.key === "ArrowRight") goTo(NB.get().page + 1);
    if (e.key === "ArrowLeft") goTo(NB.get().page - 1);
  });

  el.prev.addEventListener("click", function () { goTo(NB.get().page - 1); });
  el.next.addEventListener("click", function () { goTo(NB.get().page + 1); });

  document.getElementById("btn-hide-vocab").addEventListener("click", function () {
    var st = NB.get();
    st.hideVocab = !st.hideVocab; NB.save();
    var cells = document.querySelectorAll("td.vi");
    for (var i = 0; i < cells.length; i++) cells[i].classList.toggle("hidden", st.hideVocab);
    this.textContent = st.hideVocab ? "Hiện nghĩa từ vựng" : "Ẩn nghĩa (học thẻ)";
  });

  document.getElementById("btn-reset").addEventListener("click", function () {
    if (confirm("Xóa toàn bộ bài làm và ghi chú? Không khôi phục được.")) { NB.reset(); render(true); }
  });

  document.getElementById("btn-export").addEventListener("click", function () {
    var blob = new Blob([JSON.stringify(NB.get(), null, 2)], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "english-notebook-backup.json";
    a.click();
    URL.revokeObjectURL(a.href);
  });

  document.getElementById("file-import").addEventListener("change", function (e) {
    var f = e.target.files[0];
    if (!f) return;
    var r = new FileReader();
    r.onload = function () {
      try { NB.replace(JSON.parse(r.result)); render(true); alert("Đã nạp lại bài làm."); }
      catch (err) { alert("File không hợp lệ."); }
    };
    r.readAsText(f);
  });

  if (NB.get().hideVocab) {
    document.getElementById("btn-hide-vocab").textContent = "Hiện nghĩa từ vựng";
  }
  render(false);
})();
