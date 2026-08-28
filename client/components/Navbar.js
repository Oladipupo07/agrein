// Modern & Sleek Navbar Component for Agrein

function renderNavbar(state, actions) {
  const { currentView, activeRole, cart, wishlist, darkMode, mobileMenuOpen, currentUser, navbarMenuOpen, bottomNavHidden, sellSheetOpen } = state;
  const cartCount = cart.reduce((acc, item) => acc + item.cartQty, 0);

  // Human-readable page title for the mobile top bar
  const viewTitle = (v) => ({
    landing: 'Home',
    marketplace: 'Marketplace',
    'farmer-dashboard': 'Farmer Dashboard',
    'farmer-verification': 'Farm Verification',
    'buyer-dashboard': 'Buyer Dashboard',
    'buyer-onboarding': 'Buyer Setup',
    'admin-dashboard': 'Admin',
    'admin-verification': 'Verify Queue',
    'ai-insights': 'AI Forecast',
    'nearby-farms': 'Farm Finder',
    'rfq-board': 'RFQ Board',
    'commodity-index': 'Price Index',
    'agro-doctor': 'AI Crop Doctor',
    weather: 'Weather',
    cooperatives: 'Cooperatives',
    forum: 'Community Forum',
    wallet: 'Wallet',
    logistics: 'Logistics',
    'export-trade': 'Export Trade',
    'bulk-b2b': 'B2B Bulk',
    traceability: 'Traceability',
    'account-settings': 'Settings'
  })[v] || 'Agrein';

  // Drawer link tile: icon chip + label + 1-line description + active dot
  const navItem = ({ icon, iconColor, label, desc, onclick, active }) => `
    <button onclick="${onclick}" class="w-full text-left p-2.5 rounded-xl flex items-start gap-3 transition-all ${active ? 'bg-emerald-50 dark:bg-emerald-950/40' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}">
      <span class="w-9 h-9 rounded-lg ${iconColor} flex items-center justify-center flex-shrink-0">
        <i class="fa-solid ${icon} text-sm"></i>
      </span>
      <div class="min-w-0 flex-1">
        <div class="text-sm font-extrabold ${active ? 'text-emerald-900 dark:text-emerald-300' : 'text-slate-900 dark:text-white'}">${label}</div>
        <div class="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">${desc}</div>
      </div>
      ${active ? '<i class="fa-solid fa-circle text-[6px] text-emerald-500 mt-2.5 ml-auto"></i>' : ''}
    </button>
  `;

  const sectionHeader = (label) => `
    <div class="px-3 pt-3 pb-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">${label}</div>
  `;

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
    <header class="sticky top-0 z-40 w-full shadow-sm border-b border-emerald-900/10 dark:border-white/10 transition-all duration-300">

      <!-- ============================================ -->
      <!-- MOBILE TOP BAR (h-14, < lg only)              -->
      <!-- brand mark + dynamic page title + cart + menu -->
      <!-- ============================================ -->
      <div class="lg:hidden topbar h-14 glass-panel flex items-center gap-2 px-3 safe-area-top">
        <button onclick="actions.setView('landing')" class="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-amber-500 flex items-center justify-center text-white shadow-md flex-shrink-0" aria-label="Home">
          <i class="fa-solid fa-wheat-awn text-sm"></i>
        </button>
        <div class="min-w-0 flex-1">
          <div class="text-[9px] uppercase tracking-[0.12em] font-extrabold text-emerald-700 dark:text-emerald-400 leading-none mb-0.5">Agrein</div>
          <div class="text-xs font-extrabold text-slate-900 dark:text-white truncate leading-tight">${viewTitle(currentView)}</div>
        </div>
        <!-- Mobile Wishlist Button -->
        <button onclick="actions.toggleWishlistDrawer()" class="relative w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shadow-sm active:scale-95 flex-shrink-0" aria-label="Wishlist" title="Wishlist">
          <i class="fa-regular fa-heart text-sm"></i>
          ${wishlist.length > 0 ? `<span class="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 rounded-full bg-rose-500 text-white text-[9px] font-extrabold flex items-center justify-center">${wishlist.length > 99 ? '99+' : wishlist.length}</span>` : ''}
        </button>
        <!-- Mobile Cart Button -->
        <button onclick="actions.toggleCartDrawer()" class="relative w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-md shadow-emerald-700/20 active:scale-95 flex-shrink-0" aria-label="Cart" title="Cart">
          <i class="fa-solid fa-cart-shopping text-sm"></i>
          ${cartCount > 0 ? `<span class="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 rounded-full bg-amber-400 text-emerald-950 text-[9px] font-extrabold flex items-center justify-center">${cartCount > 99 ? '99+' : cartCount}</span>` : ''}
        </button>
        <button onclick="actions.toggleMobileMenu()" class="w-9 h-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-gray-200 flex items-center justify-center flex-shrink-0" aria-label="Menu">
          <i class="fa-solid fa-bars text-base"></i>
        </button>
      </div>

      <!-- ============================================ -->
      <!-- DESKTOP BAR (lg+)                            -->
      <!-- ============================================ -->
      <div class="hidden lg:block glass-panel">
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
            <button onclick="actions.guardView('admin-dashboard')" class="px-4 py-2 rounded-xl text-xs font-bold transition-all ${currentView === 'admin-dashboard' ? 'bg-purple-700 text-white shadow-md font-extrabold' : 'text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30'}">
              <i class="fa-solid fa-shield-halved mr-1"></i> Admin Console
            </button>
            <button onclick="actions.guardView('admin-verification')" class="px-4 py-2 rounded-xl text-xs font-bold transition-all ${currentView === 'admin-verification' ? 'bg-purple-700 text-white shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:text-purple-700'}">
              <i class="fa-solid fa-user-check text-purple-400 mr-1"></i> Verify Queue
            </button>
          ` : ''}

          <button onclick="actions.setView('ai-insights')" class="px-4 py-2 rounded-xl text-xs font-bold transition-all ${currentView === 'ai-insights' ? 'bg-white dark:bg-emerald-700 text-emerald-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-white'}">
            AI Forecast
          </button>
          <button onclick="actions.setView('nearby-farms')" class="px-4 py-2 rounded-xl text-xs font-bold transition-all ${currentView === 'nearby-farms' ? 'bg-white dark:bg-emerald-700 text-emerald-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-white'}">
            Farm Finder
          </button>
        </nav>

        <!-- 3. Right Utility Icons & Auth Buttons -->
        <div class="flex items-center space-x-2 lg:space-x-3">

          <!-- Cart Drawer Button (sm+ only — lives in the hamburger menu on mobile) -->
          <button onclick="actions.toggleCartDrawer()" class="relative p-2 lg:p-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white shadow-md shadow-emerald-700/20 transition-all items-center space-x-2 flex-shrink-0 hidden sm:inline-flex">
            <i class="fa-solid fa-cart-shopping text-sm"></i>
            <span class="text-xs font-bold hidden sm:inline">Cart</span>
            ${cartCount > 0 ? `<span class="min-w-[20px] h-5 px-1 bg-amber-400 text-emerald-950 rounded-full text-[10px] font-extrabold flex items-center justify-center">${cartCount > 99 ? '99+' : cartCount}</span>` : ''}
          </button>

          <!-- Wishlist Badge (desktop only — mobile lives in drawer & top bar) -->
          <button onclick="actions.toggleWishlistDrawer()" class="relative p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all hidden lg:inline-flex" title="Wishlist">
            <i class="fa-regular fa-heart text-base text-rose-500"></i>
            ${wishlist.length > 0 ? `<span class="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center shadow">${wishlist.length > 99 ? '99+' : wishlist.length}</span>` : ''}
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
                  <button onclick="actions.guardView('account-settings'); actions.closeNavbarMenu();" class="w-full text-left px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-slate-800 flex items-center space-x-2">
                    <i class="fa-solid fa-gear text-emerald-600"></i>
                    <span>Account Settings</span>
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
            ${cartCount > 0 ? `<span class="absolute top-1.5 right-2 min-w-[16px] h-[16px] px-1 bg-amber-400 text-emerald-950 rounded-full text-[9px] font-extrabold flex items-center justify-center">${cartCount > 99 ? '99+' : cartCount}</span>` : ''}
          </button>
          <button onclick="actions.closeMobileMenu(); setTimeout(() => actions.toggleWishlistDrawer(), 50);" class="relative flex flex-col items-center justify-center py-3 px-2 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-950/50 transition-all">
            <i class="fa-regular fa-heart text-base mb-1"></i>
            <span class="text-[10px] font-bold">Wishlist</span>
            ${wishlist.length > 0 ? `<span class="absolute top-1.5 right-2 min-w-[16px] h-[16px] px-1 rounded-full bg-rose-500 text-white text-[9px] font-extrabold flex items-center justify-center">${wishlist.length > 99 ? '99+' : wishlist.length}</span>` : ''}
          </button>
          <button onclick="actions.toggleDarkMode()" class="flex flex-col items-center justify-center py-3 px-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-950/50 transition-all">
            <i class="fa-solid ${darkMode ? 'fa-sun' : 'fa-moon'} text-base mb-1"></i>
            <span class="text-[10px] font-bold">${darkMode ? 'Light' : 'Dark'}</span>
          </button>
        </div>

        <!-- Navigation Links — sectioned drawer -->
        <nav class="flex-1 overflow-y-auto p-2 space-y-0.5">
          ${sectionHeader('Browse')}
          ${navItem({ icon: 'fa-house',          iconColor: 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300', label: 'Home',         desc: 'Agrein landing & live market feed',          onclick: "actions.setViewAndCloseMobile('landing')",      active: currentView === 'landing' })}
          ${navItem({ icon: 'fa-store',          iconColor: 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300', label: 'Marketplace',  desc: 'Browse fresh harvests from verified farms',    onclick: "actions.setViewAndCloseMobile('marketplace')",  active: currentView === 'marketplace' })}
          ${navItem({ icon: 'fa-location-dot',   iconColor: 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300', label: 'Farm Finder',  desc: 'Geospatial map of nearby farms',               onclick: "actions.setViewAndCloseMobile('nearby-farms')",  active: currentView === 'nearby-farms' })}

          ${sectionHeader('Insights')}
          ${navItem({ icon: 'fa-wand-magic-sparkles', iconColor: 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300',     label: 'AI Forecast',        desc: 'Crop price predictions 6 months out',  onclick: "actions.setViewAndCloseMobile('ai-insights')",     active: currentView === 'ai-insights' })}
          ${navItem({ icon: 'fa-stethoscope',         iconColor: 'bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300',         label: 'AI Crop Doctor',     desc: 'Diagnose crop diseases from a photo',   onclick: "actions.setViewAndCloseMobile('agro-doctor')",     active: currentView === 'agro-doctor' })}
          ${navItem({ icon: 'fa-chart-line',          iconColor: 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300',     label: 'Price Index',        desc: 'Live commodity market index',           onclick: "actions.setViewAndCloseMobile('commodity-index')", active: currentView === 'commodity-index' })}
          ${navItem({ icon: 'fa-cloud-sun-rain',      iconColor: 'bg-sky-100 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300',             label: 'Weather',            desc: 'Hyperlocal farming weather',            onclick: "actions.setViewAndCloseMobile('weather')",         active: currentView === 'weather' })}

          ${sectionHeader('Trade')}
          ${navItem({ icon: 'fa-clipboard-list', iconColor: 'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300',           label: 'RFQ Board',     desc: 'Reverse marketplace — buyers post requests',     onclick: "actions.setViewAndCloseMobile('rfq-board')",     active: currentView === 'rfq-board' })}
          ${navItem({ icon: 'fa-boxes-stacked',  iconColor: 'bg-fuchsia-100 dark:bg-fuchsia-950/40 text-fuchsia-700 dark:text-fuchsia-300', label: 'B2B Bulk',    desc: 'Industrial-scale produce contracts',             onclick: "actions.guardViewAndCloseMobile('bulk-b2b')",  active: currentView === 'bulk-b2b' })}
          ${navItem({ icon: 'fa-globe-africa',   iconColor: 'bg-cyan-100 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300',           label: 'Export Trade', desc: 'Cross-border agricultural exports',              onclick: "actions.guardViewAndCloseMobile('export-trade')", active: currentView === 'export-trade' })}
          ${navItem({ icon: 'fa-truck-fast',     iconColor: 'bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300',   label: 'Logistics',   desc: 'ColdChain shipping partners & rates',            onclick: "actions.guardViewAndCloseMobile('logistics')",  active: currentView === 'logistics' })}
          ${navItem({ icon: 'fa-qrcode',         iconColor: 'bg-lime-100 dark:bg-lime-950/40 text-lime-700 dark:text-lime-300',           label: 'Traceability',desc: 'Scan a QR to trace a harvest to its farm',       onclick: "actions.guardViewAndCloseMobile('traceability')",active: currentView === 'traceability' })}

          ${sectionHeader('Account')}
          ${currentUser ? `
            ${navItem({ icon: 'fa-wallet',       iconColor: 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300', label: 'Wallet',    desc: 'Balances, escrow, withdrawals',     onclick: "actions.guardViewAndCloseMobile('wallet')",     active: currentView === 'wallet' })}
            ${navItem({ icon: 'fa-comments',     iconColor: 'bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300', label: 'Community', desc: 'Farmer forum & discussions',        onclick: "actions.guardViewAndCloseMobile('forum')",       active: currentView === 'forum' })}
            ${navItem({ icon: 'fa-people-group', iconColor: 'bg-violet-100 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300', label: 'Cooperatives', desc: 'Join a farming cooperative',     onclick: "actions.guardViewAndCloseMobile('cooperatives')",active: currentView === 'cooperatives' })}
          ` : `
            ${navItem({ icon: 'fa-right-to-bracket', iconColor: 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300', label: 'Log In',  desc: 'Access your farmer or buyer portal', onclick: "actions.closeMobileMenu(); setTimeout(() => actions.openAuthModal('login'), 100);", active: false })}
          `}

          ${activeRole === 'farmer' ? `
            ${sectionHeader('Farmer Portal')}
            ${navItem({ icon: 'fa-tractor',        iconColor: 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300',       label: 'Farmer Dashboard', desc: 'Listings, sales, withdrawals',          onclick: "actions.guardViewAndCloseMobile('farmer-dashboard')", active: currentView === 'farmer-dashboard' })}
            ${navItem({ icon: 'fa-shield-halved',  iconColor: 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300', label: 'Farm Verification', desc: 'Complete or track KYC status',        onclick: "actions.guardViewAndCloseMobile('farmer-verification')", active: currentView === 'farmer-verification' })}
          ` : ''}
          ${activeRole === 'buyer' ? `
            ${sectionHeader('Buyer Portal')}
            ${navItem({ icon: 'fa-basket-shopping', iconColor: 'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300',          label: 'Buyer Dashboard',  desc: 'Active orders & coldchain tracking',  onclick: "actions.guardViewAndCloseMobile('buyer-dashboard')", active: currentView === 'buyer-dashboard' })}
          ` : ''}
          ${activeRole === 'admin' ? `
            ${sectionHeader('Admin Portal')}
            ${navItem({ icon: 'fa-shield-halved', iconColor: 'bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300', label: 'Admin Dashboard', desc: 'Platform metrics & moderation', onclick: "actions.guardViewAndCloseMobile('admin-dashboard')", active: currentView === 'admin-dashboard' })}
            ${navItem({ icon: 'fa-user-check', iconColor: 'bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300', label: 'Verify Queue', desc: 'Audit pending farmer verifications', onclick: "actions.guardViewAndCloseMobile('admin-verification')", active: currentView === 'admin-verification' })}
          ` : ''}

          ${sectionHeader('Mobile App')}
          ${navItem({ icon: 'fa-mobile-screen-button', iconColor: 'bg-emerald-600 text-white', label: 'Install Agrein App', desc: 'Add to Home Screen for offline access & speed', onclick: 'actions.triggerPwaInstall()', active: false })}
        </nav>


        <!-- Account / Auth footer (slim: sectioned drawer already covers role portals) -->
        <div class="p-3 border-t border-gray-200 dark:border-slate-800 safe-area-bottom">
          ${currentUser ? `
            <div class="grid grid-cols-3 gap-2">
              <button onclick="actions.guardViewAndCloseMobile('account-settings')" class="px-2 py-2.5 rounded-xl text-[11px] font-bold text-slate-700 dark:text-gray-200 border border-gray-300 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all flex flex-col items-center justify-center space-y-0.5">
                <i class="fa-solid fa-gear text-emerald-600 text-sm"></i>
                <span>Settings</span>
              </button>
              <button onclick="actions.closeMobileMenu(); setTimeout(() => actions.openChangePasswordModal(), 100);" class="px-2 py-2.5 rounded-xl text-[11px] font-bold text-slate-700 dark:text-gray-200 border border-gray-300 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all flex flex-col items-center justify-center space-y-0.5">
                <i class="fa-solid fa-lock text-emerald-600 text-sm"></i>
                <span>Password</span>
              </button>
              <button onclick="actions.logout()" class="px-2 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-extrabold text-[11px] shadow-md transition-all flex flex-col items-center justify-center space-y-0.5">
                <i class="fa-solid fa-right-from-bracket text-sm"></i>
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

    <!-- ============================================ -->
    <!-- MOBILE BOTTOM TAB BAR (visible only < lg)     -->
    <!-- 5 slots: Home, Market, raised Sell, Cart/Profile, More -->
    <!-- ============================================ -->
    <nav class="lg:hidden fixed bottom-0 inset-x-0 z-30 glass-panel border-t border-emerald-900/10 dark:border-white/10 transition-transform duration-300 ${bottomNavHidden ? 'translate-y-full' : 'translate-y-0'}" aria-label="Primary">
      <div class="grid grid-cols-5 max-w-md mx-auto px-1.5 pt-1.5 pb-1 bottom-nav-safe">
        <button onclick="actions.setView('landing')" class="flex flex-col items-center justify-center py-1 gap-0.5 rounded-xl ${currentView === 'landing' ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}" aria-label="Home">
          <i class="fa-solid fa-house text-lg"></i>
          <span class="text-[10px] font-bold">Home</span>
        </button>
        <button onclick="actions.setView('marketplace')" class="flex flex-col items-center justify-center py-1 gap-0.5 rounded-xl ${currentView === 'marketplace' ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}" aria-label="Marketplace">
          <i class="fa-solid fa-store text-lg"></i>
          <span class="text-[10px] font-bold">Market</span>
        </button>
        <div class="relative flex items-end justify-center">
          <button onclick="actions.openSellSheet()" class="-mt-6 w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-700 via-emerald-600 to-amber-500 text-white shadow-xl shadow-emerald-700/30 flex items-center justify-center active:scale-95 ring-4 ring-white dark:ring-slate-950" aria-label="Sell">
            <i class="fa-solid fa-plus text-xl"></i>
          </button>
          <span class="absolute -bottom-0.5 text-[10px] font-extrabold text-slate-700 dark:text-slate-300">Sell</span>
        </div>
        ${cartCount > 0 ? `
          <button onclick="actions.toggleCartDrawer()" class="relative flex flex-col items-center justify-center py-1 gap-0.5 rounded-xl ${state.cartOpen ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}" aria-label="Cart">
            <i class="fa-solid fa-cart-shopping text-lg"></i>
            <span class="absolute top-0 right-2 min-w-[16px] h-[16px] px-1 rounded-full bg-amber-400 text-emerald-950 text-[9px] font-extrabold flex items-center justify-center">${cartCount > 99 ? '99+' : cartCount}</span>
            <span class="text-[10px] font-bold">Cart</span>
          </button>
        ` : `
          <button onclick="actions.guardView('account-settings')" class="flex flex-col items-center justify-center py-1 gap-0.5 rounded-xl ${currentView === 'account-settings' ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}" aria-label="Profile">
            <i class="fa-solid fa-user text-lg"></i>
            <span class="text-[10px] font-bold">Profile</span>
          </button>
        `}
        <button onclick="actions.toggleMobileMenu()" class="flex flex-col items-center justify-center py-1 gap-0.5 rounded-xl ${mobileMenuOpen ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}" aria-label="More">
          <i class="fa-solid fa-bars text-lg"></i>
          <span class="text-[10px] font-bold">More</span>
        </button>
      </div>
    </nav>

    <!-- ============================================ -->
    <!-- SELL SHEET (raised Sell button, < lg only)    -->
    <!-- ============================================ -->
    ${sellSheetOpen ? `
    <div class="lg:hidden fixed inset-0 z-50">
      <div class="fixed inset-0 bg-slate-950/60 backdrop-blur-sm animate-fade-in" onclick="actions.closeSellSheet()"></div>
      <div class="relative mt-auto max-h-[75vh] rounded-t-3xl bg-white dark:bg-slate-900 shadow-2xl border-t border-emerald-500/20 animate-sheet-up safe-area-bottom flex flex-col">
        <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-800">
          <div>
            <div class="font-heading font-extrabold text-base text-slate-900 dark:text-white">What do you want to do?</div>
            <div class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">${activeRole === 'farmer' ? 'Quick actions for farmers' : activeRole === 'buyer' ? 'Quick actions for buyers' : activeRole === 'admin' ? 'Quick actions for admins' : 'Get started with Agrein'}</div>
          </div>
          <button onclick="actions.closeSellSheet()" class="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-gray-200 flex items-center justify-center flex-shrink-0" aria-label="Close">
            <i class="fa-solid fa-xmark text-base"></i>
          </button>
        </div>
        <div class="p-3 space-y-2 overflow-y-auto">
          ${activeRole === 'farmer' ? `
            <button onclick="actions.closeSellSheet(); actions.guardView('farmer-dashboard');" class="w-full p-3 rounded-2xl flex items-center gap-3 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-950/50 transition-all text-left">
              <span class="w-11 h-11 rounded-xl bg-emerald-700 text-white flex items-center justify-center flex-shrink-0"><i class="fa-solid fa-plus text-base"></i></span>
              <div class="min-w-0 flex-1"><div class="text-sm font-extrabold text-emerald-900 dark:text-emerald-300">Add Product Listing</div><div class="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">Publish a new harvest to the marketplace</div></div>
              <i class="fa-solid fa-chevron-right text-slate-400"></i>
            </button>
            <button onclick="actions.closeSellSheet(); actions.guardView('farmer-dashboard');" class="w-full p-3 rounded-2xl flex items-center gap-3 bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-950/50 transition-all text-left">
              <span class="w-11 h-11 rounded-xl bg-amber-600 text-white flex items-center justify-center flex-shrink-0"><i class="fa-solid fa-tractor text-base"></i></span>
              <div class="min-w-0 flex-1"><div class="text-sm font-extrabold text-amber-900 dark:text-amber-300">My Listings</div><div class="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">Manage your active product listings</div></div>
              <i class="fa-solid fa-chevron-right text-slate-400"></i>
            </button>
            <button onclick="actions.closeSellSheet(); actions.guardView('rfq-board');" class="w-full p-3 rounded-2xl flex items-center gap-3 bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-all text-left">
              <span class="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0"><i class="fa-solid fa-clipboard-list text-base"></i></span>
              <div class="min-w-0 flex-1"><div class="text-sm font-extrabold text-blue-900 dark:text-blue-300">Browse RFQ Board</div><div class="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">Submit bids on buyer requests</div></div>
              <i class="fa-solid fa-chevron-right text-slate-400"></i>
            </button>
          ` : activeRole === 'buyer' ? `
            <button onclick="actions.closeSellSheet(); actions.setView('marketplace');" class="w-full p-3 rounded-2xl flex items-center gap-3 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-950/50 transition-all text-left">
              <span class="w-11 h-11 rounded-xl bg-emerald-700 text-white flex items-center justify-center flex-shrink-0"><i class="fa-solid fa-store text-base"></i></span>
              <div class="min-w-0 flex-1"><div class="text-sm font-extrabold text-emerald-900 dark:text-emerald-300">Browse Marketplace</div><div class="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">Discover fresh harvests from verified farms</div></div>
              <i class="fa-solid fa-chevron-right text-slate-400"></i>
            </button>
            <button onclick="actions.closeSellSheet(); actions.guardView('bulk-b2b');" class="w-full p-3 rounded-2xl flex items-center gap-3 bg-fuchsia-50 dark:bg-fuchsia-950/30 hover:bg-fuchsia-100 dark:hover:bg-fuchsia-950/50 transition-all text-left">
              <span class="w-11 h-11 rounded-xl bg-fuchsia-600 text-white flex items-center justify-center flex-shrink-0"><i class="fa-solid fa-boxes-stacked text-base"></i></span>
              <div class="min-w-0 flex-1"><div class="text-sm font-extrabold text-fuchsia-900 dark:text-fuchsia-300">Bulk B2B Order</div><div class="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">Industrial-scale procurement contracts</div></div>
              <i class="fa-solid fa-chevron-right text-slate-400"></i>
            </button>
            <button onclick="actions.closeSellSheet(); actions.openDisputeModal();" class="w-full p-3 rounded-2xl flex items-center gap-3 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-950/50 transition-all text-left">
              <span class="w-11 h-11 rounded-xl bg-rose-600 text-white flex items-center justify-center flex-shrink-0"><i class="fa-solid fa-shield-halved text-base"></i></span>
              <div class="min-w-0 flex-1"><div class="text-sm font-extrabold text-rose-900 dark:text-rose-300">File Buyer Dispute</div><div class="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">Open a buyer protection case</div></div>
              <i class="fa-solid fa-chevron-right text-slate-400"></i>
            </button>
          ` : activeRole === 'admin' ? `
            <button onclick="actions.closeSellSheet(); actions.guardView('admin-verification');" class="w-full p-3 rounded-2xl flex items-center gap-3 bg-purple-50 dark:bg-purple-950/30 hover:bg-purple-100 dark:hover:bg-purple-950/50 transition-all text-left">
              <span class="w-11 h-11 rounded-xl bg-purple-700 text-white flex items-center justify-center flex-shrink-0"><i class="fa-solid fa-user-check text-base"></i></span>
              <div class="min-w-0 flex-1"><div class="text-sm font-extrabold text-purple-900 dark:text-purple-300">Verify Queue</div><div class="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">Audit pending farmer verifications</div></div>
              <i class="fa-solid fa-chevron-right text-slate-400"></i>
            </button>
            <button onclick="actions.closeSellSheet(); actions.guardView('admin-dashboard');" class="w-full p-3 rounded-2xl flex items-center gap-3 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-950/50 transition-all text-left">
              <span class="w-11 h-11 rounded-xl bg-emerald-700 text-white flex items-center justify-center flex-shrink-0"><i class="fa-solid fa-shield-halved text-base"></i></span>
              <div class="min-w-0 flex-1"><div class="text-sm font-extrabold text-emerald-900 dark:text-emerald-300">Admin Dashboard</div><div class="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">Platform metrics & moderation</div></div>
              <i class="fa-solid fa-chevron-right text-slate-400"></i>
            </button>
          ` : `
            <button onclick="actions.closeSellSheet(); actions.openAuthModal('register'); actions.setAuthRegisterRole('FARMER');" class="w-full p-3 rounded-2xl flex items-center gap-3 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-950/50 transition-all text-left">
              <span class="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-700 to-amber-500 text-white flex items-center justify-center flex-shrink-0"><i class="fa-solid fa-tractor text-base"></i></span>
              <div class="min-w-0 flex-1"><div class="text-sm font-extrabold text-emerald-900 dark:text-emerald-300">Sign Up as Farmer</div><div class="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">List your harvest and reach 36-state buyers</div></div>
              <i class="fa-solid fa-chevron-right text-slate-400"></i>
            </button>
            <button onclick="actions.closeSellSheet(); actions.openAuthModal('register'); actions.setAuthRegisterRole('BUYER');" class="w-full p-3 rounded-2xl flex items-center gap-3 bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-all text-left">
              <span class="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0"><i class="fa-solid fa-cart-shopping text-base"></i></span>
              <div class="min-w-0 flex-1"><div class="text-sm font-extrabold text-blue-900 dark:text-blue-300">Sign Up as Buyer</div><div class="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">Source fresh produce with escrow protection</div></div>
              <i class="fa-solid fa-chevron-right text-slate-400"></i>
            </button>
            <button onclick="actions.closeSellSheet(); actions.setView('marketplace');" class="w-full p-3 rounded-2xl flex items-center gap-3 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-left">
              <span class="w-11 h-11 rounded-xl bg-slate-700 text-white flex items-center justify-center flex-shrink-0"><i class="fa-solid fa-store text-base"></i></span>
              <div class="min-w-0 flex-1"><div class="text-sm font-extrabold text-slate-900 dark:text-white">Browse Marketplace</div><div class="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">See the latest listings — no signup required</div></div>
              <i class="fa-solid fa-chevron-right text-slate-400"></i>
            </button>
          `}
        </div>
      </div>
    </div>
    ` : ''}

    <!-- ═══ FLOATING AGREIN SUPPORT TRIGGER (Bottom Right — Logo Only) ═══ -->
    <div class="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 flex items-center animate-fade-in">
      <button onclick="actions.openChatDrawer('Agrein Support')"
              title="Open 24/7 Agrein Agricultural AI Support & Customer Care"
              class="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-amber-500 text-white shadow-2xl shadow-emerald-950/60 hover:scale-110 active:scale-95 transition-all flex items-center justify-center border border-emerald-400/40 group">
        <!-- Live online ping -->
        <span class="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-900 animate-pulse shadow-sm"></span>
        <i class="fa-solid fa-wheat-awn text-base group-hover:rotate-12 transition-transform duration-300"></i>
      </button>
    </div>
  `;
}