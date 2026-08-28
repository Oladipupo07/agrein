// Buyer Dashboard Component for Agrein
// Role-Specific Produce Sourcing & Procurement Hub:
// Includes B2B Bulk Sourcing, Reverse RFQ Board, Commodity Price Index,
// Nearby Certified Farms, Export Marketplace, QR Traceability, Disputes & ColdChain Logistics.

function renderBuyerDashboard(state, actions) {
  const user = state.currentUser || {};
  const firstName = (user.full_name || user.email || 'there').split(/[\s@]/)[0];

  const pastOrders = [];
  const activeShipments = state.mockData.activeShipments || [];
  const rfqs = state.mockData.rfqs || [];

  return `
    <div class="py-8 bg-slate-50/50 dark:bg-slate-900/50 min-h-screen space-y-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        <!-- Header Banner -->
        <div class="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 border-l-8 border-l-blue-600">
          <div class="space-y-1">
            <div class="flex items-center space-x-2">
              <span class="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 text-[10px] sm:text-xs font-bold flex items-center space-x-1">
                <i class="fa-solid fa-cart-shopping text-blue-600"></i>
                <span>Buyer Portal</span>
              </span>
              <span class="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] sm:text-xs font-bold flex items-center space-x-1">
                <i class="fa-solid fa-shield-check text-emerald-600"></i>
                <span>Escrow Protected</span>
              </span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 dark:text-white">
              Welcome${user.full_name ? `, ${firstName}` : ''} 👋
            </h1>
            <p class="text-xs text-gray-600 dark:text-gray-400">
              Procure wholesale harvests directly from verified smallholder farmers, post custom RFQs, and track ColdChain shipments.
            </p>
          </div>

          <div class="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <button onclick="actions.setView('marketplace')" class="px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs shadow-lg shadow-blue-700/20 transition-all flex items-center justify-center space-x-1.5 sm:space-x-2">
              <i class="fa-solid fa-store text-amber-300"></i>
              <span>Marketplace</span>
            </button>
            <button onclick="actions.setView('rfq-board')" class="px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl glass-panel border border-blue-600/30 text-blue-900 dark:text-blue-300 font-extrabold text-xs hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all flex items-center justify-center space-x-1.5 sm:space-x-2">
              <i class="fa-solid fa-clipboard-list text-blue-500"></i>
              <span>Post RFQ</span>
            </button>
          </div>
        </div>

        <!-- Buyer Procurement KPI Cards -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <div class="glass-card p-3 sm:p-5 rounded-2xl space-y-1.5 sm:space-y-2">
            <div class="flex items-center justify-between text-gray-500 text-[11px] font-bold">
              <span>Total Procurement</span>
              <i class="fa-solid fa-naira-sign text-blue-600 text-base"></i>
            </div>
            <div class="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 dark:text-white">₦0</div>
            <div class="text-[10px] text-blue-600 font-semibold">Lifetime volume</div>
          </div>
          <div class="glass-card p-3 sm:p-5 rounded-2xl space-y-1.5 sm:space-y-2">
            <div class="flex items-center justify-between text-gray-500 text-[11px] font-bold">
              <span>Active Orders</span>
              <i class="fa-solid fa-truck-fast text-emerald-600 text-base"></i>
            </div>
            <div class="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 dark:text-white">${activeShipments.length}</div>
            <div class="text-[10px] text-emerald-600 font-semibold">In transit</div>
          </div>
          <div class="glass-card p-3 sm:p-5 rounded-2xl space-y-1.5 sm:space-y-2">
            <div class="flex items-center justify-between text-gray-500 text-[11px] font-bold">
              <span>Escrow Held</span>
              <i class="fa-solid fa-shield-halved text-amber-500 text-base"></i>
            </div>
            <div class="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 dark:text-white">₦0</div>
            <div class="text-[10px] text-amber-600 font-semibold">Safe until delivery</div>
          </div>
          <div class="glass-card p-3 sm:p-5 rounded-2xl space-y-1.5 sm:space-y-2">
            <div class="flex items-center justify-between text-gray-500 text-[11px] font-bold">
              <span>My RFQs</span>
              <i class="fa-solid fa-clipboard-list text-purple-600 text-base"></i>
            </div>
            <div class="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 dark:text-white">${rfqs.length}</div>
            <div class="text-[10px] text-purple-600 font-semibold">Farmer bids open</div>
          </div>
          <div class="glass-card p-3 sm:p-5 rounded-2xl space-y-1.5 sm:space-y-2">
            <div class="flex items-center justify-between text-gray-500 text-[11px] font-bold">
              <span>Completed</span>
              <i class="fa-solid fa-circle-check text-emerald-600 text-base"></i>
            </div>
            <div class="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 dark:text-white">0</div>
            <div class="text-[10px] text-emerald-600 font-semibold">Successful orders</div>
          </div>
          <div class="glass-card p-3 sm:p-5 rounded-2xl space-y-1.5 sm:space-y-2">
            <div class="flex items-center justify-between text-gray-500 text-[11px] font-bold">
              <span>Disputes</span>
              <i class="fa-solid fa-scale-balanced text-rose-500 text-base"></i>
            </div>
            <div class="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 dark:text-white">0</div>
            <div class="text-[10px] text-emerald-600 font-semibold">100% resolution</div>
          </div>
        </div>

        <!-- ═══ BUYER SOURCING & PROCUREMENT HUB ═══ -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-xl font-heading font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
                <i class="fa-solid fa-boxes-packing text-blue-600"></i>
                <span>Buyer Procurement & Sourcing Hub</span>
              </h2>
              <p class="text-xs text-gray-500">Corporate sourcing, price indexes, reverse bidding and export infrastructure</p>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            <!-- B2B Wholesale Bulk Procurement -->
            <div onclick="actions.setView('bulk-b2b')" class="glass-card p-5 rounded-2xl space-y-3 cursor-pointer hover:border-blue-500/50 hover:shadow-lg transition-all group">
              <div class="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                <i class="fa-solid fa-boxes-stacked"></i>
              </div>
              <div>
                <h3 class="font-heading font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">B2B Wholesale & Off-take</h3>
                <p class="text-xs text-gray-500 mt-1">Multi-ton corporate supply agreements, structured invoices & tiered volume discounts.</p>
              </div>
              <div class="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center space-x-1 pt-1">
                <span>Open B2B Procurement</span>
                <i class="fa-solid fa-arrow-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
              </div>
            </div>

            <!-- Reverse RFQ Sourcing Board -->
            <div onclick="actions.setView('rfq-board')" class="glass-card p-5 rounded-2xl space-y-3 cursor-pointer hover:border-purple-500/50 hover:shadow-lg transition-all group">
              <div class="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                <i class="fa-solid fa-clipboard-list"></i>
              </div>
              <div>
                <h3 class="font-heading font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">Reverse RFQ Bidding Board</h3>
                <p class="text-xs text-gray-500 mt-1">Post your exact crop specifications and receive competitive bids from verified farmers.</p>
              </div>
              <div class="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center space-x-1 pt-1">
                <span>Manage RFQ Postings</span>
                <i class="fa-solid fa-arrow-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
              </div>
            </div>

            <!-- 36 States Commodity Price Index -->
            <div onclick="actions.setView('commodity-index')" class="glass-card p-5 rounded-2xl space-y-3 cursor-pointer hover:border-amber-500/50 hover:shadow-lg transition-all group">
              <div class="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                <i class="fa-solid fa-chart-line"></i>
              </div>
              <div>
                <h3 class="font-heading font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">Commodity Price Index</h3>
                <p class="text-xs text-gray-500 mt-1">Live market prices, historical grain indexes, and regional spot rates across 36 states.</p>
              </div>
              <div class="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center space-x-1 pt-1">
                <span>Explore Market Index</span>
                <i class="fa-solid fa-arrow-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
              </div>
            </div>

            <!-- Nearby Certified Local Farms -->
            <div onclick="actions.setView('nearby-farms')" class="glass-card p-5 rounded-2xl space-y-3 cursor-pointer hover:border-emerald-500/50 hover:shadow-lg transition-all group">
              <div class="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                <i class="fa-solid fa-location-dot"></i>
              </div>
              <div>
                <h3 class="font-heading font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">Nearby Certified Farms</h3>
                <p class="text-xs text-gray-500 mt-1">Find vetted smallholders in your geographic area to reduce transit time and logistics costs.</p>
              </div>
              <div class="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1 pt-1">
                <span>Locate Nearby Farms</span>
                <i class="fa-solid fa-arrow-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
              </div>
            </div>

          </div>

          <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
            
            <!-- Cross-Border Agricultural Export -->
            <div onclick="actions.setView('export-trade')" class="glass-card p-4 rounded-2xl space-y-2 cursor-pointer hover:border-cyan-500 transition-all flex items-start space-x-3">
              <div class="w-9 h-9 rounded-xl bg-cyan-100 dark:bg-cyan-950/40 text-cyan-600 flex items-center justify-center text-base flex-shrink-0">
                <i class="fa-solid fa-globe-africa"></i>
              </div>
              <div>
                <h4 class="text-xs font-extrabold text-slate-900 dark:text-white">Export Marketplace</h4>
                <p class="text-[11px] text-gray-500 mt-0.5">International FOB/CIF shipping & Phytosanitary certifications.</p>
              </div>
            </div>

            <!-- QR Code Batch Traceability -->
            <div onclick="actions.setView('traceability')" class="glass-card p-4 rounded-2xl space-y-2 cursor-pointer hover:border-lime-500 transition-all flex items-start space-x-3">
              <div class="w-9 h-9 rounded-xl bg-lime-100 dark:bg-lime-950/40 text-lime-600 flex items-center justify-center text-base flex-shrink-0">
                <i class="fa-solid fa-qrcode"></i>
              </div>
              <div>
                <h4 class="text-xs font-extrabold text-slate-900 dark:text-white">Batch Traceability</h4>
                <p class="text-[11px] text-gray-500 mt-0.5">Farm-to-fork origin tracing & organic batch certificates.</p>
              </div>
            </div>

            <!-- ColdChain Smart Logistics -->
            <div onclick="actions.setView('logistics')" class="glass-card p-4 rounded-2xl space-y-2 cursor-pointer hover:border-indigo-500 transition-all flex items-start space-x-3">
              <div class="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center text-base flex-shrink-0">
                <i class="fa-solid fa-truck-fast"></i>
              </div>
              <div>
                <h4 class="text-xs font-extrabold text-slate-900 dark:text-white">ColdChain Logistics</h4>
                <p class="text-[11px] text-gray-500 mt-0.5">Temperature-controlled transit & real-time dispatch GPS.</p>
              </div>
            </div>

            <!-- Escrow Disputes & Protection Center -->
            <div onclick="actions.openBuyerDisputeModal()" class="glass-card p-4 rounded-2xl space-y-2 cursor-pointer hover:border-rose-500 transition-all flex items-start space-x-3">
              <div class="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center text-base flex-shrink-0">
                <i class="fa-solid fa-scale-balanced"></i>
              </div>
              <div>
                <h4 class="text-xs font-extrabold text-slate-900 dark:text-white">Escrow Dispute Center</h4>
                <p class="text-[11px] text-gray-500 mt-0.5">File damaged crop claims or request escrow refund.</p>
              </div>
            </div>

          </div>
        </div>

        <!-- ═══ RECENT ORDERS & SHIPMENTS TABLE ═══ -->
        <div class="glass-card rounded-3xl p-6 sm:p-8 space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-heading font-extrabold text-xl text-slate-900 dark:text-white">Recent Orders & Escrow Shipments</h3>
              <p class="text-xs text-gray-500">Track current produce in transit and released escrow transactions</p>
            </div>
            <button onclick="actions.setView('marketplace')" class="px-4 py-2 rounded-xl bg-blue-700 text-white text-xs font-bold hover:bg-blue-800 transition-all flex items-center space-x-1.5">
              <i class="fa-solid fa-plus text-[10px]"></i>
              <span>New Produce Order</span>
            </button>
          </div>

          ${pastOrders.length === 0 ? `
            <div class="p-8 text-center space-y-3 border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-2xl">
              <div class="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center mx-auto text-xl">
                <i class="fa-solid fa-basket-shopping"></i>
              </div>
              <p class="text-xs text-gray-500 font-medium">You have not placed any produce orders yet.</p>
              <button onclick="actions.setView('marketplace')" class="px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs shadow-md transition-all">
                Browse Farm Marketplace
              </button>
            </div>
          ` : `
            <div class="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
              <table class="w-full text-left text-xs">
                <thead class="bg-blue-50 dark:bg-slate-800 text-gray-600 dark:text-gray-300 font-bold border-b border-gray-200 dark:border-slate-700">
                  <tr>
                    <th class="py-3 px-4">Order ID</th>
                    <th class="py-3 px-4">Farm Supplier</th>
                    <th class="py-3 px-4">Produce</th>
                    <th class="py-3 px-4">Amount</th>
                    <th class="py-3 px-4">Status</th>
                    <th class="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-slate-800">
                  ${pastOrders.map(ord => `
                    <tr class="hover:bg-blue-50/40 dark:hover:bg-slate-800/40 transition-colors">
                      <td class="py-3.5 px-4 font-bold text-slate-900 dark:text-white">${ord.id}</td>
                      <td class="py-3.5 px-4 text-gray-600 dark:text-gray-300">${ord.farmerName}</td>
                      <td class="py-3.5 px-4 font-bold text-gray-800 dark:text-gray-200">${ord.crop}</td>
                      <td class="py-3.5 px-4 font-extrabold text-blue-800 dark:text-blue-400">₦${ord.amount.toLocaleString()}</td>
                      <td class="py-3.5 px-4"><span class="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">${ord.status}</span></td>
                      <td class="py-3.5 px-4 text-right">
                        <button onclick="actions.triggerToast('Tracking order ${ord.id}')" class="text-xs text-blue-600 hover:text-blue-800 font-bold">Track</button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `}
        </div>

      </div>
    </div>
  `;
}