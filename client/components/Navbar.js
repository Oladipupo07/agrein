// Sleek, Minimal Navbar Component for Agrein (Homepage, Sign In & Sign Up)

function renderNavbar(state, actions) {
  const { currentView, darkMode, mobileMenuOpen, currentUser } = state;
  const isHome = currentView === 'landing' || !currentView;
  const isLogin = currentView === 'login';
  const isRegister = currentView === 'register';

  const initialsFor = (name) => {
    if (!name) return '👤';
    const parts = name.trim().split(/\s+/);
    return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
  };

  return `
    <header class="sticky top-0 z-40 w-full shadow-sm border-b border-emerald-900/10 dark:border-white/10 transition-all duration-300">

      <!-- ============================================ -->
      <!-- MOBILE TOP BAR (< lg)                         -->
      <!-- ============================================ -->
      <div class="lg:hidden topbar h-16 glass-panel flex items-center justify-between px-4 safe-area-top">
        <button onclick="actions.goHome()" class="flex items-center space-x-2.5 text-left" aria-label="Home">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-amber-500 flex items-center justify-center text-white shadow-md flex-shrink-0">
            <i class="fa-solid fa-wheat-awn text-sm"></i>
          </div>
          <div>
            <div class="font-heading font-extrabold text-base text-emerald-950 dark:text-emerald-400 leading-none">Agrein</div>
            <div class="text-[10px] text-gray-500 dark:text-gray-400 font-medium tracking-wide">Direct Farm Trade</div>
          </div>
        </button>

        <div class="flex items-center space-x-2">
          <!-- Dark Mode Toggle -->
          <button onclick="actions.toggleDarkMode()" class="p-2 rounded-xl text-gray-600 dark:text-amber-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all" title="Toggle Theme" aria-label="Toggle Theme">
            <i class="fa-solid ${darkMode ? 'fa-sun text-amber-400' : 'fa-moon text-slate-700'} text-sm"></i>
          </button>

          <!-- Hamburger Toggle -->
          <button onclick="actions.toggleMobileMenu()" class="w-9 h-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-gray-200 flex items-center justify-center flex-shrink-0" aria-label="Menu">
            <i class="fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-base"></i>
          </button>
        </div>
      </div>

      <!-- ============================================ -->
      <!-- DESKTOP BAR (lg+)                            -->
      <!-- ============================================ -->
      <div class="hidden lg:block glass-panel">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">

          <!-- 1. Brand Logo -->
          <div class="flex items-center space-x-3 cursor-pointer flex-shrink-0" onclick="actions.goHome()">
            <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-emerald-700/30 transform hover:scale-105 transition-transform flex-shrink-0">
              <i class="fa-solid fa-wheat-awn text-xl"></i>
            </div>
            <div>
              <div class="flex items-center space-x-2">
                <span class="font-heading font-extrabold text-2xl tracking-tight text-emerald-950 dark:text-emerald-400">Agrein</span>
                <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-extrabold uppercase tracking-wider">Direct Trade</span>
              </div>
              <p class="text-[11px] text-gray-500 dark:text-gray-400 font-medium tracking-wide">Connecting Farmers to Buyers</p>
            </div>
          </div>

          <!-- 2. Centered Navigation Link -->
          <nav class="flex items-center space-x-2 bg-slate-100/80 dark:bg-slate-900/60 p-1.5 rounded-2xl border border-gray-200/60 dark:border-slate-800">
            <button onclick="actions.goHome()" class="px-5 py-2 rounded-xl text-xs font-bold transition-all ${isHome ? 'bg-white dark:bg-emerald-700 text-emerald-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-white'}">
              <i class="fa-solid fa-house mr-1.5 text-xs"></i> Home
            </button>
          </nav>

          <!-- 3. Right Utility & Auth Controls -->
          <div class="flex items-center space-x-3">

            <!-- Dark Mode Toggle -->
            <button onclick="actions.toggleDarkMode()" class="p-2.5 rounded-xl text-gray-600 dark:text-amber-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all" title="Toggle Theme" aria-label="Toggle Theme">
              <i class="fa-solid ${darkMode ? 'fa-sun text-amber-400' : 'fa-moon text-slate-700'} text-base"></i>
            </button>

            <!-- Divider -->
            <div class="h-6 w-px bg-gray-200 dark:bg-slate-800"></div>

            <!-- Auth Controls -->
            ${currentUser ? `
              <div class="flex items-center space-x-3">
                <div class="flex items-center space-x-2 pl-2 pr-3 py-1.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                  <span class="w-8 h-8 rounded-full bg-emerald-700 text-white text-xs font-extrabold flex items-center justify-center">${initialsFor(currentUser.full_name)}</span>
                  <div class="text-left">
                    <div class="text-xs font-bold text-slate-900 dark:text-white leading-tight capitalize">${currentUser.full_name || currentUser.email}</div>
                    <div class="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider">${currentUser.role || 'Member'}</div>
                  </div>
                </div>
                <button onclick="actions.logout()" class="px-3.5 py-2 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all flex items-center space-x-1.5">
                  <i class="fa-solid fa-arrow-right-from-bracket text-xs"></i>
                  <span>Log Out</span>
                </button>
              </div>
            ` : `
              <div class="flex items-center space-x-2">
                <button onclick="actions.openAuthModal('login')" class="px-4 py-2.5 rounded-xl text-xs font-bold ${isLogin ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300' : 'text-slate-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800'} transition-all flex items-center space-x-1.5">
                  <i class="fa-solid fa-right-to-bracket text-emerald-600 text-xs"></i>
                  <span>Log In</span>
                </button>
                <button onclick="actions.openAuthModal('register')" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 text-white font-extrabold text-xs shadow-md shadow-emerald-700/20 transition-all flex items-center space-x-1.5 transform hover:-translate-y-0.5">
                  <i class="fa-solid fa-user-plus text-amber-300 text-xs"></i>
                  <span>Sign Up</span>
                </button>
              </div>
            `}

          </div>
        </div>
      </div>
    </header>

    <!-- ============================================ -->
    <!-- MOBILE SLIDE-OVER DRAWER (< lg)              -->
    <!-- ============================================ -->
    ${mobileMenuOpen ? `
      <div class="lg:hidden fixed inset-0 z-50">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onclick="actions.toggleMobileMenu()"></div>

        <!-- Drawer Content -->
        <div class="fixed inset-y-0 right-0 w-full max-w-xs bg-white dark:bg-slate-900 shadow-2xl p-6 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-slate-800">
              <div class="flex items-center space-x-2">
                <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-amber-500 flex items-center justify-center text-white text-sm">
                  <i class="fa-solid fa-wheat-awn"></i>
                </div>
                <span class="font-heading font-extrabold text-lg text-emerald-950 dark:text-emerald-400">Agrein</span>
              </div>
              <button onclick="actions.toggleMobileMenu()" class="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800">
                <i class="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <!-- Links -->
            <div class="py-6 space-y-2">
              <button onclick="actions.goHome(); actions.toggleMobileMenu();" class="w-full text-left px-4 py-3 rounded-xl text-sm font-bold flex items-center space-x-3 ${isHome ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800'}">
                <i class="fa-solid fa-house text-emerald-600"></i>
                <span>Home</span>
              </button>
            </div>
          </div>

          <!-- Bottom Auth Action Buttons -->
          <div class="pt-4 border-t border-gray-100 dark:border-slate-800 space-y-3">
            ${currentUser ? `
              <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center space-x-3 mb-2">
                <span class="w-9 h-9 rounded-full bg-emerald-700 text-white text-xs font-extrabold flex items-center justify-center">${initialsFor(currentUser.full_name)}</span>
                <div class="min-w-0 flex-1">
                  <div class="text-xs font-bold text-slate-900 dark:text-white truncate">${currentUser.full_name || currentUser.email}</div>
                  <div class="text-[10px] text-gray-500 uppercase tracking-wider">${currentUser.role || 'Member'}</div>
                </div>
              </div>
              <button onclick="actions.logout(); actions.toggleMobileMenu();" class="w-full py-3 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 font-bold text-xs flex items-center justify-center space-x-2">
                <i class="fa-solid fa-arrow-right-from-bracket"></i>
                <span>Log Out</span>
              </button>
            ` : `
              <button onclick="actions.openAuthModal('login'); actions.toggleMobileMenu();" class="w-full py-3 rounded-xl border border-gray-300 dark:border-slate-700 text-slate-800 dark:text-white font-extrabold text-xs flex items-center justify-center space-x-2 hover:bg-gray-50 dark:hover:bg-slate-800">
                <i class="fa-solid fa-right-to-bracket text-emerald-600"></i>
                <span>Log In</span>
              </button>
              <button onclick="actions.openAuthModal('register'); actions.toggleMobileMenu();" class="w-full py-3 rounded-xl bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center space-x-2 shadow-lg hover:bg-emerald-800">
                <i class="fa-solid fa-user-plus text-amber-300"></i>
                <span>Create Account</span>
              </button>
            `}
          </div>
        </div>
      </div>
    ` : ''}
  `;
}