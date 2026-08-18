// Hero Component for Agrein

function renderHero(state, actions) {
  const { commodityMarketPrices } = state.mockData;

  return `
    <section class="relative pt-8 pb-16 md:pt-12 md:pb-24 overflow-hidden bg-hero-glow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Live Commodity Price Ticker Banner -->
        <div class="mb-10 w-full overflow-hidden rounded-2xl glass-panel py-3 px-4 border border-emerald-500/20 shadow-sm">
          <div class="flex items-center space-x-3">
            <span class="flex-shrink-0 px-2.5 py-1 rounded-lg bg-emerald-700 text-white text-[11px] font-extrabold tracking-wider uppercase flex items-center space-x-1">
              <span class="w-2 h-2 rounded-full bg-amber-400 animate-ping mr-1"></span>
              Live Price Index
            </span>
            <div class="overflow-hidden relative w-full">
              <div class="animate-ticker space-x-8 text-xs font-semibold whitespace-nowrap">
                ${commodityMarketPrices.map(item => `
                  <div class="inline-flex items-center space-x-2 text-gray-800 dark:text-gray-200">
                    <span class="text-emerald-900 dark:text-emerald-300 font-bold">${item.crop} (${item.state}):</span>
                    <span class="text-gray-900 dark:text-white font-extrabold">${item.price}</span>
                    <span class="${item.trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600'} font-bold">
                      <i class="fa-solid fa-arrow-trend-${item.trend}"></i> ${item.change}
                    </span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <!-- Left Column: Hero Content & Call to Actions -->
          <div class="lg:col-span-7 space-y-6 text-left">
            
            <div class="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 dark:bg-emerald-950/60 border border-emerald-300/40 text-emerald-900 dark:text-emerald-300 text-xs font-bold tracking-wide">
              <i class="fa-solid fa-leaf text-emerald-600"></i>
              <span>Empowering 14,800+ Verified Smallholder Farmers</span>
            </div>

            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Connecting Farmers to Buyers, <span class="text-gradient-emerald">One Harvest at a Time.</span>
            </h1>

            <p class="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl font-normal leading-relaxed">
              Agrein is the modern agricultural marketplace bridging the gap between producers and buyers. Buy fresh, organic crops direct from certified farms at fair prices—zero middleman exploitation.
            </p>

            <!-- Dual Primary Call to Actions -->
            <div class="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <button onclick="actions.openAuthModal('register'); actions.setAuthRegisterRole('FARMER');" class="px-8 py-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-base shadow-xl shadow-emerald-700/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-3">
                <i class="fa-solid fa-tractor text-amber-300 text-lg"></i>
                <span>Sign Up as Farmer</span>
              </button>
              <button onclick="actions.openAuthModal('register'); actions.setAuthRegisterRole('BUYER');" class="px-8 py-4 rounded-2xl glass-panel border border-emerald-600/30 hover:border-emerald-600 text-emerald-900 dark:text-emerald-300 font-extrabold text-base transition-all hover:bg-emerald-50 dark:hover:bg-slate-800 flex items-center justify-center space-x-3">
                <i class="fa-solid fa-cart-shopping text-emerald-600"></i>
                <span>Sign Up as Buyer</span>
              </button>
            </div>

            <!-- Trust Metrics -->
            <div class="pt-6 grid grid-cols-3 gap-3 sm:gap-4 border-t border-gray-200/80 dark:border-gray-800">
              <div>
                <div class="text-lg sm:text-2xl md:text-3xl font-heading font-extrabold text-emerald-800 dark:text-emerald-400">14,800+</div>
                <div class="text-[10px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400">Farmers Onboarded</div>
              </div>
              <div>
                <div class="text-lg sm:text-2xl md:text-3xl font-heading font-extrabold text-emerald-800 dark:text-emerald-400">350k+ Tons</div>
                <div class="text-[10px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400">Produce Traded</div>
              </div>
              <div>
                <div class="text-lg sm:text-2xl md:text-3xl font-heading font-extrabold text-amber-600 dark:text-amber-400">36 States</div>
                <div class="text-[10px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400">Direct Logistics</div>
              </div>
            </div>

          </div>

          <!-- Right Column: Interactive Visual Banner & Feature Glass Card -->
          <div class="lg:col-span-5 relative">
            <div class="relative rounded-3xl overflow-hidden shadow-2xl border border-emerald-500/20 group">
              <img
                src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=70"
                srcset="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=480&q=60 480w, https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=70 800w, https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=75 1200w"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 60vw, 50vw"
                loading="eager" fetchpriority="high"
                decoding="async"
                alt="Fresh Nigerian Agricultural Farm Harvest"
                class="hero-banner w-full h-56 sm:h-80 md:h-[440px] object-cover group-hover:scale-105 transition-transform duration-700">
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
              
              <!-- Floating Glass Badge 1: Escrow Protection -->
              <div class="hero-floating-badge absolute top-4 left-4 sm:top-6 sm:left-6 glass-card p-2.5 sm:p-3 rounded-2xl flex items-center space-x-3 text-slate-900 dark:text-white shadow-lg animate-bounce" style="animation-duration: 4s;">
                <div class="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-lg shadow-md">
                  <i class="fa-solid fa-shield-check"></i>
                </div>
                <div>
                  <div class="text-xs font-bold">100% Escrow Protection</div>
                  <div class="text-[10px] text-gray-600 dark:text-gray-300">Funds released after harvest delivery</div>
                </div>
              </div>

              <!-- Floating Glass Badge 2: AI Pricing -->
              <div class="hero-floating-badge absolute bottom-4 right-4 sm:bottom-6 sm:right-6 glass-card p-3 sm:p-4 rounded-2xl max-w-[10rem] sm:max-w-xs text-slate-900 dark:text-white shadow-xl">
                <div class="flex items-center space-x-2 text-amber-600 dark:text-amber-400 text-xs font-extrabold uppercase mb-1">
                  <i class="fa-solid fa-wand-magic-sparkles"></i>
                  <span>Agrein AI Insights</span>
                </div>
                <p class="text-xs font-medium text-gray-700 dark:text-gray-200">
                  Yellow Maize prices projected +8.4% next 2 weeks in Northern hubs.
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  `;
}
