// js/pages/facilityStats.js
import { facilityStats } from '../../data/mockFacilityStats.js';

export function initFacilityStats(root) {
  root.innerHTML = `
    <div class="stats-root">
      <div class="stats-header">
        <h2>View Facility Statistics</h2>
        <p>Real-time analytics and performance metrics</p>
        <div class="stats-controls">
          <select id="facilitySelect"><option>All Facilities</option></select>
          <div class="range-buttons">
            <button class="range-btn active" data-range="today">Today</button>
            <button class="range-btn" data-range="7">7 Days</button>
            <button class="range-btn" data-range="30">30 Days</button>
          </div>
        </div>
      </div>

      <div class="metrics-and-body">
        <div class="metrics-cards">
          <div class="stat-card"><div class="label">Throughput Today</div><div class="value" id="mThroughput">-</div><div class="delta">+12%</div></div>
          <div class="stat-card"><div class="label">Avg Wait Time</div><div class="value" id="mAvgWait">-</div><div class="delta">-5%</div></div>
          <div class="stat-card"><div class="label">Longest Wait</div><div class="value" id="mLongest">-</div><div class="badge">Peak</div></div>
          <div class="stat-card"><div class="label">ETA Accuracy</div><div class="value" id="mEta">-</div><div class="tag">On target</div></div>
          <div class="stat-card"><div class="label">Utilization</div><div class="value" id="mUtil">-</div><div class="tag alt">High</div></div>
        </div>

        <div class="stats-body">
          <div class="main-panel">
            <div class="chart-card"><canvas id="throughputChart" width="700" height="180"></canvas></div>
            <div class="bar-card"><h4>Average Wait by Station</h4><canvas id="waitChart" width="700" height="160"></canvas></div>
          </div>

          <aside class="right-panel">
            <div class="mini-card"><h4>Live Station Status</h4>
              <div class="status-row ok">Operational <span id="liveOk">0</span></div>
              <div class="status-row down">Down <span id="liveDown">0</span></div>
            </div>
            <div class="mini-card"><h4>Facility Map</h4><div class="map-placeholder">Map visualization</div></div>
          </aside>
        </div>
      </div>
    </div>
  `;

  // populate metric cards
  document.getElementById('mThroughput').textContent = facilityStats.metrics.throughputToday;
  document.getElementById('mAvgWait').textContent = facilityStats.metrics.avgWait;
  document.getElementById('mLongest').textContent = facilityStats.metrics.longestWait;
  document.getElementById('mEta').textContent = facilityStats.metrics.etaAccuracy;
  document.getElementById('mUtil').textContent = facilityStats.metrics.utilization;

  document.getElementById('liveOk').textContent = facilityStats.liveStationStatus.operational;
  document.getElementById('liveDown').textContent = facilityStats.liveStationStatus.down;

  // draw throughput line chart (build line path first, then draw points)
  const tCanvas = root.querySelector('#throughputChart');
  if (tCanvas && tCanvas.getContext) {
    const ctx = tCanvas.getContext('2d');
    ctx.clearRect(0,0,tCanvas.width,tCanvas.height);
    const data = facilityStats.throughputOverTime;
    const padding = 36;
    const w = tCanvas.width - padding*2;
    const h = tCanvas.height - padding*2;
    const max = Math.max(...data.map(d => d.value));

    // draw line path
    ctx.beginPath();
    data.forEach((d,i) => {
      const x = padding + (i/(data.length-1))*w;
      const y = padding + (1 - (d.value/max)) * h;
      if (i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    });
    ctx.strokeStyle = '#2563eb'; ctx.lineWidth = 2; ctx.stroke();

    // draw points separately so we don't reset the main path
    data.forEach((d,i) => {
      const x = padding + (i/(data.length-1))*w;
      const y = padding + (1 - (d.value/max)) * h;
      ctx.beginPath();
      ctx.fillStyle = '#2563eb'; ctx.arc(x,y,3,0,Math.PI*2); ctx.fill();
    });
  }

  // draw wait bar chart
  const wCanvas = root.querySelector('#waitChart');
  if (wCanvas && wCanvas.getContext) {
    const ctx = wCanvas.getContext('2d');
    ctx.clearRect(0,0,wCanvas.width,wCanvas.height);
    const data = facilityStats.avgWaitByStation;
    const padding = 36; const w = wCanvas.width - padding*2; const h = wCanvas.height - padding*2;
    const max = Math.max(...data.map(d=>d.value));
    const barW = w / data.length - 24;
    data.forEach((d,i)=>{
      const x = padding + i*(barW+24)+12;
      const barH = (d.value/max)*(h-10);
      const y = padding + (h - barH);
      ctx.fillStyle = '#2563eb'; ctx.fillRect(x,y,barW,barH);
      ctx.fillStyle='#111827'; ctx.font='12px sans-serif'; ctx.fillText(d.code, x, padding+h+14);
    });
  }

  // range buttons simple handler to toggle active
  root.querySelectorAll('.range-btn').forEach(btn=>btn.addEventListener('click', (e)=>{
    root.querySelectorAll('.range-btn').forEach(b=>b.classList.remove('active'));
    e.target.classList.add('active');
  }));
}
