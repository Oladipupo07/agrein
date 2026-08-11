// Nearby Farm Discovery Component for Agrein

function renderNearbyFarms(state, actions) {
  return `
    <div class="py-12 bg-slate-50/50 dark:bg-slate-900/50 min-h-screen space-y-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <!-- Header -->
        <div class="glass-card rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div class="inline-flex items-center space-x-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1">
              <i class="fa-solid fa-location-dot"></i>
              <span>Geospatial Farm Discovery</span>
            </div>
            <h1 class="text-3xl font-heading font-extrabold text-slate-900 dark:text-white">
              Discover Nearby Certified Farms
            </h1>
            <p class="text-xs text-gray-500">Locate local producers, view active harvest stocks, and arrange direct farm gate pickup.</p>
          </div>

          <div class="flex items-center space-x-2">
            <button onclick="actions.triggerToast('GPS location updated: Lagos & Surrounding Regional Farms')" class="px-4 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold shadow-md">
              <i class="fa-solid fa-crosshairs mr-1"></i> Use My Location
            </button>
          </div>
        </div>

        <!-- Interactive Visual Farm Map Simulation -->
        <div class="relative h-72 sm:h-96 rounded-3xl overflow-hidden glass-card border border-emerald-500/20 shadow-xl bg-slate-900">
          <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80" class="w-full h-full object-cover opacity-40">
          
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40"></div>

          <!-- Map Pin Callouts -->
          <div class="absolute top-4 left-4 sm:top-1/4 sm:left-1/3 glass-card p-2 sm:p-3 rounded-2xl flex items-center space-x-2 text-xs text-slate-900 dark:text-white shadow-xl max-w-[180px] sm:max-w-none animate-bounce" style="animation-duration: 3s;">
            <div class="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold flex-shrink-0">🌾</div>
            <div class="min-w-0">
              <div class="font-extrabold truncate">Zaria Agro-Gold Farms</div>
              <div class="text-[10px] text-gray-400 truncate">Kaduna • 12,000 kg Maize</div>
            </div>
          </div>

          <div class="absolute bottom-4 right-4 sm:bottom-1/3 sm:right-1/4 glass-card p-2 sm:p-3 rounded-2xl flex items-center space-x-2 text-xs text-slate-900 dark:text-white shadow-xl max-w-[180px] sm:max-w-none animate-bounce" style="animation-duration: 4.5s;">
            <div class="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold flex-shrink-0">🥔</div>
            <div class="min-w-0">
              <div class="font-extrabold truncate">Gboko Giant Yam Estate</div>
              <div class="text-[10px] text-gray-400 truncate">Benue • 1,400 Tubers</div>
            </div>
          </div>

        </div>

        <!-- Nearby Farm Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          ${[
            { name: 'Zaria Agro-Gold Farms', farmer: 'Mallam Ibrahim Bello', state: 'Kaduna', dist: '14 km away', crops: 'Yellow Maize, Sesame Seeds', rating: '4.9 ⭐' },
            { name: 'Gboko Giant Yam Estate', farmer: 'Chief Terver Ortom', state: 'Benue', dist: '32 km away', crops: 'Export Yam Tubers', rating: '4.95 ⭐' },
            { name: 'Plateau Highlands Greenhouse', farmer: 'Mrs. Grace Pam', state: 'Jos, Plateau', dist: '8 km away', crops: 'Roma Tomatoes, Bell Peppers', rating: '4.85 ⭐' }
          ].map(farm => `
            <div class="glass-card rounded-3xl p-6 space-y-4">
              <div class="flex items-center justify-between">
                <span class="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                  📍 ${farm.dist}
                </span>
                <span class="text-xs font-bold text-amber-500">${farm.rating}</span>
              </div>

              <div>
                <h3 class="font-heading font-extrabold text-lg text-slate-900 dark:text-white">${farm.name}</h3>
                <p class="text-xs text-gray-500">Lead Farmer: ${farm.farmer} (${farm.state})</p>
              </div>

              <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs">
                <span class="text-gray-400">Active Harvests:</span>
                <div class="font-bold text-emerald-700 dark:text-emerald-400">${farm.crops}</div>
              </div>

              <div class="grid grid-cols-2 gap-2 pt-2">
                <button onclick="actions.openChatDrawer('${farm.farmer}')" class="py-2 px-3 rounded-xl glass-panel text-xs font-bold text-slate-900 dark:text-white text-center hover:bg-emerald-50">
                  <i class="fa-regular fa-comment-dots mr-1"></i> Direct Chat
                </button>
                <button onclick="actions.setView('marketplace')" class="py-2 px-3 rounded-xl bg-emerald-700 text-white text-xs font-bold text-center">
                  View Crops
                </button>
              </div>
            </div>
          `).join('')}

        </div>

      </div>
    </div>
  `;
}
