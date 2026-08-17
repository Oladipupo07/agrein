// Farmer NIN & BVN Verification Modal Component for Agrein

function renderVerificationModal(state, actions) {
  const { verificationModalActive, farmerVerificationStatus } = state;
  if (!verificationModalActive) return '';

  return `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div class="modal-fullscreen-mobile relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-emerald-500/30 overflow-hidden animate-modal">
        
        <!-- Header -->
        <div class="bg-gradient-to-r from-emerald-800 to-emerald-600 p-6 text-white text-center relative">
          <button onclick="actions.closeVerificationModal()" class="absolute top-4 right-4 text-white/80 hover:text-white">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
          
          <div class="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md text-white font-extrabold flex items-center justify-center text-xl mx-auto mb-2">
            <i class="fa-solid fa-user-shield text-amber-300"></i>
          </div>

          <h3 class="text-xl font-heading font-extrabold">Farmer Government Audit</h3>
          <p class="text-xs text-emerald-100 mt-1">NIN & BVN verification to unlock Verified Producer badge & 98/100 Trust Score</p>
        </div>

        <!-- Body -->
        <div class="p-6 space-y-4 text-xs">
          ${farmerVerificationStatus === 'verified' ? `
            <div class="text-center py-6 space-y-3">
              <div class="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 text-3xl flex items-center justify-center mx-auto">
                <i class="fa-solid fa-badge-check"></i>
              </div>
              <h4 class="text-xl font-heading font-extrabold text-slate-900 dark:text-white">Verified Producer Status Active</h4>
              <p class="text-xs text-gray-500">NIN & BVN verified against NIMC government databases. Trust Score: <strong class="text-emerald-600">98/100 Gold Tier</strong>.</p>
              <button onclick="actions.closeVerificationModal()" class="px-6 py-2.5 rounded-xl bg-emerald-700 text-white font-bold">Close Portal</button>
            </div>
          ` : `
            <div class="space-y-3">
              <div>
                <label class="font-bold text-gray-500 block mb-1">National Identity Number (NIN - 11 digits)</label>
                <input type="text" id="ninInput" placeholder="24901829104" class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none">
              </div>

              <div>
                <label class="font-bold text-gray-500 block mb-1">Bank Verification Number (BVN - 11 digits)</label>
                <input type="text" id="bvnInput" placeholder="22940192014" class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none">
              </div>

              <div>
                <label class="font-bold text-gray-500 block mb-1">Government ID Card Type</label>
                <select class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                  <option>National ID Card / NIMC Slip</option>
                  <option>Voters Card (PVC)</option>
                  <option>Drivers License</option>
                  <option>International Passport</option>
                </select>
              </div>

              <div class="p-3 rounded-xl bg-amber-50 dark:bg-slate-800/60 border border-amber-500/20 text-[11px] text-amber-800 dark:text-amber-300">
                <i class="fa-solid fa-circle-info mr-1"></i> Your BVN & NIN are encrypted and processed strictly for identity verification. We never store raw banking credentials.
              </div>

              <button onclick="actions.submitFarmerVerification()" class="w-full py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-lg transition-all text-center">
                Submit NIN/BVN Verification Audit
              </button>
            </div>
          `}
        </div>

      </div>
    </div>
  `;
}
