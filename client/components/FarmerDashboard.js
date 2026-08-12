// Farmer Dashboard Component for Agrein
// Full-featured farm management portal with KPIs, orders, analytics, notifications, and profile

function renderFarmerDashboard(state, actions) {
  const { farmerProfile, products } = state.mockData;
  const farmerProducts = products.filter(p => p.farmerId === farmerProfile.id || p.farmerName === farmerProfile.name);
  const verificationStatus = (state.mockData.farmerVerificationApp || {}).status || 'DRAFT';
  const isApproved = verificationStatus === 'APPROVED';

  // Simulated incoming orders for farmer
  const incomingOrders = [
    { id: 'ORD-920412', buyer: 'Dr. Anita Okonjo', company: 'FreshMart Supermarkets', product: 'Benue Yam Tubers', qty: '50 Tubers', amount: 97500, status: 'Shipped', statusColor: 'bg-blue-100 text-blue-800', date: 'Aug 8, 2026' },
    { id: 'ORD-918305', buyer: 'Alhaji Musa Kano', company: 'Kano Grain Depot', product: 'Yellow Maize (Grade A)', qty: '200 kg', amount: 96000, status: 'Processing', statusColor: 'bg-amber-100 text-amber-800', date: 'Aug 10, 2026' },
    { id: 'ORD-916100', buyer: 'Mrs. Bola Lagos', company: 'FoodCourt Nigeria', product: 'Organic Sesame Seeds', qty: '100 kg', amount: 165000, status: 'Awaiting Pickup', statusColor: 'bg-purple-100 text-purple-800', date: 'Aug 9, 2026' },
    { id: 'ORD-881023', buyer: 'Dangote Flour Mills', company: 'Dangote Group', product: 'Yellow Maize (Grade A)', qty: '500 kg', amount: 240000, status: 'Delivered', statusColor: 'bg-emerald-100 text-emerald-800', date: 'Jul 28, 2026' },
    { id: 'ORD-870199', buyer: 'Chief Emeka Nnewi', company: 'Eastern Foods Ltd', product: 'Yam Tubers (Export)', qty: '100 Tubers', amount: 195000, status: 'Delivered', statusColor: 'bg-emerald-100 text-emerald-800', date: 'Jul 15, 2026' }
  ];

  // Notifications
  const notifications = [
    { id: 'fn1', icon: 'fa-cart-shopping', color: 'text-blue-500', title: 'New order from FreshMart Supermarkets', desc: '50 Yam Tubers — ₦97,500 escrow secured via Interswitch.', time: '2 hours ago', unread: true },
    { id: 'fn2', icon: 'fa-naira-sign', color: 'text-emerald-500', title: 'Escrow funds released: ₦240,000', desc: 'Dangote Flour Mills confirmed delivery of 500kg Maize.', time: '1 day ago', unread: true },
    { id: 'fn3', icon: 'fa-wand-magic-sparkles', color: 'text-amber-500', title: 'AI Price Alert: Sesame up +4.8%', desc: 'Sesame seed prices rising in Jigawa & Kaduna markets.', time: '2 days ago', unread: false },
    { id: 'fn4', icon: 'fa-circle-check', color: 'text-emerald-500', title: 'Farm verification approved!', desc: 'Your Agrein Verified Producer badge is now live.', time: '5 days ago', unread: false },
    { id: 'fn5', icon: 'fa-star', color: 'text-amber-500', title: 'New 5-star review from buyer', desc: 'Dr. Anita Okonjo rated your Yam Tubers delivery ★★★★★', time: '6 days ago', unread: false }
  ];

  // Recent buyer messages
  const recentMessages = [
    { from: 'Dr. Anita Okonjo', company: 'FreshMart', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80', msg: 'When can we expect the next batch of export-grade yams?', time: '1 hr ago', unread: true },
    { from: 'Alhaji Musa Kano', company: 'Kano Grain', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80', msg: 'What is the moisture level on the latest maize harvest?', time: '3 hrs ago', unread: true },
    { from: 'Dangote Procurement', company: 'Dangote', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', msg: 'We would like to negotiate a 10-ton seasonal contract.', time: 'Yesterday', unread: false }
  ];

  // Harvest calendar upcoming events
  const harvestCalendar = [
    { crop: 'Yellow Maize', action: 'Next harvest ready', date: 'Aug 25, 2026', icon: 'fa-wheat-awn', color: 'text-amber-500' },
    { crop: 'Sesame Seeds', action: 'Drying phase complete', date: 'Sep 2, 2026', icon: 'fa-seedling', color: 'text-emerald-500' },
    { crop: 'Sorghum', action: 'Planting season start', date: 'Sep 15, 2026', icon: 'fa-leaf', color: 'text-green-500' },
    { crop: 'Groundnuts', action: 'Quality inspection', date: 'Oct 1, 2026', icon: 'fa-magnifying-glass', color: 'text-blue-500' }
  ];

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
                  <span>Status: ${verificationStatus.replaceAll('_', ' ')}</span>
                </span>
              `}
              <span class="text-xs text-gray-500 font-semibold">${farmerProfile.location}</span>
            </div>
            <h1 class="text-3xl font-heading font-extrabold text-slate-900 dark:text-white">
              Welcome back, ${farmerProfile.name} 👋
            </h1>
            <p class="text-xs text-gray-600 dark:text-gray-400">
              Managing <strong class="text-emerald-700 dark:text-emerald-400">${farmerProfile.farmName}</strong> (${farmerProfile.sizeHectares} Hectares)
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-3 flex-shrink-0">
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
          <!-- Unverified Farmer Action Card -->
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

        <!-- Metric KPI Cards -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">

          <div class="glass-card p-3 sm:p-5 rounded-2xl space-y-1.5 sm:space-y-2">
            <div class="flex items-center justify-between text-gray-500 text-[11px] font-bold">
              <span>Available Balance</span>
              <i class="fa-solid fa-wallet text-emerald-600 text-base"></i>
            </div>
            <div class="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 dark:text-white">
              ₦${farmerProfile.availableBalance.toLocaleString()}
            </div>
            <div class="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
              <i class="fa-solid fa-circle-check mr-0.5"></i> Ready for payout
            </div>
          </div>

          <div class="glass-card p-3 sm:p-5 rounded-2xl space-y-1.5 sm:space-y-2">
            <div class="flex items-center justify-between text-gray-500 text-[11px] font-bold">
              <span>In Escrow</span>
              <i class="fa-solid fa-shield-halved text-amber-500 text-base"></i>
            </div>
            <div class="text-xl sm:text-2xl font-heading font-extrabold text-amber-600 dark:text-amber-400">
              ₦${farmerProfile.escrowPending.toLocaleString()}
            </div>
            <div class="text-[10px] text-amber-600 font-semibold">
              Releases on delivery
            </div>
          </div>

          <div class="glass-card p-3 sm:p-5 rounded-2xl space-y-1.5 sm:space-y-2">
            <div class="flex items-center justify-between text-gray-500 text-[11px] font-bold">
              <span>Lifetime Revenue</span>
              <i class="fa-solid fa-chart-line text-emerald-700 text-base"></i>
            </div>
            <div class="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 dark:text-white">
              ₦${(farmerProfile.totalLifetimeEarnings / 1000000).toFixed(1)}M
            </div>
            <div class="text-[10px] text-emerald-600 font-semibold">
              <i class="fa-solid fa-arrow-trend-up mr-0.5"></i> +42% vs middlemen
            </div>
          </div>

          <div class="glass-card p-3 sm:p-5 rounded-2xl space-y-1.5 sm:space-y-2">
            <div class="flex items-center justify-between text-gray-500 text-[11px] font-bold">
              <span>Active Listings</span>
              <i class="fa-solid fa-wheat-awn text-emerald-600 text-base"></i>
            </div>
            <div class="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 dark:text-white">
              ${farmerProducts.length}
            </div>
            <div class="text-[10px] text-gray-500 font-semibold">
              Crop products listed
            </div>
          </div>

          <div class="glass-card p-3 sm:p-5 rounded-2xl space-y-1.5 sm:space-y-2">
            <div class="flex items-center justify-between text-gray-500 text-[11px] font-bold">
              <span>Farmer Rating</span>
              <i class="fa-solid fa-star text-amber-500 text-base"></i>
            </div>
            <div class="text-xl sm:text-2xl font-heading font-extrabold text-amber-600 dark:text-amber-400">
              ⭐ ${farmerProfile.rating}
            </div>
            <div class="text-[10px] text-gray-500 font-semibold">
              ${farmerProfile.reviewsTotal} buyer reviews
            </div>
          </div>

          <div class="glass-card p-3 sm:p-5 rounded-2xl space-y-1.5 sm:space-y-2">
            <div class="flex items-center justify-between text-gray-500 text-[11px] font-bold">
              <span>Pending Orders</span>
              <i class="fa-solid fa-box text-blue-500 text-base"></i>
            </div>
            <div class="text-xl sm:text-2xl font-heading font-extrabold text-blue-700 dark:text-blue-400">
              ${incomingOrders.filter(o => o.status !== 'Delivered').length}
            </div>
            <div class="text-[10px] text-blue-600 font-semibold">
              Awaiting fulfillment
            </div>
          </div>

        </div>

        <!-- Incoming Orders + Notifications Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <!-- Incoming Orders Table -->
          <div class="lg:col-span-8 glass-card rounded-3xl p-6 sm:p-8 space-y-6">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-heading font-extrabold text-xl text-slate-900 dark:text-white flex items-center space-x-2">
                  <i class="fa-solid fa-inbox text-emerald-600"></i>
                  <span>Incoming Orders</span>
                </h3>
                <p class="text-xs text-gray-500">Buyer orders requiring your fulfillment and dispatch</p>
              </div>
              <span class="px-3 py-1 rounded-xl bg-emerald-100 dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                ${incomingOrders.length} Orders
              </span>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead class="bg-emerald-50 dark:bg-slate-800 text-gray-600 dark:text-gray-300 font-bold border-b border-gray-200 dark:border-slate-700">
                  <tr>
                    <th class="py-3 px-4">Order ID</th>
                    <th class="py-3 px-4">Buyer</th>
                    <th class="py-3 px-4">Product</th>
                    <th class="py-3 px-4">Amount</th>
                    <th class="py-3 px-4">Status</th>
                    <th class="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-slate-800">
                  ${incomingOrders.map(order => `
                    <tr class="hover:bg-emerald-50/40 dark:hover:bg-slate-800/40 transition-colors">
                      <td class="py-4 px-4 font-bold text-slate-900 dark:text-white">${order.id}</td>
                      <td class="py-4 px-4">
                        <div class="font-semibold text-gray-800 dark:text-gray-200">${order.buyer}</div>
                        <div class="text-[10px] text-gray-500">${order.company}</div>
                      </td>
                      <td class="py-4 px-4">
                        <div class="font-semibold text-gray-800 dark:text-gray-200">${order.product}</div>
                        <div class="text-[10px] text-gray-500">${order.qty}</div>
                      </td>
                      <td class="py-4 px-4 font-extrabold text-emerald-800 dark:text-emerald-400">₦${order.amount.toLocaleString()}</td>
                      <td class="py-4 px-4">
                        <span class="px-2.5 py-1 rounded-full ${order.statusColor} text-[10px] font-bold">${order.status}</span>
                      </td>
                      <td class="py-4 px-4 text-right space-x-2">
                        ${order.status === 'Processing' ? `
                          <button onclick="actions.triggerToast('📦 Order ${order.id} marked as ready for pickup.')" class="px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-[10px] font-bold hover:bg-emerald-800 transition-colors">Mark Ready</button>
                        ` : order.status === 'Awaiting Pickup' ? `
                          <button onclick="actions.triggerToast('🚚 Logistics dispatch requested for ${order.id}.')" class="px-3 py-1.5 rounded-lg bg-blue-700 text-white text-[10px] font-bold hover:bg-blue-800 transition-colors">Dispatch</button>
                        ` : order.status === 'Shipped' ? `
                          <button onclick="actions.triggerToast('📍 Tracking update sent for ${order.id}.')" class="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 text-[10px] font-bold transition-colors">Track</button>
                        ` : `
                          <span class="text-[10px] text-emerald-600 font-bold"><i class="fa-solid fa-circle-check mr-0.5"></i> Complete</span>
                        `}
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Notifications + Messages Sidebar -->
          <div class="lg:col-span-4 space-y-6">

            <!-- Notifications Panel -->
            <div class="glass-card rounded-3xl p-6 space-y-4 border border-gray-200/50 dark:border-slate-800">
              <div class="flex items-center justify-between">
                <h3 class="font-heading font-extrabold text-base text-slate-900 dark:text-white flex items-center space-x-2">
                  <i class="fa-solid fa-bell text-amber-500"></i>
                  <span>Notifications</span>
                </h3>
                <span class="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold">${notifications.filter(n => n.unread).length} new</span>
              </div>

              <div class="space-y-2 max-h-56 overflow-y-auto pr-1" style="scrollbar-width: thin;">
                ${notifications.map(notif => `
                  <div class="p-2.5 rounded-xl ${notif.unread ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/30' : 'bg-gray-50/50 dark:bg-slate-800/30'} space-y-0.5 transition-all hover:shadow-sm cursor-pointer">
                    <div class="flex items-start space-x-2.5">
                      <div class="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <i class="fa-solid ${notif.icon} ${notif.color} text-xs"></i>
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="text-[11px] font-extrabold text-slate-900 dark:text-white flex items-center space-x-1.5">
                          <span class="truncate">${notif.title}</span>
                          ${notif.unread ? '<span class="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0"></span>' : ''}
                        </div>
                        <p class="text-[10px] text-gray-500 font-medium line-clamp-1">${notif.desc}</p>
                        <span class="text-[9px] text-gray-400 font-semibold">${notif.time}</span>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Recent Buyer Messages -->
            <div class="glass-card rounded-3xl p-6 space-y-4 border border-blue-500/15">
              <h3 class="font-heading font-extrabold text-base text-slate-900 dark:text-white flex items-center space-x-2">
                <i class="fa-solid fa-comments text-blue-500"></i>
                <span>Buyer Messages</span>
              </h3>

              <div class="space-y-3">
                ${recentMessages.map(msg => `
                  <div class="flex items-start space-x-3 p-2.5 rounded-xl hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-all cursor-pointer group">
                    <img src="${msg.avatar}" class="w-9 h-9 rounded-lg object-cover flex-shrink-0" alt="${msg.from}">
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center space-x-1.5">
                        <span class="text-[11px] font-extrabold text-slate-900 dark:text-white">${msg.from}</span>
                        ${msg.unread ? '<span class="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0"></span>' : ''}
                      </div>
                      <p class="text-[10px] text-gray-600 dark:text-gray-400 font-medium truncate">${msg.msg}</p>
                      <span class="text-[9px] text-gray-400 font-semibold">${msg.time}</span>
                    </div>
                    <button onclick="actions.triggerToast('💬 Opening chat with ${msg.from}...')" class="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-blue-700 text-white text-[10px] transition-all">
                      <i class="fa-solid fa-reply"></i>
                    </button>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

        </div>

        <!-- Sales Analytics + AI Advisory + Harvest Calendar Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <!-- Sales Chart Visualization Card -->
          <div class="lg:col-span-5 glass-card p-6 sm:p-8 rounded-3xl space-y-6">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-heading font-extrabold text-lg text-slate-900 dark:text-white">Sales Analytics</h3>
                <p class="text-xs text-gray-500">Monthly revenue from bulk buyer transactions</p>
              </div>
              <span class="px-3 py-1 rounded-xl bg-emerald-100 dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold">2026</span>
            </div>

            <!-- Simulated Visual Bar Chart -->
            <div class="h-48 flex items-end justify-between space-x-3 sm:space-x-5 pt-6 pb-4 border-b border-gray-200 dark:border-slate-800">
              ${[
                { month: 'Mar', val: 24, label: '₦2.4M' },
                { month: 'Apr', val: 38, label: '₦3.8M' },
                { month: 'May', val: 45, label: '₦4.5M' },
                { month: 'Jun', val: 62, label: '₦6.2M' },
                { month: 'Jul', val: 78, label: '₦7.8M' },
                { month: 'Aug', val: 95, label: '₦9.5M', active: true }
              ].map(bar => `
                <div class="flex-1 flex flex-col items-center space-y-2 group">
                  <div class="text-[10px] font-bold text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">${bar.label}</div>
                  <div class="w-full rounded-t-xl transition-all duration-500 ${bar.active ? 'bg-gradient-to-t from-emerald-800 via-emerald-600 to-amber-400 shadow-lg shadow-emerald-600/30' : 'bg-emerald-200 dark:bg-slate-700 hover:bg-emerald-400'}" style="height: ${bar.val}%;"></div>
                  <span class="text-xs font-bold text-gray-600 dark:text-gray-400">${bar.month}</span>
                </div>
              `).join('')}
            </div>

            <div class="flex items-center justify-between text-xs text-gray-500 pt-1">
              <span class="flex items-center space-x-1"><i class="fa-solid fa-circle text-emerald-600 text-[10px]"></i> <span>Escrow Released</span></span>
              <span class="flex items-center space-x-1"><i class="fa-solid fa-circle text-amber-400 text-[10px]"></i> <span>Pending Delivery</span></span>
            </div>
          </div>

          <!-- AI Crop Advisor Widget -->
          <div class="lg:col-span-4 glass-card p-6 sm:p-8 rounded-3xl space-y-4 border border-amber-500/20">
            <div class="flex items-center space-x-2 text-amber-600 dark:text-amber-400 font-extrabold text-xs uppercase tracking-wider">
              <i class="fa-solid fa-wand-magic-sparkles"></i>
              <span>Agrein AI Advisor</span>
            </div>

            <h3 class="font-heading font-extrabold text-lg text-slate-900 dark:text-white">
              Price Forecast: Yellow Maize
            </h3>

            <div class="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
              <div class="text-2xl font-heading font-extrabold text-amber-600 dark:text-amber-400">₦520 / kg</div>
              <div class="text-[10px] text-gray-500 font-bold">Projected for Sep 2026</div>
              <p class="text-xs text-gray-700 dark:text-gray-300 font-medium">
                Maize prices in Northern Nigeria projected to rise 8.4% due to poultry feed demand spikes.
              </p>
            </div>

            <div class="text-xs space-y-2 pt-1 text-gray-600 dark:text-gray-300">
              <div class="flex items-center justify-between font-semibold">
                <span>AI Confidence:</span>
                <span class="text-emerald-600 font-bold">94.6%</span>
              </div>
              <div class="flex items-center justify-between font-semibold">
                <span>Optimal Hold Period:</span>
                <span class="text-amber-600 font-bold">14 Days</span>
              </div>
            </div>

            <button onclick="actions.setView('ai-insights')" class="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow-md transition-all text-center">
              Run Full AI Market Analysis
            </button>
          </div>

          <!-- Harvest Calendar -->
          <div class="lg:col-span-3 glass-card p-6 rounded-3xl space-y-4 border border-emerald-500/15">
            <h3 class="font-heading font-extrabold text-base text-slate-900 dark:text-white flex items-center space-x-2">
              <i class="fa-solid fa-calendar-days text-emerald-600"></i>
              <span>Harvest Calendar</span>
            </h3>

            <div class="space-y-3">
              ${harvestCalendar.map(event => `
                <div class="flex items-start space-x-3 p-2.5 rounded-xl bg-gray-50/50 dark:bg-slate-800/30 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/10 transition-all">
                  <div class="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <i class="fa-solid ${event.icon} ${event.color} text-sm"></i>
                  </div>
                  <div>
                    <div class="text-[11px] font-extrabold text-slate-900 dark:text-white">${event.crop}</div>
                    <div class="text-[10px] text-gray-500 font-medium">${event.action}</div>
                    <div class="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">${event.date}</div>
                  </div>
                </div>
              `).join('')}
            </div>

            <button onclick="actions.triggerToast('📅 Full harvest planning calendar coming soon.')" class="w-full py-2.5 rounded-xl border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-all text-center">
              View Full Calendar
            </button>
          </div>

        </div>

        <!-- Farm Profile Card + Quick Actions -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <!-- Farm Profile Summary -->
          <div class="glass-card p-6 rounded-2xl space-y-3 border border-emerald-500/15">
            <div class="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
              <i class="fa-solid fa-tractor text-base"></i>
              <span class="font-extrabold text-xs uppercase tracking-wider">Farm Profile</span>
            </div>
            <div class="text-sm font-bold text-slate-900 dark:text-white">${farmerProfile.farmName}</div>
            <div class="space-y-1.5 text-xs text-gray-600 dark:text-gray-400">
              <div class="flex items-center space-x-2"><i class="fa-solid fa-location-dot text-emerald-500 w-4"></i><span>${farmerProfile.location}</span></div>
              <div class="flex items-center space-x-2"><i class="fa-solid fa-ruler-combined text-blue-500 w-4"></i><span>${farmerProfile.sizeHectares} Hectares</span></div>
              <div class="flex items-center space-x-2"><i class="fa-solid fa-leaf text-green-500 w-4"></i><span>Organic Certification: Active</span></div>
              <div class="flex items-center space-x-2"><i class="fa-solid fa-phone text-amber-500 w-4"></i><span>${farmerProfile.phone || '+234 805 123 4567'}</span></div>
            </div>
            <button onclick="actions.triggerToast('✏️ Farm profile editing coming soon.')" class="text-xs text-emerald-600 font-bold hover:text-emerald-800 transition-colors mt-1">
              <i class="fa-solid fa-pen text-[10px] mr-0.5"></i> Edit Farm Profile
            </button>
          </div>

          <!-- Bank/Payout Info -->
          <div class="glass-card p-6 rounded-2xl space-y-3 border border-gray-200/50 dark:border-slate-800">
            <div class="flex items-center space-x-2 text-gray-500">
              <i class="fa-solid fa-building-columns text-base"></i>
              <span class="font-extrabold text-xs uppercase tracking-wider">Payout Account</span>
            </div>
            <div class="text-sm font-bold text-slate-900 dark:text-white">First Bank of Nigeria</div>
            <div class="space-y-1.5 text-xs text-gray-600 dark:text-gray-400">
              <div>Account: ****4582</div>
              <div>Account Name: ${farmerProfile.name}</div>
              <div class="flex items-center space-x-1 text-emerald-600 font-semibold">
                <i class="fa-solid fa-shield-halved text-[10px]"></i>
                <span>Interswitch Verified</span>
              </div>
            </div>
            <button onclick="actions.triggerToast('🏦 Bank account management coming soon.')" class="text-xs text-blue-600 font-bold hover:text-blue-800 transition-colors mt-1">
              <i class="fa-solid fa-pen text-[10px] mr-0.5"></i> Update Bank Details
            </button>
          </div>

          <!-- Quick Actions Card -->
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

        <!-- Inventory Produce Listings Table -->
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

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-emerald-50 dark:bg-slate-800 text-gray-600 dark:text-gray-300 font-bold border-b border-gray-200 dark:border-slate-700">
                <tr>
                  <th class="py-3.5 px-4">Crop Name</th>
                  <th class="py-3.5 px-4">Category</th>
                  <th class="py-3.5 px-4">Price / Unit</th>
                  <th class="py-3.5 px-4">Available Stock</th>
                  <th class="py-3.5 px-4">Organic</th>
                  <th class="py-3.5 px-4">Status</th>
                  <th class="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-slate-800">
                ${farmerProducts.map(prod => `
                  <tr class="hover:bg-emerald-50/40 dark:hover:bg-slate-800/40 transition-colors">
                    <td class="py-4 px-4 font-bold text-slate-900 dark:text-white flex items-center space-x-3">
                      <img src="${prod.image}" class="w-9 h-9 rounded-lg object-cover">
                      <span>${prod.title}</span>
                    </td>
                    <td class="py-4 px-4 text-gray-600 dark:text-gray-300">${prod.category}</td>
                    <td class="py-4 px-4 font-extrabold text-emerald-800 dark:text-emerald-400">₦${prod.price.toLocaleString()} / ${prod.unit}</td>
                    <td class="py-4 px-4 font-bold text-gray-800 dark:text-gray-200">${prod.availableQty.toLocaleString()} ${prod.unit}s</td>
                    <td class="py-4 px-4">
                      <span class="px-2 py-0.5 rounded text-[10px] font-extrabold ${prod.isOrganic ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'}">
                        ${prod.isOrganic ? 'Yes' : 'Standard'}
                      </span>
                    </td>
                    <td class="py-4 px-4">
                      <span class="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">Active</span>
                    </td>
                    <td class="py-4 px-4 text-right space-x-2">
                      <button onclick="actions.openProductModal('${prod.id}')" class="p-2 text-emerald-600 hover:text-emerald-800" title="View"><i class="fa-solid fa-eye"></i></button>
                      <button onclick="actions.triggerToast('✏️ Edit listing for ${prod.title}')" class="p-2 text-blue-600 hover:text-blue-800" title="Edit"><i class="fa-solid fa-pen-to-square"></i></button>
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
