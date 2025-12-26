// js/pages/addStation.js
export function initAddStation(root) {
  root.innerHTML = `
    <div class="wizard">
      <div class="wizard-steps">
        <div class="step is-active" data-step="1"><div class="circle">1</div><div>Basics</div></div>
        <div class="step" data-step="2"><div class="circle">2</div><div>Operating Hours</div></div>
      </div>

      <div class="wizard-body">
        <div class="wizard-summary" id="wizardSummary">
          <strong>Basics</strong>
          <div id="summaryBasics">No data yet</div>
        </div>

        <div class="wizard-content" id="wizardContent">
          <form id="basicsForm">
            <h3>Add New Station</h3>
            <p>Enter basic station information</p>
            <div class="form-row">
              <label for="longitude">Longitude</label>
              <input id="longitude" name="longitude" type="text" inputmode="decimal" required />
            </div>
            <div class="form-row">
              <label for="latitude">Latitude</label>
              <input id="latitude" name="latitude" type="text" inputmode="decimal" required />
            </div>
            <div class="form-row">
              <label for="status">Status</label>
              <select id="status" name="status">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            <div class="form-row">
              <label for="type">Type</label>
              <input id="type" name="type" type="text" placeholder="e.g. EV, Gas, Hybrid" />
            </div>
            <div class="form-actions">
              <button type="button" id="basicsContinue" class="btn btn-primary">Continue</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;

  const wizard = { basics: null };
  const basicsForm = root.querySelector('#basicsForm');
  const basicsContinue = root.querySelector('#basicsContinue');
  const summaryBasics = root.querySelector('#summaryBasics');
  const wizardContent = root.querySelector('#wizardContent');
  const steps = root.querySelectorAll('.wizard-steps .step');

  function updateStepIndicator(activeStep){
    steps.forEach(s => s.classList.toggle('is-active', s.dataset.step === String(activeStep)));
  }

  function renderOperatingHours(){
    updateStepIndicator(2);
    wizardContent.innerHTML = `
      <h3>Operating Hours</h3>
      <p>Set Operating Hours</p>
      <div class="hours-grid">
        <div>
          <div class="hours-row"><strong>Mon</strong><input class="time-input" type="time" value="08:00"/> to <input class="time-input" type="time" value="18:00"/></div>
          <div class="hours-row"><strong>Tue</strong><input class="time-input" type="time" value="08:00"/> to <input class="time-input" type="time" value="18:00"/></div>
          <div class="hours-row"><strong>Wed</strong><input class="time-input" type="time" value="08:00"/> to <input class="time-input" type="time" value="18:00"/></div>
          <div class="hours-row"><strong>Thu</strong><input class="time-input" type="time" value="08:00"/> to <input class="time-input" type="time" value="18:00"/></div>
        </div>
        <div>
          <div class="hours-row"><strong>Fri</strong><input class="time-input" type="time" value="08:00"/> to <input class="time-input" type="time" value="18:00"/></div>
          <div class="hours-row"><strong>Sat</strong><input class="time-input" type="time" value="08:00"/> to <input class="time-input" type="time" value="18:00"/></div>
          <div class="hours-row"><strong>Sun</strong><input class="time-input" type="time" value="08:00"/> to <input class="time-input" type="time" value="18:00"/></div>
        </div>
      </div>
      <hr />
      <h4>Station Contact</h4>
      <div class="form-row"><label>Contact Name</label><input type="text" placeholder="Station Manager Name"/></div>
      <div class="form-row"><label>Phone Number</label><input type="tel" placeholder="+1 (555) 123-4567"/></div>
      <div style="display:flex;gap:8px;margin-top:12px;justify-content:space-between;">
        <div>
          <button id="hoursBack" class="btn">Back</button>
        </div>
        <div style="display:flex;gap:8px;">
          <button id="addStationBtn" class="btn btn-primary">Add Station</button>
        </div>
      </div>
    `;

    const hoursBack = wizardContent.querySelector('#hoursBack');
    const addStationBtn = wizardContent.querySelector('#addStationBtn');

    hoursBack.addEventListener('click', () => {
      updateStepIndicator(1);
      wizardContent.innerHTML = basicsForm.outerHTML;
      setTimeout(() => {
        const lon = root.querySelector('#longitude');
        const lat = root.querySelector('#latitude');
        const status = root.querySelector('#status');
        const type = root.querySelector('#type');
        if (wizard.basics){
          lon.value = wizard.basics.longitude || '';
          lat.value = wizard.basics.latitude || '';
          status.value = wizard.basics.status || 'active';
          type.value = wizard.basics.type || '';
        }
        const cont = root.querySelector('#basicsContinue');
        if (cont) cont.addEventListener('click', basicsContinueHandler);
      }, 20);
    });

    addStationBtn.addEventListener('click', () => {
      const timeInputs = Array.from(wizardContent.querySelectorAll('.time-input'));
      const times = [];
      for (let i = 0; i < timeInputs.length; i += 2) {
        const from = timeInputs[i]?.value || '';
        const to = timeInputs[i+1]?.value || '';
        times.push({ from, to });
      }

      const contactName = wizardContent.querySelector('input[type="text"][placeholder*="Manager"]')?.value || '';
      const phone = wizardContent.querySelector('input[type="tel"]')?.value || '';

      const station = Object.assign({}, wizard.basics, { operatingHours: times, contactName, phone });
      console.log('Final station to add:', station);
      alert('Station eklendi (konsola bakın).');
      // reset the wizard view
      initAddStation(root);
    });
  }

  function basicsContinueHandler(){
    const lon = root.querySelector('#longitude').value.trim();
    const lat = root.querySelector('#latitude').value.trim();
    const status = root.querySelector('#status').value;
    const type = root.querySelector('#type').value.trim();

    const lonNum = parseFloat(lon.replace(',', '.'));
    const latNum = parseFloat(lat.replace(',', '.'));

    if (Number.isNaN(lonNum) || Number.isNaN(latNum)) {
      alert('Lütfen geçerli bir longitude ve latitude girin.');
      return;
    }

    wizard.basics = { longitude: lonNum, latitude: latNum, status, type };
    summaryBasics.textContent = `Lon: ${lonNum}, Lat: ${latNum}, Status: ${status}, Type: ${type}`;
    renderOperatingHours();
  }

  if (basicsContinue) basicsContinue.addEventListener('click', basicsContinueHandler);
}
