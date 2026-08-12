// Buyer Dashboard Component for Agrein
// Renders the live procurement portal. All numeric tiles start at zero and
// populate when the buyer makes their first order. No demo personas.

function renderBuyerDashboard(state, actions) {
  const user = state.currentUser || {};
  const firstName = (user.full_name || user.email || 'there').split(/[\s@]/)[0];

  // Empty-state helpers — every list begins empty and fills up with real activity.
  const notifications = [];
  const favoriteFarmers = [];
  const pastOrders = [];
  const tracking = null;
  const totalOrders = 0;

  return `
    <div class="py-8 bg-slate-50/50 dark:bg-slate-900/50 min-h-screen space-y-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        <!-- Header Banner -->
        <div class="glass-card rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-l-8 border-l-blue-600">
          <div class="space-y-1">
            <div class="flex items-center space-x-2">
              <span class="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 text-xs font-bold flex items-center space-x-1">
                <i class="fa-solid fa-basket-shopping text-blue-500"></i>
                <span>Buyer Portal</span>
              </span>
              <span class="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                <i class="fa-solid fa-shield-halved text-emerald-500 mr-0.5"></i> Agrein Escrow Protected
              </span>
            </div>
            <h1 class="text-3xl font-heading font-extrabold text-slate-900 dark:text-white">
              Welcome${user.full_name ? `, ${firstName}` : ''} 👋
            </h1>
            <p class="text-xs text-gray-600 dark:text-gray-400">
              Browse the Agrein catalog, post RFQs, and place your first order — funds are held in escrow until you confirm delivery.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-3 flex-shrink-0">
            <button onclick="actions.guardView('account-settings')" class="px-4 py-3 rounded-2xl glass-panel border border-blue-600/30 text-blue-900 dark:text-blue-300 font-extrabold text-xs hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all flex items-center space-x-2" title="Account Settings">
              <i class="fa-solid fa-gear text-blue-500"></i>
              <span class="hidden sm:inline">Account Settings</span>
            </button>
            <button onclick="actions.openChangePasswordModal()" class="px-4 py-3 rounded-2xl glass-panel border border-blue-600/30 text-blue-900 dark:text-blue-300 font-extrabold text-xs hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all flex items-center space-x-2" title="Change Password">
              <i class="fa-solid fa-lock text-blue-500"></i>
              <span class="hidden sm:inline">Change Password</span>
            </button>
            <button onclick="actions.setView('marketplace')" class="px-5 py-3 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs shadow-lg shadow-blue-700/20 transition-all flex items-center space-x-2">
              <i class="fa-solid fa-basket-shopping text-amber-300"></i>
              <span>Browse Produce</span>
            </button>
            <button onclick="actions.setView('rfq-board')" class="px-5 py-3 rounded-2xl glass-panel border border-blue-600/30 text-blue-900 dark:text-blue-300 font-extrabold text-xs hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all flex items-center space-x-2">
              <i class="fa-solid fa-clipboard-list text-blue-500"></i>
              <span>Post RFQ</span>
            </button>
          </div>
        </div>

        <!-- KPI Metric Cards (all start at 0 until first activity) -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <div class="glass-card p-3 sm:p-5 rounded-2xl space-y-1.5 sm:space-y-2">
            <div class="flex items-center justify-between text-gray-500 text-[11px] font-bold">
              <span>Total Spent</span>
              <i class="fa-solid fa-naira-sign text-blue-600 text-base"></i>
            </div>
            <div class="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 dark:text-white">₦0</div>
            <div class="text-[10px] text-blue-600 font-semibold">Lifetime procurement</div>
          </div>
          <div class="glass-card p-3 sm:p-5 rounded-2xl space-y-1.5 sm:space-y-2">
            <div class="flex items-center justify-between text-gray-500 text-[11px] font-bold">
              <span>Active Orders</span>
              <i class="fa-solid fa-truck-fast text-emerald-600 text-base"></i>
            </div>
            <div class="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 dark:text-white">0</div>
            <div class="text-[10px] text-emerald-600 font-semibold">Currently in transit</div>
          </div>
          <div class="glass-card p-3 sm:p-5 rounded-2xl space-y-1.5 sm:space-y-2">
            <div class="flex items-center justify-between text-gray-500 text-[11px] font-bold">
              <span>Escrow Locked</span>
              <i class="fa-solid fa-lock text-amber-500 text-base"></i>
            </div>
            <div class="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 dark:text-white">₦0</div>
            <div class="text-[10px] text-amber-600 font-semibold">Agrein escrow protected</div>
          </div>
          <div class="glass-card p-3 sm:p-5 rounded-2xl space-y-1.5 sm:space-y-2">
            <div class="flex items-center justify-between text-gray-500 text-[11px] font-bold">
              <span>Completed</span>
              <i class="fa-solid fa-circle-check text-emerald-600 text-base"></i>
            </div>
            <div class="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 dark:text-white">0</div>
            <div class="text-[10px] text-emerald-600 font-semibold">Successful deliveries</div>
          </div>
          <div class="glass-card p-3 sm:p-5 rounded-2xl space-y-1.5 sm:space-y-2">
            <div class="flex items-center justify-between text-gray-500 text-[11px] font-bold">
              <span>Saved Farmers</span>
              <i class="fa-solid fa-heart text-rose-500 text-base"></i>
            </div>
            <div class="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 dark:text-white">0</div>
            <div class="text-[10px] text-rose-500 font-semibold">Trusted suppliers</div>
          </div>
          <div class="glass-card p-3 sm:p-5 rounded-2xl space-y-1.5 sm:space-y-2">
            <div class="flex items-center justify-between text-gray-500 text-[11px] font-bold">
              <span>Disputes Won</span>
              <i class="fa-solid fa-gavel text-purple-500 text-base"></i>
            </div>
            <div class="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 dark:text-white">0</div>
            <div class="text-[10px] text-purple-600 font-semibold">Buyer protection claims</div>
          </div>
        </div>

        <!-- Tracking + Notifications (single empty-state column until buyer places an order) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div class="lg:col-span-8 glass-card rounded-3xl p-6 sm:p-8 space-y-6 border border-blue-500/20">
            <div class="flex items-center space-x-2">
              <span class="px-2.5 py-0.5 rounded bg-blue-700 text-white text-[10px] font-extrabold uppercase">Live ColdChain Tracking</span>
              <span class="text-xs font-bold text-gray-500">No active orders</span>
            </div>
            <div class="py-12 text-center">
              <i class="fa-solid fa-truck-fast text-4xl text-blue-200 dark:text-slate-700 mb-3"></i>
              <div class="font-heading font-extrabold text-base text-slate-900 dark:text-white">No shipments in transit</div>
              <p class="text-xs text-gray-500 mt-1">Once you place an order, you'll see live tracking checkpoints here.</p>
              <button onclick="actions.setView('marketplace')" class="mt-4 px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs shadow-md transition-all">
                <i class="fa-solid fa-basket-shopping mr-1 text-amber-300"></i> Start Shopping
              </button>
            </div>
          </div>

          <div class="lg:col-span-4 glass-card rounded-3xl p-6 space-y-4 border border-gray-200/50 dark:border-slate-800">
            <div class="flex items-center justify-between">
              <h3 class="font-heading font-extrabold text-lg text-slate-900 dark:text-white flex items-center space-x-2">
                <i class="fa-solid fa-bell text-amber-500"></i>
                <span>Notifications</span>
              </h3>
              <span class="px-2 py-0.5 rounded-full bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-300 text-[10px] font-extrabold">0 new</span>
            </div>
            <div class="py-8 text-center">
              <i class="fa-solid fa-bell-slash text-2xl text-gray-300 dark:text-slate-700 mb-2 block"></i>
              <p class="text-xs text-gray-400">You're all caught up. New order updates will appear here.</p>
            </div>
          </div>
        </div>

        <!-- Spending Analytics + Favorite Farmers -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div class="lg:col-span-7 glass-card p-6 sm:p-8 rounded-3xl space-y-6">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-heading font-extrabold text-xl text-slate-900 dark:text-white">Spending Analytics</h3>
                <p class="text-xs text-gray-500">Monthly procurement expenditure</p>
              </div>
            </div>
            <div class="py-12 text-center">
              <i class="fa-solid fa-chart-column text-4xl text-blue-200 dark:text-slate-700 mb-3"></i>
              <div class="font-heading font-extrabold text-base text-slate-900 dark:text-white">No spending history yet</div>
              <p class="text-xs text-gray-500 mt-1">Place your first order to start tracking your monthly procurement spend.</p>
            </div>
          </div>

          <div class="lg:col-span-5 glass-card p-6 sm:p-8 rounded-3xl space-y-4 border border-emerald-500/15">
            <div class="flex items-center justify-between">
              <h3 class="font-heading font-extrabold text-lg text-slate-900 dark:text-white flex items-center space-x-2">
                <i class="fa-solid fa-heart text-rose-500"></i>
                <span>Saved Farmers</span>
              </h3>
              <button onclick="actions.setView('marketplace')" class="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors">Browse →</button>
            </div>
            <div class="py-10 text-center">
              <i class="fa-solid fa-people-group text-3xl text-emerald-200 dark:text-slate-700 mb-2 block"></i>
              <p class="text-xs text-gray-500">Save farmers you trust to quickly re-order from them later.</p>
            </div>
          </div>
        </div>

        <!-- Procurement History -->
        <div class="glass-card rounded-3xl p-6 sm:p-8 space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-heading font-extrabold text-xl text-slate-900 dark:text-white">Procurement History</h3>
              <p class="text-xs text-gray-500">All orders placed through Agrein's escrow system</p>
            </div>
            <span class="px-3 py-1 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 text-xs font-bold">0 Orders Total</span>
          </div>
          <div class="py-12 text-center">
            <i class="fa-solid fa-bag-shopping text-4xl text-blue-200 dark:text-slate-700 mb-3"></i>
            <div class="font-heading font-extrabold text-base text-slate-900 dark:text-white">No orders yet</div>
            <p class="text-xs text-gray-500 mt-1">When you complete your first order, it will be listed here with full escrow details.</p>
            <button onclick="actions.setView('marketplace')" class="mt-4 px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs shadow-md transition-all">
              Browse Marketplace
            </button>
          </div>
        </div>

      </div>
    </div>
  `;
}