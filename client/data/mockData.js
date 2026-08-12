// Agrein State Store — minimal scaffold for a fresh production deployment.
// The full product catalog, verification queue, audit logs, wallet, and user
// records are populated by real users via /api endpoints. This file only
// ships the static reference data that does not depend on a logged-in user.

const INITIAL_MOCK_DATA = {
  // Real product categories — drives the ProductCatalog filter chips.
  categories: [
    { id: 'cat-1', name: 'Grains & Cereals', slug: 'grains', icon: '🌾', count: 0 },
    { id: 'cat-2', name: 'Tubers & Roots', slug: 'tubers', icon: '🥔', count: 0 },
    { id: 'cat-3', name: 'Fresh Vegetables', slug: 'vegetables', icon: '🥦', count: 0 },
    { id: 'cat-4', name: 'Fruits & Berries', slug: 'fruits', icon: '🍎', count: 0 },
    { id: 'cat-5', name: 'Cash Crops & Spices', slug: 'cash-crops', icon: '🌱', count: 0 },
    { id: 'cat-6', name: 'Livestock & Poultry', slug: 'livestock', icon: '🐓', count: 0 }
  ],

  // Real listings will be added when farmers publish their first harvest.
  products: [],

  // Verification queue is populated by farmers who submit their KYC.
  adminVerifications: [],
  verificationAuditLogs: [],
  farmerVerificationApp: null,

  verificationMetrics: {
    total_farmers: 0,
    verified_farmers: 0,
    pending_review: 0,
    under_review: 0,
    changes_required: 0,
    rejected: 0,
    suspended: 0,
    approval_rate: '—',
    avg_review_time: '—'
  },

  // Escrow disputes will appear here when buyers raise them.
  buyerDisputes: [],

  // Profile stubs — populated when a user logs in or registers.
  farmerProfile: null,
  buyerProfile: null,
  currentUser: null,

  // Static reference data — useful empty states until real data flows in.
  commodityMarketPrices: [],
  testimonials: [],
  rfqs: [],
  logisticsPartners: [],
  activeShipments: [],
  cooperatives: [],
  wallet: { balance: 0, escrowHeld: 0, totalEarnings: 0, currency: '₦', recentTransactions: [] },
  weatherData: null,
  learningResources: [],
  exportCommodities: [],
  forumPosts: [],
  traceabilityBatches: [],

  // Admin dashboard headline metrics.
  adminProfile: {
    totalGMV: 0,
    registeredFarmers: 0,
    registeredBuyers: 0,
    statesCovered: 0,
    pendingVerifications: 0,
    pendingDisputes: 0,
    pendingListings: 0
  }
};

// Expose for both CommonJS (server-side smoke tests) and the browser script tag.
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { INITIAL_MOCK_DATA };
}