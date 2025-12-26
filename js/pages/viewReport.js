// js/pages/viewReport.js
import { reportData } from '../../data/mockReports.js';

export function initViewReport(root) {
  root.innerHTML = `
    <div class="report-root">
      <div class="report-header">
        <h2>View Report</h2>
        <div class="report-controls">
          <select id="filterRange"><option>Last 7 Days</option><option>Last 30 Days</option></select>
          <select id="filterFacility"><option>All Facilities</option></select>
          <button id="exportCsv" class="btn">Export CSV</button>
        </div>
      </div>

      <div class="metric-cards">
        <div class="card"><div class="card-label">Total Incidents</div><div class="card-value" id="mTotal">-</div></div>
        <div class="card"><div class="card-label">Avg Resolution</div><div class="card-value" id="mAvg">-</div></div>
        <div class="card"><div class="card-label">SLA Breach</div><div class="card-value" id="mSla">-</div></div>
        <div class="card"><div class="card-label">Top Category</div><div class="card-value" id="mTop">-</div></div>
      </div>

      <div class="report-body">
        <div class="chart-panel">
          <div class="tabs"><button class="active">Overview</button><button>Stations</button><button>Carriers</button></div>
          <div class="chart-card">
            <canvas id="incidentsChart" width="800" height="240"></canvas>
          </div>

          <div class="table-panel">
            <h4>Top Stations by Incidents</h4>
            <table class="report-table"><thead><tr><th>Rank</th><th>Station</th><th>Code</th><th>Incidents</th><th>Change</th></tr></thead>
              <tbody id="topStationsTbody"></tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;

  // populate metric cards
  document.getElementById('mTotal').textContent = reportData.metrics.totalIncidents;
  document.getElementById('mAvg').textContent = reportData.metrics.avgResolution;
  document.getElementById('mSla').textContent = reportData.metrics.slaBreach;
  document.getElementById('mTop').textContent = reportData.metrics.topCategory;

  // render top stations table
  const tbody = root.querySelector('#topStationsTbody');
  tbody.innerHTML = reportData.topStations.map(s => `
    <tr>
      <td><span class="rank-pill">${s.rank}</span></td>
      <td>${s.name}</td>
      <td>${s.code}</td>
      <td>${s.incidents}</td>
      <td class="change ${s.change<0? 'neg':'pos'}">${s.change>0? '+'+s.change : s.change+'%'}</td>
    </tr>
  `).join('');

  // simple bar chart implementation
  const canvas = root.querySelector('#incidentsChart');
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    const padding = 36;
    const w = canvas.width - padding * 2;
    const h = canvas.height - padding * 2;
    const data = reportData.incidentsByDay;
    const max = Math.max(...data.map(d => d.value));
    const barW = w / data.length - 16;

    // background
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // draw bars
    data.forEach((d,i) => {
      const x = padding + i * (barW + 16) + 8;
      const barH = (d.value / max) * (h - 20);
      const y = padding + (h - barH);
      // shadow
      ctx.fillStyle = 'rgba(47,107,255,0.12)';
      ctx.fillRect(x, y, barW, barH);
      // main
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(x, y, barW, barH);
      // label
      ctx.fillStyle = '#111827';
      ctx.font = '12px sans-serif';
      ctx.fillText(d.day, x, padding + h + 14);
    });
  }

  // export CSV (simple topStations export)
  const exportBtn = root.querySelector('#exportCsv');
  exportBtn.addEventListener('click', () => {
    const rows = [['Rank','Station','Code','Incidents','Change'], ...reportData.topStations.map(s=>[s.rank,s.name,s.code,s.incidents,s.change])];
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'top-stations.csv'; a.click();
    URL.revokeObjectURL(url);
  });
}
