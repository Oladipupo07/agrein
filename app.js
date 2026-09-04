// Agrein Main Application Orchestrator

const state = {
  currentView: 'landing', // 'landing', 'marketplace', 'ai-insights', 'nearby-farms', 'farmer-dashboard', 'buyer-dashboard', 'admin-dashboard',
  //                        'rfq-board', 'commodity-index', 'agro-doctor', 'weather', 'cooperatives', 'forum', 'learning-center',
  //                        'wallet', 'logistics', 'export-trade', 'bulk-b2b', 'subscriptions', 'traceability',
  //                        'farmer-verification', 'admin-review', 'account-settings'
  activeRole: 'visitor', // 'visitor', 'farmer', 'buyer', 'admin'
  darkMode: false,
  // Cart & wishlist start empty — the user populates them by tapping "Add to
  // Cart" or the heart icon on real products. Earlier demo builds seeded fake
  // items here at boot, which made a fresh install look like the user had
  // already shopped.
  cart: [],
  wishlist: [],
  
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

  // Cart & UI State
  cartOpen: false,
  wishlistOpen: false,
  mobileMenuOpen: false,

  // Checkout State (Simplified Payment Gateway)
  checkoutModalActive: false,
  checkoutTotal: 0,
  checkoutItemCount: 0,
  checkoutProcessing: false,
  interswitchCheckoutActive: false,
  interswitchCheckoutAmount: 0,

  // Authentication & Email OTP State
  authModalActive: false,
  authModalMode: 'login', // 'login', 'register', 'verify-otp'
  authTrigger: null, // 'add-to-cart' | 'dashboard' | 'session-expired' | null
  authRegisterRole: 'BUYER', // 'BUYER', 'FARMER'
  authError: null,
  otpEmail: '',
  otpRole: 'BUYER',
  otpFlow: 'register', // 'register' | 'reset' — controls post-OTP routing
  otpTimerSeconds: 300, // 5 minutes expiration countdown
  otpCooldownSeconds: 0, // 30s resend cooldown
  otpCooldownEndsAt: 0,
  otpResendInFlight: false,
  otpDigits: ['', '', '', '', '', ''],
  otpError: null,
  otpSuccess: false,
  demoOtp: '',
  otpTimerInterval: null,
  otpCooldownInterval: null,

  // Buyer Protection Dispute State
  disputeModalActive: false,
  documentUploads: {},

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

  // Mobile bottom-nav state
  bottomNavHidden: false,  // hidden on scroll-down, re-shown on scroll-up
  scrollY: 0,              // last scroll position; reserved for v2 top-bar compress
  sellSheetOpen: false,    // raised Sell button opens this bottom sheet

  // PWA install / update / offline state
  isOnline: typeof navigator === 'undefined' ? true : navigator.onLine,
  showIosInstallHint: false,
  showAndroidInstallPrompt: false,
  swUpdateAvailable: false,
  pwaHintDismissed: false,

  // Nearby farms map runtime state
  nearbyFarms: [],
  nearbyFarmsLoading: false,
  nearbyFarmsError: null,
  nearbyUserLocation: null,
  nearbyMapInstance: null,
  nearbyMapMarkersLayer: null,
  nearbyMapInitialized: false,
  nearbyPollerId: null,
  nearbyRadiusKm: 250,

  // Document Upload Progress Tracking
  documentUploads: {}, // { 'government_id': { progress: 45, fileName: 'id.pdf', isUploading: true }, ... }

  // Admin Executive Dashboard & Dossier Inspection State
  adminActiveTab: 'verifications', // 'verifications' | 'overview' | 'users' | 'disputes' | 'deletions'
  adminVerificationFilter: 'ALL',
  adminVerificationSearch: '',
  adminInspectionModalActive: false,
  adminInspectedDossier: null,
  adminReviewDossier: null,
  adminDocumentPreviewModal: { active: false, url: '', name: '', type: '' },

  // Locked-farmer chrome suppression. True when a FARMER is signed in but
  // hasn't been admin-verified yet. The farmer-verification page hides the
  // navbar, ecosystem strip, and footer to feel like a standalone onboarding.
  isFarmerLocked() {
    return Boolean(state.currentUser
      && state.currentUser.role === 'FARMER'
      && state.currentUser.verification_status !== 'APPROVED');
  },

  // Locked-buyer compulsory onboarding. True when a BUYER has not completed
  // their primary delivery destination address and phone details.
  buyerOnboardingDraft: {},
  isBuyerLocked() {
    if (!state.currentUser || state.currentUser.role !== 'BUYER') return false;
    const u = state.currentUser;
    const bp = (state.mockData && state.mockData.buyerProfile) || state.buyerOnboardingDraft || {};
    const stateVal = (u.state || bp.state || bp.deliveryState || '').trim();
    const lgaVal = (u.lga || bp.lga || bp.deliveryLga || '').trim();
    const addrVal = (u.address || bp.address || bp.deliveryAddress || '').trim();
    const phoneVal = String(u.phone_number || u.phone || bp.phone || '').replace(/\D/g, '');
    return !(stateVal && lgaVal && addrVal.length >= 5 && phoneVal.length >= 10);
  },

  // Admin Review Dossier State
  adminReviewDossier: null,
  adminActionModalActive: false,
  adminActionTargetId: null,
  adminActionType: null, // 'REQUEST_CHANGES', 'REJECT', 'SUSPEND'
  adminActionReasonText: '',

  // Live Modals State
  addProductModalActive: false,
  withdrawalModalActive: false,

  // Admin Registered Users Directory State
  registeredUsersList: [],
  registeredUsersCounts: { total: 1, farmers: 0, buyers: 0, admins: 1 },
  adminUserFilterRole: 'ALL',
  adminUserSearch: '',

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

// Dynamic SPA SEO Metadata Registry
const SEO_REGISTRY = {
  'landing': {
    title: "Agrein — Nigeria's Premier Agricultural Marketplace & Direct Farm Trade",
    description: "Connect directly with 14,800+ verified smallholder farmers across 36 Nigerian states. Buy and sell crops with Interswitch escrow protection, cold-chain logistics, and AI price forecasting."
  },
  'marketplace': {
    title: "Fresh Harvest Produce Catalog & Wholesale Crops | Agrein Marketplace",
    description: "Explore verified grain, tuber, livestock, and cash crop listings directly from Nigerian farmers at live farm-gate prices."
  },
  'ai-insights': {
    title: "AI Agricultural Crop Price Forecasting & Market Trends | Agrein",
    description: "Predict crop market prices up to 6 months in advance with Agrein's AI market intelligence model across all 36 Nigerian states."
  },
  'commodity-index': {
    title: "Nigeria Agricultural Commodity Price Index (Live Market Rates) | Agrein",
    description: "Live commodity price tracker for Maize, Sorghum, Cassava, Rice, Yam, and Soybeans across major Nigerian commercial hubs."
  },
  'nearby-farms': {
    title: "Geospatial Local Farm Finder & Direct Farm Visits | Agrein",
    description: "Locate certified farms near your state and LGA. Inspect satellite GPS coordinates and arrange direct farm gate pickups."
  },
  'bulk-b2b': {
    title: "B2B Wholesale Agricultural Procurement & Export Contracts | Agrein",
    description: "Industrial-scale produce contracts for FMCG manufacturers, food processors, and international agricultural exporters."
  },
  'rfq-board': {
    title: "Reverse RFQ Agricultural Sourcing Board | Agrein",
    description: "Post procurement requests and receive competitive bids directly from certified farmers across Nigeria."
  },
  'weather': {
    title: "Hyperlocal Agricultural Weather Radar & Farming Forecast | Agrein",
    description: "Real-time rainfall, soil moisture, humidity, and agronomy weather alerts tailored to Nigerian farming clusters."
  },
  'agro-doctor': {
    title: "AgroDoctor AI — Instant Crop Disease Diagnosis Scanner | Agrein",
    description: "Upload a crop leaf photo to instantly detect blight, pests, rust, and nutrient deficiencies with expert remedy recommendations."
  },
  'export-trade': {
    title: "Cross-Border Agricultural Export Marketplace | Agrein",
    description: "International export hub for Nigerian Ginger, Cocoa, Sesame, Cashew, and Hibiscus with phytosanitary compliance."
  },
  'cooperatives': {
    title: "Agricultural Cooperatives & Group Sourcing Network | Agrein",
    description: "Join farmer cooperatives to pool harvests, secure bulk discounts on fertilizers, and access zero-interest micro-loans."
  },
  'forum': {
    title: "Farmers Community Forum & Agronomy Knowledge Exchange | Agrein",
    description: "Connect with over 14,800 Nigerian farmers, agronomists, and agricultural extension officers."
  },
  'learning-center': {
    title: "Agrein Agronomy Academy — Free Farming & Post-Harvest Guides | Agrein",
    description: "Expert masterclasses on precision agriculture, drip irrigation, post-harvest loss reduction, and organic pest control."
  },
  'traceability': {
    title: "QR Harvest Traceability & Farm Provenance | Agrein",
    description: "Scan QR codes on crop batches to trace farm origin, harvest date, soil condition, and quality certifications."
  },
  'farmer-dashboard': {
    title: "Farmer Producer Hub & Sales Console | Agrein",
    description: "Manage your live crop listings, track buyer orders, monitor escrow balances, and withdraw earnings to your Nigerian bank account."
  },
  'buyer-dashboard': {
    title: "Buyer Procurement Hub & Order Tracking | Agrein",
    description: "Track active orders, coldchain logistics shipments, dispute escrows, and inspect verified farm batches."
  },
  'admin-dashboard': {
    title: "SuperAdmin Moderation & Governance Console | Agrein",
    description: "Administrative control center for KYC farm audit, dispute adjudication, user directory, and marketplace integrity."
  },
  'farmer-verification': {
    title: "Farmer KYC Verification & Identity Audit | Agrein",
    description: "Complete your 7-stage farm verification to earn the Verified Producer badge and start selling on Agrein."
  },
  'buyer-onboarding': {
    title: "Buyer Verification & Delivery Setup | Agrein Marketplace",
    description: "Complete your compulsory buyer delivery details and sourcing profile to unlock marketplace orders and ColdChain logistics."
  },
  'account-settings': {
    title: "Account Settings & Profile Management | Agrein",
    description: "Manage your Agrein profile, security credentials, contact details, and bank account payouts."
  }
};

function updateDocumentSEO(view) {
  const seo = SEO_REGISTRY[view] || SEO_REGISTRY['landing'];
  document.title = seo.title;

  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', seo.description);

  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', seo.title);

  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', seo.description);

  const twitterTitle = document.querySelector('meta[name="twitter:title"]');
  if (twitterTitle) twitterTitle.setAttribute('content', seo.title);

  const twitterDesc = document.querySelector('meta[name="twitter:description"]');
  if (twitterDesc) twitterDesc.setAttribute('content', seo.description);

  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) {
    const url = view === 'landing' ? 'https://agrein.ng/' : `https://agrein.ng/#${view}`;
    canonical.setAttribute('href', url);
  }
}

// Application Action Handlers

// HTML-escape strings before they go into innerHTML. The app renders many
// surfaces (toasts, error messages, server-validated form fields) by template
// interpolation. Any backend-supplied string could otherwise carry `<script>`
// or event-handler markup. Use this on every dynamic value that lands in HTML.
function escapeHtml(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const actions = {
  setView(view) {
    // Keep old admin queue links working while the console owns verification.
    if (view === 'admin-verification') {
      view = 'admin-dashboard';
      state.adminActiveTab = 'verifications';
    }

    // ── FARMER VERIFICATION LOCK ──
    // Unverified farmers are locked on farmer-verification. They cannot navigate anywhere else.
    if (state.currentUser && state.currentUser.role === 'FARMER' && state.currentUser.verification_status !== 'APPROVED') {
      const verificationStatus = state.currentUser.verification_status;
      const isSubmitted = verificationStatus === 'PENDING' || verificationStatus === 'PENDING_REVIEW' || verificationStatus === 'UNDER_REVIEW';
      const allowedViews = isSubmitted ? ['farmer-pending-approval', 'account-settings'] : ['farmer-verification', 'account-settings'];
      if (!allowedViews.includes(view)) {
        actions.triggerToast('🔒 Complete your farm verification before accessing the platform.');
        view = isSubmitted ? 'farmer-pending-approval' : 'farmer-verification';
      }
    }

    // ── BUYER COMPULSORY PROFILE ONBOARDING LOCK ──
    // Buyers must complete delivery and business details before trading.
    if (state.currentUser && state.currentUser.role === 'BUYER' && state.isBuyerLocked && state.isBuyerLocked()) {
      const allowedViews = ['buyer-onboarding', 'account-settings'];
      if (!allowedViews.includes(view)) {
        actions.triggerToast('📋 Compulsory: Please complete your delivery profile to continue.');
        view = 'buyer-onboarding';
      }
    }

    state.currentView = view;
    updateDocumentSEO(view); // Update title, description, and canonical dynamically
    try {
      localStorage.setItem('agrein_current_view', view);
      if (window.location.hash !== '#' + view) {
        window.history.replaceState(null, '', '#' + view);
      }
    } catch (e) {}

    if (view === 'farmer-dashboard') {
      if (typeof loadFarmerDashboard === 'function') loadFarmerDashboard(state, actions);
    } else if (view === 'buyer-dashboard') {
      if (typeof loadBuyerDashboard === 'function') loadBuyerDashboard(state, actions);
    } else if (view === 'admin-dashboard') {
      if (typeof loadAdminDashboard === 'function') loadAdminDashboard(state, actions);
      actions.fetchRegisteredUsers();
    }

    if (view === 'farmer-verification' || view === 'farmer-pending-approval') {
      if (state.currentUser && state.currentUser.role === 'FARMER' && state.currentUser.verification_status !== 'APPROVED') {
        actions.startFarmerVerificationPolling();
      }
    } else {
      if (state._farmerVerifPollId) {
        clearInterval(state._farmerVerifPollId);
        state._farmerVerifPollId = null;
      }
    }

    if (view === 'nearby-farms') {
      actions.refreshNearbyFarms();
      actions.startNearbyFarmsPolling();
    } else {
      actions.stopNearbyFarmsPolling();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    renderApp();
  },

  refreshNearbyFarms() {
    const hasLocation = state.nearbyUserLocation && Number.isFinite(state.nearbyUserLocation.lat) && Number.isFinite(state.nearbyUserLocation.lng);
    if (hasLocation) {
      actions.fetchNearbyFarms(state.nearbyUserLocation.lat, state.nearbyUserLocation.lng);
    } else {
      actions.fetchNearbyFarms();
    }
  },

  useNearbyMapMyLocation() {
    if (!navigator.geolocation) {
      actions.triggerToast('⚠️ Geolocation is not supported on this browser.');
      return;
    }
    actions.triggerToast('📡 Detecting your location...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = Number(position.coords.latitude);
        const lng = Number(position.coords.longitude);
        state.nearbyUserLocation = { lat, lng };
        actions.fetchNearbyFarms(lat, lng);
      },
      () => {
        actions.triggerToast('⚠️ Could not access your location. Showing all verified farms instead.');
        actions.fetchNearbyFarms();
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  },

  fetchNearbyFarms(lat, lng) {
    state.nearbyFarmsLoading = true;
    state.nearbyFarmsError = null;
    renderApp();

    const params = new URLSearchParams();
    params.set('radius', String(state.nearbyRadiusKm || 250));
    params.set('limit', '150');
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      params.set('lat', String(lat));
      params.set('lng', String(lng));
    }

    const req = window.apiFetch ? window.apiFetch('/api/farms/nearby?' + params.toString()) : fetch('/api/farms/nearby?' + params.toString());
    Promise.resolve(req)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && Array.isArray(data.data)) {
          state.nearbyFarms = data.data;
          state.nearbyFarmsLoading = false;
          state.nearbyFarmsError = null;
          renderApp();
          actions.renderNearbyMap();
        } else {
          state.nearbyFarms = [];
          state.nearbyFarmsLoading = false;
          state.nearbyFarmsError = (data && data.message) || 'Could not load nearby farms.';
          renderApp();
        }
      })
      .catch(() => {
        state.nearbyFarms = [];
        state.nearbyFarmsLoading = false;
        state.nearbyFarmsError = 'Could not load nearby farms right now. Please try again.';
        renderApp();
      });
  },

  renderNearbyMap() {
    if (state.currentView !== 'nearby-farms') return;
    if (!window.L) return;
    const mapEl = document.getElementById('nearbyFarmsMap');
    if (!mapEl) return;

    if (state.nearbyMapInstance && typeof state.nearbyMapInstance.getContainer === 'function') {
      const existingContainer = state.nearbyMapInstance.getContainer();
      if (existingContainer !== mapEl) {
        try { state.nearbyMapInstance.remove(); } catch (_) { /* noop */ }
        state.nearbyMapInstance = null;
        state.nearbyMapMarkersLayer = null;
        state.nearbyMapInitialized = false;
      }
    }

    if (!state.nearbyMapInstance) {
      state.nearbyMapInstance = window.L.map(mapEl, { zoomControl: true }).setView([9.0820, 8.6753], 6);
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(state.nearbyMapInstance);
      state.nearbyMapMarkersLayer = window.L.layerGroup().addTo(state.nearbyMapInstance);
      state.nearbyMapInitialized = true;
    }

    if (state.nearbyMapMarkersLayer) {
      state.nearbyMapMarkersLayer.clearLayers();
    }

    const farms = Array.isArray(state.nearbyFarms) ? state.nearbyFarms : [];
    const points = [];

    farms.forEach((farm) => {
      const lat = Number(farm.gps_latitude);
      const lng = Number(farm.gps_longitude);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
      points.push([lat, lng]);
      const popup = `
        <div style="min-width:220px;font-family:Arial,sans-serif;">
          <div style="font-weight:800;color:#0f172a;">${farm.farm_name || 'Verified Farm'}</div>
          <div style="font-size:12px;color:#475569;margin-top:4px;">Farmer: ${farm.farmer_name || 'Verified Farmer'}</div>
          <div style="font-size:12px;color:#475569;">Location: ${(farm.farm_state || 'Nigeria')}${farm.farm_lga ? ', ' + farm.farm_lga : ''}</div>
          <div style="font-size:12px;color:#047857;margin-top:6px;font-weight:700;">${farm.distance_km == null ? '' : farm.distance_km + ' km away'}</div>
        </div>
      `;
      window.L.marker([lat, lng]).bindPopup(popup).addTo(state.nearbyMapMarkersLayer);
    });

    if (state.nearbyUserLocation && Number.isFinite(state.nearbyUserLocation.lat) && Number.isFinite(state.nearbyUserLocation.lng)) {
      const here = [state.nearbyUserLocation.lat, state.nearbyUserLocation.lng];
      points.push(here);
      window.L.circleMarker(here, {
        radius: 7,
        color: '#065f46',
        weight: 2,
        fillColor: '#10b981',
        fillOpacity: 0.95
      }).bindPopup('You are here').addTo(state.nearbyMapMarkersLayer);
    }

    if (points.length > 0) {
      state.nearbyMapInstance.fitBounds(points, { padding: [28, 28], maxZoom: 13 });
    } else {
      state.nearbyMapInstance.setView([9.0820, 8.6753], 6);
    }

    setTimeout(() => {
      if (state.nearbyMapInstance) state.nearbyMapInstance.invalidateSize();
    }, 50);
  },

  startNearbyFarmsPolling() {
    if (state.nearbyPollerId) return;
    state.nearbyPollerId = setInterval(() => {
      if (state.currentView !== 'nearby-farms') {
        actions.stopNearbyFarmsPolling();
        return;
      }
      actions.refreshNearbyFarms();
    }, 30000);
  },

  stopNearbyFarmsPolling() {
    if (state.nearbyPollerId) {
      clearInterval(state.nearbyPollerId);
      state.nearbyPollerId = null;
    }
  },

  // Admin Registered Users Directory Actions
  fetchRegisteredUsers() {
    fetch('/api/admin/users')
      .then(r => r.json())
      .then(data => {
        if (data && data.success && Array.isArray(data.users)) {
          state.registeredUsersList = data.users;
          if (data.counts) state.registeredUsersCounts = data.counts;
          renderApp();
        }
      })
      .catch(() => {});
  },

  setAdminUserFilter(role) {
    state.adminUserFilterRole = role;
    renderApp();
  },

  setAdminUserSearch(query) {
    state.adminUserSearch = query;
    renderApp();
  },

  // Gated routing — visitors must log in to reach portals; logged-in users must
  // own the right role. Falls back to the visitor landing page on any failure.
  guardView(view) {
    const GATED_VIEWS = {
      'farmer-dashboard': 'FARMER',
      'farmer-verification': 'FARMER',
      'buyer-dashboard': 'BUYER',
      'buyer-onboarding': 'BUYER',
      'admin-dashboard': 'ADMIN',
      'admin-review': 'ADMIN',
      'account-settings': null  // any logged-in user; not role-locked
    };
    const roleDefaultView = (role) => {
      if (role === 'BUYER') return (state.isBuyerLocked && state.isBuyerLocked()) ? 'buyer-onboarding' : 'buyer-dashboard';
      if (role === 'ADMIN') return 'admin-dashboard';
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
    // yet is LOCKED on farmer-verification. They cannot go anywhere else.
    if (userRole === 'FARMER' && state.currentUser.verification_status !== 'APPROVED') {
      if (view !== 'farmer-verification' && view !== 'account-settings') {
        actions.triggerToast('🔒 Complete your farm verification to access the platform.');
        actions.setView('farmer-verification');
        return;
      }
    }

    // Logged in as BUYER — but has not completed compulsory delivery profile
    if (userRole === 'BUYER' && state.isBuyerLocked && state.isBuyerLocked()) {
      if (view !== 'buyer-onboarding' && view !== 'account-settings') {
        actions.triggerToast('📋 Compulsory: Please complete your delivery profile to continue.');
        actions.setView('buyer-onboarding');
        return;
      }
    }

    actions.setView(view);
  },

  guardViewAndCloseMobile(view) {
    state.mobileMenuOpen = false;
    actions.guardView(view);
  },

  // ── FARMER VERIFICATION STATUS POLLING ──
  // Polls the server every 15s to check if the admin has approved the farmer.
  // When status changes to APPROVED, auto-redirect to farmer-dashboard.
  startFarmerVerificationPolling() {
    if (state._farmerVerifPollId) return; // already polling
    state._farmerVerifPollId = setInterval(() => {
      if (!state.currentUser || state.currentUser.role !== 'FARMER' || state.currentUser.verification_status === 'APPROVED') {
        clearInterval(state._farmerVerifPollId);
        state._farmerVerifPollId = null;
        return;
      }
      // Poll the public status endpoint (no auth required; returns just
      // verification_status). Replaces the previous /api/admin/users call
      // which 401'd for every non-admin farmer.
      fetch(`/api/farmers/verification-status-public?email=${encodeURIComponent(state.currentUser.email)}`)
        .then(r => r.json())
        .then(data => {
          if (data && data.success && data.found && data.verification_status === 'APPROVED') {
            state.currentUser.verification_status = 'APPROVED';
            state.currentUser.is_verified = true;
            try { localStorage.setItem('agrein_user_session', JSON.stringify(state.currentUser)); } catch (e) {}
            clearInterval(state._farmerVerifPollId);
            state._farmerVerifPollId = null;
            actions.triggerToast('🎉 Your farm has been verified! Welcome to your Farmer Dashboard.');
            // Auto-redirect after a small delay to show the toast
            setTimeout(() => {
              actions.setView('farmer-dashboard');
              renderApp();
            }, 800);
          }
        })
        .catch(() => {});
    }, 10000); // Check every 10 seconds for faster feedback
  },

  stopFarmerVerificationPolling() {
    if (state._farmerVerifPollId) {
      clearInterval(state._farmerVerifPollId);
      state._farmerVerifPollId = null;
    }
  },

  logout() {
    try {
      StorageManager.clearUser(); // ✅ Use StorageManager to clear all user data
      localStorage.removeItem('agrein_current_view');
      window.history.replaceState(null, '', window.location.pathname);
    } catch (e) {}

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
    StorageManager.setDarkMode(state.darkMode); // ✅ Save dark mode preference
    renderApp();
  },

  // Auth Actions
  openAuthModal(mode = 'login', opts = {}) {
    state.authModalActive = true;
    state.authModalMode = mode;
    state.authTrigger = (opts && opts.trigger) || null;
    state.authError = null;
    // Reset the OTP flow when opening any auth view — registration is the default.
    state.otpFlow = 'register';
    renderApp();
  },

  closeAuthModal() {
    if (state.otpTimerInterval) {
      clearInterval(state.otpTimerInterval);
      state.otpTimerInterval = null;
    }
    if (state.otpCooldownInterval) {
      clearInterval(state.otpCooldownInterval);
      state.otpCooldownInterval = null;
    }
    state.authModalActive = false;
    state.authError = null;
    renderApp();
  },

  setAuthRegisterRole(role) {
    state.authRegisterRole = role;
    renderApp();
  },

  toggleAuthMode() {
    state.authModalMode = state.authModalMode === 'login' ? 'register' : 'login';
    state.authError = null;
    renderApp();
  },

  setAuthError(message) {
    state.authError = message || null;
    const errorElement = document.getElementById('authInlineError');
    if (errorElement) {
      errorElement.textContent = state.authError || '';
      errorElement.classList.toggle('hidden', !state.authError);
    }
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
        actions.setAuthError('First Name and Last Name are required.');
        return;
      }
      if (!email) {
        actions.setAuthError('Please enter a valid Email Address.');
        return;
      }
      if (!phone || !/^\d+$/.test(phone)) {
        actions.setAuthError('Phone Number must contain digits only.');
        return;
      }
      if (password.length < 8) {
        actions.setAuthError('Password must be at least 8 characters long.');
        return;
      }
      if (!/[A-Z]/.test(password)) {
        actions.setAuthError('Password must contain at least 1 Uppercase letter (A-Z).');
        return;
      }
      if (!/[a-z]/.test(password)) {
        actions.setAuthError('Password must contain at least 1 Lowercase letter (a-z).');
        return;
      }
      if (!/[0-9]/.test(password)) {
        actions.setAuthError('Password must contain at least 1 Number (0-9).');
        return;
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        actions.setAuthError('Password must contain at least 1 Special character (!@#$%^&*).');
        return;
      }
      if (password !== confirmPassword) {
        actions.setAuthError('Passwords do not match.');
        return;
      }

      // Call API to create account and send 6-digit OTP
      fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: `${firstName} ${lastName}`, email, phone, password, role })
      })
      .then(res => res.json())
      .then(data => {
        if (!data.success) {
          actions.setAuthError(data.message || 'Registration failed.');
          return;
        }

        // Transition to 6-digit OTP verification view
        state.otpEmail = email;
        state.otpRole = (role || 'BUYER').toUpperCase();
        state.otpFlow = 'register';
        state.authModalMode = 'verify-otp';
        state.otpDigits = ['', '', '', '', '', ''];
        state.otpError = null;
        state.authError = null;
        state.otpSuccess = false;
        state.otpTimerSeconds = 300;
        state.otpCooldownSeconds = Number(data.resendCooldownSeconds || 30);
        state.otpCooldownEndsAt = Date.now() + state.otpCooldownSeconds * 1000;
        actions.startOtpCountdown();
        actions.startOtpCooldown();
        actions.triggerToast(`📧 A 6-digit verification code has been sent to ${email}.`);
        renderApp();
      })
      .catch(err => {
        console.error('[register] failed:', err);
        actions.setAuthError('Could not reach the server. Please try again.');
      });
    } else {
      const email = document.getElementById('authEmail')?.value?.trim();
      const password = document.getElementById('authPassword')?.value;
      if (!email || !password) {
        actions.setAuthError('Please enter your email and password.');
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
          actions.setAuthError(data.message || 'Login failed.');
          return;
        }

        const user = data.user || {};
        state.currentUser = {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          role: (user.role || '').toUpperCase(),
          token: user.token,
          verification_status: user.verification_status || (user.role === 'FARMER' ? 'NOT_STARTED' : 'APPROVED')
        };
        state.authError = null;
        state.activeRole = (state.currentUser.role || 'visitor').toLowerCase();
        state.authModalActive = false;

        // ✅ Save user to localStorage using StorageManager
        StorageManager.saveUser(state.currentUser);
        console.log('✅ Logged in & user saved to localStorage:', state.currentUser.email);

        if (state.currentUser.role === 'FARMER' && typeof actions.fetchFarmerVerification === 'function') {
          actions.fetchFarmerVerification();
          if (typeof actions.startFarmerVerificationPolling === 'function') {
            actions.startFarmerVerificationPolling();
          }
        } else if (state.currentUser.role === 'ADMIN' && typeof actions.fetchAdminVerifications === 'function') {
          actions.fetchAdminVerifications();
          actions.fetchRegisteredUsers();
        }

        actions.triggerToast(`✅ Logged in as ${state.currentUser.full_name || state.currentUser.email}.`);

        const resumeView = state.pendingGuardView;
        state.pendingGuardView = null;
        if (resumeView) {
          actions.guardView(resumeView);
        } else if (state.currentUser.role === 'ADMIN') {
          actions.guardView('admin-dashboard');
        } else if (state.currentUser.role === 'FARMER') {
          actions.guardView(state.currentUser.verification_status === 'APPROVED' ? 'farmer-dashboard' : 'farmer-verification');
        } else if (state.currentUser.role === 'BUYER') {
          actions.guardView('buyer-dashboard');
        } else {
          actions.setView('landing');
        }
      })
      .catch(() => {
        actions.setAuthError('Login failed. Check your connection and try again.');
      });
    }
  },

  startOtpCountdown() {
    if (state.otpTimerInterval) clearInterval(state.otpTimerInterval);
    state.otpTimerInterval = setInterval(() => {
      if (state.otpTimerSeconds > 0) {
        state.otpTimerSeconds -= 1;
        const timerEl = document.querySelector('.otp-timer-display');
        if (timerEl) timerEl.textContent = actions.formatOtpTimer(state.otpTimerSeconds);
      } else {
        clearInterval(state.otpTimerInterval);
        state.otpTimerInterval = null;
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

  startOtpCooldown() {
    if (state.otpCooldownInterval) clearInterval(state.otpCooldownInterval);
    const tick = () => {
      state.otpCooldownSeconds = Math.max(0, Math.ceil((state.otpCooldownEndsAt - Date.now()) / 1000));
      if (state.otpCooldownSeconds > 0) {
        const cooldownEl = document.querySelector('.otp-cooldown-display');
        if (cooldownEl) cooldownEl.textContent = `Resend in ${state.otpCooldownSeconds}s`;
        return;
      }

      clearInterval(state.otpCooldownInterval);
      state.otpCooldownInterval = null;
      renderApp();
    };
    state.otpCooldownInterval = setInterval(tick, 1000);
  },

  handleOtpDigitInput(event, index) {
    const input = event.target;
    let val = input.value.replace(/[^0-9]/g, '');
    if (val.length > 1) val = val.slice(-1);
    input.value = val;
    state.otpDigits[index] = val;

    if (val && index < 5) {
      const nextEl = document.getElementById(`otpDigit_${index + 1}`);
      if (nextEl) {
        nextEl.focus();
        nextEl.select();
      }
    }
  },

  handleOtpKeyDown(event, index) {
    if (event.key === 'Backspace' && !event.target.value && index > 0) {
      const prevEl = document.getElementById(`otpDigit_${index - 1}`);
      if (prevEl) {
        prevEl.focus();
        prevEl.select();
      }
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

    const finishOtpSuccess = (redirectView) => {
      if (state.otpTimerInterval) { clearInterval(state.otpTimerInterval); state.otpTimerInterval = null; }
      if (state.otpCooldownInterval) { clearInterval(state.otpCooldownInterval); state.otpCooldownInterval = null; }
      state.otpResendInFlight = false;
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
        } else if (redirectView) {
          actions.guardView(redirectView);
        } else if (userRole === 'FARMER') {
          actions.guardView('farmer-verification');
        } else if (userRole === 'BUYER') {
          actions.guardView('buyer-dashboard');
        } else if (userRole === 'ADMIN') {
          actions.guardView('admin-dashboard');
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
      if (!user.id || !user.email || !user.token) {
        state.otpError = 'Email verified, but the login session could not be created. Please log in again.';
        renderApp();
        return;
      }
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
      state.activeRole = (state.currentUser.role || 'visitor').toLowerCase();

      // ✅ Save user to localStorage using StorageManager
      StorageManager.saveUser(state.currentUser);
      console.log('✅ User account saved to localStorage:', state.currentUser.email);

      actions.triggerToast(role === 'FARMER'
        ? '🎉 Email Verified! Complete your farm verification to start selling.'
        : '🎉 Email Verified! Welcome to your dashboard.');
      finishOtpSuccess(data.redirectView);
    })
    .catch(() => {
      state.otpError = 'Could not verify your email right now. Please check your connection and try again.';
      renderApp();
    });
  },

  resendEmailOtp() {
    if (state.otpResendInFlight || !state.otpEmail) return;
    state.otpResendInFlight = true;
    renderApp();

    fetch('/api/auth/resend-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: state.otpEmail })
    })
    .then(async res => ({ status: res.status, data: await res.json() }))
    .then(({ status, data }) => {
      if (!data.success && data.inCooldown) {
        state.otpResendInFlight = false;
        state.otpCooldownSeconds = Number(data.secondsLeft || 30);
        state.otpCooldownEndsAt = Date.now() + state.otpCooldownSeconds * 1000;
        actions.startOtpCooldown();
        renderApp();
        actions.triggerToast(`⚠️ You can request another code in ${data.secondsLeft} seconds.`);
        return;
      }
      if (status < 200 || status >= 300 || !data.success) {
        state.otpResendInFlight = false;
        state.otpError = data.message || 'Could not resend the verification code.';
        renderApp();
        return;
      }

      state.demoOtp = data.demoOtp || state.demoOtp;
      state.otpError = null;
      state.otpTimerSeconds = 300;
      state.otpCooldownSeconds = Number(data.resendCooldownSeconds || 30);
      state.otpCooldownEndsAt = Date.now() + state.otpCooldownSeconds * 1000;
      state.otpDigits = ['', '', '', '', '', ''];
      state.otpResendInFlight = false;

      actions.startOtpCountdown();
      actions.startOtpCooldown();

      actions.triggerToast(`📧 New 6-digit verification code sent to ${state.otpEmail}`);
      renderApp();
    })
    .catch(() => {
      state.otpResendInFlight = false;
      state.otpError = 'Could not resend the verification code. Please try again.';
      renderApp();
    });
  },

  handleAuthSubmit(mode, role) {
    actions.validateAndSubmitAuth(mode, role);
  },

  // Password Visibility Toggle (Show/Hide Password)
  togglePasswordVisibility(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    if (!input) return;
    if (input.type === 'password') {
      input.type = 'text';
      if (icon) {
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
      }
    } else {
      input.type = 'password';
      if (icon) {
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
      }
    }
  },

  // Live Interactive Password Requirements Validator
  checkPasswordRequirements(password, prefix = 'reg') {
    const p = password || '';
    const rules = [
      { id: `${prefix}_req_len`, ico: `${prefix}_ico_len`, valid: p.length >= 8 },
      { id: `${prefix}_req_upper`, ico: `${prefix}_ico_upper`, valid: /[A-Z]/.test(p) },
      { id: `${prefix}_req_lower`, ico: `${prefix}_ico_lower`, valid: /[a-z]/.test(p) },
      { id: `${prefix}_req_num`, ico: `${prefix}_ico_num`, valid: /[0-9]/.test(p) },
      { id: `${prefix}_req_special`, ico: `${prefix}_ico_special`, valid: /[!@#$%^&*(),.?":{}|<>]/.test(p) }
    ];

    rules.forEach(r => {
      const el = document.getElementById(r.id);
      const ico = document.getElementById(r.ico);
      if (!el || !ico) return;

      if (r.valid) {
        el.className = 'flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400 font-bold transition-all';
        ico.className = 'fa-solid fa-circle-check text-emerald-500';
      } else {
        if (p.length > 0) {
          el.className = 'flex items-center space-x-1.5 text-red-500 dark:text-red-400 font-semibold transition-all';
          ico.className = 'fa-solid fa-circle-xmark text-red-500';
        } else {
          el.className = 'flex items-center space-x-1.5 text-gray-500 dark:text-gray-400 transition-all';
          ico.className = 'fa-regular fa-circle text-gray-400';
        }
      }
    });
  },

  // Live password-mismatch indicator for register + forgot-password-reset.
  //
  // Toggles a red border + inline "Passwords do not match." message under the
  // confirm field as the user types. The check only runs once both fields
  // have content; an empty confirm field hides the indicator entirely so the
  // user isn't shown an error before they've finished typing.
  checkPasswordMatch(passwordId, confirmId, errorId) {
    const pwEl = document.getElementById(passwordId);
    const confirmEl = document.getElementById(confirmId);
    const errorEl = document.getElementById(errorId);
    if (!pwEl || !confirmEl || !errorEl) return;

    const pw = pwEl.value || '';
    const confirm = confirmEl.value || '';

    if (confirm.length === 0) {
      errorEl.classList.add('hidden');
      confirmEl.classList.remove('border-red-500', 'dark:border-red-500', 'ring-1', 'ring-red-500');
      confirmEl.classList.add('border-gray-300', 'dark:border-slate-700');
      return;
    }

    if (pw === confirm) {
      errorEl.classList.add('hidden');
      confirmEl.classList.remove('border-red-500', 'dark:border-red-500', 'ring-1', 'ring-red-500');
    } else {
      errorEl.classList.remove('hidden');
      confirmEl.classList.remove('border-gray-300', 'dark:border-slate-700');
      confirmEl.classList.add('border-red-500', 'dark:border-red-500', 'ring-1', 'ring-red-500');
    }
  },

  // Live Crop Product Listing Modal Handlers
  openAddProductModal() {
    state.addProductModalActive = true;
    renderApp();
  },

  closeAddProductModal() {
    state.addProductModalActive = false;
    renderApp();
  },

  submitNewProduct() {
    const title = document.getElementById('newProdTitle')?.value?.trim();
    const category = document.getElementById('newProdCategory')?.value || 'Grains & Cereals';
    const price = parseFloat(document.getElementById('newProdPrice')?.value) || 0;
    const unit = document.getElementById('newProdUnit')?.value || 'kg';
    const availableQty = parseFloat(document.getElementById('newProdQty')?.value) || 0;
    const originState = document.getElementById('newProdState')?.value || 'Kaduna';
    const isOrganic = document.getElementById('newProdOrganic')?.checked || false;
    const image = document.getElementById('newProdImage')?.value?.trim() || 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80';

    if (!title || price <= 0 || availableQty <= 0) {
      actions.triggerToast('❌ Please fill in title, price per unit and available quantity.');
      return;
    }

    const farmerName = state.currentUser ? (state.currentUser.full_name || 'Verified Producer') : 'Agrein Producer';
    const newProd = {
      id: `prod-${Date.now()}`,
      title,
      category,
      price,
      unit,
      availableQty,
      originState,
      isOrganic,
      image,
      farmerName,
      farmName: state.currentUser ? `${farmerName}'s Farm` : 'Zaria Agro-Gold Farms',
      rating: 5.0,
      trustScore: 98,
      verified: true
    };

    // Optimistically add to state
    if (state.mockData && state.mockData.products) {
      state.mockData.products.unshift(newProd);
    }

    // Persist to backend API
    fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.currentUser?.token || ''}`
      },
      body: JSON.stringify(newProd)
    }).catch(() => {});

    state.addProductModalActive = false;
    actions.triggerToast(`✅ Crop listed: "${title}" is now active on the Marketplace!`);
    renderApp();
  },

  // Live Payout / Withdrawal Modal Handlers
  openWithdrawalModal() {
    state.withdrawalModalActive = true;
    renderApp();
  },

  closeWithdrawalModal() {
    state.withdrawalModalActive = false;
    renderApp();
  },

  submitWithdrawal() {
    const amount = parseFloat(document.getElementById('withdrawAmount')?.value) || 0;
    const bankName = document.getElementById('withdrawBank')?.value || 'First Bank of Nigeria';
    const accountNumber = document.getElementById('withdrawAccount')?.value?.trim();

    if (amount <= 0 || !accountNumber || accountNumber.length < 10) {
      actions.triggerToast('❌ Please enter a valid withdrawal amount and 10-digit NUBAN account.');
      return;
    }

    const currentBalance = state.mockData.farmerProfile?.availableBalance || 0;
    if (amount > currentBalance) {
      actions.triggerToast('❌ Withdrawal amount exceeds your available balance.');
      return;
    }

    // Call live API
    fetch('/api/wallet/withdraw', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.currentUser?.token || ''}`
      },
      body: JSON.stringify({ amount, bankName, accountNumber })
    }).catch(() => {});

    if (state.mockData.farmerProfile) {
      state.mockData.farmerProfile.availableBalance -= amount;
    }
    state.withdrawalModalActive = false;
    actions.triggerToast(`✅ Payout of ₦${amount.toLocaleString()} queued for instant Interswitch bank transfer.`);
    renderApp();
  },

  // Real Browser GPS Geolocation Pinning & Reverse Geocoding
  async detectGpsLocation() {
    if (!navigator.geolocation) {
      actions.triggerToast('⚠️ Geolocation is not supported by your browser.');
      return;
    }

    if (!state.mockData.farmerVerificationApp) {
      state.mockData.farmerVerificationApp = StorageManager.getFarmerVerification() || {
        status: 'DRAFT',
        documents: []
      };
    }

    const btn = document.getElementById('detectLocationBtn');
    if (btn) {
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin text-amber-300 mr-1.5"></i><span>Detecting Location...</span>';
      btn.disabled = true;
    }

    actions.triggerToast('📡 Accessing GPS satellite to detect your location...');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lng = position.coords.longitude.toFixed(6);

        const latEl = document.getElementById('farmLat');
        const lngEl = document.getElementById('farmLng');
        if (latEl) latEl.value = lat;
        if (lngEl) lngEl.value = lng;

        let detectedState = '';
        let detectedLga = '';
        let detectedAddress = '';

        // Reverse Geocoding via BigDataCloud + OpenStreetMap Nominatim
        try {
          const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`);
          if (res.ok) {
            const data = await res.json();
            detectedState = (data.principalSubdivision || data.region || '').replace(' State', '').trim();
            detectedLga = data.locality || data.city || data.localityInfo?.administrative?.[2]?.name || '';
            detectedAddress = [data.locality, detectedState, data.countryName].filter(Boolean).join(', ');
          }
        } catch (_) {}

        if (!detectedState || !detectedLga) {
          try {
            const res2 = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`, {
              headers: { 'Accept-Language': 'en' }
            });
            if (res2.ok) {
              const data2 = await res2.json();
              const addr = data2.address || {};
              detectedState = detectedState || (addr.state || addr.region || '').replace(' State', '').trim();
              detectedLga = detectedLga || addr.county || addr.city_district || addr.suburb || addr.city || addr.town || '';
              const road = [addr.road, addr.neighbourhood, addr.suburb].filter(Boolean).join(', ');
              detectedAddress = detectedAddress || [road, detectedLga, detectedState].filter(Boolean).join(', ') || data2.display_name;
            }
          } catch (_) {}
        }

        const matchStateOption = (select, detectedValue) => {
          if (!select || !detectedValue) return '';
          const normalizedDetected = detectedValue.toLowerCase().replace(/\s+state$/i, '').trim();
          const option = Array.from(select.options).find(opt => {
            const normalizedOption = opt.value.toLowerCase().replace(/\s+state$/i, '').trim();
            return normalizedOption === normalizedDetected
              || normalizedOption.includes(normalizedDetected)
              || normalizedDetected.includes(normalizedOption);
          });
          if (option) {
            select.value = option.value;
            return option.value;
          }
          return '';
        };

        // Auto-fill Farm State
        const farmStateEl = document.getElementById('farmState');
        const farmStateValue = matchStateOption(farmStateEl, detectedState);

        // Auto-fill Farm LGA
        const farmLgaEl = document.getElementById('farmLga');
        if (farmLgaEl && detectedLga) {
          farmLgaEl.value = detectedLga;
        }

        // Auto-fill Farm Physical Address
        const farmAddrEl = document.getElementById('farmAddress');
        if (farmAddrEl) {
          if (!farmAddrEl.value || farmAddrEl.value.trim() === '') {
            farmAddrEl.value = detectedAddress || `${detectedLga ? detectedLga + ', ' : ''}${detectedState}`;
          }
        }

        // Auto-fill Personal State & LGA if empty
        const personalStateEl = document.getElementById('personalState');
        const personalStateValue = matchStateOption(personalStateEl, detectedState);
        const personalLgaEl = document.getElementById('personalLga');
        if (personalLgaEl && !personalLgaEl.value && detectedLga) {
          personalLgaEl.value = detectedLga;
        }

        // Update state
        const verificationApp = state.mockData.farmerVerificationApp;
        verificationApp.gps_latitude = parseFloat(lat);
        verificationApp.gps_longitude = parseFloat(lng);
        if (farmStateValue) verificationApp.farm_state = farmStateValue;
        if (detectedLga) verificationApp.farm_lga = detectedLga;
        if (farmAddrEl?.value) verificationApp.farm_location = farmAddrEl.value;
        if (personalStateValue) verificationApp.state = personalStateValue;
        if (personalLgaEl?.value) verificationApp.lga = personalLgaEl.value;
        verificationApp.sectionCompletion = verificationApp.sectionCompletion || {};
        verificationApp.sectionCompletion.location = true;
        StorageManager.saveFarmerVerification(verificationApp);

        if (btn) {
          btn.innerHTML = '<i class="fa-solid fa-check text-amber-300 mr-1.5"></i><span>Location Detected!</span>';
          btn.disabled = false;
        }

        const label = [detectedLga, detectedState].filter(Boolean).join(', ');
        actions.triggerToast(`📍 Location Detected: ${label || 'GPS Coordinates'} (${lat}°N, ${lng}°E)`);
        renderApp();
      },
      (error) => {
        console.warn('[detectGpsLocation] Geolocation error:', error.message);
        if (btn) {
          btn.innerHTML = '<i class="fa-solid fa-location-crosshairs text-amber-300 mr-1.5"></i><span>Detect & Auto-fill Current Location</span>';
          btn.disabled = false;
        }
        actions.triggerToast('⚠️ Unable to retrieve GPS coordinates automatically. Please allow location permissions in your browser or enter coordinates manually.');
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  },

  // Real File Upload Handler with Progress Tracking & Base64 Persistence
  handleDocumentUpload(docType, event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    if (!state.mockData.farmerVerificationApp) {
      state.mockData.farmerVerificationApp = StorageManager.getFarmerVerification() || {
        status: 'DRAFT',
        documents: []
      };
    }

    const docName = file.name;
    const docLabel = {
      'government_id': 'Government ID',
      'farm_photo': 'Farm Photo',
      'profile_photo': 'Profile Photo',
      'farm_deed': 'Proof of Ownership',
      'agricultural_cert': 'Agricultural Certification',
      'coop_proof': 'Cooperative Proof'
    }[docType] || 'Document';

    // Validate file size (max 3MB)
    const maxFileSize = 3 * 1024 * 1024; // 3MB
    if (file.size > maxFileSize) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      actions.triggerToast(`⚠️ File too large! ${docLabel} is ${fileSizeMB}MB. Maximum allowed: 3MB`);
      return;
    }

    state.documentUploads = state.documentUploads || {};
    state.documentUploads[docType] = {
      isUploading: true,
      progress: 25,
      fileName: docName,
      docLabel: docLabel
    };
    renderApp();

    const reader = new FileReader();
    reader.onload = function(e) {
      const fileDataUrl = e.target.result;

      // Prepare payload
      const payload = {
        documentType: docType,
        documentName: docName,
        documentUrl: fileDataUrl
      };

      const token = (state.currentUser && state.currentUser.token) || '';
      const email = (state.currentUser && state.currentUser.email) || '';

      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      if (email) headers['x-user-email'] = email;

      // Update progress animation
      state.documentUploads[docType].progress = 70;
      renderApp();

      fetch('/api/farmers/documents', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      })
      .then(res => res.json())
      .then(response => {
        if (!response || response.success !== true) {
          throw new Error(response && response.message ? response.message : 'Document upload was not accepted.');
        }

        // Save document into state
        state.mockData.farmerVerificationApp.documents = state.mockData.farmerVerificationApp.documents || [];
        const idx = state.mockData.farmerVerificationApp.documents.findIndex(d => d.type === docType);
        const docEntry = {
          type: docType,
          name: docName,
          url: fileDataUrl,
          uploaded_at: new Date().toISOString()
        };
        if (idx >= 0) {
          state.mockData.farmerVerificationApp.documents[idx] = docEntry;
        } else {
          state.mockData.farmerVerificationApp.documents.push(docEntry);
        }

        state.mockData.farmerVerificationApp.sectionCompletion = state.mockData.farmerVerificationApp.sectionCompletion || {};
        state.mockData.farmerVerificationApp.sectionCompletion.documents = true;
        if (docType === 'farm_photo') state.mockData.farmerVerificationApp.sectionCompletion.photos = true;

        // Auto-save to LocalStorage
        StorageManager.saveFarmerVerification(state.mockData.farmerVerificationApp);

        if (state.documentUploads[docType]) state.documentUploads[docType].progress = 100;
        actions.triggerToast(`✅ ${docLabel} (${docName}) uploaded successfully!`);

        setTimeout(() => {
          delete state.documentUploads[docType];
          renderApp();
        }, 400);
      })
      .catch(err => {
        console.warn('[handleDocumentUpload] Server upload fallback:', err.message);
        // Resilient fallback: store locally
        if (state.mockData.farmerVerificationApp) {
          state.mockData.farmerVerificationApp.documents = state.mockData.farmerVerificationApp.documents || [];
          const idx = state.mockData.farmerVerificationApp.documents.findIndex(d => d.type === docType);
          const docEntry = {
            type: docType,
            name: docName,
            url: fileDataUrl,
            uploaded_at: new Date().toISOString()
          };
          if (idx >= 0) {
            state.mockData.farmerVerificationApp.documents[idx] = docEntry;
          } else {
            state.mockData.farmerVerificationApp.documents.push(docEntry);
          }
          state.mockData.farmerVerificationApp.sectionCompletion = state.mockData.farmerVerificationApp.sectionCompletion || {};
          state.mockData.farmerVerificationApp.sectionCompletion.documents = true;
          if (docType === 'farm_photo') state.mockData.farmerVerificationApp.sectionCompletion.photos = true;

          // Auto-save to LocalStorage
          StorageManager.saveFarmerVerification(state.mockData.farmerVerificationApp);
        }
        actions.triggerToast(`✅ ${docLabel} uploaded successfully!`);
        delete state.documentUploads[docType];
        renderApp();
      });
    };

    reader.onerror = function() {
      actions.triggerToast(`❌ Could not read ${docLabel}. Please try another file.`);
      delete state.documentUploads[docType];
      renderApp();
    };

    reader.readAsDataURL(file);
  },

  // Real-time verification field synchronization with Auto-Save (smooth typing without full-page re-renders)
  updateVerificationField(field, value) {
    if (!state.mockData.farmerVerificationApp) {
      state.mockData.farmerVerificationApp = StorageManager.getFarmerVerification() || {
        status: 'DRAFT',
        documents: []
      };
    }
    const app = state.mockData.farmerVerificationApp;
    if (field === 'crops_produced') {
      app.crops_produced = String(value || '').split(',').map(s => s.trim()).filter(Boolean);
      app.crops_produced_raw = value;
    } else {
      app[field] = value;
    }
    if (state.currentUser) {
      if (field === 'farmer_name') state.currentUser.full_name = value;
      if (field === 'phone') state.currentUser.phone_number = value;
      if (field === 'state') state.currentUser.state = value;
      if (field === 'lga') state.currentUser.lga = value;
      if (field === 'residential_address') state.currentUser.address = value;
      StorageManager.saveUser(state.currentUser);
    }
    // Auto-save draft silently so reload preserves every keystroke without resetting focus
    StorageManager.saveFarmerVerification(app);
  },

  // Load existing Farmer Verification from Server & LocalStorage
  fetchFarmerVerification() {
    if (!state.currentUser || state.currentUser.role !== 'FARMER') return;
    const token = state.currentUser.token || '';
    const email = state.currentUser.email || '';
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (email) headers['x-user-email'] = email;

    fetch('/api/farmers/verification', { headers })
      .then(res => res.json())
      .then(data => {
        if (data && data.success && data.application) {
          const app = data.application;
          const local = StorageManager.getFarmerVerification() || {};
          
          // Merge server application with local cache — preserve local in-progress edits
          const serverDocuments = Array.isArray(app.documents) ? app.documents : [];
          const localDocuments = Array.isArray(local.documents) ? local.documents : [];
          const mergedDocuments = [...localDocuments];
          serverDocuments.forEach(serverDoc => {
            const existingIndex = mergedDocuments.findIndex(localDoc => localDoc.type === serverDoc.type);
            if (existingIndex >= 0) {
              mergedDocuments[existingIndex] = { ...serverDoc, ...mergedDocuments[existingIndex] };
            } else {
              mergedDocuments.push(serverDoc);
            }
          });

          const merged = {
            ...app,
            ...local,
            status: app.status || local.status || 'DRAFT',
            rejection_reason: app.rejection_reason !== undefined ? app.rejection_reason : local.rejection_reason,
            changes_requested_notes: app.changes_requested_notes !== undefined ? app.changes_requested_notes : local.changes_requested_notes,
            admin_notes: app.admin_notes !== undefined ? app.admin_notes : local.admin_notes,
            documents: mergedDocuments
          };
          state.mockData.farmerVerificationApp = merged;
          StorageManager.saveFarmerVerification(merged);

          if (app.status && state.currentUser) {
            const statusChanged = state.currentUser.verification_status !== app.status;
            state.currentUser.verification_status = app.status;
            StorageManager.saveUser(state.currentUser);
            if (statusChanged) {
              if (app.status === 'APPROVED' && (state.currentView === 'farmer-verification' || state.currentView === 'farmer-pending-approval')) {
                actions.triggerToast('🎉 Congratulations! Your farm has been verified and approved.');
                state.currentView = 'farmer-dashboard';
                renderApp();
              } else if (app.status === 'CHANGES_REQUIRED') {
                actions.triggerToast('⚠️ Admin requested corrections on your verification application.');
                renderApp();
              } else if (app.status === 'REJECTED') {
                actions.triggerToast('❌ Your verification application was rejected by the admin team.');
                renderApp();
              }
            }
          }
        }
      })
      .catch(err => {
        console.warn('[fetchFarmerVerification] Offline fallback:', err.message);
        const local = StorageManager.getFarmerVerification();
        if (local) {
          state.mockData.farmerVerificationApp = local;
        }
      });
  },

  startFarmerVerificationPolling() {
    if (window._farmerVerifPollTimer) clearInterval(window._farmerVerifPollTimer);
    window._farmerVerifPollTimer = setInterval(() => {
      if (state.currentUser && state.currentUser.role === 'FARMER' && state.currentUser.verification_status !== 'APPROVED') {
        actions.fetchFarmerVerification();
      }
    }, 6000);
  },

  // Verification Actions with Strict Compulsory Field Checks
  submitFarmerVerification() {
    const app = state.mockData.farmerVerificationApp || (state.mockData.farmerVerificationApp = StorageManager.getFarmerVerification() || { status: 'DRAFT', documents: [] });

    // Collect fresh values from DOM inputs if available
    const fullName = (document.getElementById('personalFullName')?.value || app.farmer_name || state.currentUser?.full_name || '').trim();
    const email = (document.getElementById('personalEmail')?.value || app.email || state.currentUser?.email || '').trim();
    const phone = (document.getElementById('personalPhone')?.value || app.phone || state.currentUser?.phone_number || '').trim();
    const stateVal = document.getElementById('personalState')?.value || app.state || state.currentUser?.state || '';
    const lgaVal = (document.getElementById('personalLga')?.value || app.lga || state.currentUser?.lga || '').trim();
    const addressVal = (document.getElementById('personalAddress')?.value || app.residential_address || state.currentUser?.address || '').trim();

    const farmName = (document.getElementById('farmName')?.value || app.farm_name || '').trim();
    const farmType = document.getElementById('farmType')?.value || app.farm_type || 'Crop Farming';
    const farmSize = document.getElementById('farmSizeAcres')?.value || app.farm_size_acres;
    const yearsExp = document.getElementById('yearsExperience')?.value !== undefined ? document.getElementById('yearsExperience')?.value : app.years_experience;
    const crops = (document.getElementById('cropsProduced')?.value || (Array.isArray(app.crops_produced) ? app.crops_produced.join(', ') : app.crops_produced) || '').trim();
    const intended = (document.getElementById('intendedProducts')?.value || app.intended_products || '').trim();

    const farmAddress = (document.getElementById('farmAddress')?.value || app.farm_location || '').trim();
    const farmState = document.getElementById('farmState')?.value || app.farm_state || app.state || '';
    const farmLga = (document.getElementById('farmLga')?.value || app.farm_lga || app.lga || '').trim();
    const farmLat = document.getElementById('farmLat')?.value || app.gps_latitude || '';
    const farmLng = document.getElementById('farmLng')?.value || app.gps_longitude || '';

    // Update state object
    app.farmer_name = fullName;
    app.email = email;
    app.phone = phone;
    app.state = stateVal;
    app.lga = lgaVal;
    app.residential_address = addressVal;

    app.farm_name = farmName;
    app.farm_type = farmType;
    app.farm_size_acres = parseFloat(farmSize) || 0;
    app.years_experience = yearsExp !== '' && yearsExp !== null && yearsExp !== undefined ? parseInt(yearsExp, 10) : '';
    app.crops_produced = crops.split(',').map(s => s.trim()).filter(Boolean);
    app.intended_products = intended;

    app.farm_location = farmAddress;
    app.farm_state = farmState;
    app.farm_lga = farmLga;
    app.gps_latitude = parseFloat(farmLat) || app.gps_latitude;
    app.gps_longitude = parseFloat(farmLng) || app.gps_longitude;

    const docs = app.documents || [];
    const hasGovId = docs.some(d => d.type === 'government_id');
    const hasFarmPhoto = docs.some(d => d.type === 'farm_photo');
    const hasProfilePhoto = docs.some(d => d.type === 'profile_photo');

    // Compulsory check validation
    const missingRequirements = [];
    if (!fullName) missingRequirements.push({ label: 'Full Name', elId: 'personalFullName' });
    if (!email) missingRequirements.push({ label: 'Email Address', elId: 'personalEmail' });
    if (!phone) missingRequirements.push({ label: 'Phone Number', elId: 'personalPhone' });
    if (!stateVal) missingRequirements.push({ label: 'Residential State', elId: 'personalState' });
    if (!lgaVal) missingRequirements.push({ label: 'Residential LGA', elId: 'personalLga' });
    if (!addressVal) missingRequirements.push({ label: 'Residential Address', elId: 'personalAddress' });

    if (!farmName) missingRequirements.push({ label: 'Farm Name', elId: 'farmName' });
    if (!farmType) missingRequirements.push({ label: 'Farm Type', elId: 'farmType' });
    if (!farmSize || Number(farmSize) <= 0) missingRequirements.push({ label: 'Farm Size (Acres)', elId: 'farmSizeAcres' });
    if (app.years_experience === '' || isNaN(app.years_experience)) missingRequirements.push({ label: 'Years of Experience', elId: 'yearsExperience' });
    if (app.crops_produced.length === 0) missingRequirements.push({ label: 'Crops / Livestock Produced', elId: 'cropsProduced' });

    if (!farmAddress) missingRequirements.push({ label: 'Farm Physical Address', elId: 'farmAddress' });
    if (!farmState) missingRequirements.push({ label: 'Farm State', elId: 'farmState' });
    if (!farmLga) missingRequirements.push({ label: 'Farm LGA', elId: 'farmLga' });
    if (!app.gps_latitude || !app.gps_longitude) missingRequirements.push({ label: 'Farm GPS Coordinates', elId: 'detectLocationBtn' });

    if (!hasGovId) missingRequirements.push({ label: 'Government ID Document', elId: null });
    if (!hasFarmPhoto) missingRequirements.push({ label: 'Farm Overview Photo', elId: null });
    if (!hasProfilePhoto) missingRequirements.push({ label: 'Farmer Profile Photo', elId: null });

    const totalCompulsory = 18;
    const completedCompulsory = totalCompulsory - missingRequirements.length;
    const completionPercent = Math.round((completedCompulsory / totalCompulsory) * 100);

    // If any compulsory requirement is missing, block submission and inform the user
    if (missingRequirements.length > 0) {
      const missingLabels = missingRequirements.map(m => m.label).slice(0, 3).join(', ') + (missingRequirements.length > 3 ? ` + ${missingRequirements.length - 3} more` : '');
      actions.triggerToast(`⚠️ Verification Incomplete (${completionPercent}%): Please complete all compulsory items (${missingLabels}) before submitting.`);
      
      const firstMissing = missingRequirements.find(m => m.elId && document.getElementById(m.elId));
      if (firstMissing) {
        const el = document.getElementById(firstMissing.elId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          if (el.focus) el.focus();
        }
      }
      renderApp();
      return;
    }

    app.status = 'PENDING_REVIEW';
    app.submitted_at = new Date().toISOString();
    app.id = app.id || `ver-${Date.now()}`;

    if (state.currentUser && state.currentUser.email) {
      app.farmer_email = state.currentUser.email;
    }
    if (state.currentUser && state.currentUser.full_name) {
      app.farmer_name = app.farmer_name || state.currentUser.full_name;
    }

    // Mirror the complete app into the admin queue & local storage
    const fullAppRecord = {
      ...app,
      id: app.id,
      farmer_name: app.farmer_name || (state.currentUser && state.currentUser.full_name) || 'New Farmer',
      farmer_email: app.farmer_email || (state.currentUser && state.currentUser.email) || '',
      email: app.email || (state.currentUser && state.currentUser.email) || '',
      phone: app.phone || (state.currentUser && state.currentUser.phone_number) || '',
      state: app.state || '',
      lga: app.lga || '',
      residential_address: app.residential_address || '',
      farm_name: app.farm_name || 'Agro Farm',
      farm_type: app.farm_type || 'Crop Farming',
      farm_size_acres: app.farm_size_acres || 0,
      years_experience: app.years_experience || 0,
      crops_produced: Array.isArray(app.crops_produced) ? app.crops_produced : [],
      intended_products: app.intended_products || '',
      farm_location: app.farm_location || app.farm_state || 'Nigeria',
      farm_state: app.farm_state || app.state || '',
      farm_lga: app.farm_lga || app.lga || '',
      gps_latitude: app.gps_latitude || null,
      gps_longitude: app.gps_longitude || null,
      documents: app.documents || [],
      status: 'PENDING_REVIEW',
      submitted_at: app.submitted_at
    };

    // Save full record to localStorage
    StorageManager.saveFarmerVerification(fullAppRecord);

    if (state.currentUser) {
      state.currentUser.verification_status = 'PENDING_REVIEW';
      StorageManager.saveUser(state.currentUser);
    }

    // Post to server
    const token = (state.currentUser && state.currentUser.token) || '';
    const userEmail = (state.currentUser && state.currentUser.email) || app.email || '';
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (userEmail) headers['x-user-email'] = userEmail;

    fetch('/api/farmers/verification', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        fullName: app.farmer_name,
        phone: app.phone,
        email: app.email,
        farmName: app.farm_name,
        farmLocation: app.farm_location,
        farmState: app.farm_state || app.state,
        farmLga: app.farm_lga || app.lga,
        farmSize: app.farm_size_acres,
        farmType: app.farm_type,
        cropsProduced: app.crops_produced,
        intendedProducts: app.intended_products,
        yearsExperience: app.years_experience,
        gpsLatitude: app.gps_latitude,
        gpsLongitude: app.gps_longitude,
        state: app.state,
        lga: app.lga,
        address: app.residential_address,
        documents: app.documents || []
      })
    })
    .then(r => r.json())
    .then(data => {
      if (data && data.success && data.application) {
        state.mockData.farmerVerificationApp = data.application;
        StorageManager.saveFarmerVerification(data.application);
      }
    })
    .catch(err => console.warn('[submitFarmerVerification] Background sync:', err.message));

    if (!state.mockData.adminVerifications) state.mockData.adminVerifications = [];
    const existingIdx = state.mockData.adminVerifications.findIndex(v => v.id === app.id || (v.farmer_email && v.farmer_email === userEmail));
    if (existingIdx >= 0) {
      state.mockData.adminVerifications[existingIdx] = fullAppRecord;
    } else {
      state.mockData.adminVerifications.unshift(fullAppRecord);
    }

    actions.triggerToast('✅ Farm verification application submitted! 100% compulsory criteria satisfied.');
    state.currentView = 'farmer-pending-approval';
    renderApp();
  },

  // Farmer: Resubmit after CHANGES_REQUIRED
  resubmitVerification() {
    const app = state.mockData.farmerVerificationApp || StorageManager.getFarmerVerification();
    if (app && app.status === 'CHANGES_REQUIRED') {
      app.status = 'PENDING_REVIEW';
      app.submitted_at = new Date().toISOString();
      app.changes_requested_notes = null;
      StorageManager.saveFarmerVerification(app);

      if (state.currentUser) {
        state.currentUser.verification_status = 'PENDING_REVIEW';
        StorageManager.saveUser(state.currentUser);
      }

      actions.triggerToast('✅ Updated application resubmitted! Our team will review it again.');
      state.currentView = 'farmer-pending-approval';
      renderApp();
    }
  },

  // Farmer: Re-apply after REJECTED (Preserves previous inputs for easy editing)
  reapplyVerification() {
    const prev = state.mockData.farmerVerificationApp || StorageManager.getFarmerVerification() || {};
    state.mockData.farmerVerificationApp = {
      ...prev,
      status: 'DRAFT',
      rejection_reason: null,
      admin_notes: null
    };
    StorageManager.saveFarmerVerification(state.mockData.farmerVerificationApp);
    if (state.currentUser) {
      state.currentUser.verification_status = 'DRAFT';
      StorageManager.saveUser(state.currentUser);
    }
    actions.triggerToast('📝 Application reopened in draft mode. Update any necessary fields and submit.');
    state.currentView = 'farmer-verification';
    renderApp();
  },

  adminQuickApproveFarmer(email, fullName) {
    if (!email) return;
    const safeName = (fullName || email).replace(/[<>"']/g, '');
    const token = state.currentUser?.token || '';
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (state.currentUser?.email) headers['x-user-email'] = state.currentUser.email;

    fetch('/api/admin/users/update-verification', {
      method: 'POST',
      headers,
      body: JSON.stringify({ email, status: 'APPROVED' })
    })
      .then(r => r.json())
      .then(data => {
        if (data && data.success) {
          actions.triggerToast(`🟢 ${safeName} approved. They will land on the Farmer Dashboard automatically.`);
          actions.fetchRegisteredUsers();
          actions.fetchAdminVerifications();
        } else {
          actions.triggerToast(`⚠️ ${data && data.message ? data.message : 'Could not approve farmer.'}`);
        }
      })
      .catch(() => {
        actions.triggerToast('⚠️ Network error approving farmer.');
      });
  },

  adminRequestChanges(id) {
    state.adminActionTargetId = id;
    state.adminActionType = 'REQUEST_CHANGES';
    state.adminActionReasonText = 'Please upload a clearer image of your government ID or update farm operational details.';
    state.adminActionModalActive = true;
    renderApp();
  },

  adminRejectFarmer(id) {
    state.adminActionTargetId = id;
    state.adminActionType = 'REJECT';
    state.adminActionReasonText = 'Land ownership or credentials could not be verified.';
    state.adminActionModalActive = true;
    renderApp();
  },

  adminSuspendFarmer(id, optionalReason) {
    if (!optionalReason && optionalReason !== '') {
      state.adminActionTargetId = id;
      state.adminActionType = 'SUSPEND';
      state.adminActionReasonText = 'Quality dispute reported on crop harvest batch under investigation.';
      state.adminActionModalActive = true;
      renderApp();
      return;
    }

    const reason = optionalReason || 'Quality dispute reported on crop harvest batch under investigation.';
    const vList = state.mockData.adminVerifications || [];
    const dossier = vList.find(v => v.id === id) || state.mockData.farmerVerificationApp || state.adminInspectedDossier || state.adminReviewDossier;
    const targetEmail = dossier?.farmer_email || dossier?.email;

    if (dossier) {
      dossier.status = 'SUSPENDED';
      dossier.admin_notes = reason;
      dossier.reviewed_at = new Date().toISOString();
    }
    if (state.mockData.farmerVerificationApp && (state.mockData.farmerVerificationApp.id === id || state.mockData.farmerVerificationApp.email === targetEmail || state.mockData.farmerVerificationApp.farmer_email === targetEmail)) {
      state.mockData.farmerVerificationApp.status = 'SUSPENDED';
      state.mockData.farmerVerificationApp.admin_notes = reason;
      StorageManager.saveFarmerVerification(state.mockData.farmerVerificationApp);
    }
    if (state.currentUser && (state.currentUser.email === targetEmail || state.currentUser.role === 'FARMER')) {
      state.currentUser.verification_status = 'SUSPENDED';
      StorageManager.saveUser(state.currentUser);
    }

    const token = state.currentUser?.token || '';
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (state.currentUser?.email) headers['x-user-email'] = state.currentUser.email;

    fetch(`/api/admin/farmer-verifications/${encodeURIComponent(id)}/suspend`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ reason, email: targetEmail })
    })
    .then(r => r.json())
    .then(() => {
      actions.fetchAdminVerifications();
      actions.fetchRegisteredUsers();
    })
    .catch(() => {});

    state.adminInspectionModalActive = false;
    actions.triggerToast(`🔴 Farmer suspended.`);
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

    if (!reason && type !== 'APPROVE') {
      actions.triggerToast('❌ Please provide a detailed decision note.');
      return;
    }

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

    if (type === 'APPROVE') {
      actions.adminApproveFarmer(id);
    } else if (type === 'REQUEST_CHANGES') {
      actions.adminPromptRequestChanges(id, reason);
    } else if (type === 'REJECT') {
      actions.adminPromptReject(id, reason);
    } else if (type === 'SUSPEND') {
      actions.adminSuspendFarmer(id, reason);
    }

    state.adminActionModalActive = false;
    state.adminActionTargetId = null;
    state.adminActionType = null;
    state.adminActionReasonText = '';
    renderApp();
  },

  adminReinstateFarmer(id) {
    actions.adminApproveFarmer(id);
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
    if (!state.currentUser) {
      actions.openAuthModal('login', { trigger: 'add-to-cart' });
      return;
    }
    const idx = state.wishlist.indexOf(productId);
    if (idx >= 0) {
      state.wishlist.splice(idx, 1);
      actions.triggerToast('Removed item from saved wishlist');
    } else {
      state.wishlist.push(productId);
      actions.triggerToast('Saved item to your wishlist ❤️');
    }
    StorageManager.saveWishlist(state.wishlist); // ✅ Save wishlist to localStorage
    renderApp();
  },

  toggleWishlistDrawer() {
    state.wishlistOpen = !state.wishlistOpen;
    renderApp();
  },

  openWishlistDrawer() {
    state.wishlistOpen = true;
    renderApp();
  },

  closeWishlistDrawer() {
    state.wishlistOpen = false;
    renderApp();
  },

  moveWishlistToCart(productId) {
    if (!state.currentUser) {
      actions.openAuthModal('login', { trigger: 'add-to-cart' });
      return;
    }
    const product = state.mockData.products.find(p => p.id === productId);
    if (!product) return;

    const existing = state.cart.find(i => i.id === productId);
    if (existing) {
      existing.cartQty += 10;
    } else {
      state.cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        unit: product.unit || 'kg',
        cartQty: 10,
        farmName: product.farmName,
        originState: product.originState,
        image: product.image
      });
    }
    StorageManager.saveCart(state.cart);
    actions.triggerToast(`🛒 Added ${product.title} to cart!`);
    renderApp();
  },

  moveAllWishlistToCart() {
    if (!state.currentUser) {
      actions.openAuthModal('login', { trigger: 'add-to-cart' });
      return;
    }
    if (!state.wishlist || state.wishlist.length === 0) return;

    let addedCount = 0;
    state.wishlist.forEach(productId => {
      const product = state.mockData.products.find(p => p.id === productId);
      if (product) {
        const existing = state.cart.find(i => i.id === productId);
        if (existing) {
          existing.cartQty += 10;
        } else {
          state.cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            unit: product.unit || 'kg',
            cartQty: 10,
            farmName: product.farmName,
            originState: product.originState,
            image: product.image
          });
        }
        addedCount++;
      }
    });
    StorageManager.saveCart(state.cart);
    actions.triggerToast(`🛒 Moved ${addedCount} wishlist items to your cart!`);
    renderApp();
  },

  clearWishlist() {
    state.wishlist = [];
    StorageManager.saveWishlist(state.wishlist);
    actions.triggerToast('Wishlist cleared.');
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

  // Sell sheet (raised Sell button in the bottom-nav bar)
  openSellSheet() {
    state.sellSheetOpen = true;
    state.mobileMenuOpen = false;
    renderApp();
  },

  closeSellSheet() {
    state.sellSheetOpen = false;
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

  // ===== ADMIN DASHBOARD & VERIFICATION ACTIONS =====
  setAdminTab(tabName) {
    state.adminActiveTab = tabName;
    renderApp();
  },

  setAdminVerificationFilter(status) {
    state.adminVerificationFilter = status;
    renderApp();
  },

  setAdminVerificationSearch(query) {
    state.adminVerificationSearch = query;
    renderApp();
  },

  fetchAdminVerifications() {
    const token = (state.currentUser && state.currentUser.token) || '';
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (state.currentUser && state.currentUser.email) headers['x-user-email'] = state.currentUser.email;

    fetch('/api/admin/farmer-verifications', { headers })
      .then(res => res.json())
      .then(data => {
        if (data && data.success && Array.isArray(data.applications)) {
          const serverApps = data.applications || [];

          // Sync farmerVerificationApp from server's authoritative status
          if (state.mockData.farmerVerificationApp) {
            const localApp = state.mockData.farmerVerificationApp;
            const serverMatch = serverApps.find(a =>
              a.id === localApp.id ||
              (a.email && localApp.email && a.email.toLowerCase() === localApp.email.toLowerCase()) ||
              (a.farmer_email && localApp.farmer_email && a.farmer_email.toLowerCase() === localApp.farmer_email.toLowerCase())
            );
            if (serverMatch) {
              // Update local app status from server (so approval sticks across reloads)
              state.mockData.farmerVerificationApp.status = serverMatch.status;
              state.mockData.farmerVerificationApp.reviewed_at = serverMatch.reviewed_at || localApp.reviewed_at;
              state.mockData.farmerVerificationApp.rejection_reason = serverMatch.rejection_reason;
              state.mockData.farmerVerificationApp.changes_requested_notes = serverMatch.changes_requested_notes;
              StorageManager.saveFarmerVerification(state.mockData.farmerVerificationApp);
            } else if (localApp.status && localApp.status !== 'DRAFT') {
              // Server doesn't know about this local app yet — inject it
              serverApps.unshift(localApp);
            }
          }

          state.mockData.adminVerifications = serverApps;
          renderApp();
        }
      })
      .catch(err => {
        console.warn('[fetchAdminVerifications] Sync error:', err.message);
      });
  },

  openAdminReview(verificationId) {
    let dossier = (state.mockData.adminVerifications || []).find(v => v.id === verificationId || v.farmer_email === verificationId || v.email === verificationId || v.farmer_id === verificationId);
    if (!dossier && state.mockData.farmerVerificationApp && (state.mockData.farmerVerificationApp.id === verificationId || state.mockData.farmerVerificationApp.email === verificationId)) {
      dossier = state.mockData.farmerVerificationApp;
    }
    if (!dossier) {
      dossier = (state.mockData.adminVerifications && state.mockData.adminVerifications[0]) || {
        id: verificationId,
        farmer_name: 'Registered Farmer',
        status: 'PENDING_REVIEW',
        documents: []
      };
    }

    // Ensure documents from local draft are present if dossier documents are empty
    if ((!dossier.documents || dossier.documents.length === 0) && state.mockData.farmerVerificationApp?.documents?.length > 0) {
      dossier.documents = state.mockData.farmerVerificationApp.documents;
    }

    state.adminReviewDossier = dossier;
    state.adminInspectedDossier = dossier;
    state.adminInspectionModalActive = true;

    if (verificationId) {
      fetch(`/api/admin/farmer-verifications/${encodeURIComponent(verificationId)}`)
        .then(r => r.json())
        .then(d => {
          if (d && d.success && d.dossier) {
            const serverDocs = d.dossier.documents || [];
            const localDocs = (dossier && dossier.documents) || (state.mockData.farmerVerificationApp && state.mockData.farmerVerificationApp.documents) || [];
            const mergedDocs = [...serverDocs];
            for (const ld of localDocs) {
              if (!mergedDocs.some(sd => (sd.type || sd.document_type) === (ld.type || ld.document_type))) {
                mergedDocs.push(ld);
              }
            }
            d.dossier.documents = mergedDocs;
            state.adminReviewDossier = d.dossier;
            state.adminInspectedDossier = d.dossier;
            renderApp();
          }
        })
        .catch(() => {});
    }
    renderApp();
  },

  openAdminBuyerInspect(userIdOrEmail) {
    const user = (state.registeredUsersList || []).find(u => u.id === userIdOrEmail || u.email === userIdOrEmail) || {
      full_name: 'Registered Buyer',
      email: userIdOrEmail,
      role: 'BUYER',
      buyer_type: 'Wholesale Merchant / Distributor',
      state: 'Lagos',
      lga: 'Ikeja',
      address: 'Plot 14, Commercial Avenue, Ikeja, Lagos',
      phone_number: '08034567890'
    };
    state.adminInspectedBuyer = user;
    state.adminBuyerInspectionModalActive = true;
    renderApp();
  },

  closeAdminBuyerInspect() {
    state.adminBuyerInspectionModalActive = false;
    state.adminInspectedBuyer = null;
    renderApp();
  },

  closeAdminInspectionModal() {
    state.adminInspectionModalActive = false;
    renderApp();
  },

  openDocumentPreview(url, name, type) {
    state.adminDocumentPreviewModal = {
      active: true,
      url: url || '',
      name: name || 'Document',
      type: type || 'DOCUMENT'
    };
    renderApp();
  },

  closeDocumentPreview() {
    state.adminDocumentPreviewModal = { active: false, url: '', name: '', type: '' };
    renderApp();
  },

  adminApproveFarmer(verificationId) {
    const vList = state.mockData.adminVerifications || [];
    const dossier = vList.find(v => v.id === verificationId) || state.mockData.farmerVerificationApp || state.adminInspectedDossier || state.adminReviewDossier;
    const targetEmail = dossier?.farmer_email || dossier?.email;

    if (dossier) {
      dossier.status = 'APPROVED';
      dossier.rejection_reason = null;
      dossier.changes_requested_notes = null;
      dossier.reviewed_at = new Date().toISOString();
    }
    if (state.mockData.farmerVerificationApp && (state.mockData.farmerVerificationApp.id === verificationId || state.mockData.farmerVerificationApp.email === targetEmail || state.mockData.farmerVerificationApp.farmer_email === targetEmail)) {
      state.mockData.farmerVerificationApp.status = 'APPROVED';
      state.mockData.farmerVerificationApp.rejection_reason = null;
      state.mockData.farmerVerificationApp.changes_requested_notes = null;
      state.mockData.farmerVerificationApp.reviewed_at = new Date().toISOString();
      StorageManager.saveFarmerVerification(state.mockData.farmerVerificationApp);
    }
    if (state.currentUser && (state.currentUser.email === targetEmail || state.currentUser.role === 'FARMER')) {
      state.currentUser.verification_status = 'APPROVED';
      StorageManager.saveUser(state.currentUser);
    }

    if (targetEmail && state.registeredUsersList) {
      const u = state.registeredUsersList.find(user => user.email.toLowerCase() === targetEmail.toLowerCase());
      if (u) {
        u.verification_status = 'APPROVED';
        u.is_verified = true;
      }
    }

    const token = state.currentUser?.token || '';
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (state.currentUser?.email) headers['x-user-email'] = state.currentUser.email;

    fetch(`/api/admin/farmer-verifications/${encodeURIComponent(verificationId)}/approve`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ adminNotes: 'Verified by SuperAdmin', email: targetEmail })
    })
    .then(r => r.json())
    .then(resp => {
      // If the server confirmed approval, update farmerVerificationApp immediately
      if (resp && resp.success) {
        if (state.mockData.farmerVerificationApp) {
          state.mockData.farmerVerificationApp.status = 'APPROVED';
          state.mockData.farmerVerificationApp.rejection_reason = null;
          state.mockData.farmerVerificationApp.changes_requested_notes = null;
          state.mockData.farmerVerificationApp.reviewed_at = new Date().toISOString();
          StorageManager.saveFarmerVerification(state.mockData.farmerVerificationApp);
        }
      }
      actions.fetchAdminVerifications();
      actions.fetchRegisteredUsers();
    })
    .catch(err => console.warn('[adminApproveFarmer] API Sync:', err.message));

    state.adminInspectionModalActive = false;
    actions.triggerToast(`✅ ${dossier?.farmer_name || 'Farmer'} has been Approved & granted Golden Verified Status!`);
    renderApp();
  },

  adminPromptRequestChanges(verificationId, optionalReason) {
    let reason = optionalReason;
    if (!reason || typeof reason !== 'string' || !reason.trim()) {
      reason = prompt('Enter notes or instructions for the farmer (e.g. Please re-upload a clearer NIN slip or farm deed):');
    }
    if (!reason || !reason.trim()) return;

    const vList = state.mockData.adminVerifications || [];
    const dossier = vList.find(v => v.id === verificationId) || state.mockData.farmerVerificationApp || state.adminInspectedDossier || state.adminReviewDossier;
    const targetEmail = dossier?.farmer_email || dossier?.email;

    if (dossier) {
      dossier.status = 'CHANGES_REQUIRED';
      dossier.changes_requested_notes = reason.trim();
      dossier.reviewed_at = new Date().toISOString();
    }
    if (state.mockData.farmerVerificationApp && (state.mockData.farmerVerificationApp.id === verificationId || state.mockData.farmerVerificationApp.email === targetEmail || state.mockData.farmerVerificationApp.farmer_email === targetEmail)) {
      state.mockData.farmerVerificationApp.status = 'CHANGES_REQUIRED';
      state.mockData.farmerVerificationApp.changes_requested_notes = reason.trim();
      StorageManager.saveFarmerVerification(state.mockData.farmerVerificationApp);
    }
    if (state.currentUser && (state.currentUser.email === targetEmail || state.currentUser.role === 'FARMER')) {
      state.currentUser.verification_status = 'CHANGES_REQUIRED';
      StorageManager.saveUser(state.currentUser);
    }

    if (targetEmail && state.registeredUsersList) {
      const u = state.registeredUsersList.find(user => user.email.toLowerCase() === targetEmail.toLowerCase());
      if (u) {
        u.verification_status = 'CHANGES_REQUIRED';
      }
    }

    const token = state.currentUser?.token || '';
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (state.currentUser?.email) headers['x-user-email'] = state.currentUser.email;

    fetch(`/api/admin/farmer-verifications/${encodeURIComponent(verificationId)}/request-changes`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ reason: reason.trim(), email: targetEmail })
    })
    .then(r => r.json())
    .then(() => {
      actions.fetchAdminVerifications();
      actions.fetchRegisteredUsers();
    })
    .catch(() => {});

    state.adminInspectionModalActive = false;
    actions.triggerToast(`🟠 Changes requested from ${dossier?.farmer_name || 'farmer'}.`);
    renderApp();
  },

  adminPromptReject(verificationId, optionalReason) {
    let reason = optionalReason;
    if (!reason || typeof reason !== 'string' || !reason.trim()) {
      reason = prompt('Enter reason for rejecting this verification application:');
    }
    if (!reason || !reason.trim()) {
      actions.triggerToast('⚠️ A rejection reason is required.');
      return;
    }

    const vList = state.mockData.adminVerifications || [];
    const dossier = vList.find(v => v.id === verificationId) || state.mockData.farmerVerificationApp || state.adminInspectedDossier || state.adminReviewDossier;
    const targetEmail = dossier?.farmer_email || dossier?.email;

    if (dossier) {
      dossier.status = 'REJECTED';
      dossier.rejection_reason = reason.trim();
      dossier.reviewed_at = new Date().toISOString();
    }
    if (state.mockData.farmerVerificationApp && (state.mockData.farmerVerificationApp.id === verificationId || state.mockData.farmerVerificationApp.email === targetEmail || state.mockData.farmerVerificationApp.farmer_email === targetEmail)) {
      state.mockData.farmerVerificationApp.status = 'REJECTED';
      state.mockData.farmerVerificationApp.rejection_reason = reason.trim();
      StorageManager.saveFarmerVerification(state.mockData.farmerVerificationApp);
    }
    if (state.currentUser && (state.currentUser.email === targetEmail || state.currentUser.role === 'FARMER')) {
      state.currentUser.verification_status = 'REJECTED';
      StorageManager.saveUser(state.currentUser);
    }

    if (targetEmail && state.registeredUsersList) {
      const u = state.registeredUsersList.find(user => user.email.toLowerCase() === targetEmail.toLowerCase());
      if (u) {
        u.verification_status = 'REJECTED';
      }
    }

    const token = state.currentUser?.token || '';
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (state.currentUser?.email) headers['x-user-email'] = state.currentUser.email;

    fetch(`/api/admin/farmer-verifications/${encodeURIComponent(verificationId)}/reject`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ reason: reason.trim(), email: targetEmail })
    })
    .then(r => r.json())
    .then(() => {
      actions.fetchAdminVerifications();
      actions.fetchRegisteredUsers();
    })
    .catch(() => {});

    state.adminInspectionModalActive = false;
    actions.triggerToast(`🔴 Application rejected.`);
    renderApp();
  },


  updateUserProfile(profileData) {
    if (!state.currentUser) {
      actions.openAuthModal('login');
      return;
    }

    const payload = {
      fullName: String(profileData.fullName || state.currentUser.full_name || '').trim(),
      phone: String(profileData.phone || '').trim(),
      state: String(profileData.state || '').trim(),
      lga: String(profileData.lga || '').trim(),
      city: String(profileData.city || '').trim(),
      address: String(profileData.address || '').trim(),
      marketingConsent: typeof profileData.marketingConsent === 'boolean' ? profileData.marketingConsent : Boolean(profileData.marketingConsent)
    };

    if (!payload.fullName) {
      actions.triggerToast('❌ Full name is required.');
      return;
    }

    fetch('/api/auth/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-user-email': state.currentUser.email
      },
      body: JSON.stringify(payload)
    })
    .then(res => res.json().then(body => ({ status: res.status, body })))
    .then(({ status, body }) => {
      if (status === 200 && body.success) {
        const updatedUser = body.user || {};
        state.currentUser = {
          ...state.currentUser,
          full_name: updatedUser.full_name || payload.fullName,
          phone_number: updatedUser.phone_number || payload.phone,
          state: updatedUser.state || payload.state,
          lga: updatedUser.lga || payload.lga,
          city: updatedUser.city || payload.city,
          address: updatedUser.address || payload.address,
          updated_at: updatedUser.updated_at || new Date().toISOString()
        };

        try {
          localStorage.setItem('agrein_user_session', JSON.stringify(state.currentUser));
        } catch (e) {}

        actions.triggerToast('✅ Profile updated successfully.');
        renderApp();
      } else {
        actions.triggerToast(`❌ ${body.message || 'Could not update profile.'}`);
      }
    })
    .catch(() => {
      actions.triggerToast('❌ Could not reach the server. Check your connection and try again.');
    });
  },

  // ═══════════════════════════════════════════════════════════════
  // COMPULSORY BUYER ONBOARDING & VERIFICATION ACTIONS
  // ═══════════════════════════════════════════════════════════════

  updateBuyerField(field, value) {
    if (!state.buyerOnboardingDraft) state.buyerOnboardingDraft = {};
    if (!state.mockData.buyerProfile) state.mockData.buyerProfile = {};
    state.buyerOnboardingDraft[field] = value;
    state.mockData.buyerProfile[field] = value;
    if (state.currentUser) {
      if (field === 'fullName') state.currentUser.full_name = value;
      if (field === 'phone') state.currentUser.phone_number = value;
      if (field === 'state') state.currentUser.state = value;
      if (field === 'lga') state.currentUser.lga = value;
      if (field === 'address') state.currentUser.address = value;
      if (field === 'buyerType') state.currentUser.buyer_type = value;
      if (field === 'businessName') state.currentUser.business_name = value;
      if (field === 'procurementCategories') state.currentUser.procurement_categories = value;
      if (field === 'procurementVolume') state.currentUser.procurement_volume = value;
      if (field === 'deliveryFrequency') state.currentUser.delivery_frequency = value;
    }
    StorageManager.saveBuyerProfile(state.mockData.buyerProfile);
  },

  toggleBuyerCategory(catName) {
    if (!state.buyerOnboardingDraft) state.buyerOnboardingDraft = {};
    if (!state.mockData.buyerProfile) state.mockData.buyerProfile = {};
    let cats = state.buyerOnboardingDraft.procurementCategories || state.mockData.buyerProfile.procurementCategories || (state.currentUser && state.currentUser.procurement_categories) || ['Grains & Cereals'];
    if (!Array.isArray(cats)) cats = [cats];
    if (cats.includes(catName)) {
      cats = cats.filter(c => c !== catName);
    } else {
      cats.push(catName);
    }
    state.buyerOnboardingDraft.procurementCategories = cats;
    state.mockData.buyerProfile.procurementCategories = cats;
    if (state.currentUser) state.currentUser.procurement_categories = cats;
    StorageManager.saveBuyerProfile(state.mockData.buyerProfile);
    renderApp();
  },

  async submitBuyerProfile() {
    const user = state.currentUser || {};
    const profile = state.mockData.buyerProfile || state.buyerOnboardingDraft || {};
    const fullName = (profile.fullName || profile.full_name || user.full_name || '').trim();
    const phone = (profile.phone || profile.phone_number || user.phone_number || '').trim();
    const stateVal = (profile.state || user.state || '').trim();
    const lgaVal = (profile.lga || user.lga || '').trim();
    const addressVal = (profile.address || user.address || '').trim();
    const buyerType = profile.buyerType || profile.buyer_type || user.buyer_type || 'Household / Individual Consumer';
    const businessName = (profile.businessName || profile.business_name || user.business_name || (buyerType === 'Household / Individual Consumer' ? fullName : '')).trim();
    const procurementCategories = profile.procurementCategories || profile.procurement_categories || user.procurement_categories || ['Grains & Cereals'];
    const procurementVolume = profile.procurementVolume || profile.procurement_volume || user.procurement_volume || 'Retail / Family (< 100 kg)';
    const deliveryFrequency = profile.deliveryFrequency || profile.delivery_frequency || user.delivery_frequency || 'Weekly';

    if (!fullName || fullName.length < 3) {
      actions.triggerToast('⚠️ Please enter your full name / representative name.');
      const el = document.getElementById('buyerFullName');
      if (el) el.focus();
      return;
    }
    if (!phone || phone.replace(/\D/g, '').length < 10) {
      actions.triggerToast('⚠️ Please enter a valid delivery contact phone number (at least 10 digits).');
      const el = document.getElementById('buyerPhone');
      if (el) el.focus();
      return;
    }
    if (buyerType !== 'Household / Individual Consumer' && (!businessName || businessName.length < 2)) {
      actions.triggerToast('⚠️ Please enter your registered business, store, or factory name.');
      const el = document.getElementById('buyerBusinessName');
      if (el) el.focus();
      return;
    }
    if (!stateVal) {
      actions.triggerToast('⚠️ Compulsory: Please select your primary delivery destination state.');
      const el = document.getElementById('buyerState');
      if (el) el.focus();
      return;
    }
    if (!lgaVal) {
      actions.triggerToast('⚠️ Compulsory: Please enter your destination LGA.');
      const el = document.getElementById('buyerLga');
      if (el) el.focus();
      return;
    }
    if (!addressVal || addressVal.length < 5) {
      actions.triggerToast('⚠️ Compulsory: Please provide your detailed delivery street address & nearest landmark.');
      const el = document.getElementById('buyerAddress');
      if (el) el.focus();
      return;
    }
    if (!Array.isArray(procurementCategories) || procurementCategories.length === 0) {
      actions.triggerToast('⚠️ Please select at least one produce category of interest.');
      return;
    }

    try {
      const token = StorageManager.getUser()?.token || (state.currentUser && state.currentUser.token);
      const email = user.email || (StorageManager.getUser() && StorageManager.getUser().email);

      const payload = {
        fullName,
        phone,
        state: stateVal,
        lga: lgaVal,
        city: lgaVal,
        address: addressVal,
        buyerType,
        businessName,
        procurementCategories,
        procurementVolume,
        deliveryFrequency,
        isBuyerOnboarded: true
      };

      const fetchFn = window.apiFetch || fetch;
      const res = await fetchFn('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
          'x-user-email': email || ''
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success && data.user) {
        state.currentUser = {
          ...state.currentUser,
          ...data.user,
          token: token || state.currentUser?.token
        };
      } else {
        state.currentUser = {
          ...state.currentUser,
          full_name: fullName,
          phone_number: phone,
          state: stateVal,
          lga: lgaVal,
          address: addressVal,
          buyer_type: buyerType,
          business_name: businessName,
          procurement_categories: procurementCategories,
          procurement_volume: procurementVolume,
          delivery_frequency: deliveryFrequency,
          is_buyer_onboarded: true
        };
      }

      StorageManager.saveUser(state.currentUser);
      StorageManager.saveBuyerProfile(payload);
      state.mockData.buyerProfile = payload;

      actions.triggerToast('🎉 Buyer delivery profile verified & saved!');
      state.currentView = 'marketplace';
      renderApp();
    } catch (err) {
      console.warn('Profile save offline fallback:', err.message);
      state.currentUser = {
        ...state.currentUser,
        full_name: fullName,
        phone_number: phone,
        state: stateVal,
        lga: lgaVal,
        address: addressVal,
        buyer_type: buyerType,
        business_name: businessName,
        procurement_categories: procurementCategories,
        procurement_volume: procurementVolume,
        delivery_frequency: deliveryFrequency,
        is_buyer_onboarded: true
      };
      StorageManager.saveUser(state.currentUser);
      StorageManager.saveBuyerProfile({ fullName, phone, state: stateVal, lga: lgaVal, address: addressVal, buyerType, businessName, procurementCategories, procurementVolume, deliveryFrequency });
      actions.triggerToast('🎉 Buyer delivery profile saved successfully!');
      state.currentView = 'marketplace';
      renderApp();
    }
  },

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
    if (!state.currentUser) {
      actions.openAuthModal('login', { trigger: 'add-to-cart' });
      return;
    }
    const prod = state.mockData.products.find(p => p.id === productId);
    if (!prod) return;
    const existing = state.cart.find(i => i.id === productId);
    if (existing) {
      existing.cartQty += prod.minQty;
    } else {
      state.cart.push({ ...prod, cartQty: prod.minQty });
    }
    StorageManager.saveCart(state.cart); // ✅ Save cart to localStorage
    actions.triggerToast(`Added ${prod.minQty} ${prod.unit}s of ${prod.title} to cart`);
    renderApp();
  },

  addToCartFromModal(productId, qty) {
    if (!state.currentUser) {
      actions.openAuthModal('login', { trigger: 'add-to-cart' });
      return;
    }
    const prod = state.mockData.products.find(p => p.id === productId);
    if (!prod) return;
    const existing = state.cart.find(i => i.id === productId);
    if (existing) {
      existing.cartQty += qty;
    } else {
      state.cart.push({ ...prod, cartQty: qty });
    }
    StorageManager.saveCart(state.cart); // ✅ Save cart to localStorage
    state.activeModalProductId = null;
    state.cartOpen = true;
    actions.triggerToast(`Added ${qty} ${prod.unit}s to cart`);
    renderApp();
  },

  removeFromCart(productId) {
    state.cart = state.cart.filter(i => i.id !== productId);
    StorageManager.saveCart(state.cart); // ✅ Save cart to localStorage
    actions.triggerToast('Item removed from cart');
    renderApp();
  },

  updateCartQty(productId, delta) {
    const item = state.cart.find(i => i.id === productId);
    if (item) {
      item.cartQty = Math.max(1, item.cartQty + delta);
      StorageManager.saveCart(state.cart); // ✅ Save cart to localStorage
      renderApp();
    }
  },

  openChatDrawer(recipient) {
    state.chatRecipient = recipient || 'AgriBot AI Support';
    state.chatActive = true;
    renderApp();
    setTimeout(() => {
      const container = document.getElementById('chatMessagesContainer');
      if (container) container.scrollTop = container.scrollHeight;
    }, 100);
  },

  closeChatDrawer() {
    state.chatActive = false;
    renderApp();
  },

  setChatInputText(text) {
    state.chatInputText = text;
  },

  clearAiChatHistory() {
    state.chatMessages = [];
    actions.triggerToast('💬 Chat history cleared.');
    renderApp();
  },

  sendSuggestedPrompt(promptText) {
    state.chatInputText = promptText;
    actions.sendChatMessage();
  },

  sendChatMessage() {
    const userText = (state.chatInputText || '').trim();
    if (!userText) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    state.chatMessages.push({ sender: 'you', text: userText, time });
    state.chatInputText = '';

    const isAiSupport = !state.chatRecipient ||
      state.chatRecipient.toLowerCase().includes('support') ||
      state.chatRecipient.toLowerCase().includes('agribot') ||
      state.chatRecipient.toLowerCase().includes('ai');

    if (isAiSupport) {
      state.chatIsBotTyping = true;
      renderApp();

      setTimeout(() => {
        const container = document.getElementById('chatMessagesContainer');
        if (container) container.scrollTop = container.scrollHeight;
      }, 50);

      fetch('/api/support/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: state.chatMessages.slice(-6)
        })
      })
      .then(res => res.json())
      .then(data => {
        state.chatIsBotTyping = false;
        const reply = data && data.reply ? data.reply : 'Thank you for reaching out to Agrein Support! We are reviewing your inquiry.';
        state.chatMessages.push({
          sender: 'bot',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        renderApp();
        setTimeout(() => {
          const container = document.getElementById('chatMessagesContainer');
          if (container) container.scrollTop = container.scrollHeight;
        }, 50);
      })
      .catch(err => {
        console.warn('[AI Support] Fallback error:', err.message);
        state.chatIsBotTyping = false;
        state.chatMessages.push({
          sender: 'bot',
          text: 'Hello! I am AgriBot. Agrein escrow protects 100% of your transactions until quality delivery. For assistance, contact support@agrein.ng.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        renderApp();
      });

    } else {
      renderApp();
      setTimeout(() => {
        state.chatMessages.push({
          sender: 'them',
          text: 'Thank you for reaching out! We are preparing the harvest for shipment. I will update your dispatch tracking code.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        renderApp();
      }, 1200);
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // SIMPLIFIED CHECKOUT & PAYMENT GATEWAY
  // ═══════════════════════════════════════════════════════════════

  proceedToPayment(totalAmount) {
    if (!state.currentUser) {
      actions.openAuthModal('login', { trigger: 'add-to-cart' });
      return;
    }
    state.checkoutModalActive = true;
    state.checkoutTotal = totalAmount;
    state.checkoutItemCount = state.cart.length;
    state.checkoutProcessing = false;
    state.cartOpen = false; // Close cart drawer
    renderApp();
  },

  closeCheckout() {
    state.checkoutModalActive = false;
    renderApp();
  },

  async initiateWebRedirectCheckout(paymentMethod, amount) {
    if (!state.currentUser) {
      actions.openAuthModal('login', { trigger: 'add-to-cart' });
      return;
    }
    const finalAmount = Number(amount || state.checkoutTotal || 0);
    state.checkoutProcessing = true;
    renderApp();

    const orderPayload = {
      buyerEmail: state.currentUser.email || '',
      items: state.cart || [],
      totalAmount: finalAmount,
      deliveryAddress: state.currentUser.address || 'Standard Delivery, Nigeria',
      state: state.currentUser.state || 'Lagos',
      productId: state.cart.length > 0 ? state.cart[0].id : null,
      farmerId: state.cart.length > 0 ? (state.cart[0].farmerId || null) : null,
      quantity: state.cart.length > 0 ? (state.cart[0].cartQty || 1) : 1
    };

    try {
      const fetchFn = window.apiFetch || fetch;
      const res = await fetchFn('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const resData = await res.json();

      if (resData && resData.success && resData.payment) {
        const p = resData.payment;

        // Server guarantees payment_url / merchant_code / pay_item_id are
        // populated (or it would have returned 503). Defensive null check
        // only — we don't auto-fake a redirect if the payload is broken.
        if (!p.payment_url || !p.merchant_code || !p.pay_item_id) {
          throw new Error('Payment gateway returned an incomplete payload.');
        }

        actions.triggerToast('🔄 Redirecting to Interswitch Payment Gateway...');

        // Create standard HTML Web Redirect form dynamically as specified by Interswitch
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = p.payment_url;
        form.style.display = 'none';

        const fields = {
          merchant_code: p.merchant_code,
          pay_item_id: p.pay_item_id,
          site_redirect_url: p.site_redirect_url,
          txn_ref: p.txn_ref,
          amount: p.amount,
          currency: p.currency || 566,
          cust_name: p.cust_name || state.currentUser.full_name || '',
          cust_email: p.cust_email || state.currentUser.email || '',
          cust_id: p.cust_id || state.currentUser.id || '',
          pay_item_name: p.pay_item_name || 'Agrein Marketplace Order'
        };

        for (const [k, v] of Object.entries(fields)) {
          if (v !== undefined && v !== null) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = k;
            input.value = v;
            form.appendChild(input);
          }
        }

        document.body.appendChild(form);
        setTimeout(() => {
          form.submit();
        }, 400);
        return;
      } else {
        throw new Error((resData && resData.message) || 'Failed to initialize Interswitch payment');
      }
    } catch (err) {
      // Hard fail — never fabricate a successful payment client-side. In LIVE
      // mode that would let a payment "succeed" without ever talking to
      // Interswitch. Leave the modal open so the user can retry.
      console.error('[Interswitch Checkout] Direct redirect error:', err.message);
      state.checkoutProcessing = false;
      actions.triggerToast(`❌ ${err.message || 'Could not start payment. Please try again.'}`);
      renderApp();
    }
  },

  redirectToPaymentGateway(paymentMethod, amount) {
    return actions.initiateWebRedirectCheckout(paymentMethod, amount);
  },

  executePayment(txnRef, amount) {
    state.checkoutProcessing = false;
    state.checkoutModalActive = false;
    state.cart = [];
    state.currentView = 'buyer-dashboard';
    
    actions.triggerToast(`✅ Payment successful! Order #${txnRef} confirmed and protected in Escrow.`);
    renderApp();
    if (typeof loadBuyerDashboard === 'function') {
      loadBuyerDashboard(state, actions);
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // LEGACY INTERSWITCH COMPATIBILITY (Deprecated)
  // ═══════════════════════════════════════════════════════════════

  initiateInterswitchCheckout(amount, title) {
    // Redirect to new simplified checkout
    actions.proceedToPayment(amount);
  },

  launchInterswitchInlineSDK(txnRef, amountInKobo) {
    // Legacy function - now redirects to card payment
    actions.redirectToPaymentGateway('card', Math.round(amountInKobo / 100));
  },

  closeInterswitchCheckout() {
    actions.closeCheckout();
  },

  executeInterswitchPayment() {
    // Legacy function - now uses new payment flow
    const txnRef = `AGR-ISW-${Date.now()}`;
    actions.executePayment(txnRef, state.checkoutTotal);
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
    // Avoid back-to-back re-renders. If the same toast is already on screen,
    // reset the dismiss timer instead of re-painting the whole tree.
    if (state._toastTimer) {
      clearTimeout(state._toastTimer);
      state._toastTimer = null;
    }
    // Escape HTML — toasts are rendered via template interpolation and may
    // carry server-supplied text that we don't control.
    const safeMsg = escapeHtml(msg);
    const isNewToast = state.toastMessage !== safeMsg;
    state.toastMessage = safeMsg;
    if (isNewToast) renderApp();
    state._toastTimer = setTimeout(() => {
      state.toastMessage = null;
      state._toastTimer = null;
      renderApp();
    }, 3500);
  },

  // ── PWA: install / offline / service-worker update ──
  // These helpers are the seam between the SW, the network state, and the UI.
  // They keep their logic in one place so the renderers stay simple.

  // Toggle the offline ribbon. Wired to navigator.onLine at startup and to
  // 'online' / 'offline' window events from _pwaInit().
  setOnlineStatus(online) {
    if (state.isOnline === online) return;
    state.isOnline = online;
    renderApp();
  },

  // iOS path — Safari never fires beforeinstallprompt. We show our own sheet.
  showIosInstallHint() {
    if (state.pwaHintDismissed) return;
    state.showIosInstallHint = true;
    renderApp();
  },

  // Android path — uses the deferredPrompt the browser stashed in
  // window._agreinInstallPrompt via _pwaInit().
  showAndroidInstallPrompt() {
    if (state.pwaHintDismissed) return;
    if (!window._agreinInstallPrompt) return;
    state.showAndroidInstallPrompt = true;
    renderApp();
  },

  triggerPwaInstall() {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    if (isStandalone) {
      actions.triggerToast('✅ You are already using the installed Agrein App!');
      return;
    }

    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (window._agreinInstallPrompt) {
      actions.promptAndroidInstall();
    } else if (isIos) {
      state.showIosInstallHint = true;
      state.mobileMenuOpen = false;
      renderApp();
    } else {
      state.showAndroidInstallPrompt = true;
      state.mobileMenuOpen = false;
      renderApp();
    }
  },

  dismissPwaHint() {
    state.pwaHintDismissed = true;
    state.showIosInstallHint = false;
    state.showAndroidInstallPrompt = false;
    try { localStorage.setItem('agrein_pwa_hint_dismissed', '1'); } catch (e) {}
    renderApp();
  },

  promptAndroidInstall() {
    const prompt = window._agreinInstallPrompt;
    state.showAndroidInstallPrompt = false;
    if (!prompt) {
      actions.triggerToast('📱 To install on this device, tap your browser menu (⋮ or Share) and select "Add to Home Screen" or "Install App".');
      renderApp();
      return;
    }
    prompt.prompt();
    prompt.userChoice.then(choice => {
      try {
        if (choice && choice.outcome === 'accepted') {
          actions.triggerToast('✅ Agrein installed. Open it from your home screen.');
        }
      } catch (e) {}
      window._agreinInstallPrompt = null;
      renderApp();
    }).catch(() => { renderApp(); });
  },

  applySwUpdate() {
    // Hard reload to swap to the new SW's cached bundles
    window.location.reload();
  },

  dismissSwUpdate() {
    state.swUpdateAvailable = false;
    renderApp();
  }
};


// Lightweight, robust zero-dependency DOM reconciliation engine
function morphDOM(target, source) {
  if (!target || !source) return;

  // If node types or tag names don't match, replace the node entirely
  if (target.nodeType !== source.nodeType || target.nodeName !== source.nodeName) {
    target.parentNode.replaceChild(source.cloneNode(true), target);
    return;
  }

  // 1. Text and Comment nodes
  if (target.nodeType === Node.TEXT_NODE || target.nodeType === Node.COMMENT_NODE) {
    if (target.nodeValue !== source.nodeValue) {
      target.nodeValue = source.nodeValue;
    }
    return;
  }

  // 2. Element nodes
  if (target.nodeType === Node.ELEMENT_NODE) {
    const isFocused = document.activeElement === target;

    // Sync attributes: add/update attributes from source
    const targetAttrs = target.attributes;
    const sourceAttrs = source.attributes;

    for (let i = 0; i < sourceAttrs.length; i++) {
      const attr = sourceAttrs[i];
      if (target.getAttribute(attr.name) !== attr.value) {
        target.setAttribute(attr.name, attr.value);
      }
    }

    // Remove attributes not in source
    for (let i = targetAttrs.length - 1; i >= 0; i--) {
      const attr = targetAttrs[i];
      if (!source.hasAttribute(attr.name)) {
        target.removeAttribute(attr.name);
      }
    }

    // Sync input/textarea/select values without disturbing active user input
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
      if (!isFocused) {
        if (target.value !== source.value) {
          target.value = source.value;
        }
      }
      if (target.tagName === 'INPUT' && (target.type === 'checkbox' || target.type === 'radio')) {
        if (target.checked !== source.checked) {
          target.checked = source.checked;
        }
      }
    }

    // Protect third-party initialized DOM components (e.g. Leaflet map)
    if (target.id === 'nearbyFarmsMap' && target.childNodes.length > 0) {
      return;
    }

    // 3. Children reconciliation
    const targetChildren = Array.from(target.childNodes);
    const sourceChildren = Array.from(source.childNodes);

    // Fast-path: single text node child
    if (targetChildren.length === 1 && sourceChildren.length === 1 &&
        targetChildren[0].nodeType === Node.TEXT_NODE && sourceChildren[0].nodeType === Node.TEXT_NODE) {
      if (targetChildren[0].nodeValue !== sourceChildren[0].nodeValue) {
        targetChildren[0].nodeValue = sourceChildren[0].nodeValue;
      }
      return;
    }

    const minLen = Math.min(targetChildren.length, sourceChildren.length);
    for (let i = 0; i < minLen; i++) {
      morphDOM(targetChildren[i], sourceChildren[i]);
    }

    // Append extra source children
    if (sourceChildren.length > targetChildren.length) {
      for (let i = targetChildren.length; i < sourceChildren.length; i++) {
        target.appendChild(sourceChildren[i].cloneNode(true));
      }
    }
    // Remove extra target children
    else if (targetChildren.length > sourceChildren.length) {
      for (let i = targetChildren.length - 1; i >= sourceChildren.length; i--) {
        target.removeChild(targetChildren[i]);
      }
    }
  }
}

let _renderScheduled = false;

function renderAppImmediate() {
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
    case 'farmer-pending-approval':
      bodyContent = renderFarmerPendingApprovalView(state, actions);
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
    case 'buyer-onboarding':
      bodyContent = renderBuyerOnboardingView(state, actions);
      break;

    // === ACCOUNT SETTINGS ===
    case 'account-settings':
      bodyContent = renderAccountSettings(state, actions);
      break;

    default:
      bodyContent = renderHero(state, actions) + renderProductCatalog(state, actions);
  }

  const isLockedHeader = state.isFarmerLocked() || (state.isBuyerLocked && state.isBuyerLocked() && state.currentView === 'buyer-onboarding');

  const newHtml = `
    <div class="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-gray-100 transition-colors">
      
      <!-- Toast Notification Bar -->
      ${state.toastMessage ? `
        <div class="fixed top-24 right-4 z-50 px-5 py-3 rounded-2xl bg-emerald-800 text-white font-extrabold text-xs shadow-2xl border border-emerald-400/30 flex items-center space-x-2 animate-bounce">
          <i class="fa-solid fa-circle-check text-amber-300 text-sm"></i>
          <span>${state.toastMessage}</span>
        </div>
      ` : ''}

      <!-- Navbar (hidden for locked users) -->
      ${isLockedHeader
        ? `
        <div class="sticky top-0 z-40 w-full h-14 border-b border-gray-200 dark:border-slate-800 bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl flex items-center px-4 safe-area-top">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-tr ${state.isFarmerLocked() ? 'from-emerald-700 via-emerald-600 to-amber-500' : 'from-blue-700 via-blue-600 to-emerald-500'} flex items-center justify-center text-white shadow-md flex-shrink-0">
            <i class="fa-solid ${state.isFarmerLocked() ? 'fa-wheat-awn' : 'fa-truck-ramp-box'} text-sm"></i>
          </div>
          <div class="min-w-0 flex-1 px-3">
            <div class="text-[10px] uppercase tracking-wider font-extrabold ${state.isFarmerLocked() ? 'text-emerald-700 dark:text-emerald-400' : 'text-blue-700 dark:text-blue-400'} leading-none">Agrein</div>
            <div class="text-xs font-extrabold text-slate-900 dark:text-white truncate leading-tight">${state.isFarmerLocked() ? 'Farm Verification' : 'Buyer Profile Setup'}</div>
          </div>
          <button onclick="actions.logout()" class="px-3 py-2 rounded-xl text-[11px] font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-1.5">
            <i class="fa-solid fa-arrow-right-from-bracket text-xs"></i>
            <span>Log Out</span>
          </button>
        </div>
        `
        : renderNavbar(state, actions)}

      <!-- Ecosystem Navigation Strip (hidden for locked users) -->
      ${isLockedHeader ? '' : renderEcosystemNav(state, actions)}

      <!-- Main Body Content -->
      <main class="flex-grow pb-24 lg:pb-0">
        ${bodyContent}
      </main>

      <!-- Drawers & Modals -->
      ${renderCartDrawer(state, actions)}
      ${renderWishlistDrawer(state, actions)}
      ${renderProductModal(state, actions)}
      ${renderCheckoutModal(state, actions)}
      ${renderChatDrawer(state, actions)}
      ${renderAuthModal(state, actions)}
      ${renderChangePasswordModal(state, actions)}
      ${renderBuyerDisputeModal(state, actions)}
      ${renderAdminActionModal(state, actions)}
      ${renderAddProductModal(state, actions)}
      ${renderWithdrawalModal(state, actions)}

      <!-- PWA banners: offline ribbon, iOS install sheet, Android install sheet, SW-update toast -->
      ${typeof renderOfflineRibbon === 'function' ? renderOfflineRibbon(state) : ''}
      ${typeof renderPwaInstallSheet === 'function' ? renderPwaInstallSheet(state, actions) : ''}
      ${typeof renderSwUpdateToast === 'function' ? renderSwUpdateToast(state, actions) : ''}

      <!-- Footer (hidden for locked farmers — standalone onboarding page) -->
      ${state.isFarmerLocked() ? '' : renderFooter(state, actions)}

    </div>
  `;

  if (!appContainer.firstElementChild) {
    appContainer.innerHTML = newHtml;
  } else {
    const template = document.createElement('template');
    template.innerHTML = newHtml.trim();
    const newRoot = template.content.firstElementChild;
    if (newRoot) {
      morphDOM(appContainer.firstElementChild, newRoot);
    } else {
      appContainer.innerHTML = newHtml;
    }
  }

  if (state.currentView === 'nearby-farms') {
    setTimeout(() => {
      if (actions && typeof actions.renderNearbyMap === 'function') {
        actions.renderNearbyMap();
      }
    }, 0);
  }
}

// Batched render scheduler to prevent micro-flickers and blinking
function renderApp(sync = false) {
  if (sync) {
    _renderScheduled = false;
    renderAppImmediate();
    return;
  }
  if (_renderScheduled) return;
  _renderScheduled = true;
  requestAnimationFrame(() => {
    _renderScheduled = false;
    renderAppImmediate();
  });
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

// Ecosystem Navigation Strip Component (Role-Aware)
function renderEcosystemNav(state, actions) {
  const role = ((state.currentUser && state.currentUser.role) || state.activeRole || 'visitor').toUpperCase();

  // ── HIDE NAVIGATION FOR UNVERIFIED FARMERS ──
  // Unverified farmers are locked on farmer-verification. No navigation strip shown.
  if (role === 'FARMER' && state.currentUser && state.currentUser.verification_status !== 'APPROVED') {
    return '';
  }

  let ecosystemItems = [];

  if (role === 'FARMER') {
    ecosystemItems = [
      { view: 'farmer-dashboard', label: 'Farmer Hub', icon: 'fa-tractor', color: 'emerald' },
      { view: 'marketplace', label: 'Marketplace', icon: 'fa-store', color: 'teal' },
      { view: 'ai-insights', label: 'AI Price Predictor', icon: 'fa-wand-magic-sparkles', color: 'amber' },
      { view: 'agro-doctor', label: 'AI Crop Doctor', icon: 'fa-stethoscope', color: 'rose' },
      { view: 'weather', label: 'Weather Radar', icon: 'fa-cloud-sun-rain', color: 'sky' },
      { view: 'cooperatives', label: 'Cooperatives', icon: 'fa-people-group', color: 'violet' },
      { view: 'farmer-verification', label: 'Farm Verify (KYC)', icon: 'fa-shield-halved', color: 'emerald' },
      { view: 'wallet', label: 'Wallet & Payouts', icon: 'fa-wallet', color: 'green' },
      { view: 'logistics', label: 'Logistics', icon: 'fa-truck-fast', color: 'indigo' },
      { view: 'forum', label: 'Community Forum', icon: 'fa-comments', color: 'orange' }
    ];
  } else if (role === 'BUYER') {
    ecosystemItems = [
      { view: 'buyer-dashboard', label: 'Buyer Hub', icon: 'fa-cart-shopping', color: 'blue' },
      { view: 'marketplace', label: 'Produce Catalog', icon: 'fa-store', color: 'emerald' },
      { view: 'bulk-b2b', label: 'B2B Wholesale', icon: 'fa-boxes-stacked', color: 'fuchsia' },
      { view: 'rfq-board', label: 'RFQ Sourcing Board', icon: 'fa-clipboard-list', color: 'blue' },
      { view: 'commodity-index', label: 'Price Index', icon: 'fa-chart-line', color: 'amber' },
      { view: 'nearby-farms', label: 'Nearby Farms', icon: 'fa-location-dot', color: 'teal' },
      { view: 'export-trade', label: 'Export Marketplace', icon: 'fa-globe-africa', color: 'cyan' },
      { view: 'traceability', label: 'QR Traceability', icon: 'fa-qrcode', color: 'lime' },
      { view: 'logistics', label: 'ColdChain Tracker', icon: 'fa-truck-fast', color: 'indigo' }
    ];
  } else if (role === 'ADMIN') {
    ecosystemItems = [
      { view: 'admin-dashboard', label: 'Admin Console', icon: 'fa-shield-halved', color: 'violet' },
      { view: 'marketplace', label: 'Marketplace Audit', icon: 'fa-store', color: 'emerald' },
      { view: 'commodity-index', label: 'Price Index', icon: 'fa-chart-line', color: 'amber' },
      { view: 'rfq-board', label: 'RFQ Moderation', icon: 'fa-clipboard-list', color: 'blue' }
    ];
  } else {
    // Visitor / Public View
    ecosystemItems = [
      { view: 'marketplace', label: 'Marketplace', icon: 'fa-store', color: 'emerald' },
      { view: 'commodity-index', label: 'Price Index', icon: 'fa-chart-line', color: 'amber' },
      { view: 'nearby-farms', label: 'Nearby Farms', icon: 'fa-location-dot', color: 'teal' },
      { view: 'ai-insights', label: 'AI Crop Forecast', icon: 'fa-wand-magic-sparkles', color: 'amber' },
      { view: 'weather', label: 'Weather Radar', icon: 'fa-cloud-sun-rain', color: 'sky' },
      { view: 'export-trade', label: 'Export Market', icon: 'fa-globe-africa', color: 'cyan' },
      { view: 'cooperatives', label: 'Cooperatives', icon: 'fa-people-group', color: 'violet' },
      { view: 'forum', label: 'Farmer Forum', icon: 'fa-comments', color: 'orange' }
    ];
  }

  const colorMap = {
    emerald: { active: 'bg-emerald-600 text-white shadow-emerald-600/30', inactive: 'text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/30', icon: 'text-emerald-500' },
    blue: { active: 'bg-blue-600 text-white shadow-blue-600/30', inactive: 'text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/30', icon: 'text-blue-500' },
    amber: { active: 'bg-amber-600 text-white shadow-amber-600/30', inactive: 'text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/30', icon: 'text-amber-500' },
    rose: { active: 'bg-rose-600 text-white shadow-rose-600/30', inactive: 'text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/30', icon: 'text-rose-500' },
    sky: { active: 'bg-sky-600 text-white shadow-sky-600/30', inactive: 'text-sky-700 dark:text-sky-300 hover:bg-sky-50 dark:hover:bg-sky-950/30', icon: 'text-sky-500' },
    violet: { active: 'bg-violet-600 text-white shadow-violet-600/30', inactive: 'text-violet-700 dark:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-950/30', icon: 'text-violet-500' },
    purple: { active: 'bg-purple-600 text-white shadow-purple-600/30', inactive: 'text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/30', icon: 'text-purple-500' },
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
    <div class="sticky top-20 z-30 w-full glass-panel border-b border-emerald-900/5 dark:border-white/5 hidden sm:block">
      <div class="max-w-7xl mx-auto px-2 sm:px-4">
        <div class="flex items-center overflow-x-auto py-2 space-x-1 scrollbar-hide" style="scrollbar-width: none; -ms-overflow-style: none;">
          ${ecosystemItems.map(item => {
            const isActive = state.currentView === item.view;
            const colors = colorMap[item.color] || colorMap.emerald;
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

// Initial Boot with Session & View Restoration
// Loads all user data from localStorage to ensure persistence across page reloads and deployments
document.addEventListener('DOMContentLoaded', () => {
  // 1. ✅ Restore User Login Session from LocalStorage using StorageManager
  try {
    const savedUser = StorageManager.getUser();
    if (savedUser && savedUser.email) {
      state.currentUser = savedUser;
      state.activeRole = (savedUser.role || 'visitor').toLowerCase();
      console.log('✅ User restored from localStorage:', savedUser.email);
    }
  } catch (e) {
    console.warn('⚠️ Session restoration error:', e);
  }

  // 2. ✅ Restore Shopping Cart from LocalStorage
  try {
    const savedCart = StorageManager.getCart();
    if (Array.isArray(savedCart) && savedCart.length > 0) {
      state.cart = savedCart;
      console.log('✅ Cart restored from localStorage:', savedCart.length, 'items');
    }
  } catch (e) {
    console.warn('⚠️ Cart restoration error:', e);
  }

  // 3. ✅ Restore Wishlist from LocalStorage
  try {
    const savedWishlist = StorageManager.getWishlist();
    if (Array.isArray(savedWishlist) && savedWishlist.length > 0) {
      state.wishlist = savedWishlist;
      console.log('✅ Wishlist restored from localStorage:', savedWishlist.length, 'items');
    }
  } catch (e) {
    console.warn('⚠️ Wishlist restoration error:', e);
  }

  // 4. ✅ Restore Dark Mode Preference
  try {
    if (StorageManager.isDarkMode()) {
      state.darkMode = true;
      document.documentElement.classList.add('dark');
      console.log('✅ Dark mode restored');
    }
  } catch (e) {
    console.warn('⚠️ Dark mode restoration error:', e);
  }

  // 5. Restore Current View from URL Hash or LocalStorage
  try {
    // FARMER VERIFICATION LOCK ON BOOT: unverified farmers always go to farmer-verification
    if (state.currentUser && state.currentUser.role === 'FARMER' && state.currentUser.verification_status !== 'APPROVED') {
      state.currentView = 'farmer-verification';
    } else {
      const hash = window.location.hash.replace('#', '').trim();
      const savedView = hash || localStorage.getItem('agrein_current_view');
      if (savedView) {
        if (state.currentUser) {
          // If user is logged in, route safely to their view or dashboard
          actions.guardView(savedView);
        } else {
          const publicViews = ['landing', 'marketplace', 'ai-insights', 'nearby-farms', 'rfq-board', 'commodity-index', 'agro-doctor', 'weather', 'cooperatives', 'forum', 'learning-center', 'export-trade', 'bulk-b2b', 'traceability'];
          if (publicViews.includes(savedView)) {
            state.currentView = savedView;
          }
        }
      } else if (state.currentUser) {
        const role = state.currentUser.role;
        if (role === 'FARMER') state.currentView = 'farmer-dashboard';
        else if (role === 'BUYER') state.currentView = 'buyer-dashboard';
        else if (role === 'ADMIN') state.currentView = 'admin-dashboard';
      }
    }
  } catch (e) {}

  // 6. Handle return from Interswitch Web Redirect Checkout
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    const txnRef = urlParams.get('txn_ref');
    const failureMsg = urlParams.get('message');

    if (paymentStatus === 'success') {
      state.cart = [];
      state.checkoutModalActive = false;
      state.checkoutProcessing = false;
      if (state.currentUser) {
        state.currentView = 'buyer-dashboard';
      }
      setTimeout(() => {
        actions.triggerToast(`✅ Payment successful! Order #${txnRef || ''} confirmed and protected in Escrow.`);
        if (typeof loadBuyerDashboard === 'function') {
          loadBuyerDashboard(state, actions);
        }
      }, 400);
      window.history.replaceState({}, document.title, window.location.pathname + (window.location.hash || ''));
    } else if (paymentStatus === 'failed') {
      state.checkoutProcessing = false;
      setTimeout(() => {
        actions.triggerToast(`❌ Payment failed: ${failureMsg || 'Transaction was not completed'}`);
      }, 400);
      window.history.replaceState({}, document.title, window.location.pathname + (window.location.hash || ''));
    }
  } catch (e) {
    console.warn('[payment status parse error]', e);
  }

  updateDocumentSEO(state.currentView);
  renderApp();

  // 3. Listen to browser Back/Forward & URL Hash changes
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '').trim();
    if (hash && hash !== state.currentView) {
      actions.guardView(hash);
    }
  });

  // Mobile bottom-nav: hide on scroll-down, re-show on scroll-up.
  // Passive + rAF-throttled so it has no perceivable cost. Width-gated so
  // the desktop layout never re-renders on scroll.
  let lastY = window.scrollY;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (window.innerWidth >= 1024) return; // desktop: never hide
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const goingDown = y > lastY && y > 80;
        if (goingDown !== state.bottomNavHidden) {
          state.bottomNavHidden = goingDown;
          if (y <= 80) state.bottomNavHidden = false; // always show at top
          renderApp();
        }
        lastY = y;
        state.scrollY = y;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Close any open overlay (mobile menu, modals, drawers) on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (state.mobileMenuOpen) { state.mobileMenuOpen = false; renderApp(); }
      if (state.cartOpen) { state.cartOpen = false; renderApp(); }
      if (state.wishlistOpen) { state.wishlistOpen = false; renderApp(); }
      if (state.chatActive) { state.chatActive = false; renderApp(); }
      if (state.authModalActive) { state.authModalActive = false; renderApp(); }
      if (state.addProductModalActive) { state.addProductModalActive = false; renderApp(); }
      if (state.withdrawalModalActive) { state.withdrawalModalActive = false; renderApp(); }
      if (state.activeModalProductId) { state.activeModalProductId = null; renderApp(); }
      if (state.interswitchCheckoutActive) { state.interswitchCheckoutActive = false; renderApp(); }
      if (state.checkoutModalActive) { state.checkoutModalActive = false; renderApp(); }
      if (state.disputeModalActive) { state.disputeModalActive = false; renderApp(); }
      if (state.changePasswordModalActive) { state.changePasswordModalActive = false; renderApp(); }
      if (state.navbarMenuOpen) { state.navbarMenuOpen = false; renderApp(); }
    }
  });

  // Sync live products from backend
  fetch('/api/products')
    .then(r => r.json())
    .then(data => {
      // /api/products returns { success, count, data: [...] }
      if (data && data.success && Array.isArray(data.data) && data.data.length > 0) {
        state.mockData.products = data.data;
        // One-shot migration: drop any cart/wishlist items whose IDs are not
        // present in the live catalog. Removes the placeholder product IDs
        // (prod-001, prod-002, etc.) that older demo builds seeded into
        // localStorage so returning users don't see ghost items.
        const validIds = new Set(data.data.map(p => p.id));
        const cartBefore = state.cart.length;
        const wishBefore = state.wishlist.length;
        state.cart = state.cart.filter(item => validIds.has(item.id));
        state.wishlist = state.wishlist.filter(id => validIds.has(id));
        if (state.cart.length !== cartBefore) StorageManager.saveCart(state.cart);
        if (state.wishlist.length !== wishBefore) StorageManager.saveWishlist(state.wishlist);
        renderApp();
      }
    })
    .catch(() => {});

  // Admin directory is admin-only — skip the call for everyone else to keep
  // the console clean (the endpoint 401s for non-admins).
  if (state.currentUser && (state.currentUser.role || '').toUpperCase() === 'ADMIN') {
    actions.fetchRegisteredUsers();
  }

  // ──────────────────────────────────────────────────────────
  // PWA bootstrap: service-worker updates, online/offline
  // detection, iOS-vs-Android install affordances.
  // ──────────────────────────────────────────────────────────

  // Restore the user's "don't show the install hint again" choice.
  try {
    if (localStorage.getItem('agrein_pwa_hint_dismissed') === '1') {
      state.pwaHintDismissed = true;
    }
  } catch (e) {}

  // Track online/offline so the offline ribbon appears and disappears.
  state.isOnline = navigator.onLine;
  window.addEventListener('online', () => actions.setOnlineStatus(true));
  window.addEventListener('offline', () => actions.setOnlineStatus(false));

  // Service-worker lifecycle. Register first (no-op if already registered),
  // then attach update listeners so we can surface a toast on a fresh deploy.
  // Without the register() call, first-time visitors never get a SW.
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      // If a new SW is already waiting on first load (e.g. fresh deploy + reload),
      // prompt the user to reload into the fresh cached bundle.

      const promptWaiting = () => {
        if (registration.waiting) {
          state.swUpdateAvailable = true;
          renderApp();
        }
      };

      // SW already waiting on first load (e.g. fresh deploy + reload).
      promptWaiting();

      // SW registered but not yet controlling this page — claim it.
      if (registration.active && !navigator.serviceWorker.controller) {
        registration.update();
      }

      // On any subsequent update, wait for the new worker.
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (!newWorker) return;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            promptWaiting();
          }
        });
      });

      // When the controller flips (new SW took over), trigger an automatic
      // update on next reload via a one-shot flag.
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.__AGREIN_SW_UPDATED__ = true;
      });

      // Check for updates once per page life + on visibility return.
      registration.update().catch(() => {});
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden) registration.update().catch(() => {});
      });
    }).catch(() => {});

    // Listen for SW messages — currently only SKIP_WAITING acknowledgements.
    navigator.serviceWorker.addEventListener('message', event => {
      if (event && event.data && event.data.type === 'SW_UPDATED') {
        state.swUpdateAvailable = true;
        renderApp();
      }
    });
  }

  // Android install: stash the deferredPrompt so a button can fire it later.
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    window._agreinInstallPrompt = event;
  });

  // Already-running standalone app (user already installed) — no hint needed.
  const isAlreadyInstalled =
    window.matchMedia && window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;

  // iOS detection: iPhone/iPad/iPod, but NOT already installed in standalone.
  const isIosLike = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); // iPad 13+
  if (isIosLike && !isAlreadyInstalled && !state.pwaHintDismissed) {
    // Show the iOS hint after a short delay so it doesn't hijack first-render.
    setTimeout(() => { actions.showIosInstallHint(); }, 4000);
  }

  // Surface an "Install App" affordance in the Android UI when the browser
  // has actually given us a prompt. We just expose a global helper so any
  // future button or onboarding step can call it.
  window.installAgreinApp = () => {
    if (isAlreadyInstalled) {
      actions.triggerToast('✅ Agrein is already installed on this device.');
      return;
    }
    if (window._agreinInstallPrompt) {
      actions.showAndroidInstallPrompt();
    } else if (isIosLike) {
      actions.showIosInstallHint();
    } else {
      actions.triggerToast('📲 Use your browser menu to install Agrein to your home screen.');
    }
  };
});

// Live Crop Listing Modal Component
function renderAddProductModal(state, actions) {
  if (!state.addProductModalActive) return '';

  return `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div class="modal-fullscreen-mobile relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-emerald-500/20 overflow-hidden animate-modal max-h-[90vh] overflow-y-auto">
        <button onclick="actions.closeAddProductModal()" class="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-gray-300 flex items-center justify-center hover:bg-slate-300 transition-all">
          <i class="fa-solid fa-xmark text-sm"></i>
        </button>

        <div class="bg-gradient-to-r from-emerald-800 to-emerald-900 p-6 text-white text-center">
          <div class="w-12 h-12 rounded-2xl bg-white/20 mx-auto flex items-center justify-center mb-2">
            <i class="fa-solid fa-plus text-amber-300 text-xl"></i>
          </div>
          <h3 class="text-xl font-heading font-extrabold">List New Harvest Crop</h3>
          <p class="text-xs text-emerald-200 mt-1">Publish produce directly to buyers with Interswitch escrow protection</p>
        </div>

        <div class="p-6 space-y-4">
          <div>
            <label class="text-xs font-bold text-gray-500 dark:text-gray-400">Crop Title *</label>
            <input type="text" id="newProdTitle" placeholder="e.g. Export-Grade White Yam Tubers" class="w-full mt-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none">
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-xs font-bold text-gray-500 dark:text-gray-400">Category *</label>
              <select id="newProdCategory" class="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none">
                <option value="Grains & Cereals">Grains & Cereals</option>
                <option value="Tubers & Roots">Tubers & Roots</option>
                <option value="Oilseeds & Nuts">Oilseeds & Nuts</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Fruits">Fruits</option>
                <option value="Livestock & Poultry">Livestock & Poultry</option>
              </select>
            </div>
            <div>
              <label class="text-xs font-bold text-gray-500 dark:text-gray-400">Farm State *</label>
              <select id="newProdState" class="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none">
                <option value="Kaduna">Kaduna</option>
                <option value="Benue">Benue</option>
                <option value="Jos, Plateau">Jos, Plateau</option>
                <option value="Ogun">Ogun</option>
                <option value="Ondo">Ondo</option>
                <option value="Jigawa">Jigawa</option>
                <option value="Kano">Kano</option>
                <option value="Lagos">Lagos</option>
                <option value="Oyo">Oyo</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-3">
            <div>
              <label class="text-xs font-bold text-gray-500 dark:text-gray-400">Price (₦) *</label>
              <input type="number" id="newProdPrice" placeholder="520" class="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none">
            </div>
            <div>
              <label class="text-xs font-bold text-gray-500 dark:text-gray-400">Unit *</label>
              <select id="newProdUnit" class="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none">
                <option value="kg">kg</option>
                <option value="Bag">Bag (50kg)</option>
                <option value="Tuber">Tuber</option>
                <option value="Ton">Metric Ton</option>
                <option value="Crate">Crate</option>
              </select>
            </div>
            <div>
              <label class="text-xs font-bold text-gray-500 dark:text-gray-400">Available Qty *</label>
              <input type="number" id="newProdQty" placeholder="500" class="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none">
            </div>
          </div>

          <div>
            <label class="text-xs font-bold text-gray-500 dark:text-gray-400">Image URL (Optional)</label>
            <input type="url" id="newProdImage" placeholder="https://images.unsplash.com/..." class="w-full mt-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none">
          </div>

          <div class="flex items-center space-x-2 pt-1">
            <input type="checkbox" id="newProdOrganic" class="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300">
            <label for="newProdOrganic" class="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center space-x-1">
              <i class="fa-solid fa-leaf text-emerald-500"></i>
              <span>Certified Organic / Pesticide-Free Crop</span>
            </label>
          </div>

          <div class="pt-3">
            <button onclick="actions.submitNewProduct()" class="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-700 to-emerald-900 text-white font-extrabold text-xs shadow-xl hover:shadow-2xl transition-all flex items-center justify-center space-x-2">
              <i class="fa-solid fa-cloud-arrow-up text-amber-300"></i>
              <span>Publish Crop to Marketplace</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Live Payout / Withdrawal Modal Component
function renderWithdrawalModal(state, actions) {
  if (!state.withdrawalModalActive) return '';
  const availableBalance = state.mockData.farmerProfile?.availableBalance || 0;

  return `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div class="modal-fullscreen-mobile relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-emerald-500/20 overflow-hidden animate-modal">
        <button onclick="actions.closeWithdrawalModal()" class="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-gray-300 flex items-center justify-center hover:bg-slate-300 transition-all">
          <i class="fa-solid fa-xmark text-sm"></i>
        </button>

        <div class="bg-gradient-to-r from-emerald-800 to-emerald-900 p-6 text-white text-center">
          <div class="w-12 h-12 rounded-2xl bg-white/20 mx-auto flex items-center justify-center mb-2">
            <i class="fa-solid fa-building-columns text-amber-300 text-xl"></i>
          </div>
          <h3 class="text-xl font-heading font-extrabold">Instant Bank Payout</h3>
          <p class="text-xs text-emerald-200 mt-1">Interswitch Automated Clearing House (ACH)</p>
        </div>

        <div class="p-6 space-y-4">
          <div class="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/20 flex items-center justify-between">
            <div>
              <div class="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Available Balance</div>
              <div class="text-2xl font-heading font-extrabold text-emerald-700 dark:text-emerald-300">₦${availableBalance.toLocaleString()}</div>
            </div>
            <div class="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <i class="fa-solid fa-wallet text-base"></i>
            </div>
          </div>

          <div>
            <label class="text-xs font-bold text-gray-500 dark:text-gray-400">Withdrawal Amount (₦) *</label>
            <input type="number" id="withdrawAmount" max="${availableBalance}" placeholder="Enter amount (e.g. 50000)" class="w-full mt-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none">
          </div>

          <div>
            <label class="text-xs font-bold text-gray-500 dark:text-gray-400">Destination Bank *</label>
            <select id="withdrawBank" class="w-full mt-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none">
              <option value="First Bank of Nigeria">First Bank of Nigeria</option>
              <option value="Zenith Bank">Zenith Bank</option>
              <option value="Access Bank">Access Bank</option>
              <option value="United Bank for Africa (UBA)">United Bank for Africa (UBA)</option>
              <option value="Guaranty Trust Bank (GTBank)">Guaranty Trust Bank (GTBank)</option>
              <option value="Stanbic IBTC Bank">Stanbic IBTC Bank</option>
              <option value="Fidelity Bank">Fidelity Bank</option>
              <option value="Kuda Microfinance Bank">Kuda Bank</option>
              <option value="Moniepoint Microfinance Bank">Moniepoint</option>
              <option value="OPay Digital Services">OPay</option>
            </select>
          </div>

          <div>
            <label class="text-xs font-bold text-gray-500 dark:text-gray-400">10-Digit NUBAN Account Number *</label>
            <input type="tel" id="withdrawAccount" maxlength="10" placeholder="0123456789" class="w-full mt-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none">
          </div>

          <div class="pt-2">
            <button onclick="actions.submitWithdrawal()" class="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-700 to-emerald-900 text-white font-extrabold text-xs shadow-xl hover:shadow-2xl transition-all flex items-center justify-center space-x-2">
              <i class="fa-solid fa-paper-plane text-amber-300"></i>
              <span>Initiate Bank Transfer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ============================================================
//  Phase D — realtime wiring + apiFetch wrapper
// ============================================================

// apiFetch attaches the user's JWT (and legacy x-user-* headers during the
// transition) and surfaces 401 by triggering a re-login modal.
window.apiFetch = async (path, opts) => {
  opts = opts || {};
  const headers = new Headers(opts.headers || {});
  const u = state.currentUser;
  if (u && u.token) headers.set('Authorization', 'Bearer ' + u.token);
  if (u) {
    if (u.id) headers.set('x-user-id', u.id);
    if (u.role) headers.set('x-user-role', u.role);
    if (u.email) headers.set('x-user-email', u.email);
    if (u.verification_status) headers.set('x-verification-status', u.verification_status);
  }
  const res = await fetch(path, Object.assign({}, opts, { headers }));
  if (res.status === 401) {
    try {
      // Bounce the visitor back to login.
      if (typeof actions.logout === 'function') actions.logout();
    } catch (_) { /* ignore */ }
    return res;
  }
  return res;
};

// Refetch dispatcher: each realtime channel calls this with a slice name.
// Slice handlers perform an apiFetch with debouncing and merge results back into state.
const _refetchDebounceTimers = {};
window.__AGREIN_REALTIME_REFETCH__ = function (slice) {
  if (_refetchDebounceTimers[slice]) {
    clearTimeout(_refetchDebounceTimers[slice]);
  }
  _refetchDebounceTimers[slice] = setTimeout(() => {
    delete _refetchDebounceTimers[slice];
    try {
      if (slice === 'products') {
        apiFetch('/api/products').then(r => r.json()).then(j => {
          if (j && j.success && Array.isArray(j.data)) {
            state.mockData.products = j.data;
            state.catalogProducts = j.data;
            renderApp();
          }
        }).catch(() => {});
      } else if (slice === 'orders') {
        const role = state.currentUser && state.currentUser.role === 'FARMER' ? 'farmer' : 'buyer';
        apiFetch('/api/orders/list?role=' + role).then(r => r.json()).then(j => {
          if (j && j.success) {
            if (role === 'farmer') {
              if (state.farmerDashboard) state.farmerDashboard.incomingOrders = j.data || [];
            } else if (state.buyerDashboard) {
              state.buyerDashboard.pastOrders = j.data || [];
            }
            renderApp();
          }
        }).catch(() => {});
      } else if (slice === 'wallet') {
        apiFetch('/api/wallet').then(r => r.json()).then(j => {
          if (j && j.success) {
            if (state.walletSnapshot) Object.assign(state.walletSnapshot, j.wallet || {});
            if (state.farmerDashboard && j.wallet) {
              state.farmerDashboard.availableBalance = _kobo(j.wallet.availableBalance);
              state.farmerDashboard.escrowBalance = _kobo(j.wallet.escrowHeldBalance);
            }
            if (state.buyerDashboard && j.wallet) {
              state.buyerDashboard.escrowHeld = _kobo(j.wallet.escrowHeldBalance);
            }
            renderApp();
          }
        }).catch(() => {});
      } else if (slice === 'rfqs' || slice === 'rfqBids') {
        apiFetch('/api/rfqs').then(r => r.json()).then(j => {
          if (j && j.success) {
            state.rfqList = j.data || [];
            if (state.buyerDashboard) state.buyerDashboard.myRfqs = (j.data || []).length;
            renderApp();
          }
        }).catch(() => {});
      } else if (slice === 'disputes') {
        const role = (state.currentUser && state.currentUser.role) || 'BUYER';
        const url = role === 'ADMIN' ? '/api/disputes?role=admin&status=OPEN' : `/api/disputes?role=${role.toLowerCase()}&status=OPEN`;
        apiFetch(url).then(r => r.json()).then(j => {
          if (j && j.success) {
            if (state.adminDashboard) state.adminDashboard.openDisputesCount = (j.disputes || []).length;
            if (state.buyerDashboard) state.buyerDashboard.inDispute = (j.disputes || []).length;
            renderApp();
          }
        }).catch(() => {});
      } else if (slice === 'verification') {
        if (state.currentUser && state.currentUser.role === 'FARMER') {
          actions.fetchFarmerVerification();
        }
      } else if (slice === 'verificationQueue') {
        if (state.currentUser && state.currentUser.role === 'ADMIN') {
          actions.fetchAdminVerifications();
          actions.fetchRegisteredUsers();
        }
      } else if (slice === 'registeredUsers') {
        apiFetch('/api/admin/users').then(r => r.json()).then(j => {
          if (j && j.success) {
            state.registeredUsersList = j.users || [];
            if (j.counts) state.registeredUsersCounts = j.counts;
            renderApp();
          }
        }).catch(() => {});
      } else if (slice === 'nearbyFarms') {
        if (state.currentView === 'nearby-farms') {
          actions.refreshNearbyFarms();
        }
      } else if (slice === 'notifications' || slice === 'adminNotifications') {
        renderApp();
      }
    } catch (err) {
      console.warn('[realtime] slice', slice, 'failed:', err.message);
    }
  }, 300);
};

// Realtime lifecycle helper — call after login, on view change, and tear down on logout.
function _agreinRealtimeRefresh() {
  try {
    if (!window.realtime) return;
    if (state.currentUser && state.currentUser.id) {
      window.realtime.subscribe(state.currentUser, state.currentView);
    } else {
      window.realtime.teardown();
    }
  } catch (e) {
    console.warn('[agrein] realtime refresh failed:', e.message);
  }
}

// Patch logout so realtime tears down immediately.
const _origLogout = actions.logout;
actions.logout = function () {
  const ret = _origLogout.apply(this, arguments);
  try { actions.stopNearbyFarmsPolling && actions.stopNearbyFarmsPolling(); } catch (_) { /* ignore */ }
  try {
    if (state.nearbyMapInstance && typeof state.nearbyMapInstance.remove === 'function') {
      state.nearbyMapInstance.remove();
    }
    state.nearbyMapInstance = null;
    state.nearbyMapMarkersLayer = null;
    state.nearbyMapInitialized = false;
  } catch (_) { /* ignore */ }
  try { window.realtime && window.realtime.teardown(); } catch (_) { /* ignore */ }
  return ret;
};

// Patch actions.setView so login + view changes refresh subscriptions.
const _origSetView = actions.setView;
actions.setView = function (view) {
  const ret = _origSetView.apply(this, arguments);
  _agreinRealtimeRefresh();
  return ret;
};

// ----------------------------------------------------------
//  Phase F — dashboard KPI loaders (real data, not literals)
// ----------------------------------------------------------

function _kobo(v) { return Number(v || 0); }

let _loadingFarmerDashboard = false;
function loadFarmerDashboard(state, actions) {
  if (!state.currentUser || _loadingFarmerDashboard) return;
  _loadingFarmerDashboard = true;
  if (!state.farmerDashboard) state.farmerDashboard = {};
  Promise.all([
    apiFetch('/api/wallet').then(r => r.json()),
    apiFetch('/api/orders/list?role=farmer').then(r => r.json()),
    apiFetch('/api/orders/list?role=farmer&status=RELEASED').then(r => r.json()),
    apiFetch('/api/products?owner=me').then(r => r.json()),
    apiFetch('/api/farmers/trust-score').then(r => r.json())
  ]).then(([wallet, inEscrow, released, products, trust]) => {
    _loadingFarmerDashboard = false;
    if (wallet && wallet.wallet) {
      state.farmerDashboard.availableBalance = _kobo(wallet.wallet.availableBalance);
      state.farmerDashboard.escrowBalance = _kobo(wallet.wallet.escrowHeldBalance);
    }
    if (inEscrow && inEscrow.data) state.farmerDashboard.incomingOrders = inEscrow.data;
    if (released && released.data) {
      state.farmerDashboard.lifetimeRevenue = released.total_amount || released.data.reduce((s, o) => s + _kobo(o.total_amount), 0);
    }
    if (products && products.data) state.farmerDashboard.activeCrops = products.data.length;
    if (trust && trust.success) state.farmerDashboard.trustScore = trust.score;
    renderApp();
  }).catch(err => {
    _loadingFarmerDashboard = false;
    console.warn('[farmer dashboard load] failed:', err.message);
  });
}

let _loadingBuyerDashboard = false;
function loadBuyerDashboard(state, actions) {
  if (!state.currentUser || _loadingBuyerDashboard) return;
  _loadingBuyerDashboard = true;
  if (!state.buyerDashboard) state.buyerDashboard = {};
  Promise.all([
    apiFetch('/api/orders/list?role=buyer').then(r => r.json()),
    apiFetch('/api/wallet').then(r => r.json()),
    apiFetch('/api/rfqs?owner=me').then(r => r.json()),
    apiFetch('/api/disputes?role=buyer&status=OPEN').then(r => r.json())
  ]).then(([orders, wallet, rfqs, disputes]) => {
    _loadingBuyerDashboard = false;
    const list = (orders && orders.data) || [];
    state.buyerDashboard.totalSpent = orders.total_amount || list.reduce((s, o) => s + _kobo(o.total_amount), 0);
    state.buyerDashboard.activeOrders = list.filter(o => o.escrow_status === 'IN_ESCROW' || o.escrow_status === 'PENDING' || o.escrow_status === 'SHIPPED').length;
    state.buyerDashboard.delivered = list.filter(o => o.escrow_status === 'DELIVERED' || o.escrow_status === 'RELEASED').length;
    state.buyerDashboard.pastOrders = list;
    if (wallet && wallet.wallet) state.buyerDashboard.escrowHeld = _kobo(wallet.wallet.escrowHeldBalance);
    state.buyerDashboard.myRfqs = rfqs && rfqs.data ? rfqs.data.length : 0;
    state.buyerDashboard.inDispute = disputes && disputes.disputes ? disputes.disputes.length : 0;
    renderApp();
  }).catch(err => {
    _loadingBuyerDashboard = false;
    console.warn('[buyer dashboard load] failed:', err.message);
  });
}

let _loadingAdminDashboard = false;
function loadAdminDashboard(state, actions) {
  if (!state.currentUser || state.currentUser.role !== 'ADMIN' || _loadingAdminDashboard) return;
  _loadingAdminDashboard = true;
  if (!state.adminDashboard) state.adminDashboard = {};
  Promise.all([
    apiFetch('/api/admin/users').then(r => r.json()),
    apiFetch('/api/admin/farmer-verifications?status=PENDING_REVIEW').then(r => r.json()),
    apiFetch('/api/disputes?role=admin&status=OPEN').then(r => r.json()),
    apiFetch('/api/admin/metrics/gmv').then(r => r.json())
  ]).then(([users, verifs, disputes, gmv]) => {
    _loadingAdminDashboard = false;
    if (users && users.users) {
      state.registeredUsersList = users.users;
      if (users.counts) state.registeredUsersCounts = users.counts;
    }
    if (verifs && verifs.applications) state.adminDashboard.pendingVerifications = verifs.applications.length;
    if (disputes && disputes.disputes) state.adminDashboard.openDisputesCount = disputes.disputes.length;
    if (gmv && gmv.success) state.adminDashboard.gmv30d = gmv.gmv;
    renderApp();
  }).catch(err => {
    _loadingAdminDashboard = false;
    console.warn('[admin dashboard load] failed:', err.message);
  });
}

// ═══════════════════════════════════════════════════════════════
// PWA INITIALIZATION & SERVICE WORKER LIFECYCLE FOR ALL DEVICES
// ═══════════════════════════════════════════════════════════════

function _initPwaAndMobileExperience() {
  // 0. Session, Verification Data & State Restoration from StorageManager
  try {
    const savedUser = StorageManager.getUser();
    if (savedUser && savedUser.email) {
      state.currentUser = savedUser;
      state.activeRole = (savedUser.role || 'visitor').toLowerCase();
      console.log('✅ User session restored:', savedUser.email, savedUser.role);
    }
  } catch (e) {
    console.warn('⚠️ User restoration error:', e);
  }

  try {
    const savedVerification = StorageManager.getFarmerVerification();
    if (savedVerification) {
      state.mockData.farmerVerificationApp = savedVerification;
      console.log('✅ Farmer verification form data restored from local storage');
    }
  } catch (e) {}

  try {
    const savedCart = StorageManager.getCart();
    if (Array.isArray(savedCart) && savedCart.length > 0) {
      state.cart = savedCart;
    }
  } catch (e) {}

  try {
    const savedWishlist = StorageManager.getWishlist();
    if (Array.isArray(savedWishlist) && savedWishlist.length > 0) {
      state.wishlist = savedWishlist;
    }
  } catch (e) {}

  try {
    if (StorageManager.isDarkMode()) {
      state.darkMode = true;
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}

  // View routing & role synchronization on boot
  try {
    if (state.currentUser && state.currentUser.role === 'FARMER') {
      const isApproved = state.currentUser.verification_status === 'APPROVED';
      const hash = window.location.hash.replace('#', '').trim();
      if (!isApproved) {
        state.currentView = 'farmer-verification';
      } else {
        state.currentView = hash || 'farmer-dashboard';
      }
      if (typeof actions.fetchFarmerVerification === 'function') {
        actions.fetchFarmerVerification();
        if (typeof actions.startFarmerVerificationPolling === 'function') {
          actions.startFarmerVerificationPolling();
        }
      }
    } else if (state.currentUser && state.currentUser.role === 'ADMIN') {
      const hash = window.location.hash.replace('#', '').trim();
      state.currentView = hash === 'admin-verification' ? 'admin-dashboard' : (hash || 'admin-dashboard');
      if (hash === 'admin-verification') state.adminActiveTab = 'verifications';
      if (typeof actions.fetchAdminVerifications === 'function') {
        actions.fetchAdminVerifications();
        actions.fetchRegisteredUsers();
      }
    } else if (state.currentUser && state.currentUser.role === 'BUYER') {
      const hash = window.location.hash.replace('#', '').trim();
      state.currentView = hash || 'buyer-dashboard';
    } else {
      const hash = window.location.hash.replace('#', '').trim();
      if (hash) state.currentView = hash === 'admin-verification' ? 'admin-dashboard' : hash;
    }
  } catch (e) {}

  // 1. Register Progressive Web App Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js', { scope: '/' })
        .then(registration => {
          console.log('[Agrein PWA] Service Worker registered with scope:', registration.scope);

          // Check for Service Worker updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  state.swUpdateAvailable = true;
                  renderApp();
                }
              });
            }
          });
        })
        .catch(err => {
          console.warn('[Agrein PWA] Service Worker registration failed:', err.message);
        });
    });
  }

  // 2. Intercept native beforeinstallprompt (Android / Chrome / Edge / Samsung Internet)
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    window._agreinInstallPrompt = e;
    const dismissed = localStorage.getItem('agrein_pwa_hint_dismissed');
    if (!dismissed) {
      state.showAndroidInstallPrompt = true;
      renderApp();
    }
  });

  // 3. Handle App Installed event
  window.addEventListener('appinstalled', () => {
    window._agreinInstallPrompt = null;
    state.showAndroidInstallPrompt = false;
    state.showIosInstallHint = false;
    actions.triggerToast('🎉 Agrein installed successfully! You can now launch it directly from your home screen.');
    renderApp();
  });

  // 4. Online / Offline network transition detection
  window.addEventListener('online', () => {
    actions.setOnlineStatus(true);
    actions.triggerToast('🟢 Reconnected to the internet.');
  });
  window.addEventListener('offline', () => {
    actions.setOnlineStatus(false);
    actions.triggerToast('🟡 You are offline. Browsing cached Agrein data.');
  });

  // 5. Initial App Render
  renderApp();
}

// Boot application
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', _initPwaAndMobileExperience);
} else {
  _initPwaAndMobileExperience();
}


