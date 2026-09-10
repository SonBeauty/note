// So sanh cau tra loi voi dap an theo tung tu, de chi ra sai o dau va sai kieu gi.
window.NBDiff = (function () {
  var esc = window.NB.esc;

  function tokenize(s) { return String(s).trim().split(/\s+/).filter(Boolean); }
  // Bo dau cau va viet hoa de so "cung mot tu"
  function key(t) { return String(t).toLowerCase().replace(/[.,!?;:"'’]/g, ""); }

  function editDistance(a, b) {
    var prev = [], cur = [], i, j;
    for (j = 0; j <= b.length; j++) prev[j] = j;
    for (i = 1; i <= a.length; i++) {
      cur[0] = i;
      for (j = 1; j <= b.length; j++) {
        cur[j] = a[i - 1] === b[j - 1] ? prev[j - 1]
          : 1 + Math.min(prev[j - 1], prev[j], cur[j - 1]);
      }
      prev = cur.slice();
    }
    return prev[b.length];
  }

  // Khop hai chuoi tu bang LCS, tra ve danh sach thao tac theo dung thu tu.
  function align(a, b) {
    var m = a.length, n = b.length, i, j;
    var dp = [];
    for (i = 0; i <= m; i++) {
      dp.push([]);
      for (j = 0; j <= n; j++) dp[i][j] = 0;
    }
    for (i = 1; i <= m; i++) {
      for (j = 1; j <= n; j++) {
        dp[i][j] = key(a[i - 1]) === key(b[j - 1])
          ? dp[i - 1][j - 1] + 1
          : Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
    var ops = [];
    i = m; j = n;
    while (i > 0 && j > 0) {
      if (key(a[i - 1]) === key(b[j - 1])) { ops.unshift({ t: "same", u: a[i - 1], w: b[j - 1] }); i--; j--; }
      else if (dp[i - 1][j] >= dp[i][j - 1]) { ops.unshift({ t: "extra", u: a[i - 1] }); i--; }
      else { ops.unshift({ t: "missing", w: b[j - 1] }); j--; }
    }
    while (i > 0) { ops.unshift({ t: "extra", u: a[i - 1] }); i--; }
    while (j > 0) { ops.unshift({ t: "missing", w: b[j - 1] }); j--; }
    return { ops: ops, lcs: dp[m][n] };
  }

  // Mot tu thua dung canh mot tu thieu thuc chat la mot tu bi viet sai.
  function mergeSubstitutions(ops) {
    var out = [];
    for (var i = 0; i < ops.length; i++) {
      var a = ops[i], b = ops[i + 1];
      if (b && ((a.t === "extra" && b.t === "missing") || (a.t === "missing" && b.t === "extra"))) {
        var u = a.t === "extra" ? a.u : b.u;
        var w = a.t === "missing" ? a.w : b.w;
        out.push({ t: "wrong", u: u, w: w });
        i++;
      } else out.push(a);
    }
    return out;
  }

  // Nhieu tu thieu lien tiep gom thanh mot dau hieu de do roi mat.
  function collapseGaps(ops) {
    var out = [];
    ops.forEach(function (op) {
      var last = out[out.length - 1];
      if (op.t === "missing" && last && last.t === "missing") { last.n = (last.n || 1) + 1; return; }
      out.push(op.t === "missing" ? { t: "missing", w: op.w, n: 1 } : op);
    });
    return out;
  }

  // Bo dau cau dinh o dau va cuoi khi doc ten mot tu trong phan ghi chu.
  function clean(t) { return String(t).replace(/^[^\wÀ-ỹ]+|[^\wÀ-ỹ]+$/g, "") || String(t); }

  // "language" so voi "languages" la loi so it so nhieu, khong phai sai chinh ta.
  function isPluralMix(a, b) {
    var x = key(a), y = key(b);
    return x + "s" === y || y + "s" === x || x + "es" === y || y + "es" === x;
  }

  // Chon dap an gan cau tra loi nhat de so sanh cho cong bang.
  function bestAnswer(answers, input) {
    var u = tokenize(input), best = answers[0], bestScore = -1;
    answers.forEach(function (ans) {
      var w = tokenize(ans);
      var score = (2 * align(u, w).lcs) / (u.length + w.length || 1);
      if (score > bestScore) { bestScore = score; best = ans; }
    });
    return best;
  }

  function classify(op) {
    if (op.t !== "wrong") return op.t;
    if (key(op.u) === key(op.w)) return "case";          // chi khac hoa thuong hoac dau cau
    if (isPluralMix(op.u, op.w)) return "plural";
    if (op.u.length > 3 && editDistance(key(op.u), key(op.w)) <= 2) return "spell";
    return "wrong";
  }

  // Tra ve doan HTML danh dau cau cua nguoi hoc, kem danh sach loi bang tieng Viet.
  // Khong lo ra tu dung, chi noi sai o dau va sai kieu gi.
  function explain(answers, input) {
    var want = bestAnswer(answers, input);
    var ops = collapseGaps(mergeSubstitutions(align(tokenize(input), tokenize(want)).ops));
    var html = "", notes = [];

    function mark(cls, text) { return '<span class="' + cls + '">' + esc(text) + "</span> "; }

    ops.forEach(function (op) {
      if (op.t === "same") {
        if (op.u !== op.w && key(op.u) === key(op.w)) {
          html += mark("d-case", op.u);
          notes.push("<b>" + esc(clean(op.u)) + "</b> sai viết hoa hoặc dấu câu");
        } else html += esc(op.u) + " ";
        return;
      }
      if (op.t === "extra") {
        html += mark("d-extra", op.u);
        notes.push("thừa từ <b>" + esc(clean(op.u)) + "</b>");
        return;
      }
      if (op.t === "missing") {
        html += '<span class="d-gap" title="thiếu từ ở đây">▾</span> ';
        notes.push(op.n > 1 ? "thiếu " + op.n + " từ ở dấu ▾" : "thiếu một từ ở dấu ▾");
        return;
      }
      var kind = classify(op);
      var word = "<b>" + esc(clean(op.u)) + "</b>";
      if (kind === "case") {
        html += mark("d-case", op.u);
        notes.push(word + " sai viết hoa hoặc dấu câu");
      } else if (kind === "plural") {
        html += mark("d-wrong", op.u);
        notes.push(word + " sai số ít hay số nhiều");
      } else if (kind === "spell") {
        html += mark("d-wrong", op.u);
        notes.push(word + " sai chính tả");
      } else {
        html += mark("d-wrong", op.u);
        notes.push(word + " chưa đúng từ");
      }
    });

    // Gop cac loi trung nhau, gioi han cho de khoi roi mat
    var seen = {}, uniq = [];
    notes.forEach(function (n) { if (!seen[n]) { seen[n] = 1; uniq.push(n); } });
    if (uniq.length > 4) uniq = uniq.slice(0, 4).concat(["và vài chỗ nữa"]);

    return { html: html.trim(), notes: uniq };
  }

  return { explain: explain };
})();
