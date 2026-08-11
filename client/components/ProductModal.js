// Product Detailed Modal Component for Agrein

function renderProductModal(state, actions) {
  const { activeModalProductId, modalQty } = state;
  if (!activeModalProductId) return '';

  const product = state.mockData.products.find(p => p.id === activeModalProductId);
  if (!product) return '';

  const subtotal = product.price * modalQty;
  const estimatedLogistics = Math.round(subtotal * 0.08); // 8% ColdChain logistics
  const grandTotal = subtotal + estimatedLogistics;

  return `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div class="modal-fullscreen-mobile relative w-full max-w-4xl glass-panel bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-emerald-500/20 overflow-hidden my-8 animate-modal">
        
        <!-- Modal Close Button -->
        <button onclick="actions.closeProductModal()" class="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-slate-900/40 text-white flex items-center justify-center hover:bg-slate-900 transition-all">
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>

        <div class="grid grid-cols-1 md:grid-cols-12">
          
          <!-- Left: Product Image & Badges -->
          <div class="md:col-span-5 relative bg-slate-100 dark:bg-slate-800 min-h-[220px] max-h-[40vh] md:max-h-none md:min-h-full">
            <img src="${product.image}" alt="${product.title}" class="w-full h-full object-cover">
            
            <div class="absolute top-4 left-4 flex flex-col space-y-2">
              <span class="px-3 py-1 rounded-xl bg-emerald-700 text-white text-xs font-extrabold shadow-lg">
                <i class="fa-solid fa-leaf text-amber-300 mr-1"></i> ${product.category}
              </span>
              ${product.isOrganic ? `<span class="px-3 py-1 rounded-xl bg-amber-500 text-slate-950 text-xs font-extrabold shadow-lg">Certified Organic</span>` : ''}
            </div>

            <div class="absolute bottom-4 left-4 right-4 glass-card p-3 rounded-2xl text-xs text-slate-900 dark:text-white flex items-center justify-between">
              <div>
                <span class="text-gray-500 dark:text-gray-400">Harvest Date:</span>
                <span class="font-bold ml-1">${product.harvestDate}</span>
              </div>
              <span class="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold text-[10px]">Fresh Batch</span>
            </div>
          </div>

          <!-- Right: Product Info & Dynamic Purchasing -->
          <div class="md:col-span-7 p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto">
            
            <div>
              <div class="flex items-center space-x-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-1">
                <i class="fa-solid fa-location-dot"></i>
                <span>${product.originState} State • ${product.farmName}</span>
              </div>
              
              <h2 class="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 dark:text-white">
                ${product.title}
              </h2>

              <div class="flex items-center space-x-4 mt-2 text-xs text-gray-600 dark:text-gray-300">
                <span class="flex items-center space-x-1 text-amber-400 font-bold">
                  <i class="fa-solid fa-star"></i>
                  <span class="text-slate-900 dark:text-white ml-1">${product.rating}</span>
                </span>
                <span>(${product.reviewCount} Verified Buyer Reviews)</span>
                <span class="text-emerald-600 dark:text-emerald-400 font-semibold"><i class="fa-solid fa-shield-check"></i> Interswitch Escrow Protected</span>
              </div>
            </div>

            <!-- Price Breakdown -->
            <div class="p-4 rounded-2xl bg-emerald-50/60 dark:bg-slate-800/60 border border-emerald-500/20 space-y-2">
              <div class="flex items-baseline justify-between">
                <div>
                  <span class="text-3xl font-heading font-extrabold text-emerald-800 dark:text-emerald-400">₦${product.price.toLocaleString()}</span>
                  <span class="text-xs text-gray-500 font-semibold">/ ${product.unit}</span>
                </div>
                <span class="text-xs font-bold text-gray-600 dark:text-gray-300">Available: ${product.availableQty.toLocaleString()} ${product.unit}s</span>
              </div>
              <p class="text-[11px] text-gray-500 dark:text-gray-400">Minimum Order Requirement: <strong class="text-slate-900 dark:text-white">${product.minQty} ${product.unit}s</strong></p>
            </div>

            <!-- Farmer Profile & Verification Trust Box -->
            <div class="p-4 rounded-2xl glass-panel border border-emerald-500/20 space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 rounded-xl bg-emerald-700 text-white font-extrabold flex items-center justify-center text-sm shadow-md">
                    ${product.farmerName.charAt(0)}
                  </div>
                  <div>
                    <div class="text-xs font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                      <span>${product.farmerName}</span>
                      ${renderVerifiedBadgeCompact(product.verifiedFarmer)}
                    </div>
                    <div class="text-[10px] text-gray-500 dark:text-gray-400">${product.farmName} • ${product.originState} State</div>
                  </div>
                </div>
                <button onclick="actions.openChatDrawer('${product.farmerName}')" class="px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-200 transition-all flex items-center space-x-1">
                  <i class="fa-regular fa-comment-dots"></i>
                  <span>Message</span>
                </button>
              </div>

              ${product.verifiedFarmer ? `
                <div class="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/40">
                  <div class="flex items-center space-x-1.5 text-emerald-800 dark:text-emerald-300 text-xs font-extrabold">
                    <i class="fa-solid fa-circle-check text-emerald-600"></i>
                    <span>✓ Agrein Verified Farmer</span>
                  </div>
                  <p class="text-[11px] text-emerald-700 dark:text-emerald-300/90 mt-0.5">This farmer has completed Agrein's verification process.</p>
                </div>
              ` : ''}

              <!-- Evidence-Based Trust Signals -->
              <div class="grid grid-cols-2 gap-2 text-[10px] pt-1 border-t border-gray-100 dark:border-slate-800">
                <div class="flex items-center space-x-1.5 text-gray-600 dark:text-gray-300">
                  <i class="fa-solid fa-id-card text-emerald-600"></i>
                  <span>NIN/BVN Identity Checked</span>
                </div>
                <div class="flex items-center space-x-1.5 text-gray-600 dark:text-gray-300">
                  <i class="fa-solid fa-map-pin text-emerald-600"></i>
                  <span>GPS Location Verified</span>
                </div>
                <div class="flex items-center space-x-1.5 text-gray-600 dark:text-gray-300">
                  <i class="fa-solid fa-shield-halved text-emerald-600"></i>
                  <span>Interswitch Escrow Held</span>
                </div>
                <div class="flex items-center space-x-1.5 text-gray-600 dark:text-gray-300">
                  <i class="fa-solid fa-truck-fast text-emerald-600"></i>
                  <span>ColdChain Tracked</span>
                </div>
              </div>
            </div>

            <!-- Buyer Protection Card -->
            <div class="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start space-x-3">
              <div class="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center flex-shrink-0 text-sm shadow-md">
                <i class="fa-solid fa-shield-cat"></i>
              </div>
              <div class="space-y-0.5">
                <div class="text-xs font-extrabold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>Buyer Protection</span>
                  <button onclick="actions.openDisputeModal()" class="text-[10px] text-amber-600 dark:text-amber-400 underline font-bold">Report Issue</button>
                </div>
                <p class="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed">
                  Your purchase is protected against eligible delivery and product issues. Payment remains locked in escrow until you confirm delivery quality.
                </p>
              </div>
            </div>

            <!-- Specification Details -->
            <div class="space-y-2">
              <h4 class="text-xs font-bold uppercase tracking-wider text-gray-400">Harvest Specifications</h4>
              <p class="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">${product.description}</p>
              <div class="grid grid-cols-2 gap-2 text-xs pt-1">
                <div class="p-2 rounded-xl bg-gray-50 dark:bg-slate-800/40">
                  <span class="text-gray-400">Moisture Content:</span>
                  <span class="font-bold text-slate-900 dark:text-white ml-1">${product.moistureContent}</span>
                </div>
                <div class="p-2 rounded-xl bg-gray-50 dark:bg-slate-800/40">
                  <span class="text-gray-400">Packaging Type:</span>
                  <span class="font-bold text-slate-900 dark:text-white ml-1">${product.packaging}</span>
                </div>
              </div>
            </div>

            <!-- Quantity Counter & Dynamic Price Calculation -->
            <div class="pt-4 border-t border-gray-200 dark:border-slate-800 space-y-4">
              <div class="flex items-center justify-between">
                <label class="text-xs font-extrabold text-slate-900 dark:text-white">Order Quantity (${product.unit}s):</label>
                <div class="flex items-center space-x-2">
                  <button onclick="actions.updateModalQty(-10)" class="w-8 h-8 rounded-lg glass-panel font-bold text-slate-900 dark:text-white hover:bg-emerald-100 flex items-center justify-center">-</button>
                  <input type="number" value="${modalQty}" min="${product.minQty}" onchange="actions.setModalQty(parseInt(this.value) || ${product.minQty})" class="w-20 text-center py-1 text-xs font-bold rounded-lg border border-emerald-500/20 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none">
                  <button onclick="actions.updateModalQty(10)" class="w-8 h-8 rounded-lg glass-panel font-bold text-slate-900 dark:text-white hover:bg-emerald-100 flex items-center justify-center">+</button>
                </div>
              </div>

              <!-- Price Breakdown summary -->
              <div class="text-xs space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div class="flex justify-between text-gray-500">
                  <span>Produce Subtotal (${modalQty} ${product.unit}s):</span>
                  <span class="font-bold text-slate-900 dark:text-white">₦${subtotal.toLocaleString()}</span>
                </div>
                <div class="flex justify-between text-gray-500">
                  <span>Agrein ColdChain Logistics (Est.):</span>
                  <span class="font-bold text-slate-900 dark:text-white">₦${estimatedLogistics.toLocaleString()}</span>
                </div>
                <div class="flex justify-between pt-1 border-t border-gray-200 dark:border-slate-700 text-sm font-extrabold text-emerald-800 dark:text-emerald-400">
                  <span>Total Due:</span>
                  <span>₦${grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <!-- Checkout Actions -->
              <div class="grid grid-cols-2 gap-3">
                <button onclick="actions.addToCartFromModal('${product.id}', ${modalQty})" class="py-3 px-4 rounded-xl glass-panel border border-emerald-600 text-emerald-900 dark:text-emerald-300 font-extrabold text-xs hover:bg-emerald-50 transition-all text-center">
                  <i class="fa-solid fa-cart-plus mr-1"></i> Add to Cart
                </button>
                <button onclick="actions.initiateInterswitchCheckout(${grandTotal}, '${product.title}')" class="py-3 px-4 rounded-xl bg-gradient-to-r from-red-700 via-emerald-800 to-emerald-700 hover:from-red-800 hover:to-emerald-800 text-white font-extrabold text-xs shadow-xl shadow-emerald-700/30 transition-all text-center flex items-center justify-center space-x-2">
                  <i class="fa-solid fa-lock text-amber-300"></i>
                  <span>Interswitch Webpay</span>
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  `;
}
