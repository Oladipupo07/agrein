// Suspended Account View Component for Agrein
// Displayed when an account has been suspended/blocked by an Administrator pending further review.

function renderSuspendedAccountView(state, actions) {
  const user = state.currentUser || {};
  const reason = user.suspension_reason || 'Under administrative review by the Agrein Platform Integrity team.';

  return `
    <div class="min-h-[85vh] flex items-center justify-center px-4 py-8 sm:py-12 bg-slate-50 dark:bg-slate-950 animate-fade-in">
      <div class="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-rose-500/20 overflow-hidden text-center relative p-6 sm:p-10 space-y-6">
        
        <!-- Glowing Ambient Accent -->
        <div class="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-rose-500/10 blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"></div>

        <!-- Warning Icon & Shield -->
        <div class="relative mx-auto w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 flex items-center justify-center text-white shadow-2xl shadow-rose-600/30">
          <i class="fa-solid fa-user-lock text-3xl sm:text-4xl"></i>
          <span class="absolute -top-1 -right-1 flex h-4 w-4">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-4 w-4 bg-rose-600 border-2 border-white dark:border-slate-900"></span>
          </span>
        </div>

        <!-- Header -->
        <div class="space-y-2">
          <div class="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/40">
            <i class="fa-solid fa-triangle-exclamation"></i>
            <span>Account Suspended • Under Review</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 dark:text-white">
            Account Blocked Pending Review
          </h1>
          <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
            Your Agrein account has been temporarily restricted by the administration team. Trading, produce listings, and wallet operations are paused while your account undergoes review.
          </p>
        </div>

        <!-- Dossier Summary Card -->
        <div class="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 text-left space-y-3">
          <div class="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-slate-700/60">
            <div class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Restriction Notice</div>
            <span class="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">Awaiting Admin Decision</span>
          </div>
          
          <div class="space-y-2 text-xs">
            <div>
              <span class="text-gray-400 text-[10px] block font-bold">Reason for Suspension:</span>
              <p class="font-bold text-rose-700 dark:text-rose-300 bg-rose-50/80 dark:bg-rose-950/40 p-2.5 rounded-xl border border-rose-200 dark:border-rose-800/30 mt-1">
                "${reason}"
              </p>
            </div>

            <div class="grid grid-cols-2 gap-2 pt-1 text-[11px]">
              <div>
                <span class="text-gray-400 block text-[10px]">Account Name:</span>
                <span class="font-bold text-slate-900 dark:text-white">${user.full_name || 'User'}</span>
              </div>
              <div>
                <span class="text-gray-400 block text-[10px]">Account Role:</span>
                <span class="font-bold text-slate-900 dark:text-white">${(user.role || 'USER').toUpperCase()}</span>
              </div>
              <div class="col-span-2">
                <span class="text-gray-400 block text-[10px]">Email:</span>
                <span class="font-mono font-bold text-slate-700 dark:text-gray-300">${user.email || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Next Steps / Instructions -->
        <div class="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/30 text-left text-xs text-emerald-900 dark:text-emerald-200 space-y-1.5">
          <div class="font-extrabold flex items-center space-x-1.5 text-emerald-800 dark:text-emerald-300">
            <i class="fa-solid fa-circle-info"></i>
            <span>What happens next?</span>
          </div>
          <p class="text-[11px] leading-relaxed text-emerald-800/90 dark:text-emerald-300/90">
            Our platform compliance moderators review accounts to ensure trust and escrow security across Nigeria. You can appeal this decision or provide additional information to speed up the review.
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-2.5 pt-2">
          <button onclick="actions.openChatDrawer('Agrein Support')" class="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-700 to-emerald-900 hover:from-emerald-800 hover:to-emerald-950 text-white font-extrabold text-xs shadow-xl hover:shadow-2xl transition-all flex items-center justify-center space-x-2">
            <i class="fa-solid fa-headset text-amber-300 text-sm"></i>
            <span>Contact Support & File Appeal</span>
          </button>
          
          <div class="grid grid-cols-2 gap-2">
            <button onclick="actions.checkSuspensionStatus()" class="py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 text-slate-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 text-xs font-bold transition-all flex items-center justify-center space-x-1.5">
              <i class="fa-solid fa-rotate text-emerald-600"></i>
              <span>Check Status</span>
            </button>
            <button onclick="actions.logout()" class="py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/30 text-slate-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 text-xs font-bold transition-all flex items-center justify-center space-x-1.5">
              <i class="fa-solid fa-arrow-right-from-bracket text-xs"></i>
              <span>Log Out</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  `;
}
