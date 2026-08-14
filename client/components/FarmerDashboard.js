// Farmer Dashboard Component for Agrein
// Role-Specific Agricultural Management Portal:
// Includes Crop Listings, AI Price Predictor, AgroDoctor AI, Weather Radar,
// Cooperatives, Farm Verification, Wallet & Community Forum.

function renderFarmerDashboard(state, actions) {
  const user = state.currentUser || {};
  const firstName = (user.full_name || user.email || 'there').split(/[\s@]/)[0];
  const verificationStatus = (state.mockData.farmerVerificationApp || {}).status || 'NOT_STARTED';
  const isApproved = verificationStatus === 'APPROVED';

  const incomingOrders = [];
  const notifications = [];
  const farmerProducts = (state.mockData.products || []).filter(p => p.farmerName === user.full_name || p.farmerId === user.id);
  const availableBalance = state.mockData.farmerProfile?.availableBalance || 0;
  const escrowPending = state.mockData.farmerProfile?.escrowPending || 0;
  const totalLifetimeEarnings = state.mockData.farmerProfile?.totalLifetimeEarnings || 0;

  return `
    <div class="py-8 bg-slate-50/50 dark:bg-slate-900/50 min-h-screen space-y-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        <!-- Header Banner -->
        <div class="glass-card rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-l-8 ${isApproved ? 'border-l-emerald-600' : 'border-l-amber-500'}">
          <div class="space-y-1">
            <div class="flex items-center space-x-2">
              <span class="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center space-x-1">
                <i class="fa-solid fa-tractor text-emerald-600"></i>
                <span>Farmer Portal</span>
              </span>
              ${isApproved ? renderVerifiedBadge(true) : `
                <span class="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-bold flex items-center space-x-1">
                  <i class="fa-solid fa-clock text-amber-500"></i>
                  <span>Verification: ${verificationStatus.replaceAll('_', ' ')}</span>
                </span>
              `}
            </div>
            <h1 class="text-3xl font-heading font-extrabold text-slate-900 dark:text-white">
              Welcome${user.full_name ? `, ${firstName}` : ''} 👋
            </h1>
            <p class="text-xs text-gray-600 dark:text-gray-400">
              Manage your verified crop listings, monitor AI yield forecasting, scan plant health, and withdraw earnings.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-3 flex-shrink-0">
            <button onclick="actions.openAddProductModal()" class="px-5 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-lg shadow-emerald-700/20 transition-all flex items-center space-x-2">
              <i class="fa-solid fa-plus text-amber-300"></i>
              <span>List New Crop</span>
            </button>
            <button onclick="actions.openWithdrawalModal()" class="px-5 py-3 rounded-2xl glass-panel border border-emerald-600/30 text-emerald-900 dark:text-emerald-300 font-extrabold text-xs hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-all flex items-center space-x-2">
              <i class="fa-solid fa-building-columns text-amber-500"></i>
              <span>Withdraw Funds</span>
            </button>
            <button onclick="actions.guardView('account-settings')" class="px-4 py-3 rounded-2xl glass-panel border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 font-extrabold text-xs hover:bg-gray-100 dark:hover:bg-slate-800 transition-all flex items-center space-x-2" title="Account Settings">
              <i class="fa-solid fa-gear text-emerald-500"></i>
              <span class="hidden sm:inline">Settings</span>
            </button>
          </div>
        </div>

        ${!isApproved ? `
          <div class="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="space-y-1">
              <div class="flex items-center space-x-2 text-amber-700 dark:text-amber-300 font-extrabold text-xs">
                <i class="fa-solid fa-shield-halved text-amber-500 text-base"></i>
                <span>Farm Verification Required Before Selling</span>
              </div>
              <p class="text-xs text-gray-600 dark:text-gray-300">
                To protect buyers and ensure marketplace trust, all farmers must submit identity documents, farm photos, and GPS land coordinates for Agrein approval.
              </p>
            </div>
            <button onclick="actions.setView('farmer-verification')" class="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow-lg transition-all flex items-center justify-center space-x-2 w-full sm:w-auto">
              <i class="fa-solid fa-file-signature"></i>
              <span>Complete Farm Verification</span>
            </button>
          </div>
        ` : ''}

        <!-- Farmer KPI Summary Cards -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <div class="glass-card p-3 sm:p-5 rounded-2xl space-y-1.5 sm:space-y-2">
            <div class="flex items-center justify-between text-gray-500 text-[11px] font-bold">
              <span>Available Balance</span>
              <i class="fa-solid fa-wallet text-emerald-600 text-base"></i>
            </div>
            <div class="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 dark:text-white">₦${availableBalance.toLocaleString()}</div>
            <div class="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Ready for payout</div>
          </div>
          <div class="glass-card p-3 sm:p-5 rounded-2xl space-y-1.5 sm:space-y-2">
            <div class="flex items-center justify-between text-gray-500 text-[11px] font-bold">
              <span>In Escrow</span>
              <i class="fa-solid fa-shield-halved text-amber-500 text-base"></i>
            </div>
            <div class="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 dark:text-white">₦${escrowPending.toLocaleString()}</div>
            <div class="text-[10px] text-amber-600 font-semibold">Releases on delivery</div>
          </div>
          <div class="glass-card p-3 sm:p-5 rounded-2xl space-y-1.5 sm:space-y-2">
            <div class="flex items-center justify-between text-gray-500 text-[11px] font-bold">
              <span>Lifetime Revenue</span>
              <i class="fa-solid fa-chart-line text-emerald-700 text-base"></i>
            </div>
            <div class="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 dark:text-white">₦${totalLifetimeEarnings.toLocaleString()}</div>
            <div class="text-[10px] text-emerald-600 font-semibold">Total earnings</div>
          </div>
          <div class="glass-card p-3 sm:p-5 rounded-2xl space-y-1.5 sm:space-y-2">
            <div class="flex items-center justify-between text-gray-500 text-[11px] font-bold">
              <span>Active Crops</span>
              <i class="fa-solid fa-wheat-awn text-emerald-600 text-base"></i>
            </div>
            <div class="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 dark:text-white">${farmerProducts.length}</div>
            <div class="text-[10px] text-gray-500 font-semibold">Listed in marketplace</div>
          </div>
          <div class="glass-card p-3 sm:p-5 rounded-2xl space-y-1.5 sm:space-y-2">
            <div class="flex items-center justify-between text-gray-500 text-[11px] font-bold">
              <span>Incoming Orders</span>
              <i class="fa-solid fa-inbox text-blue-500 text-base"></i>
            </div>
            <div class="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 dark:text-white">${incomingOrders.length}</div>
            <div class="text-[10px] text-blue-600 font-semibold">Pending fulfillment</div>
          </div>
          <div class="glass-card p-3 sm:p-5 rounded-2xl space-y-1.5 sm:space-y-2">
            <div class="flex items-center justify-between text-gray-500 text-[11px] font-bold">
              <span>Trust Score</span>
              <i class="fa-solid fa-star text-amber-500 text-base"></i>
            </div>
            <div class="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 dark:text-white">98%</div>
            <div class="text-[10px] text-amber-500 font-semibold">Verified producer</div>
          </div>
        </div>

        <!-- ═══ FARMER ECOSYSTEM TOOLS & MODULES HUB ═══ -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-xl font-heading font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
                <i class="fa-solid fa-toolbox text-emerald-600"></i>
                <span>Farmer Toolkit & Agronomy Hub</span>
              </h2>
              <p class="text-xs text-gray-500">Essential agricultural tools curated specifically for farm operations</p>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <!-- AI Price & Yield Predictor -->
            <div onclick="actions.setView('ai-insights')" class="glass-card p-5 rounded-2xl space-y-3 cursor-pointer hover:border-amber-500/50 hover:shadow-lg transition-all group">
              <div class="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                <i class="fa-solid fa-wand-magic-sparkles"></i>
              </div>
              <div>
                <h3 class="font-heading font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">AI Price & Yield Predictor</h3>
                <p class="text-xs text-gray-500 mt-1">Get AI market price forecasts across 36 states to choose the best time to sell.</p>
              </div>
              <div class="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center space-x-1 pt-1">
                <span>Open Price Predictor</span>
                <i class="fa-solid fa-arrow-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
              </div>
            </div>

            <!-- AgroDoctor AI Plant Diagnostics -->
            <div onclick="actions.setView('agro-doctor')" class="glass-card p-5 rounded-2xl space-y-3 cursor-pointer hover:border-rose-500/50 hover:shadow-lg transition-all group">
              <div class="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                <i class="fa-solid fa-stethoscope"></i>
              </div>
              <div>
                <h3 class="font-heading font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-rose-600 transition-colors">AgroDoctor AI Crop Scanner</h3>
                <p class="text-xs text-gray-500 mt-1">Diagnose crop diseases, pest attacks, and get treatment protocols with organic remedies.</p>
              </div>
              <div class="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center space-x-1 pt-1">
                <span>Scan Crops with AI</span>
                <i class="fa-solid fa-arrow-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
              </div>
            </div>

            <!-- Weather Radar & Soil Forecast -->
            <div onclick="actions.setView('weather')" class="glass-card p-5 rounded-2xl space-y-3 cursor-pointer hover:border-sky-500/50 hover:shadow-lg transition-all group">
              <div class="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950/40 text-sky-600 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                <i class="fa-solid fa-cloud-sun-rain"></i>
              </div>
              <div>
                <h3 class="font-heading font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-sky-600 transition-colors">Weather & Rainfall Radar</h3>
                <p class="text-xs text-gray-500 mt-1">Real-time local precipitation forecasts, soil moisture, and optimal harvest days.</p>
              </div>
              <div class="text-xs font-bold text-sky-600 dark:text-sky-400 flex items-center space-x-1 pt-1">
                <span>View Weather Radar</span>
                <i class="fa-solid fa-arrow-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
              </div>
            </div>

            <!-- Farmer Cooperatives & Equipment Pool -->
            <div onclick="actions.setView('cooperatives')" class="glass-card p-5 rounded-2xl space-y-3 cursor-pointer hover:border-purple-500/50 hover:shadow-lg transition-all group">
              <div class="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                <i class="fa-solid fa-people-group"></i>
              </div>
              <div>
                <h3 class="font-heading font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">Farmer Cooperatives</h3>
                <p class="text-xs text-gray-500 mt-1">Pool resources for bulk fertilizer discounts, shared tractor hire, and joint off-take contracts.</p>
              </div>
              <div class="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center space-x-1 pt-1">
                <span>Explore Cooperatives</span>
                <i class="fa-solid fa-arrow-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
              </div>
            </div>

          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            
            <!-- Farm Verification & KYC Status -->
            <div onclick="actions.setView('farmer-verification')" class="glass-card p-5 rounded-2xl space-y-2 cursor-pointer hover:border-emerald-500 transition-all flex items-start space-x-3.5">
              <div class="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center text-base flex-shrink-0">
                <i class="fa-solid fa-shield-halved"></i>
              </div>
              <div>
                <h4 class="text-xs font-extrabold text-slate-900 dark:text-white">Farm Land & Identity Verification</h4>
                <p class="text-[11px] text-gray-500 mt-0.5">NIN/BVN, farm coordinates & deed approval.</p>
              </div>
            </div>

            <!-- Digital Wallet & Payouts -->
            <div onclick="actions.setView('wallet')" class="glass-card p-5 rounded-2xl space-y-2 cursor-pointer hover:border-emerald-500 transition-all flex items-start space-x-3.5">
              <div class="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center text-base flex-shrink-0">
                <i class="fa-solid fa-wallet"></i>
              </div>
              <div>
                <h4 class="text-xs font-extrabold text-slate-900 dark:text-white">Digital Wallet & Payout History</h4>
                <p class="text-[11px] text-gray-500 mt-0.5">Manage escrow settlements and bank withdrawals.</p>
              </div>
            </div>

            <!-- Farmer Community Forum & Academy -->
            <div onclick="actions.setView('forum')" class="glass-card p-5 rounded-2xl space-y-2 cursor-pointer hover:border-emerald-500 transition-all flex items-start space-x-3.5">
              <div class="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center text-base flex-shrink-0">
                <i class="fa-solid fa-comments"></i>
              </div>
              <div>
                <h4 class="text-xs font-extrabold text-slate-900 dark:text-white">Community Forum & Academy</h4>
                <p class="text-[11px] text-gray-500 mt-0.5">Connect with agronomists and peer producers.</p>
              </div>
            </div>

          </div>
        </div>

        <!-- ═══ ACTIVE CROP LISTINGS TABLE ═══ -->
        <div class="glass-card rounded-3xl p-6 sm:p-8 space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-heading font-extrabold text-xl text-slate-900 dark:text-white">My Active Crop Listings</h3>
              <p class="text-xs text-gray-500">Live harvests published to the marketplace for buyers</p>
            </div>
            <button onclick="actions.openAddProductModal()" class="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-all flex items-center space-x-1.5">
              <i class="fa-solid fa-plus text-[10px]"></i>
              <span>List New Crop</span>
            </button>
          </div>

          ${farmerProducts.length === 0 ? `
            <div class="p-8 text-center space-y-3 border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-2xl">
              <div class="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto text-xl">
                <i class="fa-solid fa-wheat-awn"></i>
              </div>
              <p class="text-xs text-gray-500 font-medium">You have not listed any crop harvests yet.</p>
              <button onclick="actions.openAddProductModal()" class="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-md transition-all">
                + List Your First Harvest
              </button>
            </div>
          ` : `
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead class="bg-emerald-50 dark:bg-slate-800 text-gray-600 dark:text-gray-300 font-bold border-b border-gray-200 dark:border-slate-700">
                  <tr>
                    <th class="py-3 px-4">Crop Name</th>
                    <th class="py-3 px-4">Category</th>
                    <th class="py-3 px-4">Price / Unit</th>
                    <th class="py-3 px-4">Stock</th>
                    <th class="py-3 px-4">State</th>
                    <th class="py-3 px-4">Organic</th>
                    <th class="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-slate-800">
                  ${farmerProducts.map(prod => `
                    <tr class="hover:bg-emerald-50/40 dark:hover:bg-slate-800/40 transition-colors">
                      <td class="py-3.5 px-4 font-bold text-slate-900 dark:text-white flex items-center space-x-2.5">
                        <img src="${prod.image}" class="w-8 h-8 rounded-lg object-cover">
                        <span>${prod.title}</span>
                      </td>
                      <td class="py-3.5 px-4 text-gray-600 dark:text-gray-300">${prod.category}</td>
                      <td class="py-3.5 px-4 font-extrabold text-emerald-800 dark:text-emerald-400">₦${prod.price.toLocaleString()} / ${prod.unit}</td>
                      <td class="py-3.5 px-4 font-bold text-gray-800 dark:text-gray-200">${prod.availableQty.toLocaleString()} ${prod.unit}s</td>
                      <td class="py-3.5 px-4 text-gray-600 dark:text-gray-300">${prod.originState}</td>
                      <td class="py-3.5 px-4">
                        <span class="px-2 py-0.5 rounded text-[10px] font-extrabold ${prod.isOrganic ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'}">
                          ${prod.isOrganic ? 'Organic' : 'Standard'}
                        </span>
                      </td>
                      <td class="py-3.5 px-4 text-right">
                        <button onclick="actions.openProductModal('${prod.id}')" class="text-xs text-emerald-600 hover:text-emerald-800 font-bold">View</button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `}
        </div>

      </div>
    </div>
  `;
}