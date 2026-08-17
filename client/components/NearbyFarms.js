// Nearby Farm Discovery Component for Agrein
// Renders an empty geospatial discovery page until real verified farms populate.

function renderNearbyFarms(state, actions) {
  const farms = [];
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
            <button onclick="actions.triggerToast('📍 Geolocation will be enabled when verified farms join your area.')" class="px-4 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold shadow-md">
              <i class="fa-solid fa-crosshairs mr-1"></i> Use My Location
            </button>
          </div>
        </div>

        <!-- Interactive Map Placeholder -->
        <div class="relative h-72 sm:h-96 rounded-3xl overflow-hidden glass-card border border-emerald-500/20 shadow-xl bg-slate-900">
          <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80" class="w-full h-full object-cover opacity-40">
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40"></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="text-center text-white max-w-sm px-6">
              <i class="fa-solid fa-map-location-dot text-4xl text-emerald-300 mb-3 block"></i>
              <div class="font-heading font-extrabold text-lg">No verified farms in your area yet</div>
              <p class="text-xs text-gray-300 mt-2">Once farmers in your region complete Agrein verification, they'll appear on this map with live harvest availability.</p>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div class="glass-card rounded-3xl p-8 sm:p-12 text-center">
          <i class="fa-solid fa-tractor text-4xl text-emerald-300 mb-3"></i>
          <h3 class="font-heading font-extrabold text-xl text-slate-900 dark:text-white">No nearby farms listed yet</h3>
          <p class="text-xs text-gray-500 mt-2 max-w-md mx-auto">As soon as farmers complete Agrein verification and share their farm coordinates, you'll see them here with distance, rating, and active crops.</p>
        </div>

      </div>
    </div>
  `;
}