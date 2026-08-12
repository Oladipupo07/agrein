// Modern & Sleek Navbar Component for Agrein

function renderNavbar(state, actions) {
  const { currentView, activeRole, cart, wishlist, darkMode, mobileMenuOpen, currentUser, navbarMenuOpen } = state;
  const cartCount = cart.reduce((acc, item) => acc + item.cartQty, 0);

  const roleLabels = {
    visitor: { label: 'Visitor', icon: 'fa-eye', color: 'text-emerald-500' },
    buyer: { label: 'Buyer', icon: 'fa-basket-shopping', color: 'text-blue-500' },
    farmer: { label: 'Farmer', icon: 'fa-tractor', color: 'text-amber-500' },
    admin: { label: 'Admin', icon: 'fa-shield-halved', color: 'text-purple-500' }
  };

  const currentRoleInfo = roleLabels[activeRole] || roleLabels.visitor;

  // Helpers used both by the desktop avatar dropdown and the mobile drawer
  const initialsFor = (name) => {
    if (!name) return '👤';
    const parts = name.trim().split(/\s+/);
    return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
  };
  const roleDefaultView = (role) => {
    if (!role) return 'landing';
    if (role === 'BUYER') return 'buyer-dashboard';
    if (role === 'ADMIN') return 'admin-verification';
    if (role === 'FARMER') return currentUser && currentUser.verification_status === 'APPROVED' ? 'farmer-dashboard' : 'farmer-verification';
    return 'landing';
  };
  const roleAccent = (role) => {
    if (role === 'BUYER') return { pill: 'bg-blue-600', avatar: 'bg-blue-600' };
    if (role === 'FARMER') return { pill: 'bg-amber-600', avatar: 'bg-amber-600' };
    if (role === 'ADMIN') return { pill: 'bg-purple-600', avatar: 'bg-purple-600' };
    return { pill: 'bg-emerald-600', avatar: 'bg-emerald-600' };
  };

  return `
    <header class="sticky top-0 z-40 w-full glass-panel shadow-sm border-b border-emerald-900/10 dark:border-white/10 transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">

        <!-- 1. Brand Logo -->
        <div class="flex items-center space-x-2 sm:space-x-3 cursor-pointer flex-shrink-0 min-w-0" onclick="actions.setView('landing')">
          <div class="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-emerald-700/30 transform hover:scale-105 transition-transform flex-shrink-0">
            <i class="fa-solid fa-wheat-awn text-base sm:text-xl"></i>
          </div>
          <div class="min-w-0">
            <div class="flex items-center space-x-1.5">
              <span class="font-heading font-extrabold text-lg sm:text-2xl tracking-tight text-emerald-950 dark:text-emerald-400 truncate">Agrein</span>
              <span class="hidden sm:inline text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-extrabold uppercase tracking-wider">Market</span>
            </div>
            <p class="hidden sm:block text-[10px] text-gray-500 dark:text-gray-400 font-medium tracking-wide">Direct Farm Trade</p>
          </div>
        </div>

        <!-- Mobile Hamburger Button (only < lg) -->
        <button onclick="actions.toggleMobileMenu()" class="lg:hidden p-2 rounded-xl text-slate-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all flex-shrink-0" aria-label="Open menu">
          <i class="fa-solid fa-bars text-base"></i>
        </button>

        <!-- 2. Centered Navigation Links -->
        <nav class="hidden lg:flex items-center space-x-1 bg-slate-100/80 dark:bg-slate-900/60 p-1.5 rounded-2xl border border-gray-200/60 dark:border-slate-800">
          <button onclick="actions.setView('landing')" class="px-4 py-2 rounded-xl text-xs font-bold transition-all ${currentView === 'landing' ? 'bg-white dark:bg-emerald-700 text-emerald-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-white'}">
            Home
          </button>
          <button onclick="actions.setView('marketplace')" class="px-4 py-2 rounded-xl text-xs font-bold transition-all ${currentView === 'marketplace' ? 'bg-white dark:bg-emerald-700 text-emerald-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-white'}">
            Marketplace
          </button>

          ${activeRole === 'farmer' ? `
            <button onclick="actions.guardView('farmer-dashboard')" class="px-4 py-2 rounded-xl text-xs font-bold transition-all ${currentView === 'farmer-dashboard' ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold' : 'text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30'}">
              <i class="fa-solid fa-tractor mr-1"></i> Farmer Dashboard
            </button>
            <button onclick="actions.guardView('farmer-verification')" class="px-4 py-2 rounded-xl text-xs font-bold transition-all ${currentView === 'farmer-verification' ? 'bg-emerald-700 text-white shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:text-emerald-700'}">
              <i class="fa-solid fa-shield-halved text-emerald-500 mr-1"></i> Farm Verification
            </button>
          ` : ''}

          ${activeRole === 'buyer' ? `
            <button onclick="actions.guardView('buyer-dashboard')" class="px-4 py-2 rounded-xl text-xs font-bold transition-all ${currentView === 'buyer-dashboard' ? 'bg-blue-600 text-white shadow-md font-extrabold' : 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30'}">
              <i class="fa-solid fa-basket-shopping mr-1"></i> Buyer Dashboard
            </button>
          ` : ''}

          ${activeRole === 'admin' ? `
            <button onclick="actions.guardView('admin-dashboard')" class="px-4 py-2 rounded-xl text-xs font-bold transition-all ${currentView === 'admin-dashboard' ? 'bg-purple-600 text-white shadow-md font-extrabold' : 'text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30'}">
              <i class="fa-solid fa-shield-halved mr-1"></i> Admin Dashboard
            </button>
            <button onclick="actions.guardView('admin-verification')" class="px-4 py-2 rounded-xl text-xs font-bold transition-all ${currentView === 'admin-verification' ? 'bg-purple-700 text-white shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:text-purple-600'}">
              <i class="fa-solid fa-user-check mr-1"></i> Verify Queue
            </button>
          ` : ''}

          <button onclick="actions.setView('ai-insights')" class="px-4 py-2 rounded-xl text-xs font-bold transition-all ${currentView === 'ai-insights' ? 'bg-white dark:bg-emerald-700 text-emerald-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-white'}">
            <i class="fa-solid fa-wand-magic-sparkles text-amber-500 mr-1"></i> AI Forecast
          </button>
          <button onclick="actions.setView('nearby-farms')" class="px-4 py-2 rounded-xl text-xs font-bold transition-all ${currentView === 'nearby-farms' ? 'bg-white dark:bg-emerald-700 text-emerald-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-white'}">
            <i class="fa-solid fa-location-dot text-emerald-500 mr-1"></i> Farm Finder
          </button>
        </nav>

        <!-- 3. Right Action Cluster -->
        <div class="flex items-center space-x-2 lg:space-x-3">

          <!-- Cart Drawer Button (always visible; label only on sm+) -->
          <button onclick="actions.toggleCartDrawer()" class="relative p-2 lg:p-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white shadow-md shadow-emerald-700/20 transition-all flex items-center space-x-2 flex-shrink-0">
            <i class="fa-solid fa-cart-shopping text-sm"></i>
            <span class="text-xs font-bold hidden sm:inline">Cart</span>
            ${cartCount > 0 ? `<span class="w-5 h-5 bg-amber-400 text-emerald-950 rounded-full text-[10px] font-extrabold flex items-center justify-center">${cartCount}</span>` : ''}
          </button>

          <!-- Wishlist Badge (desktop only — mobile lives in drawer) -->
          <button onclick="actions.triggerToast('Saved items wishlist opened')" class="relative p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all hidden lg:inline-flex" title="Wishlist">
            <i class="fa-regular fa-heart text-base"></i>
            ${wishlist.length > 0 ? `<span class="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center shadow">${wishlist.length}</span>` : ''}
          </button>

          <!-- Dark Mode Toggle (desktop only — mobile lives in drawer) -->
          <button onclick="actions.toggleDarkMode()" class="p-2.5 rounded-xl text-gray-600 dark:text-amber-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all hidden lg:inline-flex" title="Toggle Theme">
            <i class="fa-solid ${darkMode ? 'fa-sun text-amber-400' : 'fa-moon text-slate-700'} text-base"></i>
          </button>

          <!-- Divider (desktop only) -->
          <div class="h-6 w-px bg-gray-200 dark:bg-slate-800 hidden lg:block"></div>

          <!-- Auth Cluster: Logged-in avatar menu vs Logged-out CTAs (desktop only — mobile lives in drawer) -->
          ${currentUser ? `
            <div class="relative hidden lg:block">
              <button onclick="actions.toggleNavbarMenu()" class="flex items-center space-x-2 pl-1.5 pr-2 py-1.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all">
                <span class="w-7 h-7 rounded-full ${roleAccent(currentUser.role).avatar} text-white text-xs font-extrabold flex items-center justify-center">${initialsFor(currentUser.full_name)}</span>
                <span class="hidden xl:inline text-xs font-bold text-slate-700 dark:text-gray-200 capitalize">${currentUser.full_name || currentUser.email}</span>
                <i class="fa-solid fa-chevron-down text-[9px] opacity-60"></i>
              </button>
              ${navbarMenuOpen ? `
                <div class="absolute right-0 mt-2 w-56 py-2 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-800 z-50 animate-modal">
                  <div class="px-4 py-2 border-b border-gray-100 dark:border-slate-800">
                    <div class="text-xs font-extrabold text-slate-900 dark:text-white truncate">${currentUser.full_name || currentUser.email}</div>
                    <div class="text-[10px] text-gray-500 truncate">${currentUser.email}</div>
                    <div class="mt-1 inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${roleAccent(currentUser.role).pill} text-white">
                      <i class="fa-solid ${currentRoleInfo.icon}"></i>
                      <span>${(currentUser.role || 'USER').toUpperCase()}</span>
                    </div>
                  </div>
                  <button onclick="actions.guardView('${roleDefaultView(currentUser.role)}'); actions.closeNavbarMenu();" class="w-full text-left px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-slate-800 flex items-center space-x-2">
                    <i class="fa-solid ${currentRoleInfo.icon} ${currentRoleInfo.color}"></i>
                    <span>My Portal</span>
                  </button>
                  <button onclick="actions.openChangePasswordModal()" class="w-full text-left px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-slate-800 flex items-center space-x-2">
                    <i class="fa-solid fa-lock text-emerald-600"></i>
                    <span>Change Password</span>
                  </button>
                  <div class="border-t border-gray-100 dark:border-slate-800 my-1"></div>
                  <button onclick="actions.logout()" class="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center space-x-2">
                    <i class="fa-solid fa-right-from-bracket"></i>
                    <span>Log Out</span>
                  </button>
                </div>
              ` : ''}
            </div>
          ` : `
            <div class="hidden lg:flex items-center space-x-1.5">
              <button onclick="actions.openAuthModal('login')" class="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all flex items-center space-x-1">
                <i class="fa-solid fa-right-to-bracket text-emerald-600 text-xs"></i>
                <span>Log In</span>
              </button>
              <button onclick="actions.openAuthModal('register')" class="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 text-white font-extrabold text-xs shadow-md shadow-emerald-700/20 transition-all flex items-center space-x-1.5 transform hover:-translate-y-0.5">
                <i class="fa-solid fa-user-plus text-amber-300 text-xs"></i>
                <span>Sign Up</span>
              </button>
            </div>
          `}

        </div>
      </div>
    </header>

    <!-- ============================================ -->
    <!-- MOBILE SLIDE-OVER DRAWER (visible only < lg) -->
    <!-- ============================================ -->
    ${mobileMenuOpen ? `
    <div class="lg:hidden fixed inset-0 z-50">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-slate-950/60 backdrop-blur-sm animate-fade-in" onclick="actions.closeMobileMenu()"></div>

      <!-- Drawer Panel -->
      <div class="relative w-full max-w-xs h-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col overflow-y-auto animate-drawer safe-area-top">

        <!-- Drawer Header -->
        <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-800">
          <div class="flex items-center space-x-2.5 min-w-0" onclick="actions.setViewAndCloseMobile('landing')">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-amber-500 flex items-center justify-center text-white shadow-md flex-shrink-0">
              <i class="fa-solid fa-wheat-awn text-base"></i>
            </div>
            <div class="min-w-0">
              <div class="font-heading font-extrabold text-lg text-emerald-950 dark:text-emerald-400 truncate">Agrein</div>
              <div class="text-[10px] text-gray-500 dark:text-gray-400 truncate">Direct Farm Trade</div>
            </div>
          </div>
          <button onclick="actions.closeMobileMenu()" class="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-gray-200 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-all" aria-label="Close menu">
            <i class="fa-solid fa-xmark text-base"></i>
          </button>
        </div>

        ${currentUser ? `
          <!-- Logged-in user identity card -->
          <div class="p-4 border-b border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <div class="flex items-center space-x-3">
              <span class="w-10 h-10 rounded-full ${roleAccent(currentUser.role).avatar} text-white text-sm font-extrabold flex items-center justify-center">${initialsFor(currentUser.full_name)}</span>
              <div class="flex-1 min-w-0">
                <div class="text-sm font-extrabold text-slate-900 dark:text-white truncate">${currentUser.full_name || currentUser.email}</div>
                <div class="text-[11px] text-gray-500 truncate">${currentUser.email}</div>
              </div>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${roleAccent(currentUser.role).pill} text-white">${(currentUser.role || 'USER').toUpperCase()}</span>
            </div>
          </div>
        ` : ''}

        <!-- Quick Actions: Cart, Wishlist, Theme -->
        <div class="grid grid-cols-3 gap-2 p-4 border-b border-gray-200 dark:border-slate-800">
          <button onclick="actions.closeMobileMenu(); setTimeout(() => actions.toggleCartDrawer(), 50);" class="relative flex flex-col items-center justify-center py-3 px-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-950/50 transition-all">
            <i class="fa-solid fa-cart-shopping text-base mb-1"></i>
            <span class="text-[10px] font-bold">Cart</span>
            ${cartCount > 0 ? `<span class="absolute top-1.5 right-2 w-4 h-4 bg-amber-400 text-emerald-950 rounded-full text-[9px] font-extrabold flex items-center justify-center">${cartCount}</span>` : ''}
          </button>
          <button onclick="actions.triggerToast('Saved items wishlist opened'); actions.closeMobileMenu();" class="relative flex flex-col items-center justify-center py-3 px-2 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-950/50 transition-all">
            <i class="fa-regular fa-heart text-base mb-1"></i>
            <span class="text-[10px] font-bold">Wishlist</span>
            ${wishlist.length > 0 ? `<span class="absolute top-1.5 right-2 w-4 h-4 bg-amber-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">${wishlist.length}</span>` : ''}
          </button>
          <button onclick="actions.toggleDarkMode()" class="flex flex-col items-center justify-center py-3 px-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-950/50 transition-all">
            <i class="fa-solid ${darkMode ? 'fa-sun' : 'fa-moon'} text-base mb-1"></i>
            <span class="text-[10px] font-bold">${darkMode ? 'Light' : 'Dark'}</span>
          </button>
        </div>

        <!-- Navigation Links -->
        <nav class="flex-1 overflow-y-auto p-3 space-y-1">
          <button onclick="actions.setViewAndCloseMobile('landing')" class="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center space-x-3 ${currentView === 'landing' ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-300' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800'}">
            <i class="fa-solid fa-house w-4 text-emerald-500"></i>
            <span>Home</span>
          </button>
          <button onclick="actions.setViewAndCloseMobile('marketplace')" class="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center space-x-3 ${currentView === 'marketplace' ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-300' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800'}">
            <i class="fa-solid fa-store w-4 text-emerald-500"></i>
            <span>Marketplace</span>
          </button>

          ${activeRole === 'farmer' ? `
            <button onclick="actions.guardViewAndCloseMobile('farmer-dashboard')" class="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center space-x-3 ${currentView === 'farmer-dashboard' ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800'}">
              <i class="fa-solid fa-tractor w-4 text-amber-500"></i>
              <span>Farmer Dashboard</span>
            </button>
            <button onclick="actions.guardViewAndCloseMobile('farmer-verification')" class="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center space-x-3 ${currentView === 'farmer-verification' ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-300' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800'}">
              <i class="fa-solid fa-shield-halved w-4 text-emerald-500"></i>
              <span>Farm Verification</span>
            </button>
          ` : ''}

          ${activeRole === 'buyer' ? `
            <button onclick="actions.guardViewAndCloseMobile('buyer-dashboard')" class="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center space-x-3 ${currentView === 'buyer-dashboard' ? 'bg-blue-100 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800'}">
              <i class="fa-solid fa-basket-shopping w-4 text-blue-500"></i>
              <span>Buyer Dashboard</span>
            </button>
          ` : ''}

          ${activeRole === 'admin' ? `
            <button onclick="actions.guardViewAndCloseMobile('admin-dashboard')" class="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center space-x-3 ${currentView === 'admin-dashboard' ? 'bg-purple-100 dark:bg-purple-950/50 text-purple-800 dark:text-purple-300' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800'}">
              <i class="fa-solid fa-shield-halved w-4 text-purple-500"></i>
              <span>Admin Dashboard</span>
            </button>
            <button onclick="actions.guardViewAndCloseMobile('admin-verification')" class="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center space-x-3 ${currentView === 'admin-verification' ? 'bg-purple-100 dark:bg-purple-950/50 text-purple-800 dark:text-purple-300' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800'}">
              <i class="fa-solid fa-user-check w-4 text-purple-500"></i>
              <span>Verify Queue</span>
            </button>
          ` : ''}

          <button onclick="actions.setViewAndCloseMobile('ai-insights')" class="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center space-x-3 ${currentView === 'ai-insights' ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-300' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800'}">
            <i class="fa-solid fa-wand-magic-sparkles w-4 text-amber-500"></i>
            <span>AI Forecast</span>
          </button>
          <button onclick="actions.setViewAndCloseMobile('nearby-farms')" class="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center space-x-3 ${currentView === 'nearby-farms' ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-300' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800'}">
            <i class="fa-solid fa-location-dot w-4 text-emerald-500"></i>
            <span>Farm Finder</span>
          </button>
        </nav>

        <!-- Account / Auth footer -->
        <div class="p-3 border-t border-gray-200 dark:border-slate-800 safe-area-bottom">
          ${currentUser ? `
            <div class="grid grid-cols-1 gap-2">
              <button onclick="actions.guardViewAndCloseMobile('${roleDefaultView(currentUser.role)}')" class="px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-gray-200 border border-gray-300 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all flex items-center justify-center space-x-1.5">
                <i class="fa-solid ${currentRoleInfo.icon} ${currentRoleInfo.color}"></i>
                <span>My Portal</span>
              </button>
              <button onclick="actions.closeMobileMenu(); setTimeout(() => actions.openChangePasswordModal(), 100);" class="px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-gray-200 border border-gray-300 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all flex items-center justify-center space-x-1.5">
                <i class="fa-solid fa-lock text-emerald-600"></i>
                <span>Change Password</span>
              </button>
              <button onclick="actions.logout()" class="px-3 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5">
                <i class="fa-solid fa-right-from-bracket"></i>
                <span>Log Out</span>
              </button>
            </div>
          ` : `
            <div class="grid grid-cols-2 gap-2">
              <button onclick="actions.closeMobileMenu(); setTimeout(() => actions.openAuthModal('login'), 100);" class="px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-gray-200 border border-gray-300 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all flex items-center justify-center space-x-1.5">
                <i class="fa-solid fa-right-to-bracket text-emerald-600 text-xs"></i>
                <span>Log In</span>
              </button>
              <button onclick="actions.closeMobileMenu(); setTimeout(() => actions.openAuthModal('register'), 100);" class="px-3 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5">
                <i class="fa-solid fa-user-plus text-amber-300 text-xs"></i>
                <span>Sign Up</span>
              </button>
            </div>
          `}
        </div>

      </div>
    </div>
    ` : ''}
  `;
}