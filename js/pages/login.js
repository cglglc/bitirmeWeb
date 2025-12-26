// js/pages/login.js
const form = document.getElementById("loginForm");
const email = document.getElementById("email");
const password = document.getElementById("password");
const togglePwd = document.getElementById("togglePwd");

const errorBox = document.getElementById("errorBox");
const emailHint = document.getElementById("emailHint");
const pwdHint = document.getElementById("pwdHint");

// demo admin
const DEMO_EMAIL = "admin@arrivo.com";
const DEMO_PASSWORD = "123456";

togglePwd.addEventListener("click", () => {
  const isPwd = password.type === "password";
  password.type = isPwd ? "text" : "password";
  togglePwd.setAttribute("aria-label", isPwd ? "Hide password" : "Show password");
});

function setHint(el, hintEl, show) {
  if (show) {
    el.style.borderColor = "rgba(245, 181, 181, 1)";
    hintEl.hidden = false;
  } else {
    el.style.borderColor = "";
    hintEl.hidden = true;
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  // basic validation
  const emailVal = email.value.trim();
  const pwdVal = password.value.trim();

  setHint(email, emailHint, emailVal.length === 0);
  setHint(password, pwdHint, pwdVal.length === 0);

  if (!emailVal || !pwdVal) return;

  // demo auth check (şimdilik)
  const ok = (emailVal === DEMO_EMAIL && pwdVal === DEMO_PASSWORD);

  if (!ok) {
    errorBox.hidden = false;
    return;
  }

  errorBox.hidden = true;

  // demo session (sonra Firebase)
  localStorage.setItem("admin_session", "true");

  // admin panel sayfanın yolu (senin yapında admin/index.html)
  window.location.href = "./admin/index.html";
});
