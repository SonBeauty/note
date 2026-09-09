// Luu tru, cham diem va cac ham tien ich dung chung.
window.NB = (function () {
  var KEY = "english-notebook-v1";
  var state = load();

  function blank() {
    return {
      answers: {}, status: {}, notes: {},
      hideVocab: false, slowSpeech: false,
      subject: "en", pages: { en: 0, sql: 0 }
    };
  }

  // Ban backup cu chi co mot so trang duy nhat, chuyen sang dang tach theo mon.
  function normalize(s) {
    if (!s || typeof s !== "object" || !s.answers) return blank();
    if (typeof s.pages !== "object" || !s.pages) {
      s.pages = { en: typeof s.page === "number" ? s.page : 0, sql: 0 };
    }
    if (typeof s.pages.en !== "number") s.pages.en = 0;
    if (typeof s.pages.sql !== "number") s.pages.sql = 0;
    if (s.subject !== "en" && s.subject !== "sql") s.subject = "en";
    delete s.page;
    return s;
  }

  function load() {
    try { return normalize(JSON.parse(localStorage.getItem(KEY))); }
    catch (e) { return blank(); }
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); }
    catch (e) { console.warn("Không lưu được:", e); }
  }

  // Cham mem: bo khoang trang thua, dau cau o cuoi, chuan hoa dau nhay cong.
  function norm(s) {
    return String(s).replace(/[‘’]/g, "'").replace(/\s+/g, " ").trim().replace(/[.!?;]+$/, "");
  }
  // Bo het dau cau va viet hoa, dung de phat hien "gan dung".
  function loose(s) {
    return norm(s).toLowerCase().replace(/[.,;:'"?!-]/g, "").replace(/\s+/g, " ").trim();
  }

  // Tu khoa SQL va cac dang dien tu khong phan biet hoa thuong.
  var CASE_FREE = { fill: 1, guess: 1, sql: 1 };

  function grade(ex, input) {
    if (!norm(input)) return "empty";
    var caseFree = CASE_FREE[ex.type] === 1;
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
    var keys = Object.keys(window.ALL_EXERCISES);
    for (var i = 0; i < keys.length; i++) {
      var list = window.ALL_EXERCISES[keys[i]];
      for (var j = 0; j < list.length; j++) { if (list[j].id === id) return list[j]; }
    }
    return null;
  }

  function chapterIds(subjectId) {
    var ids = [];
    window.SUBJECTS.forEach(function (s) {
      if (subjectId && s.id !== subjectId) return;
      s.chapters.forEach(function (c) { ids.push(c.id); });
    });
    return ids;
  }

  // Dem theo chuong, theo mon, hoac ca so neu khong truyen gi.
  function exercisesOf(scope) {
    if (scope && window.ALL_EXERCISES[scope]) return window.ALL_EXERCISES[scope];
    var out = [];
    chapterIds(scope).forEach(function (id) {
      out = out.concat(window.ALL_EXERCISES[id] || []);
    });
    return out;
  }

  function correctCount(scope) {
    return exercisesOf(scope).filter(function (e) {
      return state.status[e.id] === "correct";
    }).length;
  }

  function totalCount(scope) { return exercisesOf(scope).length; }

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  return {
    get: function () { return state; },
    replace: function (s) { state = normalize(s); save(); },
    reset: function () { state = blank(); save(); },
    page: function () { return state.pages[state.subject] || 0; },
    setPage: function (i) { state.pages[state.subject] = i; },
    save: save,
    grade: grade,
    findEx: findEx,
    correctCount: correctCount,
    totalCount: totalCount,
    esc: esc
  };
})();
