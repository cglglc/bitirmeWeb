// js/pages/operator.js
import { auth, db } from '../firebaseClient.js';
import { signOut } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const nav = document.getElementById('operatorNav');
const viewRoot = document.getElementById('viewRoot');
const pageTitle = document.getElementById('pageTitle');
const logoutBtn = document.getElementById('logoutBtn');

const views = {
  'issue-create': () => `<div id="issueCreateRoot"></div>`,
  'facility-status': () => `<div id="facilityStatusRoot"></div>`,
  'queue-manager': () => `<div id="queueManagerRoot"></div>`
};

let cachedStations = [];
let cachedIssues = [];
let cachedFacility = null;

function formatNow() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
}

function setActive(viewKey) {
  nav.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.toggle('is-active', btn.dataset.view === viewKey);
  });

  const activeBtn = nav.querySelector(`.nav-item[data-view="${viewKey}"]`);
  pageTitle.textContent = activeBtn ? activeBtn.innerText.trim() : 'Operator';

  const render = views[viewKey] || (() => `<p>This view is not ready yet.</p>`);
  viewRoot.innerHTML = render();

  if (viewKey === 'issue-create') {
    const root = document.getElementById('issueCreateRoot');
    if (root) initIssueCreate(root);
  }
  if (viewKey === 'facility-status') {
    const root = document.getElementById('facilityStatusRoot');
    if (root) initFacilityStatus(root);
  }
  if (viewKey === 'queue-manager') {
    const root = document.getElementById('queueManagerRoot');
    if (root) initQueueManager(root);
  }
}

nav.addEventListener('click', (e) => {
  const btn = e.target.closest('.nav-item');
  if (!btn) return;
  setActive(btn.dataset.view);
});

logoutBtn.addEventListener('click', () => {
  signOut(auth).catch(() => {});
  localStorage.removeItem('admin_session');
  localStorage.removeItem('operator_session');
  window.location.href = '../login.html';
});

// default view
setActive('issue-create');

async function loadQueueStations(force = false) {
  if (cachedStations.length && !force) return cachedStations;
  try {
    const snap = await getDocs(collection(db, 'queues'));
    cachedStations = snap.docs.map(d => {
      const data = d.data() || {};
      return {
        id: d.id,
        name: data.name || 'Station',
        code: data.code || d.id,
        status: data.status || 'Operational',
        activeLane: data.activeLane || 'Lane A',
        eta: data.eta || '',
        lastCall: data.lastCall || '--',
        queue: Array.isArray(data.queue) ? data.queue : [],
        history: Array.isArray(data.history) ? data.history : []
      };
    });
    return cachedStations;
  } catch (err) {
    console.error('queues load error', err);
    cachedStations = [];
    return [];
  }
}

async function loadIssues(force = false) {
  if (cachedIssues.length && !force) return cachedIssues;
  try {
    const snap = await getDocs(collection(db, 'issues'));
    cachedIssues = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    // sort newest first if created exists
    cachedIssues.sort((a, b) => (b.created || '').localeCompare(a.created || ''));
    return cachedIssues;
  } catch (err) {
    console.error('issues load error', err);
    cachedIssues = [];
    return [];
  }
}

async function loadFacility(force = false) {
  if (cachedFacility && !force) return cachedFacility;
  try {
    const snap = await getDoc(doc(db, 'facility', 'default'));
    if (snap.exists()) {
      cachedFacility = snap.data();
      return cachedFacility;
    }
  } catch (err) {
    console.error('facility load error', err);
  }
  cachedFacility = {
    name: 'Facility',
    code: 'FAC-001',
    timezone: 'Local',
    contactName: 'Ops',
    phone: '-',
    weekdayStart: '--',
    weekdayEnd: '--',
    emergencyContact: '-',
    operationalStatus: 'Operational',
    opsNote: ''
  };
  return cachedFacility;
}

async function initIssueCreate(root) {
  root.innerHTML = `<div class="card" style="padding:20px;">Loading stations...</div>`;
  const stations = await loadQueueStations();
  const stationOptions = stations.map(s => `<option value="${s.code}">${s.name} (${s.code})</option>`).join('');
  await loadIssues();

  root.innerHTML = `
    <div class="operator-hero">
      <div class="hero-row">
        <span class="hero-icon">§Y'?</span>
        <div>
          <div class="hero-title">Create Issue</div>
          <p class="hero-sub">Create and send an issue. It will appear in admin panel after approval.</p>
        </div>
      </div>
    </div>

    <div class="issue-create-layout">
      <div class="issue-create-main">
        <div class="form-card">
          <h3>New Issue</h3>
          <div class="subtitle">Log operational problems here.</div>
          <form id="issueCreateForm" class="form-grid two">
            <div class="form-col full">
              <label for="issueTitle">Title</label>
              <input id="issueTitle" required placeholder="Scanner failure, power outage, etc." />
            </div>
            <div class="form-col">
              <label for="issueStation">Station</label>
              <select id="issueStation" required>${stationOptions}</select>
            </div>
            <div class="form-col">
              <label for="issuePriority">Priority</label>
              <select id="issuePriority" required>
                <option>High</option>
                <option selected>Medium</option>
                <option>Low</option>
              </select>
            </div>
            <div class="form-col">
              <label for="issueReporter">Reporter</label>
              <input id="issueReporter" value="Operator Desk" />
            </div>
            <div class="form-col full">
              <label for="issueDescription">Description</label>
              <textarea id="issueDescription" placeholder="Short description and observation note"></textarea>
            </div>
            <div class="form-col full form-foot">
              <div id="issueSuccess" class="pill" style="display:none;">Request saved</div>
              <button type="submit" class="btn btn-primary">Create Issue</button>
            </div>
          </form>
        </div>
      </div>
      <aside class="issue-create-side">
        <div class="summary-card">
          <h4>Quick tips</h4>
          <ul class="recent-issues">
            <li><strong>Priority</strong><div class="meta">High = outage; Medium = delay; Low = minor improvement</div></li>
            <li><strong>Station code</strong><div class="meta">Selecting the code matches admin reports</div></li>
          </ul>
        </div>
        <div class="summary-card">
          <h4>Last created</h4>
          <ul id="recentIssues" class="recent-issues"></ul>
        </div>
      </aside>
    </div>
  `;

  const form = root.querySelector('#issueCreateForm');
  const success = root.querySelector('#issueSuccess');
  const recent = root.querySelector('#recentIssues');
  const reporterInput = root.querySelector('#issueReporter');

  function renderRecent() {
    recent.innerHTML = '';
    cachedIssues.slice(0, 4).forEach(i => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${i.title}</strong><div class="meta">${i.station} · ${i.priority} · ${i.created || ''}</div>`;
      recent.appendChild(li);
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = root.querySelector('#issueTitle').value.trim();
    const station = root.querySelector('#issueStation').value;
    const priority = root.querySelector('#issuePriority').value;
    const reporter = reporterInput.value.trim() || 'Operator Desk';
    const description = root.querySelector('#issueDescription').value.trim();

    if (!title || !station) return;

    const newIssue = {
      title,
      station,
      reporter,
      created: formatNow(),
      priority,
      status: 'Open',
      description: description || 'Operator created issue.',
      comments: [{ by: reporter, text: 'Issue logged from operator panel.', time: formatNow() }]
    };

    try {
      const ref = await addDoc(collection(db, 'issues'), newIssue);
      cachedIssues.unshift({ id: ref.id, ...newIssue });
      success.style.display = 'inline-flex';
      form.reset();
      reporterInput.value = 'Operator Desk';
      renderRecent();
    } catch (err) {
      console.error('issue create error', err);
      success.style.display = 'none';
      alert('Could not create issue.');
    }
  });

  renderRecent();
}

async function initFacilityStatus(root) {
  root.innerHTML = `<div class="card" style="padding:20px;">Loading facility...</div>`;
  const facility = await loadFacility();
  let currentStatus = facility.operationalStatus || 'Operational';
  let noteValue = facility.opsNote || '';
  const history = [
    { status: currentStatus, by: 'System', at: formatNow(), note: noteValue }
  ];

  root.innerHTML = `
    <div class="operator-hero">
      <div class="hero-row">
        <span class="hero-icon">ƒst</span>
        <div>
          <div class="hero-title">Facility Status</div>
          <p class="hero-sub">Toggle operational state, add notes, and sync with admin view.</p>
        </div>
      </div>
    </div>

    <div class="status-grid">
      <div class="status-card">
        <div class="status-row">
          <div>
            <div class="pill">Facility: ${facility.name}</div>
            <div class="meta">Code: ${facility.code}</div>
          </div>
          <div id="statusPill" class="status-pill"></div>
        </div>
        <div class="form-grid two">
          <div class="form-col">
            <label for="statusSelect">Status</label>
            <select id="statusSelect">
              <option value="Operational">Operational</option>
              <option value="Paused">Paused</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
          <div class="form-col">
            <label for="nextCheck">Next check</label>
            <input id="nextCheck" placeholder="e.g. review in 30 min" />
          </div>
          <div class="form-col full note-area">
            <label for="opsNote">Operator note</label>
            <textarea id="opsNote" placeholder="Short note, risk or ETA"></textarea>
          </div>
        </div>
        <div class="bottom-actions" style="justify-content:flex-end; margin-top:12px;">
          <button id="applyStatus" class="btn btn-primary">Apply</button>
        </div>
        <div class="status-meta">
          <div class="meta-card"><div class="label">Timezone</div><div>${facility.timezone}</div></div>
          <div class="meta-card"><div class="label">Contact</div><div>${facility.contactName} · ${facility.phone}</div></div>
          <div class="meta-card"><div class="label">Weekday hours</div><div>${facility.weekdayStart} - ${facility.weekdayEnd}</div></div>
          <div class="meta-card"><div class="label">Emergency</div><div>${facility.emergencyContact}</div></div>
        </div>
      </div>

      <aside class="status-side">
        <div class="mini-card">
          <h4>Recent updates</h4>
          <ul id="statusHistory" class="history-list"></ul>
        </div>
        <div class="mini-card">
          <h4>Operating tips</h4>
          <div class="history-item">Paused = freeze queue intake and notify operators.</div>
          <div class="history-item">Maintenance = tech on site; consider stopping new carrier entries.</div>
        </div>
      </aside>
    </div>
  `;

  const statusPill = root.querySelector('#statusPill');
  const statusSelect = root.querySelector('#statusSelect');
  const noteInput = root.querySelector('#opsNote');
  const historyList = root.querySelector('#statusHistory');
  const applyBtn = root.querySelector('#applyStatus');

  statusSelect.value = currentStatus;
  noteInput.value = noteValue;

  function renderStatus() {
    statusPill.textContent = currentStatus;
    statusPill.className = 'status-pill';
    if (currentStatus === 'Operational') statusPill.classList.add('operational');
    else if (currentStatus === 'Paused') statusPill.classList.add('paused');
    else statusPill.classList.add('maintenance');
  }

  function renderHistory() {
    historyList.innerHTML = '';
    history.slice(0, 6).forEach(item => {
      const li = document.createElement('li');
      li.className = 'history-item';
      li.innerHTML = `<strong>${item.status}</strong><div class="meta">${item.at} · ${item.by}</div><div>${item.note || ''}</div>`;
      historyList.appendChild(li);
    });
  }

  applyBtn.addEventListener('click', async () => {
    currentStatus = statusSelect.value;
    noteValue = noteInput.value.trim();
    history.unshift({ status: currentStatus, by: 'Operator', at: formatNow(), note: noteValue });
    renderStatus();
    renderHistory();
    try {
      await setDoc(doc(db, 'facility', 'default'), {
        ...facility,
        operationalStatus: currentStatus,
        opsNote: noteValue,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.error('facility update error', err);
      alert('Could not update facility status.');
    }
  });

  renderStatus();
  renderHistory();
}

async function initQueueManager(root) {
  root.innerHTML = `<div class="card" style="padding:20px;">Loading queues...</div>`;
  cachedStations = await loadQueueStations();
  let selectedStation = cachedStations[0] ? cachedStations[0].id : null;

  root.innerHTML = `
    <div class="operator-hero">
      <div class="hero-row">
        <span class="hero-icon">§Y"S</span>
        <div>
          <div class="hero-title">Queue Manager</div>
          <p class="hero-sub">View per-station queues, add carriers, mark no-show or complete.</p>
        </div>
      </div>
    </div>

    <div class="queue-layout">
      <aside class="queue-stations">
        <div class="search-row"><input id="stationFilter" placeholder="Station, code" /></div>
        <ul id="stationList" class="station-list"></ul>
      </aside>
      <div class="queue-detail" id="queueDetail"></div>
    </div>
  `;

  const stationList = root.querySelector('#stationList');
  const stationFilter = root.querySelector('#stationFilter');
  const detail = root.querySelector('#queueDetail');

  function renderStations() {
    const term = stationFilter.value.trim().toLowerCase();
    stationList.innerHTML = '';
    cachedStations
      .filter(st => !term || st.name.toLowerCase().includes(term) || st.code.toLowerCase().includes(term))
      .forEach(st => {
        const li = document.createElement('li');
        li.innerHTML = `
          <div class="station-card ${selectedStation === st.id ? 'active' : ''}" data-id="${st.id}">
            <div class="title">${st.name}</div>
            <div class="meta">
              <span>${st.code}</span>
              <span class="badge ${st.status === 'Operational' ? 'badge-green' : 'badge-amber'}">${st.status}</span>
            </div>
            <div class="meta">
              <span>Queue: ${st.queue.length}</span>
              <span>${st.lastCall || '--'}</span>
            </div>
          </div>
        `;
        li.addEventListener('click', () => {
          selectedStation = st.id;
          renderStations();
          renderDetail();
        });
        stationList.appendChild(li);
      });
  }

  async function persistStation(station) {
    try {
      await updateDoc(doc(db, 'queues', station.id), {
        queue: station.queue,
        history: station.history || [],
        lastCall: formatNow(),
        status: station.status,
        activeLane: station.activeLane
      });
    } catch (err) {
      console.error('queue update error', err);
      alert('Could not update queue.');
    }
  }

  function renderDetail() {
    if (!selectedStation) {
      detail.innerHTML = `<p>Select a station.</p>`;
      return;
    }
    const st = cachedStations.find(s => s.id === selectedStation);
    if (!st) return;

    const avgWait = `${Math.max(3, st.queue.length * 4)} min`;

    detail.innerHTML = `
      <div class="queue-head">
        <h3>${st.name}</h3>
        <span class="status-pill ${st.status === 'Operational' ? 'operational' : 'paused'}">${st.status}</span>
      </div>
      <div class="queue-metrics">
        <div class="metric"><div class="label">Queue size</div><div class="value">${st.queue.length}</div></div>
        <div class="metric"><div class="label">Avg wait</div><div class="value">${avgWait}</div></div>
        <div class="metric"><div class="label">Active lane</div><div class="value">${st.activeLane || '-'}</div></div>
      </div>
      <div class="add-carrier">
        <input id="carrierName" placeholder="Carrier name" />
        <input id="carrierTruck" placeholder="Truck plate" />
        <input id="carrierTrailer" placeholder="Trailer ID" />
        <input id="carrierCommodity" placeholder="Commodity" />
        <input id="carrierEta" placeholder="ETA (min)" />
      </div>
      <div class="add-actions">
        <button id="addCarrierBtn" class="btn btn-primary">Add to queue</button>
        <span class="meta">Use for manual entries or walk-ins.</span>
      </div>

      <table class="queue-table">
        <thead><tr><th>#</th><th>Carrier</th><th>Truck</th><th>Commodity</th><th>ETA</th><th>Actions</th></tr></thead>
        <tbody>
          ${st.queue.map((q, idx) => `
            <tr data-id="${q.id}">
              <td>${idx + 1}</td>
              <td>${q.carrier}</td>
              <td>${q.truck}</td>
              <td>${q.commodity || ''}</td>
              <td>${q.eta || ''}</td>
              <td>
                <div class="queue-actions">
                  <button class="action-btn danger" data-action="no-show" data-id="${q.id}">No-show</button>
                  <button class="action-btn primary" data-action="complete" data-id="${q.id}">Complete</button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div style="margin-top:12px;">
        <div class="pill">Last call: ${st.lastCall || '--'}</div>
      </div>

      <div style="margin-top:12px;">
        <h4>Recent actions</h4>
        <div id="queueHistory" class="history-list">
          ${(st.history || []).slice(0,5).map(h => `
            <div class="history-item">
              <strong>${h.carrier}</strong>
              <div class="meta">${h.at || ''} · ${h.action}</div>
              <div>${h.truck || ''}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    const addBtn = detail.querySelector('#addCarrierBtn');
    addBtn.addEventListener('click', async () => {
      const carrier = detail.querySelector('#carrierName').value.trim();
      const truck = detail.querySelector('#carrierTruck').value.trim();
      const trailer = detail.querySelector('#carrierTrailer').value.trim();
      const commodity = detail.querySelector('#carrierCommodity').value.trim();
      const eta = detail.querySelector('#carrierEta').value.trim() || '~8 min';
      if (!carrier || !truck) return;
      st.queue.push({ id: `Q-${Date.now()}`, carrier, truck, trailer, commodity, eta, status: 'waiting' });
      await persistStation(st);
      renderStations();
      renderDetail();
    });

    detail.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const action = btn.dataset.action;
        const id = btn.dataset.id;
        const idx = st.queue.findIndex(q => q.id === id);
        if (idx === -1) return;
        const [entry] = st.queue.splice(idx, 1);
        st.history = st.history || [];
        st.history.unshift({ carrier: entry.carrier, action, at: formatNow(), truck: entry.truck });
        await persistStation(st);
        renderStations();
        renderDetail();
      });
    });
  }

  stationFilter.addEventListener('input', renderStations);

  renderStations();
  renderDetail();
}
