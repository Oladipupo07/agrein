// PWA Install + Offline Banner — Mobile UX
//
//   renderOfflineRibbon(state)                → top bar shown while navigator.onLine === false
//   renderPwaInstallSheet(state, actions)    → iOS share-install sheet + Android deferredPrompt sheet
//
// Detection once per page-load: actions.dismissPwaHint(), actions.isIosSafariNotInstalled()
//
// We don't fire any prompt automatically — the iOS sheet is dismissable, the
// Android prompt only shows after the user has tapped our "Install App" button.

function renderOfflineRibbon(state) {
  if (state.isOnline !== false) return '';
  return `
    <div class="fixed top-0 inset-x-0 z-[60] bg-amber-500 text-amber-950 text-[11px] font-extrabold py-1.5 px-3 flex items-center justify-center gap-2 shadow-md safe-area-top" role="status">
      <i class="fa-solid fa-wifi text-[10px]"></i>
      <span>You're offline — showing cached data. Reconnect to sync orders.</span>
    </div>
  `;
}

// iOS-specific install hint. Tells Safari users to use Share → Add to Home
// Screen, which is the only install path iOS supports (no beforeinstallprompt).
function renderIosInstallSheet(state, actions) {
  if (!state.showIosInstallHint) return '';
  return `
    <div class="fixed inset-0 z-[55] flex items-end justify-center bg-slate-950/70 backdrop-blur-sm animate-fade-in" onclick="actions.dismissPwaHint()">
      <div class="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl border-t border-emerald-500/30 animate-sheet-up safe-area-bottom" onclick="event.stopPropagation()">
        <div class="flex items-start gap-3 p-5">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-amber-500 flex items-center justify-center text-white shadow-md flex-shrink-0">
            <i class="fa-solid fa-wheat-awn text-xl"></i>
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-base font-heading font-extrabold text-slate-900 dark:text-white">Install Agrein</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">Get the full app — works offline, faster on slow networks, and lives on your home screen.</p>
          </div>
          <button onclick="actions.dismissPwaHint()" class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-gray-200 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center flex-shrink-0" aria-label="Close">
            <i class="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>
        <ol class="px-5 pb-5 space-y-2.5 text-xs text-slate-700 dark:text-gray-300">
          <li class="flex items-start gap-3">
            <span class="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center flex-shrink-0 text-sm font-extrabold">1</span>
            <span>Tap the <strong class="text-emerald-700 dark:text-emerald-300">Share</strong>
              <i class="fa-solid fa-arrow-up-from-bracket text-emerald-600 dark:text-emerald-400 mx-1"></i>
              button at the bottom of Safari.</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 text-sm font-extrabold">2</span>
            <span>Scroll down and tap <strong>"Add to Home Screen"</strong>.</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 text-sm font-extrabold">3</span>
            <span>Confirm by tapping <strong>Add</strong> in the top-right corner.</span>
          </li>
        </ol>
        <div class="px-5 pb-5">
          <button onclick="actions.dismissPwaHint()" class="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-700 to-emerald-900 text-white font-extrabold text-xs">
            Got it
          </button>
        </div>
      </div>
    </div>
  `;
}

// Android deferredPrompt sheet — only renders when the browser actually
// fired a beforeinstallprompt and we stashed the event in actions._installPrompt.
function renderAndroidInstallSheet(state, actions) {
  if (!state.showAndroidInstallPrompt) return '';
  return `
    <div class="fixed inset-0 z-[55] flex items-end justify-center bg-slate-950/70 backdrop-blur-sm animate-fade-in" onclick="actions.dismissPwaHint()">
      <div class="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl border-t border-emerald-500/30 animate-sheet-up safe-area-bottom" onclick="event.stopPropagation()">
        <div class="flex items-start gap-3 p-5">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-amber-500 flex items-center justify-center text-white shadow-md flex-shrink-0">
            <i class="fa-solid fa-wheat-awn text-xl"></i>
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-base font-heading font-extrabold text-slate-900 dark:text-white">Install Agrein</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">Add to your home screen for offline browsing, faster load, and push order updates.</p>
          </div>
          <button onclick="actions.dismissPwaHint()" class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-gray-200 flex items-center justify-center flex-shrink-0" aria-label="Close">
            <i class="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>
        <div class="px-5 pb-5 grid grid-cols-2 gap-2">
          <button onclick="actions.dismissPwaHint()" class="py-3 rounded-2xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-gray-200 font-extrabold text-xs">
            Not now
          </button>
          <button onclick="actions.promptAndroidInstall()" class="py-3 rounded-2xl bg-gradient-to-r from-emerald-700 to-emerald-900 text-white font-extrabold text-xs">
            Install
          </button>
        </div>
      </div>
    </div>
  `;
}

// Single composed export keeps the import shape tidy.
function renderPwaInstallSheet(state, actions) {
  return renderIosInstallSheet(state, actions) + renderAndroidInstallSheet(state, actions);
}
