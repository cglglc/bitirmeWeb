// js/pages/blockCarrier.js
import { carriers } from '../../data/mockUsers.js';

export function initBlockCarrier(root) {
  root.innerHTML = `
    <div class="carrier-layout">
      <div class="carrier-list">
        <div class="list-header">
          <input id="carrierSearch" placeholder="Search by carrier name, plate, or ID..." />
        </div>
        <div class="table-wrap">
          <table class="carrier-table">
            <thead>
              <tr><th>Carrier</th><th>Plate</th><th>Status</th><th>Reason</th><th>Until</th><th>Actions</th></tr>
            </thead>
            <tbody id="carrierTbody"></tbody>
          </table>
        </div>
      </div>

      <aside class="control-panel">
        <div class="panel-inner">
          <h3>Block Carrier</h3>

          <div class="form-row"><label>Selected Carrier</label><div id="selectedCarrierName">—</div></div>

          <div class="form-row"><label>Reason</label>
            <select id="blockReason">
              <option>Safety Violation</option>
              <option>Documentation Missing</option>
              <option>Other</option>
            </select>
          </div>

          <div class="form-row"><label>Optional Message to Carrier</label>
            <textarea id="blockMessage" placeholder="Explain the reason..."></textarea>
          </div>

          <div class="form-row"><label>Duration</label>
            <select id="blockDuration">
              <option value="1">1 Day</option>
              <option value="7" selected>7 Days</option>
              <option value="30">30 Days</option>
              <option value="0">Indefinite</option>
            </select>
          </div>


          <div style="margin-top:12px;display:flex;gap:8px;">
            <button id="panelBlock" class="btn btn-primary">Block Carrier</button>
            <button id="panelUnblock" class="btn">Unblock</button>
          </div>
        </div>
      </aside>
    </div>
  `;

  const tbody = root.querySelector('#carrierTbody');
  const search = root.querySelector('#carrierSearch');
  const selectedName = root.querySelector('#selectedCarrierName');
  const reasonEl = root.querySelector('#blockReason');
  const messageEl = root.querySelector('#blockMessage');
  const durationEl = root.querySelector('#blockDuration');
  const panelBlock = root.querySelector('#panelBlock');
  const panelUnblock = root.querySelector('#panelUnblock');

  let selectedId = null;

  function formatDateISO(d) {
    const Y = d.getFullYear();
    const M = String(d.getMonth()+1).padStart(2,'0');
    const D = String(d.getDate()).padStart(2,'0');
    return `${Y}-${M}-${D}`;
  }

  function render() {
    const q = search.value.trim().toLowerCase();
    tbody.innerHTML = '';
    carriers.filter(c => {
      if (!q) return true;
      return c.name.toLowerCase().includes(q) || c.plate.toLowerCase().includes(q) || c.id.toLowerCase().includes(q);
    }).forEach(c => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${c.name}</td>
        <td>${c.plate}</td>
        <td><span class="badge ${c.status === 'Blocked' ? 'badge-blocked' : 'badge-active'}">${c.status}</span></td>
        <td>${c.reason || '-'}</td>
        <td>${c.until || '-'}</td>
        <td>
          ${c.status === 'Active' ? `<button data-id="${c.id}" class="btn btn-sm btn-block-action">Block</button>` : `<button data-id="${c.id}" class="btn btn-sm btn-unblock-action">Unblock</button>`}
          <button data-id="${c.id}" class="btn btn-sm btn-select">Select</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    // hook buttons
    root.querySelectorAll('.btn-block-action').forEach(b => b.addEventListener('click', (e) => {
      const id = e.target.dataset.id;
      selectCarrier(id);
    }));

    root.querySelectorAll('.btn-unblock-action').forEach(b => b.addEventListener('click', (e) => {
      const id = e.target.dataset.id;
      unblockCarrier(id);
    }));

    root.querySelectorAll('.btn-select').forEach(b => b.addEventListener('click', (e) => {
      const id = e.target.dataset.id;
      selectCarrier(id);
    }));
  }

  function selectCarrier(id) {
    selectedId = id;
    const c = carriers.find(x => x.id === id);
    if (!c) return;
    selectedName.textContent = `${c.name} (${c.plate})`;
    reasonEl.value = c.reason || 'Safety Violation';
    messageEl.value = '';
    durationEl.value = '7';
  }

  function unblockCarrier(id) {
    const c = carriers.find(x => x.id === id);
    if (!c) return;
    c.status = 'Active';
    c.reason = '';
    c.until = '';
    render();
  }

  panelBlock.addEventListener('click', () => {
    if (!selectedId) {
      alert('Select a carrier from the list first.');
      return;
    }
    const c = carriers.find(x => x.id === selectedId);
    if (!c) return;
    const reason = reasonEl.value;
    const dur = parseInt(durationEl.value, 10);
    let until = '';
    if (dur > 0) {
      const d = new Date();
      d.setDate(d.getDate() + dur);
      until = formatDateISO(d);
    }
    c.status = 'Blocked';
    c.reason = reason;
    c.until = until;
    // optional: use message and notify (not implemented) but kept on UI
    render();
  });

  panelUnblock.addEventListener('click', () => {
    if (!selectedId) {
      alert('Select a carrier to unblock.');
      return;
    }
    unblockCarrier(selectedId);
  });

  search.addEventListener('input', () => render());

  render();
}
