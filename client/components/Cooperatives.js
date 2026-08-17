// Farmer Cooperative Groups Component for Agrein

function renderCooperatives(state, actions) {
  const { cooperatives } = state.mockData;

  return `
    <div class="py-12 bg-slate-50/50 dark:bg-slate-900/50 min-h-screen space-y-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <!-- Header -->
        <div class="glass-card rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-l-8 border-l-emerald-600">
          <div>
            <div class="inline-flex items-center space-x-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1">
              <i class="fa-solid fa-users-rectangle"></i>
              <span>Farmer Cooperatives & Shared Logistics</span>
            </div>
            <h1 class="text-3xl font-heading font-extrabold text-slate-900 dark:text-white">
              Agricultural Cooperatives & Syndicates
            </h1>
            <p class="text-xs text-gray-500">Pool crop harvest volume, negotiate bulk buyer prices, share transportation trucks, and manage group earnings.</p>
          </div>

          <button onclick="actions.triggerToast('Cooperative creation form opened...')" class="px-6 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-lg transition-all flex items-center space-x-2">
            <i class="fa-solid fa-plus text-amber-300"></i>
            <span>Register New Cooperative Group</span>
          </button>
        </div>

        <!-- Cooperatives Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          ${cooperatives.map(coop => `
            <div class="glass-card rounded-3xl p-6 space-y-4">
              <div class="flex items-center justify-between">
                <span class="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                  📍 ${coop.state}
                </span>
                <span class="text-xs font-bold text-gray-500">${coop.membersCount} Farmers</span>
              </div>

              <div>
                <h3 class="font-heading font-extrabold text-lg text-slate-900 dark:text-white">${coop.name}</h3>
                <p class="text-xs text-gray-500">President: ${coop.leader}</p>
              </div>

              <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 text-xs space-y-1">
                <div class="flex justify-between text-gray-400">
                  <span>Pooled Harvest Inventory:</span>
                  <span class="font-bold text-slate-900 dark:text-white">${coop.pooledVolume}</span>
                </div>
                <div class="flex justify-between text-gray-400">
                  <span>Focus Produce:</span>
                  <span class="font-bold text-emerald-700 dark:text-emerald-400">${coop.focusCrops}</span>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-2 pt-2">
                <button onclick="actions.triggerToast('Applied to join ${coop.name}')" class="py-2.5 px-3 rounded-xl glass-panel text-xs font-bold text-slate-900 dark:text-white text-center hover:bg-emerald-50">
                  Join Group
                </button>
                <button onclick="actions.triggerToast('Viewing bulk freight pool for ${coop.name}')" class="py-2.5 px-3 rounded-xl bg-emerald-700 text-white text-xs font-bold text-center">
                  Bulk Freight
                </button>
              </div>
            </div>
          `).join('')}
        </div>

      </div>
    </div>
  `;
}
