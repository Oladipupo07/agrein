// Reverse Marketplace (Buyer RFQ Board) Component for Agrein

function renderReverseMarketplace(state, actions) {
  const { rfqs } = state.mockData;

  return `
    <div class="py-12 bg-slate-50/50 dark:bg-slate-900/50 min-h-screen space-y-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <!-- Header Banner -->
        <div class="glass-card rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div class="inline-flex items-center space-x-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
              <i class="fa-solid fa-arrows-rotate"></i>
              <span>Reverse Marketplace & RFQ Engine</span>
            </div>
            <h1 class="text-3xl font-heading font-extrabold text-slate-900 dark:text-white">
              Buyer Product Requirements Board
            </h1>
            <p class="text-xs text-gray-500">Commercial buyers post bulk harvest needs. Verified farmers submit competitive bids & negotiate contracts.</p>
          </div>

          <button onclick="actions.openPostRFQModal()" class="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow-lg transition-all flex items-center space-x-2">
            <i class="fa-solid fa-plus text-slate-950"></i>
            <span>Post New RFQ Requirement</span>
          </button>
        </div>

        <!-- Active RFQ Postings Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          ${rfqs.map(rfq => `
            <div class="glass-card rounded-3xl p-6 space-y-4 border border-amber-500/20">
              <div class="flex items-center justify-between">
                <span class="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-extrabold uppercase">
                  ${rfq.status} • ${rfq.bidsCount} Bids Submitted
                </span>
                <span class="text-xs font-bold text-gray-500">Required: ${rfq.requiredDate}</span>
              </div>

              <div>
                <h3 class="font-heading font-extrabold text-xl text-slate-900 dark:text-white">${rfq.crop}</h3>
                <div class="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mt-1">${rfq.buyerName}</div>
              </div>

              <div class="grid grid-cols-2 gap-2 text-xs p-3 rounded-2xl bg-slate-50 dark:bg-slate-800">
                <div>
                  <span class="text-gray-400">Quantity Needed:</span>
                  <div class="font-extrabold text-slate-900 dark:text-white">${rfq.qty.toLocaleString()} ${rfq.unit}s</div>
                </div>
                <div>
                  <span class="text-gray-400">Target Budget:</span>
                  <div class="font-extrabold text-amber-600 dark:text-amber-400">${rfq.budgetRange}</div>
                </div>
              </div>

              <div class="flex items-center space-x-2 text-xs text-gray-500">
                <i class="fa-solid fa-location-dot text-emerald-600"></i>
                <span>Delivery Destination: <strong>${rfq.location}</strong></span>
              </div>

              <div class="pt-2 flex items-center space-x-3">
                <button onclick="actions.openSubmitBidModal('${rfq.id}', '${rfq.crop}')" class="flex-1 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-md text-center">
                  Submit Farmer Bid Quote
                </button>
              </div>
            </div>
          `).join('')}
        </div>

      </div>
    </div>
  `;
}
