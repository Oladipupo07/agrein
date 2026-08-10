// Export Marketplace Component for Agrein

function renderExportMarketplace(state, actions) {
  const { exportCommodities } = state.mockData;

  return `
    <div class="py-12 bg-slate-50/50 dark:bg-slate-900/50 min-h-screen space-y-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <!-- Header -->
        <div class="glass-card rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-l-8 border-l-amber-500">
          <div>
            <div class="inline-flex items-center space-x-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
              <i class="fa-solid fa-earth-africa"></i>
              <span>Global Agro-Export Trade Hub</span>
            </div>
            <h1 class="text-3xl font-heading font-extrabold text-slate-900 dark:text-white">
              International Export Marketplace
            </h1>
            <p class="text-xs text-gray-500">Direct sourcing for verified international buyers & commodity importers seeking Cocoa, Cashew, Sesame, Ginger, and Coffee.</p>
          </div>

          <button onclick="actions.triggerToast('Export buyer verification form opened...')" class="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow-lg flex items-center space-x-2">
            <i class="fa-solid fa-passport"></i>
            <span>Register as Verified Importer</span>
          </button>
        </div>

        <!-- Export Produce Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          ${exportCommodities.map(item => `
            <div class="glass-card rounded-3xl p-6 space-y-4 border border-amber-500/20">
              <div class="flex items-center justify-between">
                <span class="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-extrabold">
                  FOB Grade: ${item.grade}
                </span>
                <span class="text-xs font-bold text-gray-500">Origin: ${item.origin}</span>
              </div>

              <div>
                <h3 class="font-heading font-extrabold text-xl text-slate-900 dark:text-white">${item.crop}</h3>
                <div class="text-2xl font-heading font-extrabold text-emerald-800 dark:text-emerald-400 mt-1">${item.fobPrice}</div>
              </div>

              <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 text-xs space-y-1">
                <div class="flex justify-between text-gray-400">
                  <span>Container Capacity:</span>
                  <span class="font-bold text-slate-900 dark:text-white">${item.capacity}</span>
                </div>
                <div class="flex justify-between text-gray-400">
                  <span>Export Quality Specs:</span>
                  <span class="font-bold text-emerald-700 dark:text-emerald-400">${item.specs}</span>
                </div>
              </div>

              <button onclick="actions.triggerToast('Requested FOB export contract for ${item.crop}')" class="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-md text-center">
                Request International FOB Contract
              </button>
            </div>
          `).join('')}
        </div>

      </div>
    </div>
  `;
}
