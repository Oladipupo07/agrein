// Admin Dashboard Component for Agrein
// Executive SuperAdmin Command Console:
// 1. Executive Platform Analytics & Moderation Center
// 2. Comprehensive Farmer Verification & KYC Dossier Inspector
// 3. Registered Users Database Registry
// 4. Dispute Adjudication & Escrow Protection
// 5. Account Deletion Governance Queue

function renderAdminDashboard(state, actions) {
  const { adminProfile, products } = state.mockData || {};
  const verifications = state.mockData.adminVerifications || [];
  const activeTab = state.adminActiveTab || 'overview';
  const deletionRequests = state.deletionRequests || [];

  const userList = state.registeredUsersList || [
    {
      id: 'usr-admin-01',
      full_name: 'Akobe Oladipupo',
      email: 'akobeoladipupo@gmail.com',
      phone_number: '08000000001',
      role: 'ADMIN',
      email_verified: true,
      verification_status: 'APPROVED',
      created_at: new Date().toISOString()
    }
  ];

  const counts = state.registeredUsersCounts || {
    total: userList.length,
    farmers: userList.filter(u => u.role === 'FARMER').length,
    buyers: userList.filter(u => u.role === 'BUYER').length,
    admins: userList.filter(u => u.role === 'ADMIN').length
  };

  const verificationCounts = {
    total: verifications.length,
    pending: verifications.filter(v => v.status === 'PENDING_REVIEW').length,
    underReview: verifications.filter(v => v.status === 'UNDER_REVIEW').length,
    changesRequired: verifications.filter(v => v.status === 'CHANGES_REQUIRED').length,
    approved: verifications.filter(v => v.status === 'APPROVED').length,
    rejected: verifications.filter(v => v.status === 'REJECTED').length
  };

  const filterRole = state.adminUserFilterRole || 'ALL';
  const searchQuery = (state.adminUserSearch || '').toLowerCase().trim();
  const verificationFilter = state.adminVerificationFilter || 'ALL';
  const verificationSearch = (state.adminVerificationSearch || '').toLowerCase().trim();

  // Filter users based on tab and search
  const filteredUsers = userList.filter(u => {
    const matchRole = filterRole === 'ALL' || u.role === filterRole;
    const matchSearch = !searchQuery ||
      (u.full_name && u.full_name.toLowerCase().includes(searchQuery)) ||
      (u.email && u.email.toLowerCase().includes(searchQuery)) ||
      (u.phone_number && String(u.phone_number).includes(searchQuery));
    return matchRole && matchSearch;
  });

  // Filter verifications
  const filteredVerifications = verifications.filter(v => {
    const matchStatus = verificationFilter === 'ALL' || v.status === verificationFilter;
    const matchSearch = !verificationSearch ||
      (v.farmer_name && v.farmer_name.toLowerCase().includes(verificationSearch)) ||
      (v.farmer_email && v.farmer_email.toLowerCase().includes(verificationSearch)) ||
      (v.farm_name && v.farm_name.toLowerCase().includes(verificationSearch)) ||
      (v.farm_state && v.farm_state.toLowerCase().includes(verificationSearch)) ||
      (v.farm_lga && v.farm_lga.toLowerCase().includes(verificationSearch));
    return matchStatus && matchSearch;
  });

  const statusBadge = (status) => {
    const map = {
      'APPROVED': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700/40',
      'PENDING_REVIEW': 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-700/40 animate-pulse',
      'UNDER_REVIEW': 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300 dark:border-blue-700/40',
      'CHANGES_REQUIRED': 'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 border-orange-300 dark:border-orange-700/40',
      'REJECTED': 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 border-red-300 dark:border-red-700/40',
      'SUSPENDED': 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 border-red-300 dark:border-red-700/40'
    };
    return map[status] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const inspected = state.adminInspectedDossier;

  return `
    <div class="py-8 bg-slate-50/70 dark:bg-slate-950 min-h-screen space-y-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <!-- ═══ EXECUTIVE ADMIN HEADER & SUMMARY ═══ -->
        <div class="glass-card rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-l-8 border-l-purple-600 shadow-xl bg-gradient-to-r from-white via-purple-50/30 to-white dark:from-slate-900 dark:via-purple-950/10 dark:to-slate-900">
          <div>
            <div class="inline-flex items-center space-x-2 text-xs font-extrabold text-purple-700 dark:text-purple-400 uppercase tracking-wider bg-purple-100 dark:bg-purple-950/60 px-3 py-1 rounded-full mb-2">
              <i class="fa-solid fa-shield-halved"></i>
              <span>Agrein SuperAdmin Command Center</span>
            </div>
            <h1 class="text-3xl font-heading font-extrabold text-slate-900 dark:text-white">
              Platform Governance & Moderation
            </h1>
            <p class="text-xs text-gray-500 mt-1">Review farmer verification dossiers, inspect user databases, manage escrow disputes, and oversee marketplace health.</p>
          </div>

          <div class="flex items-center space-x-3 flex-wrap gap-2">
            <button onclick="actions.fetchRegisteredUsers(); actions.triggerToast('🔄 Registry refreshed!');" class="px-4 py-2.5 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-extrabold shadow-md transition-all flex items-center space-x-2">
              <i class="fa-solid fa-rotate text-amber-300"></i>
              <span>Refresh Data</span>
            </button>
            <button onclick="actions.setView('farmer-verification')" class="px-4 py-2.5 rounded-2xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-gray-200 text-xs font-bold hover:bg-gray-50 dark:hover:bg-slate-700 transition-all flex items-center space-x-2">
              <i class="fa-solid fa-eye text-emerald-500"></i>
              <span>Farmer Portal View</span>
            </button>
          </div>
        </div>

        <!-- ═══ METRICS KPI BAR ═══ -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm text-center">
            <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Users</div>
            <div class="text-xl font-heading font-extrabold text-slate-900 dark:text-white mt-1">${counts.total || userList.length}</div>
            <div class="text-[10px] text-purple-600 font-bold mt-0.5">Platform Members</div>
          </div>

          <div class="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 shadow-sm text-center cursor-pointer hover:border-amber-400 transition-all" onclick="actions.setAdminTab('verifications')">
            <div class="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center justify-center gap-1">
              <i class="fa-solid fa-clock"></i>
              <span>Pending KYC</span>
            </div>
            <div class="text-xl font-heading font-extrabold text-amber-700 dark:text-amber-300 mt-1">${verificationCounts.pending}</div>
            <div class="text-[10px] text-amber-600 font-bold mt-0.5">Requires Action</div>
          </div>

          <div class="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 shadow-sm text-center cursor-pointer hover:border-emerald-400 transition-all" onclick="actions.setAdminTab('verifications')">
            <div class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center justify-center gap-1">
              <i class="fa-solid fa-circle-check"></i>
              <span>Verified Farmers</span>
            </div>
            <div class="text-xl font-heading font-extrabold text-emerald-700 dark:text-emerald-300 mt-1">${verificationCounts.approved}</div>
            <div class="text-[10px] text-emerald-600 font-bold mt-0.5">Active Sellers</div>
          </div>

          <div class="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/40 shadow-sm text-center">
            <div class="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Registered Buyers</div>
            <div class="text-xl font-heading font-extrabold text-blue-700 dark:text-blue-300 mt-1">${counts.buyers}</div>
            <div class="text-[10px] text-blue-600 font-bold mt-0.5">Offtakers & Retail</div>
          </div>

          <div class="p-4 rounded-2xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800/40 shadow-sm text-center">
            <div class="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">Changes Requested</div>
            <div class="text-xl font-heading font-extrabold text-orange-700 dark:text-orange-300 mt-1">${verificationCounts.changesRequired}</div>
            <div class="text-[10px] text-orange-600 font-bold mt-0.5">Awaiting Farmer</div>
          </div>

          <div class="p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/40 shadow-sm text-center cursor-pointer hover:border-red-400 transition-all" onclick="actions.setAdminTab('deletions')">
            <div class="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider flex items-center justify-center gap-1">
              <i class="fa-solid fa-trash-can"></i>
              <span>Deletion Queue</span>
            </div>
            <div class="text-xl font-heading font-extrabold text-red-700 dark:text-red-300 mt-1">${deletionRequests.length}</div>
            <div class="text-[10px] text-red-600 font-bold mt-0.5">NDPR Requests</div>
          </div>
        </div>

        <!-- ═══ NAVIGATION TABS ═══ -->
        <div class="flex items-center space-x-2 border-b border-gray-200 dark:border-slate-800 pb-2 overflow-x-auto">
          <button onclick="actions.setAdminTab('overview')"
                  class="px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all flex items-center space-x-2 whitespace-nowrap ${activeTab === 'overview' ? 'bg-purple-700 text-white shadow-lg shadow-purple-700/20' : 'bg-white dark:bg-slate-900 text-gray-600 dark:text-gray-400 hover:text-purple-600'}">
            <i class="fa-solid fa-chart-pie"></i>
            <span>Overview & Insights</span>
          </button>

          <button onclick="actions.setAdminTab('verifications')"
                  class="px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all flex items-center space-x-2 whitespace-nowrap ${activeTab === 'verifications' ? 'bg-emerald-700 text-white shadow-lg shadow-emerald-700/20' : 'bg-white dark:bg-slate-900 text-gray-600 dark:text-gray-400 hover:text-emerald-600'}">
            <i class="fa-solid fa-id-card"></i>
            <span>Farmer KYC Dossiers</span>
            ${verificationCounts.pending > 0 ? `<span class="px-2 py-0.5 rounded-full bg-amber-400 text-slate-900 text-[10px] font-black">${verificationCounts.pending}</span>` : ''}
          </button>

          <button onclick="actions.setAdminTab('users')"
                  class="px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all flex items-center space-x-2 whitespace-nowrap ${activeTab === 'users' ? 'bg-blue-700 text-white shadow-lg shadow-blue-700/20' : 'bg-white dark:bg-slate-900 text-gray-600 dark:text-gray-400 hover:text-blue-600'}">
            <i class="fa-solid fa-database"></i>
            <span>User Database Directory</span>
            <span class="px-2 py-0.5 rounded-full bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-gray-300 text-[10px] font-bold">${counts.total || userList.length}</span>
          </button>

          <button onclick="actions.setAdminTab('disputes')"
                  class="px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all flex items-center space-x-2 whitespace-nowrap ${activeTab === 'disputes' ? 'bg-rose-700 text-white shadow-lg shadow-rose-700/20' : 'bg-white dark:bg-slate-900 text-gray-600 dark:text-gray-400 hover:text-rose-600'}">
            <i class="fa-solid fa-scale-balanced"></i>
            <span>Dispute Adjudication</span>
          </button>

          <button onclick="actions.setAdminTab('deletions')"
                  class="px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all flex items-center space-x-2 whitespace-nowrap ${activeTab === 'deletions' ? 'bg-red-700 text-white shadow-lg shadow-red-700/20' : 'bg-white dark:bg-slate-900 text-gray-600 dark:text-gray-400 hover:text-red-600'}">
            <i class="fa-solid fa-trash-can"></i>
            <span>Account Deletion Queue</span>
            ${deletionRequests.length > 0 ? `<span class="px-2 py-0.5 rounded-full bg-red-400 text-white text-[10px] font-black">${deletionRequests.length}</span>` : ''}
          </button>
        </div>

        <!-- ═══ TAB 1: OVERVIEW & SHORTCUTS ═══ -->
        ${activeTab === 'overview' ? `
          <div class="space-y-8">
            
            <!-- Quick Action Priority Banner -->
            ${verificationCounts.pending > 0 ? `
              <div class="p-6 rounded-3xl bg-gradient-to-r from-amber-500 via-amber-600 to-emerald-600 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div class="flex items-center space-x-4">
                  <div class="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl">
                    <i class="fa-solid fa-bell animate-bounce"></i>
                  </div>
                  <div>
                    <h3 class="text-lg font-heading font-extrabold">${verificationCounts.pending} Farmer Verification Application(s) Awaiting Review</h3>
                    <p class="text-xs text-amber-100 mt-0.5">Inspect documents, farm land coordinates, and government IDs to approve or request changes.</p>
                  </div>
                </div>
                <button onclick="actions.setAdminTab('verifications')" class="px-6 py-3 rounded-2xl bg-white text-slate-900 font-extrabold text-xs shadow-lg hover:bg-slate-100 transition-all whitespace-nowrap">
                  <span>Open Verification Queue</span>
                  <i class="fa-solid fa-arrow-right ml-1.5"></i>
                </button>
              </div>
            ` : ''}

            <!-- Governance Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div onclick="actions.setAdminTab('verifications')" class="glass-card p-6 rounded-3xl space-y-3 cursor-pointer hover:border-emerald-500/50 hover:shadow-xl transition-all group bg-white dark:bg-slate-900">
                <div class="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                  <i class="fa-solid fa-id-card"></i>
                </div>
                <div>
                  <h3 class="font-heading font-extrabold text-base text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">Farmer KYC Dossiers</h3>
                  <p class="text-xs text-gray-500 mt-1">Detailed inspection of farm size, crops, satellite GPS location, NIN, and uploaded deeds.</p>
                </div>
                <div class="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1 pt-1">
                  <span>${verificationCounts.total} Applications</span>
                  <i class="fa-solid fa-arrow-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
                </div>
              </div>

              <div onclick="actions.setAdminTab('users')" class="glass-card p-6 rounded-3xl space-y-3 cursor-pointer hover:border-blue-500/50 hover:shadow-xl transition-all group bg-white dark:bg-slate-900">
                <div class="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                  <i class="fa-solid fa-users"></i>
                </div>
                <div>
                  <h3 class="font-heading font-extrabold text-base text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">User Registry Inspector</h3>
                  <p class="text-xs text-gray-500 mt-1">Search, filter, inspect email OTP statuses, and view user profiles in real time.</p>
                </div>
                <div class="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center space-x-1 pt-1">
                  <span>${counts.total || userList.length} Registered Accounts</span>
                  <i class="fa-solid fa-arrow-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
                </div>
              </div>

              <div onclick="actions.setAdminTab('disputes')" class="glass-card p-6 rounded-3xl space-y-3 cursor-pointer hover:border-rose-500/50 hover:shadow-xl transition-all group bg-white dark:bg-slate-900">
                <div class="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/50 text-rose-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                  <i class="fa-solid fa-scale-balanced"></i>
                </div>
                <div>
                  <h3 class="font-heading font-extrabold text-base text-slate-900 dark:text-white group-hover:text-rose-600 transition-colors">Dispute Adjudication</h3>
                  <p class="text-xs text-gray-500 mt-1">Resolve escrow claims, inspect damaged goods evidence, and release payments.</p>
                </div>
                <div class="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center space-x-1 pt-1">
                  <span>Escrow Protection</span>
                  <i class="fa-solid fa-arrow-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
                </div>
              </div>

              <div onclick="actions.setAdminTab('deletions')" class="glass-card p-6 rounded-3xl space-y-3 cursor-pointer hover:border-red-500/50 hover:shadow-xl transition-all group bg-white dark:bg-slate-900">
                <div class="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/50 text-red-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                  <i class="fa-solid fa-trash-can"></i>
                </div>
                <div>
                  <h3 class="font-heading font-extrabold text-base text-slate-900 dark:text-white group-hover:text-red-600 transition-colors">Account Deletion Queue</h3>
                  <p class="text-xs text-gray-500 mt-1">Governance and compliance with NDPR data privacy erasure requests.</p>
                </div>
                <div class="text-xs font-bold text-red-600 dark:text-red-400 flex items-center space-x-1 pt-1">
                  <span>${deletionRequests.length} Pending Actions</span>
                  <i class="fa-solid fa-arrow-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
                </div>
              </div>
            </div>

            <!-- Recent KYC Queue Preview -->
            <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-slate-800 shadow-sm space-y-5">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-lg font-heading font-extrabold text-slate-900 dark:text-white">Recent Farmer Verification Applications</h3>
                  <p class="text-xs text-gray-500">Live submission stream ready for superadmin approval.</p>
                </div>
                <button onclick="actions.setAdminTab('verifications')" class="text-xs font-extrabold text-emerald-600 hover:text-emerald-700 flex items-center space-x-1">
                  <span>View All (${verifications.length})</span>
                  <i class="fa-solid fa-arrow-right text-[10px]"></i>
                </button>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                ${verifications.slice(0, 3).map(v => `
                  <div class="p-5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
                    <div class="flex items-center justify-between">
                      <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${statusBadge(v.status)}">${v.status.replace('_', ' ')}</span>
                      <span class="text-[10px] text-gray-400 font-mono">${v.submitted_at ? new Date(v.submitted_at).toLocaleDateString() : 'Draft'}</span>
                    </div>
                    <div>
                      <div class="font-extrabold text-sm text-slate-900 dark:text-white">${v.farmer_name || 'Farmer'}</div>
                      <div class="text-xs text-emerald-600 font-bold">${v.farm_name || 'Farm Details'}</div>
                      <div class="text-[11px] text-gray-500 mt-0.5"><i class="fa-solid fa-location-dot text-amber-500 mr-1"></i>${v.farm_state || 'Nigeria'}, ${v.farm_lga || ''}</div>
                    </div>
                    <button onclick="actions.openAdminReview('${v.id}')" class="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5">
                      <i class="fa-solid fa-magnifying-glass"></i>
                      <span>Inspect Details & Docs</span>
                    </button>
                  </div>
                `).join('')}
              </div>
            </div>

          </div>
        ` : ''}

        <!-- ═══ TAB 2: FARMER VERIFICATION & KYC DOSSIER QUEUE ═══ -->
        ${activeTab === 'verifications' ? `
          <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-emerald-500/20 shadow-sm space-y-6">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div class="inline-flex items-center space-x-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1">
                  <i class="fa-solid fa-user-check"></i>
                  <span>KYC Approval Pipeline</span>
                </div>
                <h2 class="text-2xl font-heading font-extrabold text-slate-900 dark:text-white">Farmer Verification Applications</h2>
                <p class="text-xs text-gray-500">Inspect full farmer credentials, GPS land coordinates, operational scale, and uploaded legal documents</p>
              </div>

              <!-- Status Filters -->
              <div class="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                ${[
                  { key: 'ALL', label: 'All' },
                  { key: 'PENDING_REVIEW', label: 'Pending' },
                  { key: 'UNDER_REVIEW', label: 'Under Review' },
                  { key: 'CHANGES_REQUIRED', label: 'Changes Needed' },
                  { key: 'APPROVED', label: 'Approved' },
                  { key: 'REJECTED', label: 'Rejected' }
                ].map(tab => `
                  <button onclick="actions.setAdminVerificationFilter('${tab.key}')"
                          class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${verificationFilter === tab.key ? 'bg-emerald-700 text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:text-emerald-600'}">
                    ${tab.label}
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Search Bar -->
            <div class="relative">
              <input type="text"
                     value="${state.adminVerificationSearch || ''}"
                     oninput="actions.setAdminVerificationSearch(this.value)"
                     placeholder="Search applications by farmer name, email, farm name, or state..."
                     class="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm">
              <i class="fa-solid fa-magnifying-glass absolute left-4 top-3.5 text-gray-400 text-sm"></i>
            </div>

            <!-- Applications Table -->
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead class="bg-emerald-50 dark:bg-slate-800/80 text-gray-600 dark:text-gray-300 font-bold border-b border-gray-200 dark:border-slate-700">
                  <tr>
                    <th class="py-3.5 px-4">Farmer Details</th>
                    <th class="py-3.5 px-4">Farm Details</th>
                    <th class="py-3.5 px-4">Location & GPS</th>
                    <th class="py-3.5 px-4">Documents</th>
                    <th class="py-3.5 px-4">Status</th>
                    <th class="py-3.5 px-4">Submitted</th>
                    <th class="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-slate-800">
                  ${filteredVerifications.length === 0 ? `
                    <tr>
                      <td colspan="7" class="py-10 text-center text-gray-500 font-medium">
                        No farmer verification applications found matching your criteria.
                      </td>
                    </tr>
                  ` : filteredVerifications.map(v => `
                    <tr class="hover:bg-emerald-50/30 dark:hover:bg-slate-800/40 transition-colors">
                      <td class="py-3.5 px-4 min-w-[160px]">
                        <div class="font-extrabold text-slate-900 dark:text-white text-xs">${v.farmer_name || 'Farmer'}</div>
                        <div class="text-[10px] text-gray-400 font-mono">${v.farmer_email || v.email || 'N/A'}</div>
                        <div class="text-[10px] text-gray-400">${v.phone || ''}</div>
                      </td>

                      <td class="py-3.5 px-4 min-w-[150px]">
                        <div class="font-bold text-slate-800 dark:text-gray-200">${v.farm_name || 'Agro Farm'}</div>
                        <div class="text-[10px] text-emerald-600 font-bold">${v.farm_type || 'Crop Farming'} • ${v.farm_size_acres || 0} Acres</div>
                        <div class="text-[10px] text-gray-500 truncate max-w-[160px]">${(v.crops_produced || []).join(', ') || 'N/A'}</div>
                      </td>

                      <td class="py-3.5 px-4 min-w-[140px]">
                        <div class="font-bold text-slate-700 dark:text-gray-300">${v.farm_state || v.state || 'Nigeria'}, ${v.farm_lga || ''}</div>
                        ${v.gps_latitude && v.gps_longitude ? `
                          <a href="https://www.google.com/maps?q=${v.gps_latitude},${v.gps_longitude}" target="_blank" class="inline-flex items-center space-x-1 text-[10px] text-blue-600 font-bold hover:underline">
                            <i class="fa-solid fa-location-crosshairs text-amber-500"></i>
                            <span>${v.gps_latitude.toString().slice(0, 7)}°, ${v.gps_longitude.toString().slice(0, 7)}°</span>
                          </a>
                        ` : '<span class="text-[10px] text-gray-400">No GPS coords</span>'}
                      </td>

                      <td class="py-3.5 px-4">
                        <span class="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-gray-200 font-bold text-[10px] inline-flex items-center space-x-1">
                          <i class="fa-solid fa-paperclip text-emerald-500"></i>
                          <span>${(v.documents || []).length} Uploads</span>
                        </span>
                      </td>

                      <td class="py-3.5 px-4">
                        <span class="px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${statusBadge(v.status)} whitespace-nowrap">
                          ${v.status.replace('_', ' ')}
                        </span>
                      </td>

                      <td class="py-3.5 px-4 text-gray-500 text-[11px] whitespace-nowrap">
                        ${v.submitted_at ? new Date(v.submitted_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                      </td>

                      <td class="py-3.5 px-4 text-right whitespace-nowrap space-x-1">
                        <button onclick="actions.openAdminReview('${v.id}')" class="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-[10px] shadow-sm transition-all inline-flex items-center space-x-1">
                          <i class="fa-solid fa-magnifying-glass"></i>
                          <span>Inspect Details</span>
                        </button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        ` : ''}

        <!-- ═══ TAB 3: USER DATABASE REGISTRY ═══ -->
        ${activeTab === 'users' ? `
          <div class="glass-card rounded-3xl p-6 sm:p-8 space-y-6 border border-blue-500/20 bg-white dark:bg-slate-900">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div class="inline-flex items-center space-x-2 text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-1">
                  <i class="fa-solid fa-database"></i>
                  <span>Database User Registry</span>
                </div>
                <h2 class="text-2xl font-heading font-extrabold text-slate-900 dark:text-white">Registered Users Directory</h2>
                <p class="text-xs text-gray-500">Inspect real-time registered accounts with role tags, verification status, and contact records</p>
              </div>

              <!-- Role Filter Pills -->
              <div class="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                <button onclick="actions.setAdminUserFilter('ALL')" class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${filterRole === 'ALL' ? 'bg-blue-700 text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:text-blue-600'}">
                  All Users (${counts.total || userList.length})
                </button>
                <button onclick="actions.setAdminUserFilter('FARMER')" class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${filterRole === 'FARMER' ? 'bg-emerald-700 text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:text-emerald-600'}">
                  🌾 Farmers (${counts.farmers || 0})
                </button>
                <button onclick="actions.setAdminUserFilter('BUYER')" class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${filterRole === 'BUYER' ? 'bg-blue-700 text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:text-blue-600'}">
                  🛒 Buyers (${counts.buyers || 0})
                </button>
                <button onclick="actions.setAdminUserFilter('ADMIN')" class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${filterRole === 'ADMIN' ? 'bg-purple-900 text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:text-purple-600'}">
                  🛡️ Admins (${counts.admins || 1})
                </button>
              </div>
            </div>

            <!-- Search Bar -->
            <div class="relative">
              <input type="text"
                     value="${state.adminUserSearch || ''}"
                     oninput="actions.setAdminUserSearch(this.value)"
                     placeholder="Search registered users by full name, email address, or phone number..."
                     class="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none shadow-sm">
              <i class="fa-solid fa-magnifying-glass absolute left-4 top-3.5 text-gray-400 text-sm"></i>
            </div>

            <!-- Table -->
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead class="bg-blue-50 dark:bg-slate-800/80 text-gray-600 dark:text-gray-300 font-bold border-b border-gray-200 dark:border-slate-700">
                  <tr>
                    <th class="py-3 px-4">User Name</th>
                    <th class="py-3 px-4">Role</th>
                    <th class="py-3 px-4">Email Address</th>
                    <th class="py-3 px-4">Phone Number</th>
                    <th class="py-3 px-4">Email OTP</th>
                    <th class="py-3 px-4">KYC / Verification</th>
                    <th class="py-3 px-4">Registered Date</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-slate-800">
                  ${filteredUsers.map(u => `
                    <tr class="hover:bg-blue-50/30 dark:hover:bg-slate-800/40 transition-colors">
                      <td class="py-3.5 px-4 font-bold text-slate-900 dark:text-white flex items-center space-x-2.5">
                        <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-extrabold text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
                          ${(u.full_name || u.email || 'U')[0].toUpperCase()}
                        </div>
                        <span class="truncate max-w-[150px] sm:max-w-none">${u.full_name || 'Agrein User'}</span>
                      </td>
                      <td class="py-3.5 px-4">
                        <span class="px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${u.role === 'FARMER' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300' : (u.role === 'BUYER' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300' : 'bg-purple-100 text-purple-800 border-purple-300')}">
                          ${u.role}
                        </span>
                      </td>
                      <td class="py-3.5 px-4 font-mono font-medium text-gray-700 dark:text-gray-300">${u.email}</td>
                      <td class="py-3.5 px-4 font-mono text-gray-600 dark:text-gray-400">${u.phone_number || 'N/A'}</td>
                      <td class="py-3.5 px-4">
                        ${u.email_verified ? `
                          <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold flex items-center space-x-1 w-max">
                            <i class="fa-solid fa-circle-check text-emerald-500"></i>
                            <span>Verified</span>
                          </span>
                        ` : `
                          <span class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-[10px] font-bold flex items-center space-x-1 w-max">
                            <i class="fa-solid fa-clock text-amber-500"></i>
                            <span>Pending</span>
                          </span>
                        `}
                      </td>
                      <td class="py-3.5 px-4">
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.verification_status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                          u.verification_status === 'PENDING' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                          'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-gray-400'
                        }">
                          ${u.verification_status || 'NOT_STARTED'}
                        </span>
                      </td>
                      <td class="py-3.5 px-4 text-gray-500 text-[11px]">
                        ${new Date(u.created_at || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        ` : ''}

        <!-- ═══ TAB 4: DISPUTE ADJUDICATION ═══ -->
        ${activeTab === 'disputes' ? `
          <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-rose-500/20 shadow-sm space-y-6">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-2xl font-heading font-extrabold text-slate-900 dark:text-white">Escrow Dispute Adjudication</h2>
                <p class="text-xs text-gray-500 mt-1">Review buyer complaints, damaged produce claims, and issue Interswitch escrow refunds or payout releases.</p>
              </div>
              <span class="px-3 py-1.5 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-xs font-extrabold">
                0 Active Disputes
              </span>
            </div>

            <div class="py-12 text-center text-xs text-gray-400">
              <i class="fa-solid fa-scale-balanced text-4xl text-emerald-500/60 mb-3 block"></i>
              <div class="font-extrabold text-slate-800 dark:text-gray-200 text-sm">All Orders in Good Standing</div>
              <p class="text-gray-500 mt-1 max-w-md mx-auto">No open dispute cases. When buyers file quality or delivery disputes, they will appear here for admin mediation.</p>
            </div>
          </div>
        ` : ''}

        <!-- ═══ TAB 5: ACCOUNT DELETION QUEUE ═══ -->
        ${activeTab === 'deletions' ? `
          <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-red-500/30 shadow-sm space-y-6">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-2xl font-heading font-extrabold text-slate-900 dark:text-white">NDPR Account Deletion Queue</h2>
                <p class="text-xs text-gray-500 mt-1">Governance queue for user account removal and GDPR/NDPR compliant data purging.</p>
              </div>
              <span class="px-3 py-1.5 rounded-xl bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 text-xs font-extrabold">
                ${deletionRequests.length} Pending
              </span>
            </div>

            ${deletionRequests.length === 0 ? `
              <div class="py-12 text-center text-xs text-gray-400">
                <i class="fa-solid fa-shield-halved text-4xl text-emerald-500/60 mb-3 block"></i>
                <div class="font-extrabold text-slate-800 dark:text-gray-200 text-sm">No Pending Deletion Requests</div>
                <p class="text-gray-500 mt-1">All accounts are active and compliant.</p>
              </div>
            ` : `
              <div class="space-y-3">
                ${deletionRequests.map(req => `
                  <div class="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div class="font-extrabold text-slate-900 dark:text-white text-sm">${req.full_name || req.email}</div>
                      <div class="text-xs text-red-600 font-medium mt-0.5">Reason: "${req.reason || 'No reason specified'}"</div>
                      <div class="text-[10px] text-gray-400 mt-1">Requested: ${new Date(req.created_at || Date.now()).toLocaleString()}</div>
                    </div>
                    <button onclick="actions.approveDeletion('${req.id}')" class="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow transition-all">
                      Approve & Erase
                    </button>
                  </div>
                `).join('')}
              </div>
            `}
          </div>
        ` : ''}

      </div>
    </div>

    <!-- ═══ FULL DOSSIER INSPECTION MODAL / DRAWER ═══ -->
    ${state.adminInspectionModalActive && inspected ? `
      <div class="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
        <div class="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-slate-800 shadow-2xl space-y-6 p-6 sm:p-8 relative">
          
          <!-- Modal Header -->
          <div class="flex items-start justify-between border-b border-gray-100 dark:border-slate-800 pb-4">
            <div>
              <div class="flex items-center space-x-2">
                <span class="px-3 py-1 rounded-full text-xs font-extrabold border ${statusBadge(inspected.status)}">
                  ${inspected.status.replace('_', ' ')}
                </span>
                <span class="text-xs text-gray-400 font-mono">ID: ${inspected.id}</span>
              </div>
              <h2 class="text-2xl font-heading font-extrabold text-slate-900 dark:text-white mt-1.5">
                ${inspected.farmer_name || 'Farmer Verification Dossier'}
              </h2>
              <p class="text-xs text-gray-500">Submitted on ${inspected.submitted_at ? new Date(inspected.submitted_at).toLocaleString() : 'Recent'}</p>
            </div>
            
            <button onclick="actions.closeAdminInspectionModal()" class="w-9 h-9 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-500 hover:text-gray-700 dark:hover:text-white flex items-center justify-center text-sm transition-all">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <!-- Section 1: Farmer Personal Details -->
          <div class="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 space-y-3">
            <div class="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
              <i class="fa-solid fa-user"></i>
              <span>1. Farmer Personal Information</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div><span class="text-gray-400 block text-[10px]">Full Name</span><span class="font-bold text-slate-900 dark:text-white">${inspected.farmer_name || 'N/A'}</span></div>
              <div><span class="text-gray-400 block text-[10px]">Email Address</span><span class="font-bold text-slate-900 dark:text-white">${inspected.farmer_email || inspected.email || 'N/A'}</span></div>
              <div><span class="text-gray-400 block text-[10px]">Phone Number</span><span class="font-bold text-slate-900 dark:text-white">${inspected.phone || 'N/A'}</span></div>
              <div><span class="text-gray-400 block text-[10px]">Residential State</span><span class="font-bold text-slate-900 dark:text-white">${inspected.state || inspected.farm_state || 'N/A'}</span></div>
              <div><span class="text-gray-400 block text-[10px]">Residential LGA</span><span class="font-bold text-slate-900 dark:text-white">${inspected.lga || inspected.farm_lga || 'N/A'}</span></div>
              <div><span class="text-gray-400 block text-[10px]">Residential Address</span><span class="font-bold text-slate-900 dark:text-white">${inspected.residential_address || 'N/A'}</span></div>
            </div>
          </div>

          <!-- Section 2: Farm Operational Details -->
          <div class="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 space-y-3">
            <div class="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
              <i class="fa-solid fa-tractor"></i>
              <span>2. Farm Operational Profile</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div><span class="text-gray-400 block text-[10px]">Farm / Business Name</span><span class="font-bold text-slate-900 dark:text-white">${inspected.farm_name || 'N/A'}</span></div>
              <div><span class="text-gray-400 block text-[10px]">Farm Type</span><span class="font-bold text-slate-900 dark:text-white">${inspected.farm_type || 'Crop Farming'}</span></div>
              <div><span class="text-gray-400 block text-[10px]">Land Size (Acres)</span><span class="font-bold text-slate-900 dark:text-white">${inspected.farm_size_acres || 0} Acres</span></div>
              <div><span class="text-gray-400 block text-[10px]">Farming Experience</span><span class="font-bold text-slate-900 dark:text-white">${inspected.years_experience || 0} Years</span></div>
              <div class="sm:col-span-2"><span class="text-gray-400 block text-[10px]">Crops & Livestock Produced</span><span class="font-bold text-slate-900 dark:text-white">${Array.isArray(inspected.crops_produced) ? inspected.crops_produced.join(', ') : (inspected.crops_produced || 'N/A')}</span></div>
              <div class="sm:col-span-3"><span class="text-gray-400 block text-[10px]">Intended Produce for Sale</span><span class="font-bold text-slate-900 dark:text-white">${inspected.intended_products || 'All certified harvest'}</span></div>
            </div>
          </div>

          <!-- Section 3: Physical Location & GPS Satellite Verification -->
          <div class="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 space-y-3">
            <div class="flex items-center justify-between">
              <div class="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
                <i class="fa-solid fa-map-location-dot"></i>
                <span>3. Farm Physical Location & Satellite GPS Pin</span>
              </div>
              ${inspected.gps_latitude && inspected.gps_longitude ? `
                <a href="https://www.google.com/maps?q=${inspected.gps_latitude},${inspected.gps_longitude}" target="_blank" class="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-[10px] shadow transition-all flex items-center space-x-1">
                  <i class="fa-solid fa-satellite"></i>
                  <span>Open Satellite View</span>
                </a>
              ` : ''}
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div class="sm:col-span-3"><span class="text-gray-400 block text-[10px]">Farm Physical Address / Landmark</span><span class="font-bold text-slate-900 dark:text-white">${inspected.farm_location || 'N/A'}</span></div>
              <div><span class="text-gray-400 block text-[10px]">Farm State</span><span class="font-bold text-slate-900 dark:text-white">${inspected.farm_state || inspected.state || 'N/A'}</span></div>
              <div><span class="text-gray-400 block text-[10px]">Farm LGA</span><span class="font-bold text-slate-900 dark:text-white">${inspected.farm_lga || inspected.lga || 'N/A'}</span></div>
              <div><span class="text-gray-400 block text-[10px]">Exact GPS Coordinates</span><span class="font-mono font-bold text-emerald-600 dark:text-emerald-400">${inspected.gps_latitude || '—'}° N, ${inspected.gps_longitude || '—'}° E</span></div>
            </div>
          </div>

          <!-- Section 4: Uploaded Documents & Photographs -->
          <div class="space-y-3">
            <div class="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
              <i class="fa-solid fa-file-shield"></i>
              <span>4. Uploaded Verification Documents & Photos (${(inspected.documents || []).length})</span>
            </div>

            ${(inspected.documents || []).length === 0 ? `
              <div class="p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-center text-xs text-amber-800 dark:text-amber-300">
                <i class="fa-solid fa-triangle-exclamation mr-1"></i>No uploaded documents attached.
              </div>
            ` : `
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                ${(inspected.documents || []).map(doc => `
                  <div class="p-3.5 rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-emerald-500 transition-all flex flex-col justify-between space-y-2 group">
                    <div class="flex items-center space-x-2.5">
                      <div class="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center text-sm flex-shrink-0">
                        <i class="fa-solid ${doc.type === 'government_id' ? 'fa-id-card' : (doc.type === 'farm_deed' ? 'fa-file-contract' : 'fa-image')}"></i>
                      </div>
                      <div class="min-w-0 flex-1">
                        <div class="text-xs font-extrabold text-slate-900 dark:text-white truncate">${doc.name || doc.type}</div>
                        <div class="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">${doc.type.replace('_', ' ')}</div>
                      </div>
                    </div>

                    ${doc.url && (doc.url.startsWith('data:image') || doc.url.startsWith('http')) ? `
                      <div class="aspect-video rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-gray-200 dark:border-slate-700">
                        <img src="${doc.url}" alt="${doc.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                      </div>
                    ` : ''}

                    <button onclick="actions.openDocumentPreview('${doc.url}', '${(doc.name || '').replace(/'/g, "\\'")}', '${doc.type}')"
                            class="w-full py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] hover:bg-emerald-100 transition-all flex items-center justify-center space-x-1">
                      <i class="fa-solid fa-magnifying-glass"></i>
                      <span>Inspect Document</span>
                    </button>
                  </div>
                `).join('')}
              </div>
            `}
          </div>

          <!-- Section 5: Admin Decision Action Toolbar -->
          <div class="pt-6 border-t border-gray-100 dark:border-slate-800 space-y-3">
            <div class="text-xs font-extrabold text-slate-900 dark:text-white">Admin Adjudication Actions:</div>
            
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button onclick="actions.adminApproveFarmer('${inspected.id}')"
                      class="py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-extrabold text-xs shadow-lg shadow-emerald-700/20 transition-all flex items-center justify-center space-x-2">
                <i class="fa-solid fa-circle-check text-amber-300"></i>
                <span>Approve & Grant Verified Status</span>
              </button>

              <button onclick="actions.adminPromptRequestChanges('${inspected.id}')"
                      class="py-3.5 px-4 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs shadow-lg shadow-orange-600/20 transition-all flex items-center justify-center space-x-2">
                <i class="fa-solid fa-pen-to-square"></i>
                <span>Request Farmer Corrections</span>
              </button>

              <button onclick="actions.adminPromptReject('${inspected.id}')"
                      class="py-3.5 px-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-lg shadow-red-600/20 transition-all flex items-center justify-center space-x-2">
                <i class="fa-solid fa-circle-xmark"></i>
                <span>Reject Application</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    ` : ''}

    <!-- ═══ DOCUMENT FULLSCREEN PREVIEW LIGHTBOX MODAL ═══ -->
    ${state.adminDocumentPreviewModal?.active ? `
      <div class="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
        <div class="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full overflow-hidden border border-gray-200 dark:border-slate-800 shadow-2xl space-y-4 p-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-extrabold text-base text-slate-900 dark:text-white">${state.adminDocumentPreviewModal.name || 'Document Preview'}</h3>
              <span class="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">${state.adminDocumentPreviewModal.type || 'DOCUMENT'}</span>
            </div>
            <button onclick="actions.closeDocumentPreview()" class="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-500 hover:text-white flex items-center justify-center">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div class="max-h-[70vh] overflow-auto rounded-2xl bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-2 border border-gray-200 dark:border-slate-800">
            ${state.adminDocumentPreviewModal.url && state.adminDocumentPreviewModal.url.startsWith('data:image') || (state.adminDocumentPreviewModal.url && !state.adminDocumentPreviewModal.url.endsWith('.pdf')) ? `
              <img src="${state.adminDocumentPreviewModal.url}" alt="Preview" class="max-h-[65vh] object-contain rounded-xl shadow">
            ` : `
              <div class="py-16 text-center text-xs text-gray-500">
                <i class="fa-solid fa-file-pdf text-5xl text-red-500 mb-3 block"></i>
                <div class="font-bold text-slate-900 dark:text-white">PDF Document Attached</div>
                <a href="${state.adminDocumentPreviewModal.url}" download="${state.adminDocumentPreviewModal.name}" class="mt-3 inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs shadow hover:bg-emerald-800">
                  <i class="fa-solid fa-download"></i>
                  <span>Download Document</span>
                </a>
              </div>
            `}
          </div>
        </div>
      </div>
    ` : ''}
  `;
}
