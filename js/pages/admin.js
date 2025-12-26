// js/pages/admin.js

// Basit auth guard (senin login.js localStorage set ediyordu)
/*if (localStorage.getItem("admin_session") !== "true") {
  window.location.href = "../login.html";
}*/

const nav = document.getElementById("adminNav");
const viewRoot = document.getElementById("viewRoot");
const pageTitle = document.getElementById("pageTitle");
const logoutBtn = document.getElementById("logoutBtn");

// Ekran şablonları (şimdilik basit; sonra her biri ayrı modül olabilir)
const views = {
  
  "remove-station": () => `
    <div id="removeStationRoot"></div>
  `,

  "add-station": () => `
    <div id="addStationRoot"></div>
  `,

  "block-carrier": () => `
    <div id="blockCarrierRoot"></div>
  `,

  "report": () => `
    <div id="viewReportRoot"></div>
  `,

  "facility-edit": () => `
    <div id="facilityEditRoot"></div>
  `,

  "stats": () => `
    <div id="facilityStatsRoot"></div>
  `,

  "issue-form": () => `
    <div id="issueFormRoot"></div>
  `,
  "solve-issue": () => `
    <div id="solveIssueRoot"></div>
  `
  ,"manage-users": () => `
    <div id="manageUsersRoot"></div>
  `
};

function setActive(viewKey) {
  // aktif class
  nav.querySelectorAll(".nav-item").forEach(btn => {
    btn.classList.toggle("is-active", btn.dataset.view === viewKey);
  });

  // başlık
  const activeBtn = nav.querySelector(`.nav-item[data-view="${viewKey}"]`);
  pageTitle.textContent = activeBtn ? activeBtn.innerText.trim() : "Admin";

  // içerik
  const render = views[viewKey] || (() => `<p>Bu ekran henüz eklenmedi.</p>`);
  viewRoot.innerHTML = render();

  // special-case: some views want to hide the outer content header (we render their own hero)
  const contentHeader = document.querySelector('.content-header');
  if (viewKey === 'issue-form') {
    if (contentHeader) contentHeader.style.display = 'none';
  } else {
    if (contentHeader) contentHeader.style.display = '';
  }

  // load add-station module dynamically (same pattern as block-carrier)
  if (viewKey === 'add-station') {
    import('./addStation.js')
      .then(mod => {
        const root = document.getElementById('addStationRoot');
        if (root && mod.initAddStation) mod.initAddStation(root);
      })
      .catch(err => console.error('addStation load error', err));
  }

  if (viewKey === 'remove-station') {
    import('./removeStation.js')
      .then(mod => {
        const root = document.getElementById('removeStationRoot');
        if (root && mod.initRemoveStation) mod.initRemoveStation(root);
      })
      .catch(err => console.error('removeStation load error', err));
  }

  if (viewKey === 'report') {
    import('./viewReport.js')
      .then(mod => {
        const root = document.getElementById('viewReportRoot');
        if (root && mod.initViewReport) mod.initViewReport(root);
      })
      .catch(err => console.error('viewReport load error', err));
  }

  if (viewKey === 'facility-edit') {
    import('./facilityEdit.js')
      .then(mod => {
        const root = document.getElementById('facilityEditRoot');
        if (root && mod.initFacilityEdit) mod.initFacilityEdit(root);
      })
      .catch(err => console.error('facilityEdit load error', err));
  }
  if (viewKey === 'stats') {
    import('./facilityStats.js')
      .then(mod => {
        const root = document.getElementById('facilityStatsRoot');
        if (root && mod.initFacilityStats) mod.initFacilityStats(root);
      })
      .catch(err => console.error('facilityStats load error', err));
  }
  if (viewKey === 'issue-form') {
    import('./issueForm.js')
      .then(mod => {
        const root = document.getElementById('issueFormRoot');
        if (root && mod.initIssueForm) mod.initIssueForm(root, { mode: 'view' });
      })
      .catch(err => console.error('issueForm load error', err));
  }

  if (viewKey === 'solve-issue') {
    import('./issueForm.js')
      .then(mod => {
        const root = document.getElementById('solveIssueRoot');
        if (root && mod.initIssueForm) mod.initIssueForm(root, { mode: 'solve' });
      })
      .catch(err => console.error('issueForm load error', err));
  }

  if (viewKey === 'manage-users') {
    import('./manageUsers.js')
      .then(mod => {
        const root = document.getElementById('manageUsersRoot');
        if (root && mod.initManageUsers) mod.initManageUsers(root);
      })
      .catch(err => console.error('manageUsers load error', err));
  }

  // Eğer block-carrier görünümü ise ilgili modülü dinamik yükle
  if (viewKey === 'block-carrier') {
    import('./blockCarrier.js')
      .then(mod => {
        const root = document.getElementById('blockCarrierRoot');
        if (root && mod.initBlockCarrier) mod.initBlockCarrier(root);
      })
      .catch(err => console.error('blockCarrier load error', err));
  }
}

// nav click delegation
nav.addEventListener("click", (e) => {
  const btn = e.target.closest(".nav-item");
  if (!btn) return;
  setActive(btn.dataset.view);
});

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("admin_session");
  window.location.href = "../login.html";
});


