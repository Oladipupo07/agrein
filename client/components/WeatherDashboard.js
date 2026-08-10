// Weather Intelligence Dashboard Component for Agrein

function renderWeatherDashboard(state, actions) {
  const { weatherData } = state.mockData;

  return `
    <div class="py-12 bg-slate-50/50 dark:bg-slate-900/50 min-h-screen space-y-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <!-- Header -->
        <div class="glass-card rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-l-8 border-l-sky-500">
          <div>
            <div class="inline-flex items-center space-x-2 text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider mb-1">
              <i class="fa-solid fa-cloud-sun-rain"></i>
              <span>Geospatial Agricultural Weather Intelligence</span>
            </div>
            <h1 class="text-3xl font-heading font-extrabold text-slate-900 dark:text-white">
              Weather & Harvesting Advisory
            </h1>
            <p class="text-xs text-gray-500">Hyper-local rainfall forecasts, soil moisture indices, and planting/harvesting recommendations.</p>
          </div>

          <div class="flex items-center space-x-2">
            <select onchange="actions.triggerToast('Switched weather forecast region to ' + this.value)" class="px-4 py-2.5 rounded-xl text-xs font-bold glass-panel border border-sky-500/30 text-slate-900 dark:text-white">
              <option>Region: Kaduna (Northern Grain Belt)</option>
              <option>Region: Benue (Middle Belt Tuber Zone)</option>
              <option>Region: Plateau (Highland Greenhouse)</option>
              <option>Region: Ondo (Western Cocoa Zone)</option>
              <option>Region: Lagos (Coastal Hub)</option>
            </select>
          </div>
        </div>

        <!-- Weather Metrics KPI Bar -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="glass-card p-6 rounded-3xl space-y-2">
            <div class="flex items-center justify-between text-gray-500 text-xs font-bold">
              <span>Temperature</span>
              <i class="fa-solid fa-temperature-three-quarters text-amber-500 text-lg"></i>
            </div>
            <div class="text-3xl font-heading font-extrabold text-slate-900 dark:text-white">29°C</div>
            <div class="text-[11px] text-gray-500 font-semibold">Optimal for Maize & Yam maturation</div>
          </div>

          <div class="glass-card p-6 rounded-3xl space-y-2">
            <div class="flex items-center justify-between text-gray-500 text-xs font-bold">
              <span>Rainfall Prediction</span>
              <i class="fa-solid fa-cloud-showers-heavy text-sky-500 text-lg"></i>
            </div>
            <div class="text-3xl font-heading font-extrabold text-sky-600 dark:text-sky-400">14 mm</div>
            <div class="text-[11px] text-sky-600 font-bold">Moderate showers expected Thursday</div>
          </div>

          <div class="glass-card p-6 rounded-3xl space-y-2">
            <div class="flex items-center justify-between text-gray-500 text-xs font-bold">
              <span>Soil Moisture Index</span>
              <i class="fa-solid fa-droplet text-emerald-600 text-lg"></i>
            </div>
            <div class="text-3xl font-heading font-extrabold text-slate-900 dark:text-white">68%</div>
            <div class="text-[11px] text-emerald-600 font-bold">Ideal for root tuber expansion</div>
          </div>

          <div class="glass-card p-6 rounded-3xl space-y-2">
            <div class="flex items-center justify-between text-gray-500 text-xs font-bold">
              <span>Wind Speed</span>
              <i class="fa-solid fa-wind text-indigo-500 text-lg"></i>
            </div>
            <div class="text-3xl font-heading font-extrabold text-slate-900 dark:text-white">12 km/h</div>
            <div class="text-[11px] text-gray-500 font-semibold">Safe for field spraying operations</div>
          </div>
        </div>

        <!-- Planting & Harvest Recommendation Alert Card -->
        <div class="glass-card rounded-3xl p-6 sm:p-8 space-y-4 border border-sky-500/20">
          <div class="flex items-center space-x-2 text-sky-600 dark:text-sky-400 font-extrabold text-xs uppercase tracking-wider">
            <i class="fa-solid fa-compass"></i>
            <span>Seasonal Agronomic Guidance</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div class="p-4 rounded-2xl bg-emerald-50 dark:bg-slate-800/60 border border-emerald-500/20 space-y-2">
              <h4 class="font-extrabold text-emerald-800 dark:text-emerald-300 text-sm">🌱 Planting Recommendations</h4>
              <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                Northern grain belt soil temperature is optimal for second-cycle Sesame seeding. Ensure 20cm row spacing to prevent waterlogging during mid-August rain spikes.
              </p>
            </div>

            <div class="p-4 rounded-2xl bg-amber-50 dark:bg-slate-800/60 border border-amber-500/20 space-y-2">
              <h4 class="font-extrabold text-amber-800 dark:text-amber-300 text-sm">🚜 Harvest & Drying Advisory</h4>
              <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                Sunny 3-day window forecast between Monday and Wednesday. Ideal for sun-drying harvested Yellow Maize and Cocoa beans to reach target < 13% moisture level.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  `;
}
