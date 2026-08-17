// Buyer Dispute Modal — Buyer Protection Dispute Filing & Tracking

function renderBuyerDisputeModal(state, actions) {
  if (!state.disputeModalActive) return '';

  const disputes = state.mockData.buyerDisputes || [];

  return `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div class="modal-fullscreen-mobile relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-red-500/20 overflow-hidden animate-modal max-h-[90vh] overflow-y-auto">
        
        <button onclick="actions.closeDisputeModal()" class="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-gray-300 flex items-center justify-center hover:bg-slate-300 transition-all">
          <i class="fa-solid fa-xmark text-sm"></i>
        </button>

        <!-- Header -->
        <div class="bg-gradient-to-r from-red-700 to-red-900 p-6 text-white">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <i class="fa-solid fa-shield-halved text-xl text-amber-300"></i>
            </div>
            <div>
              <h2 class="text-lg font-heading font-extrabold">Buyer Protection</h2>
              <p class="text-xs text-red-200">File a dispute for your order</p>
            </div>
          </div>
        </div>

        <div class="p-6 space-y-5">
          <!-- Dispute Form -->
          <div class="space-y-3">
            <div>
              <label class="text-xs font-bold text-gray-500 dark:text-gray-400">Order ID</label>
              <input type="text" placeholder="e.g. ORD-84920" class="w-full mt-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-red-500">
            </div>

            <div>
              <label class="text-xs font-bold text-gray-500 dark:text-gray-400">Reason</label>
              <select class="w-full mt-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-red-500">
                <option value="">Select a reason...</option>
                <option value="NOT_DELIVERED">Product not delivered</option>
                <option value="WRONG_PRODUCT">Wrong product received</option>
                <option value="DAMAGED">Product damaged</option>
                <option value="POOR_QUALITY">Poor quality</option>
                <option value="QUANTITY_MISMATCH">Quantity mismatch</option>
                <option value="SIGNIFICANTLY_DIFFERENT">Significantly different from description</option>
              </select>
            </div>

            <div>
              <label class="text-xs font-bold text-gray-500 dark:text-gray-400">Description</label>
              <textarea rows="3" placeholder="Describe the issue in detail..." class="w-full mt-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-red-500 resize-none"></textarea>
            </div>

            <div>
              <label class="text-xs font-bold text-gray-500 dark:text-gray-400">Evidence Photos</label>
              <div class="mt-1 p-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-slate-700 text-center cursor-pointer hover:border-red-500 transition-all">
                <i class="fa-solid fa-camera text-2xl text-gray-300 dark:text-slate-600 mb-1"></i>
                <div class="text-[10px] text-gray-400">Upload photos as evidence</div>
              </div>
            </div>

            <button onclick="actions.submitDispute(); actions.closeDisputeModal();" class="w-full py-3 rounded-2xl bg-red-600 text-white font-extrabold text-xs shadow-xl hover:bg-red-700 transition-all flex items-center justify-center space-x-2">
              <i class="fa-solid fa-shield-halved text-amber-300"></i>
              <span>Submit Dispute</span>
            </button>
          </div>

          <!-- Existing Disputes -->
          ${disputes.length > 0 ? `
            <div class="pt-4 border-t border-gray-100 dark:border-slate-800">
              <h4 class="text-xs font-heading font-extrabold text-slate-900 dark:text-white mb-3">Your Disputes</h4>
              <div class="space-y-3">
                ${disputes.map(d => `
                  <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
                    <div class="flex items-center justify-between">
                      <span class="text-xs font-bold text-slate-900 dark:text-white">${d.dispute_code}</span>
                      <span class="px-2 py-0.5 rounded-lg text-[10px] font-bold ${d.status === 'REFUNDED' ? 'bg-emerald-100 text-emerald-700' : (d.status === 'OPEN' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700')}">${d.status}</span>
                    </div>
                    <div class="text-[10px] text-gray-500 mt-1">${d.reason.replace('_', ' ')} — Order: ${d.order_id}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}
