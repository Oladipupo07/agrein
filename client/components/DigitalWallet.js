// Agrein Digital Wallet Component

function renderDigitalWallet(state, actions) {
  const { wallet } = state.mockData;

  return `
    <div class="py-12 bg-slate-50/50 dark:bg-slate-900/50 min-h-screen space-y-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <!-- Header Banner -->
        <div class="glass-card rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-l-8 border-l-emerald-600">
          <div>
            <div class="inline-flex items-center space-x-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1">
              <i class="fa-solid fa-wallet"></i>
              <span>Agrein Platform Digital Wallet</span>
            </div>
            <h1 class="text-3xl font-heading font-extrabold text-slate-900 dark:text-white">
              Financial Wallet & Escrow Ledger
            </h1>
            <p class="text-xs text-gray-500">Manage available funds, track escrow holds, deposit via Interswitch, and execute instant payouts.</p>
          </div>

          <div class="flex items-center space-x-3">
            <button onclick="actions.triggerToast('Direct deposit via Interswitch Webpay opened...')" class="px-5 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-lg flex items-center space-x-2">
              <i class="fa-solid fa-plus text-amber-300"></i>
              <span>Deposit Funds</span>
            </button>
            <button onclick="actions.openWithdrawalModal()" class="px-5 py-3 rounded-2xl glass-panel border border-emerald-600/30 text-emerald-900 dark:text-emerald-300 font-extrabold text-xs hover:bg-emerald-50 transition-all flex items-center space-x-2">
              <i class="fa-solid fa-building-columns text-amber-500"></i>
              <span>Payout to Bank</span>
            </button>
          </div>
        </div>

        <!-- Wallet KPI Cards -->
        <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="glass-card p-6 rounded-3xl space-y-2">
            <div class="text-xs font-bold text-gray-500">Available Wallet Balance</div>
            <div class="text-3xl font-heading font-extrabold text-slate-900 dark:text-white">₦${wallet.availableBalance.toLocaleString()}</div>
            <div class="text-[11px] text-emerald-600 font-semibold flex items-center"><i class="fa-solid fa-circle-check mr-1"></i> Ready for instant transfer</div>
          </div>

          <div class="glass-card p-6 rounded-3xl space-y-2">
            <div class="text-xs font-bold text-gray-500">Held in Interswitch Escrow</div>
            <div class="text-3xl font-heading font-extrabold text-amber-600 dark:text-amber-400">₦${wallet.escrowHeldBalance.toLocaleString()}</div>
            <div class="text-[11px] text-gray-500 font-semibold">Protected until delivery confirmation</div>
          </div>

          <div class="glass-card p-6 rounded-3xl space-y-2">
            <div class="text-xs font-bold text-gray-500">Platform Escrow Status</div>
            <div class="text-2xl font-heading font-extrabold text-emerald-700 dark:text-emerald-400">100% Secured</div>
            <div class="text-[11px] text-gray-500 font-semibold">Agrein-secured wallet</div>
          </div>
        </div>

        <!-- Wallet Transaction History Table -->
        <div class="glass-card rounded-3xl p-6 sm:p-8 space-y-6">
          <h3 class="font-heading font-extrabold text-xl text-slate-900 dark:text-white">Transaction History Ledger</h3>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-gray-50 dark:bg-slate-800 text-gray-500 font-bold border-b border-gray-200 dark:border-slate-700">
                <tr>
                  <th class="py-3.5 px-4">Transaction Code</th>
                  <th class="py-3.5 px-4">Type</th>
                  <th class="py-3.5 px-4">Description</th>
                  <th class="py-3.5 px-4">Amount</th>
                  <th class="py-3.5 px-4">Date</th>
                  <th class="py-3.5 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-slate-800">
                ${wallet.transactions.map(txn => `
                  <tr class="hover:bg-emerald-50/40 dark:hover:bg-slate-800/40 transition-colors">
                    <td class="py-4 px-4 font-bold text-slate-900 dark:text-white">${txn.id}</td>
                    <td class="py-4 px-4 font-extrabold capitalize text-emerald-700 dark:text-emerald-400">${txn.type.replace('_', ' ')}</td>
                    <td class="py-4 px-4 text-gray-700 dark:text-gray-300 font-medium">${txn.desc}</td>
                    <td class="py-4 px-4 font-extrabold text-slate-900 dark:text-white">₦${txn.amount.toLocaleString()}</td>
                    <td class="py-4 px-4 text-gray-500">${txn.date}</td>
                    <td class="py-4 px-4 text-right"><span class="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">Completed</span></td>
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
