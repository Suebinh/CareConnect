// Shared helper for every page. Loaded with <script src="../js/api.js"></script>
const API_BASE = 'http://localhost:4000/api';
const LOGIN_PAGE = 'staff-login.html'; // pages/ folder; change if the login page is renamed

async function apiFetch(path, options = {}) {
  const token = sessionStorage.getItem('token');
  const res = await fetch(API_BASE + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: 'Bearer ' + token } : {})
    }
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && token) { // session expired or logged out
    sessionStorage.clear();
    location.href = LOGIN_PAGE;
  }
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

// Send people without the right role back to the login page.
function requireLogin(roles) {
  const role = sessionStorage.getItem('role');
  if (!sessionStorage.getItem('token') || (roles && !roles.includes(role))) {
    location.href = LOGIN_PAGE;
    return false;
  }
  return true;
}

async function logout() {
  try { await apiFetch('/auth/logout', { method: 'POST' }); } catch (e) {}
  sessionStorage.clear();
  location.href = LOGIN_PAGE;
}
