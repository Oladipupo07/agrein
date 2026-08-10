// Buyer Dashboard Component for Agrein

function renderBuyerDashboard(state, actions) {
  const { buyerProfile } = state.mockData;
  const tracking = buyerProfile.activeTracking;

  return `
    <div class="py-8 bg-slate-50/50 dark:bg-slate-900/50 min-h-screen space-y-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <!-- Header -->
        <div class="glass-card rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-8 border-l-amber-500">
          <div>
            <span class="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-bold">
              Bulk Buyer Portal
            </span>
            <h1 class="text-3xl font-heading font-extrabold text-slate-900 dark:text-white mt-1">
              Hello, ${buyerProfile.name}
            </h1>
            <p class="text-xs text-gray-500">${buyerProfile.company} • ${buyerProfile.address}</p>
          </div>

          <button onclick="actions.setView('marketplace')" class="px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-lg shadow-emerald-700/20 transition-all flex items-center space-x-2">
            <i class="fa-solid fa-basket-shopping"></i>
            <span>Browse Produce Catalog</span>
          </button>
        </div>

        <!-- Live Order Tracking Visual Timeline Card -->
        <div class="glass-card rounded-3xl p-6 sm:p-8 space-y-6 border border-emerald-500/20">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-slate-800 pb-4">
            <div>
              <div class="flex items-center space-x-2">
                <span class="px-2.5 py-0.5 rounded bg-emerald-700 text-white text-[10px] font-extrabold uppercase">Live ColdChain Tracking</span>
                <span class="text-xs font-bold text-gray-500">Order ID: #${tracking.orderId}</span>
              </div>
              <h3 class="text-xl font-heading font-extrabold text-slate-900 dark:text-white mt-1">
                ${tracking.product}
              </h3>
              <p class="text-xs text-gray-600 dark:text-gray-400 flex items-center space-x-1">
                <span>Seller: <strong class="text-emerald-700 dark:text-emerald-400">${tracking.farmer}</strong></span>
                ${renderVerifiedBadgeCompact(true)}
              </p>
            </div>

            <div class="text-left sm:text-right">
              <div class="text-xs text-gray-500 font-bold">Estimated Delivery Arrival</div>
              <div class="text-lg font-heading font-extrabold text-amber-600 dark:text-amber-400">${tracking.eta}</div>
            </div>
          </div>

          <!-- Driver & Logistics Detail -->
          <div class="p-4 rounded-2xl bg-emerald-50/60 dark:bg-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center text-lg">
                <i class="fa-solid fa-truck-ramp-box"></i>
              </div>
              <div>
                <div class="font-bold text-slate-900 dark:text-white">${tracking.driver}</div>
                <div class="text-gray-500 text-[11px]">Temperature-Controlled Logistics Fleet</div>
              </div>
            </div>
            <a href="tel:${tracking.driverPhone}" class="px-4 py-2 rounded-xl bg-white dark:bg-slate-700 text-emerald-800 dark:text-emerald-300 font-extrabold border border-emerald-500/20 text-center hover:bg-emerald-100 transition-all">
              <i class="fa-solid fa-phone text-amber-500 mr-1"></i> Call Logistics Driver (${tracking.driverPhone})
            </a>
          </div>

          <!-- Checkpoint Step Progress Timeline -->
          <div class="space-y-6 pt-2">
            <h4 class="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Order Status Timeline</h4>
            <div class="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              ${tracking.checkpoints.map((step, idx) => `
                <div class="flex md:flex-col items-center space-x-4 md:space-x-0 md:space-y-2 text-left md:text-center flex-1 relative z-10">
                  <div class="w-10 h-10 rounded-full flex items-center justify-center text-xs font-extrabold transition-all ${step.completed ? 'bg-emerald-700 text-white shadow-lg shadow-emerald-700/30' : (step.current ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-400/30 font-black animate-pulse' : 'bg-gray-200 dark:bg-slate-800 text-gray-400')}">
                    ${step.completed ? '<i class="fa-solid fa-check"></i>' : (idx + 1)}
                  </div>
                  <div>
                    <div class="text-xs font-extrabold ${step.completed || step.current ? 'text-slate-900 dark:text-white' : 'text-gray-400'}">${step.title}</div>
                    <div class="text-[10px] text-gray-500 font-medium">${step.time}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

        </div>

        <!-- Saved Wishlist & Order History Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div class="lg:col-span-12 glass-card rounded-3xl p-6 sm:p-8 space-y-6">
            <h3 class="font-heading font-extrabold text-xl text-slate-900 dark:text-white">Past Procurement Orders</h3>
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead class="bg-gray-50 dark:bg-slate-800 text-gray-500 font-bold border-b border-gray-200 dark:border-slate-700">
                  <tr>
                    <th class="py-3 px-4">Order Code</th>
                    <th class="py-3 px-4">Harvest Item</th>
                    <th class="py-3 px-4">Producer</th>
                    <th class="py-3 px-4">Total Amount</th>
                    <th class="py-3 px-4">Escrow Status</th>
                    <th class="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-slate-800">
                  <tr class="hover:bg-emerald-50/30 transition-colors">
                    <td class="py-4 px-4 font-bold text-slate-900 dark:text-white">AGR-920412</td>
                    <td class="py-4 px-4 font-semibold text-gray-800 dark:text-gray-200">Benue Export Yam Tubers (50 Tubers)</td>
                    <td class="py-4 px-4 text-emerald-700 dark:text-emerald-400 font-semibold inline-flex items-center space-x-1">
                      <span>Chief Terver Ortom</span>
                      ${renderVerifiedBadgeCompact(true)}
                    </td>
                    <td class="py-4 px-4 font-extrabold text-slate-900 dark:text-white">₦97,500</td>
                    <td class="py-4 px-4"><span class="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">Escrow Held</span></td>
                    <td class="py-4 px-4 text-right">
                      <button onclick="actions.setView('marketplace')" class="px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-[11px] font-bold">Re-order</button>
                    </td>
                  </tr>
                  <tr class="hover:bg-emerald-50/30 transition-colors">
                    <td class="py-4 px-4 font-bold text-slate-900 dark:text-white">AGR-881023</td>
                    <td class="py-4 px-4 font-semibold text-gray-800 dark:text-gray-200">Grade-A Yellow Maize (500 kg)</td>
                    <td class="py-4 px-4 text-emerald-700 dark:text-emerald-400 font-semibold inline-flex items-center space-x-1">
                      <span>Mallam Ibrahim Bello</span>
                      ${renderVerifiedBadgeCompact(true)}
                    </td>
                    <td class="py-4 px-4 font-extrabold text-slate-900 dark:text-white">₦240,000</td>
                    <td class="py-4 px-4"><span class="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">Released</span></td>
                    <td class="py-4 px-4 text-right">
                      <button onclick="actions.setView('marketplace')" class="px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-[11px] font-bold">Re-order</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </div>
  `;
}
