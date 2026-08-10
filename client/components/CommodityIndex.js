// Commodity Price Dashboard Component for Agrein

function renderCommodityIndex(state, actions) {
  const { commodityMarketPrices } = state.mockData;

  const allCommodities = [
    { crop: 'Maize (Yellow)', state: 'Kaduna', price: '₦480 / kg', change: '+3.2%', trend: 'up', high: '₦510', low: '₦420' },
    { crop: 'Rice (Paddy)', state: 'Kebbi', price: '₦1,100 / kg', change: '+1.8%', trend: 'up', high: '₦1,150', low: '₦1,020' },
    { crop: 'Tomatoes (Plum)', state: 'Plateau', price: '₦850 / kg', change: '+5.8%', trend: 'up', high: '₦920', low: '₦780' },
    { crop: 'Benue Yam', state: 'Benue', price: '₦1,950 / tuber', change: '-1.5%', trend: 'down', high: '₦2,100', low: '₦1,800' },
    { crop: 'Cassava Starch', state: 'Oyo', price: '₦350 / kg', change: '0.0%', trend: 'stable', high: '₦370', low: '₦340' },
    { crop: 'Cocoa Beans', state: 'Ondo', price: '₦3,400 / kg', change: '+8.1%', trend: 'up', high: '₦3,550', low: '₦3,100' },
    { crop: 'Ginger (Dried)', state: 'Kaduna', price: '₦2,800 / kg', change: '+4.2%', trend: 'up', high: '₦2,950', low: '₦2,650' },
    { crop: 'Sesame Seeds', state: 'Jigawa', price: '₦1,650 / kg', change: '+2.4%', trend: 'up', high: '₦1,720', low: '₦1,580' },
    { crop: 'Soybeans', state: 'Benue', price: '₦780 / kg', change: '+1.2%', trend: 'up', high: '₦810', low: '₦740' },
    { crop: 'Poultry Broilers', state: 'Ogun', price: '₦4,500 / bird', change: '+2.9%', trend: 'up', high: '₦4,800', low: '₦4,200' }
  ];

  return `
    <div class="py-12 bg-slate-50/50 dark:bg-slate-900/50 min-h-screen space-y-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <!-- Header -->
        <div class="glass-card rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div class="inline-flex items-center space-x-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
              <i class="fa-solid fa-chart-candlestick"></i>
              <span>National Commodity Market Intelligence</span>
            </div>
            <h1 class="text-3xl font-heading font-extrabold text-slate-900 dark:text-white">
              Real-Time Agricultural Price Index
            </h1>
            <p class="text-xs text-gray-500">Live price monitoring across 9 core commodities and 36 Nigerian state agricultural hubs.</p>
          </div>

          <button onclick="actions.triggerToast('Price Alert created for selected crops!')" class="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow-md flex items-center space-x-2">
            <i class="fa-solid fa-bell text-slate-950"></i>
            <span>Set Custom Price Alert</span>
          </button>
        </div>

        <!-- Commodity Price Grid Table -->
        <div class="glass-card rounded-3xl p-6 sm:p-8 space-y-6">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-gray-50 dark:bg-slate-800 text-gray-500 font-bold border-b border-gray-200 dark:border-slate-700">
                <tr>
                  <th class="py-3.5 px-4">Commodity Produce</th>
                  <th class="py-3.5 px-4">Primary Hub State</th>
                  <th class="py-3.5 px-4">Current Average Price</th>
                  <th class="py-3.5 px-4">24h Change</th>
                  <th class="py-3.5 px-4">Weekly Range (Low - High)</th>
                  <th class="py-3.5 px-4 text-right">Trend Analysis</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-slate-800">
                ${allCommodities.map(item => `
                  <tr class="hover:bg-emerald-50/40 dark:hover:bg-slate-800/40 transition-colors">
                    <td class="py-4 px-4 font-bold text-slate-900 dark:text-white">${item.crop}</td>
                    <td class="py-4 px-4 font-semibold text-emerald-700 dark:text-emerald-400">📍 ${item.state} State</td>
                    <td class="py-4 px-4 font-extrabold text-slate-900 dark:text-white text-sm">${item.price}</td>
                    <td class="py-4 px-4">
                      <span class="px-2.5 py-1 rounded-full text-[10px] font-extrabold ${item.trend === 'up' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}">
                        <i class="fa-solid fa-arrow-trend-${item.trend}"></i> ${item.change}
                      </span>
                    </td>
                    <td class="py-4 px-4 font-medium text-gray-600 dark:text-gray-400">${item.low} - ${item.high}</td>
                    <td class="py-4 px-4 text-right">
                      <button onclick="actions.setView('ai-insights')" class="px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-[11px] font-bold">AI Forecast</button>
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
