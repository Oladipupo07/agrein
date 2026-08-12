// Footer Component for Agrein

function renderFooter(state, actions) {
  return `
    <footer class="bg-slate-950 text-white pt-12 sm:pt-16 pb-10 sm:pb-12 border-t border-emerald-900/30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">

        <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

          <!-- Column 1: Brand Info -->
          <div class="md:col-span-5 space-y-4">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-amber-500 flex items-center justify-center text-white text-xl shadow-lg">
                <i class="fa-solid fa-wheat-awn"></i>
              </div>
              <span class="font-heading font-extrabold text-2xl tracking-tight text-white">Agrein</span>
            </div>

            <p class="text-sm text-gray-400 max-w-sm leading-relaxed">
              "Connecting Farmers to Buyers, One Harvest at a Time." Eliminating middlemen, empowering smallholders, and bringing transparent digital commerce to African agriculture.
            </p>

            <div class="flex flex-wrap items-center gap-2 text-xs text-gray-400">
              <span class="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 flex items-center space-x-1">
                <i class="fa-solid fa-shield-check text-emerald-500"></i>
                <span>Escrow Protected</span>
              </span>
              <span class="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 flex items-center space-x-1">
                <i class="fa-solid fa-lock text-red-500"></i>
                <span>Interswitch Webpay</span>
              </span>
            </div>
          </div>

          <!-- Column 2: Platform Links -->
          <div class="md:col-span-3 space-y-3">
            <h4 class="text-xs font-bold uppercase tracking-wider text-amber-400">Agrein Ecosystem</h4>
            <ul class="space-y-2 text-xs text-gray-400">
              <li><button onclick="actions.setView('marketplace')" class="hover:text-emerald-400 transition-colors">Direct Harvest Marketplace</button></li>
              <li><button onclick="actions.guardView('farmer-dashboard')" class="hover:text-emerald-400 transition-colors">Farmer Merchant Portal</button></li>
              <li><button onclick="actions.guardView('buyer-dashboard')" class="hover:text-emerald-400 transition-colors">Bulk Buyer Logistics</button></li>
              <li><button onclick="actions.setView('ai-insights')" class="hover:text-emerald-400 transition-colors">AI Crop Price Forecasting</button></li>
              <li><button onclick="actions.setView('nearby-farms')" class="hover:text-emerald-400 transition-colors">Geospatial Farm Finder</button></li>
            </ul>
          </div>

          <!-- Column 3: Newsletter Sign up -->
          <div class="md:col-span-4 space-y-4">
            <h4 class="text-xs font-bold uppercase tracking-wider text-amber-400">Agricultural Market Insights</h4>
            <p class="text-xs text-gray-400">Get weekly commodity price indices and harvest forecasts delivered to your inbox.</p>
            <form onsubmit="event.preventDefault(); actions.triggerToast('Subscribed to Agrein Market Report!');" class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input type="email" required placeholder="Enter your email..." class="flex-1 min-w-0 w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <button type="submit" class="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 font-extrabold text-xs text-white whitespace-nowrap">Subscribe</button>
            </form>
          </div>

        </div>

        <div class="pt-6 sm:pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4 sm:gap-0">
          <div class="text-center sm:text-left">© 2026 Agrein Agricultural Marketplace. All rights reserved. Powered by Interswitch Webpay.</div>
          <div class="flex space-x-4">
            <a href="#" class="hover:text-emerald-400" aria-label="Twitter"><i class="fa-brands fa-twitter text-base"></i></a>
            <a href="#" class="hover:text-emerald-400" aria-label="Facebook"><i class="fa-brands fa-facebook text-base"></i></a>
            <a href="#" class="hover:text-emerald-400" aria-label="LinkedIn"><i class="fa-brands fa-linkedin text-base"></i></a>
            <a href="#" class="hover:text-emerald-400" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp text-base"></i></a>
          </div>
        </div>

      </div>
    </footer>
  `;
}
