// Doc mau tieng Anh bang Web Speech API co san trong trinh duyet.
// Khong can thu vien, khong can mang, dung giong doc cua he dieu hanh.
window.NBSpeech = (function () {
  var supported = typeof window.speechSynthesis !== "undefined" &&
    typeof window.SpeechSynthesisUtterance !== "undefined";
  var voice = null;

  function pickVoice() {
    if (!supported) return;
    var all = window.speechSynthesis.getVoices() || [];
    var en = all.filter(function (v) { return /^en[-_]/i.test(v.lang); });
    // Uu tien giong My, khong co thi lay giong Anh bat ky.
    voice = en.filter(function (v) { return /^en[-_]US/i.test(v.lang); })[0] || en[0] || null;
  }

  if (supported) {
    pickVoice();
    // Chrome nap danh sach giong bat dong bo nen phai nghe su kien nay.
    window.speechSynthesis.onvoiceschanged = pickVoice;
  }

  function say(text, slow) {
    if (!supported || !text) return false;
    window.speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(String(text));
    u.lang = voice ? voice.lang : "en-US";
    u.rate = slow ? 0.6 : 0.95;
    if (voice) u.voice = voice;
    window.speechSynthesis.speak(u);
    return true;
  }

  // Nut loa dat canh mot cum tieng Anh. Tra ve chuoi rong neu trinh duyet khong ho tro.
  function btn(text) {
    if (!supported || !text) return "";
    return '<button class="say" type="button" data-say="' + window.NB.esc(text) +
      '" title="Nghe đọc" aria-label="Nghe đọc">🔊</button>';
  }

  return { supported: supported, say: say, btn: btn };
})();
