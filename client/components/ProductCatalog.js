// Product Catalog Component for Agrein Marketplace

function renderProductCatalog(state, actions) {
  const { categories, products } = state.mockData;
  const { selectedCategory, selectedState, searchFilter, organicOnlyFilter, wishlist, viewMode } = state;

  // Filter products based on selected filters
  const filteredProducts = products.filter(p => {
    const matchCat = selectedCategory === 'All' || p.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchState = selectedState === 'All' || p.originState.toLowerCase() === selectedState.toLowerCase();
    const matchOrganic = !organicOnlyFilter || p.isOrganic;
    const matchSearch = !searchFilter || p.title.toLowerCase().includes(searchFilter.toLowerCase()) || p.farmName.toLowerCase().includes(searchFilter.toLowerCase());
    return matchCat && matchState && matchOrganic && matchSearch;
  });

  const statesList = ['All', 'Kaduna', 'Benue', 'Jos, Plateau', 'Ondo', 'Ogun', 'Jigawa', 'Kano', 'Lagos'];

  return `
    <section class="py-12 bg-slate-50/50 dark:bg-slate-900/50 min-h-screen">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <!-- Section Header -->
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div class="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-1">
              <i class="fa-solid fa-store"></i>
              <span>Direct Produce Marketplace</span>
            </div>
            <h2 class="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 dark:text-white">
              Explore Farm Fresh Harvests
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Verified crop listings direct from registered local farmers across 36 states.
            </p>
          </div>

          <!-- Quick Filters Bar -->
          <div class="flex flex-wrap items-center gap-3">
            
            <!-- Organic Tag Toggle -->
            <button onclick="actions.toggleOrganicFilter()" class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${organicOnlyFilter ? 'bg-emerald-600 text-white shadow-md' : 'glass-panel text-gray-700 dark:text-gray-300 hover:bg-emerald-50'}">
              <i class="fa-solid fa-seedling text-amber-400"></i>
              <span>Organic Only</span>
            </button>

            <!-- Origin State Selector -->
            <select onchange="actions.setSelectedState(this.value)" class="px-3.5 py-2 rounded-xl text-xs font-bold glass-panel text-gray-800 dark:text-gray-200 border border-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-emerald-500">
              ${statesList.map(st => `<option value="${st}" ${selectedState === st ? 'selected' : ''}>State: ${st}</option>`).join('')}
            </select>

            <!-- Search Bar -->
            <div class="relative">
              <input type="text" value="${searchFilter}" oninput="actions.setSearchFilter(this.value)" placeholder="Search crops, farms..." class="w-full sm:w-64 pl-9 pr-4 py-2 rounded-xl text-xs font-medium glass-panel border border-emerald-500/20 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <i class="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-gray-400 text-xs"></i>
            </div>

          </div>
        </div>

        <!-- Categories Pill Bar -->
        <div class="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          <button onclick="actions.setSelectedCategory('All')" class="px-4 py-2.5 rounded-2xl text-xs font-bold flex-shrink-0 transition-all flex items-center space-x-2 ${selectedCategory === 'All' ? 'bg-emerald-700 text-white shadow-lg shadow-emerald-700/20' : 'glass-panel text-gray-700 dark:text-gray-300 hover:bg-emerald-50'}">
            <span>🌿 All Harvests</span>
          </button>
          ${categories.map(cat => `
            <button onclick="actions.setSelectedCategory('${cat.name}')" class="px-4 py-2.5 rounded-2xl text-xs font-bold flex-shrink-0 transition-all flex items-center space-x-2 ${selectedCategory === cat.name ? 'bg-emerald-700 text-white shadow-lg shadow-emerald-700/20' : 'glass-panel text-gray-700 dark:text-gray-300 hover:bg-emerald-50'}">
              <span>${cat.icon}</span>
              <span>${cat.name}</span>
            </button>
          `).join('')}
        </div>

        <!-- Products Grid / List Container -->
        ${filteredProducts.length === 0 ? `
          <div class="py-16 text-center glass-card rounded-3xl p-8 space-y-4">
            <div class="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 text-2xl mx-auto">
              <i class="fa-solid fa-basket-shopping"></i>
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">No Produce Found</h3>
            <p class="text-sm text-gray-500 max-w-md mx-auto">No agricultural listings matched your filter settings. Try adjusting your search query or state selection.</p>
            <button onclick="actions.resetFilters()" class="px-6 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold">Reset All Filters</button>
          </div>
        ` : `
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            ${filteredProducts.map(product => {
              const isWishlisted = wishlist.includes(product.id);
              return `
                <div class="glass-card rounded-3xl overflow-hidden group flex flex-col justify-between relative">
                  
                  <!-- Card Image Header -->
                  <div class="relative h-52 overflow-hidden bg-gray-100 dark:bg-slate-800">
                    <img src="${product.image}" alt="${product.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                    
                    <!-- Wishlist Toggle Button -->
                    <button onclick="actions.toggleWishlist('${product.id}')" class="absolute top-3 right-3 w-9 h-9 rounded-full glass-panel flex items-center justify-center text-gray-700 dark:text-gray-200 hover:text-amber-500 transition-all shadow-md">
                      <i class="fa-${isWishlisted ? 'solid text-amber-500' : 'regular'} fa-heart"></i>
                    </button>

                    <!-- Organic & State Badges -->
                    <div class="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
                      ${product.isOrganic ? `<span class="px-2.5 py-1 rounded-lg bg-emerald-700/90 backdrop-blur-md text-white text-[10px] font-extrabold flex items-center space-x-1"><i class="fa-solid fa-seedling text-amber-300"></i> Organic</span>` : ''}
                      <span class="px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-gray-200 text-[10px] font-bold">📍 ${product.originState}</span>
                      ${product.verifiedFarmer ? `<span class="px-2.5 py-1 rounded-lg bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-extrabold flex items-center space-x-1"><i class="fa-solid fa-circle-check text-amber-300"></i><span>Verified</span></span>` : ''}
                    </div>
                  </div>

                  <!-- Card Body -->
                  <div class="p-5 space-y-3 flex-grow flex flex-col justify-between">
                    <div>
                      <div class="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 mb-1">
                        <span class="font-semibold text-emerald-700 dark:text-emerald-400">${product.category}</span>
                        <span><i class="fa-solid fa-star text-amber-400"></i> ${product.rating} (${product.reviewCount})</span>
                      </div>
                      
                      <h3 class="font-heading font-bold text-base text-slate-900 dark:text-white line-clamp-1 group-hover:text-emerald-600 transition-colors">
                        ${product.title}
                      </h3>

                      <!-- Farmer Info -->
                      <div class="mt-2 flex items-center justify-between text-xs text-gray-600 dark:text-gray-300">
                        <div class="flex items-center space-x-1.5 min-w-0">
                          <i class="fa-solid fa-user-check text-emerald-600 flex-shrink-0"></i>
                          <span class="font-medium truncate">${product.farmName}</span>
                        </div>
                        ${product.verifiedFarmer ? `<span class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1 flex-shrink-0"><i class="fa-solid fa-circle-check"></i><span>Verified Farmer</span></span>` : ''}
                      </div>
                    </div>

                    <!-- Price & Stock & Buyer Protection Badge -->
                    <div class="pt-3 border-t border-gray-100 dark:border-slate-800 space-y-2.5">
                      <div class="flex items-center justify-between text-[10px]">
                        <span class="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-extrabold flex items-center space-x-1">
                          <i class="fa-solid fa-shield-halved text-emerald-500"></i>
                          <span>Buyer Protection Available</span>
                        </span>
                        <span class="px-2 py-0.5 rounded bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 font-semibold">Min: ${product.minQty} ${product.unit}</span>
                      </div>

                      <div class="flex items-baseline justify-between">
                        <div>
                          <span class="text-2xl font-heading font-extrabold text-emerald-800 dark:text-emerald-400">₦${product.price.toLocaleString()}</span>
                          <span class="text-xs text-gray-500 font-medium">/ ${product.unit}</span>
                        </div>
                      </div>

                      <!-- Action Buttons -->
                      <div class="grid grid-cols-2 gap-2">
                        <button onclick="actions.openProductModal('${product.id}')" class="py-2.5 px-3 rounded-xl glass-panel border border-emerald-600/30 text-emerald-900 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-50 transition-all text-center">
                          Quick View
                        </button>
                        <button onclick="actions.addToCart('${product.id}')" class="py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md shadow-emerald-700/20 transition-all text-center flex items-center justify-center space-x-1">
                          <i class="fa-solid fa-cart-plus"></i>
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </div>

                  </div>

                </div>
              `;
            }).join('')}
          </div>
        `}

      </div>
    </section>
  `;
}
