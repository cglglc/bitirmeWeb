// js/pages/operatorFacilityStatus.js
export async function renderFacilityStatusView(root, deps) {
  const {
    loadFacility,
    formatNow,
    getCachedFacility = () => null,
    setCachedFacility = () => {}
  } = deps || {};

  root.innerHTML = `<div class="card" style="padding:20px;">Loading facility...</div>`;
  const facility = await loadFacility?.() || getCachedFacility() || {};
  let currentStatus = facility.operationalStatus || 'Operational';
  let noteValue = facility.opsNote || '';
  const history = [
    { status: currentStatus, by: 'System', at: formatNow(), note: noteValue }
  ];

  root.innerHTML = `
    <div class="operator-hero">
      <div class="hero-row">
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
          <div class="meta-card"><div class="label">Contact</div><div>${facility.contactName} ¶ôÇÐ ${facility.phone}</div></div>
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
      li.innerHTML = `<strong>${item.status}</strong><div class="meta">${item.at} ¶ôÇÐ ${item.by}</div><div>${item.note || ''}</div>`;
      historyList.appendChild(li);
    });
  }

  applyBtn.addEventListener('click', () => {
    // Update in-memory facility state and prepend history item
    currentStatus = statusSelect.value;
    noteValue = noteInput.value.trim();
    history.unshift({ status: currentStatus, by: 'Operator', at: formatNow(), note: noteValue });
    renderStatus();
    renderHistory();
    setCachedFacility({
      ...facility,
      operationalStatus: currentStatus,
      opsNote: noteValue,
      updatedAt: formatNow()
    });
  });

  renderStatus();
  renderHistory();
}
