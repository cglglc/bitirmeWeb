// js/pages/issueForm.js
import { issues } from '../../data/mockIssues.js';

export function initIssueForm(root, options = {}) {
  const mode = options.mode || 'view';
  const heroIcon = mode === 'solve' ? '✓' : '👁️';
  const heroTitle = mode === 'solve' ? '' : 'View Issue Form';
  const heroSub = mode === 'solve' ? 'Review solved issues' : 'Review, comment and resolve facility issues';

  root.innerHTML = `
    <div class="issue-root">
      <div class="page-hero">
        <div class="hero-inner">
          <span class="hero-icon">${heroIcon}</span>
          <div>
            <div class="hero-title">${heroTitle}</div>
            <div class="hero-sub">${heroSub}</div>
          </div>
        </div>
      </div>

      <div class="issue-body">
        <aside class="issue-left">
          <div class="search-row"><input id="issueSearch" placeholder="Search issues by title, station, reporter..." /></div>
          <div class="filters">
            <select id="filterStatus"><option value="all">All Statuses</option><option value="Open">Open</option><option value="Resolved">Resolved</option></select>
            <select id="filterPriority"><option value="all">All Priorities</option><option>High</option><option>Medium</option><option>Low</option></select>
          </div>
          <div class="issue-list">
            <ul id="issuesList"></ul>
          </div>
        </aside>

        <div class="issue-center">
          <div class="issues-table-wrap">
            <table class="issues-table"><thead><tr><th>Title</th><th>Station</th><th>Priority</th><th>Status</th><th>Created</th></tr></thead>
              <tbody id="issuesTbody"></tbody>
            </table>
          </div>
        </div>

        <aside class="issue-detail">
          <div class="detail-card" id="detailCard">
            <h3 id="detailTitle">Select an issue</h3>
            ${mode === 'solve' ? `<div class="mini-solved-card" style="margin-top:12px;padding:10px;border-radius:8px;background:#f6fbff;border:1px solid #e6f0ff;display:flex;align-items:center;justify-content:flex-start;gap:8px;"><span style="display:inline-block;width:28px;height:28px;border-radius:6px;background:#e6f7ef;color:#0b6b3a;display:flex;align-items:center;justify-content:center;font-weight:700;">✓</span><div style="font-weight:700;color:#0b1726">Solved Issues</div></div>` : ''}
            <div class="meta"><span id="detailStation"></span><span id="detailReporter"></span><span id="detailCreated"></span></div>
            <div class="detail-desc" id="detailDesc"></div>
            <div class="comments" id="commentsList"></div>
            <div class="comment-form">
              <textarea id="commentText" placeholder="Add a comment..."></textarea>
              <div class="actions"><button id="addComment" class="btn">Add Comment</button><button id="resolveIssue" class="btn btn-primary">Mark Resolved</button></div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  `;

  const listEl = root.querySelector('#issuesList');
  const tbody = root.querySelector('#issuesTbody');
  const search = root.querySelector('#issueSearch');
  const filterStatus = root.querySelector('#filterStatus');
  const filterPriority = root.querySelector('#filterPriority');
  const leftCol = root.querySelector('.issue-left');
  const centerCol = root.querySelector('.issue-center');
  const detailAside = root.querySelector('.issue-detail');
  const detailTitle = root.querySelector('#detailTitle');
  const detailStation = root.querySelector('#detailStation');
  const detailReporter = root.querySelector('#detailReporter');
  const detailCreated = root.querySelector('#detailCreated');
  const detailDesc = root.querySelector('#detailDesc');
  const commentsList = root.querySelector('#commentsList');
  const commentText = root.querySelector('#commentText');
  const addComment = root.querySelector('#addComment');
  const resolveIssue = root.querySelector('#resolveIssue');

  let selectedId = null;

  function clearSelection() {
    selectedId = null;
    if (detailAside) detailAside.style.display = 'none';
    if (leftCol) leftCol.style.display = '';
    if (centerCol) centerCol.style.display = '';
    if (addComment) addComment.style.display = 'inline-block';
    if (commentText) commentText.style.display = '';
    if (resolveIssue) resolveIssue.style.display = 'inline-block';
    detailTitle.textContent = 'Select an issue';
    detailStation.textContent = '';
    detailReporter.textContent = '';
    detailCreated.textContent = '';
    detailDesc.textContent = '';
    commentsList.innerHTML = '';
  }

  function renderList() {
    listEl.innerHTML = '';
    issues
      .filter(i => {
        if (mode === 'view' && i.status !== 'Open') return false;
        if (mode === 'solve' && i.status !== 'Resolved') return false;
        return true;
      })
      .forEach(i => {
      const li = document.createElement('li');
      li.className = 'issue-item ' + (i.status === 'Resolved' ? 'resolved' : 'open');
      li.innerHTML = `<div class="title">${i.title}</div><div class="meta">${i.station} • ${i.priority}</div>`;
      li.addEventListener('click', (e) => {
        e.preventDefault(); e.stopPropagation();
        if (selectedId === i.id) clearSelection(); else selectIssue(i.id);
      });
      listEl.appendChild(li);
      });
  }

  function renderTable() {
    const q = search.value.trim().toLowerCase();
    const st = filterStatus.value;
    const pr = filterPriority.value;
    tbody.innerHTML = '';
    issues.filter(i => {
      if (mode === 'view' && i.status !== 'Open') return false;
      if (mode === 'solve' && i.status !== 'Resolved') return false;
      if (st !== 'all' && i.status !== st) return false;
      if (pr !== 'all' && i.priority !== pr) return false;
      if (!q) return true;
      return i.title.toLowerCase().includes(q) || i.station.toLowerCase().includes(q) || i.reporter.toLowerCase().includes(q);
    }).forEach(i => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${i.title}</td><td>${i.station}</td><td>${i.priority}</td><td>${i.status}</td><td>${i.created}</td>`;
      tr.addEventListener('click', (e) => {
        e.preventDefault(); e.stopPropagation();
        if (selectedId === i.id) clearSelection(); else selectIssue(i.id);
      });
      tbody.appendChild(tr);
    });
  }

  function selectIssue(id) {
    selectedId = id;
    const i = issues.find(x => x.id === id);
    if (!i) return;
    detailTitle.textContent = i.title;
    detailStation.textContent = i.station;
    detailReporter.textContent = 'Reported by: ' + i.reporter;
    detailCreated.textContent = i.created;
    detailDesc.textContent = i.description;
    commentsList.innerHTML = i.comments.map(c => `<div class="comment"><strong>${c.by}</strong> <span class="time">${c.time}</span><div>${c.text}</div></div>`).join('');
    commentText.value = '';
    // show detail pane (always show on selection)
    if (detailAside) detailAside.style.display = 'block';
    // For solve mode: show lists, but hide action controls (read-only detail)
    if (mode === 'solve') {
      if (addComment) addComment.style.display = 'none';
      if (commentText) commentText.style.display = 'none';
      if (resolveIssue) resolveIssue.style.display = 'none';
    } else {
      // view mode: keep lists visible and show actions
      if (addComment) addComment.style.display = 'inline-block';
      if (commentText) commentText.style.display = '';
      if (resolveIssue) {
        resolveIssue.style.display = 'inline-block';
        resolveIssue.textContent = i.status === 'Resolved' ? 'Reopen Issue' : 'Mark Resolved';
      }
    }
  }

  addComment.addEventListener('click', () => {
    if (!selectedId) { alert('Select an issue first.'); return; }
    const txt = commentText.value.trim();
    if (!txt) return;
    const i = issues.find(x => x.id === selectedId);
    const now = new Date().toISOString().slice(0,16).replace('T',' ');
    i.comments.push({ by: 'Admin', text: txt, time: now });
    selectIssue(selectedId);
  });

  resolveIssue.addEventListener('click', () => {
    if (!selectedId) { alert('Select an issue first.'); return; }
    const i = issues.find(x => x.id === selectedId);
    if (!i) return;
    if (i.status === 'Resolved') i.status = 'Open'; else i.status = 'Resolved';
    renderList(); renderTable(); selectIssue(selectedId);
  });

  search.addEventListener('input', () => renderTable());
  filterStatus.addEventListener('change', () => renderTable());
  filterPriority.addEventListener('change', () => renderTable());

  // initial
  // enforce initial status filter based on mode
  if (mode === 'view') { filterStatus.value = 'Open'; filterStatus.disabled = true; }
  if (mode === 'solve') { filterStatus.value = 'Resolved'; filterStatus.disabled = true; }
  // start with no selection: hide detail pane
  if (detailAside) detailAside.style.display = 'none';
  renderList(); renderTable();
}
