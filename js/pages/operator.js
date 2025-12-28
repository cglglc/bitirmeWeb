// js/pages/operator.js
import { queueStations } from '../../data/mockQueues.js';
import { issues as mockIssues } from '../../data/mockIssues.js';
import { facility as mockFacility } from '../../data/mockFacility.js';
import { operators } from '../../data/mockOperators.js';
import { renderIssueCreateView } from './operatorIssue.js';
import { renderFacilityStatusView } from './operatorFacilityStatus.js';
import { renderQueueManagerView } from './operatorQueueManager.js';

const nav = document.getElementById('operatorNav');
const viewRoot = document.getElementById('viewRoot');
const pageTitle = document.getElementById('pageTitle');
const logoutBtn = document.getElementById('logoutBtn');

let currentViewKey = 'issue-create';

let cachedStations = [];
let cachedIssues = [];
let cachedFacility = null;
let currentOperatorId = localStorage.getItem('operator_user_id') || null;
const hasSession = localStorage.getItem('operator_session') === 'true';

// Simple timestamp helper used across views
function formatNow() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
}

function getCurrentOperator() {
  return operators.find(op => op.id === currentOperatorId) || null;
}

function setCurrentOperator(id) {
  // Switch active operator and clear caches
  const exists = operators.some(op => op.id === id);
  if (!exists) return;
  currentOperatorId = id;
  localStorage.setItem('operator_user_id', id);
  cachedStations = [];
  cachedIssues = [];
  cachedFacility = null;
  setActive(currentViewKey);
}

function getAssignedStations() {
  const op = getCurrentOperator();
  if (!op || !op.terminalId) return queueStations;
  const filtered = queueStations.filter(st => st.id === op.terminalId || st.code === op.terminalId);
  return filtered.length ? filtered : queueStations;
}

// Enforce operator session and role before showing the panel
if (!hasSession || !getCurrentOperator()) {
  window.location.href = './login.html';
}

function setActive(viewKey) {
  currentViewKey = viewKey;
  // Highlight selected nav item
  nav.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.toggle('is-active', btn.dataset.view === viewKey);
  });

  const activeBtn = nav.querySelector(`.nav-item[data-view="${viewKey}"]`);
  pageTitle.textContent = activeBtn ? activeBtn.innerText.trim() : 'Operator';

  viewRoot.innerHTML = '';
  renderProfileBar();

  if (viewKey === 'issue-create') {
    // Render issue creation view
    renderIssueCreateView(viewRoot, {
      loadQueueStations,
      loadIssues,
      formatNow,
      getCachedIssues: () => cachedIssues,
      setCachedIssues: (next) => { cachedIssues = next; }
    });
  } else if (viewKey === 'facility-status') {
    // Render facility status controls
    renderFacilityStatusView(viewRoot, {
      loadFacility,
      formatNow,
      getCachedFacility: () => cachedFacility,
      setCachedFacility: (next) => { cachedFacility = next; }
    });
  } else if (viewKey === 'queue-manager') {
    // Render queue manager
    renderQueueManagerView(viewRoot, {
      loadQueueStations,
      formatNow,
      getCachedStations: () => cachedStations,
      setCachedStations: (next) => { cachedStations = next; }
    });
  } else {
    viewRoot.innerHTML = `<p>This view is not ready yet.</p>`;
  }
}

function renderProfileBar() {
  const header = document.querySelector('.content-header');
  if (!header) return;
  let info = document.getElementById('operatorProfile');
  if (!info) {
    info = document.createElement('div');
    info.id = 'operatorProfile';
    info.style.display = 'flex';
    info.style.alignItems = 'center';
    info.style.gap = '16px';
    info.style.marginTop = '8px';
    info.style.padding = '12px 16px';
    info.style.border = '1px solid var(--border, #e5e7eb)';
    info.style.borderRadius = '14px';
    info.style.background = 'linear-gradient(135deg, #f8fafc, #eef2ff)';
    info.style.boxShadow = '0 6px 22px rgba(99,102,241,0.08)';
    header.appendChild(info);
  }

  const op = getCurrentOperator();
  const initials = (op?.name || 'O').split(' ').map(p => p[0]).join('').slice(0,2).toUpperCase();
  const displayName = op?.name || 'Operator';
  info.innerHTML = `
    <div style="flex:1; display:flex; align-items:flex-start; gap:10px;">
      <div style="width:48px;height:48px;border-radius:14px;background:linear-gradient(135deg,#6366f1,#2563eb);color:#fff;display:grid;place-items:center;font-weight:800;font-size:16px;box-shadow:0 8px 18px rgba(79,70,229,0.25);">${initials}</div>
      <div style="display:flex;flex-direction:column;gap:6px;">
        <div style="font-weight:800;font-size:16px;color:#0f172a;">Hello, ${displayName}</div>
      </div>
    </div>
  `;
}

nav.addEventListener('click', (e) => {
  const btn = e.target.closest('.nav-item');
  if (!btn) return;
  setActive(btn.dataset.view);
});

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('admin_session');
  localStorage.removeItem('operator_session');
  localStorage.removeItem('operator_user_id');
  window.location.href = './login.html';
});

// default view
setActive('issue-create');

async function loadQueueStations(force = false) {
  if (cachedStations.length && !force) return cachedStations;
  cachedStations = JSON.parse(JSON.stringify(getAssignedStations()));
  return cachedStations;
}

async function loadIssues(force = false) {
  if (cachedIssues.length && !force) return cachedIssues;
  const allowedStations = getAssignedStations().map(s => s.code);
  cachedIssues = JSON.parse(JSON.stringify(mockIssues))
    .filter(i => !allowedStations.length || allowedStations.includes(i.station));
  cachedIssues.sort((a, b) => (b.created || '').localeCompare(a.created || ''));
  return cachedIssues;
}

async function loadFacility(force = false) {
  if (cachedFacility && !force) return cachedFacility;
  cachedFacility = { ...mockFacility };
  return cachedFacility;
}

// expose setters for other modules if needed
export const operatorState = {
  setCurrentOperator,
  getCurrentOperator,
  getAssignedStations,
  formatNow
};
