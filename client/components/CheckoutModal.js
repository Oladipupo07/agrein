// Simple Checkout Payment Gateway Component for Agrein

function renderCheckoutModal(state, actions) {
  const { checkoutModalActive, checkoutTotal, checkoutItemCount, checkoutProcessing } = state;
  if (!checkoutModalActive) return '';

  const txnRef = `AGR-${Date.now()}`;

  return `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 xs:p-2 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div class="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl xs:rounded-2xl shadow-2xl border border-emerald-500/30 overflow-hidden animate-modal max-h-[90vh] xs:max-h-[95vh] overflow-y-auto">
        
        <!-- Header -->
        <div class="bg-gradient-to-r from-emerald-700 to-emerald-600 p-6 xs:p-5 text-white text-center relative">
          <button onclick="actions.closeCheckout()" class="absolute top-3 xs:top-2 right-3 xs:right-2 w-10 h-10 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors" aria-label="Close">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
          
          <div class="flex items-center justify-center space-x-2 mb-2 xs:mb-1.5">
            <div class="w-10 h-10 rounded-2xl bg-white text-emerald-700 font-extrabold flex items-center justify-center text-lg xs:text-base shadow-lg">
              <i class="fa-solid fa-credit-card"></i>
            </div>
            <div class="text-left">
              <div class="text-[11px] font-extrabold tracking-wider uppercase text-emerald-100">Secure Checkout</div>
              <div class="text-[10px] text-emerald-50">Agrein Marketplace</div>
            </div>
          </div>

          <div class="text-3xl xs:text-2xl font-heading font-extrabold mt-3 xs:mt-2">₦${checkoutTotal.toLocaleString()}</div>
          <div class="text-xs text-emerald-100 font-medium mt-1">Order • ${checkoutItemCount} Item${checkoutItemCount !== 1 ? 's' : ''}</div>
        </div>

        <!-- Modal Body -->
        <div class="p-6 xs:p-5 space-y-5 xs:space-y-4">
          ${checkoutProcessing ? `
            <div class="text-center py-12 space-y-4">
              <div class="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <div class="text-sm font-bold text-slate-900 dark:text-white">Preparing Payment...</div>
              <p class="text-xs text-gray-500">Redirecting to secure payment gateway</p>
            </div>
          ` : `
            <!-- Order Summary -->
            <div class="p-4 xs:p-3 rounded-2xl bg-emerald-50/60 dark:bg-slate-800/60 border border-emerald-500/20 space-y-3 xs:space-y-2">
              <div class="font-bold text-sm xs:text-[13px] text-slate-900 dark:text-white flex items-center space-x-2">
                <i class="fa-solid fa-receipt text-emerald-600"></i>
                <span>Order Summary</span>
              </div>
              <div class="space-y-2 text-xs xs:text-[11px] bg-white dark:bg-slate-700 p-3 rounded-lg">
                <div class="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Items (${checkoutItemCount}):</span>
                  <span class="font-bold text-slate-900 dark:text-white">₦${(checkoutTotal * 0.92).toLocaleString()}</span>
                </div>
                <div class="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Delivery:</span>
                  <span class="font-bold text-slate-900 dark:text-white">₦${Math.round(checkoutTotal * 0.08).toLocaleString()}</span>
                </div>
                <div class="border-t border-gray-200 dark:border-slate-600 pt-2 flex justify-between font-extrabold text-emerald-700 dark:text-emerald-400">
                  <span>Total:</span>
                  <span>₦${checkoutTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <!-- Payment Methods -->
            <div class="space-y-3 xs:space-y-2">
              <div class="font-bold text-sm xs:text-[13px] text-slate-900 dark:text-white">Payment Methods</div>
              <div class="space-y-2 xs:space-y-1.5 text-xs xs:text-[11px]">
                <button onclick="actions.redirectToPaymentGateway('card', ${checkoutTotal})" class="w-full p-3 xs:p-2.5 rounded-xl border-2 border-gray-300 dark:border-slate-600 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors flex items-center space-x-2.5">
                  <i class="fa-solid fa-credit-card text-lg text-emerald-600"></i>
                  <div class="text-left">
                    <div class="font-bold text-slate-900 dark:text-white">Debit/Credit Card</div>
                    <div class="text-gray-500 text-[10px] xs:text-[9px]">Visa, Mastercard, Verve</div>
                  </div>
                </button>

                <button onclick="actions.redirectToPaymentGateway('bank', ${checkoutTotal})" class="w-full p-3 xs:p-2.5 rounded-xl border-2 border-gray-300 dark:border-slate-600 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors flex items-center space-x-2.5">
                  <i class="fa-solid fa-landmark text-lg text-emerald-600"></i>
                  <div class="text-left">
                    <div class="font-bold text-slate-900 dark:text-white">Bank Transfer</div>
                    <div class="text-gray-500 text-[10px] xs:text-[9px]">Direct debit from your bank</div>
                  </div>
                </button>

                <button onclick="actions.redirectToPaymentGateway('ussd', ${checkoutTotal})" class="w-full p-3 xs:p-2.5 rounded-xl border-2 border-gray-300 dark:border-slate-600 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors flex items-center space-x-2.5">
                  <i class="fa-solid fa-mobile text-lg text-emerald-600"></i>
                  <div class="text-left">
                    <div class="font-bold text-slate-900 dark:text-white">USSD</div>
                    <div class="text-gray-500 text-[10px] xs:text-[9px]">Mobile money & bank USSD codes</div>
                  </div>
                </button>

                <button onclick="actions.redirectToPaymentGateway('wallet', ${checkoutTotal})" class="w-full p-3 xs:p-2.5 rounded-xl border-2 border-gray-300 dark:border-slate-600 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors flex items-center space-x-2.5">
                  <i class="fa-solid fa-wallet text-lg text-emerald-600"></i>
                  <div class="text-left">
                    <div class="font-bold text-slate-900 dark:text-white">Digital Wallet</div>
                    <div class="text-gray-500 text-[10px] xs:text-[9px]">Flutterwave, PayPal & others</div>
                  </div>
                </button>
              </div>
            </div>

            <!-- Security Badge -->
            <div class="p-3 xs:p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-[10px] xs:text-[9px] text-blue-800 dark:text-blue-300 flex items-start space-x-2">
              <i class="fa-solid fa-shield-check text-sm flex-shrink-0 mt-0.5"></i>
              <span><strong>100% Secure & Protected.</strong> Your payment is encrypted with 256-bit SSL. Escrow locks funds until delivery confirmation.</span>
            </div>
          `}
        </div>

      </div>
    </div>
  `;
}
