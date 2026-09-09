// Thanh cong cu: an nghia, toc doc, xoa het, xuat va nap backup.
(function () {
  var NB = window.NB, App = window.NBApp;

  document.getElementById("btn-hide-vocab").addEventListener("click", function () {
    var st = NB.get();
    st.hideVocab = !st.hideVocab; NB.save();
    var cells = document.querySelectorAll("td.vi");
    for (var i = 0; i < cells.length; i++) cells[i].classList.toggle("hidden", st.hideVocab);
    this.textContent = st.hideVocab ? "Hiện nghĩa từ vựng" : "Ẩn nghĩa (học thẻ)";
  });

  var btnSpeed = document.getElementById("btn-speed");
  if (!window.NBSpeech.supported) {
    btnSpeed.textContent = "Trình duyệt không đọc được";
    btnSpeed.disabled = true;
  } else {
    btnSpeed.addEventListener("click", function () {
      var st = NB.get();
      st.slowSpeech = !st.slowSpeech; NB.save();
      this.textContent = st.slowSpeech ? "Đang đọc chậm ✓" : "Đọc chậm lại";
      window.NBSpeech.say("This is the reading speed.", st.slowSpeech);
    });
    if (NB.get().slowSpeech) btnSpeed.textContent = "Đang đọc chậm ✓";
  }

  document.getElementById("btn-reset").addEventListener("click", function () {
    if (confirm("Xóa toàn bộ bài làm và ghi chú? Không khôi phục được.")) {
      NB.reset(); App.rebuild();
    }
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
      try {
        NB.replace(JSON.parse(r.result));
        App.rebuild();
        alert("Đã nạp lại bài làm.");
      } catch (err) { alert("File không hợp lệ."); }
    };
    r.readAsText(f);
  });

})();
