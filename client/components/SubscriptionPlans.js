// Subscription Management Component for Agrein

function renderSubscriptionPlans(state, actions) {
  const { currentPlan } = state;

  return `
    <div class="py-12 bg-slate-50/50 dark:bg-slate-900/50 min-h-screen space-y-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <!-- Header -->
        <div class="glass-card rounded-3xl p-6 sm:p-10 text-center max-w-3xl mx-auto space-y-4">
          <div class="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <i class="fa-solid fa-crown text-amber-400"></i>
            <span>Agrein Merchant Membership Tiers</span>
          </div>

          <h1 class="text-3xl sm:text-5xl font-heading font-extrabold text-slate-900 dark:text-white">
            Choose Your <span class="text-gradient-emerald">Agricultural Plan</span>
          </h1>

          <p class="text-xs text-gray-500 max-w-xl mx-auto">
            Unlock advanced AI price forecasting, unlimited produce listings, cooperative tools, and international export trade access.
          </p>
        </div>

        <!-- Pricing Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <!-- Free Farmer Plan -->
          <div class="glass-card rounded-3xl p-8 space-y-6 flex flex-col justify-between border border-gray-200 dark:border-slate-800">
            <div class="space-y-4">
              <span class="px-3 py-1 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 text-xs font-bold">Free Farmer</span>
              <div>
                <span class="text-4xl font-heading font-extrabold text-slate-900 dark:text-white">₦0</span>
                <span class="text-xs text-gray-500 font-semibold">/ month</span>
              </div>
              <p class="text-xs text-gray-500">Essential digital marketplace listing tools for smallholder farmers.</p>
              <ul class="space-y-2.5 text-xs text-gray-600 dark:text-gray-300">
                <li class="flex items-center space-x-2"><i class="fa-solid fa-check text-emerald-500"></i><span>Up to 3 Active Crop Listings</span></li>
                <li class="flex items-center space-x-2"><i class="fa-solid fa-check text-emerald-500"></i><span>Basic Sales Dashboard</span></li>
                <li class="flex items-center space-x-2"><i class="fa-solid fa-check text-emerald-500"></i><span>Interswitch Payout Access</span></li>
              </ul>
            </div>
            <button onclick="actions.triggerToast('Free plan is default for registered smallholder farmers.')" class="w-full py-3.5 rounded-2xl glass-panel text-xs font-bold text-slate-900 dark:text-white text-center">
              Current Active Plan
            </button>
          </div>

          <!-- Pro Farmer Plan -->
          <div class="glass-card rounded-3xl p-8 space-y-6 flex flex-col justify-between border-2 border-emerald-600 relative shadow-2xl">
            <div class="absolute -top-3.5 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full bg-emerald-700 text-white text-[10px] font-extrabold uppercase tracking-widest shadow-md">
              Most Popular
            </div>

            <div class="space-y-4">
              <span class="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold">Pro Farmer</span>
              <div>
                <span class="text-4xl font-heading font-extrabold text-slate-900 dark:text-white">₦5,000</span>
                <span class="text-xs text-gray-500 font-semibold">/ month</span>
              </div>
              <p class="text-xs text-gray-500">For commercial farmers looking to maximize yield margins with AI price intelligence.</p>
              <ul class="space-y-2.5 text-xs text-gray-600 dark:text-gray-300">
                <li class="flex items-center space-x-2"><i class="fa-solid fa-check text-emerald-500 font-bold"></i><span>Unlimited Crop Listings</span></li>
                <li class="flex items-center space-x-2"><i class="fa-solid fa-check text-emerald-500 font-bold"></i><span>AI Crop Price Forecasting & Advisor</span></li>
                <li class="flex items-center space-x-2"><i class="fa-solid fa-check text-emerald-500 font-bold"></i><span>Featured Marketplace Placement</span></li>
                <li class="flex items-center space-x-2"><i class="fa-solid fa-check text-emerald-500 font-bold"></i><span>NIN/BVN Verified Producer Badge</span></li>
              </ul>
            </div>

            <button onclick="actions.initiateInterswitchCheckout(5000, 'Agrein Pro Farmer Subscription (1 Month)');" class="w-full py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-lg text-center">
              Upgrade to Pro Plan via Interswitch
            </button>
          </div>

          <!-- Enterprise Plan -->
          <div class="glass-card rounded-3xl p-8 space-y-6 flex flex-col justify-between border border-amber-500/30">
            <div class="space-y-4">
              <span class="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-bold">Enterprise & Co-op</span>
              <div>
                <span class="text-4xl font-heading font-extrabold text-slate-900 dark:text-white">₦25,000</span>
                <span class="text-xs text-gray-500 font-semibold">/ month</span>
              </div>
              <p class="text-xs text-gray-500">For farmer cooperatives, exporters, and large agribusiness syndicates.</p>
              <ul class="space-y-2.5 text-xs text-gray-600 dark:text-gray-300">
                <li class="flex items-center space-x-2"><i class="fa-solid fa-check text-amber-500 font-bold"></i><span>Cooperative Group Management</span></li>
                <li class="flex items-center space-x-2"><i class="fa-solid fa-check text-amber-500 font-bold"></i><span>Export Trade Marketplace Access</span></li>
                <li class="flex items-center space-x-2"><i class="fa-solid fa-check text-amber-500 font-bold"></i><span>B2B Contract Negotiator</span></li>
                <li class="flex items-center space-x-2"><i class="fa-solid fa-check text-amber-500 font-bold"></i><span>Dedicated Logistics Coordinator</span></li>
              </ul>
            </div>

            <button onclick="actions.initiateInterswitchCheckout(25000, 'Agrein Enterprise Co-op Subscription (1 Month)');" class="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow-lg text-center">
              Subscribe Enterprise Tier
            </button>
          </div>

        </div>

      </div>
    </div>
  `;
}
