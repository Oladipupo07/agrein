// Farm-to-Table Traceability & QR Code Provenance Component for Agrein

function renderTraceabilityView(state, actions) {
  const { traceabilityBatches } = state.mockData;
  const batch = traceabilityBatches[0]; // Display first batch as example

  return `
    <div class="py-12 bg-slate-50/50 dark:bg-slate-900/50 min-h-screen space-y-8">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        <!-- Header -->
        <div class="glass-card rounded-3xl p-6 sm:p-10 text-center space-y-4 border border-emerald-500/30">
          <div class="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <i class="fa-solid fa-qrcode text-emerald-500"></i>
            <span>Farm-to-Table Traceability</span>
          </div>
          <h1 class="text-3xl sm:text-5xl font-heading font-extrabold text-slate-900 dark:text-white">
            Product <span class="text-gradient-emerald">Provenance</span>
          </h1>
          <p class="text-sm text-gray-500 max-w-xl mx-auto leading-relaxed">
            Scan QR codes on Agrein products to trace the complete journey from seed planting to your doorstep. Full transparency, zero fraud.
          </p>
        </div>

        <!-- Batch Card -->
        <div class="glass-card rounded-3xl overflow-hidden border border-emerald-500/20">
          <!-- Batch Header -->
          <div class="bg-gradient-to-r from-emerald-700 via-emerald-600 to-amber-600 p-6 sm:p-8">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p class="text-emerald-100 text-xs font-bold uppercase tracking-wider mb-1">Batch ID</p>
                <h2 class="text-xl sm:text-2xl font-heading font-extrabold text-white">${batch.id}</h2>
                <p class="text-emerald-100 text-sm mt-1">${batch.product} — ${batch.weight}</p>
              </div>
              <div class="flex items-center space-x-4">
                <!-- Simulated QR Code -->
                <div class="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-2xl p-2 shadow-lg flex items-center justify-center">
                  <div class="w-full h-full rounded-lg bg-gradient-to-br from-slate-900 via-slate-700 to-slate-900 flex items-center justify-center">
                    <i class="fa-solid fa-qrcode text-white text-3xl sm:text-4xl"></i>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-xs text-emerald-100">Grade</p>
                  <p class="text-2xl font-heading font-extrabold text-amber-300">${batch.qualityGrade}</p>
                  <p class="text-xs text-emerald-100 mt-1">Moisture: ${batch.moistureContent}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Batch Metadata -->
          <div class="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-b border-gray-100 dark:border-slate-800">
            <div>
              <p class="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Farm</p>
              <p class="text-sm font-bold text-slate-900 dark:text-white">${batch.farm}</p>
            </div>
            <div>
              <p class="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Farmer</p>
              <p class="text-sm font-bold text-slate-900 dark:text-white">${batch.farmer}</p>
            </div>
            <div>
              <p class="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Origin</p>
              <p class="text-sm font-bold text-slate-900 dark:text-white">${batch.origin}</p>
            </div>
            <div>
              <p class="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Harvest Date</p>
              <p class="text-sm font-bold text-slate-900 dark:text-white">${batch.harvestDate}</p>
            </div>
          </div>

          <!-- Journey Timeline -->
          <div class="p-6 sm:p-8">
            <h3 class="text-lg font-heading font-extrabold text-slate-900 dark:text-white mb-6">
              <i class="fa-solid fa-route text-emerald-500 mr-2"></i> Provenance Journey
            </h3>

            <div class="relative">
              <!-- Vertical line -->
              <div class="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 via-emerald-400 to-gray-200 dark:to-slate-700"></div>

              <div class="space-y-6">
                ${batch.journey.map((step, idx) => `
                  <div class="relative flex items-start space-x-4 pl-2">
                    <!-- Node -->
                    <div class="relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${step.completed 
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
                      : 'bg-gray-200 dark:bg-slate-700 text-gray-400 dark:text-slate-500'}">
                      <i class="fa-solid ${step.icon} text-xs"></i>
                    </div>
                    <!-- Content -->
                    <div class="flex-1 pb-2">
                      <div class="flex items-center gap-2 flex-wrap">
                        <h4 class="text-sm font-bold ${step.completed ? 'text-slate-900 dark:text-white' : 'text-gray-400 dark:text-slate-500'}">${step.step}</h4>
                        ${step.completed ? '<span class="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">✓ Verified</span>' : '<span class="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-[10px] font-bold">Pending</span>'}
                      </div>
                      <p class="text-xs text-gray-500 mt-0.5">${step.date} — ${step.location}</p>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>

        <!-- Scan CTA -->
        <div class="glass-card rounded-3xl p-8 text-center space-y-4 border border-amber-500/20">
          <i class="fa-solid fa-camera text-4xl text-amber-500"></i>
          <h3 class="text-xl font-heading font-extrabold text-slate-900 dark:text-white">Scan Product QR Code</h3>
          <p class="text-sm text-gray-500 max-w-md mx-auto">Every Agrein-certified product carries a unique QR code. Scan it to instantly view the full provenance journey from farm to your table.</p>
          <button onclick="actions.triggerToast('📷 QR Scanner activated — point your camera at any Agrein product label.')" class="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-amber-500 text-white text-sm font-bold shadow-lg shadow-emerald-700/30 hover:shadow-xl hover:scale-105 transition-all">
            <i class="fa-solid fa-qrcode mr-2"></i> Open QR Scanner
          </button>
        </div>

      </div>
    </div>
  `;
}
