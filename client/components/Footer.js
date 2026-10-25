// Clean, Professional Footer Component for Agrein

function renderFooter(state, actions) {
  return `
    <footer class="bg-slate-950 text-white pt-12 sm:pt-16 pb-10 sm:pb-12 border-t border-emerald-900/30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">

        <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

          <!-- Column 1: Brand Info -->
          <div class="md:col-span-6 space-y-4">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-amber-500 flex items-center justify-center text-white text-xl shadow-lg">
                <i class="fa-solid fa-wheat-awn"></i>
              </div>
              <span class="font-heading font-extrabold text-2xl tracking-tight text-white">Agrein</span>
            </div>

            <p class="text-sm text-gray-400 max-w-md leading-relaxed">
              "Connecting Farmers to Buyers, One Harvest at a Time." Eliminating middlemen, empowering smallholders, and bringing transparent digital commerce to Nigerian agriculture.
            </p>

            <div class="flex flex-wrap items-center gap-2 text-xs text-gray-400">
              <span class="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 flex items-center space-x-1">
                <i class="fa-solid fa-shield-check text-emerald-500"></i>
                <span>100% Escrow Protected</span>
              </span>
              <span class="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 flex items-center space-x-1">
                <i class="fa-solid fa-certificate text-amber-400"></i>
                <span>Verified Agricultural Network</span>
              </span>
            </div>
          </div>

          <!-- Column 2: Navigation Links -->
          <div class="md:col-span-3 space-y-3">
            <h4 class="text-xs font-bold uppercase tracking-wider text-amber-400">Quick Links</h4>
            <ul class="space-y-2 text-xs text-gray-400">
              <li><button onclick="actions.goHome()" class="hover:text-emerald-400 transition-colors">Home</button></li>
              <li><button onclick="actions.openAuthModal('login')" class="hover:text-emerald-400 transition-colors">Sign In</button></li>
              <li><button onclick="actions.openAuthModal('register'); actions.setAuthRegisterRole('FARMER');" class="hover:text-emerald-400 transition-colors">Sign Up as Farmer</button></li>
              <li><button onclick="actions.openAuthModal('register'); actions.setAuthRegisterRole('BUYER');" class="hover:text-emerald-400 transition-colors">Sign Up as Buyer</button></li>
            </ul>
          </div>

          <!-- Column 3: Contact & Support -->
          <div class="md:col-span-3 space-y-3">
            <h4 class="text-xs font-bold uppercase tracking-wider text-amber-400">Direct Support</h4>
            <ul class="space-y-2 text-xs text-gray-400">
              <li class="flex items-center space-x-2">
                <i class="fa-solid fa-phone text-emerald-500 text-xs"></i>
                <span>+234-800-AGREIN-NG</span>
              </li>
              <li class="flex items-center space-x-2">
                <i class="fa-solid fa-envelope text-emerald-500 text-xs"></i>
                <span>support@agrein.ng</span>
              </li>
              <li class="flex items-center space-x-2">
                <i class="fa-solid fa-location-dot text-emerald-500 text-xs"></i>
                <span>Abuja & Lagos, Nigeria</span>
              </li>
            </ul>
          </div>

        </div>

        <div class="pt-6 sm:pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4 sm:gap-0">
          <div class="text-center sm:text-left">© 2026 Agrein Agricultural Marketplace. All rights reserved.</div>
          <div class="flex flex-wrap items-center justify-center gap-4">
            <a href="/privacy-policy.html" class="hover:text-emerald-400 font-semibold">Privacy Policy</a>
            <a href="#" class="hover:text-emerald-400" aria-label="Twitter"><i class="fa-brands fa-twitter text-base"></i></a>
            <a href="#" class="hover:text-emerald-400" aria-label="Facebook"><i class="fa-brands fa-facebook text-base"></i></a>
            <a href="#" class="hover:text-emerald-400" aria-label="LinkedIn"><i class="fa-brands fa-linkedin text-base"></i></a>
            <a href="#" class="hover:text-emerald-400" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp text-base"></i></a>
          </div>
        </div>

      </div>
    </footer>
  `;
}
