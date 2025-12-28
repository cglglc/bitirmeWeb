// js/pages/operatorLogin.js
import { auth } from '../firebaseClient.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { operators } from '../../data/mockOperators.js';

const form = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const togglePwd = document.getElementById('togglePwd');
const errorBox = document.getElementById('loginError');
const pendingBox = document.getElementById('pendingBox');

function showError(msg) {
  errorBox.textContent = msg;
  errorBox.hidden = false;
}

// Simple password show/hide toggle
togglePwd?.addEventListener('click', () => {
  const isPwd = passwordInput.type === 'password';
  passwordInput.type = isPwd ? 'text' : 'password';
  togglePwd.setAttribute('aria-label', isPwd ? 'Hide password' : 'Show password');
});

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorBox.hidden = true;
  pendingBox.hidden = true;

  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value.trim();
  if (!email || !password) {
    showError('Please enter email and password.');
    return;
  }

  try {
    // Primary: Firebase auth (real accounts)
    await signInWithEmailAndPassword(auth, email, password);
    // Only allow users that exist in operator directory
    const op = operators.find(o => o.email.toLowerCase() === email);
    if (!op) {
      showError('Your account is not registered as an operator.');
      return;
    }
    localStorage.setItem('operator_session', 'true');
    localStorage.setItem('operator_user_id', op?.id || '');
    window.location.href = './index.html';
    return;
  } catch (err) {
    // Fallback for demo/offline: match against mock operators
    const op = operators.find(o => o.email.toLowerCase() === email && o.password === password);
    if (op) {
      localStorage.setItem('operator_session', 'true');
      localStorage.setItem('operator_user_id', op.id);
      window.location.href = './index.html';
      return;
    }
    showError(err?.message || 'Invalid credentials.');
  }
});
