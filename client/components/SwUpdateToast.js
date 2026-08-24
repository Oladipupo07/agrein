// Service-Worker Update Toast
//
// Bound to state.swUpdateAvailable. When the new SW has activated and the page
// can be reloaded safely, this toast pokes the user. Without it, users silently
// stay on stale JS after every deploy and hit the broken-cache issue described
// in the agrein-sw-stale-cache memory file.
function renderSwUpdateToast(state, actions) {
  if (!state.swUpdateAvailable) return '';
  return `
    <div class="fixed bottom-24 lg:bottom-6 inset-x-0 z-[70] flex justify-center px-3 animate-fade-in" role="status">
      <div class="w-full max-w-sm bg-emerald-800 text-white rounded-2xl shadow-2xl border border-emerald-400/40 p-3 flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-emerald-700/60 flex items-center justify-center flex-shrink-0">
          <i class="fa-solid fa-arrows-rotate text-amber-300"></i>
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-xs font-extrabold leading-snug">Agrein has been updated</div>
          <div class="text-[10px] text-emerald-100/90 leading-snug">Reload to get the latest version.</div>
        </div>
        <button onclick="actions.dismissSwUpdate()" class="px-3 py-2 rounded-xl text-[11px] font-bold text-emerald-100 hover:bg-emerald-700/60 flex-shrink-0">Later</button>
        <button onclick="actions.applySwUpdate()" class="px-3 py-2 rounded-xl bg-amber-400 text-emerald-950 text-[11px] font-extrabold hover:bg-amber-300 flex-shrink-0">Reload</button>
      </div>
    </div>
  `;
}
