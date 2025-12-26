// js/pages/removeStation.js
import { stations } from '../../data/mockStations.js';

export function initRemoveStation(root) {
  root.innerHTML = `
    <div class="remove-layout">
      <div class="remove-list">
        <div class="list-header">
          <input id="stationSearch" placeholder="Search stations by name or code..." />
        </div>
        <div class="table-wrap">
          <table class="station-table">
            <thead>
              <tr><th><input id="selectAll" type="checkbox"/></th><th>Station Name</th><th>Code</th><th>Status</th><th>Queues</th><th>Last Activity</th></tr>
            </thead>
            <tbody id="stationTbody"></tbody>
          </table>
        </div>
      </div>

      <aside class="summary-panel">
        <div class="panel-inner">
          <h3>Removal Summary</h3>
          <div class="summary-row"><strong>Stations Selected</strong><div id="summaryCount">0</div></div>
          <div class="summary-row"><strong>Active Queues</strong><div id="summaryQueues">0</div></div>
          <div class="summary-selected" id="summarySelectedList"></div>
          <div style="margin-top:12px;">
            <button id="removeBtn" class="btn btn-danger">Remove Selected Stations</button>
          </div>
        </div>
      </aside>
    </div>

    <div id="confirmModal" class="modal hidden">
      <div class="modal-dialog">
        <div class="modal-body">
          <div class="modal-icon">⚠️</div>
          <h4>Confirm Station Removal</h4>
          <p id="modalText">You are about to remove X stations. This will close all active queues.</p>

          <div class="form-row"><label>Reason for Removal</label>
            <select id="removeReason">
              <option>Decommissioning</option>
              <option>Permanent Closure</option>
              <option>Other</option>
            </select>
          </div>

          <div class="modal-actions">
            <button id="modalCancel" class="btn">Cancel</button>
            <button id="modalConfirm" class="btn btn-danger">Confirm Removal</button>
          </div>
        </div>
      </div>
    </div>
  `;

  const tbody = root.querySelector('#stationTbody');
  const search = root.querySelector('#stationSearch');
  const selectAll = root.querySelector('#selectAll');
  const summaryCount = root.querySelector('#summaryCount');
  const summaryQueues = root.querySelector('#summaryQueues');
  const summarySelectedList = root.querySelector('#summarySelectedList');
  const removeBtn = root.querySelector('#removeBtn');
  const modal = root.querySelector('#confirmModal');
  const modalText = root.querySelector('#modalText');
  const modalCancel = root.querySelector('#modalCancel');
  const modalConfirm = root.querySelector('#modalConfirm');

  // maintain selection in-memory
  const selected = new Set();

  function render() {
    const q = search.value.trim().toLowerCase();
    tbody.innerHTML = '';
    stations.filter(s => {
      if (!q) return true;
      return s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q);
    }).forEach(s => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><input data-id="${s.id}" class="row-select" type="checkbox" ${selected.has(s.id) ? 'checked' : ''} /></td>
        <td>${s.name}</td>
        <td>${s.code}</td>
        <td>${s.status}</td>
        <td>${s.queues}</td>
        <td>${s.lastActivity}</td>
      `;
      tbody.appendChild(tr);
    });

    // hook row checkboxes
    root.querySelectorAll('.row-select').forEach(cb => cb.addEventListener('change', (e) => {
      const id = e.target.dataset.id;
      if (e.target.checked) selected.add(id); else selected.delete(id);
      updateSummary();
    }));

    updateSummary();
  }

  function updateSummary() {
    const selectedList = Array.from(selected);
    summaryCount.textContent = selectedList.length;
    const queuesSum = selectedList.reduce((acc, id) => {
      const s = stations.find(x => x.id === id);
      return acc + (s ? s.queues : 0);
    }, 0);
    summaryQueues.textContent = queuesSum;
    summarySelectedList.innerHTML = selectedList.map(id => {
      const s = stations.find(x => x.id === id);
      return s ? `<div class="summary-item">${s.name} <span class="code">${s.code}</span></div>` : '';
    }).join('');
  }

  selectAll.addEventListener('change', (e) => {
    if (e.target.checked) {
      stations.forEach(s => selected.add(s.id));
    } else {
      selected.clear();
    }
    render();
  });

  removeBtn.addEventListener('click', () => {
    const count = selected.size;
    if (count === 0) { alert('Select at least one station to remove.'); return; }
    modalText.textContent = `You are about to remove ${count} station${count>1?'s':''}. This will close all active queues.`;
    modal.classList.remove('hidden');
  });

  modalCancel.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  modalConfirm.addEventListener('click', () => {
    // remove selected stations from mock array (in-memory)
    const ids = Array.from(selected);
    for (const id of ids) {
      const idx = stations.findIndex(s => s.id === id);
      if (idx !== -1) stations.splice(idx, 1);
      selected.delete(id);
    }
    modal.classList.add('hidden');
    render();
  });

  search.addEventListener('input', () => render());

  render();
}
