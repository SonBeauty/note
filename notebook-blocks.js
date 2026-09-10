// Dung HTML cho cac khoi noi dung cua mon Lap trinh, va vi du JOIN bam duoc.
window.NBBlocks = (function () {
  var esc = window.NB.esc;

  // Du lieu vi du: S9 khong ton tai trong bang skus de minh hoa dong khong khop.
  var DEMO = {
    INNER: { rows: [["OI1", "S1", "M"]],
      text: "Chỉ OI1 khớp S1 nên giữ đúng 1 dòng." },
    LEFT: { rows: [["OI1", "S1", "M"], ["OI2", null, null]],
      text: "Giữ cả hai dòng hàng. OI2 không khớp SKU nào nên phía SKU là NULL." },
    RIGHT: { rows: [["OI1", "S1", "M"], [null, "S2", "L"]],
      text: "Giữ cả hai SKU. S2 chưa có dòng hàng nào nên item_id là NULL." }
  };

  function tableHtml(head, rows) {
    var h = '<table class="data"><thead><tr>';
    head.forEach(function (c) { h += "<th>" + c + "</th>"; });
    h += "</tr></thead><tbody>";
    rows.forEach(function (r) {
      h += "<tr>";
      r.forEach(function (c) { h += "<td>" + c + "</td>"; });
      h += "</tr>";
    });
    return h + "</tbody></table>";
  }

  function demoHtml() {
    return '<div class="demo">' +
      '<div class="demo-tables">' +
      '<div><p class="demo-cap"><b>A · order_items</b></p>' +
      tableHtml(["id", "skuId"], [["OI1", "S1"], ["OI2", "S9"]]) + "</div>" +
      '<div><p class="demo-cap"><b>B · skus</b></p>' +
      tableHtml(["id", "size"], [["S1", "M"], ["S2", "L"]]) + "</div></div>" +
      '<div class="demo-tabs">' +
      '<button data-join="INNER">INNER JOIN</button>' +
      '<button data-join="LEFT">LEFT JOIN</button>' +
      '<button data-join="RIGHT">RIGHT JOIN</button></div>' +
      '<pre class="code"><code id="demo-query"></code></pre>' +
      '<div id="demo-result"></div>' +
      '<p class="demo-note" id="demo-explain"></p></div>';
  }

  function blockHtml(b) {
    if (b.t === "h") return '<h3 class="sub">' + esc(b.text) + "</h3>";
    if (b.t === "p") return "<p>" + b.html + "</p>";
    if (b.t === "code") return '<pre class="code"><code>' + esc(b.text) + "</code></pre>";
    if (b.t === "hint") return '<aside class="hint">' + b.html + "</aside>";
    if (b.t === "big") return '<div class="big-example">' + esc(b.text) + "</div>";
    if (b.t === "table") return '<div class="card">' + tableHtml(b.head, b.rows) + "</div>";
    if (b.t === "demo") return demoHtml();
    return "";
  }

  function render(blocks) {
    return (blocks || []).map(blockHtml).join("");
  }

  // Goi lai sau moi lan ve trang, chi lam gi khi trang do co vi du JOIN.
  function wireDemo(root) {
    var q = root.querySelector("#demo-query");
    if (!q) return;
    var buttons = root.querySelectorAll("[data-join]");

    function show(kind) {
      q.textContent = "SELECT oi.id AS item_id, s.id AS sku_id, s.option2 AS size\n" +
        "FROM order_items oi\n" + kind + ' JOIN skus s ON s.id = oi."skuId";';
      var rows = DEMO[kind].rows.map(function (r) {
        return r.map(function (v) {
          return v === null ? '<span class="null">NULL</span>' : esc(v);
        });
      });
      root.querySelector("#demo-result").innerHTML =
        tableHtml(["item_id", "sku_id", "size"], rows);
      root.querySelector("#demo-explain").textContent = DEMO[kind].text;
      for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.toggle("on", buttons[i].dataset.join === kind);
      }
    }

    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener("click", function () { show(this.dataset.join); });
    }
    show("INNER");
  }

  return { render: render, wireDemo: wireDemo, table: tableHtml };
})();
