// Agrein Buyer Onboarding Script
const API = '/api';
let selectedBuyerType = 'Household / Individual Consumer';

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

function selectBuyerType(type) {
  selectedBuyerType = type;
  const map = {
    'Household / Individual Consumer': 'btHousehold',
    'Wholesale Off-taker / Aggregator': 'btWholesale',
    'Restaurant / Food Service': 'btRestaurant',
    'Food Processor / Factory': 'btProcessor'
  };
  Object.keys(map).forEach(k => {
    const el = document.getElementById(map[k]);
    if (el) el.classList.toggle('selected', k === type);
  });
}

function populateBuyerLga(state, defaultSelected) {
  if (window.populateLgasDropdown) {
    window.populateLgasDropdown(state, 'buyerLga', defaultSelected);
  }
}

function showErr(msg) {
  const alertEl = document.getElementById('buyerAlert');
  const msgEl = document.getElementById('buyerAlertMsg');
  if (alertEl && msgEl) {
    alertEl.classList.remove('hidden');
    msgEl.textContent = msg;
  }
  const successEl = document.getElementById('buyerSuccess');
  if (successEl) successEl.classList.add('hidden');
}

function showSuccess(msg) {
  const successEl = document.getElementById('buyerSuccess');
  const msgEl = document.getElementById('buyerSuccessMsg');
  if (successEl && msgEl) {
    successEl.classList.remove('hidden');
    msgEl.textContent = msg;
  }
  const alertEl = document.getElementById('buyerAlert');
  if (alertEl) alertEl.classList.add('hidden');
}

async function submitBuyerOnboarding(e) {
  e.preventDefault();
  const token = localStorage.getItem('agrein_token');
  if (!token) {
    alert('Your session has expired. Please log in.');
    window.location.href = '/login';
    return;
  }

  const fullName = (document.getElementById('buyerFullName') || {}).value?.trim();
  const phone = (document.getElementById('buyerPhone') || {}).value?.trim();
  const state = (document.getElementById('buyerState') || {}).value?.trim();
  const lga = (document.getElementById('buyerLga') || {}).value?.trim();
  const city = (document.getElementById('buyerCity') || {}).value?.trim();
  const address = (document.getElementById('buyerAddress') || {}).value?.trim();

  if (!fullName) return showErr('Please enter your full name.');
  if (!phone) return showErr('Please enter a valid phone number.');
  if (!state) return showErr('Please select your state.');
  if (!lga) return showErr('Please select your local government area (LGA).');
  if (!address) return showErr('Please enter your full street/delivery address.');

  const btn = document.getElementById('saveBuyerBtn');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-circle-notch" style="animation:spin .8s linear infinite"></i> <span>Saving Details...</span>';
  }

  try {
    const res = await fetch(API + '/auth/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        fullName,
        phone,
        state,
        lga,
        city,
        address,
        buyerType: selectedBuyerType,
        isBuyerOnboarded: true
      })
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to save buyer details.');
    }

    // Update stored user object
    try {
      const stored = JSON.parse(localStorage.getItem('agrein_user') || '{}');
      stored.full_name = fullName;
      stored.phone_number = phone;
      stored.state = state;
      stored.lga = lga;
      stored.city = city;
      stored.address = address;
      stored.buyer_type = selectedBuyerType;
      stored.is_buyer_onboarded = true;
      localStorage.setItem('agrein_user', JSON.stringify(stored));
    } catch (_) {}

    showSuccess('Delivery location and phone number saved! Redirecting to Buyer Dashboard...');

    setTimeout(() => {
      window.location.href = '/buyer-dashboard';
    }, 1200);

  } catch (err) {
    showErr(err.message || 'Network error saving location details.');
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-circle-check"></i> <span>Save &amp; Enter Buyer Dashboard</span>';
    }
  }
}

function logout() {
  localStorage.removeItem('agrein_token');
  localStorage.removeItem('agrein_user');
  window.location.href = '/login';
}

window.addEventListener('DOMContentLoaded', () => {
  initTheme();

  const token = localStorage.getItem('agrein_token');
  if (!token) {
    window.location.href = '/login';
    return;
  }

  // Pre-fill states
  if (window.populateStatesDropdown) {
    window.populateStatesDropdown('buyerState');
  }

  // Load existing profile details if available
  const userRaw = localStorage.getItem('agrein_user');
  if (userRaw) {
    try {
      const u = JSON.parse(userRaw);
      const nameEl = document.getElementById('buyerFullName');
      const phoneEl = document.getElementById('buyerPhone');
      const stateEl = document.getElementById('buyerState');
      const cityEl = document.getElementById('buyerCity');
      const addrEl = document.getElementById('buyerAddress');
      const navSession = document.getElementById('navSession');

      if (navSession) {
        navSession.innerHTML = '<span style="font-size:0.75rem;color:var(--text-muted)">Welcome, <strong style="color:var(--emerald-400)">' + (u.full_name || u.email || 'Buyer') + '</strong></span>';
      }

      if (nameEl && (u.full_name || u.name)) nameEl.value = u.full_name || u.name;
      if (phoneEl && u.phone_number) phoneEl.value = u.phone_number;
      if (cityEl && u.city) cityEl.value = u.city;
      if (addrEl && u.address) addrEl.value = u.address;

      if (u.state && stateEl) {
        stateEl.value = u.state;
        populateBuyerLga(u.state, u.lga);
      }
    } catch (_) {}
  }
});

