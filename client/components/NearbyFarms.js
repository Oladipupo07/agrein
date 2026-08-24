// Nearby Farm Discovery Component for Agrein
// Uses Leaflet + OpenStreetMap with live farms sourced from /api/farms/nearby.

function renderNearbyFarms(state, actions) {
  const farms = Array.isArray(state.nearbyFarms) ? state.nearbyFarms : [];
  const userLoc = state.nearbyUserLocation;
  const loading = Boolean(state.nearbyFarmsLoading);
  const error = state.nearbyFarmsError;

  return `
    <div class="py-12 bg-slate-50/50 dark:bg-slate-900/50 min-h-screen space-y-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        <div class="glass-card rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div class="inline-flex items-center space-x-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1">
              <i class="fa-solid fa-location-dot"></i>
              <span>Geospatial Farm Discovery</span>
            </div>
            <h1 class="text-3xl font-heading font-extrabold text-slate-900 dark:text-white">Discover Nearby Certified Farms</h1>
            <p class="text-xs text-gray-500">Live map of approved farms with GPS coordinates and trust score.</p>
            ${userLoc ? `
              <p class="text-[11px] text-emerald-700 dark:text-emerald-400 mt-2 font-bold">
                <i class="fa-solid fa-crosshairs mr-1"></i>
                Your location: ${userLoc.lat.toFixed(5)}, ${userLoc.lng.toFixed(5)}
              </p>
            ` : ''}
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <button onclick="actions.useNearbyMapMyLocation()" class="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md">
              <i class="fa-solid fa-crosshairs mr-1"></i> Use My Location
            </button>
            <button onclick="actions.refreshNearbyFarms()" class="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-emerald-600 text-emerald-700 dark:text-emerald-300 text-xs font-bold shadow-sm hover:bg-emerald-50 dark:hover:bg-slate-700">
              <i class="fa-solid fa-rotate mr-1"></i> Refresh Farms
            </button>
          </div>
        </div>

        <div class="glass-card rounded-3xl p-3 border border-emerald-500/20 shadow-xl overflow-hidden">
          <div id="nearbyFarmsMap" class="h-80 sm:h-[28rem] w-full rounded-2xl bg-slate-100 dark:bg-slate-800"></div>
        </div>

        ${loading ? `
          <div class="glass-card rounded-3xl p-6 text-center text-xs text-gray-500">
            <i class="fa-solid fa-spinner fa-spin mr-2"></i>Loading nearby farms...
          </div>
        ` : ''}

        ${error ? `
          <div class="glass-card rounded-3xl p-6 text-center text-xs text-red-600 dark:text-red-400">
            <i class="fa-solid fa-triangle-exclamation mr-1"></i>${error}
          </div>
        ` : ''}

        ${farms.length > 0 ? `
          <div class="glass-card rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 class="font-heading font-extrabold text-lg text-slate-900 dark:text-white">
              Verified Farms Nearby (${farms.length})
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              ${farms.slice(0, 24).map((farm) => `
                <div class="p-4 rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 space-y-2">
                  <div class="flex items-center justify-between gap-2">
                    <div class="font-extrabold text-sm text-slate-900 dark:text-white truncate">${farm.farm_name || 'Verified Farm'}</div>
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">APPROVED</span>
                  </div>
                  <div class="text-xs text-gray-500">Farmer: ${farm.farmer_name || 'Verified Farmer'}</div>
                  <div class="text-xs text-gray-500">Location: ${(farm.farm_state || 'Nigeria')}${farm.farm_lga ? ', ' + farm.farm_lga : ''}</div>
                  <div class="text-xs text-gray-500">Crops: ${(farm.crops_produced || []).slice(0, 3).join(', ') || 'Mixed crops'}</div>
                  <div class="flex items-center justify-between text-[11px] pt-1">
                    <span class="font-bold text-amber-600 dark:text-amber-400">Trust: ${Number(farm.trust_score || 50)}</span>
                    <span class="font-bold text-emerald-700 dark:text-emerald-300">${farm.distance_km == null ? 'Distance unavailable' : farm.distance_km + ' km away'}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : (!loading && !error ? `
          <div class="glass-card rounded-3xl p-8 sm:p-12 text-center">
            <i class="fa-solid fa-tractor text-4xl text-emerald-300 mb-3"></i>
            <h3 class="font-heading font-extrabold text-xl text-slate-900 dark:text-white">No nearby farms listed yet</h3>
            <p class="text-xs text-gray-500 mt-2 max-w-md mx-auto">Once approved farmers share GPS coordinates, they will appear here in real time.</p>
          </div>
        ` : '')}
      </div>
    </div>
  `;
}