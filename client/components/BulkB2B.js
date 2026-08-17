// B2B Wholesale & Enterprise Bulk Marketplace Component for Agrein

function renderBulkB2B(state, actions) {
  return `
    <div class="py-12 bg-slate-50/50 dark:bg-slate-900/50 min-h-screen space-y-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <!-- Header -->
        <div class="glass-card rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-l-8 border-l-amber-500">
          <div>
            <div class="inline-flex items-center space-x-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
              <i class="fa-solid fa-building flex"></i>
              <span>B2B Commercial Procurement Suite</span>
            </div>
            <h1 class="text-3xl font-heading font-extrabold text-slate-900 dark:text-white">
              Enterprise Bulk Marketplace
            </h1>
            <p class="text-xs text-gray-500">Tailored wholesale supply contracts for hotels, restaurants, food processors, retail chains, and commercial buyers.</p>
          </div>

          <button onclick="actions.triggerToast('Enterprise B2B custom quote request opened...')" class="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow-lg flex items-center space-x-2">
            <i class="fa-solid fa-file-contract"></i>
            <span>Request Long-Term B2B Supply Contract</span>
          </button>
        </div>

        <!-- B2B Categories & Tiered Pricing Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          ${[
            { title: 'Food Processors & Flour Mills', minVolume: '10 Tons Minimum', discount: '15% Volume Discount', icon: '🏭', desc: 'Yellow Maize, Wheat, Paddy Rice, Soybean Meal' },
            { title: 'Hotel Chains & Supermarket Groups', minVolume: '500 kg Weekly Contract', discount: '12% Recurring Off', icon: '🏨', desc: 'Plum Tomatoes, Fresh Tubers, Bell Peppers, Plantains' },
            { title: 'Industrial Agro-Exporters', minVolume: '25 Tons Container Load', discount: 'Custom FOB Pricing', icon: '🚢', desc: 'Raw Cashew Nuts, Sesame Seeds, Fermented Cocoa, Ginger' }
          ].map(b2b => `
            <div class="glass-card rounded-3xl p-6 space-y-4 border border-amber-500/20">
              <div class="text-3xl mb-2">${b2b.icon}</div>
              <h3 class="font-heading font-extrabold text-lg text-slate-900 dark:text-white">${b2b.title}</h3>
              <p class="text-xs text-gray-500 leading-relaxed">${b2b.desc}</p>

              <div class="p-3.5 rounded-2xl bg-amber-50 dark:bg-slate-800 text-xs space-y-1">
                <div class="flex justify-between text-gray-500">
                  <span>Minimum Volume:</span>
                  <span class="font-bold text-slate-900 dark:text-white">${b2b.minVolume}</span>
                </div>
                <div class="flex justify-between text-gray-500">
                  <span>Tiered Discount:</span>
                  <span class="font-extrabold text-amber-600 dark:text-amber-400">${b2b.discount}</span>
                </div>
              </div>

              <button onclick="actions.triggerToast('Requested B2B wholesale quotation for ${b2b.title}')" class="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-md text-center">
                Get Enterprise Quote
              </button>
            </div>
          `).join('')}
        </div>

      </div>
    </div>
  `;
}
