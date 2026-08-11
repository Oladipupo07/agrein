// Admin Dashboard Component for Agrein

function renderAdminDashboard(state, actions) {
  const { adminProfile, products } = state.mockData;

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
              Platform Moderation & Analytics
            </h1>
            <p class="text-xs text-gray-500">Overseeing agricultural transactions, escrow protection, and user verifications across 36 states.</p>
          </div>
          <div class="flex items-center space-x-2">
            <span class="px-3 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 text-xs font-bold">System Status: 100% Operational</span>
          </div>
        </div>

        <!-- Verification Metrics & Analytics Banner (Item 25) -->
        <div class="glass-card rounded-3xl p-6 sm:p-8 space-y-6 border border-emerald-500/20">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 class="text-xl font-heading font-extrabold text-slate-900 dark:text-white">Verification & Moderation Metrics</h2>
              <p class="text-xs text-gray-500">Real-time status tracking for farmer onboarding, verification lifecycle, and dispute rates.</p>
            </div>
            <button onclick="actions.setView('admin-verification')" class="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-md transition-all flex items-center space-x-2">
              <i class="fa-solid fa-user-check"></i>
              <span>Open Farmer Verification Module</span>
            </button>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <div class="p-3 sm:p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-700 min-w-0">
              <div class="text-[10px] font-bold text-gray-500 break-words">Total Farmers</div>
              <div class="text-lg font-heading font-extrabold text-slate-900 dark:text-white mt-1">14,823</div>
            </div>
            <div class="p-3 sm:p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/30 min-w-0">
              <div class="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 break-words">Verified 🟢</div>
              <div class="text-lg font-heading font-extrabold text-emerald-800 dark:text-emerald-300 mt-1">13,501</div>
            </div>
            <div class="p-3 sm:p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/30 min-w-0">
              <div class="text-[10px] font-bold text-amber-700 dark:text-amber-400 break-words">Pending 🟡</div>
              <div class="text-lg font-heading font-extrabold text-amber-800 dark:text-amber-300 mt-1">12</div>
            </div>
            <div class="p-3 sm:p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/30 min-w-0">
              <div class="text-[10px] font-bold text-blue-700 dark:text-blue-400 break-words">Under Review 🔵</div>
              <div class="text-lg font-heading font-extrabold text-blue-800 dark:text-blue-300 mt-1">4</div>
            </div>
            <div class="p-3 sm:p-3.5 rounded-2xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800/30 min-w-0">
              <div class="text-[10px] font-bold text-orange-700 dark:text-orange-400 break-words">Changes 🟠</div>
              <div class="text-lg font-heading font-extrabold text-orange-800 dark:text-orange-300 mt-1">3</div>
            </div>
            <div class="p-3 sm:p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/30 min-w-0">
              <div class="text-[10px] font-bold text-red-700 dark:text-red-400 break-words">Rejected 🔴</div>
              <div class="text-lg font-heading font-extrabold text-red-800 dark:text-red-300 mt-1">2</div>
            </div>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1 border-t border-gray-100 dark:border-slate-800 text-xs">
            <div class="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-800">
              <span class="text-gray-500 font-bold">Verification Rate:</span>
              <span class="font-extrabold text-emerald-600">91.1%</span>
            </div>
            <div class="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-800">
              <span class="text-gray-500 font-bold">Avg Review Time:</span>
              <span class="font-extrabold text-blue-600">18 hours</span>
            </div>
            <div class="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-800">
              <span class="text-gray-500 font-bold">Approval Rate:</span>
              <span class="font-extrabold text-emerald-600">94.2%</span>
            </div>
            <div class="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-800">
              <span class="text-gray-500 font-bold">Dispute Rate:</span>
              <span class="font-extrabold text-purple-600">0.4%</span>
            </div>
          </div>
        </div>

        <!-- Moderation Queue & User Management Tabs -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <!-- Farmer Verification Queue -->
          <div class="lg:col-span-6 glass-card rounded-3xl p-6 sm:p-8 space-y-6">
            <div class="flex items-center justify-between">
              <h3 class="font-heading font-extrabold text-xl text-slate-900 dark:text-white">Pending Farmer Audits</h3>
              <span class="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">${adminProfile.pendingVerifications} Action Items</span>
            </div>

            <div class="space-y-4">
              ${[
                { name: 'Suleiman Danjuma', farm: 'Jigawa Groundnut Estate', location: 'Dutse, Jigawa', hectares: '30 Ha' },
                { name: 'Kemi Ogunleye', farm: 'Egba Cassava Co-op', location: 'Abeokuta, Ogun', hectares: '18 Ha' },
                { name: 'Dr. Danladi Ahmed', farm: 'Wukari Grain Belt', location: 'Wukari, Taraba', hectares: '55 Ha' }
              ].map(farmer => `
                <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between gap-4">
                  <div>
                    <div class="font-bold text-xs text-slate-900 dark:text-white">${farmer.name}</div>
                    <div class="text-[11px] text-gray-500">${farmer.farm} • ${farmer.location} (${farmer.hectares})</div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <button onclick="actions.triggerToast('Farmer account verified! Badge issued.')" class="px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-[11px] font-bold">Approve</button>
                    <button onclick="actions.triggerToast('Audit requested from farmer.')" class="px-3 py-1.5 rounded-lg bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-200 text-[11px] font-bold">Audit</button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Escrow Dispute Management -->
          <div class="lg:col-span-6 glass-card rounded-3xl p-6 sm:p-8 space-y-6">
            <div class="flex items-center justify-between">
              <h3 class="font-heading font-extrabold text-xl text-slate-900 dark:text-white">Escrow Dispute Center</h3>
              <span class="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-xs font-bold">${adminProfile.pendingDisputes} Pending</span>
            </div>

            <div class="space-y-4">
              <div class="p-4 rounded-2xl bg-amber-50 dark:bg-slate-800/60 border border-amber-500/20 space-y-2">
                <div class="flex items-center justify-between text-xs">
                  <span class="font-bold text-slate-900 dark:text-white">Dispute #DSP-4019 (Order #AGR-78190)</span>
                  <span class="text-amber-600 font-extrabold">₦450,000 Held</span>
                </div>
                <p class="text-[11px] text-gray-600 dark:text-gray-300">
                  Buyer claims 5% moisture variance on yellow maize delivery. Farmer submitted moisture test report prior to transport.
                </p>
                <div class="pt-2 flex items-center justify-end space-x-2">
                  <button onclick="actions.triggerToast('Dispute resolved in favor of Buyer (Partial Refund).')" class="px-3 py-1 rounded-lg bg-amber-500 text-slate-950 text-[11px] font-bold">Refund Buyer</button>
                  <button onclick="actions.triggerToast('Dispute resolved: Funds released to Farmer.')" class="px-3 py-1 rounded-lg bg-emerald-700 text-white text-[11px] font-bold">Release to Farmer</button>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  `;
}
