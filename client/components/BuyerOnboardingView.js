// Buyer Compulsory Onboarding & Profile Verification Component for Agrein
// Role-Specific Profile Onboarding for Wholesale, Retail, HoReCa, Factory & Household Buyers.

function renderBuyerOnboardingView(state, actions) {
  const user = state.currentUser || {};
  const profile = (state.mockData && state.mockData.buyerProfile) || state.buyerOnboardingDraft || {};

  // Form Field State Values (fallback order: local draft -> currentUser -> default)
  const fullName = profile.fullName ?? profile.full_name ?? user.full_name ?? '';
  const email = user.email || profile.email || 'buyer@example.com';
  const phone = profile.phone ?? profile.phone_number ?? user.phone_number ?? '';
  const buyerType = profile.buyerType ?? profile.buyer_type ?? user.buyer_type ?? 'Household / Individual Consumer';
  const businessName = profile.businessName ?? profile.business_name ?? user.business_name ?? (buyerType === 'Household / Individual Consumer' ? fullName : '');
  const deliveryState = profile.state ?? user.state ?? '';
  const deliveryLga = profile.lga ?? user.lga ?? '';
  const deliveryAddress = profile.address ?? user.address ?? '';
  const deliveryCity = profile.city ?? user.city ?? '';
  const selectedCategories = profile.procurementCategories ?? profile.procurement_categories ?? user.procurement_categories ?? ['Grains & Cereals', 'Roots & Tubers'];
  const procurementVolume = profile.procurementVolume ?? profile.procurement_volume ?? user.procurement_volume ?? 'Retail / Family (< 100 kg)';
  const deliveryFrequency = profile.deliveryFrequency ?? profile.delivery_frequency ?? user.delivery_frequency ?? 'Weekly';

  const isCommercial = buyerType !== 'Household / Individual Consumer';

  // Compulsory Checklist Calculation
  const requirements = [
    { label: 'Full Name / Contact Person', filled: Boolean(fullName && fullName.trim().length >= 3) },
    { label: 'Verified Phone Number', filled: Boolean(phone && String(phone).replace(/\D/g, '').length >= 10) },
    { label: 'Buyer Classification', filled: Boolean(buyerType) },
    { label: isCommercial ? 'Business / Store Name' : 'Profile Name', filled: Boolean(businessName && businessName.trim().length >= 2) },
    { label: 'Destination State', filled: Boolean(deliveryState && deliveryState !== '') },
    { label: 'Destination LGA', filled: Boolean(deliveryLga && deliveryLga.trim().length >= 2) },
    { label: 'Primary Delivery Address', filled: Boolean(deliveryAddress && deliveryAddress.trim().length >= 5) },
    { label: 'Preferred Crop Categories', filled: Boolean(Array.isArray(selectedCategories) && selectedCategories.length > 0) }
  ];

  const completedCount = requirements.filter(r => r.filled).length;
  const totalCount = requirements.length;
  const completionPercent = Math.round((completedCount / totalCount) * 100);
  const isFullyComplete = completedCount === totalCount;

  const statesList = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
    'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT - Abuja', 'Gombe',
    'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
    'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto',
    'Taraba', 'Yobe', 'Zamfara'
  ];

  const buyerTypeOptions = [
    { id: 'Household / Individual Consumer', label: 'Household / Consumer', icon: 'fa-house-user', desc: 'Direct kitchen & family food supplies' },
    { id: 'Wholesale Merchant / Distributor', label: 'Wholesale Distributor', icon: 'fa-boxes-packing', desc: 'Bulk foodstuff trader & market merchant' },
    { id: 'Food Processing Factory & Agro-Allied', label: 'Food Processing / Factory', icon: 'fa-industry', desc: 'Industrial raw materials & processing' },
    { id: 'Restaurant / Hotel / HoReCa', label: 'Restaurant / HoReCa', icon: 'fa-utensils', desc: 'Commercial kitchen, hotel & catering' },
    { id: 'Supermarket / Grocery Retailer', label: 'Supermarket / Retail Store', icon: 'fa-shop', desc: 'Packaged shelf produce & retail outlets' },
    { id: 'Agro-Commodity Exporter', label: 'Commodity Exporter', icon: 'fa-ship', desc: 'Export-grade grains, nuts & cash crops' }
  ];

  const availableCategories = [
    { name: 'Grains & Cereals', icon: '🌾' },
    { name: 'Roots & Tubers', icon: '🥔' },
    { name: 'Fresh Vegetables', icon: '🥬' },
    { name: 'Tree Crops & Fruits', icon: '🍊' },
    { name: 'Oil Seeds & Nuts', icon: '🥜' },
    { name: 'Cash Crops & Spices', icon: '🌶️' },
    { name: 'Legumes & Beans', icon: '🫘' },
    { name: 'Poultry & Livestock', icon: '🥩' }
  ];

  const volumeOptions = [
    'Retail / Family (< 100 kg)',
    'Commercial Sourcing (100 kg - 1 Metric Ton)',
    'Bulk Wholesale (1 - 10 Metric Tons)',
    'Industrial Truckload (> 10 Metric Tons)'
  ];

  return `
    <section class="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
      
      <!-- Top Title & Badge -->
      <div class="text-center mb-6 sm:mb-8">
        <div class="inline-flex w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-emerald-500 text-white items-center justify-center mb-3 sm:mb-4 shadow-xl shadow-blue-700/20">
          <i class="fa-solid fa-truck-ramp-box text-xl sm:text-2xl"></i>
        </div>
        <h1 class="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 dark:text-white">
          Buyer Profile & Delivery Setup
        </h1>
        <p class="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2 max-w-xl mx-auto">
          Please complete your compulsory delivery and buyer details to unlock marketplace purchasing, ColdChain logistics routing, and Interswitch escrow protection.
        </p>

        <!-- Compulsory Notice -->
        <div class="mt-3 sm:mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-700/40 text-blue-800 dark:text-blue-300 text-[11px] sm:text-xs font-bold">
          <i class="fa-solid fa-circle-info text-[10px]"></i>
          <span>Compulsory Step: Orders and RFQs require verified delivery destination details.</span>
        </div>
      </div>

      <!-- ═══ LIVE COMPLETION PROGRESS BAR ═══ -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-200 dark:border-slate-800 shadow-sm space-y-4">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 flex items-center justify-center text-lg sm:text-xl shadow-sm">
              <i class="fa-solid fa-list-check"></i>
            </div>
            <div>
              <div class="text-[10px] sm:text-xs font-bold text-gray-500">Buyer Onboarding</div>
              <div class="text-sm sm:text-base font-heading font-extrabold text-blue-800 dark:text-blue-300">
                ${isFullyComplete ? '✓ Ready to Save & Unlock' : 'Profile Completion Required'}
              </div>
            </div>
          </div>

          <div class="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-3 bg-slate-50 dark:bg-slate-800/80 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-slate-700">
            <div class="text-left sm:text-right">
              <div class="text-[9px] sm:text-[10px] uppercase tracking-wider font-extrabold text-gray-400">Completion Rate</div>
              <div class="text-base sm:text-lg font-heading font-extrabold ${isFullyComplete ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400'}">
                ${completionPercent}%
              </div>
            </div>
            <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs font-extrabold ${isFullyComplete ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'}">
              ${isFullyComplete ? '<i class="fa-solid fa-check text-sm sm:text-base"></i>' : `${completedCount}/${totalCount}`}
            </div>
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between text-xs font-bold mb-2">
            <span class="text-slate-700 dark:text-gray-300 flex items-center gap-1.5">
              <i class="fa-solid fa-shield-check text-blue-600"></i>
              <span>Compulsory Profile Criteria</span>
            </span>
            <span class="${isFullyComplete ? 'text-emerald-600 font-extrabold' : 'text-gray-500'}">
              ${completedCount} of ${totalCount} compulsory requirements filled
            </span>
          </div>

          <div class="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div class="h-full rounded-full transition-all duration-500 ${isFullyComplete ? 'bg-gradient-to-r from-blue-600 to-emerald-500' : 'bg-gradient-to-r from-blue-500 to-indigo-600'}"
                 style="width: ${completionPercent}%;"></div>
          </div>
        </div>
      </div>

      <!-- ═══ COMPULSORY BUYER FORM CONTAINER ═══ -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-gray-200 dark:border-slate-800 p-4 sm:p-8 shadow-sm space-y-6 sm:space-y-8">
        
        <!-- SECTION 1: CONTACT PERSON & COMMUNICATION -->
        <div class="space-y-4">
          <div class="flex items-center space-x-2 text-xs font-extrabold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
            <span class="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center text-[10px]">1</span>
            <span>Contact & Representative Details (Compulsory)</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label class="text-[11px] font-bold text-gray-500 dark:text-gray-400">Full Name / Contact Person <span class="text-red-500">*</span></label>
              <input type="text" id="buyerFullName" placeholder="e.g. Adebayo Ogunlesi"
                     value="${fullName}"
                     oninput="actions.updateBuyerField('fullName', this.value)"
                     class="w-full mt-1 px-4 py-2.5 rounded-xl border ${fullName ? 'border-gray-300 dark:border-slate-700' : 'border-blue-300 dark:border-blue-700/60'} bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
            </div>

            <div>
              <label class="text-[11px] font-bold text-gray-500 dark:text-gray-400">Email Address (Registered)</label>
              <input type="email" value="${email}" disabled
                     class="w-full mt-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-800/50 text-xs font-mono text-gray-500 dark:text-gray-400 cursor-not-allowed">
            </div>

            <div class="sm:col-span-2">
              <label class="text-[11px] font-bold text-gray-500 dark:text-gray-400">Delivery Contact Phone (WhatsApp & Voice for Driver Dispatch) <span class="text-red-500">*</span></label>
              <div class="relative mt-1">
                <input type="tel" id="buyerPhone" pattern="[0-9]*" inputmode="numeric"
                       value="${phone}"
                       oninput="this.value = this.value.replace(/[^0-9+]/g, ''); actions.updateBuyerField('phone', this.value)"
                       placeholder="e.g. 08034567890"
                       class="w-full pl-10 pr-4 py-2.5 rounded-xl border ${phone ? 'border-gray-300 dark:border-slate-700' : 'border-blue-300 dark:border-blue-700/60'} bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
                <i class="fa-solid fa-phone absolute left-3 top-3 text-gray-400 text-xs"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- SECTION 2: BUYER TYPE & BUSINESS IDENTITY -->
        <div class="space-y-4 pt-4 border-t border-gray-100 dark:border-slate-800">
          <div class="flex items-center space-x-2 text-xs font-extrabold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
            <span class="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center text-[10px]">2</span>
            <span>Buyer Classification & Identity (Compulsory)</span>
          </div>

          <div>
            <label class="text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-2 block">Select Your Sourcing Category <span class="text-red-500">*</span></label>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              ${buyerTypeOptions.map(opt => {
                const isSelected = buyerType === opt.id;
                return `
                  <button type="button" onclick="actions.updateBuyerField('buyerType', '${opt.id}')"
                          class="p-3 rounded-2xl border text-left transition-all flex items-start space-x-3 ${isSelected ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/40 shadow-sm' : 'border-gray-200 dark:border-slate-700 hover:border-blue-400'}">
                    <div class="w-9 h-9 rounded-xl ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-gray-500'} flex items-center justify-center text-sm flex-shrink-0">
                      <i class="fa-solid ${opt.icon}"></i>
                    </div>
                    <div class="min-w-0 flex-1">
                      <div class="text-xs font-extrabold ${isSelected ? 'text-blue-900 dark:text-blue-200' : 'text-slate-800 dark:text-gray-200'}">${opt.label}</div>
                      <div class="text-[10px] text-gray-400 leading-tight mt-0.5">${opt.desc}</div>
                    </div>
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <div>
            <label class="text-[11px] font-bold text-gray-500 dark:text-gray-400">
              ${isCommercial ? 'Registered Business / Store / Factory Name' : 'Household / Individual Label'} <span class="text-red-500">*</span>
            </label>
            <input type="text" id="buyerBusinessName"
                   value="${businessName}"
                   placeholder="${isCommercial ? 'e.g. Golden Grain Mills Ltd' : 'e.g. Adebayo Family Household'}"
                   oninput="actions.updateBuyerField('businessName', this.value)"
                   class="w-full mt-1 px-4 py-2.5 rounded-xl border ${businessName ? 'border-gray-300 dark:border-slate-700' : 'border-blue-300 dark:border-blue-700/60'} bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
          </div>
        </div>

        <!-- SECTION 3: PRIMARY DELIVERY DESTINATION & LOGISTICS -->
        <div class="space-y-4 pt-4 border-t border-gray-100 dark:border-slate-800">
          <div class="flex items-center space-x-2 text-xs font-extrabold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
            <span class="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center text-[10px]">3</span>
            <span>Primary Delivery Destination & Warehouse Address (Compulsory)</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label class="text-[11px] font-bold text-gray-500 dark:text-gray-400">Destination State <span class="text-red-500">*</span></label>
              <select id="buyerState" onchange="actions.updateBuyerField('state', this.value)"
                      class="w-full mt-1 px-4 py-2.5 rounded-xl border ${deliveryState ? 'border-gray-300 dark:border-slate-700' : 'border-blue-300 dark:border-blue-700/60'} bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select Destination State *</option>
                ${statesList.map(st => `<option value="${st}" ${deliveryState === st ? 'selected' : ''}>${st}</option>`).join('')}
              </select>
            </div>

            <div>
              <label class="text-[11px] font-bold text-gray-500 dark:text-gray-400">Destination LGA <span class="text-red-500">*</span></label>
              <input type="text" id="buyerLga" placeholder="e.g. Ikeja / Kano Municipal"
                     value="${deliveryLga}"
                     oninput="actions.updateBuyerField('lga', this.value)"
                     class="w-full mt-1 px-4 py-2.5 rounded-xl border ${deliveryLga ? 'border-gray-300 dark:border-slate-700' : 'border-blue-300 dark:border-blue-700/60'} bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
            </div>

            <div class="sm:col-span-2">
              <label class="text-[11px] font-bold text-gray-500 dark:text-gray-400">Primary Delivery Street Address, Warehouse Gate & Landmark <span class="text-red-500">*</span></label>
              <textarea id="buyerAddress" rows="2" placeholder="e.g. Plot 14, Commercial Avenue, Ikeja Industrial Estate, Opposite Guinness Brewery, Lagos"
                        oninput="actions.updateBuyerField('address', this.value)"
                        class="w-full mt-1 px-4 py-2.5 rounded-xl border ${deliveryAddress ? 'border-gray-300 dark:border-slate-700' : 'border-blue-300 dark:border-blue-700/60'} bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">${deliveryAddress}</textarea>
            </div>
          </div>
        </div>

        <!-- SECTION 4: COMMODITY PROCUREMENT PREFERENCES -->
        <div class="space-y-4 pt-4 border-t border-gray-100 dark:border-slate-800">
          <div class="flex items-center space-x-2 text-xs font-extrabold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
            <span class="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center text-[10px]">4</span>
            <span>Commodity Sourcing Preferences (Compulsory)</span>
          </div>

          <div>
            <label class="text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-2 block">Preferred Produce Categories (Select All That Apply) <span class="text-red-500">*</span></label>
            <div class="flex flex-wrap gap-2">
              ${availableCategories.map(cat => {
                const isSelected = selectedCategories.includes(cat.name);
                return `
                  <button type="button" onclick="actions.toggleBuyerCategory('${cat.name}')"
                          class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${isSelected ? 'bg-blue-700 text-white shadow-md shadow-blue-700/20' : 'bg-slate-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50'}">
                    <span>${cat.icon}</span>
                    <span>${cat.name}</span>
                    ${isSelected ? '<i class="fa-solid fa-check text-[10px] ml-1"></i>' : ''}
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-2">
            <div>
              <label class="text-[11px] font-bold text-gray-500 dark:text-gray-400">Typical Order Volume <span class="text-red-500">*</span></label>
              <select onchange="actions.updateBuyerField('procurementVolume', this.value)"
                      class="w-full mt-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
                ${volumeOptions.map(v => `<option value="${v}" ${procurementVolume === v ? 'selected' : ''}>${v}</option>`).join('')}
              </select>
            </div>

            <div>
              <label class="text-[11px] font-bold text-gray-500 dark:text-gray-400">Preferred Procurement Frequency <span class="text-red-500">*</span></label>
              <select onchange="actions.updateBuyerField('deliveryFrequency', this.value)"
                      class="w-full mt-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
                ${['Weekly', 'Bi-Weekly', 'Monthly', 'Seasonal / On-Demand Harvests'].map(f => `<option value="${f}" ${deliveryFrequency === f ? 'selected' : ''}>${f}</option>`).join('')}
              </select>
            </div>
          </div>
        </div>

        <!-- ═══ SUBMIT BUTTON ═══ -->
        <div class="pt-6 border-t border-gray-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="text-xs text-gray-500 flex items-center space-x-2">
            <i class="fa-solid fa-lock text-emerald-600"></i>
            <span>Your delivery information is encrypted and protected under NDPR data governance.</span>
          </div>

          <div class="w-full sm:w-auto flex items-center gap-3">
            <button onclick="actions.submitBuyerProfile()"
                    class="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white font-extrabold text-sm shadow-xl shadow-blue-700/25 transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center space-x-2.5">
              <i class="fa-solid fa-circle-check text-amber-300 text-base"></i>
              <span>Save & Complete Verification</span>
            </button>
          </div>
        </div>

      </div>

    </section>
  `;
}
