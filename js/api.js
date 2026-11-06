// Shared helper for every page. Loaded with <script src="../js/api.js"></script>
// Local dev (localhost, Live Server, or opening the file directly) talks to the backend on
// port 4000. Anywhere else (Cloudflare Pages, GitHub Pages) talks to the deployed backend.
// TODO: replace with the real Render URL once the backend is deployed (see README → Deploying).
const DEPLOYED_API_BASE = 'https://careconnect-api.onrender.com/api';
const IS_LOCAL = ['localhost', '127.0.0.1', ''].includes(location.hostname);
const API_BASE = IS_LOCAL ? 'http://localhost:4000/api' : DEPLOYED_API_BASE;
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

// Where each role lands after logging in. Roles without their own page yet go to profile.
const HOME_PAGE = {
  nurse: 'nurse-schedule.html',
  physician: 'nurse-schedule.html',
  data_analyst: 'analyst-no-show.html'
};
function homeFor(role) {
  return HOME_PAGE[role] || 'profile.html';
}

// Wire a login <form> to POST /auth/login, save the session, and redirect by role.
// `errorEl` is where to show a failed-login message.
function setupLoginForm(form, errorEl) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorEl.hidden = true;
    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: form.email.value.trim(), password: form.password.value })
      });
      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('role', data.account.role);
      location.href = homeFor(data.account.role);
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.hidden = false;
      button.disabled = false;
    }
  });
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
