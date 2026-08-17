// Shopping Cart Drawer Component for Agrein — Simplified Checkout

function renderCartDrawer(state, actions) {
  const { cartOpen, cart } = state;
  if (!cartOpen) return '';

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.cartQty), 0);
  const estimatedLogistics = cart.length > 0 ? Math.round(subtotal * 0.08) : 0;
  const totalAmount = subtotal + estimatedLogistics;

  return `
    <div class="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm animate-fade-in xs:p-2 sm:p-0">
      <div class="w-full max-w-md bg-white dark:bg-slate-900 h-full xs:rounded-2xl sm:rounded-none shadow-2xl flex flex-col justify-between border-l border-emerald-500/20 animate-modal xs:max-h-[95vh] sm:max-h-screen overflow-y-auto">
        
        <!-- Header -->
        <div class="p-4 xs:p-5 sm:p-6 glass-panel flex items-center justify-between border-b border-gray-200 dark:border-slate-800 sticky top-0 z-10">
          <div class="flex items-center space-x-2 xs:space-x-1.5">
            <i class="fa-solid fa-basket-shopping text-emerald-600 text-lg xs:text-base"></i>
            <h3 class="font-heading font-extrabold xs:text-lg sm:text-xl text-slate-900 dark:text-white">Cart</h3>
            <span class="px-2 xs:px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 xs:text-[10px] sm:text-xs font-bold">${cart.length}</span>
          </div>
          <button onclick="actions.toggleCartDrawer()" class="text-gray-400 hover:text-slate-900 dark:hover:text-white p-2 -m-2" aria-label="Close cart">
            <i class="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        <!-- Cart Items List -->
        <div class="p-4 xs:p-5 sm:p-6 flex-1 overflow-y-auto space-y-3 xs:space-y-2.5">
          ${cart.length === 0 ? `
            <div class="text-center py-16 space-y-3">
              <div class="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center text-2xl mx-auto">
                <i class="fa-solid fa-cart-flatbed font-light"></i>
              </div>
              <h4 class="font-bold text-gray-800 dark:text-gray-200 text-sm xs:text-base">Cart Empty</h4>
              <p class="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">Browse the marketplace and add fresh crops.</p>
              <button onclick="actions.toggleCartDrawer(); actions.setView('marketplace');" class="px-6 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold shadow-md hover:bg-emerald-800 transition-colors">Browse Now</button>
            </div>
          ` : cart.map(item => `
            <div class="p-3 xs:p-2.5 rounded-2xl glass-card flex items-start space-x-3 xs:space-x-2.5 border border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
              <img src="${item.image}" alt="${item.title}" class="w-20 h-20 xs:w-16 xs:h-16 rounded-xl object-cover flex-shrink-0">
              
              <div class="flex-1 min-w-0 space-y-1">
                <h4 class="font-bold text-xs xs:text-[11px] text-slate-900 dark:text-white line-clamp-2">${item.title}</h4>
                <div class="text-[11px] xs:text-[10px] text-gray-500 line-clamp-1">${item.farmName}</div>
                <div class="text-xs font-extrabold text-emerald-700 dark:text-emerald-400">₦${(item.price * item.cartQty).toLocaleString()}</div>

                <div class="flex items-center justify-between pt-1 flex-wrap gap-1">
                  <div class="flex items-center space-x-1 bg-gray-100 dark:bg-slate-800 rounded-lg p-0.5">
                    <button onclick="actions.updateCartQty('${item.id}', -10)" class="w-8 h-8 xs:w-7 xs:h-7 rounded bg-gray-200 dark:bg-slate-700 font-bold text-xs flex items-center justify-center active:scale-95 hover:bg-gray-300" aria-label="Decrease">−</button>
                    <span class="text-xs font-bold text-slate-900 dark:text-white min-w-[2rem] text-center">${item.cartQty}</span>
                    <button onclick="actions.updateCartQty('${item.id}', 10)" class="w-8 h-8 xs:w-7 xs:h-7 rounded bg-gray-200 dark:bg-slate-700 font-bold text-xs flex items-center justify-center active:scale-95 hover:bg-gray-300" aria-label="Increase">+</button>
                  </div>

                  <button onclick="actions.removeFromCart('${item.id}')" class="text-red-500 hover:text-red-700 text-xs font-semibold p-1.5 -m-1.5" aria-label="Remove">
                    <i class="fa-solid fa-trash-can text-sm"></i>
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Footer: Summary & Checkout Button -->
        ${cart.length > 0 ? `
          <div class="p-4 xs:p-5 sm:p-6 glass-panel border-t border-gray-200 dark:border-slate-800 space-y-3 sticky bottom-0 bg-white dark:bg-slate-900 z-10">
            <div class="space-y-1.5 text-xs xs:text-[11px] text-gray-600 dark:text-gray-400">
              <div class="flex justify-between">
                <span>Subtotal:</span>
                <span class="font-bold text-slate-900 dark:text-white">₦${subtotal.toLocaleString()}</span>
              </div>
              <div class="flex justify-between">
                <span>Delivery (Est.):</span>
                <span class="font-bold text-slate-900 dark:text-white">₦${estimatedLogistics.toLocaleString()}</span>
              </div>
              <div class="flex justify-between pt-2 border-t border-gray-200 dark:border-slate-700 text-sm font-extrabold text-emerald-700 dark:text-emerald-400">
                <span>Total:</span>
                <span>₦${totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <button onclick="if(!state.currentUser){ actions.openAuthModal('login'); return; } actions.proceedToPayment(${totalAmount});" class="w-full py-3.5 xs:py-3 rounded-2xl bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-800 hover:to-emerald-700 text-white font-extrabold text-xs xs:text-[13px] shadow-lg hover:shadow-xl transition-all active:scale-98">
              <i class="fa-solid fa-lock text-amber-300 mr-2"></i>
              <span>Proceed to Payment</span>
            </button>

            <p class="text-[10px] xs:text-[9px] text-gray-500 text-center">100% Escrow Protected • Cold-Chain Guaranteed</p>
          </div>
        ` : ''}

      </div>
    </div>
  `;
}
