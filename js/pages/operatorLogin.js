// js/pages/operatorLogin.js
import { auth, db } from '../firebaseClient.js';
import { signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

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

togglePwd?.addEventListener('click', () => {
  const isPwd = passwordInput.type === 'password';
  passwordInput.type = isPwd ? 'text' : 'password';
  togglePwd.setAttribute('aria-label', isPwd ? 'Hide password' : 'Show password');
});

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorBox.hidden = true;
  pendingBox.hidden = true;

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  if (!email || !password) {
    showError('Please enter email and password.');
    return;
  }

  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const reqSnap = await getDoc(doc(db, 'operatorRequests', cred.user.uid));
    if (!reqSnap.exists() || reqSnap.data().status !== 'approved') {
      await signOut(auth);
      pendingBox.hidden = false;
      return;
    }
    localStorage.setItem('operator_session', 'true');
    window.location.href = './index.html';
  } catch (err) {
    showError(err?.message || 'Invalid credentials.');
  }
});
