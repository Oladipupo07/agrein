// Homepage Component for Agrein (Hero, Value Proposition, How It Works, Stats & CTA)

function renderHero(state, actions) {
  const rawPrices = state.mockData && state.mockData.commodityMarketPrices;
  const commodityMarketPrices = (Array.isArray(rawPrices) && rawPrices.length > 0) ? rawPrices : [
    { crop: 'Yellow Maize', state: 'Kaduna', price: '₦48,500/bag', trend: 'up', change: '+4.2%' },
    { crop: 'White Garri', state: 'Edo', price: '₦32,000/bag', trend: 'down', change: '-1.5%' },
    { crop: 'Soybeans', state: 'Benue', price: '₦68,000/bag', trend: 'up', change: '+3.1%' },
    { crop: 'Sesame Seeds', state: 'Nasarawa', price: '₦95,000/bag', trend: 'up', change: '+5.6%' },
    { crop: 'Yam Tubers', state: 'Taraba', price: '₦85,000/100 tubers', trend: 'up', change: '+2.8%' }
  ];

  return `
    <div class="space-y-16 sm:space-y-24 pb-16">
      
      <!-- ═══════════════════════════════════════════════ -->
      <!-- 1. HERO SECTION & LIVE COMMODITY TICKER        -->
      <!-- ═══════════════════════════════════════════════ -->
      <section class="relative pt-6 pb-12 md:pt-10 md:pb-20 overflow-hidden bg-hero-glow">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <!-- Live Commodity Price Ticker Banner -->
          <div class="mb-8 md:mb-12 w-full overflow-hidden rounded-2xl glass-panel py-3 px-4 border border-emerald-500/20 shadow-sm">
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

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            <!-- Left Column: Hero Content & Call to Actions -->
            <div class="lg:col-span-7 space-y-6 text-left">
              
              <div class="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 dark:bg-emerald-950/60 border border-emerald-300/40 text-emerald-900 dark:text-emerald-300 text-xs font-bold tracking-wide">
                <i class="fa-solid fa-leaf text-emerald-600"></i>
                <span>Empowering 14,800+ Verified Smallholder Farmers</span>
              </div>

              <h1 class="text-3xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                Connecting Farmers to Buyers, <span class="text-gradient-emerald">One Harvest at a Time.</span>
              </h1>

              <p class="text-base sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl font-normal leading-relaxed">
                Agrein is Nigeria's premier direct agricultural trading platform bridging the gap between local producers and commercial buyers. Trade fresh produce directly at transparent prices with 100% escrow protection.
              </p>

              <!-- Dual Primary Call to Actions -->
              <div class="pt-2 sm:pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <button onclick="actions.openAuthModal('register'); actions.setAuthRegisterRole('FARMER');" class="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-emerald-700/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-3">
                  <i class="fa-solid fa-tractor text-amber-300 text-base sm:text-lg"></i>
                  <span>Sign Up as Farmer</span>
                </button>
                <button onclick="actions.openAuthModal('register'); actions.setAuthRegisterRole('BUYER');" class="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl glass-panel border border-emerald-600/30 hover:border-emerald-600 text-emerald-900 dark:text-emerald-300 font-extrabold text-sm sm:text-base transition-all hover:bg-emerald-50 dark:hover:bg-slate-800 flex items-center justify-center space-x-3">
                  <i class="fa-solid fa-cart-shopping text-emerald-600"></i>
                  <span>Sign Up as Buyer</span>
                </button>
              </div>

              <!-- Trust Metrics -->
              <div class="pt-4 sm:pt-6 grid grid-cols-3 gap-2 sm:gap-4 border-t border-gray-200/80 dark:border-gray-800">
                <div>
                  <div class="text-xl sm:text-3xl font-heading font-extrabold text-emerald-800 dark:text-emerald-400">14,800+</div>
                  <div class="text-[11px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400">Verified Farmers</div>
                </div>
                <div>
                  <div class="text-xl sm:text-3xl font-heading font-extrabold text-emerald-800 dark:text-emerald-400">350k+ Tons</div>
                  <div class="text-[11px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400">Produce Traded</div>
                </div>
                <div>
                  <div class="text-xl sm:text-3xl font-heading font-extrabold text-amber-600 dark:text-amber-400">36 States</div>
                  <div class="text-[11px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400">Nationwide Reach</div>
                </div>
              </div>

            </div>

            <!-- Right Column: Interactive Visual Banner & Feature Glass Card -->
            <div class="lg:col-span-5 relative mt-4 lg:mt-0">
              <div class="relative rounded-3xl overflow-hidden shadow-2xl border border-emerald-500/20 group">
                <img
                  src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=70"
                  srcset="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=480&q=60 480w, https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=70 800w, https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=75 1200w"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 60vw, 50vw"
                  loading="eager" fetchpriority="high"
                  decoding="async"
                  alt="Fresh Nigerian Agricultural Farm Harvest"
                  class="hero-banner w-full h-64 sm:h-80 md:h-[440px] object-cover group-hover:scale-105 transition-transform duration-700">
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
                
                <!-- Floating Glass Badge 1: Escrow Protection -->
                <div class="hero-floating-badge absolute top-3 left-3 sm:top-6 sm:left-6 glass-card p-2 sm:p-3 rounded-xl sm:rounded-2xl flex items-center space-x-2.5 sm:space-x-3 text-slate-900 dark:text-white shadow-lg">
                  <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-600 text-white flex items-center justify-center text-sm sm:text-lg shadow-md flex-shrink-0">
                    <i class="fa-solid fa-shield-check"></i>
                  </div>
                  <div>
                    <div class="text-[11px] sm:text-xs font-bold">100% Escrow Protection</div>
                    <div class="text-[9px] sm:text-[10px] text-gray-600 dark:text-gray-300">Guaranteed secure trade</div>
                  </div>
                </div>

                <!-- Floating Glass Badge 2: Nationwide Coverage -->
                <div class="hero-floating-badge absolute bottom-4 right-4 sm:bottom-6 sm:right-6 glass-card p-3 sm:p-4 rounded-2xl max-w-xs text-slate-900 dark:text-white shadow-xl">
                  <div class="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold uppercase mb-1">
                    <i class="fa-solid fa-truck-fast"></i>
                    <span>Cold-Chain Logistics</span>
                  </div>
                  <p class="text-xs font-medium text-gray-700 dark:text-gray-200">
                    Direct shipping from rural farm clusters straight to wholesale buyers across Nigeria.
                  </p>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      <!-- ═══════════════════════════════════════════════ -->
      <!-- 2. WHY CHOOSE AGREIN (CORE VALUE PILLARS)      -->
      <!-- ═══════════════════════════════════════════════ -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto mb-12">
          <span class="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-extrabold uppercase tracking-wider">
            Trust & Transparency
          </span>
          <h2 class="text-2xl sm:text-4xl font-heading font-extrabold text-slate-900 dark:text-white mt-3">
            Why Thousands of Agricultural Leaders Trust Agrein
          </h2>
          <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-3">
            Built from the ground up to solve systemic agricultural challenges in Nigeria: eliminating exploitation, ensuring prompt payments, and guaranteeing high quality.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <!-- Pillar 1 -->
          <div class="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div>
              <div class="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-xl mb-4">
                <i class="fa-solid fa-shield-halved"></i>
              </div>
              <h3 class="text-base font-extrabold text-slate-900 dark:text-white mb-2">100% Escrow Protection</h3>
              <p class="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Buyer funds are securely locked in escrow before shipping and only released to the farmer once produce is delivered and inspected.
              </p>
            </div>
            <div class="mt-4 pt-3 border-t border-gray-100 dark:border-slate-800/60 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
              <span>Zero payment default risk</span>
            </div>
          </div>

          <!-- Pillar 2 -->
          <div class="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div>
              <div class="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 flex items-center justify-center text-xl mb-4">
                <i class="fa-solid fa-id-card"></i>
              </div>
              <h3 class="text-base font-extrabold text-slate-900 dark:text-white mb-2">Strict Identity Vetting</h3>
              <p class="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Every farmer is thoroughly verified with government identification, farm geolocation coordinates, and cooperative registration before listing.
              </p>
            </div>
            <div class="mt-4 pt-3 border-t border-gray-100 dark:border-slate-800/60 text-[11px] font-bold text-blue-600 dark:text-blue-400 flex items-center space-x-1">
              <span>Verified producer network</span>
            </div>
          </div>

          <!-- Pillar 3 -->
          <div class="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div>
              <div class="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center text-xl mb-4">
                <i class="fa-solid fa-chart-line"></i>
              </div>
              <h3 class="text-base font-extrabold text-slate-900 dark:text-white mb-2">Fair Market Pricing</h3>
              <p class="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Direct trade cuts out predatory intermediaries. Farmers earn up to 40% higher revenues while buyers get wholesale rates straight from farms.
              </p>
            </div>
            <div class="mt-4 pt-3 border-t border-gray-100 dark:border-slate-800/60 text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center space-x-1">
              <span>Real-time price visibility</span>
            </div>
          </div>

          <!-- Pillar 4 -->
          <div class="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div>
              <div class="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 flex items-center justify-center text-xl mb-4">
                <i class="fa-solid fa-truck-ramp-box"></i>
              </div>
              <h3 class="text-base font-extrabold text-slate-900 dark:text-white mb-2">End-to-End Logistics</h3>
              <p class="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Nationwide logistics partners handle pickup, cold-chain transport, and delivery tracking across all 36 states and the FCT.
              </p>
            </div>
            <div class="mt-4 pt-3 border-t border-gray-100 dark:border-slate-800/60 text-[11px] font-bold text-purple-600 dark:text-purple-400 flex items-center space-x-1">
              <span>99.4% On-time delivery</span>
            </div>
          </div>

        </div>
      </section>

      <!-- ═══════════════════════════════════════════════ -->
      <!-- 3. HOW IT WORKS (DUAL ONBOARDING WORKFLOW)     -->
      <!-- ═══════════════════════════════════════════════ -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-slate-100/90 to-white dark:from-slate-900/90 dark:to-slate-950 border border-emerald-500/10 shadow-lg">
          
          <div class="text-center max-w-2xl mx-auto mb-12">
            <span class="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-extrabold uppercase tracking-wider">
              Seamless Process
            </span>
            <h2 class="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 dark:text-white mt-3">
              How Agrein Works for You
            </h2>
            <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2">
              Simple, transparent, and built for both individual producers and institutional buyers.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            
            <!-- For Farmers Card -->
            <div class="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-800/80 border border-emerald-500/20 shadow-sm space-y-6">
              <div class="flex items-center space-x-3 pb-4 border-b border-gray-100 dark:border-slate-700">
                <div class="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center text-lg">
                  <i class="fa-solid fa-tractor"></i>
                </div>
                <div>
                  <h3 class="text-base font-extrabold text-slate-900 dark:text-white">For Farmers & Producers</h3>
                  <p class="text-[11px] text-gray-500">Sell directly, earn higher returns, get paid promptly</p>
                </div>
              </div>

              <div class="space-y-4">
                <div class="flex items-start space-x-3">
                  <span class="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 text-xs font-extrabold flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                  <div>
                    <h4 class="text-xs font-bold text-slate-900 dark:text-white">Sign Up & Complete Verification</h4>
                    <p class="text-[11px] text-gray-500 mt-0.5">Create your farmer account and complete identity verification with your National Identification Number (NIN).</p>
                  </div>
                </div>

                <div class="flex items-start space-x-3">
                  <span class="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 text-xs font-extrabold flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                  <div>
                    <h4 class="text-xs font-bold text-slate-900 dark:text-white">List Your Harvest</h4>
                    <p class="text-[11px] text-gray-500 mt-0.5">Specify crop type, quantity, moisture content, price per bag/ton, and your pickup farm hub.</p>
                  </div>
                </div>

                <div class="flex items-start space-x-3">
                  <span class="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 text-xs font-extrabold flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                  <div>
                    <h4 class="text-xs font-bold text-slate-900 dark:text-white">Receive Guaranteed Payouts</h4>
                    <p class="text-[11px] text-gray-500 mt-0.5">Once the buyer accepts delivery, funds in escrow are released instantly to your registered Nigerian bank account.</p>
                  </div>
                </div>
              </div>

              <button onclick="actions.openAuthModal('register'); actions.setAuthRegisterRole('FARMER');" class="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center space-x-2">
                <span>Start Selling as a Farmer</span>
                <i class="fa-solid fa-arrow-right text-xs"></i>
              </button>
            </div>

            <!-- For Buyers Card -->
            <div class="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-800/80 border border-blue-500/20 shadow-sm space-y-6">
              <div class="flex items-center space-x-3 pb-4 border-b border-gray-100 dark:border-slate-700">
                <div class="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center text-lg">
                  <i class="fa-solid fa-cart-shopping"></i>
                </div>
                <div>
                  <h3 class="text-base font-extrabold text-slate-900 dark:text-white">For Wholesale & Retail Buyers</h3>
                  <p class="text-[11px] text-gray-500">Source verified agricultural commodities with complete peace of mind</p>
                </div>
              </div>

              <div class="space-y-4">
                <div class="flex items-start space-x-3">
                  <span class="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-extrabold flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                  <div>
                    <h4 class="text-xs font-bold text-slate-900 dark:text-white">Register Your Buyer Account</h4>
                    <p class="text-[11px] text-gray-500 mt-0.5">Sign up in seconds as an individual buyer, processor, exporter, or corporate distributor.</p>
                  </div>
                </div>

                <div class="flex items-start space-x-3">
                  <span class="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-extrabold flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                  <div>
                    <h4 class="text-xs font-bold text-slate-900 dark:text-white">Connect with Verified Farms</h4>
                    <p class="text-[11px] text-gray-500 mt-0.5">Discover certified crops directly from audited farms across 36 Nigerian states at transparent commodity rates.</p>
                  </div>
                </div>

                <div class="flex items-start space-x-3">
                  <span class="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-extrabold flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                  <div>
                    <h4 class="text-xs font-bold text-slate-900 dark:text-white">Escrow Payment & Tracked Delivery</h4>
                    <p class="text-[11px] text-gray-500 mt-0.5">Pay safely through protected escrow. Inspect produce upon arrival before releasing payment.</p>
                  </div>
                </div>
              </div>

              <button onclick="actions.openAuthModal('register'); actions.setAuthRegisterRole('BUYER');" class="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center space-x-2">
                <span>Start Sourcing as a Buyer</span>
                <i class="fa-solid fa-arrow-right text-xs"></i>
              </button>
            </div>

          </div>

        </div>
      </section>

      <!-- ═══════════════════════════════════════════════ -->
      <!-- 4. FINAL CALL TO ACTION BANNER                 -->
      <!-- ═══════════════════════════════════════════════ -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-950 text-white p-8 sm:p-14 shadow-2xl text-center">
          <div class="absolute -right-10 -bottom-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div class="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 class="text-2xl sm:text-4xl font-heading font-extrabold">
              Ready to Join Nigeria's Direct Agricultural Network?
            </h2>
            <p class="text-sm sm:text-base text-emerald-200">
              Create your account in less than two minutes. Trade safely, eliminate unnecessary middlemen, and scale your agricultural business.
            </p>
            <div class="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button onclick="actions.openAuthModal('register');" class="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold text-sm shadow-xl transition-all transform hover:-translate-y-0.5">
                Create Free Account
              </button>
              <button onclick="actions.openAuthModal('login');" class="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-extrabold text-sm transition-all">
                Sign In to Your Account
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  `;
}
