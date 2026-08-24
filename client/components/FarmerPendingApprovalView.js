// Farmer Pending Approval View — Post-Submission Waiting State
// Shows after farmer submits verification, displays until admin approves

function renderFarmerPendingApprovalView(state, actions) {
  const user = state.currentUser || {};
  const app = state.mockData.farmerVerificationApp || {};
  const status = app.status || 'PENDING_REVIEW';

  return `
    <div class="min-h-screen bg-gradient-to-br from-emerald-50 via-slate-50 to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 flex items-center justify-center px-4 py-8">
      <div class="max-w-xl w-full space-y-6">
        
        <!-- Animated Checkmark Container -->
        <div class="relative">
          <div class="mx-auto w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-400 to-emerald-600 flex items-center justify-center shadow-2xl shadow-emerald-500/40 relative z-10">
            <i class="fa-solid fa-check text-4xl text-white"></i>
          </div>
          <!-- Pulsing Background Ring -->
          <div class="absolute inset-0 mx-auto w-24 h-24 rounded-full bg-emerald-300 animate-pulse" style="animation-duration: 2s;"></div>
        </div>

        <!-- Main Status Card -->
        <div class="glass-card rounded-3xl p-8 text-center space-y-4 border border-emerald-200/50 dark:border-emerald-900/30 shadow-xl">
          <h1 class="text-3xl font-heading font-extrabold text-slate-900 dark:text-white">
            Application Submitted! 🎉
          </h1>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            Thank you, <span class="font-bold text-emerald-600 dark:text-emerald-400">${user.full_name || 'Farmer'}</span>! Your farm verification is under review.
          </p>

          <!-- Status Details -->
          <div class="mt-6 space-y-3 py-6 border-t border-b border-gray-200 dark:border-slate-800">
            <!-- Submission Time -->
            <div class="flex items-center justify-between px-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <div class="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                <i class="fa-solid fa-calendar-check text-emerald-500"></i>
                <span class="text-xs font-bold">Submitted</span>
              </div>
              <span class="text-xs font-extrabold text-slate-900 dark:text-white">
                ${app.submitted_at ? new Date(app.submitted_at).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Today'}
              </span>
            </div>

            <!-- Current Status -->
            <div class="flex items-center justify-between px-4 py-2 bg-blue-50 dark:bg-blue-950/30 rounded-xl">
              <div class="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                <i class="fa-solid fa-hourglass-half animate-pulse text-lg"></i>
                <span class="text-xs font-bold">Status</span>
              </div>
              <span class="text-xs font-extrabold text-blue-700 dark:text-blue-300 uppercase tracking-wide">Pending Approval</span>
            </div>

            <!-- Expected Decision Time -->
            <div class="flex items-center justify-between px-4 py-2 bg-amber-50 dark:bg-amber-950/30 rounded-xl">
              <div class="flex items-center space-x-2 text-amber-600 dark:text-amber-400">
                <i class="fa-solid fa-clock text-lg"></i>
                <span class="text-xs font-bold">Expected Decision</span>
              </div>
              <span class="text-xs font-extrabold text-amber-700 dark:text-amber-300">18-24 hours</span>
            </div>
          </div>

          <!-- What's Next Section -->
          <div class="text-left space-y-3 py-4">
            <h3 class="text-sm font-heading font-extrabold text-slate-900 dark:text-white">What Happens Next?</h3>
            <div class="space-y-2">
              <div class="flex items-start space-x-3">
                <div class="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center flex-shrink-0 mt-1">
                  <span class="text-xs font-bold text-emerald-700 dark:text-emerald-300">1</span>
                </div>
                <div>
                  <p class="text-xs font-bold text-slate-900 dark:text-white">Our Team Reviews Your Application</p>
                  <p class="text-[11px] text-gray-600 dark:text-gray-400 mt-0.5">An Agrein admin will verify your documents, farm photos, GPS location, and identity information.</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <div class="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center flex-shrink-0 mt-1">
                  <span class="text-xs font-bold text-blue-700 dark:text-blue-300">2</span>
                </div>
                <div>
                  <p class="text-xs font-bold text-slate-900 dark:text-white">We'll Notify You of the Decision</p>
                  <p class="text-[11px] text-gray-600 dark:text-gray-400 mt-0.5">You'll receive an email and in-app notification once your verification is approved or if we need additional information.</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <div class="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center flex-shrink-0 mt-1">
                  <span class="text-xs font-bold text-emerald-700 dark:text-emerald-300">3</span>
                </div>
                <div>
                  <p class="text-xs font-bold text-slate-900 dark:text-white">Start Listing Products</p>
                  <p class="text-[11px] text-gray-600 dark:text-gray-400 mt-0.5">Once approved, you'll unlock access to your Farmer Dashboard and can immediately list crops for sale.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Info Alert -->
          <div class="px-4 py-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 space-y-2">
            <div class="flex items-start space-x-2">
              <i class="fa-solid fa-info-circle text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0"></i>
              <p class="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
                <strong>Stay Updated:</strong> You don't need to do anything right now. We'll automatically notify you when your farm is approved, and you'll be redirected to your dashboard.
              </p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-3 pt-4">
            <button onclick="actions.setView('landing')" class="flex-1 px-6 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-extrabold text-xs transition-all flex items-center justify-center space-x-2">
              <i class="fa-solid fa-home"></i>
              <span>Browse Marketplace</span>
            </button>
            <button onclick="actions.openChatDrawer('Agrein Support')" class="flex-1 px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs transition-all shadow-lg flex items-center justify-center space-x-2">
              <i class="fa-solid fa-headset"></i>
              <span>Contact Support</span>
            </button>
          </div>

          <!-- Refresh Hint -->
          <div class="pt-2 text-center">
            <p class="text-[10px] text-gray-400 dark:text-gray-600">This page updates automatically. You'll be redirected when your verification is approved.</p>
          </div>
        </div>

        <!-- FAQ Section -->
        <div class="glass-card rounded-2xl p-6 border border-gray-200 dark:border-slate-800 space-y-4">
          <h3 class="text-sm font-heading font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
            <i class="fa-solid fa-circle-question text-amber-500"></i>
            <span>Common Questions</span>
          </h3>
          <div class="space-y-3">
            <details class="group">
              <summary class="cursor-pointer flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 text-xs font-bold text-slate-900 dark:text-white">
                <span>Why is verification needed?</span>
                <i class="fa-solid fa-chevron-down text-gray-400 group-open:rotate-180 transition-transform text-[10px]"></i>
              </summary>
              <p class="text-[11px] text-gray-600 dark:text-gray-400 px-3 py-2 bg-slate-50 dark:bg-slate-800/30 rounded-lg mt-1">
                Verification protects our buyers and ensures marketplace integrity. We verify your identity, farm location, and farm size to build trust in the Agrein community.
              </p>
            </details>
            <details class="group">
              <summary class="cursor-pointer flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 text-xs font-bold text-slate-900 dark:text-white">
                <span>Can I edit my application while it's being reviewed?</span>
                <i class="fa-solid fa-chevron-down text-gray-400 group-open:rotate-180 transition-transform text-[10px]"></i>
              </summary>
              <p class="text-[11px] text-gray-600 dark:text-gray-400 px-3 py-2 bg-slate-50 dark:bg-slate-800/30 rounded-lg mt-1">
                Once submitted, your application cannot be edited. However, if we request changes, you'll have the opportunity to provide additional documents or corrections.
              </p>
            </details>
            <details class="group">
              <summary class="cursor-pointer flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 text-xs font-bold text-slate-900 dark:text-white">
                <span>What if my application is rejected?</span>
                <i class="fa-solid fa-chevron-down text-gray-400 group-open:rotate-180 transition-transform text-[10px]"></i>
              </summary>
              <p class="text-[11px] text-gray-600 dark:text-gray-400 px-3 py-2 bg-slate-50 dark:bg-slate-800/30 rounded-lg mt-1">
                If rejected, you can reapply after addressing the rejection reason. Our support team will guide you through the process. Contact us at support@agrein.com
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  `;
}
