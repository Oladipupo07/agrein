// Admin Dashboard Component for Agrein
// Role-Specific SuperAdmin Control Console:
// Includes 7-Stage Farmer Verification, Registered Users Directory (Database Inspector),
// Dispute Adjudication, Account Deletion Governance, User Role Management & Marketplace Audit.

function renderAdminDashboard(state, actions) {
  const { adminProfile, products } = state.mockData;
  const verifications = state.mockData.adminVerifications || [];

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

  const filterRole = state.adminUserFilterRole || 'ALL';
  const searchQuery = (state.adminUserSearch || '').toLowerCase().trim();

  // Filter users based on selected tab and search query
  const filteredUsers = userList.filter(u => {
    const matchRole = filterRole === 'ALL' || u.role === filterRole;
    const matchSearch = !searchQuery ||
      (u.full_name && u.full_name.toLowerCase().includes(searchQuery)) ||
      (u.email && u.email.toLowerCase().includes(searchQuery)) ||
      (u.phone_number && String(u.phone_number).includes(searchQuery));
    return matchRole && matchSearch;
  });

  return `
    <div class="py-8 bg-slate-50/50 dark:bg-slate-900/50 min-h-screen space-y-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <!-- Admin Header -->
        <div class="glass-card rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-8 border-l-purple-600">
          <div>
            <div class="inline-flex items-center space-x-2 text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
              <i class="fa-solid fa-shield-halved"></i>
              <span>Agrein SuperAdmin Console</span>
            </div>
            <h1 class="text-3xl font-heading font-extrabold text-slate-900 dark:text-white mt-1">
              Platform Moderation & Database Directory
            </h1>
            <p class="text-xs text-gray-500">Live inspection of all registered users (Farmers, Buyers, Admins) and verification lifecycle.</p>
          </div>
          <div class="flex items-center space-x-2 flex-wrap gap-2">
            <button onclick="actions.fetchRegisteredUsers()" class="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-extrabold shadow-md transition-all flex items-center space-x-2">
              <i class="fa-solid fa-rotate text-amber-300"></i>
              <span>Refresh Users</span>
            </button>
            <button onclick="actions.setView('admin-verification')" class="px-4 py-2.5 rounded-xl glass-panel border border-purple-600/30 text-purple-900 dark:text-purple-300 text-xs font-extrabold hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-all flex items-center space-x-2">
              <i class="fa-solid fa-user-check text-purple-500"></i>
              <span>KYC Queue</span>
            </button>
            <button onclick="actions.guardView('account-settings')" class="px-4 py-2.5 rounded-xl glass-panel border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 text-xs font-extrabold hover:bg-gray-100 dark:hover:bg-slate-800 transition-all flex items-center space-x-2" title="Account Settings">
              <i class="fa-solid fa-gear text-purple-500"></i>
              <span class="hidden sm:inline">Settings</span>
            </button>
          </div>
        </div>

        <!-- ═══ LIVE REGISTERED USERS DIRECTORY & DATABASE INSPECTOR ═══ -->
        <div class="glass-card rounded-3xl p-6 sm:p-8 space-y-6 border border-emerald-500/20">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div class="inline-flex items-center space-x-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1">
                <i class="fa-solid fa-database"></i>
                <span>Database User Registry</span>
              </div>
              <h2 class="text-2xl font-heading font-extrabold text-slate-900 dark:text-white">Registered Users Directory</h2>
              <p class="text-xs text-gray-500">Inspect real-time registered accounts with role tags, verification status, and contact records</p>
            </div>

            <!-- Role Filter Pills -->
            <div class="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
              <button onclick="actions.setAdminUserFilter('ALL')" class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${filterRole === 'ALL' ? 'bg-purple-700 text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:text-purple-600'}">
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
                   class="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none shadow-sm">
            <i class="fa-solid fa-magnifying-glass absolute left-4 top-3.5 text-gray-400 text-sm"></i>
            ${state.adminUserSearch ? `
              <button onclick="actions.setAdminUserSearch('')" class="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600 text-xs">
                <i class="fa-solid fa-circle-xmark"></i>
              </button>
            ` : ''}
          </div>

          <!-- Users Database Table -->
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-purple-50 dark:bg-slate-800/80 text-gray-600 dark:text-gray-300 font-bold border-b border-gray-200 dark:border-slate-700">
                <tr>
                  <th class="py-3 px-4">User Name</th>
                  <th class="py-3 px-4">Role</th>
                  <th class="py-3 px-4">Email Address</th>
                  <th class="py-3 px-4">Phone Number</th>
                  <th class="py-3 px-4">Email OTP</th>
                  <th class="py-3 px-4">KYC / Verification</th>
                  <th class="py-3 px-4">Registered Date</th>
                  <th class="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-slate-800">
                ${filteredUsers.length === 0 ? `
                  <tr>
                    <td colspan="8" class="py-8 text-center text-gray-500 font-medium">
                      No registered users found matching "${searchQuery || filterRole}".
                    </td>
                  </tr>
                ` : filteredUsers.map(u => {
                  const roleColors = {
                    'FARMER': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300',
                    'BUYER': 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300',
                    'ADMIN': 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-300'
                  }[u.role] || 'bg-gray-100 text-gray-800';

                  const roleIcons = {
                    'FARMER': 'fa-tractor',
                    'BUYER': 'fa-cart-shopping',
                    'ADMIN': 'fa-shield-halved'
                  }[u.role] || 'fa-user';

                  return `
                    <tr class="hover:bg-purple-50/30 dark:hover:bg-slate-800/40 transition-colors">
                      <td class="py-3.5 px-4 font-bold text-slate-900 dark:text-white flex items-center space-x-2.5">
                        <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-extrabold text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
                          ${(u.full_name || u.email || 'U')[0].toUpperCase()}
                        </div>
                        <span class="truncate max-w-[150px] sm:max-w-none">${u.full_name || 'Agrein User'}</span>
                      </td>
                      <td class="py-3.5 px-4">
                        <span class="px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${roleColors} inline-flex items-center space-x-1">
                          <i class="fa-solid ${roleIcons} text-[9px]"></i>
                          <span>${u.role}</span>
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
                      <td class="py-3.5 px-4 text-right">
                        ${u.role === 'FARMER' ? `
                          ${u.verification_status === 'APPROVED' ? `
                            <button onclick="actions.setView('admin-verification')" class="px-2.5 py-1 rounded-lg bg-emerald-700 text-white text-[10px] font-bold hover:bg-emerald-800 transition-colors">
                              Audit KYC
                            </button>
                          ` : `
                            <button onclick="actions.adminQuickApproveFarmer('${u.email}', '${(u.full_name || '').replace(/'/g, "&#39;")}')" class="px-2.5 py-1 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-[10px] font-bold hover:from-emerald-700 hover:to-emerald-800 transition-colors inline-flex items-center space-x-1">
                              <i class="fa-solid fa-circle-check"></i><span>Approve</span>
                            </button>
                          `}
                        ` : `
                          <button onclick="actions.triggerToast('User ${u.email} active in database')" class="px-2.5 py-1 rounded-lg glass-panel text-gray-700 dark:text-gray-300 text-[10px] font-bold hover:bg-gray-100">
                            Details
                          </button>
                        `}
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- ═══ GOVERNANCE MODULES & SHORTCUTS ═══ -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-xl font-heading font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
                <i class="fa-solid fa-gavel text-purple-600"></i>
                <span>SuperAdmin Management Console</span>
              </h2>
              <p class="text-xs text-gray-500">Core administrative modules for identity verification, dispute settlement, and security</p>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            <!-- Farmer 7-Stage KYC Verification -->
            <div onclick="actions.setView('admin-verification')" class="glass-card p-5 rounded-2xl space-y-3 cursor-pointer hover:border-purple-500/50 hover:shadow-lg transition-all group">
              <div class="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                <i class="fa-solid fa-user-check"></i>
              </div>
              <div>
                <h3 class="font-heading font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">Farmer KYC Verification</h3>
                <p class="text-xs text-gray-500 mt-1">Inspect NIN/BVN documents, satellite GPS coordinates, farm deeds & approve badges.</p>
              </div>
              <div class="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center space-x-1 pt-1">
                <span>Open Verification Queue</span>
                <i class="fa-solid fa-arrow-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
              </div>
            </div>

            <!-- Escrow Dispute Resolution Center -->
            <div onclick="actions.setView('admin-dashboard')" class="glass-card p-5 rounded-2xl space-y-3 cursor-pointer hover:border-rose-500/50 hover:shadow-lg transition-all group">
              <div class="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                <i class="fa-solid fa-scale-balanced"></i>
              </div>
              <div>
                <h3 class="font-heading font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-rose-600 transition-colors">Dispute Adjudication</h3>
                <p class="text-xs text-gray-500 mt-1">Review damaged goods claims, inspect photos, and authorize Interswitch refunds or releases.</p>
              </div>
              <div class="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center space-x-1 pt-1">
                <span>Manage Disputes</span>
                <i class="fa-solid fa-arrow-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
              </div>
            </div>

            <!-- Account Deletion & Governance Queue -->
            <div onclick="actions.setView('admin-verification')" class="glass-card p-5 rounded-2xl space-y-3 cursor-pointer hover:border-red-500/50 hover:shadow-lg transition-all group">
              <div class="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/40 text-red-600 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                <i class="fa-solid fa-trash-can"></i>
              </div>
              <div>
                <h3 class="font-heading font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-red-600 transition-colors">Deletion & Data Privacy Queue</h3>
                <p class="text-xs text-gray-500 mt-1">NDPR / GDPR compliant account erasure requests, audit log retention & purging.</p>
              </div>
              <div class="text-xs font-bold text-red-600 dark:text-red-400 flex items-center space-x-1 pt-1">
                <span>View Deletion Queue</span>
                <i class="fa-solid fa-arrow-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
              </div>
            </div>

            <!-- Marketplace Produce Audit -->
            <div onclick="actions.setView('marketplace')" class="glass-card p-5 rounded-2xl space-y-3 cursor-pointer hover:border-emerald-500/50 hover:shadow-lg transition-all group">
              <div class="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                <i class="fa-solid fa-store"></i>
              </div>
              <div>
                <h3 class="font-heading font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">Marketplace Catalog Audit</h3>
                <p class="text-xs text-gray-500 mt-1">Inspect live product listings, verify organic certifications, and delist non-compliant crops.</p>
              </div>
              <div class="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1 pt-1">
                <span>Audit Marketplace</span>
                <i class="fa-solid fa-arrow-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  `;
}
