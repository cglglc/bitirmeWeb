// js/pages/manageUsers.js
import { searchUsers, updateUserRole, getUserById } from '../../data/mockAccounts.js';

export function initManageUsers(root) {
  root.innerHTML = `
    <div class="manage-users-root">
        <div class="manage-header">
        <h2>Manage Users</h2>
        <div style="display:flex;gap:8px;align-items:center;">
          <div class="search-row"><input id="userSearch" placeholder="Search users by name, email or id..." /></div>
          <div>
            <select id="roleFilter" style="padding:8px 10px;border-radius:8px;border:1px solid var(--border);background:#fff;">
              <option value="all">All Roles</option>
              <option value="carrier">carrier</option>
              <option value="operator">operator</option>
              <option value="admin">admin</option>
            </select>
          </div>
        </div>
      </div>

      <div class="manage-body">
        <div class="results-list">
          <div id="resultsCount" style="margin-bottom:8px;color:#6b7280"></div>
          <ul id="userResults"></ul>
          <div style="margin-top:8px;"><button id="loadMore" class="btn">Load more</button></div>
        </div>

        <aside class="manage-panel">
          <div class="panel-inner">
            <h3>User Details</h3>
            <div><strong id="uName">No user selected</strong></div>
            <div id="uEmail" style="color:#6b7280;margin-top:6px"></div>
            <div style="margin-top:12px"><label>Role</label>
              <select id="uRole"><option value="carrier">carrier</option><option value="operator">operator</option><option value="admin">admin</option></select>
            </div>
            <div style="margin-top:12px"><button id="saveRole" class="btn btn-primary">Save Role</button></div>
          </div>
        </aside>
      </div>
    </div>
  `;

  const searchEl = root.querySelector('#userSearch');
  const resultsEl = root.querySelector('#userResults');
  const resultsCount = root.querySelector('#resultsCount');
  const loadMore = root.querySelector('#loadMore');
  const roleFilter = root.querySelector('#roleFilter');
  const uName = root.querySelector('#uName');
  const uEmail = root.querySelector('#uEmail');
  const uRole = root.querySelector('#uRole');
  const saveRole = root.querySelector('#saveRole');

  let offset = 0;
  const limit = 10;
  let lastQuery = '';
  let selectedId = null;

  function renderResults(q, reset = false) {
    if (reset) { offset = 0; resultsEl.innerHTML = ''; selectedId = null; showDetails(null); }
    // decide roles
    const rf = roleFilter ? roleFilter.value : 'all';
    const roles = rf === 'all' ? ['carrier','operator','admin'] : [rf];
    const res = searchUsers(q, offset, limit, roles);
    resultsCount.textContent = `Showing ${Math.min(offset+res.results.length, res.total)} of ${res.total} results`;
    res.results.forEach(u => {
      const li = document.createElement('li');
      li.className = 'user-item';
      li.innerHTML = `<div class="user-card"><div><div style='font-weight:700'>${u.name}</div><div class='meta'>${u.email} • ${u.id}</div></div><div style="display:flex;align-items:center;gap:8px"><span class="role-badge role-${u.role}">${u.role}</span><select data-id="${u.id}" class="roleSelect"><option ${u.role==='carrier'?'selected':''} value="carrier">carrier</option><option ${u.role==='operator'?'selected':''} value="operator">operator</option><option ${u.role==='admin'?'selected':''} value="admin">admin</option></select></div></div>`;
      resultsEl.appendChild(li);
      // click to show details
      li.addEventListener('click', (e) => {
        e.stopPropagation();
        selectUser(u.id);
      });
    });

    // hook inline selects
    resultsEl.querySelectorAll('.roleSelect').forEach(s => {
      s.addEventListener('change', (e) => {
        const id = e.target.dataset.id;
        const val = e.target.value;
        // optimistic update
        const ok = updateUserRole(id, val);
        if (!ok) alert('Failed to update role');
        // if currently selected user changed, refresh details
        if (selectedId === id) showDetails(getUserById(id));
        if (ok) showToast('Role updated');
      });
    });

    offset += res.results.length;

    // show/hide load more
    if (offset >= res.total) loadMore.style.display = 'none'; else loadMore.style.display = 'inline-block';
  }

  function selectUser(id) {
    selectedId = id;
    const u = getUserById(id);
    showDetails(u);
  }

  function showDetails(u) {
    if (!u) {
      uName.textContent = 'No user selected';
      uEmail.textContent = '';
      uRole.value = 'carrier';
      saveRole.disabled = true;
      return;
    }
    uName.textContent = u.name;
    uEmail.textContent = u.email + ' • ' + u.id;
    uRole.value = u.role;
    saveRole.disabled = false;
  }

  saveRole.addEventListener('click', () => {
    if (!selectedId) return;
    const newRole = uRole.value;
    const ok = updateUserRole(selectedId, newRole);
    if (ok) alert('Role updated'); else alert('Update failed');
    // re-render results to reflect change
    renderResults(lastQuery, true);
  });

  loadMore.addEventListener('click', () => {
    renderResults(lastQuery, false);
  });

  searchEl.addEventListener('input', (e) => {
    const q = e.target.value;
    lastQuery = q;
    renderResults(q, true);
  });

  roleFilter.addEventListener('change', () => {
    lastQuery = searchEl.value;
    renderResults(lastQuery, true);
  });

  // toast helper
  function showToast(text, timeout = 2200) {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.style.position = 'fixed';
      container.style.right = '18px';
      container.style.bottom = '18px';
      container.style.zIndex = 9999;
      document.body.appendChild(container);
    }
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = text;
    t.style.background = 'linear-gradient(90deg,#111827,#3b82f6)';
    t.style.color = '#fff';
    t.style.padding = '8px 12px';
    t.style.borderRadius = '8px';
    t.style.marginTop = '8px';
    t.style.boxShadow = '0 8px 30px rgba(14,24,46,0.12)';
    container.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; setTimeout(()=>t.remove(),300); }, timeout);
  }

  // initial: load all users (carrier/operator/admin)
  renderResults('', true);
}
