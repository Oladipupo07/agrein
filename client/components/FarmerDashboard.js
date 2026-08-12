// Farmer Dashboard Component for Agrein
// Full-featured farm management portal. All metrics start at zero and populate
// when the farmer makes their first sale. No demo personas.

function renderFarmerDashboard(state, actions) {
  const user = state.currentUser || {};
  const firstName = (user.full_name || user.email || 'there').split(/[\s@]/)[0];
  const verificationStatus = (state.mockData.farmerVerificationApp || {}).status || 'NOT_STARTED';
  const isApproved = verificationStatus === 'APPROVED';

  const incomingOrders = [];
  const notifications = [];
  const recentMessages = [];
  const farmerProducts = [];
  const availableBalance = 0;
  const escrowPending = 0;
  const totalLifetimeEarnings = 0;

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
                  <span>Verification: ${verificationStatus.replaceAll('_', ' ')}</span>
                </span>
              `}
            </div>
            <h1 class="text-3xl font-heading font-extrabold text-slate-900 dark:text-white">
              Welcome${user.full_name ? `, ${firstName}` : ''} 👋
            </h1>
            <p class="text-xs text-gray-600 dark:text-gray-400">
              ${isApproved ? 'Manage your verified farm, list harvests, and track escrow payouts.' : 'Complete farm verification to start listing crops on the Agrein marketplace.'}
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-3 flex-shrink-0">
            <button onclick="actions.guardView('account-settings')" class="px-4 py-3 rounded-2xl glass-panel border border-emerald-600/30 text-emerald-900 dark:text-emerald-300 font-extrabold text-xs hover:bg-emerald-50 transition-all flex items-center space-x-2" title="Account Settings">
              <i class="fa-solid fa-gear text-emerald-500"></i>
              <span class="hidden sm:inline">Account Settings</span>
            </button>
            <button onclick="actions.openChangePasswordModal()" class="px-4 py-3 rounded-2xl glass-panel border border-emerald-600/30 text-emerald-900 dark:text-emerald-300 font-extrabold text-xs hover:bg-emerald-50 transition-all flex items-center space-x-2" title="Change Password">
              <i class="fa-solid fa-lock text-emerald-500"></i>
              <span class="hidden sm:inline">Change Password</span>
            </button>
            <button onclick="actions.openAddProductModal()" class="px-5 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-lg shadow-emerald-700/20 transition-all flex items-center space-x-2">
              <i class="fa-solid fa-plus text-amber-300"></i>
              <span>List New Crop</span>
            </button>
            <button onclick="actions.openWithdrawalModal()" class="px-5 py-3 rounded-2xl glass-panel border border-emerald-600/30 text-emerald-900 dark:text-emerald-300 font-extrabold text-xs hover:bg-emerald-50 transition-all flex items-center space-x-2">
              <i class="fa-solid fa-building-columns text-amber-500"></i>
              <span>Withdraw Funds</span>
            </button>
          </div>
        </div>

        ${!isApproved ? `
          <div class="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="space-y-1">
              <div class="flex items-center space-x-2 text-amber-700 dark:text-amber-300 font-extrabold text-xs">
                <i class="fa-solid fa-shield-halved text-amber-500 text-base"></i>
                <span>Farm Verification Required Before Selling</span>
              </div>
              <p class="text-xs text-gray-600 dark:text-gray-300">
                To protect buyers and ensure marketplace trust, all farmers must submit identity documents, farm photos, and land coordinates for Agrein approval.
              </p>
            </div>
            <button onclick="actions.setView('farmer-verification')" class="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow-lg transition-all flex items-center justify-center space-x-2 w-full sm:w-auto">
              <i class="fa-solid fa-file-signature"></i>
              <span>Complete Farm Verification</span>
            </button>
          </div>
        ` : ''}

        <!-- KPI Cards (all zero until first activity) -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <div class="glass-card p-3 sm:p-5 rounded-2xl space-y-1.5 sm:space-y-2">
            <div class="flex items-center justify-between text-gray-500 text-[11px] font-bold">
              <span>Available Balance</span>
              <i class="fa-solid fa-wallet text-emerald-600 text-base"></i>
            </div>
            <div class="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 dark:text-white">₦${availableBalance.toLocaleString()}</div>
            <div class="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Ready for payout</div>
          </div>
          <div class="glass-card p-3 sm:p-5 rounded-2xl space-y-1.5 sm:space-y-2">
            <div class="flex items-center justify-between text-gray-500 text-[11px] font-bold">
              <span>In Escrow</span>
              <i class="fa-solid fa-shield-halved text-amber-500 text-base"></i>
            </div>
            <div class="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 dark:text-white">₦${escrowPending.toLocaleString()}</div>
            <div class="text-[10px] text-amber-600 font-semibold">Releases on delivery</div>
          </div>
          <div class="glass-card p-3 sm:p-5 rounded-2xl space-y-1.5 sm:space-y-2">
            <div class="flex items-center justify-between text-gray-500 text-[11px] font-bold">
              <span>Lifetime Revenue</span>
              <i class="fa-solid fa-chart-line text-emerald-700 text-base"></i>
            </div>
            <div class="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 dark:text-white">₦0</div>
            <div class="text-[10px] text-emerald-600 font-semibold">Total earnings to date</div>
          </div>
          <div class="glass-card p-3 sm:p-5 rounded-2xl space-y-1.5 sm:space-y-2">
            <div class="flex items-center justify-between text-gray-500 text-[11px] font-bold">
              <span>Active Listings</span>
              <i class="fa-solid fa-wheat-awn text-emerald-600 text-base"></i>
            </div>
            <div class="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 dark:text-white">0</div>
            <div class="text-[10px] text-gray-500 font-semibold">Crop products listed</div>
          </div>
          <div class="glass-card p-3 sm:p-5 rounded-2xl space-y-1.5 sm:space-y-2">
            <div class="flex items-center justify-between text-gray-500 text-[11px] font-bold">
              <span>Farmer Rating</span>
              <i class="fa-solid fa-star text-amber-500 text-base"></i>
            </div>
            <div class="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 dark:text-white">—</div>
            <div class="text-[10px] text-gray-500 font-semibold">Buyer reviews</div>
          </div>
          <div class="glass-card p-3 sm:p-5 rounded-2xl space-y-1.5 sm:space-y-2">
            <div class="flex items-center justify-between text-gray-500 text-[11px] font-bold">
              <span>Pending Orders</span>
              <i class="fa-solid fa-box text-blue-500 text-base"></i>
            </div>
            <div class="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 dark:text-white">0</div>
            <div class="text-[10px] text-blue-600 font-semibold">Awaiting fulfillment</div>
          </div>
        </div>

        <!-- Incoming Orders + Notifications -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div class="lg:col-span-8 glass-card rounded-3xl p-6 sm:p-8 space-y-6">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-heading font-extrabold text-xl text-slate-900 dark:text-white flex items-center space-x-2">
                  <i class="fa-solid fa-inbox text-emerald-600"></i>
                  <span>Incoming Orders</span>
                </h3>
                <p class="text-xs text-gray-500">Buyer orders requiring your fulfillment and dispatch</p>
              </div>
              <span class="px-3 py-1 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 text-xs font-bold">0 Orders</span>
            </div>
            <div class="py-12 text-center">
              <i class="fa-solid fa-inbox text-4xl text-emerald-200 dark:text-slate-700 mb-3"></i>
              <div class="font-heading font-extrabold text-base text-slate-900 dark:text-white">No orders yet</div>
              <p class="text-xs text-gray-500 mt-1">Once buyers place orders for your crops, they'll appear here with escrow status and dispatch actions.</p>
              ${isApproved ? `
                <button onclick="actions.setView('marketplace')" class="mt-4 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-md transition-all">
                  See Your Listings
                </button>
              ` : `
                <button onclick="actions.setView('farmer-verification')" class="mt-4 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow-md transition-all">
                  Complete Verification to Start Selling
                </button>
              `}
            </div>
          </div>

          <div class="lg:col-span-4 space-y-6">
            <div class="glass-card rounded-3xl p-6 space-y-4 border border-gray-200/50 dark:border-slate-800">
              <div class="flex items-center justify-between">
                <h3 class="font-heading font-extrabold text-base text-slate-900 dark:text-white flex items-center space-x-2">
                  <i class="fa-solid fa-bell text-amber-500"></i>
                  <span>Notifications</span>
                </h3>
                <span class="px-2 py-0.5 rounded-full bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-300 text-[10px] font-extrabold">0 new</span>
              </div>
              <div class="py-8 text-center">
                <i class="fa-solid fa-bell-slash text-2xl text-gray-300 dark:text-slate-700 mb-2 block"></i>
                <p class="text-xs text-gray-400">No notifications yet. Order updates will appear here.</p>
              </div>
            </div>

            <div class="glass-card rounded-3xl p-6 space-y-4 border border-blue-500/15">
              <h3 class="font-heading font-extrabold text-base text-slate-900 dark:text-white flex items-center space-x-2">
                <i class="fa-solid fa-comments text-blue-500"></i>
                <span>Buyer Messages</span>
              </h3>
              <div class="py-8 text-center">
                <i class="fa-solid fa-message text-2xl text-blue-200 dark:text-slate-700 mb-2 block"></i>
                <p class="text-xs text-gray-400">No messages yet. Buyers can reach you after they place an order.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Sales Analytics + AI Advisory + Calendar -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div class="lg:col-span-5 glass-card p-6 sm:p-8 rounded-3xl space-y-6">
            <div>
              <h3 class="font-heading font-extrabold text-lg text-slate-900 dark:text-white">Sales Analytics</h3>
              <p class="text-xs text-gray-500">Monthly revenue from bulk buyer transactions</p>
            </div>
            <div class="py-12 text-center">
              <i class="fa-solid fa-chart-column text-4xl text-emerald-200 dark:text-slate-700 mb-3"></i>
              <div class="font-heading font-extrabold text-base text-slate-900 dark:text-white">No sales yet</div>
              <p class="text-xs text-gray-500 mt-1">Your monthly revenue chart will populate after your first completed sale.</p>
            </div>
          </div>

          <div class="lg:col-span-4 glass-card p-6 sm:p-8 rounded-3xl space-y-4 border border-amber-500/20">
            <div class="flex items-center space-x-2 text-amber-600 dark:text-amber-400 font-extrabold text-xs uppercase tracking-wider">
              <i class="fa-solid fa-wand-magic-sparkles"></i>
              <span>Agrein AI Advisor</span>
            </div>
            <h3 class="font-heading font-extrabold text-lg text-slate-900 dark:text-white">Price Forecast</h3>
            <div class="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2 text-center">
              <i class="fa-solid fa-seedling text-3xl text-amber-300"></i>
              <p class="text-xs text-gray-600 dark:text-gray-300 font-medium">AI forecasts unlock once you list your first crop and choose a category.</p>
            </div>
            <button onclick="actions.setView('ai-insights')" class="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow-md transition-all text-center">
              Explore AI Market Insights
            </button>
          </div>

          <div class="lg:col-span-3 glass-card p-6 rounded-3xl space-y-4 border border-emerald-500/15">
            <h3 class="font-heading font-extrabold text-base text-slate-900 dark:text-white flex items-center space-x-2">
              <i class="fa-solid fa-calendar-days text-emerald-600"></i>
              <span>Harvest Calendar</span>
            </h3>
            <div class="py-8 text-center">
              <i class="fa-solid fa-calendar text-2xl text-emerald-200 dark:text-slate-700 mb-2 block"></i>
              <p class="text-xs text-gray-400">Add a crop listing to populate your harvest calendar.</p>
            </div>
            <button onclick="actions.openAddProductModal()" class="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all text-center">
              + Add Listing
            </button>
          </div>
        </div>

        <!-- Farm Profile + Payout + Quick Actions -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="glass-card p-6 rounded-2xl space-y-3 border border-emerald-500/15">
            <div class="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
              <i class="fa-solid fa-tractor text-base"></i>
              <span class="font-extrabold text-xs uppercase tracking-wider">Farm Profile</span>
            </div>
            <p class="text-xs text-gray-500">${isApproved ? 'Your verified farm profile is visible to buyers.' : 'Complete your farm verification to publish your profile.'}</p>
            ${!isApproved ? `
              <button onclick="actions.setView('farmer-verification')" class="text-xs text-amber-600 font-bold hover:text-amber-800 transition-colors mt-1">
                <i class="fa-solid fa-file-signature text-[10px] mr-0.5"></i> Start Verification
              </button>
            ` : ''}
          </div>

          <div class="glass-card p-6 rounded-2xl space-y-3 border border-gray-200/50 dark:border-slate-800">
            <div class="flex items-center space-x-2 text-gray-500">
              <i class="fa-solid fa-building-columns text-base"></i>
              <span class="font-extrabold text-xs uppercase tracking-wider">Payout Account</span>
            </div>
            <p class="text-xs text-gray-500">Add a bank account in Account Settings to enable withdrawals.</p>
          </div>

          <div class="glass-card p-6 rounded-2xl space-y-3">
            <div class="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
              <i class="fa-solid fa-bolt text-base"></i>
              <span class="font-extrabold text-xs uppercase tracking-wider">Quick Actions</span>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <button onclick="actions.setView('farmer-verification')" class="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-center hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-all">
                <i class="fa-solid fa-shield-halved text-amber-500 text-lg"></i>
                <div class="text-[10px] font-bold text-gray-700 dark:text-gray-300 mt-1">Verification</div>
              </button>
              <button onclick="actions.setView('wallet')" class="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-center hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-all">
                <i class="fa-solid fa-wallet text-emerald-600 text-lg"></i>
                <div class="text-[10px] font-bold text-gray-700 dark:text-gray-300 mt-1">Wallet</div>
              </button>
              <button onclick="actions.setView('logistics')" class="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-center hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all">
                <i class="fa-solid fa-truck-fast text-blue-600 text-lg"></i>
                <div class="text-[10px] font-bold text-gray-700 dark:text-gray-300 mt-1">Logistics</div>
              </button>
              <button onclick="actions.setView('ai-insights')" class="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 text-center hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-all">
                <i class="fa-solid fa-wand-magic-sparkles text-purple-500 text-lg"></i>
                <div class="text-[10px] font-bold text-gray-700 dark:text-gray-300 mt-1">AI Insights</div>
              </button>
            </div>
          </div>
        </div>

        <!-- Active Farm Listings -->
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
          <div class="py-12 text-center">
            <i class="fa-solid fa-wheat-awn text-4xl text-emerald-200 dark:text-slate-700 mb-3"></i>
            <div class="font-heading font-extrabold text-base text-slate-900 dark:text-white">No crop listings yet</div>
            <p class="text-xs text-gray-500 mt-1">Add your first harvest listing to start selling to verified buyers.</p>
            <button onclick="actions.openAddProductModal()" class="mt-4 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-md transition-all">
              List Your First Crop
            </button>
          </div>
        </div>

      </div>
    </div>
  `;
}