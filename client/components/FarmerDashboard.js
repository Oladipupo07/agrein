// Farmer Dashboard Component for Agrein

function renderFarmerDashboard(state, actions) {
  const { farmerProfile, products } = state.mockData;
  const farmerProducts = products.filter(p => p.farmerId === farmerProfile.id || p.farmerName === farmerProfile.name);
  const verificationStatus = (state.mockData.farmerVerificationApp || {}).status || 'DRAFT';
  const isApproved = verificationStatus === 'APPROVED';

  return `
    <div class="py-8 bg-slate-50/50 dark:bg-slate-900/50 min-h-screen space-y-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <!-- Header Banner -->
        <div class="glass-card rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-l-8 ${isApproved ? 'border-l-emerald-600' : 'border-l-amber-500'}">
          <div class="space-y-1">
            <div class="flex items-center space-x-2">
              ${isApproved ? renderVerifiedBadge(true) : `
                <span class="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-bold flex items-center space-x-1">
                  <i class="fa-solid fa-clock text-amber-500"></i>
                  <span>Verification ${verificationStatus.replaceAll('_', ' ').toLowerCase()}</span>
                </span>
              `}
              <span class="text-xs text-gray-500 font-semibold">${farmerProfile.location}</span>
            </div>
            <h1 class="text-3xl font-heading font-extrabold text-slate-900 dark:text-white">
              Welcome back, ${farmerProfile.name} 👋
            </h1>
            <p class="text-xs text-gray-600 dark:text-gray-400">
              Managing <strong class="text-emerald-700 dark:text-emerald-400">${farmerProfile.farmName}</strong> (${farmerProfile.sizeHectares} Hectares)
            </p>
          </div>

          <div class="flex items-center space-x-3">
            <button onclick="actions.openAddProductModal()" class="px-5 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-lg shadow-emerald-700/20 transition-all flex items-center space-x-2">
              <i class="fa-solid fa-plus text-amber-300"></i>
              <span>List New Crop Harvest</span>
            </button>
            <button onclick="actions.openWithdrawalModal()" class="px-5 py-3 rounded-2xl glass-panel border border-emerald-600/30 text-emerald-900 dark:text-emerald-300 font-extrabold text-xs hover:bg-emerald-50 transition-all flex items-center space-x-2">
              <i class="fa-solid fa-building-columns text-amber-500"></i>
              <span>Withdraw Funds</span>
            </button>
          </div>
        </div>

        <!-- Metric KPI Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div class="glass-card p-6 rounded-3xl space-y-2">
            <div class="flex items-center justify-between text-gray-500 text-xs font-bold">
              <span>Available Earnings</span>
              <i class="fa-solid fa-wallet text-emerald-600 text-lg"></i>
            </div>
            <div class="text-3xl font-heading font-extrabold text-slate-900 dark:text-white">
              ₦${farmerProfile.availableBalance.toLocaleString()}
            </div>
            <div class="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center">
              <i class="fa-solid fa-circle-check mr-1"></i> Ready for Interswitch Bank Payout
            </div>
          </div>

          <div class="glass-card p-6 rounded-3xl space-y-2">
            <div class="flex items-center justify-between text-gray-500 text-xs font-bold">
              <span>Held in Interswitch Escrow</span>
              <i class="fa-solid fa-shield-halved text-amber-500 text-lg"></i>
            </div>
            <div class="text-3xl font-heading font-extrabold text-amber-600 dark:text-amber-400">
              ₦${farmerProfile.escrowPending.toLocaleString()}
            </div>
            <div class="text-[11px] text-gray-500 font-semibold">
              Releases upon buyer delivery receipt
            </div>
          </div>

          <div class="glass-card p-6 rounded-3xl space-y-2">
            <div class="flex items-center justify-between text-gray-500 text-xs font-bold">
              <span>Lifetime Revenue</span>
              <i class="fa-solid fa-chart-line text-emerald-700 text-lg"></i>
            </div>
            <div class="text-3xl font-heading font-extrabold text-slate-900 dark:text-white">
              ₦${farmerProfile.totalLifetimeEarnings.toLocaleString()}
            </div>
            <div class="text-[11px] text-emerald-600 font-semibold">
              <i class="fa-solid fa-arrow-trend-up"></i> +42% vs Traditional Middlemen
            </div>
          </div>

          <div class="glass-card p-6 rounded-3xl space-y-2">
            <div class="flex items-center justify-between text-gray-500 text-xs font-bold">
              <span>Active Crop Listings</span>
              <i class="fa-solid fa-wheat-awn text-emerald-600 text-lg"></i>
            </div>
            <div class="text-3xl font-heading font-extrabold text-slate-900 dark:text-white">
              ${farmerProducts.length} Listings
            </div>
            <div class="text-[11px] text-gray-500 font-semibold">
              ⭐ ${farmerProfile.rating} Farmer Rating (${farmerProfile.reviewsTotal} reviews)
            </div>
          </div>

        </div>

        <!-- Sales Analytics & AI Advisory Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <!-- Sales Chart Visualization Card -->
          <div class="lg:col-span-8 glass-card p-6 sm:p-8 rounded-3xl space-y-6">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-heading font-extrabold text-xl text-slate-900 dark:text-white">Harvest Sales Analytics</h3>
                <p class="text-xs text-gray-500">Monthly revenue trends from bulk buyer transactions via Interswitch Webpay</p>
              </div>
              <span class="px-3 py-1 rounded-xl bg-emerald-100 dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold">2026 Season</span>
            </div>

            <!-- Simulated Visual Bar Chart -->
            <div class="h-64 flex items-end justify-between space-x-3 sm:space-x-6 pt-8 pb-4 border-b border-gray-200 dark:border-slate-800">
              ${[
                { month: 'Mar', val: 24, label: '₦2.4M' },
                { month: 'Apr', val: 38, label: '₦3.8M' },
                { month: 'May', val: 45, label: '₦4.5M' },
                { month: 'Jun', val: 62, label: '₦6.2M' },
                { month: 'Jul', val: 78, label: '₦7.8M' },
                { month: 'Aug (Current)', val: 95, label: '₦9.5M', active: true }
              ].map(bar => `
                <div class="flex-1 flex flex-col items-center space-y-2 group">
                  <div class="text-[10px] font-bold text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">${bar.label}</div>
                  <div class="w-full rounded-t-xl transition-all duration-500 ${bar.active ? 'bg-gradient-to-t from-emerald-800 via-emerald-600 to-amber-400 shadow-lg shadow-emerald-600/30' : 'bg-emerald-200 dark:bg-slate-700 hover:bg-emerald-400'}" style="height: ${bar.val}%;"></div>
                  <span class="text-xs font-bold text-gray-600 dark:text-gray-400">${bar.month}</span>
                </div>
              `).join('')}
            </div>

            <div class="flex items-center justify-between text-xs text-gray-500 pt-2">
              <span class="flex items-center space-x-1"><i class="fa-solid fa-circle text-emerald-600 text-[10px]"></i> <span>Escrow Released Sales</span></span>
              <span class="flex items-center space-x-1"><i class="fa-solid fa-circle text-amber-400 text-[10px]"></i> <span>Pending Delivery Clearance</span></span>
            </div>
          </div>

          <!-- AI Crop Advisor Widget -->
          <div class="lg:col-span-4 glass-card p-6 sm:p-8 rounded-3xl space-y-4 border border-amber-500/20">
            <div class="flex items-center space-x-2 text-amber-600 dark:text-amber-400 font-extrabold text-xs uppercase tracking-wider">
              <i class="fa-solid fa-wand-magic-sparkles"></i>
              <span>Agrein AI Advisor</span>
            </div>

            <h3 class="font-heading font-extrabold text-lg text-slate-900 dark:text-white">
              Price Forecast: Yellow Maize
            </h3>

            <div class="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
              <div class="text-2xl font-heading font-extrabold text-amber-600 dark:text-amber-400">₦520 / kg (Projected)</div>
              <p class="text-xs text-gray-700 dark:text-gray-300 font-medium">
                Maize prices in Northern Nigeria are projected to rise by 8.4% by end of August due to poultry feed demand spikes.
              </p>
            </div>

            <div class="text-xs space-y-2 pt-2 text-gray-600 dark:text-gray-300">
              <div class="flex items-center justify-between font-semibold">
                <span>AI Confidence Score:</span>
                <span class="text-emerald-600 font-bold">94.6%</span>
              </div>
              <div class="flex items-center justify-between font-semibold">
                <span>Optimal Harvest Holding:</span>
                <span class="text-amber-600 font-bold">14 Days</span>
              </div>
            </div>

            <button onclick="actions.setView('ai-insights')" class="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow-md transition-all text-center">
              Run Complete AI Market Analysis
            </button>
          </div>

        </div>

        <!-- Inventory Produce Listings Table -->
        <div class="glass-card rounded-3xl p-6 sm:p-8 space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-heading font-extrabold text-xl text-slate-900 dark:text-white">Active Farm Listings</h3>
              <p class="text-xs text-gray-500">Manage crop quantities, prices, and organic verification badges</p>
            </div>
            <button onclick="actions.openAddProductModal()" class="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800">
              + Add Crop Listing
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-emerald-50 dark:bg-slate-800 text-gray-600 dark:text-gray-300 font-bold border-b border-gray-200 dark:border-slate-700">
                <tr>
                  <th class="py-3.5 px-4">Crop Name</th>
                  <th class="py-3.5 px-4">Category</th>
                  <th class="py-3.5 px-4">Price / Unit</th>
                  <th class="py-3.5 px-4">Available Stock</th>
                  <th class="py-3.5 px-4">Organic</th>
                  <th class="py-3.5 px-4">Status</th>
                  <th class="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-slate-800">
                ${farmerProducts.map(prod => `
                  <tr class="hover:bg-emerald-50/40 dark:hover:bg-slate-800/40 transition-colors">
                    <td class="py-4 px-4 font-bold text-slate-900 dark:text-white flex items-center space-x-3">
                      <img src="${prod.image}" class="w-9 h-9 rounded-lg object-cover">
                      <span>${prod.title}</span>
                    </td>
                    <td class="py-4 px-4 text-gray-600 dark:text-gray-300">${prod.category}</td>
                    <td class="py-4 px-4 font-extrabold text-emerald-800 dark:text-emerald-400">₦${prod.price.toLocaleString()} / ${prod.unit}</td>
                    <td class="py-4 px-4 font-bold text-gray-800 dark:text-gray-200">${prod.availableQty.toLocaleString()} ${prod.unit}s</td>
                    <td class="py-4 px-4">
                      <span class="px-2 py-0.5 rounded text-[10px] font-extrabold ${prod.isOrganic ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'}">
                        ${prod.isOrganic ? 'Yes' : 'Standard'}
                      </span>
                    </td>
                    <td class="py-4 px-4">
                      <span class="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">Active</span>
                    </td>
                    <td class="py-4 px-4 text-right space-x-2">
                      <button onclick="actions.openProductModal('${prod.id}')" class="p-2 text-emerald-600 hover:text-emerald-800" title="Edit"><i class="fa-solid fa-pen-to-square"></i></button>
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
