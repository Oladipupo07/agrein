// Interswitch Inline Checkout Widget Payment Gateway for Agrein

function renderCheckoutModal(state, actions) {
  const { interswitchCheckoutActive, interswitchCheckoutAmount, interswitchItemTitle, interswitchProcessing, interswitchSuccess } = state;
  if (!interswitchCheckoutActive) return '';

  const txnRef = `AGR-ISW-${Date.now()}`;
  const amountInKobo = Math.round((interswitchCheckoutAmount || 0) * 100);

  return `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div class="modal-fullscreen-mobile relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-emerald-500/30 overflow-hidden animate-modal max-h-[92vh] overflow-y-auto">
        
        <!-- Interswitch Header -->
        <div class="bg-gradient-to-r from-red-700 via-emerald-800 to-emerald-900 p-6 text-white text-center relative">
          <button onclick="actions.closeInterswitchCheckout()" class="absolute top-2 right-2 w-10 h-10 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors" aria-label="Close checkout">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
          
          <div class="flex items-center justify-center space-x-2 mb-2">
            <div class="w-10 h-10 rounded-2xl bg-white text-red-700 font-extrabold flex items-center justify-center text-lg shadow-lg">
              <i class="fa-solid fa-credit-card"></i>
            </div>
            <div class="text-left">
              <div class="text-[11px] font-extrabold tracking-wider uppercase text-amber-300">Secure Checkout</div>
              <div class="text-[10px] text-gray-200">Agrein Payment Gateway</div>
            </div>
          </div>

          <div class="text-3xl font-heading font-extrabold mt-2">₦${interswitchCheckoutAmount.toLocaleString()}</div>
          <div class="text-xs text-emerald-100 font-medium truncate mt-1">Order: ${interswitchItemTitle}</div>

          <!-- Payment Method Logos -->
          <div class="flex items-center justify-center space-x-2 mt-3 text-[10px] font-bold text-gray-200">
            <span class="px-2 py-0.5 rounded bg-white/20"><i class="fa-solid fa-credit-card mr-1"></i>Cards</span>
            <span class="px-2 py-0.5 rounded bg-white/20"><i class="fa-solid fa-mobile mr-1"></i>USSD</span>
            <span class="px-2 py-0.5 rounded bg-white/20"><i class="fa-solid fa-landmark mr-1"></i>Transfers</span>
          </div>
        </div>

        <!-- Modal Body -->
        <div class="p-6 space-y-6">
          ${interswitchSuccess ? `
            <div class="text-center py-6 space-y-4">
              <div class="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 text-3xl flex items-center justify-center mx-auto animate-bounce">
                <i class="fa-solid fa-circle-check"></i>
              </div>
              <h3 class="text-2xl font-heading font-extrabold text-slate-900 dark:text-white">Payment Successful! 🎉</h3>
              <p class="text-xs text-gray-500">Transaction Reference: <strong class="text-emerald-700 dark:text-emerald-400">${txnRef}</strong></p>
              <p class="text-xs text-gray-600 dark:text-gray-300">Your order has been confirmed. Escrow locked. Farmer notified for dispatch.</p>
              <button onclick="actions.closeInterswitchCheckout(); actions.guardView('buyer-dashboard');" class="w-full py-3.5 rounded-2xl bg-emerald-700 text-white font-extrabold text-xs shadow-lg hover:bg-emerald-800 transition-all">
                View Delivery Timeline
              </button>
            </div>
          ` : (interswitchProcessing ? `
            <div class="text-center py-10 space-y-4">
              <div class="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <div class="text-sm font-bold text-slate-900 dark:text-white">Processing Payment...</div>
              <p class="text-xs text-gray-500">Securely processing your payment. Please wait...</p>
            </div>
          ` : `
            <div class="space-y-4 text-xs">
              <div class="p-4 rounded-2xl bg-emerald-50/60 dark:bg-slate-800/60 border border-emerald-500/20 space-y-4">
                <div class="flex items-center space-x-2 text-emerald-700 dark:text-emerald-300 font-bold">
                  <i class="fa-solid fa-bolt text-amber-500"></i>
                  <span>Inline Checkout Widget</span>
                </div>
                <p class="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed">
                  Complete your payment securely. Supports debit cards (Verve, Visa, Mastercard), bank transfers, USSD codes, and mobile wallets. Your payment is protected with 256-bit SSL encryption.
                </p>

                <div class="bg-white dark:bg-slate-700 p-3 rounded-xl space-y-2 text-[10px]">
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-300">Subtotal:</span>
                    <span class="font-bold text-slate-900 dark:text-white">₦${interswitchCheckoutAmount.toLocaleString()}</span>
                  </div>
                  <div class="flex justify-between border-t border-gray-200 dark:border-slate-600 pt-2">
                    <span class="font-bold text-slate-900 dark:text-white">Total Amount:</span>
                    <span class="font-extrabold text-emerald-700 dark:text-emerald-400 text-xs">₦${interswitchCheckoutAmount.toLocaleString()}</span>
                  </div>
                </div>

                <button onclick="actions.launchInterswitchInlineSDK('${txnRef}', ${amountInKobo})" class="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-700 via-emerald-800 to-emerald-900 text-white font-extrabold text-xs shadow-xl hover:shadow-2xl transition-all flex items-center justify-center space-x-2">
                  <i class="fa-solid fa-lock text-amber-300"></i>
                  <span>Proceed to Payment</span>
                </button>

                <p class="text-[10px] text-gray-400 text-center">
                  <i class="fa-solid fa-shield-check mr-1"></i> Secure transaction powered by Interswitch
                </p>
              </div>
            </div>
          `)}
        </div>

      </div>
    </div>
  `;
}
