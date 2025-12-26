// js/pages/facilityEdit.js
import { facility } from '../../data/mockFacility.js';

export function initFacilityEdit(root) {
  root.innerHTML = `
    <div class="facility-root">
      <h2>Edit Facility Info</h2>
      <p>Update facility details and configuration</p>

      <div class="form-card">
        <div class="card-title"><span class="card-icon"><!-- pin -->
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C8.686 2 6 4.686 6 8c0 5.25 6 12 6 12s6-6.75 6-12c0-3.314-2.686-6-6-6z" stroke="#2563eb" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </span>General Information</div>
        <div class="form-grid">
          <div class="form-col"><label>Facility Name *</label><input id="facName" /></div>
          <div class="form-col"><label>Facility Code *</label><input id="facCode" /></div>
          <div class="form-col full"><label>Address</label><input id="facAddress" /></div>
          <div class="form-col full"><label>Time Zone</label><select id="facTimezone"><option>Pacific Time (PST/PDT)</option></select></div>
        </div>
      </div>

      <div class="form-card">
        <div class="card-title"><span class="card-icon"><!-- phone -->
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 3 5.18 2 2 0 0 1 5 3h3a2 2 0 0 1 2 1.72c.12 1.21.37 2.39.73 3.5a2 2 0 0 1-.45 2.11L9.91 12.09a16 16 0 0 0 4 4l1.76-1.76a2 2 0 0 1 2.11-.45c1.11.36 2.29.61 3.5.73A2 2 0 0 1 22 16.92z" stroke="#2563eb" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </span>Contact Information</div>
        <div class="form-grid">
          <div class="form-col"><label>Primary Contact Name</label><input id="facContact" /></div>
          <div class="form-col"><label>Phone Number</label><input id="facPhone" /></div>
          <div class="form-col"><label>Email Address</label><input id="facEmail" /></div>
          <div class="form-col"><label>Emergency Contact</label><input id="facEmergency" /></div>
        </div>
      </div>

      <div class="form-card">
        <div class="card-title"><span class="card-icon"><!-- clock -->
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="#2563eb" stroke-width="1.2"/><path d="M12 6v6l4 2" stroke="#2563eb" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </span>Operating Hours</div>
        <div class="form-grid">
          <div class="form-col"><label>Weekday Start</label><input id="facStart" type="time" /></div>
          <div class="form-col"><label>Weekday End</label><input id="facEnd" type="time" /></div>
        </div>
      </div>

      <div class="bottom-actions">
        <button id="discardBtn" class="btn">Discard Changes</button>
        <button id="saveBtn" class="btn btn-primary">Save Changes</button>
      </div>
    </div>
  `;

  // populate
  root.querySelector('#facName').value = facility.name;
  root.querySelector('#facCode').value = facility.code;
  root.querySelector('#facAddress').value = facility.address;
  root.querySelector('#facContact').value = facility.contactName;
  root.querySelector('#facPhone').value = facility.phone;
  root.querySelector('#facEmail').value = facility.email;
  root.querySelector('#facEmergency').value = facility.emergencyContact;
  root.querySelector('#facStart').value = facility.weekdayStart;
  root.querySelector('#facEnd').value = facility.weekdayEnd;

  const saveBtn = root.querySelector('#saveBtn');
  const discardBtn = root.querySelector('#discardBtn');

  saveBtn.addEventListener('click', () => {
    // update mock facility in-memory
    facility.name = root.querySelector('#facName').value;
    facility.code = root.querySelector('#facCode').value;
    facility.address = root.querySelector('#facAddress').value;
    facility.contactName = root.querySelector('#facContact').value;
    facility.phone = root.querySelector('#facPhone').value;
    facility.email = root.querySelector('#facEmail').value;
    facility.emergencyContact = root.querySelector('#facEmergency').value;
    facility.weekdayStart = root.querySelector('#facStart').value;
    facility.weekdayEnd = root.querySelector('#facEnd').value;
    alert('Facility saved (mock).');
  });

  discardBtn.addEventListener('click', () => {
    // reset fields to mock values
    root.querySelector('#facName').value = facility.name;
    root.querySelector('#facCode').value = facility.code;
    root.querySelector('#facAddress').value = facility.address;
    root.querySelector('#facContact').value = facility.contactName;
    root.querySelector('#facPhone').value = facility.phone;
    root.querySelector('#facEmail').value = facility.email;
    root.querySelector('#facEmergency').value = facility.emergencyContact;
    root.querySelector('#facStart').value = facility.weekdayStart;
    root.querySelector('#facEnd').value = facility.weekdayEnd;
  });
}
