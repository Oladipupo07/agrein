// Wishlist Drawer Component for Agrein — Saved Farm Produce Management
// Allows buyers & visitors to view, manage, and move saved crops directly to cart with responsive mobile & desktop UX.

function renderWishlistDrawer(state, actions) {
  const { wishlistOpen, wishlist, mockData } = state;
  if (!wishlistOpen) return '';

  const allProducts = (mockData && mockData.products) || [];
  const wishlistedProducts = allProducts.filter(p => wishlist && wishlist.includes(p.id));

  return `
    <div class="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm animate-fade-in xs:p-2 sm:p-0">
      <!-- Backdrop click to close -->
      <div class="fixed inset-0" onclick="actions.closeWishlistDrawer()"></div>

      <div class="relative z-10 w-full max-w-md bg-white dark:bg-slate-900 h-full xs:rounded-2xl sm:rounded-none shadow-2xl flex flex-col justify-between border-l border-rose-500/20 animate-modal xs:max-h-[95vh] sm:max-h-screen overflow-hidden">
        
        <!-- Header -->
        <div class="p-4 xs:p-5 sm:p-6 glass-panel flex items-center justify-between border-b border-gray-200 dark:border-slate-800 sticky top-0 z-10">
          <div class="flex items-center space-x-2 xs:space-x-1.5">
            <div class="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center text-lg">
              <i class="fa-solid fa-heart"></i>
            </div>
            <div>
              <h3 class="font-heading font-extrabold xs:text-lg sm:text-xl text-slate-900 dark:text-white leading-tight">My Wishlist</h3>
              <p class="text-[10px] text-gray-500">Saved crops & farm produce</p>
            </div>
            <span class="px-2 xs:px-1.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 text-xs font-bold ml-1">${wishlist.length}</span>
          </div>
          <button onclick="actions.closeWishlistDrawer()" class="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors" aria-label="Close Wishlist">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <!-- Wishlist Content Area -->
        <div class="p-4 xs:p-5 sm:p-6 flex-1 overflow-y-auto space-y-3">
          ${wishlistedProducts.length === 0 ? `
            <!-- Empty State -->
            <div class="text-center py-16 px-4 space-y-4">
              <div class="w-20 h-20 rounded-full bg-rose-50 dark:bg-rose-950/30 text-rose-500 flex items-center justify-center text-3xl mx-auto shadow-inner border border-rose-200 dark:border-rose-900/40 animate-pulse">
                <i class="fa-regular fa-heart"></i>
              </div>
              <div class="space-y-1.5 max-w-xs mx-auto">
                <h4 class="font-heading font-extrabold text-slate-900 dark:text-white text-base sm:text-lg">No Items in Your Wishlist</h4>
                <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  You haven't saved any farm products yet. Tap the heart icon <i class="fa-regular fa-heart text-rose-500 text-xs"></i> on any crop in the marketplace to save it here for later.
                </p>
              </div>
              <div class="pt-2">
                <button onclick="actions.closeWishlistDrawer(); actions.setView('marketplace');" class="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-800 hover:to-emerald-700 text-white text-xs font-extrabold shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2 mx-auto">
                  <i class="fa-solid fa-store text-amber-300"></i>
                  <span>Explore Marketplace</span>
                </button>
              </div>
            </div>
          ` : wishlistedProducts.map(product => {
            const inCart = state.cart.some(item => item.id === product.id);

            return `
              <div class="p-3.5 rounded-2xl glass-card border border-rose-500/20 hover:border-rose-500/40 transition-all flex flex-col space-y-2.5">
                <div class="flex items-start space-x-3">
                  <!-- Product Image -->
                  <div class="relative w-20 h-20 xs:w-16 xs:h-16 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-800 cursor-pointer" onclick="actions.closeWishlistDrawer(); actions.openProductModal('${product.id}')">
                    <img src="${product.image}" alt="${product.title}" class="w-full h-full object-cover hover:scale-105 transition-transform duration-300">
                    ${product.organic ? `
                      <span class="absolute bottom-1 left-1 px-1.5 py-0.2 rounded bg-emerald-600/90 text-white text-[8px] font-extrabold">ECO</span>
                    ` : ''}
                  </div>

                  <!-- Product Details -->
                  <div class="flex-1 min-w-0 space-y-1">
                    <div class="flex items-start justify-between gap-1">
                      <h4 onclick="actions.closeWishlistDrawer(); actions.openProductModal('${product.id}')" class="font-bold text-xs xs:text-[11px] text-slate-900 dark:text-white line-clamp-1 hover:text-emerald-600 cursor-pointer">
                        ${product.title}
                      </h4>
                      <button onclick="actions.toggleWishlist('${product.id}')" class="text-rose-500 hover:text-rose-700 p-1 -m-1 transition-colors flex-shrink-0" title="Remove from wishlist">
                        <i class="fa-solid fa-heart text-sm"></i>
                      </button>
                    </div>

                    <div class="text-[11px] xs:text-[10px] text-gray-500 flex items-center space-x-1">
                      <i class="fa-solid fa-location-dot text-emerald-600 text-[9px]"></i>
                      <span class="truncate">${product.farmName || 'Verified Farm'}, ${product.originState || 'Nigeria'}</span>
                    </div>

                    <div class="flex items-baseline space-x-1 pt-0.5">
                      <span class="text-sm font-extrabold text-emerald-700 dark:text-emerald-400">₦${product.price?.toLocaleString()}</span>
                      <span class="text-[10px] text-gray-500">/ ${product.unit || 'kg'}</span>
                    </div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="grid grid-cols-2 gap-2 pt-1 border-t border-gray-100 dark:border-slate-800/80">
                  <button onclick="actions.moveWishlistToCart('${product.id}')" class="py-2 px-3 rounded-xl ${inCart ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' : 'bg-emerald-700 hover:bg-emerald-800 text-white'} text-[11px] font-extrabold shadow-sm transition-all flex items-center justify-center space-x-1.5">
                    <i class="fa-solid ${inCart ? 'fa-circle-check text-emerald-600' : 'fa-cart-plus'} text-xs"></i>
                    <span>${inCart ? 'In Cart (+10)' : 'Add to Cart'}</span>
                  </button>

                  <button onclick="actions.closeWishlistDrawer(); actions.openProductModal('${product.id}')" class="py-2 px-3 rounded-xl border border-gray-200 dark:border-slate-700 text-slate-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 text-[11px] font-bold transition-all flex items-center justify-center space-x-1">
                    <i class="fa-solid fa-eye text-xs"></i>
                    <span>View Details</span>
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Footer: Multi-Item Actions -->
        ${wishlistedProducts.length > 0 ? `
          <div class="p-4 xs:p-5 sm:p-6 glass-panel border-t border-gray-200 dark:border-slate-800 space-y-2.5 sticky bottom-0 bg-white dark:bg-slate-900 z-10">
            <button onclick="actions.moveAllWishlistToCart()" class="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-800 hover:to-emerald-700 text-white font-extrabold text-xs shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2">
              <i class="fa-solid fa-cart-shopping text-amber-300"></i>
              <span>Move All to Cart (${wishlistedProducts.length})</span>
            </button>

            <div class="flex items-center justify-between text-xs text-gray-500 pt-1">
              <button onclick="actions.clearWishlist()" class="hover:text-red-600 font-bold transition-colors">
                <i class="fa-solid fa-trash-can mr-1"></i> Clear Wishlist
              </button>
              <button onclick="actions.closeWishlistDrawer(); actions.setView('marketplace');" class="hover:text-emerald-600 font-bold transition-colors">
                Continue Shopping &rarr;
              </button>
            </div>
          </div>
        ` : ''}

      </div>
    </div>
  `;
}
