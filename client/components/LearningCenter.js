// Agri-Learning Center Component for Agrein

function renderLearningCenter(state, actions) {
  const { learningResources } = state.mockData;

  return `
    <div class="py-12 bg-slate-50/50 dark:bg-slate-900/50 min-h-screen space-y-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <!-- Header -->
        <div class="glass-card rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div class="inline-flex items-center space-x-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1">
              <i class="fa-solid fa-graduation-cap"></i>
              <span>Agrein Farmer Academy & Extension Services</span>
            </div>
            <h1 class="text-3xl font-heading font-extrabold text-slate-900 dark:text-white">
              Agri-Learning & Resource Center
            </h1>
            <p class="text-xs text-gray-500">Access agronomic guides, pest management protocols, soil fertilization webinars, and certified export standards.</p>
          </div>

          <div class="flex items-center space-x-2">
            <span class="px-3.5 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold">Progress: 4/12 Courses Completed</span>
          </div>
        </div>

        <!-- Learning Modules Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          ${learningResources.map(res => `
            <div class="glass-card rounded-3xl overflow-hidden group flex flex-col justify-between">
              <div class="relative h-44 overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img src="${res.image}" alt="${res.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                <span class="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-amber-300 text-[10px] font-extrabold uppercase">
                  ${res.category}
                </span>
              </div>

              <div class="p-6 space-y-3 flex-grow flex flex-col justify-between">
                <div class="space-y-1">
                  <div class="text-[11px] text-gray-400 font-semibold">${res.format} • ${res.duration}</div>
                  <h3 class="font-heading font-extrabold text-base text-slate-900 dark:text-white">${res.title}</h3>
                  <p class="text-xs text-gray-500 line-clamp-2">${res.desc}</p>
                </div>

                <button onclick="actions.triggerToast('Opening PDF guide / video tutorial: ${res.title}')" class="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-md transition-all text-center flex items-center justify-center space-x-2">
                  <i class="fa-solid fa-circle-play text-amber-300"></i>
                  <span>Start Module</span>
                </button>
              </div>
            </div>
          `).join('')}
        </div>

      </div>
    </div>
  `;
}
