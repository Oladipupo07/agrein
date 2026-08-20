// Interswitch Web Checkout Modal Component for Agrein

function renderCheckoutModal(state, actions) {
  const { checkoutModalActive, checkoutTotal, checkoutItemCount, checkoutProcessing } = state;
  if (!checkoutModalActive) return '';

  return `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 xs:p-2 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div class="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl xs:rounded-2xl shadow-2xl border border-emerald-500/30 overflow-hidden animate-modal max-h-[90vh] xs:max-h-[95vh] flex flex-col">
        
        <!-- Header -->
        <div class="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 p-6 xs:p-5 text-white text-center relative flex-shrink-0">
          <button onclick="actions.closeCheckout()" class="absolute top-3 xs:top-2 right-3 xs:right-2 w-10 h-10 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors" aria-label="Close">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
          
          <div class="flex items-center justify-center space-x-2 mb-2 xs:mb-1.5">
            <div class="w-10 h-10 rounded-2xl bg-white text-emerald-700 font-extrabold flex items-center justify-center text-lg xs:text-base shadow-lg">
              <i class="fa-solid fa-shield-halved"></i>
            </div>
            <div class="text-left">
              <div class="text-[11px] font-extrabold tracking-wider uppercase text-emerald-100">Interswitch Web Checkout</div>
              <div class="text-[10px] text-emerald-50">Agrein Secure Escrow</div>
            </div>
          </div>

          <div class="text-3xl xs:text-2xl font-heading font-extrabold mt-3 xs:mt-2">₦${checkoutTotal.toLocaleString()}</div>
          <div class="text-xs text-emerald-100 font-medium mt-1">Order • ${checkoutItemCount} Item${checkoutItemCount !== 1 ? 's' : ''}</div>
        </div>

        <!-- Modal Body -->
        <div class="p-6 xs:p-5 space-y-5 xs:space-y-4 overflow-y-auto flex-1">
          ${checkoutProcessing ? `
            <div class="text-center py-12 space-y-4">
              <div class="w-14 h-14 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <div class="text-base font-bold text-slate-900 dark:text-white">Connecting to Interswitch...</div>
              <p class="text-xs text-gray-500 max-w-xs mx-auto">Redirecting you to the secure Interswitch payment gateway. Please wait...</p>
            </div>
          ` : `
            <!-- Order Summary -->
            <div class="p-4 xs:p-3 rounded-2xl bg-emerald-50/60 dark:bg-slate-800/60 border border-emerald-500/20 space-y-3 xs:space-y-2">
              <div class="font-bold text-sm xs:text-[13px] text-slate-900 dark:text-white flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <i class="fa-solid fa-receipt text-emerald-600"></i>
                  <span>Order Summary</span>
                </div>
                <span class="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300">Escrow Locked</span>
              </div>
              <div class="space-y-2 text-xs xs:text-[11px] bg-white dark:bg-slate-700 p-3 rounded-xl">
                <div class="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Items Subtotal:</span>
                  <span class="font-bold text-slate-900 dark:text-white">₦${(checkoutTotal * 0.92).toLocaleString()}</span>
                </div>
                <div class="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Estimated Delivery & Escrow Insurance:</span>
                  <span class="font-bold text-slate-900 dark:text-white">₦${Math.round(checkoutTotal * 0.08).toLocaleString()}</span>
                </div>
                <div class="border-t border-gray-200 dark:border-slate-600 pt-2 flex justify-between font-extrabold text-emerald-700 dark:text-emerald-400 text-sm">
                  <span>Amount Due:</span>
                  <span>₦${checkoutTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <!-- Interswitch Web Redirect Primary Action -->
            <div class="space-y-3">
              <button onclick="actions.initiateWebRedirectCheckout('all', ${checkoutTotal})" class="w-full py-4 xs:py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 hover:from-emerald-800 hover:to-teal-700 text-white font-extrabold text-sm shadow-xl hover:shadow-2xl transition-all active:scale-98 flex items-center justify-center space-x-3">
                <i class="fa-solid fa-lock text-amber-300"></i>
                <span>Make Payment via Interswitch (Web Redirect)</span>
                <i class="fa-solid fa-arrow-right text-xs opacity-75"></i>
              </button>
              <p class="text-[11px] xs:text-[10px] text-gray-500 text-center">
                Redirects to Interswitch secure page. Supports Card, Bank, USSD, Wallets, and GooglePay.
              </p>
            </div>

            <!-- Payment Methods List (All redirect to Interswitch) -->
            <div class="space-y-3 xs:space-y-2 pt-2">
              <div class="font-bold text-xs xs:text-[12px] uppercase tracking-wider text-gray-500 dark:text-gray-400">Or Select Direct Channel</div>
              <div class="grid grid-cols-2 gap-2 text-xs xs:text-[11px]">
                <button onclick="actions.initiateWebRedirectCheckout('card', ${checkoutTotal})" class="p-3 xs:p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-slate-800 transition-all flex items-center space-x-2 text-left group">
                  <div class="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <i class="fa-solid fa-credit-card"></i>
                  </div>
                  <div>
                    <div class="font-bold text-slate-900 dark:text-white">Debit / Credit Card</div>
                    <div class="text-gray-400 text-[10px]">Visa, Verve, Master</div>
                  </div>
                </button>

                <button onclick="actions.initiateWebRedirectCheckout('bank', ${checkoutTotal})" class="p-3 xs:p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-slate-800 transition-all flex items-center space-x-2 text-left group">
                  <div class="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <i class="fa-solid fa-landmark"></i>
                  </div>
                  <div>
                    <div class="font-bold text-slate-900 dark:text-white">Bank Transfer</div>
                    <div class="text-gray-400 text-[10px]">Direct Bank Debit</div>
                  </div>
                </button>

                <button onclick="actions.initiateWebRedirectCheckout('ussd', ${checkoutTotal})" class="p-3 xs:p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-slate-800 transition-all flex items-center space-x-2 text-left group">
                  <div class="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <i class="fa-solid fa-mobile-screen"></i>
                  </div>
                  <div>
                    <div class="font-bold text-slate-900 dark:text-white">USSD & QR</div>
                    <div class="text-gray-400 text-[10px]">Bank USSD Codes</div>
                  </div>
                </button>

                <button onclick="actions.initiateWebRedirectCheckout('wallet', ${checkoutTotal})" class="p-3 xs:p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-slate-800 transition-all flex items-center space-x-2 text-left group">
                  <div class="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <i class="fa-solid fa-wallet"></i>
                  </div>
                  <div>
                    <div class="font-bold text-slate-900 dark:text-white">Digital Wallet</div>
                    <div class="text-gray-400 text-[10px]">Quickteller, GPay</div>
                  </div>
                </button>
              </div>
            </div>

            <!-- Escrow Security Notice -->
            <div class="p-3 xs:p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-[11px] xs:text-[10px] text-blue-800 dark:text-blue-300 flex items-start space-x-2">
              <i class="fa-solid fa-shield-check text-sm flex-shrink-0 mt-0.5 text-blue-600"></i>
              <span><strong>Protected by Agrein Escrow:</strong> Your funds are securely held and only released to the farmer after you inspect and accept the harvest delivery.</span>
            </div>
          `}
        </div>

      </div>
    </div>
  `;
}
