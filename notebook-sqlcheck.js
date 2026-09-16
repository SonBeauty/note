// Soi cau truc cau SQL de bat nhung loi ma viec do tu khoa khong bat duoc.
// Muc tieu: cham "dung" thi cop vao MySQL phai chay duoc.
window.NBSqlCheck = (function () {
  var CLAUSES = [
    { re: /^select\b/, name: "SELECT", rank: 1 },
    { re: /^from\b/, name: "FROM", rank: 2 },
    { re: /^(inner|left|right|cross|full)?\s*join\b/, name: "JOIN", rank: 3 },
    { re: /^where\b/, name: "WHERE", rank: 4 },
    { re: /^group\s+by\b/, name: "GROUP BY", rank: 5 },
    { re: /^having\b/, name: "HAVING", rank: 6 },
    { re: /^order\s+by\b/, name: "ORDER BY", rank: 7 },
    { re: /^limit\b/, name: "LIMIT", rank: 8 }
  ];
  var AGG = /\b(sum|count|avg|min|max)\s*\(/;

  // Cat cau thanh tung manh theo menh de, chi cat o ngoai cung.
  // Menh de nam trong ngoac la cua truy van con nen bo qua.
  function split(s) {
    var parts = [], depth = 0, quote = null, cur = { name: "?", text: "" }, i = 0;
    while (i < s.length) {
      var c = s[i];
      if (quote) {
        cur.text += c;
        if (c === quote) quote = null;
        i++; continue;
      }
      if (c === "'" || c === '"' || c === "`") { quote = c; cur.text += c; i++; continue; }
      if (c === "(") depth++;
      if (c === ")") depth--;

      if (depth === 0) {
        var rest = s.slice(i);
        var hit = null;
        for (var k = 0; k < CLAUSES.length; k++) {
          if (CLAUSES[k].re.test(rest)) { hit = CLAUSES[k]; break; }
        }
        if (hit) {
          if (cur.text.trim()) parts.push(cur);
          var m = rest.match(hit.re)[0];
          cur = { name: hit.name, rank: hit.rank, text: "" };
          i += m.length;
          continue;
        }
      }
      cur.text += c;
      i++;
    }
    if (cur.text.trim() || cur.name !== "?") parts.push(cur);
    return { parts: parts, depth: depth, quote: quote };
  }

  // Xoa ruot cac cap ngoac nhung giu lai chinh dau ngoac.
  // "sum(total) > 100" thanh "sum() > 100" nen van nhan ra ham gop,
  // con "in (select ... sum(x) ...)" thanh "in ()" nen truy van con khong bi tinh nham.
  function maskParens(text) {
    var out = "", depth = 0;
    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      if (c === "(") { depth++; if (depth === 1) out += "("; continue; }
      if (c === ")") { depth--; if (depth === 0) out += ")"; continue; }
      if (depth === 0) out += c;
    }
    return out;
  }

  // UNION noi nhieu cau SELECT doc lap lai voi nhau, moi ve co bo menh de rieng.
  // Cat o ngoai cung roi soi tung ve, khong thi ve sau bi cham la "sai thu tu".
  function splitUnions(s) {
    var parts = [], depth = 0, quote = null, cur = "", i = 0;
    var UNION = /^(union\s+all|union|except|intersect)\b/;
    while (i < s.length) {
      var c = s[i];
      if (quote) { cur += c; if (c === quote) quote = null; i++; continue; }
      if (c === "'" || c === '"' || c === "`") { quote = c; cur += c; i++; continue; }
      if (c === "(") depth++;
      if (c === ")") depth--;
      if (depth === 0) {
        var m = s.slice(i).match(UNION);
        if (m) { parts.push(cur); cur = ""; i += m[0].length; continue; }
      }
      cur += c;
      i++;
    }
    parts.push(cur);
    return parts;
  }

  // Tra ve danh sach loi cau truc, rong nghia la khong thay van de gi.
  function problems(input) {
    var s = String(input).toLowerCase().replace(/\s+/g, " ").trim();
    if (!s) return [];
    var branches = splitUnions(s);
    if (branches.length > 1) {
      var all = [];
      branches.forEach(function (b) {
        problems(b).forEach(function (p) { if (all.indexOf(p) < 0) all.push(p); });
      });
      return all;
    }

    var out = [];
    var r = split(s);

    if (r.depth > 0) out.push("thiếu dấu ngoặc đóng");
    if (r.depth < 0) out.push("thừa dấu ngoặc đóng");
    if (r.quote) out.push("dấu nháy chưa đóng");

    var named = r.parts.filter(function (p) { return p.rank; });

    // Thu tu menh de la co dinh, sai thu tu la loi cu phap
    for (var i = 1; i < named.length; i++) {
      if (named[i].rank < named[i - 1].rank) {
        out.push(named[i].name + " phải viết trước " + named[i - 1].name);
        break;
      }
    }

    named.forEach(function (p) {
      // Ham gop chi duoc nam o SELECT, HAVING va ORDER BY.
      // Chi xet phan ngoai ngoac, vi ham gop trong truy van con la hop le.
      if (p.name !== "GROUP BY" && p.name !== "WHERE") return;
      if (!AGG.test(maskParens(p.text))) return;
      out.push(p.name === "GROUP BY"
        ? "hàm gộp không được nằm trong GROUP BY, phải đưa vào SELECT"
        : "hàm gộp không được nằm trong WHERE, phải dùng HAVING");
    });

    if (named.length && named[0].name !== "SELECT" && /\bselect\b/.test(s)) {
      out.push("SELECT phải đứng đầu câu");
    }
    return out;
  }

  return { problems: problems };
})();
