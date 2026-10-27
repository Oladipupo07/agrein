// Agrein Auth Page - Vanilla JS
const API = '/api';
let state = {
  tab: 'login',
  view: 'login',
  role: 'FARMER',
  otpEmail: '',
  otpTimerInterval: null,
  otpSeconds: 300,
  otpCooldown: 0,
  currentUser: null,
};

function goHome() {
  if (state.currentUser) {
    showView('profile');
  } else {
    showView('login');
    switchTab('login');
  }
}

function switchTab(tab) {
  state.tab = tab;
  const tLogin = document.getElementById('tabLogin');
  const tRegister = document.getElementById('tabRegister');
  if (tLogin) tLogin.classList.toggle('active', tab === 'login');
  if (tRegister) tRegister.classList.toggle('active', tab === 'register');
  showView(tab);
}

function showView(view) {
  state.view = view;
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const viewId = 'view' + view.charAt(0).toUpperCase() + view.slice(1);
  const el = document.getElementById(viewId);
  if (el) el.classList.add('active');
  updateCardHeader(view);
  const tabRow = document.getElementById('tabRow');
  if (tabRow) tabRow.style.display = ['login','register'].includes(view) ? 'flex' : 'none';
}

function updateCardHeader(view) {
  const logo = document.getElementById('cardLogo');
  const title = document.getElementById('cardTitle');
  const sub = document.getElementById('cardSubtitle');
  const headers = {
    login:    { icon:'fa-right-to-bracket', title:'Welcome Back', sub:'Sign in to your Agrein account' },
    register: { icon:'fa-user-plus', title:'Create Your Account', sub:"Join Nigeria's trusted agri marketplace" },
    otp:      { icon:'fa-envelope-circle-check', title:'Verify Your Email', sub:'Enter the 6-digit code we sent you' },
    forgot:   { icon:'fa-key', title:'Forgot Password?', sub:"We'll send you a reset code" },
    reset:    { icon:'fa-lock', title:'Set New Password', sub:'Choose a strong new password' },
    profile:  { icon:'fa-user-check', title:'Account Overview', sub:'Your verified Agrein account details' },
    changePw: { icon:'fa-key', title:'Change Password', sub:'Update your account password' },
  };
  const cfg = headers[view] || headers.login;
  if (logo) logo.innerHTML = '<i class="fa-solid ' + cfg.icon + '"></i>';
  if (title) title.textContent = cfg.title;
  if (sub) sub.textContent = cfg.sub;
}

function showForgot() {
  const loginEmail = document.getElementById('loginEmail');
  const forgotEmail = document.getElementById('forgotEmail');
  if (forgotEmail && loginEmail) forgotEmail.value = loginEmail.value || '';
  showView('forgot');
}

function selectRole(role) {
  state.role = role;
  const rBuyer = document.getElementById('roleBuyer');
  const rSeller = document.getElementById('roleSeller');
  if (rBuyer) rBuyer.classList.toggle('selected', role === 'BUYER');
  if (rSeller) rSeller.classList.toggle('selected', role === 'SELLER');
}

function togglePw(inputId, eyeId) {
  const inp = document.getElementById(inputId);
  const eye = document.getElementById(eyeId);
  if (!inp || !eye) return;
  inp.type = inp.type === 'password' ? 'text' : 'password';
  eye.className = inp.type === 'password' ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash';
}

function checkReqs(pw, prefix) {
  const tests = [
    { id: prefix + '_len',     ok: pw.length >= 8 },
    { id: prefix + '_upper',   ok: /[A-Z]/.test(pw) },
    { id: prefix + '_lower',   ok: /[a-z]/.test(pw) },
    { id: prefix + '_num',     ok: /[0-9]/.test(pw) },
    { id: prefix + '_special', ok: /[!@#$%^&*()\-_+=\[\]{}|;:,.<>?]/.test(pw) },
  ];
  tests.forEach(function(r) {
    const el = document.getElementById(r.id);
    if (!el) return;
    el.classList.toggle('met', r.ok);
    const icon = el.querySelector('i');
    if (icon) icon.className = r.ok ? 'fa-solid fa-circle-check' : 'fa-regular fa-circle';
  });
  return tests.every(function(r) { return r.ok; });
}

function checkPwStrength(pw) { checkReqs(pw, 'req'); }
function checkResetPwStrength(pw) { checkReqs(pw, 'rreq'); }
function checkChangePwStrength(pw) { checkReqs(pw, 'creq'); }

function checkMatch() {
  const pw = document.getElementById('regPassword');
  const cf = document.getElementById('regConfirm');
  const err = document.getElementById('matchErr');
  if (pw && cf && err) err.classList.toggle('show', cf.value.length > 0 && pw.value !== cf.value);
}

function checkResetMatch() {
  const pw = document.getElementById('newPassword');
  const cf = document.getElementById('newConfirm');
  const err = document.getElementById('resetMatchErr');
  if (pw && cf && err) err.classList.toggle('show', cf.value.length > 0 && pw.value !== cf.value);
}

function checkChangePwMatch() {
  const pw = document.getElementById('changeNewPw');
  const cf = document.getElementById('changeConfirmPw');
  const err = document.getElementById('changeMatchErr');
  if (pw && cf && err) err.classList.toggle('show', cf.value.length > 0 && pw.value !== cf.value);
}

function showErr(containerId, msgId, msg) {
  const c = document.getElementById(containerId);
  const m = document.getElementById(msgId);
  if (c) { c.classList.remove('hidden'); c.className = c.className.replace('alert-success','alert-error') + ' alert-error'; }
  if (m) m.textContent = msg;
}

function showSuccess(containerId, msgId, msg) {
  const c = document.getElementById(containerId);
  const m = document.getElementById(msgId);
  if (c) { c.classList.remove('hidden'); c.className = c.className.replace('alert-error','alert-success') + ' alert-success'; }
  if (m) m.textContent = msg;
}

function hideAlert(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('hidden');
}

function setLoading(btnId, loading, defaultHtml) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  if (loading) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-circle-notch spinner"></i> <span>Processing...</span>';
  } else {
    btn.disabled = false;
    btn.innerHTML = defaultHtml;
  }
}

// OTP timer
function startOtpTimer() {
  clearInterval(state.otpTimerInterval);
  state.otpSeconds = 300;
  updateTimerDisplay();
  const resendBtn = document.getElementById('resendBtn');
  if (resendBtn) resendBtn.disabled = true;
  state.otpTimerInterval = setInterval(function() {
    state.otpSeconds--;
    updateTimerDisplay();
    if (state.otpSeconds <= 0) {
      clearInterval(state.otpTimerInterval);
      const btn = document.getElementById('resendBtn');
      if (btn) btn.disabled = false;
    }
  }, 1000);
}

function updateTimerDisplay() {
  const el = document.getElementById('timerText');
  if (!el) return;
  const secs = Math.max(0, state.otpSeconds);
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  el.textContent = m + ':' + (s < 10 ? '0' : '') + s;
}

// OTP box navigation
function otpInput(e, idx) {
  const v = e.target.value.replace(/\D/g, '');
  e.target.value = v ? v[0] : '';
  if (v && idx < 5) { const next = document.getElementById('otp' + (idx + 1)); if (next) next.focus(); }
}
function otpKey(e, idx) {
  if (e.key === 'Backspace' && !e.target.value && idx > 0) { const prev = document.getElementById('otp' + (idx - 1)); if (prev) prev.focus(); }
}
function getOtp() { return [0,1,2,3,4,5].map(function(i) { const el = document.getElementById('otp'+i); return el ? el.value : ''; }).join(''); }

function rotpInput(e, idx) {
  const v = e.target.value.replace(/\D/g, '');
  e.target.value = v ? v[0] : '';
  if (v && idx < 5) { const next = document.getElementById('rotp' + (idx + 1)); if (next) next.focus(); }
}
function rotpKey(e, idx) {
  if (e.key === 'Backspace' && !e.target.value && idx > 0) { const prev = document.getElementById('rotp' + (idx - 1)); if (prev) prev.focus(); }
}
function getRotp() { return [0,1,2,3,4,5].map(function(i) { const el = document.getElementById('rotp'+i); return el ? el.value : ''; }).join(''); }

// Profile View Handlers
function displayProfile(user) {
  state.currentUser = user;
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ') || user.name || user.email;
  const nameEl = document.getElementById('profName');
  const roleTextEl = document.getElementById('profRoleText');
  const emailEl = document.getElementById('profEmail');
  const phoneEl = document.getElementById('profPhone');
  const idEl = document.getElementById('profId');
  const statusEl = document.getElementById('profStatus');

  if (nameEl) nameEl.textContent = fullName;
  if (roleTextEl) roleTextEl.textContent = user.role || 'Farmer';
  if (emailEl) emailEl.textContent = user.email || '';
  if (phoneEl) phoneEl.textContent = user.phone || 'Not provided';
  if (idEl) idEl.textContent = (user.id || '').substring(0, 8) + '...';
  if (statusEl) statusEl.textContent = user.verification_status || 'Active';
}

function logout() {
  localStorage.removeItem('agrein_token');
  localStorage.removeItem('agrein_user');
  state.currentUser = null;
  if (document.getElementById('viewLogin')) {
    showView('login');
  } else {
    window.location.href = '/login';
  }
}

function showChangePw() {
  hideAlert('changePwError');
  const c = document.getElementById('currentPw');
  const n = document.getElementById('changeNewPw');
  const cf = document.getElementById('changeConfirmPw');
  if (c) c.value = '';
  if (n) n.value = '';
  if (cf) cf.value = '';
  showView('changePw');
}

async function submitChangePw() {
  hideAlert('changePwError');
  const current_password = (document.getElementById('currentPw') || {}).value;
  const new_password = (document.getElementById('changeNewPw') || {}).value;
  const confirm = (document.getElementById('changeConfirmPw') || {}).value;
  const token = localStorage.getItem('agrein_token');

  if (!current_password || !new_password) return showErr('changePwError', 'changePwErrorMsg', 'Please fill in all password fields.');
  if (!checkReqs(new_password, 'creq')) return showErr('changePwError', 'changePwErrorMsg', 'New password does not meet requirements.');
  if (new_password !== confirm) return showErr('changePwError', 'changePwErrorMsg', 'Passwords do not match.');

  setLoading('changePwBtn', true, '<i class="fa-solid fa-shield-check"></i><span>Update Password</span>');
  try {
    const res = await fetch(API + '/auth/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ current_password, new_password })
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Failed to change password.');
    alert('Password updated successfully!');
    showView('profile');
  } catch(e) {
    showErr('changePwError', 'changePwErrorMsg', e.message);
  } finally {
    setLoading('changePwBtn', false, '<i class="fa-solid fa-shield-check"></i><span>Update Password</span>');
  }
}

// LOGIN
async function submitLogin() {
  hideAlert('loginError');
  const email = (document.getElementById('loginEmail') || {}).value.trim();
  const password = (document.getElementById('loginPassword') || {}).value;
  if (!email || !password) return showErr('loginError', 'loginErrorMsg', 'Please enter your email and password.');
  setLoading('loginBtn', true, '<i class="fa-solid fa-right-to-bracket"></i><span>Sign In</span>');
  try {
    const res = await fetch(API + '/auth/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email, password }) });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Login failed.');
    if (data.token) { localStorage.setItem('agrein_token', data.token); localStorage.setItem('agrein_user', JSON.stringify(data.user || {})); }
    if (data.requiresOtp || data.otpRequired) {
      state.otpEmail = email;
      const display = document.getElementById('otpEmailDisplay');
      if (display) display.textContent = email;
      startOtpTimer();
      showView('otp');
    } else {
      displayProfile(data.user || { email });
      showView('profile');
    }
  } catch(e) { showErr('loginError', 'loginErrorMsg', e.message); }
  finally { setLoading('loginBtn', false, '<i class="fa-solid fa-right-to-bracket"></i><span>Sign In</span>'); }
}

// REGISTER
async function submitRegister() {
  hideAlert('registerError');
  const first = (document.getElementById('regFirst') || {}).value.trim();
  const last = (document.getElementById('regLast') || {}).value.trim();
  const email = (document.getElementById('regEmail') || {}).value.trim();
  const password = (document.getElementById('regPassword') || {}).value;
  const confirm = (document.getElementById('regConfirm') || {}).value;
  if (!first || !last || !email || !password) return showErr('registerError', 'registerErrorMsg', 'Please fill in all required fields.');
  if (!checkReqs(password, 'req')) return showErr('registerError', 'registerErrorMsg', 'Password does not meet all requirements.');
  if (password !== confirm) return showErr('registerError', 'registerErrorMsg', 'Passwords do not match.');
  setLoading('registerBtn', true, '<i class="fa-solid fa-user-plus"></i><span>Create Free Account</span>');
  try {
    const res = await fetch(API + '/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: first,
        last_name: last,
        fullName: `${first} ${last}`.trim(),
        email,
        password,
        role: state.role || 'BUYER'
      })
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Registration failed.');
    state.otpEmail = email;
    state.registrationRole = (data.role || state.role || 'BUYER').toUpperCase();
    const display = document.getElementById('otpEmailDisplay');
    if (display) display.textContent = email;
    startOtpTimer();
    showView('otp');

  } catch(e) {
    showErr('registerError', 'registerErrorMsg', e.message);
  } finally {
    setLoading('registerBtn', false, '<i class="fa-solid fa-user-plus"></i><span>Create Free Account</span>');
  }
}

// Theme Toggle (Light & Dark Mode)
function initTheme() {
  const current = localStorage.getItem('agrein_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', current);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('agrein_theme', next);
}

// OTP SUBMIT
async function submitOtp() {
  hideAlert('otpError');
  const code = getOtp();
  if (code.length < 6) return showErr('otpError', 'otpErrorMsg', 'Please enter all 6 digits.');
  setLoading('otpBtn', true, '<i class="fa-solid fa-shield-check"></i><span>Verify Email</span>');
  try {
    const res = await fetch(API + '/auth/verify-otp', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email:state.otpEmail, otp:code }) });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Invalid code.');

    // Always store the token + user so the next page can read it
    if (data.user && data.user.token) {
      localStorage.setItem('agrein_token', data.user.token);
      localStorage.setItem('agrein_user', JSON.stringify(data.user || {}));
    }

    clearInterval(state.otpTimerInterval);
    const form = document.getElementById('otpForm');
    const success = document.getElementById('otpSuccessScreen');
    if (form) form.classList.add('hidden');
    if (success) success.classList.remove('hidden');

    const role = (data.user && data.user.role) || state.registrationRole || '';

    setTimeout(function() {
      if (role === 'FARMER') {
        // Farmers go to the onboarding page to fill personal + farm details
        window.location.href = '/farmer-onboarding';
      } else {
        displayProfile(data.user || { email: state.otpEmail });
        showView('profile');
      }
    }, 1800);
  } catch(e) { showErr('otpError', 'otpErrorMsg', e.message); }
  finally { setLoading('otpBtn', false, '<i class="fa-solid fa-shield-check"></i><span>Verify Email</span>'); }
}


// RESEND OTP
async function resendOtp() {
  const resendBtn = document.getElementById('resendBtn');
  if (resendBtn) resendBtn.disabled = true;
  let cooldown = 60;
  const interval = setInterval(function() {
    cooldown--;
    if (resendBtn) resendBtn.textContent = cooldown > 0 ? ('Wait ' + cooldown + 's') : 'Resend Code';
    if (cooldown <= 0) { clearInterval(interval); if (state.otpSeconds <= 0 && resendBtn) resendBtn.disabled = false; }
  }, 1000);
  try {
    await fetch(API + '/auth/resend-otp', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email:state.otpEmail }) });
    startOtpTimer();
  } catch(_) {}
}

// FORGOT
async function submitForgot() {
  hideAlert('forgotError');
  const email = (document.getElementById('forgotEmail') || {}).value.trim();
  if (!email) return showErr('forgotError', 'forgotErrorMsg', 'Please enter your email address.');
  setLoading('forgotBtn', true, '<i class="fa-solid fa-paper-plane"></i><span>Send Reset Code</span>');
  try {
    const res = await fetch(API + '/auth/forgot-password', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email }) });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Failed to send reset code.');
    state.otpEmail = email;
    const display = document.getElementById('resetEmailDisplay');
    if (display) display.textContent = email;
    showView('reset');
  } catch(e) { showErr('forgotError', 'forgotErrorMsg', e.message); }
  finally { setLoading('forgotBtn', false, '<i class="fa-solid fa-paper-plane"></i><span>Send Reset Code</span>'); }
}

// RESET
async function submitReset() {
  hideAlert('resetError');
  const otp = getRotp();
  const pw = (document.getElementById('newPassword') || {}).value;
  const cf = (document.getElementById('newConfirm') || {}).value;
  if (otp.length < 6) return showErr('resetError', 'resetErrorMsg', 'Please enter the 6-digit reset code.');
  if (!checkReqs(pw, 'rreq')) return showErr('resetError', 'resetErrorMsg', 'Password does not meet all requirements.');
  if (pw !== cf) return showErr('resetError', 'resetErrorMsg', 'Passwords do not match.');
  setLoading('resetBtn', true, '<i class="fa-solid fa-shield-check"></i><span>Reset Password</span>');
  try {
    const res = await fetch(API + '/auth/reset-password', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email:state.otpEmail, otp, new_password:pw }) });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Reset failed.');
    showView('login');
    switchTab('login');
    const loginEmail = document.getElementById('loginEmail');
    if (loginEmail) loginEmail.value = state.otpEmail;
    showSuccess('loginError', 'loginErrorMsg', 'Password reset successfully! Please sign in.');
  } catch(e) { showErr('resetError', 'resetErrorMsg', e.message); }
  finally { setLoading('resetBtn', false, '<i class="fa-solid fa-shield-check"></i><span>Reset Password</span>'); }
}

// Check session on load
async function initSession() {
  const token = localStorage.getItem('agrein_token');
  if (!token) return;
  try {
    const res = await fetch(API + '/auth/me', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const data = await res.json();
    if (res.ok && data.success && data.user) {
      displayProfile(data.user);
      showView('profile');
    } else {
      localStorage.removeItem('agrein_token');
      localStorage.removeItem('agrein_user');
    }
  } catch(_) {}
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', function() {
  initTheme();
  initSession();
});

// Enter key support
document.addEventListener('keydown', function(e) {
  if (e.key !== 'Enter') return;
  if (state.view === 'login') submitLogin();
  else if (state.view === 'register') submitRegister();
  else if (state.view === 'otp') submitOtp();
  else if (state.view === 'forgot') submitForgot();
  else if (state.view === 'reset') submitReset();
  else if (state.view === 'changePw') submitChangePw();
});
