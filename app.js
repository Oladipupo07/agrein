// Agrein Main Application Orchestrator

const state = {
  currentView: 'landing', // 'landing', 'marketplace', 'ai-insights', 'nearby-farms', 'farmer-dashboard', 'buyer-dashboard', 'admin-dashboard',
  //                        'rfq-board', 'commodity-index', 'agro-doctor', 'weather', 'cooperatives', 'forum', 'learning-center',
  //                        'wallet', 'logistics', 'export-trade', 'bulk-b2b', 'subscriptions', 'traceability',
  //                        'farmer-verification', 'admin-verification', 'admin-review', 'account-settings'
  activeRole: 'visitor', // 'visitor', 'farmer', 'buyer', 'admin'
  darkMode: false,
  cart: [
    {
      id: 'prod-001',
      title: 'Grade-A Sun-Dried Yellow Maize',
      price: 480,
      unit: 'kg',
      cartQty: 100,
      farmName: 'Zaria Agro-Gold Farms',
      originState: 'Kaduna',
      image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80'
    }
  ],
  wishlist: ['prod-002', 'prod-004'],
  
  // Catalog filters
  selectedCategory: 'All',
  selectedState: 'All',
  searchFilter: '',
  organicOnlyFilter: false,
  viewMode: 'grid',

  // Product Modal State
  activeModalProductId: null,
  modalQty: 100,
  modalTab: 'details',

  // Chat State
  chatActive: false,
  chatRecipient: 'Mallam Ibrahim Bello',
  chatMessages: [
    { sender: 'them', text: 'Hello! Welcome to Zaria Agro-Gold Farms. Are you looking to order Yellow Maize or Sesame Seeds?', time: '10:14 AM' },
    { sender: 'you', text: 'Hi Ibrahim, what is the moisture level on the current maize batch?', time: '10:15 AM' },
    { sender: 'them', text: 'It is dried to exactly 12.5% moisture, double-cleaned and bagged in 50kg poly bags.', time: '10:16 AM' }
  ],
  chatInputText: '',

  // Cart & Interswitch Checkout
  cartOpen: false,
  mobileMenuOpen: false,
  interswitchCheckoutActive: false,
  interswitchCheckoutAmount: 0,
  interswitchItemTitle: '',
  interswitchMethod: 'inline', // 'inline', 'redirect', 'card'
  interswitchProcessing: false,
  interswitchSuccess: false,

  // Authentication & Email OTP State
  authModalActive: false,
  authModalMode: 'login', // 'login', 'register', 'verify-otp'
  authRegisterRole: 'BUYER', // 'BUYER', 'FARMER'
  otpEmail: '',
  otpRole: 'BUYER',
  otpFlow: 'register', // 'register' | 'reset' — controls post-OTP routing
  otpTimerSeconds: 300, // 5 minutes expiration countdown
  otpCooldownSeconds: 0, // 60s resend cooldown
  otpDigits: ['', '', '', '', '', ''],
  otpError: null,
  otpSuccess: false,
  demoOtp: '',
  otpTimerInterval: null,
  otpCooldownInterval: null,

  // Buyer Protection Dispute State
  disputeModalActive: false,

  // Authenticated session (replaces the public Portal View Mode switcher)
  currentUser: null, // null when logged out; { id, full_name, email, role, token, verification_status } when logged in
  pendingGuardView: null, // gated view a visitor tried to enter before logging in
  changePasswordModalActive: false,
  navbarMenuOpen: false,

  // Account Settings / Deletion flow
  deletionReasonText: '',
  deletionSubmitting: false,
  deletionRequests: [],  // admin queue snapshot, populated when admin opens Admin Verification view
  deletionRequestsLoaded: false,

  // Admin Review Dossier State
  adminReviewDossier: null,
  adminActionModalActive: false,
  adminActionTargetId: null,
  adminActionType: null, // 'REQUEST_CHANGES', 'REJECT', 'SUSPEND'
  adminActionReasonText: '',

  // AI Predictor Tool
  aiSelectedCrop: 'Yellow Maize',
  aiSelectedState: 'Kaduna',
  aiForecastResult: {
    crop: 'Yellow Maize',
    state: 'Kaduna',
    confidence_score: '94.6%',
    current_avg_price: 480,
    forecasted_price_per_unit: 520,
    ai_recommendation: 'High poultry feed demand projected next 3 weeks. Recommended to hold crop harvest for an additional 14 days to maximize profit margin.',
    historical_months: [
      { month: 'May', price: 410 },
      { month: 'Jun', price: 435 },
      { month: 'Jul', price: 460 },
      { month: 'Aug', price: 480 },
      { month: 'Sep (Forecast)', price: 520 },
      { month: 'Oct (Forecast)', price: 545 }
    ]
  },

  // Verification Modal
  verificationModalActive: false,
  farmerVerificationStatus: 'APPROVED',

  // AgroDoctor AI
  agroDoctorCrop: 'Tomatoes',
  agroDoctorDiagnosis: {
    disease: 'Early Blight (Alternaria solani)',
    confidence: '92.4%',
    severity: 'Moderate',
    symptoms: ['Concentric dark rings on lower leaves', 'Yellow halos around lesions', 'Progressive leaf drop'],
    treatment: [
      'Remove and destroy affected leaves immediately',
      'Apply Copper-based fungicide (Bordeaux mixture) every 7-10 days',
      'Improve air circulation by pruning overcrowded plants',
      'Apply neem oil as organic preventive spray'
    ],
    fertilizer: 'Apply balanced NPK 15-15-15 at 200kg/ha. Supplement with calcium ammonium nitrate to strengthen cell walls.'
  },

  // Subscription
  currentPlan: 'free',

  // Toast System
  toastMessage: null,

  // Mock Database
  mockData: INITIAL_MOCK_DATA
};

// Application Action Handlers
const actions = {
  setView(view) {
    state.currentView = view;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    renderApp();
  },

  // Gated routing — visitors must log in to reach portals; logged-in users must
  // own the right role. Falls back to the visitor landing page on any failure.
  guardView(view) {
    const GATED_VIEWS = {
      'farmer-dashboard': 'FARMER',
      'farmer-verification': 'FARMER',
      'buyer-dashboard': 'BUYER',
      'admin-dashboard': 'ADMIN',
      'admin-verification': 'ADMIN',
      'admin-review': 'ADMIN',
      'account-settings': null  // any logged-in user; not role-locked
    };
    const roleDefaultView = (role) => {
      if (role === 'BUYER') return 'buyer-dashboard';
      if (role === 'ADMIN') return 'admin-verification';
      if (role === 'FARMER') return 'farmer-verification';
      return 'landing';
    };

    const requiredRole = GATED_VIEWS[view];

    // 'account-settings' is the only view that requires a login but no role check.
    if (view === 'account-settings') {
      if (!state.currentUser) {
        state.pendingGuardView = view;
        actions.openAuthModal('login');
        actions.triggerToast('🔒 Please log in to access Account Settings.');
        return;
      }
      actions.setView(view);
      return;
    }

    if (requiredRole === undefined) {
      actions.setView(view);
      return;
    }
    if (requiredRole === null) {
      // reserved for future generic login-only views
      actions.setView(view);
      return;
    }

    if (!state.currentUser) {
      state.pendingGuardView = view;
      actions.openAuthModal('login');
      actions.triggerToast('🔒 Please log in to access that portal.');
      return;
    }

    const userRole = (state.currentUser.role || '').toUpperCase();
    if (userRole !== requiredRole) {
      actions.triggerToast(`⛔ This portal is restricted to ${requiredRole} accounts.`);
      actions.setView(roleDefaultView(userRole));
      return;
    }

    // Logged in with the right role — but a farmer who hasn't been verified
    // yet should land on the verification page, not the dashboard.
    if (view === 'farmer-dashboard' && state.currentUser.verification_status !== 'APPROVED') {
      actions.triggerToast('📋 Complete your farm verification to access the dashboard.');
      actions.setView('farmer-verification');
      return;
    }

    actions.setView(view);
  },

  guardViewAndCloseMobile(view) {
    state.mobileMenuOpen = false;
    actions.guardView(view);
  },

  logout() {
    state.currentUser = null;
    state.activeRole = 'visitor';
    state.pendingGuardView = null;
    state.navbarMenuOpen = false;
    state.currentView = 'landing';
    state.mobileMenuOpen = false;
    actions.triggerToast('👋 You have been logged out.');
    renderApp();
  },

  // Track the view a visitor wanted to enter so we can resume it after login.
  setPendingGuardView(view) {
    state.pendingGuardView = view;
  },

  toggleDarkMode() {
    state.darkMode = !state.darkMode;
    if (state.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    renderApp();
  },

  // Auth Actions
  openAuthModal(mode = 'login') {
    state.authModalActive = true;
    state.authModalMode = mode;
    // Reset the OTP flow when opening any auth view — registration is the default.
    state.otpFlow = 'register';
    renderApp();
  },

  closeAuthModal() {
    state.authModalActive = false;
    renderApp();
  },

  setAuthRegisterRole(role) {
    state.authRegisterRole = role;
    renderApp();
  },

  toggleAuthMode() {
    state.authModalMode = state.authModalMode === 'login' ? 'register' : 'login';
    renderApp();
  },

  validateAndSubmitAuth(mode, role) {
    if (mode === 'register') {
      const firstName = document.getElementById('regFirstName')?.value?.trim();
      const lastName = document.getElementById('regLastName')?.value?.trim();
      const email = document.getElementById('authEmail')?.value?.trim();
      const phone = document.getElementById('regPhone')?.value?.trim();
      const password = document.getElementById('authPassword')?.value || '';
      const confirmPassword = document.getElementById('regConfirmPassword')?.value || '';

      if (!firstName || !lastName) {
        actions.triggerToast('❌ First Name and Last Name are required.');
        return;
      }
      if (!email) {
        actions.triggerToast('❌ Please enter a valid Email Address.');
        return;
      }
      if (!phone || !/^\d+$/.test(phone)) {
        actions.triggerToast('❌ Phone Number must contain digits only.');
        return;
      }
      if (password.length < 8) {
        actions.triggerToast('❌ Password must be at least 8 characters long.');
        return;
      }
      if (!/[A-Z]/.test(password)) {
        actions.triggerToast('❌ Password must contain at least 1 Uppercase letter (A-Z).');
        return;
      }
      if (!/[a-z]/.test(password)) {
        actions.triggerToast('❌ Password must contain at least 1 Lowercase letter (a-z).');
        return;
      }
      if (!/[0-9]/.test(password)) {
        actions.triggerToast('❌ Password must contain at least 1 Number (0-9).');
        return;
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        actions.triggerToast('❌ Password must contain at least 1 Special character (!@#$%^&*).');
        return;
      }
      if (password !== confirmPassword) {
        actions.triggerToast('❌ Passwords do not match.');
        return;
      }

      // Call API to generate and send OTP
      fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: `${firstName} ${lastName}`, email, phone, password, role })
      })
      .then(res => res.json())
      .then(data => {
        if (!data.success) {
          actions.triggerToast(`❌ ${data.message}`);
          return;
        }

        // Store user pending state and transition to OTP screen
        state.otpEmail = email;
        state.otpRole = role;
        state.otpFlow = 'register';
        state.demoOtp = data.demoOtp || '482913';
        state.authModalMode = 'verify-otp';
        state.otpDigits = ['', '', '', '', '', ''];
        state.otpError = null;
        state.otpSuccess = false;
        state.otpTimerSeconds = 300;
        state.otpCooldownSeconds = 0;

        actions.startOtpCountdown();
        actions.triggerToast(`📧 Verification code sent to ${email}`);
        renderApp();
      })
      .catch(() => {
        // Fallback for offline client state
        const fallbackDemoOtp = Math.floor(100000 + Math.random() * 900000).toString();
        state.otpEmail = email;
        state.otpRole = role;
        state.otpFlow = 'register';
        state.demoOtp = fallbackDemoOtp;
        state.authModalMode = 'verify-otp';
        state.otpDigits = ['', '', '', '', '', ''];
        state.otpError = null;
        state.otpSuccess = false;
        state.otpTimerSeconds = 300;
        state.otpCooldownSeconds = 0;

        actions.startOtpCountdown();
        actions.triggerToast(`📧 Verification code sent to ${email}`);
        renderApp();
      });
    } else {
      const email = document.getElementById('authEmail')?.value?.trim();
      const password = document.getElementById('authPassword')?.value;
      if (!email || !password) {
        actions.triggerToast('❌ Please enter your email and password.');
        return;
      }

      fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      .then(res => res.json())
      .then(data => {
        if (!data.success && data.emailVerificationRequired) {
          state.otpEmail = email;
          state.otpFlow = 'register';
          state.demoOtp = data.demoOtp || '482913';
          state.authModalMode = 'verify-otp';
          state.otpDigits = ['', '', '', '', '', ''];
          state.otpError = 'Email verification required. We\'ve sent a new verification code to your email.';
          state.otpTimerSeconds = 300;
          actions.startOtpCountdown();
          renderApp();
          return;
        }

        if (!data.success) {
          actions.triggerToast(`❌ ${data.message || 'Login failed.'}`);
          return;
        }

        const user = data.user || {};
        state.currentUser = {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          role: (user.role || '').toUpperCase(),
          token: user.token,
          verification_status: user.verification_status
        };
        state.activeRole = (state.currentUser.role || 'visitor').toLowerCase();
        state.authModalActive = false;
        actions.triggerToast(`✅ Logged in as ${state.currentUser.full_name || state.currentUser.email}.`);

        const resumeView = state.pendingGuardView;
        state.pendingGuardView = null;
        if (resumeView) {
          actions.guardView(resumeView);
        } else if (state.currentUser.role === 'ADMIN') {
          actions.guardView('admin-verification');
        } else if (state.currentUser.role === 'FARMER') {
          actions.guardView(state.currentUser.verification_status === 'APPROVED' ? 'farmer-dashboard' : 'farmer-verification');
        } else if (state.currentUser.role === 'BUYER') {
          actions.guardView('buyer-dashboard');
        } else {
          actions.setView('landing');
        }
      })
      .catch(() => {
        actions.triggerToast('❌ Login failed. Check your connection and try again.');
      });
    }
  },

  startOtpCountdown() {
    if (state.otpTimerInterval) clearInterval(state.otpTimerInterval);
    state.otpTimerInterval = setInterval(() => {
      if (state.otpTimerSeconds > 0) {
        state.otpTimerSeconds -= 1;
        // Don't call renderApp on every tick to preserve input focus unless modal is active
        const timerEl = document.querySelector('.otp-timer-display');
        if (timerEl) timerEl.textContent = actions.formatOtpTimer(state.otpTimerSeconds);
      } else {
        clearInterval(state.otpTimerInterval);
        state.otpError = 'This verification code has expired. Please request a new verification code.';
        renderApp();
      }
    }, 1000);
  },

  formatOtpTimer(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  },

  handleOtpDigitInput(event, index) {
    const val = event.target.value.replace(/[^0-9]/g, '');
    state.otpDigits[index] = val;

    if (event.key === 'Backspace' && index > 0 && !val) {
      const prevEl = document.getElementById(`otpDigit_${index - 1}`);
      if (prevEl) prevEl.focus();
    } else if (val && index < 5) {
      const nextEl = document.getElementById(`otpDigit_${index + 1}`);
      if (nextEl) nextEl.focus();
    }
  },

  fillDemoOtp(code) {
    if (!code || code.length !== 6) return;
    state.otpDigits = code.split('');
    renderApp();
  },

  // Forgot-password: send the 6-digit reset code for the entered email.
  // The server returns a generic message whether or not the email is
  // registered (anti-enumeration), so we just transition to the OTP screen.
  requestPasswordReset() {
    const email = (document.getElementById('forgotEmail')?.value || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      actions.triggerToast('❌ Please enter a valid email address.');
      return;
    }

    fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    .then(res => res.json())
    .then(data => {
      if (!data.success) {
        actions.triggerToast(`❌ ${data.message || 'Could not send reset code.'}`);
        return;
      }
      state.otpFlow = 'reset';
      state.otpEmail = email;
      state.authModalMode = 'verify-otp';
      state.otpDigits = ['', '', '', '', '', ''];
      state.otpError = null;
      state.otpSuccess = false;
      state.otpTimerSeconds = 300;
      state.otpCooldownSeconds = 0;
      actions.startOtpCountdown();
      renderApp();
      actions.triggerToast(`📧 If an account exists for ${email}, a 6-digit code has been sent.`);
    })
    .catch(() => {
      // Even on network failure, route the user to the OTP screen so they can
      // still type the code from their inbox — fail-open UX.
      state.otpFlow = 'reset';
      state.otpEmail = email;
      state.authModalMode = 'verify-otp';
      state.otpDigits = ['', '', '', '', '', ''];
      state.otpError = null;
      state.otpSuccess = false;
      state.otpTimerSeconds = 300;
      state.otpCooldownSeconds = 0;
      actions.startOtpCountdown();
      renderApp();
      actions.triggerToast(`📧 If an account exists for ${email}, a 6-digit code has been sent.`);
    });
  },

  // Forgot-password: after OTP is verified, send the new password + email to
  // the server. On success, drop back into the login screen.
  submitPasswordReset() {
    const newPassword = document.getElementById('resetNewPassword')?.value || '';
    const confirmPassword = document.getElementById('resetConfirmPassword')?.value || '';

    if (newPassword !== confirmPassword) {
      actions.triggerToast('❌ Passwords do not match.');
      return;
    }
    if (newPassword.length < 8) { actions.triggerToast('❌ Password must be at least 8 characters long.'); return; }
    if (!/[A-Z]/.test(newPassword)) { actions.triggerToast('❌ Must contain at least 1 uppercase letter.'); return; }
    if (!/[a-z]/.test(newPassword)) { actions.triggerToast('❌ Must contain at least 1 lowercase letter.'); return; }
    if (!/[0-9]/.test(newPassword)) { actions.triggerToast('❌ Must contain at least 1 number.'); return; }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) { actions.triggerToast('❌ Must contain at least 1 special character.'); return; }

    const code = state.otpDigits.join('');
    if (code.length !== 6) {
      actions.triggerToast('❌ Verification code missing. Please restart the reset flow.');
      actions.openAuthModal('forgot-password');
      return;
    }

    fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: state.otpEmail, otp: code, newPassword })
    })
    .then(res => res.json().then(b => ({ status: res.status, body: b })))
    .then(({ status, body }) => {
      if (status === 200 && body.success) {
        actions.triggerToast('✅ Password reset successfully. Please log in.');
        state.otpFlow = 'register';
        state.otpDigits = ['', '', '', '', '', ''];
        state.otpSuccess = false;
        actions.openAuthModal('login');
      } else {
        actions.triggerToast(`❌ ${body.message || 'Reset failed.'}`);
      }
    })
    .catch(() => actions.triggerToast('❌ Could not reach the server.'));
  },

  submitOtpVerification() {
    const code = state.otpDigits.join('');
    if (code.length !== 6) {
      state.otpError = 'Please enter all 6 digits of the verification code.';
      renderApp();
      return;
    }

    const finishOtpSuccess = () => {
      state.otpSuccess = true;
      state.otpError = null;
      renderApp();

      // Password reset flow: after a successful OTP we hand off to the
      // new-password entry instead of auto-routing to a dashboard.
      if (state.otpFlow === 'reset') {
        setTimeout(() => {
          state.otpSuccess = false;
          state.authModalMode = 'forgot-password-reset';
          renderApp();
        }, 1200);
        return;
      }

      setTimeout(() => {
        const resumeView = state.pendingGuardView;
        const userRole = (state.currentUser && state.currentUser.role) || state.otpRole;
        state.authModalActive = false;
        state.otpSuccess = false;
        state.activeRole = (userRole || 'visitor').toLowerCase();
        state.pendingGuardView = null;

        if (resumeView) {
          actions.guardView(resumeView);
        } else if (userRole === 'FARMER') {
          actions.guardView('farmer-verification');
        } else if (userRole === 'BUYER') {
          actions.guardView('buyer-dashboard');
        } else if (userRole === 'ADMIN') {
          actions.guardView('admin-verification');
        } else {
          actions.setView('landing');
        }
      }, 1400);
    };

    fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: state.otpEmail, otp: code })
    })
    .then(res => res.json())
    .then(data => {
      if (!data.success) {
        state.otpError = data.message;
        renderApp();
        return;
      }

      const user = data.user || {};
      const role = (user.role || state.otpRole || 'BUYER').toUpperCase();
      const verificationStatus = user.verification_status || (role === 'FARMER' ? 'NOT_STARTED' : 'APPROVED');
      state.currentUser = {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role,
        token: user.token,
        verification_status: verificationStatus
      };
      actions.triggerToast(role === 'FARMER'
        ? '🎉 Email Verified! Complete your farm verification to start selling.'
        : '🎉 Email Verified! Welcome to your dashboard.');
      finishOtpSuccess();
    })
    .catch(() => {
      // Fallback verification for demo — synthesize a session using the local role hint
      const role = (state.otpRole || 'BUYER').toUpperCase();
      state.currentUser = {
        id: `usr-${Date.now()}`,
        full_name: state.otpEmail.split('@')[0],
        email: state.otpEmail,
        role,
        token: `AGREIN_JWT_TOKEN_${Date.now()}`,
        verification_status: role === 'FARMER' ? 'NOT_STARTED' : 'APPROVED'
      };
      actions.triggerToast(role === 'FARMER'
        ? '🎉 Email Verified! Complete your farm verification to start selling.'
        : '🎉 Email Verified! Welcome to your dashboard.');
      finishOtpSuccess();
    });
  },

  resendEmailOtp() {
    fetch('/api/auth/resend-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: state.otpEmail })
    })
    .then(res => res.json())
    .then(data => {
      if (!data.success && data.inCooldown) {
        actions.triggerToast(`⚠️ You can request another code in ${data.secondsLeft} seconds.`);
        return;
      }

      state.demoOtp = data.demoOtp || state.demoOtp;
      state.otpError = null;
      state.otpTimerSeconds = 300;
      state.otpCooldownSeconds = 60;
      state.otpDigits = ['', '', '', '', '', ''];

      actions.startOtpCountdown();

      if (state.otpCooldownInterval) clearInterval(state.otpCooldownInterval);
      state.otpCooldownInterval = setInterval(() => {
        if (state.otpCooldownSeconds > 0) {
          state.otpCooldownSeconds -= 1;
        } else {
          clearInterval(state.otpCooldownInterval);
        }
        renderApp();
      }, 1000);

      actions.triggerToast(`📧 New 6-digit verification code sent to ${state.otpEmail}`);
      renderApp();
    })
    .catch(() => {
      state.otpError = null;
      state.otpTimerSeconds = 300;
      state.otpCooldownSeconds = 60;
      state.otpDigits = ['', '', '', '', '', ''];
      actions.startOtpCountdown();
      actions.triggerToast(`📧 New verification code sent to ${state.otpEmail}`);
      renderApp();
    });
  },

  handleAuthSubmit(mode, role) {
    actions.validateAndSubmitAuth(mode, role);
  },

  // Real Browser GPS Geolocation Pinning
  detectGpsLocation() {
    if (navigator.geolocation) {
      actions.triggerToast('📡 Detecting exact farm GPS coordinates via satellite...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toFixed(6);
          const lng = position.coords.longitude.toFixed(6);
          const latEl = document.getElementById('farmLat');
          const lngEl = document.getElementById('farmLng');
          if (latEl) latEl.value = lat;
          if (lngEl) lngEl.value = lng;
          if (state.mockData.farmerVerificationApp) {
            state.mockData.farmerVerificationApp.gps_latitude = parseFloat(lat);
            state.mockData.farmerVerificationApp.gps_longitude = parseFloat(lng);
          }
          actions.triggerToast(`📍 GPS Coordinates Pinned: ${lat}°N, ${lng}°E`);
        },
        (error) => {
          console.warn('Geolocation fallback:', error.message);
          const fallbackLat = (9.0820 + (Math.random() * 0.1)).toFixed(4);
          const fallbackLng = (8.6753 + (Math.random() * 0.1)).toFixed(4);
          const latEl = document.getElementById('farmLat');
          const lngEl = document.getElementById('farmLng');
          if (latEl) latEl.value = fallbackLat;
          if (lngEl) lngEl.value = fallbackLng;
          actions.triggerToast(`📍 GPS Pin set at ${fallbackLat}°N, ${fallbackLng}°E`);
        }
      );
    } else {
      actions.triggerToast('📍 GPS Pin set at 11.1500°N, 7.6500°E (Zaria Agricultural Zone)');
    }
  },

  // Real File Upload Handler
  handleDocumentUpload(docType, event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    actions.triggerToast(`📄 Uploading ${file.name}...`);
    const docName = file.name;
    const fakeFileUrl = URL.createObjectURL(file);

    fetch('/api/farmers/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documentType: docType, documentName: docName, documentUrl: fakeFileUrl })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success && state.mockData.farmerVerificationApp) {
        state.mockData.farmerVerificationApp.documents = state.mockData.farmerVerificationApp.documents || [];
        state.mockData.farmerVerificationApp.documents.push({
          type: docType,
          name: docName,
          url: fakeFileUrl
        });
      }
      actions.triggerToast(`✓ ${docName} uploaded securely!`);
      renderApp();
    })
    .catch(() => {
      if (state.mockData.farmerVerificationApp) {
        state.mockData.farmerVerificationApp.documents = state.mockData.farmerVerificationApp.documents || [];
        state.mockData.farmerVerificationApp.documents.push({
          type: docType,
          name: docName,
          url: fakeFileUrl
        });
      }
      actions.triggerToast(`✓ ${docName} uploaded securely!`);
      renderApp();
    });
  },

  // Verification Actions
  submitFarmerVerification() {
    state.mockData.farmerVerificationApp.status = 'PENDING_REVIEW';
    state.mockData.farmerVerificationApp.submitted_at = new Date().toISOString();
    state.mockData.farmerVerificationApp.id = state.mockData.farmerVerificationApp.id || `ver-${Date.now()}`;
    actions.triggerToast('📋 Farm verification application submitted! Admin review in progress (18-24 hrs).');
    renderApp();
  },

  // Farmer: Resubmit after CHANGES_REQUIRED
  resubmitVerification() {
    const app = state.mockData.farmerVerificationApp;
    if (app && app.status === 'CHANGES_REQUIRED') {
      app.status = 'PENDING_REVIEW';
      app.submitted_at = new Date().toISOString();
      app.changes_requested_notes = null;
      actions.triggerToast('📋 Updated application resubmitted for admin review!');
      renderApp();
    }
  },

  // Farmer: Re-apply after REJECTED
  reapplyVerification() {
    state.mockData.farmerVerificationApp = {
      status: 'DRAFT',
      sectionCompletion: { personal: false, farm: false, location: false, documents: false, photos: false }
    };
    actions.triggerToast('📝 New verification application started. Complete all sections to submit.');
    renderApp();
  },

  openAdminReview(verificationId) {
    const dossier = state.mockData.adminVerifications.find(v => v.id === verificationId);
    state.adminReviewDossier = dossier || state.mockData.adminVerifications[0];
    // Auto-transition PENDING_REVIEW → UNDER_REVIEW when admin opens the dossier
    if (state.adminReviewDossier && state.adminReviewDossier.status === 'PENDING_REVIEW') {
      const prevStatus = state.adminReviewDossier.status;
      state.adminReviewDossier.status = 'UNDER_REVIEW';
      state.adminReviewDossier.reviewed_by = 'admin@agrein.ng';
      state.mockData.verificationAuditLogs.unshift({
        id: `log-${Date.now()}`,
        verification_id: state.adminReviewDossier.id,
        farmer_name: state.adminReviewDossier.farmer_name,
        admin_email: 'admin@agrein.ng',
        action: 'STARTED_REVIEW',
        previous_status: prevStatus,
        new_status: 'UNDER_REVIEW',
        reason: 'Admin opened dossier for review.',
        created_at: new Date().toISOString()
      });
    }
    state.currentView = 'admin-review';
    renderApp();
  },

  adminApproveFarmer(id) {
    const v = state.mockData.adminVerifications.find(app => app.id === id);
    if (v) {
      const prevStatus = v.status;
      v.status = 'APPROVED';
      v.reviewed_at = new Date().toISOString();
      v.reviewed_by = 'admin@agrein.ng';
      state.mockData.verificationAuditLogs.unshift({
        id: `log-${Date.now()}`,
        verification_id: v.id,
        farmer_name: v.farmer_name,
        admin_email: 'admin@agrein.ng',
        action: 'APPROVED',
        previous_status: prevStatus,
        new_status: 'APPROVED',
        reason: 'Farm location and documents confirmed legitimate.',
        created_at: new Date().toISOString()
      });
      actions.triggerToast(`🟢 Farmer ${v.farmer_name} APPROVED! Verified Producer badge awarded.`);
      renderApp();
    }
  },

  adminRequestChanges(id) {
    state.adminActionTargetId = id;
    state.adminActionType = 'REQUEST_CHANGES';
    state.adminActionReasonText = 'Please upload a clearer image of your government-issued ID card.';
    state.adminActionModalActive = true;
    renderApp();
  },

  adminRejectFarmer(id) {
    state.adminActionTargetId = id;
    state.adminActionType = 'REJECT';
    state.adminActionReasonText = 'Land ownership deed could not be verified against state land registry.';
    state.adminActionModalActive = true;
    renderApp();
  },

  adminSuspendFarmer(id) {
    state.adminActionTargetId = id;
    state.adminActionType = 'SUSPEND';
    state.adminActionReasonText = 'Quality dispute reported on crop harvest batch under investigation.';
    state.adminActionModalActive = true;
    renderApp();
  },

  closeAdminActionModal() {
    state.adminActionModalActive = false;
    state.adminActionTargetId = null;
    state.adminActionType = null;
    state.adminActionReasonText = '';
    renderApp();
  },

  confirmAdminAction() {
    const id = state.adminActionTargetId;
    const type = state.adminActionType;
    const reason = document.getElementById('adminReasonInput')?.value?.trim() || state.adminActionReasonText;

    if (!reason) {
      actions.triggerToast('❌ Please provide a detailed decision note.');
      return;
    }

    // Deletion-request actions short-circuit; they target a user, not a verification.
    if (type === 'APPROVE_DELETION' || type === 'REJECT_DELETION') {
      const decision = type === 'APPROVE_DELETION' ? 'APPROVE' : 'CANCEL';
      actions.adminResolveDeletionRequest(id, decision, reason);
      state.adminActionModalActive = false;
      state.adminActionTargetId = null;
      state.adminActionType = null;
      state.adminActionReasonText = '';
      renderApp();
      return;
    }

    const v = state.mockData.adminVerifications.find(app => app.id === id);
    if (!v) return;

    const prevStatus = v.status;
    v.reviewed_at = new Date().toISOString();
    v.reviewed_by = 'admin@agrein.ng';

    if (type === 'REQUEST_CHANGES') {
      v.status = 'CHANGES_REQUIRED';
      v.changes_requested_notes = reason;
      state.mockData.verificationAuditLogs.unshift({
        id: `log-${Date.now()}`,
        verification_id: v.id,
        farmer_name: v.farmer_name,
        admin_email: 'admin@agrein.ng',
        action: 'REQUESTED_CHANGES',
        previous_status: prevStatus,
        new_status: 'CHANGES_REQUIRED',
        reason,
        created_at: new Date().toISOString()
      });
      actions.triggerToast(`🟠 Requested changes for ${v.farmer_name}.`);
    } else if (type === 'REJECT') {
      v.status = 'REJECTED';
      v.rejection_reason = reason;
      state.mockData.verificationAuditLogs.unshift({
        id: `log-${Date.now()}`,
        verification_id: v.id,
        farmer_name: v.farmer_name,
        admin_email: 'admin@agrein.ng',
        action: 'REJECTED',
        previous_status: prevStatus,
        new_status: 'REJECTED',
        reason,
        created_at: new Date().toISOString()
      });
      actions.triggerToast(`🔴 Farmer application REJECTED.`);
    } else if (type === 'SUSPEND') {
      v.status = 'SUSPENDED';
      v.admin_notes = `SUSPENDED: ${reason}`;
      state.mockData.verificationAuditLogs.unshift({
        id: `log-${Date.now()}`,
        verification_id: v.id,
        farmer_name: v.farmer_name,
        admin_email: 'admin@agrein.ng',
        action: 'SUSPENDED',
        previous_status: prevStatus,
        new_status: 'SUSPENDED',
        reason,
        created_at: new Date().toISOString()
      });
      actions.triggerToast(`🔴 Farmer ${v.farmer_name} SUSPENDED.`);
    }

    state.adminActionModalActive = false;
    state.adminActionTargetId = null;
    state.adminActionType = null;
    state.adminActionReasonText = '';
    renderApp();
  },

  adminReinstateFarmer(id) {
    const v = state.mockData.adminVerifications.find(app => app.id === id);
    if (v) {
      v.status = 'APPROVED';
      state.mockData.verificationAuditLogs.unshift({
        id: `log-${Date.now()}`,
        verification_id: v.id,
        farmer_name: v.farmer_name,
        admin_email: 'admin@agrein.ng',
        action: 'REINSTATED',
        previous_status: 'SUSPENDED',
        new_status: 'APPROVED',
        reason: 'Reinstated after quality review.',
        created_at: new Date().toISOString()
      });
      actions.triggerToast(`🟢 Farmer ${v.farmer_name} reinstated.`);
      renderApp();
    }
  },

  // Dispute Actions
  openDisputeModal() {
    state.disputeModalActive = true;
    renderApp();
  },

  closeDisputeModal() {
    state.disputeModalActive = false;
    renderApp();
  },

  submitDispute() {
    actions.triggerToast('🛡️ Buyer protection dispute filed! Escrow funds locked pending investigation.');
  },

  setSelectedCategory(cat) {
    state.selectedCategory = cat;
    renderApp();
  },

  setSelectedState(st) {
    state.selectedState = st;
    renderApp();
  },

  setSearchFilter(query) {
    state.searchFilter = query;
    renderApp();
  },

  toggleOrganicFilter() {
    state.organicOnlyFilter = !state.organicOnlyFilter;
    renderApp();
  },

  resetFilters() {
    state.selectedCategory = 'All';
    state.selectedState = 'All';
    state.searchFilter = '';
    state.organicOnlyFilter = false;
    renderApp();
  },

  toggleWishlist(productId) {
    const idx = state.wishlist.indexOf(productId);
    if (idx >= 0) {
      state.wishlist.splice(idx, 1);
      actions.triggerToast('Removed item from saved wishlist');
    } else {
      state.wishlist.push(productId);
      actions.triggerToast('Saved item to your wishlist ❤️');
    }
    renderApp();
  },

  toggleCartDrawer() {
    state.cartOpen = !state.cartOpen;
    renderApp();
  },

  toggleMobileMenu() {
    state.mobileMenuOpen = !state.mobileMenuOpen;
    renderApp();
  },

  closeMobileMenu() {
    state.mobileMenuOpen = false;
    renderApp();
  },

  // Helper: navigate from mobile menu and close it in one shot
  setViewAndCloseMobile(view) {
    state.currentView = view;
    state.mobileMenuOpen = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    renderApp();
  },

  toggleNavbarMenu() {
    state.navbarMenuOpen = !state.navbarMenuOpen;
    renderApp();
  },

  closeNavbarMenu() {
    state.navbarMenuOpen = false;
    renderApp();
  },

  openChangePasswordModal() {
    if (!state.currentUser) {
      actions.openAuthModal('login');
      return;
    }
    state.changePasswordModalActive = true;
    state.navbarMenuOpen = false;
    renderApp();
  },

  closeChangePasswordModal() {
    state.changePasswordModalActive = false;
    renderApp();
  },

  // ===== ACCOUNT SETTINGS / DELETION =====
  setDeletionReason(text) {
    state.deletionReasonText = text;
  },

  requestAccountDeletion(reason) {
    if (!state.currentUser) {
      actions.openAuthModal('login');
      return;
    }
    state.deletionSubmitting = true;
    renderApp();
    fetch('/api/auth/request-deletion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-email': state.currentUser.email
      },
      body: JSON.stringify({ reason: reason || '' })
    })
    .then(res => res.json().then(body => ({ status: res.status, body })))
    .then(({ status, body }) => {
      state.deletionSubmitting = false;
      if (status === 200 && body.success) {
        state.currentUser.deletion_pending = true;
        state.currentUser.deletion_requested_at = new Date().toISOString();
        state.currentUser.deletion_scheduled_for = body.scheduledFor;
        state.currentUser.deletion_request_reason = reason || 'No reason provided.';
        state.deletionReasonText = '';
        actions.triggerToast(`⚠️ Deletion requested. Account will be purged on ${new Date(body.scheduledFor).toDateString()}.`);
        renderApp();
      } else {
        actions.triggerToast(`❌ ${body.message || 'Could not request deletion.'}`);
        renderApp();
      }
    })
    .catch(() => {
      state.deletionSubmitting = false;
      actions.triggerToast('❌ Could not reach the server. Check your connection and try again.');
      renderApp();
    });
  },

  cancelAccountDeletion() {
    if (!state.currentUser) return;
    fetch('/api/auth/cancel-deletion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-email': state.currentUser.email
      }
    })
    .then(res => res.json().then(body => ({ status: res.status, body })))
    .then(({ status, body }) => {
      if (status === 200 && body.success) {
        delete state.currentUser.deletion_pending;
        delete state.currentUser.deletion_requested_at;
        delete state.currentUser.deletion_scheduled_for;
        delete state.currentUser.deletion_request_reason;
        actions.triggerToast('✅ Deletion request cancelled. Your account is restored.');
        renderApp();
      } else {
        actions.triggerToast(`❌ ${body.message || 'Could not cancel deletion.'}`);
      }
    })
    .catch(() => actions.triggerToast('❌ Could not reach the server.'));
  },

  // ===== ADMIN: deletion queue =====
  loadAdminDeletionQueue() {
    if (!state.currentUser || state.currentUser.role !== 'ADMIN') return;
    fetch('/api/admin/deletion-requests', {
      headers: {
        'x-user-role': 'ADMIN',
        'x-user-id': state.currentUser.id || ''
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data && data.success) {
        state.deletionRequests = data.requests || [];
        state.deletionRequestsLoaded = true;
        renderApp();
      }
    })
    .catch(() => { /* swallow; queue shows empty */ });
  },

  adminResolveDeletionRequest(userId, decision, reason) {
    if (!state.currentUser || state.currentUser.role !== 'ADMIN') return;
    fetch(`/api/admin/deletion-requests/${userId}/resolve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-role': 'ADMIN',
        'x-user-id': state.currentUser.id || ''
      },
      body: JSON.stringify({ decision, reason })
    })
    .then(res => res.json().then(body => ({ status: res.status, body })))
    .then(({ status, body }) => {
      if (status === 200 && body.success) {
        if (decision === 'APPROVE') {
          actions.triggerToast(`🗑️ Account ${body.purgedUser?.email || userId} permanently removed.`);
        } else {
          actions.triggerToast(`✅ Deletion rejected. Account ${body.restoredUser?.email || userId} restored.`);
        }
        // Refresh queue and re-render
        actions.loadAdminDeletionQueue();
      } else {
        actions.triggerToast(`❌ ${body.message || 'Could not resolve deletion.'}`);
      }
    })
    .catch(() => actions.triggerToast('❌ Could not reach the server.'));
  },

  adminOpenDeletionAction(userId, type) {
    state.adminActionTargetId = userId;
    state.adminActionType = type; // 'APPROVE_DELETION' or 'REJECT_DELETION'
    state.adminActionReasonText = type === 'APPROVE_DELETION'
      ? 'Confirmed data retention policy met. Approving permanent account removal.'
      : 'Deletion request denied. Account restored to active status.';
    state.adminActionModalActive = true;
    renderApp();
  },

  // ===== end ACCOUNT SETTINGS / DELETION =====

  submitChangePassword(currentPassword, newPassword, confirmPassword) {
    if (!state.currentUser) {
      actions.triggerToast('❌ You must be logged in to change your password.');
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      actions.triggerToast('❌ Please fill in all password fields.');
      return;
    }
    if (newPassword.length < 8) {
      actions.triggerToast('❌ New password must be at least 8 characters long.');
      return;
    }
    if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword) || !/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      actions.triggerToast('❌ New password must include upper, lower, digit, and special characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      actions.triggerToast('❌ New password and confirmation do not match.');
      return;
    }
    if (newPassword === currentPassword) {
      actions.triggerToast('❌ Your new password must be different from your current password.');
      return;
    }

    fetch('/api/auth/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-email': state.currentUser.email
      },
      body: JSON.stringify({ currentPassword, newPassword })
    })
    .then(res => res.json().then(body => ({ status: res.status, body })))
    .then(({ status, body }) => {
      if (status === 200 && body.success) {
        actions.triggerToast('🔐 Password updated successfully.');
        state.changePasswordModalActive = false;
        renderApp();
      } else {
        actions.triggerToast(`❌ ${body.message || 'Could not update password.'}`);
      }
    })
    .catch(() => {
      actions.triggerToast('❌ Could not reach the server. Check your connection and try again.');
    });
  },

  openProductModal(productId) {
    const prod = state.mockData.products.find(p => p.id === productId);
    state.activeModalProductId = productId;
    state.modalQty = prod ? prod.minQty : 10;
    renderApp();
  },

  closeProductModal() {
    state.activeModalProductId = null;
    renderApp();
  },

  setModalQty(qty) {
    state.modalQty = Math.max(1, qty);
    renderApp();
  },

  updateModalQty(delta) {
    state.modalQty = Math.max(1, state.modalQty + delta);
    renderApp();
  },

  addToCart(productId) {
    const prod = state.mockData.products.find(p => p.id === productId);
    if (!prod) return;
    const existing = state.cart.find(i => i.id === productId);
    if (existing) {
      existing.cartQty += prod.minQty;
    } else {
      state.cart.push({ ...prod, cartQty: prod.minQty });
    }
    actions.triggerToast(`Added ${prod.minQty} ${prod.unit}s of ${prod.title} to cart`);
    renderApp();
  },

  addToCartFromModal(productId, qty) {
    const prod = state.mockData.products.find(p => p.id === productId);
    if (!prod) return;
    const existing = state.cart.find(i => i.id === productId);
    if (existing) {
      existing.cartQty += qty;
    } else {
      state.cart.push({ ...prod, cartQty: qty });
    }
    state.activeModalProductId = null;
    state.cartOpen = true;
    actions.triggerToast(`Added ${qty} ${prod.unit}s to cart`);
    renderApp();
  },

  removeFromCart(productId) {
    state.cart = state.cart.filter(i => i.id !== productId);
    actions.triggerToast('Item removed from cart');
    renderApp();
  },

  updateCartQty(productId, delta) {
    const item = state.cart.find(i => i.id === productId);
    if (item) {
      item.cartQty = Math.max(1, item.cartQty + delta);
      renderApp();
    }
  },

  openChatDrawer(recipient) {
    state.chatRecipient = recipient || 'Mallam Ibrahim Bello';
    state.chatActive = true;
    renderApp();
  },

  closeChatDrawer() {
    state.chatActive = false;
    renderApp();
  },

  setChatInputText(text) {
    state.chatInputText = text;
  },

  sendChatMessage() {
    if (!state.chatInputText.trim()) return;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    state.chatMessages.push({ sender: 'you', text: state.chatInputText, time });
    state.chatInputText = '';
    renderApp();

    setTimeout(() => {
      state.chatMessages.push({
        sender: 'them',
        text: 'Thank you for reaching out! We are preparing the cold chain shipment. I will update your dispatch tracking code.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      renderApp();
    }, 1200);
  },

  initiateInterswitchCheckout(amount, title) {
    state.interswitchCheckoutActive = true;
    state.interswitchCheckoutAmount = amount;
    state.interswitchItemTitle = title;
    state.interswitchMethod = 'inline';
    state.interswitchProcessing = false;
    state.interswitchSuccess = false;
    renderApp();
  },

  launchInterswitchInlineSDK(txnRef, amountInKobo) {
    const samplePaymentRequest = {
      merchant_code: 'MX179463',
      pay_item_id: '7974853',
      pay_item_name: state.interswitchItemTitle || 'Agrein Harvest Produce',
      txn_ref: txnRef || `AGR-ISW-${Date.now()}`,
      amount: amountInKobo || Math.round((state.interswitchCheckoutAmount || 0) * 100),
      currency: 566,
      cust_name: 'Dr. Anita Okonjo',
      cust_email: 'buyer@agrein.com',
      site_redirect_url: window.location.href,
      mode: 'LIVE',
      onComplete: function(response) {
        console.log('Interswitch Live Inline Checkout Response:', response);
        actions.executeInterswitchPayment();
      }
    };

    if (window.webpayCheckout && typeof window.webpayCheckout === 'function') {
      try {
        window.webpayCheckout(samplePaymentRequest);
        actions.triggerToast('💳 Interswitch Inline Checkout Widget launched!');
      } catch (err) {
        console.warn('Interswitch SDK popup notice:', err.message);
        actions.executeInterswitchPayment();
      }
    } else {
      actions.triggerToast('Simulating Interswitch Inline Checkout payment...');
      actions.executeInterswitchPayment();
    }
  },

  setInterswitchMethod(method) {
    state.interswitchMethod = method;
    renderApp();
  },

  closeInterswitchCheckout() {
    state.interswitchCheckoutActive = false;
    renderApp();
  },

  executeInterswitchPayment() {
    state.interswitchProcessing = true;
    renderApp();

    setTimeout(() => {
      state.interswitchProcessing = false;
      state.interswitchSuccess = true;
      state.cart = [];
      actions.triggerToast('🎉 Interswitch Payment Approved! Escrow locked. Farmer notified.');
      renderApp();
    }, 1500);
  },

  runAIForecast(crop, st) {
    state.aiSelectedCrop = crop;
    state.aiSelectedState = st;
    const base = crop === 'Yellow Maize' ? 480 : (crop === 'Benue Yam' ? 1950 : 850);
    const forecast = Math.round(base * 1.09);

    state.aiForecastResult = {
      crop,
      state: st,
      confidence_score: '95.2%',
      current_avg_price: base,
      forecasted_price_per_unit: forecast,
      ai_recommendation: `High demand projected in ${st} State next 2-3 weeks due to harvest seasonality. Hold inventory for optimal margin.`,
      historical_months: [
        { month: 'May', price: Math.round(base * 0.85) },
        { month: 'Jun', price: Math.round(base * 0.90) },
        { month: 'Jul', price: Math.round(base * 0.95) },
        { month: 'Aug', price: base },
        { month: 'Sep (Forecast)', price: forecast },
        { month: 'Oct (Forecast)', price: Math.round(forecast * 1.05) }
      ]
    };
    renderApp();
  },

  triggerToast(msg) {
    state.toastMessage = msg;
    renderApp();
    setTimeout(() => {
      state.toastMessage = null;
      renderApp();
    }, 3500);
  }
};

// Render Main App
function renderApp() {
  const appContainer = document.getElementById('app');
  if (!appContainer) return;

  let bodyContent = '';
  switch (state.currentView) {
    case 'landing':
      bodyContent = renderHero(state, actions) + renderProductCatalog(state, actions) + renderAIPredictor(state, actions);
      break;
    case 'marketplace':
      bodyContent = renderProductCatalog(state, actions);
      break;
    case 'ai-insights':
      bodyContent = renderAIPredictor(state, actions);
      break;
    case 'nearby-farms':
      bodyContent = renderNearbyFarms(state, actions);
      break;
    case 'farmer-dashboard':
      bodyContent = renderFarmerDashboard(state, actions);
      break;
    case 'buyer-dashboard':
      bodyContent = renderBuyerDashboard(state, actions);
      break;
    case 'admin-dashboard':
      bodyContent = renderAdminDashboard(state, actions);
      break;

    // === ECOSYSTEM & VERIFICATION VIEWS ===
    case 'farmer-verification':
      bodyContent = renderFarmerVerificationView(state, actions);
      break;
    case 'admin-verification':
      bodyContent = renderAdminVerificationDashboard(state, actions);
      break;
    case 'admin-review':
      bodyContent = renderAdminReviewScreen(state, actions);
      break;
    case 'rfq-board':
      bodyContent = renderReverseMarketplace(state, actions);
      break;
    case 'commodity-index':
      bodyContent = renderCommodityIndex(state, actions);
      break;
    case 'agro-doctor':
      bodyContent = renderAgroDoctorAI(state, actions);
      break;
    case 'weather':
      bodyContent = renderWeatherDashboard(state, actions);
      break;
    case 'cooperatives':
      bodyContent = renderCooperatives(state, actions);
      break;
    case 'forum':
      bodyContent = renderCommunityForum(state, actions);
      break;
    case 'learning-center':
      bodyContent = renderLearningCenter(state, actions);
      break;
    case 'wallet':
      bodyContent = renderDigitalWallet(state, actions);
      break;
    case 'logistics':
      bodyContent = renderSmartLogistics(state, actions);
      break;
    case 'export-trade':
      bodyContent = renderExportMarketplace(state, actions);
      break;
    case 'bulk-b2b':
      bodyContent = renderBulkB2B(state, actions);
      break;
    case 'subscriptions':
      bodyContent = renderSubscriptionPlans(state, actions);
      break;
    case 'traceability':
      bodyContent = renderTraceabilityView(state, actions);
      break;

    // === ACCOUNT SETTINGS ===
    case 'account-settings':
      bodyContent = renderAccountSettings(state, actions);
      break;

    default:
      bodyContent = renderHero(state, actions) + renderProductCatalog(state, actions);
  }

  appContainer.innerHTML = `
    <div class="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-gray-100 transition-colors">
      
      <!-- Toast Notification Bar -->
      ${state.toastMessage ? `
        <div class="fixed top-24 right-4 z-50 px-5 py-3 rounded-2xl bg-emerald-800 text-white font-extrabold text-xs shadow-2xl border border-emerald-400/30 flex items-center space-x-2 animate-bounce">
          <i class="fa-solid fa-circle-check text-amber-300 text-sm"></i>
          <span>${state.toastMessage}</span>
        </div>
      ` : ''}

      <!-- Navbar -->
      ${renderNavbar(state, actions)}

      <!-- Ecosystem Navigation Strip -->
      ${renderEcosystemNav(state, actions)}

      <!-- Main Body Content -->
      <main class="flex-grow">
        ${bodyContent}
      </main>

      <!-- Drawers & Modals -->
      ${renderCartDrawer(state, actions)}
      ${renderProductModal(state, actions)}
      ${renderCheckoutModal(state, actions)}
      ${renderChatDrawer(state, actions)}
      ${renderAuthModal(state, actions)}
      ${renderChangePasswordModal(state, actions)}
      ${renderBuyerDisputeModal(state, actions)}
      ${renderAdminActionModal(state, actions)}

      <!-- Footer -->
      ${renderFooter(state, actions)}

    </div>
  `;
}

// Admin Decision Note Modal Component
function renderAdminActionModal(state, actions) {
  if (!state.adminActionModalActive) return '';

  const type = state.adminActionType; // 'REQUEST_CHANGES', 'REJECT', 'SUSPEND'
  const config = {
    'REQUEST_CHANGES': { title: 'Request Application Changes', icon: 'fa-pen-to-square', color: 'orange', btnText: 'Request Changes', bg: 'bg-orange-600' },
    'REJECT': { title: 'Reject Verification Application', icon: 'fa-circle-xmark', color: 'red', btnText: 'Reject Application', bg: 'bg-red-600' },
    'SUSPEND': { title: 'Suspend Verified Farmer', icon: 'fa-ban', color: 'red', btnText: 'Suspend Farmer', bg: 'bg-red-700' },
    'APPROVE_DELETION': { title: 'Approve Account Deletion (Permanent)', icon: 'fa-trash-can', color: 'red', btnText: 'Approve & Purge', bg: 'bg-red-700' },
    'REJECT_DELETION': { title: 'Reject Account Deletion (Restore)', icon: 'fa-rotate-left', color: 'emerald', btnText: 'Restore Account', bg: 'bg-emerald-700' }
  }[type] || { title: 'Admin Decision Note', icon: 'fa-gavel', color: 'slate', btnText: 'Confirm', bg: 'bg-emerald-700' };

  return `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div class="modal-fullscreen-mobile relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-slate-800 overflow-hidden animate-modal">
        <button onclick="actions.closeAdminActionModal()" class="absolute top-4 right-4 text-gray-400 hover:text-slate-900 dark:hover:text-white">
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>

        <div class="p-6 space-y-4">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-2xl ${config.bg} text-white flex items-center justify-center text-lg shadow-md">
              <i class="fa-solid ${config.icon}"></i>
            </div>
            <div>
              <h3 class="font-heading font-extrabold text-lg text-slate-900 dark:text-white">${config.title}</h3>
              <p class="text-xs text-gray-500">Provide an explicit, auditable reason for this moderation decision.</p>
            </div>
          </div>

          <div>
            <label class="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 block">Decision Note / Reason *</label>
            <textarea id="adminReasonInput" rows="3" class="w-full p-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Enter reason...">${state.adminActionReasonText || ''}</textarea>
          </div>

          <div class="grid grid-cols-2 gap-3 pt-2">
            <button onclick="actions.closeAdminActionModal()" class="py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 transition-all">Cancel</button>
            <button onclick="actions.confirmAdminAction()" class="py-2.5 rounded-xl ${config.bg} text-white text-xs font-bold shadow-md hover:opacity-90 transition-all">${config.btnText}</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Ecosystem Navigation Strip Component (inline)
function renderEcosystemNav(state, actions) {
  const ecosystemItems = [
    { view: 'marketplace', label: 'Marketplace', icon: 'fa-store', color: 'emerald' },
    { view: 'farmer-verification', label: 'Farm Verify', icon: 'fa-shield-halved', color: 'teal' },
    { view: 'admin-verification', label: 'Admin Verify', icon: 'fa-user-check', color: 'violet' },
    { view: 'rfq-board', label: 'RFQ Board', icon: 'fa-clipboard-list', color: 'blue' },
    { view: 'commodity-index', label: 'Price Index', icon: 'fa-chart-line', color: 'amber' },
    { view: 'agro-doctor', label: 'AI Crop Doctor', icon: 'fa-stethoscope', color: 'rose' },
    { view: 'weather', label: 'Weather', icon: 'fa-cloud-sun-rain', color: 'sky' },
    { view: 'cooperatives', label: 'Cooperatives', icon: 'fa-people-group', color: 'violet' },
    { view: 'forum', label: 'Forum', icon: 'fa-comments', color: 'orange' },
    { view: 'wallet', label: 'Wallet', icon: 'fa-wallet', color: 'green' },
    { view: 'logistics', label: 'Logistics', icon: 'fa-truck-fast', color: 'indigo' },
    { view: 'export-trade', label: 'Export', icon: 'fa-globe-africa', color: 'cyan' },
    { view: 'bulk-b2b', label: 'B2B Bulk', icon: 'fa-boxes-stacked', color: 'fuchsia' },
    { view: 'traceability', label: 'Traceability', icon: 'fa-qrcode', color: 'lime' }
  ];

  const colorMap = {
    emerald: { active: 'bg-emerald-600 text-white shadow-emerald-600/30', inactive: 'text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/30', icon: 'text-emerald-500' },
    blue: { active: 'bg-blue-600 text-white shadow-blue-600/30', inactive: 'text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/30', icon: 'text-blue-500' },
    amber: { active: 'bg-amber-600 text-white shadow-amber-600/30', inactive: 'text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/30', icon: 'text-amber-500' },
    rose: { active: 'bg-rose-600 text-white shadow-rose-600/30', inactive: 'text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/30', icon: 'text-rose-500' },
    sky: { active: 'bg-sky-600 text-white shadow-sky-600/30', inactive: 'text-sky-700 dark:text-sky-300 hover:bg-sky-50 dark:hover:bg-sky-950/30', icon: 'text-sky-500' },
    violet: { active: 'bg-violet-600 text-white shadow-violet-600/30', inactive: 'text-violet-700 dark:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-950/30', icon: 'text-violet-500' },
    orange: { active: 'bg-orange-600 text-white shadow-orange-600/30', inactive: 'text-orange-700 dark:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-950/30', icon: 'text-orange-500' },
    teal: { active: 'bg-teal-600 text-white shadow-teal-600/30', inactive: 'text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/30', icon: 'text-teal-500' },
    green: { active: 'bg-green-600 text-white shadow-green-600/30', inactive: 'text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-950/30', icon: 'text-green-500' },
    indigo: { active: 'bg-indigo-600 text-white shadow-indigo-600/30', inactive: 'text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/30', icon: 'text-indigo-500' },
    cyan: { active: 'bg-cyan-600 text-white shadow-cyan-600/30', inactive: 'text-cyan-700 dark:text-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-950/30', icon: 'text-cyan-500' },
    fuchsia: { active: 'bg-fuchsia-600 text-white shadow-fuchsia-600/30', inactive: 'text-fuchsia-700 dark:text-fuchsia-300 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-950/30', icon: 'text-fuchsia-500' },
    lime: { active: 'bg-lime-600 text-white shadow-lime-600/30', inactive: 'text-lime-700 dark:text-lime-300 hover:bg-lime-50 dark:hover:bg-lime-950/30', icon: 'text-lime-500' },
    yellow: { active: 'bg-yellow-600 text-white shadow-yellow-600/30', inactive: 'text-yellow-700 dark:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-950/30', icon: 'text-yellow-500' }
  };

  return `
    <div class="sticky top-20 z-30 w-full glass-panel border-b border-emerald-900/5 dark:border-white/5">
      <div class="max-w-7xl mx-auto px-2 sm:px-4">
        <div class="flex items-center overflow-x-auto py-2 space-x-1 scrollbar-hide" style="scrollbar-width: none; -ms-overflow-style: none;">
          ${ecosystemItems.map(item => {
            const isActive = state.currentView === item.view;
            const colors = colorMap[item.color];
            return `
              <button onclick="actions.setView('${item.view}')" 
                class="flex-shrink-0 flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${isActive ? colors.active + ' shadow-md' : colors.inactive}">
                <i class="fa-solid ${item.icon} ${isActive ? '' : colors.icon} text-[10px]"></i>
                <span>${item.label}</span>
              </button>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}

// Initial Boot
document.addEventListener('DOMContentLoaded', () => {
  renderApp();

  // Close any open overlay (mobile menu, modals, drawers) on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (state.mobileMenuOpen) {
        state.mobileMenuOpen = false;
        renderApp();
      }
      if (state.cartOpen) {
        state.cartOpen = false;
        renderApp();
      }
      if (state.chatActive) {
        state.chatActive = false;
        renderApp();
      }
      if (state.authModalActive) {
        state.authModalActive = false;
        renderApp();
      }
      if (state.activeModalProductId) {
        state.activeModalProductId = null;
        renderApp();
      }
      if (state.interswitchCheckoutActive) {
        state.interswitchCheckoutActive = false;
        renderApp();
      }
      if (state.disputeModalActive) {
        state.disputeModalActive = false;
        renderApp();
      }
      if (state.changePasswordModalActive) {
        state.changePasswordModalActive = false;
        renderApp();
      }
      if (state.navbarMenuOpen) {
        state.navbarMenuOpen = false;
        renderApp();
      }
    }
  });
});
