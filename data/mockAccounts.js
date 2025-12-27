// data/mockAccounts.js
// Simple mock account store and search helper to simulate server-side search.

const allUsers = [];
const pendingOperators = [];

// generate sample users (mix of roles)
const roles = ['admin','operator','carrier'];
for (let i = 1; i <= 60; i++) {
  const r = roles[Math.floor(Math.random()*roles.length)];
  allUsers.push({
    id: `u${i}`,
    name: `User ${i}`,
    email: `user${i}@example.com`,
    role: r,
    created: `2025-12-${String((i%28)+1).padStart(2,'0')} 0${i%10}:00`
  });
}

// ensure some carriers exist with identifiable names
allUsers[2].name = 'Carrier One'; allUsers[2].role = 'carrier';
allUsers[5].name = 'Fast Carrier'; allUsers[5].role = 'carrier';
allUsers[12].name = 'Global Carrier'; allUsers[12].role = 'carrier';
allUsers[25].name = 'North Carrier'; allUsers[25].role = 'carrier';
allUsers[37].name = 'South Carrier'; allUsers[37].role = 'carrier';

export function searchCarriers(query = '', offset = 0, limit = 20) {
  return searchUsers(query, offset, limit, ['carrier','operator']);
}

export function searchUsers(query = '', offset = 0, limit = 20, roles = ['carrier','operator','admin']) {
  // simulate server-side search with optional role filtering
  const q = (query || '').trim().toLowerCase();
  const matches = allUsers.filter(u => roles.includes(u.role) && (
    !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.id.toLowerCase().includes(q)
  ));
  const slice = matches.slice(offset, offset + limit);
  return {
    total: matches.length,
    offset,
    limit,
    results: slice
  };
}

export function updateUserRole(id, newRole) {
  const u = allUsers.find(x => x.id === id);
  if (!u) return false;
  u.role = newRole;
  return true;
}

export function getUserById(id) {
  return allUsers.find(x => x.id === id) || null;
}

export function addPendingOperator({ name, surname, email, password, role = 'operator' }) {
  if (!email) return { ok: false, reason: 'Email required' };
  const exists = allUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
  if (exists) return { ok: false, reason: 'User already exists' };
  const alreadyPending = pendingOperators.some(u => u.email.toLowerCase() === email.toLowerCase());
  if (alreadyPending) return { ok: false, reason: 'Already submitted' };
  pendingOperators.unshift({
    id: `p-${pendingOperators.length + 1}`,
    name: `${name || ''} ${surname || ''}`.trim() || email,
    surname: surname || '',
    email,
    password: password || '',
    role,
    submitted: new Date().toISOString().slice(0, 16).replace('T', ' ')
  });
  return { ok: true };
}

export function listPendingOperators() {
  return pendingOperators;
}

export function approveOperator(email) {
  const idx = pendingOperators.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
  if (idx === -1) return false;
  const pending = pendingOperators.splice(idx, 1)[0];
  allUsers.push({
    id: `u${allUsers.length + 1}`,
    name: pending.name,
    email: pending.email,
    role: pending.role || 'operator',
    created: pending.submitted
  });
  return true;
}

