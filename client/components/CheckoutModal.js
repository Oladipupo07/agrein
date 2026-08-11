// Interswitch Payment Gateway Component for Agrein (Inline Checkout & Web Redirect)

function renderCheckoutModal(state, actions) {
  const { interswitchCheckoutActive, interswitchCheckoutAmount, interswitchItemTitle, interswitchProcessing, interswitchSuccess, interswitchMethod } = state;
  if (!interswitchCheckoutActive) return '';

  const activeMethod = interswitchMethod || 'inline';
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
              <div class="text-[11px] font-extrabold tracking-wider uppercase text-amber-300">Interswitch Web Checkout</div>
              <div class="text-[10px] text-gray-200">Official Agrein Merchant Gateway</div>
            </div>
          </div>

          <div class="text-3xl font-heading font-extrabold mt-2">₦${interswitchCheckoutAmount.toLocaleString()}</div>
          <div class="text-xs text-emerald-100 font-medium truncate mt-1">Harvest Order: ${interswitchItemTitle}</div>

          <!-- Card Partner Logos -->
          <div class="flex items-center justify-center space-x-2 mt-3 text-[10px] font-bold text-gray-200">
            <span class="px-2 py-0.5 rounded bg-white/20">Verve</span>
            <span class="px-2 py-0.5 rounded bg-white/20">Visa</span>
            <span class="px-2 py-0.5 rounded bg-white/20">Mastercard</span>
            <span class="px-2 py-0.5 rounded bg-white/20">Quickteller</span>
          </div>
        </div>

        <!-- Modal Body -->
        <div class="p-6 space-y-6">
          ${interswitchSuccess ? `
            <div class="text-center py-6 space-y-4">
              <div class="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 text-3xl flex items-center justify-center mx-auto animate-bounce">
                <i class="fa-solid fa-circle-check"></i>
              </div>
              <h3 class="text-2xl font-heading font-extrabold text-slate-900 dark:text-white">Interswitch Approved!</h3>
              <p class="text-xs text-gray-500">Transaction Reference: <strong class="text-emerald-700 dark:text-emerald-400">${txnRef}</strong>. Escrow locked. Farmer notified for dispatch.</p>
              <button onclick="actions.closeInterswitchCheckout(); actions.switchRole('buyer');" class="w-full py-3.5 rounded-2xl bg-emerald-700 text-white font-extrabold text-xs shadow-lg hover:bg-emerald-800 transition-all">
                View ColdChain Delivery Timeline
              </button>
            </div>
          ` : (interswitchProcessing ? `
            <div class="text-center py-10 space-y-4">
              <div class="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <div class="text-sm font-bold text-slate-900 dark:text-white">Connecting to Interswitch Payment Gateway...</div>
              <p class="text-xs text-gray-500">Verifying 3D-Secure OTP and securing funds in Agrein Escrow.</p>
            </div>
          ` : `
            <div class="space-y-4 text-xs">
              
              <!-- Payment Method Tabs: Inline vs Redirect vs Card/Transfer/USSD -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl text-[10px] font-bold text-center">
                <button onclick="actions.setInterswitchMethod('inline')" class="py-2 rounded-xl transition-all ${activeMethod === 'inline' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-gray-500'}">Inline Widget</button>
                <button onclick="actions.setInterswitchMethod('redirect')" class="py-2 rounded-xl transition-all ${activeMethod === 'redirect' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-gray-500'}">Web Redirect</button>
                <button onclick="actions.setInterswitchMethod('card')" class="py-2 rounded-xl transition-all ${activeMethod === 'card' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-gray-500'}">Card / USSD</button>
              </div>

              ${activeMethod === 'inline' ? `
                <div class="p-4 rounded-2xl bg-emerald-50/60 dark:bg-slate-800/60 border border-emerald-500/20 space-y-3">
                  <div class="flex items-center space-x-2 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                    <i class="fa-solid fa-bolt text-amber-500"></i>
                    <span>Interswitch Inline Checkout Widget</span>
                  </div>
                  <p class="text-[11px] text-gray-500 leading-relaxed">
                    Pay seamlessly without leaving Agrein. Opens the Interswitch popup overlay supporting Cards, Bank Transfer, USSD, and Quickteller Wallets.
                  </p>

                  <button onclick="actions.launchInterswitchInlineSDK('${txnRef}', ${amountInKobo})" class="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-700 via-emerald-800 to-emerald-900 text-white font-extrabold text-xs shadow-xl transition-all text-center flex items-center justify-center space-x-2">
                    <i class="fa-solid fa-layer-group text-amber-300"></i>
                    <span>Launch Interswitch Inline Widget</span>
                  </button>
                </div>
              ` : (activeMethod === 'redirect' ? `
                <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 space-y-3">
                  <div class="flex items-center space-x-2 text-slate-900 dark:text-white font-bold text-xs">
                    <i class="fa-solid fa-arrow-up-right-from-square text-red-600"></i>
                    <span>Interswitch Web Redirect Payment</span>
                  </div>
                  <p class="text-[11px] text-gray-500 leading-relaxed">
                    Redirects directly to Interswitch's secure checkout page (<code>sandbox.interswitchng.com/collections/w/pay</code>). Upon payment completion, Interswitch posts the status back to Agrein via browser redirect.
                  </p>

                  <form method="post" action="https://newwebpay.interswitchng.com/collections/w/pay" class="space-y-2">
                    <input type="hidden" name="merchant_code" value="MX179463" />
                    <input type="hidden" name="pay_item_id" value="7974853" />
                    <input type="hidden" name="pay_item_name" value="${interswitchItemTitle}" />
                    <input type="hidden" name="site_redirect_url" value="${window.location.origin}/#payment-response" />
                    <input type="hidden" name="txn_ref" value="${txnRef}" />
                    <input type="hidden" name="amount" value="${amountInKobo}" />
                    <input type="hidden" name="currency" value="566" />
                    <input type="hidden" name="cust_email" value="buyer@agrein.com" />
                    <input type="hidden" name="cust_name" value="Dr. Anita Okonjo" />

                    <button type="submit" class="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-700 to-red-900 text-white font-extrabold text-xs shadow-xl transition-all flex items-center justify-center space-x-2">
                      <i class="fa-solid fa-paper-plane text-amber-300"></i>
                      <span>Redirect to Interswitch Webpay</span>
                    </button>
                  </form>
                </div>
              ` : `
                <div class="space-y-3">
                  <div>
                    <label class="font-bold text-gray-500">Card Number (Verve / Visa / Mastercard)</label>
                    <div class="relative mt-1">
                      <input type="text" value="5061 14•• •••• 9012" readonly class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-xs font-bold text-slate-900 dark:text-white">
                      <i class="fa-solid fa-credit-card absolute left-3 top-3 text-red-600"></i>
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-2">
                    <div>
                      <label class="font-bold text-gray-500">Expiry Date</label>
                      <input type="text" value="11 / 28" readonly class="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-xs font-bold text-slate-900 dark:text-white text-center">
                    </div>
                    <div>
                      <label class="font-bold text-gray-500">CVV Pin</label>
                      <input type="text" value="•••" readonly class="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-xs font-bold text-slate-900 dark:text-white text-center">
                    </div>
                  </div>

                  <button onclick="actions.executeInterswitchPayment()" class="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-700 via-emerald-800 to-emerald-900 text-white font-extrabold text-xs shadow-xl transition-all flex items-center justify-center space-x-2">
                    <i class="fa-solid fa-shield-check text-amber-300"></i>
                    <span>Pay ₦${interswitchCheckoutAmount.toLocaleString()} via Interswitch</span>
                  </button>
                </div>
              `)}
            </div>
          `)}
        </div>

      </div>
    </div>
  `;
}
