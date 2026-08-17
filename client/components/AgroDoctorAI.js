// AgroDoctor AI Agricultural Assistant Component for Agrein

function renderAgroDoctorAI(state, actions) {
  const { agroDoctorCrop, agroDoctorDiagnosis } = state;

  return `
    <div class="py-12 bg-slate-50/50 dark:bg-slate-900/50 min-h-screen space-y-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <!-- Header -->
        <div class="glass-card rounded-3xl p-6 sm:p-10 space-y-4 text-center max-w-3xl mx-auto border border-emerald-500/30">
          <div class="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <i class="fa-solid fa-stethoscope text-emerald-500"></i>
            <span>Computer Vision Crop Diagnostic Assistant</span>
          </div>

          <h1 class="text-3xl sm:text-5xl font-heading font-extrabold text-slate-900 dark:text-white">
            AgroDoctor <span class="text-gradient-emerald">AI Assistant</span>
          </h1>

          <p class="text-xs text-gray-500 max-w-xl mx-auto leading-relaxed">
            Upload leaf photos or select symptoms to diagnose crop diseases, identify pests (e.g. Fall Armyworm, Early Blight), and receive organic fertilizer recommendations.
          </p>

          <div class="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            <div>
              <label class="text-xs font-bold text-gray-500 block mb-1">Select Crop under Inspection:</label>
              <select onchange="actions.runAgroDoctorDiagnosis(this.value)" class="w-full px-4 py-3 rounded-2xl glass-panel text-xs font-bold text-slate-900 dark:text-white border border-emerald-500/20 focus:ring-2 focus:ring-emerald-500">
                <option value="Tomatoes" ${agroDoctorCrop === 'Tomatoes' ? 'selected' : ''}>Tomatoes (Roma / Greenhouse)</option>
                <option value="Maize" ${agroDoctorCrop === 'Maize' ? 'selected' : ''}>Yellow Maize (Corn)</option>
                <option value="Cassava" ${agroDoctorCrop === 'Cassava' ? 'selected' : ''}>Cassava (Root Tuber)</option>
              </select>
            </div>

            <div>
              <label class="text-xs font-bold text-gray-500 block mb-1">Upload Leaf Photo or Symptoms:</label>
              <button onclick="actions.triggerToast('Simulating camera / leaf photo upload scan...')" class="w-full py-3 px-4 rounded-2xl bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center justify-center space-x-2">
                <i class="fa-solid fa-camera"></i>
                <span>Scan Leaf / Upload Image</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Diagnostic Report Display Card -->
        ${agroDoctorDiagnosis ? `
          <div class="glass-card rounded-3xl p-6 sm:p-8 space-y-6 max-w-4xl mx-auto border border-emerald-500/20">
            <div class="flex items-center justify-between border-b border-gray-200 dark:border-slate-800 pb-4">
              <div>
                <div class="text-xs font-bold text-emerald-700 dark:text-emerald-400">Diagnostic Result</div>
                <h3 class="font-heading font-extrabold text-2xl text-slate-900 dark:text-white">${agroDoctorDiagnosis.disease}</h3>
              </div>
              <span class="px-3.5 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold">${agroDoctorDiagnosis.severity}</span>
            </div>

            <div class="space-y-4 text-xs">
              <div>
                <span class="font-bold text-gray-400 uppercase tracking-wider block mb-1">Matched Foliage Symptoms:</span>
                <div class="flex flex-wrap gap-2">
                  ${agroDoctorDiagnosis.symptoms_matched.map(s => `<span class="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-semibold text-slate-800 dark:text-gray-200">✓ ${s}</span>`).join('')}
                </div>
              </div>

              <div class="p-4 rounded-2xl bg-emerald-50 dark:bg-slate-800/60 border border-emerald-500/20 space-y-1">
                <span class="font-extrabold text-emerald-800 dark:text-emerald-300 text-sm">💊 Prescribed Remedy & Spray Protocol:</span>
                <p class="text-gray-700 dark:text-gray-200 leading-relaxed font-medium">${agroDoctorDiagnosis.treatment}</p>
              </div>

              <div class="p-4 rounded-2xl bg-amber-50 dark:bg-slate-800/60 border border-amber-500/20 space-y-1">
                <span class="font-extrabold text-amber-800 dark:text-amber-300 text-sm">🛡️ Preventative Agronomic Recommendation:</span>
                <p class="text-gray-700 dark:text-gray-200 leading-relaxed font-medium">${agroDoctorDiagnosis.preventative}</p>
              </div>
            </div>
          </div>
        ` : ''}

      </div>
    </div>
  `;
}
