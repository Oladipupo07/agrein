// AI Crop Price Forecasting Tool Component for Agrein

function renderAIPredictor(state, actions) {
  const { aiSelectedCrop, aiSelectedState, aiForecastResult } = state;

  return `
    <div class="py-12 bg-slate-50/50 dark:bg-slate-900/50 min-h-screen space-y-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <!-- Header Banner -->
        <div class="glass-card rounded-3xl p-6 sm:p-10 space-y-4 text-center max-w-3xl mx-auto">
          <div class="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold uppercase tracking-wider">
            <i class="fa-solid fa-wand-magic-sparkles text-amber-500"></i>
            <span>Machine Learning Commodity Engine</span>
          </div>

          <h1 class="text-3xl sm:text-5xl font-heading font-extrabold text-slate-900 dark:text-white">
            AI Agricultural <span class="text-gradient-emerald">Price Predictor</span>
          </h1>

          <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            Agrein's proprietary AI analyzes satellite rainfall data, diesel transport index, and seasonal harvest arrival patterns to forecast crop price trajectories across 36 states.
          </p>

          <!-- Interactive Selection Inputs -->
          <div class="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            <div>
              <label class="text-xs font-bold text-gray-500 block mb-1">Select Crop Produce:</label>
              <select onchange="actions.runAIForecast(this.value, '${aiSelectedState}')" class="w-full px-4 py-3 rounded-2xl glass-panel text-xs font-bold text-slate-900 dark:text-white border border-emerald-500/20 focus:ring-2 focus:ring-emerald-500">
                ${['Yellow Maize', 'Benue Yam', 'Roma Tomatoes', 'Cocoa Beans', 'Cassava Starch', 'Sesame Seeds'].map(c => `
                  <option value="${c}" ${aiSelectedCrop === c ? 'selected' : ''}>${c}</option>
                `).join('')}
              </select>
            </div>

            <div>
              <label class="text-xs font-bold text-gray-500 block mb-1">Select Target Market State:</label>
              <select onchange="actions.runAIForecast('${aiSelectedCrop}', this.value)" class="w-full px-4 py-3 rounded-2xl glass-panel text-xs font-bold text-slate-900 dark:text-white border border-emerald-500/20 focus:ring-2 focus:ring-emerald-500">
                ${['Kaduna', 'Benue', 'Plateau', 'Ondo', 'Oyo', 'Jigawa', 'Kano', 'Lagos'].map(s => `
                  <option value="${s}" ${aiSelectedState === s ? 'selected' : ''}>${s} State</option>
                `).join('')}
              </select>
            </div>
          </div>

        </div>

        <!-- AI Forecast Results Display Card -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <!-- Forecast Chart & Recommendation -->
          <div class="lg:col-span-8 glass-card rounded-3xl p-6 sm:p-8 space-y-6">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-xs font-bold text-emerald-700 dark:text-emerald-400">Forecast Analysis</div>
                <h3 class="font-heading font-extrabold text-2xl text-slate-900 dark:text-white">
                  ${aiForecastResult.crop} Price Projection in ${aiForecastResult.state}
                </h3>
              </div>
              <span class="px-3 py-1 rounded-xl bg-emerald-100 dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                Confidence: ${aiForecastResult.confidence_score}
              </span>
            </div>

            <!-- Price Trend Line / Bar Chart -->
            <div class="h-64 flex items-end justify-between space-x-3 pt-8 pb-4 border-b border-gray-200 dark:border-slate-800">
              ${aiForecastResult.historical_months.map(m => `
                <div class="flex-1 flex flex-col items-center space-y-2 group">
                  <div class="text-[10px] font-bold text-gray-500">₦${m.price}</div>
                  <div class="w-full rounded-t-xl transition-all duration-500 ${m.month.includes('Forecast') ? 'bg-gradient-to-t from-amber-500 to-amber-300 shadow-md shadow-amber-500/20' : 'bg-emerald-600'}" style="height: ${(m.price / 3500) * 100}%;"></div>
                  <span class="text-[10px] font-bold ${m.month.includes('Forecast') ? 'text-amber-600' : 'text-gray-500'}">${m.month}</span>
                </div>
              `).join('')}
            </div>

            <!-- AI Strategy Advisory -->
            <div class="p-5 rounded-2xl bg-amber-50 dark:bg-slate-800/60 border border-amber-500/20 flex items-start space-x-4">
              <div class="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center text-xl flex-shrink-0">
                <i class="fa-solid fa-lightbulb"></i>
              </div>
              <div class="space-y-1">
                <div class="text-xs font-extrabold text-amber-800 dark:text-amber-300 uppercase tracking-wider">Strategic Recommendation</div>
                <p class="text-xs text-slate-800 dark:text-gray-200 font-medium leading-relaxed">
                  ${aiForecastResult.ai_recommendation}
                </p>
              </div>
            </div>

          </div>

          <!-- Commodity Factors & Live Indicators -->
          <div class="lg:col-span-4 glass-card rounded-3xl p-6 sm:p-8 space-y-6">
            <h3 class="font-heading font-extrabold text-lg text-slate-900 dark:text-white">Underlying AI Variables</h3>
            
            <div class="space-y-3 text-xs">
              <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
                <span class="text-gray-500">Regional Rainfall Index:</span>
                <span class="font-bold text-emerald-600">Optimal (+12%)</span>
              </div>
              <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
                <span class="text-gray-500">Interstate Fuel Cost Index:</span>
                <span class="font-bold text-amber-600">High (Impacts Freight)</span>
              </div>
              <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
                <span class="text-gray-500">B2B Processing Demand:</span>
                <span class="font-bold text-emerald-600">Surging (Poultry/Cereal)</span>
              </div>
              <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
                <span class="text-gray-500">ColdChain Freight Rate:</span>
                <span class="font-bold text-slate-900 dark:text-white">₦42 / ton / km</span>
              </div>
            </div>

            <button onclick="actions.openAddProductModal()" class="w-full py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-lg shadow-emerald-700/20 transition-all text-center">
              List Produce at Suggested Price
            </button>
          </div>

        </div>

      </div>
    </div>
  `;
}
