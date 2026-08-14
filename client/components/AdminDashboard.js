// Admin Dashboard Component for Agrein
// Role-Specific SuperAdmin Control Console:
// Includes 7-Stage Farmer Verification, Dossier Review Screen, Dispute Adjudication,
// Account Deletion Governance, User Role Management & Marketplace Audit.

function renderAdminDashboard(state, actions) {
  const { adminProfile, products } = state.mockData;
  const verifications = state.mockData.adminVerifications || [];

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
              Platform Moderation & Control Center
            </h1>
            <p class="text-xs text-gray-500">Overseeing agricultural transactions, escrow protection, and KYC verifications across 36 states.</p>
          </div>
          <div class="flex items-center space-x-2 flex-wrap gap-2">
            <button onclick="actions.setView('admin-verification')" class="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-extrabold shadow-md transition-all flex items-center space-x-2">
              <i class="fa-solid fa-user-check text-amber-300"></i>
              <span>Verification Queue</span>
            </button>
            <button onclick="actions.guardView('account-settings')" class="px-4 py-2.5 rounded-xl glass-panel border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 text-xs font-extrabold hover:bg-gray-100 dark:hover:bg-slate-800 transition-all flex items-center space-x-2" title="Account Settings">
              <i class="fa-solid fa-gear text-purple-500"></i>
              <span class="hidden sm:inline">Settings</span>
            </button>
            <span class="px-3 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 text-xs font-bold">100% Operational</span>
          </div>
        </div>

        <!-- Verification Metrics & Analytics Banner -->
        <div class="glass-card rounded-3xl p-6 sm:p-8 space-y-6 border border-purple-500/20">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 class="text-xl font-heading font-extrabold text-slate-900 dark:text-white">Platform Governance & Verification Metrics</h2>
              <p class="text-xs text-gray-500">Real-time status tracking for farmer onboarding, verification lifecycle, and dispute rates.</p>
            </div>
            <button onclick="actions.setView('admin-verification')" class="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-md transition-all flex items-center space-x-2">
              <i class="fa-solid fa-file-signature text-amber-300"></i>
              <span>Audit KYC Dossiers</span>
            </button>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-700">
              <div class="text-[10px] font-bold text-gray-500">Total Farmers</div>
              <div class="text-lg font-heading font-extrabold text-slate-900 dark:text-white mt-1">14,823</div>
            </div>
            <div class="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/30">
              <div class="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">Verified 🟢</div>
              <div class="text-lg font-heading font-extrabold text-emerald-800 dark:text-emerald-300 mt-1">13,501</div>
            </div>
            <div class="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/30">
              <div class="text-[10px] font-bold text-amber-700 dark:text-amber-400">Pending 🟡</div>
              <div class="text-lg font-heading font-extrabold text-amber-800 dark:text-amber-300 mt-1">12</div>
            </div>
            <div class="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/30">
              <div class="text-[10px] font-bold text-blue-700 dark:text-blue-400">Under Review 🔵</div>
              <div class="text-lg font-heading font-extrabold text-blue-800 dark:text-blue-300 mt-1">4</div>
            </div>
            <div class="p-3.5 rounded-2xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800/30">
              <div class="text-[10px] font-bold text-orange-700 dark:text-orange-400">Changes 🟠</div>
              <div class="text-lg font-heading font-extrabold text-orange-800 dark:text-orange-300 mt-1">3</div>
            </div>
            <div class="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/30">
              <div class="text-[10px] font-bold text-red-700 dark:text-red-400">Disputes 🔴</div>
              <div class="text-lg font-heading font-extrabold text-red-800 dark:text-red-300 mt-1">0</div>
            </div>
          </div>
        </div>

        <!-- ═══ ADMIN MODULES & GOVERNANCE TOOLS ═══ -->
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

        <!-- ═══ PENDING FARMER VERIFICATIONS TABLE ═══ -->
        <div class="glass-card rounded-3xl p-6 sm:p-8 space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-heading font-extrabold text-xl text-slate-900 dark:text-white">Recent Verification Applications</h3>
              <p class="text-xs text-gray-500">Farmers awaiting administrative identity and farm coordinate approval</p>
            </div>
            <button onclick="actions.setView('admin-verification')" class="px-4 py-2 rounded-xl bg-purple-700 text-white text-xs font-bold hover:bg-purple-800 transition-all">
              View Full Queue
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-purple-50 dark:bg-slate-800 text-gray-600 dark:text-gray-300 font-bold border-b border-gray-200 dark:border-slate-700">
                <tr>
                  <th class="py-3 px-4">Applicant</th>
                  <th class="py-3 px-4">Farm Name</th>
                  <th class="py-3 px-4">State & LGA</th>
                  <th class="py-3 px-4">Land Size</th>
                  <th class="py-3 px-4">Status</th>
                  <th class="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-slate-800">
                ${verifications.slice(0, 5).map(v => `
                  <tr class="hover:bg-purple-50/40 dark:hover:bg-slate-800/40 transition-colors">
                    <td class="py-3.5 px-4 font-bold text-slate-900 dark:text-white">${v.farmer_name || 'Alhaji Bello Kano'}</td>
                    <td class="py-3.5 px-4 text-gray-600 dark:text-gray-300">${v.farm_name || 'Kano Gold Agro'}</td>
                    <td class="py-3.5 px-4 text-gray-600 dark:text-gray-300">${v.farm_state || 'Kano'}, ${v.farm_lga || 'Dala'}</td>
                    <td class="py-3.5 px-4 font-semibold text-gray-800 dark:text-gray-200">${v.farm_size_acres || 15} Acres</td>
                    <td class="py-3.5 px-4"><span class="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold">${v.status || 'PENDING_REVIEW'}</span></td>
                    <td class="py-3.5 px-4 text-right">
                      <button onclick="actions.openAdminReviewDossier('${v.id}')" class="px-3 py-1 rounded-lg bg-purple-700 text-white text-[10px] font-bold hover:bg-purple-800 transition-colors">Audit Dossier</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  `;
}
