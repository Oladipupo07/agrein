// Buyer Dashboard Component for Agrein
// Full-featured procurement portal with KPIs, analytics, order tracking, saved farmers, notifications, and history

function renderBuyerDashboard(state, actions) {
  const { buyerProfile } = state.mockData;
  const tracking = buyerProfile.activeTracking;

  // Simulated buyer KPIs
  const kpis = {
    totalSpent: 2847500,
    activeOrders: 3,
    savedFarmers: 8,
    escrowLocked: 337500,
    completedOrders: 11,
    disputesWon: 1
  };

  // Simulated notifications
  const notifications = [
    { id: 'n1', icon: 'fa-truck-fast', color: 'text-emerald-500', title: 'Order AGR-920412 is en route', desc: 'Benue Yam shipment passed Lokoja checkpoint at 6:30 AM', time: '2 hours ago', unread: true },
    { id: 'n2', icon: 'fa-circle-check', color: 'text-blue-500', title: 'Escrow released for AGR-881023', desc: 'Delivery confirmed. ₦240,000 released to Mallam Ibrahim Bello.', time: '1 day ago', unread: false },
    { id: 'n3', icon: 'fa-tags', color: 'text-amber-500', title: 'Price drop alert: Sesame Seeds', desc: 'Sesame seeds from Jigawa dropped 4.2% — now ₦1,580/kg.', time: '2 days ago', unread: true },
    { id: 'n4', icon: 'fa-shield-halved', color: 'text-purple-500', title: 'Dispute #DSP-0041 resolved in your favor', desc: 'Full refund of ₦48,000 credited to your Agrein Wallet.', time: '5 days ago', unread: false }
  ];

  // Simulated favorite farmers
  const favoriteFarmers = [
    { name: 'Mallam Ibrahim Bello', farm: 'Zaria Agro-Gold Farms', state: 'Kaduna', crop: 'Maize & Sesame', rating: 4.9, verified: true, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', totalOrders: 5 },
    { name: 'Chief Terver Ortom', farm: 'Gboko Giant Yam Estate', state: 'Benue', crop: 'Yam & Cassava', rating: 4.8, verified: true, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80', totalOrders: 3 },
    { name: 'Mama Adama Plateau', farm: 'Jos Organic Greenhouse', state: 'Plateau', crop: 'Tomatoes & Peppers', rating: 4.7, verified: true, avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=200&q=80', totalOrders: 4 },
    { name: 'Alhaji Garba Kano', farm: 'Kano Grain Co-op', state: 'Kano', crop: 'Rice & Millet', rating: 4.6, verified: false, avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80', totalOrders: 2 }
  ];

  // Past orders
  const pastOrders = [
    { code: 'AGR-920412', item: 'Benue Export Yam Tubers (50 Tubers)', farmer: 'Chief Terver Ortom', farmerVerified: true, amount: 97500, status: 'In Transit', statusColor: 'bg-blue-100 text-blue-800', date: 'Aug 8, 2026' },
    { code: 'AGR-881023', item: 'Grade-A Yellow Maize (500 kg)', farmer: 'Mallam Ibrahim Bello', farmerVerified: true, amount: 240000, status: 'Delivered', statusColor: 'bg-emerald-100 text-emerald-800', date: 'Jul 28, 2026' },
    { code: 'AGR-870199', item: 'Organic Roma Tomatoes (200 kg)', farmer: 'Mama Adama Plateau', farmerVerified: true, amount: 170000, status: 'Delivered', statusColor: 'bg-emerald-100 text-emerald-800', date: 'Jul 15, 2026' },
    { code: 'AGR-860045', item: 'White Sesame Seeds (300 kg)', farmer: 'Mallam Ibrahim Bello', farmerVerified: true, amount: 495000, status: 'Delivered', statusColor: 'bg-emerald-100 text-emerald-800', date: 'Jun 30, 2026' },
    { code: 'AGR-844012', item: 'Fresh Scotch Bonnet Peppers (100 kg)', farmer: 'Mama Adama Plateau', farmerVerified: true, amount: 85000, status: 'Refunded', statusColor: 'bg-red-100 text-red-800', date: 'Jun 12, 2026' }
  ];

  // Monthly spending data for chart
  const spendingData = [
    { month: 'Mar', val: 18, label: '₦180K' },
    { month: 'Apr', val: 32, label: '₦320K' },
    { month: 'May', val: 48, label: '₦480K' },
    { month: 'Jun', val: 72, label: '₦720K' },
    { month: 'Jul', val: 55, label: '₦550K' },
    { month: 'Aug', val: 88, label: '₦880K', active: true }
  ];

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
                <i class="fa-solid fa-shield-halved text-emerald-500 mr-0.5"></i> Escrow Protected
              </span>
            </div>
            <h1 class="text-3xl font-heading font-extrabold text-slate-900 dark:text-white">
              Welcome back, ${buyerProfile.name} 👋
            </h1>
            <p class="text-xs text-gray-600 dark:text-gray-400">
              <strong class="text-blue-700 dark:text-blue-400">${buyerProfile.company}</strong> • ${buyerProfile.address}
            </p>
          </div>

          <div class="flex items-center space-x-3 flex-shrink-0">
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

        <!-- KPI Metric Cards -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          
          <div class="glass-card p-5 rounded-2xl space-y-2">
            <div class="flex items-center justify-between text-gray-500 text-[11px] font-bold">
              <span>Total Spent</span>
              <i class="fa-solid fa-naira-sign text-blue-600 text-base"></i>
            </div>
            <div class="text-2xl font-heading font-extrabold text-slate-900 dark:text-white">
              ₦${(kpis.totalSpent / 1000000).toFixed(1)}M
            </div>
            <div class="text-[10px] text-blue-600 font-semibold">
              <i class="fa-solid fa-arrow-trend-up mr-0.5"></i> Lifetime procurement
            </div>
          </div>

          <div class="glass-card p-5 rounded-2xl space-y-2">
            <div class="flex items-center justify-between text-gray-500 text-[11px] font-bold">
              <span>Active Orders</span>
              <i class="fa-solid fa-truck-fast text-emerald-600 text-base"></i>
            </div>
            <div class="text-2xl font-heading font-extrabold text-emerald-700 dark:text-emerald-400">
              ${kpis.activeOrders}
            </div>
            <div class="text-[10px] text-emerald-600 font-semibold">
              <i class="fa-solid fa-spinner fa-spin mr-0.5"></i> Currently in transit
            </div>
          </div>

          <div class="glass-card p-5 rounded-2xl space-y-2">
            <div class="flex items-center justify-between text-gray-500 text-[11px] font-bold">
              <span>Escrow Locked</span>
              <i class="fa-solid fa-lock text-amber-500 text-base"></i>
            </div>
            <div class="text-2xl font-heading font-extrabold text-amber-600 dark:text-amber-400">
              ₦${(kpis.escrowLocked / 1000).toFixed(0)}K
            </div>
            <div class="text-[10px] text-amber-600 font-semibold">
              Protected by Interswitch
            </div>
          </div>

          <div class="glass-card p-5 rounded-2xl space-y-2">
            <div class="flex items-center justify-between text-gray-500 text-[11px] font-bold">
              <span>Completed</span>
              <i class="fa-solid fa-circle-check text-emerald-600 text-base"></i>
            </div>
            <div class="text-2xl font-heading font-extrabold text-slate-900 dark:text-white">
              ${kpis.completedOrders}
            </div>
            <div class="text-[10px] text-emerald-600 font-semibold">
              Successful deliveries
            </div>
          </div>

          <div class="glass-card p-5 rounded-2xl space-y-2">
            <div class="flex items-center justify-between text-gray-500 text-[11px] font-bold">
              <span>Saved Farmers</span>
              <i class="fa-solid fa-heart text-rose-500 text-base"></i>
            </div>
            <div class="text-2xl font-heading font-extrabold text-slate-900 dark:text-white">
              ${kpis.savedFarmers}
            </div>
            <div class="text-[10px] text-rose-500 font-semibold">
              Trusted suppliers
            </div>
          </div>

          <div class="glass-card p-5 rounded-2xl space-y-2">
            <div class="flex items-center justify-between text-gray-500 text-[11px] font-bold">
              <span>Disputes Won</span>
              <i class="fa-solid fa-gavel text-purple-500 text-base"></i>
            </div>
            <div class="text-2xl font-heading font-extrabold text-purple-700 dark:text-purple-400">
              ${kpis.disputesWon}
            </div>
            <div class="text-[10px] text-purple-600 font-semibold">
              Buyer protection claims
            </div>
          </div>

        </div>

        <!-- Live Order Tracking + Notifications Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <!-- Live Order Tracking Visual Timeline Card -->
          <div class="lg:col-span-8 glass-card rounded-3xl p-6 sm:p-8 space-y-6 border border-blue-500/20">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-slate-800 pb-4">
              <div>
                <div class="flex items-center space-x-2">
                  <span class="px-2.5 py-0.5 rounded bg-blue-700 text-white text-[10px] font-extrabold uppercase">Live ColdChain Tracking</span>
                  <span class="text-xs font-bold text-gray-500">Order ID: #${tracking.orderId}</span>
                </div>
                <h3 class="text-xl font-heading font-extrabold text-slate-900 dark:text-white mt-1">
                  ${tracking.product}
                </h3>
                <p class="text-xs text-gray-600 dark:text-gray-400 flex items-center space-x-1">
                  <span>Seller: <strong class="text-emerald-700 dark:text-emerald-400">${tracking.farmer}</strong></span>
                  ${renderVerifiedBadgeCompact(true)}
                </p>
              </div>

              <div class="text-left sm:text-right">
                <div class="text-xs text-gray-500 font-bold">Estimated Delivery</div>
                <div class="text-lg font-heading font-extrabold text-blue-600 dark:text-blue-400">${tracking.eta}</div>
              </div>
            </div>

            <!-- Driver & Logistics Detail -->
            <div class="p-4 rounded-2xl bg-blue-50/60 dark:bg-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center text-lg">
                  <i class="fa-solid fa-truck-ramp-box"></i>
                </div>
                <div>
                  <div class="font-bold text-slate-900 dark:text-white">${tracking.driver}</div>
                  <div class="text-gray-500 text-[11px]">Temperature-Controlled Logistics Fleet</div>
                </div>
              </div>
              <a href="tel:${tracking.driverPhone}" class="px-4 py-2 rounded-xl bg-white dark:bg-slate-700 text-blue-800 dark:text-blue-300 font-extrabold border border-blue-500/20 text-center hover:bg-blue-100 transition-all">
                <i class="fa-solid fa-phone text-emerald-500 mr-1"></i> Call Driver (${tracking.driverPhone})
              </a>
            </div>

            <!-- Checkpoint Step Progress Timeline -->
            <div class="space-y-6 pt-2">
              <h4 class="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Order Status Timeline</h4>
              <div class="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                ${tracking.checkpoints.map((step, idx) => `
                  <div class="flex md:flex-col items-center space-x-4 md:space-x-0 md:space-y-2 text-left md:text-center flex-1 relative z-10">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center text-xs font-extrabold transition-all ${step.completed ? 'bg-blue-700 text-white shadow-lg shadow-blue-700/30' : (step.current ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-400/30 font-black animate-pulse' : 'bg-gray-200 dark:bg-slate-800 text-gray-400')}">
                      ${step.completed ? '<i class="fa-solid fa-check"></i>' : (idx + 1)}
                    </div>
                    <div>
                      <div class="text-xs font-extrabold ${step.completed || step.current ? 'text-slate-900 dark:text-white' : 'text-gray-400'}">${step.title}</div>
                      <div class="text-[10px] text-gray-500 font-medium">${step.time}</div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Order Actions -->
            <div class="flex flex-wrap gap-3 pt-2 border-t border-gray-200 dark:border-slate-800">
              <button onclick="actions.openDisputeModal()" class="px-4 py-2 rounded-xl border border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 text-xs font-bold hover:bg-red-50 dark:hover:bg-red-950/30 transition-all flex items-center space-x-1.5">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <span>Report Issue</span>
              </button>
              <button onclick="actions.triggerToast('📦 Delivery confirmation request sent to logistics driver.')" class="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-all flex items-center space-x-1.5">
                <i class="fa-solid fa-circle-check"></i>
                <span>Confirm Delivery</span>
              </button>
              <button onclick="actions.triggerToast('📝 Quality inspection checklist opened.')" class="px-4 py-2 rounded-xl glass-panel border border-gray-200 dark:border-slate-700 text-xs font-bold hover:bg-gray-50 dark:hover:bg-slate-800 transition-all flex items-center space-x-1.5">
                <i class="fa-solid fa-clipboard-check text-blue-500"></i>
                <span>Quality Checklist</span>
              </button>
            </div>
          </div>

          <!-- Notifications Panel -->
          <div class="lg:col-span-4 glass-card rounded-3xl p-6 space-y-4 border border-gray-200/50 dark:border-slate-800">
            <div class="flex items-center justify-between">
              <h3 class="font-heading font-extrabold text-lg text-slate-900 dark:text-white flex items-center space-x-2">
                <i class="fa-solid fa-bell text-amber-500"></i>
                <span>Notifications</span>
              </h3>
              <span class="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-extrabold">${notifications.filter(n => n.unread).length} new</span>
            </div>

            <div class="space-y-3 max-h-80 overflow-y-auto pr-1" style="scrollbar-width: thin;">
              ${notifications.map(notif => `
                <div class="p-3 rounded-2xl ${notif.unread ? 'bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/30' : 'bg-gray-50/50 dark:bg-slate-800/30'} space-y-1 transition-all hover:shadow-sm cursor-pointer">
                  <div class="flex items-start space-x-3">
                    <div class="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <i class="fa-solid ${notif.icon} ${notif.color} text-sm"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="text-xs font-extrabold text-slate-900 dark:text-white flex items-center space-x-1.5">
                        <span class="truncate">${notif.title}</span>
                        ${notif.unread ? '<span class="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></span>' : ''}
                      </div>
                      <p class="text-[11px] text-gray-600 dark:text-gray-400 font-medium mt-0.5 line-clamp-2">${notif.desc}</p>
                      <span class="text-[10px] text-gray-400 font-semibold">${notif.time}</span>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>

            <button onclick="actions.triggerToast('📬 All notifications marked as read.')" class="w-full py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all text-center">
              Mark All as Read
            </button>
          </div>

        </div>

        <!-- Spending Analytics + Favorite Farmers Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">

          <!-- Spending Analytics Chart -->
          <div class="lg:col-span-7 glass-card p-6 sm:p-8 rounded-3xl space-y-6">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-heading font-extrabold text-xl text-slate-900 dark:text-white">Spending Analytics</h3>
                <p class="text-xs text-gray-500">Monthly procurement expenditure via Interswitch Escrow</p>
              </div>
              <span class="px-3 py-1 rounded-xl bg-blue-100 dark:bg-slate-800 text-blue-800 dark:text-blue-300 text-xs font-bold">2026 Season</span>
            </div>

            <!-- Bar Chart -->
            <div class="h-52 flex items-end justify-between space-x-3 sm:space-x-6 pt-6 pb-4 border-b border-gray-200 dark:border-slate-800">
              ${spendingData.map(bar => `
                <div class="flex-1 flex flex-col items-center space-y-2 group">
                  <div class="text-[10px] font-bold text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">${bar.label}</div>
                  <div class="w-full rounded-t-xl transition-all duration-500 ${bar.active ? 'bg-gradient-to-t from-blue-800 via-blue-600 to-amber-400 shadow-lg shadow-blue-600/30' : 'bg-blue-200 dark:bg-slate-700 hover:bg-blue-400'}" style="height: ${bar.val}%;"></div>
                  <span class="text-xs font-bold text-gray-600 dark:text-gray-400">${bar.month}</span>
                </div>
              `).join('')}
            </div>

            <div class="flex items-center justify-between text-xs text-gray-500 pt-1">
              <span class="flex items-center space-x-1"><i class="fa-solid fa-circle text-blue-600 text-[10px]"></i> <span>Escrow Released Payments</span></span>
              <span class="flex items-center space-x-1"><i class="fa-solid fa-circle text-amber-400 text-[10px]"></i> <span>Pending Delivery Clearance</span></span>
            </div>
          </div>

          <!-- Favorite Farmers -->
          <div class="lg:col-span-5 glass-card p-6 sm:p-8 rounded-3xl space-y-4 border border-emerald-500/15">
            <div class="flex items-center justify-between">
              <h3 class="font-heading font-extrabold text-lg text-slate-900 dark:text-white flex items-center space-x-2">
                <i class="fa-solid fa-heart text-rose-500"></i>
                <span>Favorite Farmers</span>
              </h3>
              <button onclick="actions.setView('nearby-farms')" class="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors">
                Discover More →
              </button>
            </div>

            <div class="space-y-3 max-h-72 overflow-y-auto pr-1" style="scrollbar-width: thin;">
              ${favoriteFarmers.map(farmer => `
                <div class="flex items-center justify-between p-3 rounded-2xl bg-gray-50/50 dark:bg-slate-800/30 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-all cursor-pointer group">
                  <div class="flex items-center space-x-3">
                    <img src="${farmer.avatar}" class="w-10 h-10 rounded-xl object-cover shadow-sm" alt="${farmer.name}">
                    <div>
                      <div class="text-xs font-extrabold text-slate-900 dark:text-white flex items-center space-x-1">
                        <span>${farmer.name}</span>
                        ${farmer.verified ? renderVerifiedBadgeCompact(true) : ''}
                      </div>
                      <div class="text-[11px] text-gray-500 font-medium">${farmer.farm} • ${farmer.state}</div>
                      <div class="text-[10px] text-gray-400 font-semibold">${farmer.crop} • ⭐ ${farmer.rating} • ${farmer.totalOrders} orders</div>
                    </div>
                  </div>
                  <button onclick="actions.setView('marketplace')" class="opacity-0 group-hover:opacity-100 px-3 py-1.5 rounded-lg bg-blue-700 text-white text-[10px] font-bold transition-all shadow-sm">
                    Re-order
                  </button>
                </div>
              `).join('')}
            </div>
          </div>

        </div>

        <!-- Delivery Address & Account Info -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <!-- Primary Address -->
          <div class="glass-card p-6 rounded-2xl space-y-3 border border-blue-500/15">
            <div class="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
              <i class="fa-solid fa-location-dot text-base"></i>
              <span class="font-extrabold text-xs uppercase tracking-wider">Primary Delivery Address</span>
            </div>
            <div class="text-sm font-bold text-slate-900 dark:text-white">${buyerProfile.company}</div>
            <p class="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">${buyerProfile.address}</p>
            <div class="flex items-center space-x-3 pt-1 text-xs">
              <span class="text-gray-500"><i class="fa-solid fa-phone text-emerald-500 mr-1"></i>${buyerProfile.phone}</span>
              <span class="text-gray-500"><i class="fa-solid fa-envelope text-blue-500 mr-1"></i>${buyerProfile.email}</span>
            </div>
          </div>

          <!-- Warehouse Address -->
          <div class="glass-card p-6 rounded-2xl space-y-3 border border-gray-200/50 dark:border-slate-800">
            <div class="flex items-center space-x-2 text-gray-500">
              <i class="fa-solid fa-warehouse text-base"></i>
              <span class="font-extrabold text-xs uppercase tracking-wider">Warehouse Address</span>
            </div>
            <div class="text-sm font-bold text-slate-900 dark:text-white">FreshMart Central Warehouse</div>
            <p class="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">Lot 28, Trade Fair Complex, Ojo-Badagry Expressway, Lagos</p>
            <button onclick="actions.triggerToast('📍 Edit delivery addresses coming soon.')" class="text-xs text-blue-600 font-bold hover:text-blue-800 transition-colors mt-1">
              <i class="fa-solid fa-pen text-[10px] mr-0.5"></i> Edit Address
            </button>
          </div>

          <!-- Quick Actions Card -->
          <div class="glass-card p-6 rounded-2xl space-y-3">
            <div class="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
              <i class="fa-solid fa-bolt text-base"></i>
              <span class="font-extrabold text-xs uppercase tracking-wider">Quick Actions</span>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <button onclick="actions.setView('wallet')" class="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-center hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-all">
                <i class="fa-solid fa-wallet text-emerald-600 text-lg"></i>
                <div class="text-[10px] font-bold text-gray-700 dark:text-gray-300 mt-1">Wallet</div>
              </button>
              <button onclick="actions.setView('traceability')" class="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-center hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all">
                <i class="fa-solid fa-qrcode text-blue-600 text-lg"></i>
                <div class="text-[10px] font-bold text-gray-700 dark:text-gray-300 mt-1">Traceability</div>
              </button>
              <button onclick="actions.setView('ai-insights')" class="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-center hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-all">
                <i class="fa-solid fa-wand-magic-sparkles text-amber-500 text-lg"></i>
                <div class="text-[10px] font-bold text-gray-700 dark:text-gray-300 mt-1">AI Forecast</div>
              </button>
              <button onclick="actions.openDisputeModal()" class="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 text-center hover:bg-red-100 dark:hover:bg-red-900/40 transition-all">
                <i class="fa-solid fa-shield-halved text-red-500 text-lg"></i>
                <div class="text-[10px] font-bold text-gray-700 dark:text-gray-300 mt-1">Dispute</div>
              </button>
            </div>
          </div>

        </div>

        <!-- Procurement History Table -->
        <div class="glass-card rounded-3xl p-6 sm:p-8 space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-heading font-extrabold text-xl text-slate-900 dark:text-white">Procurement History</h3>
              <p class="text-xs text-gray-500">All orders placed through Agrein's Interswitch Escrow system</p>
            </div>
            <span class="px-3 py-1 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 text-xs font-bold">
              ${pastOrders.length} Orders Total
            </span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-blue-50 dark:bg-slate-800 text-gray-500 font-bold border-b border-gray-200 dark:border-slate-700">
                <tr>
                  <th class="py-3 px-4">Order Code</th>
                  <th class="py-3 px-4">Harvest Item</th>
                  <th class="py-3 px-4 hidden sm:table-cell">Producer</th>
                  <th class="py-3 px-4 hidden md:table-cell">Date</th>
                  <th class="py-3 px-4">Total Amount</th>
                  <th class="py-3 px-4">Status</th>
                  <th class="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-slate-800">
                ${pastOrders.map(order => `
                  <tr class="hover:bg-blue-50/30 dark:hover:bg-blue-950/10 transition-colors">
                    <td class="py-4 px-4 font-bold text-slate-900 dark:text-white">${order.code}</td>
                    <td class="py-4 px-4 font-semibold text-gray-800 dark:text-gray-200">${order.item}</td>
                    <td class="py-4 px-4 text-emerald-700 dark:text-emerald-400 font-semibold hidden sm:table-cell">
                      <span class="inline-flex items-center space-x-1">
                        <span>${order.farmer}</span>
                        ${order.farmerVerified ? renderVerifiedBadgeCompact(true) : ''}
                      </span>
                    </td>
                    <td class="py-4 px-4 text-gray-500 font-medium hidden md:table-cell">${order.date}</td>
                    <td class="py-4 px-4 font-extrabold text-slate-900 dark:text-white">₦${order.amount.toLocaleString()}</td>
                    <td class="py-4 px-4"><span class="px-2.5 py-1 rounded-full ${order.statusColor} text-[10px] font-bold">${order.status}</span></td>
                    <td class="py-4 px-4 text-right">
                      <button onclick="actions.setView('marketplace')" class="px-3 py-1.5 rounded-lg bg-blue-700 text-white text-[11px] font-bold hover:bg-blue-800 transition-colors">Re-order</button>
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
