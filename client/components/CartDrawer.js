// Shopping Cart Drawer Component for Agrein

function renderCartDrawer(state, actions) {
  const { cartOpen, cart } = state;
  if (!cartOpen) return '';

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.cartQty), 0);
  const estimatedLogistics = cart.length > 0 ? Math.round(subtotal * 0.08) : 0;
  const totalAmount = subtotal + estimatedLogistics;

  return `
    <div class="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div class="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col justify-between border-l border-emerald-500/20 animate-modal">
        
        <!-- Header -->
        <div class="p-6 glass-panel flex items-center justify-between border-b border-gray-200 dark:border-slate-800">
          <div class="flex items-center space-x-2">
            <i class="fa-solid fa-basket-shopping text-emerald-600 text-xl"></i>
            <h3 class="font-heading font-extrabold text-xl text-slate-900 dark:text-white">Procurement Cart</h3>
            <span class="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold">${cart.length} Harvest Items</span>
          </div>
          <button onclick="actions.toggleCartDrawer()" class="text-gray-400 hover:text-slate-900 dark:hover:text-white p-2">
            <i class="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        <!-- Cart Items List -->
        <div class="p-6 flex-1 overflow-y-auto space-y-4">
          ${cart.length === 0 ? `
            <div class="text-center py-16 space-y-3">
              <div class="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center text-2xl mx-auto">
                <i class="fa-solid fa-cart-flatbed font-light"></i>
              </div>
              <h4 class="font-bold text-gray-800 dark:text-gray-200">Your Cart is Empty</h4>
              <p class="text-xs text-gray-500 max-w-xs mx-auto">Browse the marketplace and add fresh crop harvests direct from local farmers.</p>
              <button onclick="actions.toggleCartDrawer(); actions.setView('marketplace');" class="px-6 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold shadow-md">Explore Harvests</button>
            </div>
          ` : cart.map(item => `
            <div class="p-4 rounded-2xl glass-card flex items-center space-x-4 border border-emerald-500/20 relative">
              <img src="${item.image}" alt="${item.title}" class="w-16 h-16 rounded-xl object-cover">
              
              <div class="flex-1 space-y-1">
                <h4 class="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">${item.title}</h4>
                <div class="text-[11px] text-gray-500">${item.farmName} • ${item.originState}</div>
                <div class="text-xs font-extrabold text-emerald-800 dark:text-emerald-400">₦${(item.price * item.cartQty).toLocaleString()}</div>

                <div class="flex items-center justify-between pt-1">
                  <div class="flex items-center space-x-2">
                    <button onclick="actions.updateCartQty('${item.id}', -10)" class="w-6 h-6 rounded bg-gray-200 dark:bg-slate-700 font-bold text-xs flex items-center justify-center">-</button>
                    <span class="text-xs font-bold text-slate-900 dark:text-white">${item.cartQty} ${item.unit}s</span>
                    <button onclick="actions.updateCartQty('${item.id}', 10)" class="w-6 h-6 rounded bg-gray-200 dark:bg-slate-700 font-bold text-xs flex items-center justify-center">+</button>
                  </div>

                  <button onclick="actions.removeFromCart('${item.id}')" class="text-red-500 hover:text-red-700 text-xs font-semibold">
                    <i class="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Footer Summary & Interswitch Direct Checkout -->
        ${cart.length > 0 ? `
          <div class="p-6 glass-panel border-t border-gray-200 dark:border-slate-800 space-y-4">
            <div class="space-y-1.5 text-xs text-gray-600 dark:text-gray-400">
              <div class="flex justify-between">
                <span>Subtotal:</span>
                <span class="font-bold text-slate-900 dark:text-white">₦${subtotal.toLocaleString()}</span>
              </div>
              <div class="flex justify-between">
                <span>Agrein ColdChain Delivery (Est.):</span>
                <span class="font-bold text-slate-900 dark:text-white">₦${estimatedLogistics.toLocaleString()}</span>
              </div>
              <div class="flex justify-between pt-2 border-t border-gray-200 dark:border-slate-700 text-sm font-extrabold text-emerald-800 dark:text-emerald-400">
                <span>Total Amount:</span>
                <span>₦${totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <button onclick="actions.toggleCartDrawer(); actions.initiateInterswitchCheckout(${totalAmount}, 'Agrein Bulk Harvest Order (${cart.length} Items)');" class="w-full py-4 rounded-2xl bg-gradient-to-r from-red-700 via-emerald-800 to-emerald-700 hover:from-red-800 hover:to-emerald-800 text-white font-extrabold text-xs shadow-xl shadow-emerald-700/30 transition-all text-center flex items-center justify-center space-x-2">
              <i class="fa-solid fa-lock text-amber-300"></i>
              <span>Interswitch Webpay Checkout</span>
            </button>
          </div>
        ` : ''}

      </div>
    </div>
  `;
}
