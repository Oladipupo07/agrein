// Smart Logistics & Carrier Partner Module for Agrein

function renderSmartLogistics(state, actions) {
  const { logisticsPartners, activeShipments } = state.mockData;

  return `
    <div class="py-12 bg-slate-50/50 dark:bg-slate-900/50 min-h-screen space-y-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <!-- Header -->
        <div class="glass-card rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div class="inline-flex items-center space-x-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1">
              <i class="fa-solid fa-truck-fast"></i>
              <span>Smart ColdChain Logistics Network</span>
            </div>
            <h1 class="text-3xl font-heading font-extrabold text-slate-900 dark:text-white">
              Freight Dispatch & Route Optimization
            </h1>
            <p class="text-xs text-gray-500">Integrated carrier network featuring GIG Logistics, DHL Express, Kwik Delivery, and verified local reefer fleets.</p>
          </div>

          <div class="flex items-center space-x-2">
            <button onclick="actions.triggerToast('Registering carrier fleet partner...')" class="px-5 py-3 rounded-2xl bg-emerald-700 text-white text-xs font-bold shadow-md">
              + Register Carrier Fleet
            </button>
          </div>
        </div>

        <!-- Carrier Integration Badges -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          ${logisticsPartners.map(p => `
            <div class="glass-card p-4 rounded-2xl flex items-center space-x-3">
              <div class="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-extrabold text-sm">
                <i class="fa-solid fa-truck-front"></i>
              </div>
              <div>
                <div class="text-xs font-extrabold text-slate-900 dark:text-white">${p.name}</div>
                <div class="text-[10px] text-gray-500">${p.type} • ⭐ ${p.rating}</div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Live Dispatch Map & Active Cargo Shipments -->
        <div class="glass-card rounded-3xl p-6 sm:p-8 space-y-6">
          <h3 class="font-heading font-extrabold text-xl text-slate-900 dark:text-white">Active Produce Freight Shipments</h3>
          
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-gray-50 dark:bg-slate-800 text-gray-500 font-bold border-b border-gray-200 dark:border-slate-700">
                <tr>
                  <th class="py-3 px-4">Tracking Code</th>
                  <th class="py-3 px-4">Carrier Partner</th>
                  <th class="py-3 px-4">Origin ➔ Destination</th>
                  <th class="py-3 px-4">Driver & Temp</th>
                  <th class="py-3 px-4">Status</th>
                  <th class="py-3 px-4 text-right">Route Map</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-slate-800">
                ${activeShipments.map(s => `
                  <tr class="hover:bg-emerald-50/30 transition-colors">
                    <td class="py-4 px-4 font-bold text-slate-900 dark:text-white">${s.trackingCode}</td>
                    <td class="py-4 px-4 font-semibold text-emerald-700 dark:text-emerald-400">${s.carrier}</td>
                    <td class="py-4 px-4 text-gray-700 dark:text-gray-300 font-medium">${s.route}</td>
                    <td class="py-4 px-4 text-gray-600 dark:text-gray-400">
                      <div>${s.driver} (${s.phone})</div>
                      <div class="text-[10px] text-emerald-600 font-bold">Reefer Temp: ${s.temp}</div>
                    </td>
                    <td class="py-4 px-4">
                      <span class="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">${s.status}</span>
                    </td>
                    <td class="py-4 px-4 text-right">
                      <button onclick="actions.triggerToast('Viewing optimized GPS route for ${s.trackingCode}')" class="px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-[11px] font-bold">Live GPS</button>
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
