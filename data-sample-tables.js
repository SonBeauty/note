// Bo sung bang mau cho nhung chuong co bai tap dung bang chua duoc khai bao.
// Nho vay moi cau tra loi mau deu co du bang de chay that, va build-sample-data.js
// sinh ra database tuong ung. Khong sua vao file chuong goc.
(function () {
  var EXTRA = {
    // UNION giua hai he: can bang thu hai de noi vao
    sqlc4: [
      // id de dang chu cho khop kieu voi orders.id, khong thi UNION bao loi kieu.
      // partnerId co P1 trung voi orders de INTERSECT ra ket qua, va P3 rieng de EXCEPT co nghia.
      { name: "one_c_sales_orders", head: ["id", "partnerId", "amount"],
        rows: [["S501", "P1", "700"], ["S502", "P3", "250"]] }
    ],

    // Truy van con tren schema ERP that
    sqlc6: [
      { name: "CustomersARAPAccountingByDueDates_RecordType",
        head: ["RecordType", "Debt", "PlannedRepaymentDate", "AccountingDimensionByPartners_Key", "ReversingEntry", "Active"],
        rows: [
          ["Receipt", "100", "2026-08-01", "D1", "0", "1"],
          ["Payment", "40", "2026-12-31", "D1", "0", "1"],
          ["Receipt", "60", "2026-09-01", "D2", "0", "1"]
        ] },
      { name: "DimensionKeysOfAccountingByPartners", head: ["Ref_Key", "Partner_Key"],
        rows: [["D1", "P01"], ["D2", "P02"]] }
    ],

    // Tuoi no: tang 1 doc tu x, tang 2 doc tu t.
    // Tao san hai bang do de moi tang deu chay duoc rieng le.
    sqlc7: [
      { name: "x", head: ["sign_debt", "PlannedRepaymentDate", "AccountingDimensionByPartners_Key"],
        rows: [
          ["100", "2026-08-01", "D1"],
          ["-40", "2026-12-31", "D1"],
          ["60", "2026-09-01", "D2"]
        ] },
      { name: "DimensionKeysOfAccountingByPartners", head: ["Ref_Key", "Partner_Key"],
        rows: [["D1", "P01"], ["D2", "P02"]] },
      { name: "t", head: ["partnerKey", "du_no", "so_ngay"],
        rows: [["P01", "100", "46"], ["P01", "40", "-106"], ["P02", "60", "15"]] }
    ],

    sqlc8: [
      { name: "x", head: ["sign_debt", "PlannedRepaymentDate", "AccountingDimensionByPartners_Key"],
        rows: [
          ["100", "2026-08-01", "D1"],
          ["-40", "2026-12-31", "D1"],
          ["60", "2026-09-01", "D2"]
        ] },
      { name: "DimensionKeysOfAccountingByPartners", head: ["Ref_Key", "Partner_Key"],
        rows: [["D1", "P01"], ["D2", "P02"]] },
      { name: "t", head: ["partnerKey", "ngay_hen", "du_no"],
        rows: [["P01", "2026-08-01", "100"], ["P01", "2026-12-31", "-40"], ["P02", "2026-09-01", "60"]] }
    ]
  };

  // Bai tap chuong my1 coi sign_debt la cot da co san, nen bang mau phai co that cot do,
  // khong thi cop cau tra loi vao chay se bao thieu cot.
  var ADD_COLUMNS = {
    my1: {
      ar_entries: { name: "sign_debt", values: ["100", "-40", "60"] }
    }
  };

  var groups = [
    window.SQL_BASICS, window.SQL_AGGREGATE_CHAPTERS, window.SQL_CLAUSES,
    window.SQL_JOIN_UNION, window.SQL_SUBQUERY, window.SQL_AGING,
    window.SQL_CHAPTERS, window.MYSQL_CHAPTERS
  ];

  function findChapter(id) {
    var found = null;
    groups.forEach(function (g) {
      (g || []).forEach(function (c) { if (c.id === id) found = c; });
    });
    return found;
  }

  Object.keys(EXTRA).forEach(function (chapterId) {
    var chapter = findChapter(chapterId);
    if (!chapter) { console.warn("Khong tim thay chuong", chapterId); return; }
    if (!chapter.dataset) chapter.dataset = [];
    EXTRA[chapterId].forEach(function (t) {
      var has = chapter.dataset.some(function (d) { return d.name === t.name; });
      if (!has) chapter.dataset.push(t);
    });
  });

  Object.keys(ADD_COLUMNS).forEach(function (chapterId) {
    var chapter = findChapter(chapterId);
    if (!chapter || !chapter.dataset) return;
    Object.keys(ADD_COLUMNS[chapterId]).forEach(function (tableName) {
      var spec = ADD_COLUMNS[chapterId][tableName];
      var table = chapter.dataset.filter(function (d) { return d.name === tableName; })[0];
      if (!table || table.head.indexOf(spec.name) >= 0) return;
      table.head.push(spec.name);
      table.rows.forEach(function (row, i) { row.push(spec.values[i] !== undefined ? spec.values[i] : ""); });
    });
  });
})();
