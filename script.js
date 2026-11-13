/* 株式会社タカミネ精工 コーポレートサイト（サンプル）共通スクリプト */
(function () {
  "use strict";

  /* ---------- ハンバーガーメニュー ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".global-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- ヘッダーの影 ---------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- スクロールフェードイン ---------- */
  var targets = document.querySelectorAll(".fade-in");
  if ("IntersectionObserver" in window && targets.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    targets.forEach(function (el) { io.observe(el); });
  } else {
    targets.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- 著作権の年を自動表示 ---------- */
  var yearEl = document.getElementById("copyright-year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- お問い合わせフォーム（デモ） ---------- */
  var form = document.getElementById("contact-form");
  if (!form) return;

  var rules = {
    "company": { required: true, message: "会社名を入力してください。" },
    "name": { required: true, message: "お名前を入力してください。" },
    "email": {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "メールアドレスを正しく入力してください。"
    },
    "type": { required: true, message: "お問い合わせ種別を選択してください。" },
    "message": { required: true, message: "お問い合わせ内容を入力してください。" }
  };

  function validateField(input) {
    var rule = rules[input.name];
    if (!rule) return true;
    var errorEl = document.getElementById("error-" + input.name);
    var value = input.value.trim();
    var ok = true;
    if (rule.required && value === "") ok = false;
    if (ok && rule.pattern && !rule.pattern.test(value)) ok = false;
    input.classList.toggle("is-invalid", !ok);
    input.setAttribute("aria-invalid", ok ? "false" : "true");
    if (errorEl) errorEl.classList.toggle("is-shown", !ok);
    return ok;
  }

  Object.keys(rules).forEach(function (name) {
    var input = form.elements[name];
    if (input) {
      input.addEventListener("blur", function () { validateField(input); });
      input.addEventListener("input", function () {
        if (input.classList.contains("is-invalid")) validateField(input);
      });
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var allOk = true;
    var firstInvalid = null;
    Object.keys(rules).forEach(function (name) {
      var input = form.elements[name];
      if (input && !validateField(input)) {
        allOk = false;
        if (!firstInvalid) firstInvalid = input;
      }
    });
    if (!allOk) {
      firstInvalid.focus();
      return;
    }
    /* デモのため実際の送信は行わず、完了表示に切り替える */
    form.style.display = "none";
    var complete = document.getElementById("form-complete");
    if (complete) {
      complete.classList.add("is-shown");
      complete.setAttribute("tabindex", "-1");
      complete.focus();
    }
    window.scrollTo({ top: form.offsetTop - 110, behavior: "smooth" });
  });
})();
