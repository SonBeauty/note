// Luu tru, cham diem va cac ham tien ich dung chung.
window.NB = (function () {
  var KEY = "english-notebook-v1";
  var state = load();

  function blank() {
    return { answers: {}, status: {}, notes: {}, hideVocab: false, page: 0 };
  }
  function load() {
    try {
      var s = JSON.parse(localStorage.getItem(KEY));
      if (!s || typeof s !== "object" || !s.answers) return blank();
      if (typeof s.page !== "number") s.page = 0;
      return s;
    } catch (e) { return blank(); }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); }
    catch (e) { console.warn("Không lưu được:", e); }
  }

  // Cham mem: bo khoang trang thua, dau cham cuoi cau, chuan hoa dau nhay cong.
  function norm(s) {
    return String(s).replace(/[‘’]/g, "'").replace(/\s+/g, " ").trim().replace(/[.!?]+$/, "");
  }
  // Bo het dau cau va viet hoa, dung de phat hien "gan dung".
  function loose(s) {
    return norm(s).toLowerCase().replace(/[.,;:'"?!-]/g, "").replace(/\s+/g, " ").trim();
  }

  function grade(ex, input) {
    if (!norm(input)) return "empty";
    var caseFree = ex.type === "fill";
    var u = norm(input);
    for (var i = 0; i < ex.answers.length; i++) {
      var a = norm(ex.answers[i]);
      if (caseFree ? a.toLowerCase() === u.toLowerCase() : a === u) return "correct";
    }
    for (var j = 0; j < ex.answers.length; j++) {
      if (loose(ex.answers[j]) === loose(input)) return "close";
    }
    return "wrong";
  }

  function findEx(id) {
    var keys = Object.keys(window.EXERCISES);
    for (var i = 0; i < keys.length; i++) {
      var list = window.EXERCISES[keys[i]];
      for (var j = 0; j < list.length; j++) { if (list[j].id === id) return list[j]; }
    }
    return null;
  }

  // So cau dung cua mot chuong, hoac cua ca so neu khong truyen chapterId.
  function correctCount(chapterId) {
    var ids = chapterId
      ? (window.EXERCISES[chapterId] || []).map(function (e) { return e.id; })
      : Object.keys(state.status);
    return ids.filter(function (id) { return state.status[id] === "correct"; }).length;
  }

  function totalCount(chapterId) {
    if (chapterId) return (window.EXERCISES[chapterId] || []).length;
    return Object.keys(window.EXERCISES).reduce(function (n, k) {
      return n + window.EXERCISES[k].length;
    }, 0);
  }

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  return {
    get: function () { return state; },
    replace: function (s) { state = s; if (typeof state.page !== "number") state.page = 0; save(); },
    reset: function () { state = blank(); save(); },
    save: save,
    grade: grade,
    findEx: findEx,
    correctCount: correctCount,
    totalCount: totalCount,
    esc: esc
  };
})();
