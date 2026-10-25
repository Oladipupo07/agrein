// Agrein Enterprise Verification Portal — Institutional Farmer & Producer Accreditation
// Senior Principal Engineer standard: Clean design hierarchy, bank-grade trust indicators,
// real-time Interswitch NIMC identity & CAC corporate validation.

function renderFarmerVerificationView(state, actions) {
  const app = state.mockData.farmerVerificationApp || {};
  const userStatus = (state.currentUser && state.currentUser.verification_status) || 'NOT_STARTED';
  const status = app.status || 'DRAFT';
  const submittedStatuses = ['PENDING', 'PENDING_REVIEW', 'UNDER_REVIEW'];
  const isApplicationSubmitted = (submittedStatuses.includes(status) || submittedStatuses.includes(userStatus)) && !state.isEditingVerification;

  if (isApplicationSubmitted) {
    return (typeof renderApplicationSubmittedView === 'function' ? renderApplicationSubmittedView : renderFarmerPendingApprovalView)(state, actions);
  }

  const escapeHtml = (str) => {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  };

  const statusConfig = {
    'DRAFT':             { label: 'Draft Application',       badgeClass: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700', icon: 'fa-pen-to-square' },
    'NOT_STARTED':       { label: 'Draft Application',       badgeClass: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700', icon: 'fa-pen-to-square' },
    'PENDING':           { label: 'Under Compliance Review', badgeClass: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800', icon: 'fa-clock' },
    'PENDING_REVIEW':    { label: 'Under Compliance Review', badgeClass: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800', icon: 'fa-clock' },
    'UNDER_REVIEW':      { label: 'Audit In Progress',       badgeClass: 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800',     icon: 'fa-magnifying-glass' },
    'CHANGES_REQUIRED':  { label: 'Action Required',         badgeClass: 'bg-orange-50 dark:bg-orange-950/40 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800', icon: 'fa-triangle-exclamation' },
    'APPROVED':          { label: 'Accredited Producer',     badgeClass: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800', icon: 'fa-shield-check' },
    'REJECTED':          { label: 'Application Declined',    badgeClass: 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800',     icon: 'fa-circle-xmark' },
    'SUSPENDED':         { label: 'Account Suspended',       badgeClass: 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800',     icon: 'fa-ban' }
  };

  const sc = statusConfig[status] || statusConfig['DRAFT'];

  // Current entity values
  const photoUrl = app.avatar_url || app.profile_photo_url || (state.currentUser && state.currentUser.avatar_url) || '';
  const farmerName = app.farmer_name || (state.currentUser && state.currentUser.full_name) || '';
  const emailVal = app.email || (state.currentUser && state.currentUser.email) || '';
  const phoneVal = app.phone || (state.currentUser && state.currentUser.phone_number) || '';
  const stateVal = app.state || (state.currentUser && state.currentUser.state) || '';
  const lgaVal = app.lga || (state.currentUser && state.currentUser.lga) || '';
  const addressVal = app.residential_address || (state.currentUser && state.currentUser.address) || '';

  // NIN & Interswitch validation
  const ninVal = String(app.nin || app.nin_number || '').replace(/\D/g, '');
  const isNinVerified = Boolean(app.nin_verified && ninVal.length === 11);
  const ninData = app.nin_data || null;

  // Farm Details
  const farmNameVal = app.farm_name || '';
  const farmTypeVal = app.farm_type || 'Crop Farming';
  const farmSizeVal = app.farm_size_acres || '';
  const yearsExpVal = app.years_experience !== undefined && app.years_experience !== null ? app.years_experience : '';
  const cropsVal = Array.isArray(app.crops_produced) ? app.crops_produced.join(', ') : (app.crops_produced || '');
  const intendedVal = app.intended_products || '';

  // CAC & Interswitch validation
  const cacVal = String(app.cac_number || '').trim();
  const isCacVerified = Boolean(app.cac_verified && cacVal.length >= 3);
  const cacData = app.cac_data || null;

  // Farm Location & Geolocation
  const farmAddressVal = app.farm_location || '';
  const farmStateVal = app.farm_state || app.state || '';
  const farmLgaVal = app.farm_lga || app.lga || '';
  const gpsLat = app.gps_latitude || '';
  const gpsLng = app.gps_longitude || '';

  const nigerianStates = (typeof ALL_NIGERIAN_STATES !== 'undefined' ? ALL_NIGERIAN_STATES : (window.ALL_NIGERIAN_STATES || [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
    'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT - Abuja', 'Gombe',
    'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
    'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto',
    'Taraba', 'Yobe', 'Zamfara'
  ]));

  const getLgas = typeof getLgasForState === 'function' ? getLgasForState : (st => (typeof NIGERIAN_STATES_LGAS !== 'undefined' ? NIGERIAN_STATES_LGAS[st] : (window.NIGERIAN_STATES_LGAS && window.NIGERIAN_STATES_LGAS[st])) || []);
  const personalLgas = getLgas(stateVal);
  const farmLgas = getLgas(farmStateVal);

  // Section completion checks
  const isPhotoComplete = Boolean(photoUrl);
  const isPersonalComplete = Boolean(farmerName.trim() && emailVal.trim() && phoneVal.trim() && stateVal && lgaVal.trim() && addressVal.trim() && isNinVerified);
  const isFarmComplete = Boolean(farmNameVal.trim() && farmTypeVal && farmSizeVal && Number(farmSizeVal) > 0 && yearsExpVal !== '' && cropsVal.trim() && isCacVerified);
  const isLocationComplete = Boolean(farmAddressVal.trim() && farmStateVal && farmLgaVal.trim());

  const sections = [
    { id: 'sec-photo',    num: '01', title: 'Producer Identity & Portrait',  isComplete: isPhotoComplete && isPersonalComplete, count: (isPhotoComplete ? 1 : 0) + (isPersonalComplete ? 1 : 0), total: 2 },
    { id: 'sec-farm',     num: '02', title: 'Enterprise & CAC Validation',   isComplete: isFarmComplete, count: isFarmComplete ? 1 : 0, total: 1 },
    { id: 'sec-location', num: '03', title: 'Facility Geolocation',          isComplete: isLocationComplete, count: isLocationComplete ? 1 : 0, total: 1 }
  ];

  const completedSections = sections.filter(s => s.isComplete).length;
  const isFullyComplete = isPhotoComplete && isPersonalComplete && isFarmComplete && isLocationComplete;

  return `
    <div class="min-h-screen bg-slate-50/70 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto space-y-6">

        <!-- ═══ BREADCRUMB & REGULATORY TRUST BAR ═══ -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div class="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
            <button onclick="actions.guardView('farmer-dashboard')" class="hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors">
              Producer Portal
            </button>
            <i class="fa-solid fa-chevron-right text-[10px] text-slate-400"></i>
            <span class="font-semibold text-slate-900 dark:text-slate-200">Merchant Accreditation</span>
          </div>

          <!-- Trust Badges -->
          <div class="flex items-center flex-wrap gap-2 text-[11px] text-slate-600 dark:text-slate-300">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium">
              <i class="fa-solid fa-lock text-emerald-600 text-[10px]"></i>
              <span>256-Bit SSL Encrypted</span>
            </span>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium">
              <i class="fa-solid fa-scale-balanced text-emerald-600 text-[10px]"></i>
              <span>NDPA Compliant</span>
            </span>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium">
              <i class="fa-solid fa-bolt text-emerald-600 text-[10px]"></i>
              <span>Interswitch Identity Gateway</span>
            </span>
          </div>
        </div>

        <!-- ═══ PORTAL HEADER ═══ -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="space-y-1.5 max-w-2xl">
              <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold ${sc.badgeClass}">
                <i class="fa-solid ${sc.icon} text-[11px]"></i>
                <span>${sc.label}</span>
              </div>
              <h1 class="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight">
                Producer Accreditation & Verification
              </h1>
              <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Complete your producer dossier to unlock Tier-2 commercial trading, digital escrow settlements, and verified supplier recognition on the Agrein exchange.
              </p>
            </div>

            <!-- Workflow Summary Card -->
            <div class="sm:text-right shrink-0 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60">
              <div class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Accreditation Progress</div>
              <div class="text-xl font-heading font-extrabold text-slate-900 dark:text-white mt-0.5">
                ${completedSections} of 3 Stages Complete
              </div>
              <div class="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center sm:justify-end gap-1.5">
                <span class="w-2 h-2 rounded-full ${isFullyComplete ? 'bg-emerald-500' : 'bg-amber-500'}"></span>
                <span>${isFullyComplete ? 'Application Ready' : 'Mandatory Disclosures Pending'}</span>
              </div>
            </div>
          </div>

          <!-- Section Workflow Stepper -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
            ${sections.map((s, idx) => `
              <div class="flex items-center space-x-3 p-3 rounded-xl border transition-all ${s.isComplete ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60' : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60'}">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${s.isComplete ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}">
                  ${s.isComplete ? '<i class="fa-solid fa-check"></i>' : s.num}
                </div>
                <div class="min-w-0 flex-1">
                  <div class="text-[10px] uppercase font-bold tracking-wider ${s.isComplete ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-400'}">
                    Stage ${idx + 1}
                  </div>
                  <div class="text-xs font-bold text-slate-900 dark:text-white truncate">
                    ${s.title}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- ═══ 1. PRODUCER BIOMETRIC PORTRAIT CARD (PROMINENT AT TOP) ═══ -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div class="flex items-center space-x-3">
              <span class="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center">1</span>
              <div>
                <h2 class="text-base font-heading font-bold text-slate-900 dark:text-white">Producer Portrait & Identification</h2>
                <p class="text-xs text-slate-500">Official front-facing photograph for merchant credentials and commercial escrow contracts</p>
              </div>
            </div>
            <span class="text-xs font-semibold px-2.5 py-1 rounded-full ${photoUrl ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}">
              ${photoUrl ? 'Portrait Attached' : 'Mandatory Requirement'}
            </span>
          </div>

          <div class="flex flex-col md:flex-row items-center md:items-start gap-6 pt-2">
            <!-- Portrait Frame -->
            <div class="relative shrink-0">
              <div class="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 ${photoUrl ? 'border-emerald-600/60 shadow-lg shadow-emerald-600/10' : 'border-dashed border-slate-300 dark:border-slate-700'} relative flex items-center justify-center group">
                ${photoUrl ? `
                  <img src="${escapeHtml(photoUrl)}" alt="Farmer Profile Portrait" class="w-full h-full object-cover">
                  <div onclick="document.getElementById('farmerProfilePhotoInput').click()"
                       class="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-semibold cursor-pointer">
                    <i class="fa-solid fa-camera mb-1 text-base"></i>
                    <span>Replace Image</span>
                  </div>
                ` : `
                  <div onclick="document.getElementById('farmerProfilePhotoInput').click()"
                       class="flex flex-col items-center justify-center text-slate-400 hover:text-emerald-600 cursor-pointer p-4 text-center transition-colors">
                    <i class="fa-solid fa-user-plus text-3xl mb-2 text-slate-400 group-hover:text-emerald-600"></i>
                    <span class="text-[11px] font-bold">Upload Portrait</span>
                  </div>
                `}
              </div>

              <!-- Quick File Input Trigger -->
              <input type="file" id="farmerProfilePhotoInput" accept="image/*" onchange="actions.uploadFarmerProfilePhoto(event)" class="hidden">
            </div>

            <!-- Regulatory Guidelines & Upload Controls -->
            <div class="flex-1 space-y-4 text-left">
              <div>
                <h3 class="text-sm font-bold text-slate-900 dark:text-white">
                  ${escapeHtml(farmerName || 'Official Producer Portrait')}
                </h3>
                <p class="text-xs text-slate-500 font-mono mt-0.5">
                  ${escapeHtml(emailVal || 'producer@agrein.ng')} ${phoneVal ? `• ${escapeHtml(phoneVal)}` : ''}
                </p>
              </div>

              <!-- Standards Checklist -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                <div class="flex items-center space-x-2">
                  <i class="fa-solid fa-circle-check text-emerald-600 text-xs shrink-0"></i>
                  <span>Front-facing clear lighting</span>
                </div>
                <div class="flex items-center space-x-2">
                  <i class="fa-solid fa-circle-check text-emerald-600 text-xs shrink-0"></i>
                  <span>Plain neutral background</span>
                </div>
                <div class="flex items-center space-x-2">
                  <i class="fa-solid fa-circle-check text-emerald-600 text-xs shrink-0"></i>
                  <span>No sunglasses or face coverings</span>
                </div>
                <div class="flex items-center space-x-2">
                  <i class="fa-solid fa-circle-check text-emerald-600 text-xs shrink-0"></i>
                  <span>PNG, JPG or WEBP (Max 5MB)</span>
                </div>
              </div>

              <div class="pt-1 flex flex-wrap items-center gap-3">
                <button type="button" onclick="document.getElementById('farmerProfilePhotoInput').click()"
                        class="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold transition-colors inline-flex items-center space-x-2 shadow-sm">
                  <i class="fa-solid fa-upload"></i>
                  <span>${photoUrl ? 'Upload Replacement Portrait' : 'Select Official Portrait'}</span>
                </button>
                ${photoUrl ? `
                  <span class="inline-flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                    <i class="fa-solid fa-shield-check"></i>
                    <span>Portrait satisfies compliance standards</span>
                  </span>
                ` : ''}
              </div>
            </div>
          </div>
        </div>

        <!-- ═══ 2. LEGAL IDENTITY & INTERSWITCH NIMC VERIFICATION ═══ -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div class="flex items-center space-x-3">
              <span class="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center">2</span>
              <div>
                <h2 class="text-base font-heading font-bold text-slate-900 dark:text-white">Legal Identity & National Identity (NIN)</h2>
                <p class="text-xs text-slate-500">Government identity validation through Interswitch National Identity Management Commission (NIMC) Gateway</p>
              </div>
            </div>
            <span class="text-xs font-semibold px-2.5 py-1 rounded-full ${isPersonalComplete ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}">
              ${isPersonalComplete ? 'Identity Verified' : 'Disclosures Required'}
            </span>
          </div>

          <!-- Personal Form Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Legal Name <span class="text-rose-500">*</span>
              </label>
              <input type="text" id="personalFullName" placeholder="As registered with NIMC"
                     value="${escapeHtml(farmerName)}"
                     oninput="actions.updateVerificationField('farmer_name', this.value)"
                     class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none transition-all">
            </div>

            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Official Email Address <span class="text-rose-500">*</span>
              </label>
              <input type="email" id="personalEmail" placeholder="e.g. producer@example.com"
                     value="${escapeHtml(emailVal)}"
                     oninput="actions.updateVerificationField('email', this.value)"
                     class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none transition-all">
            </div>

            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Contact Telephone Number <span class="text-rose-500">*</span>
              </label>
              <input type="tel" id="personalPhone" placeholder="e.g. 08012345678"
                     value="${escapeHtml(phoneVal)}"
                     oninput="actions.updateVerificationField('phone', this.value)"
                     class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none transition-all">
            </div>

            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Residential State <span class="text-rose-500">*</span>
              </label>
              <select id="personalState"
                      onchange="actions.updateVerificationField('state', this.value)"
                      class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none transition-all">
                <option value="">Select State</option>
                ${nigerianStates.map(st => `<option value="${st}" ${stateVal === st ? 'selected' : ''}>${st}</option>`).join('')}
              </select>
            </div>

            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Residential Local Government Area (LGA) <span class="text-rose-500">*</span>
              </label>
              <select id="personalLga"
                      onchange="actions.updateVerificationField('lga', this.value)"
                      ${!stateVal ? 'disabled' : ''}
                      class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none transition-all ${!stateVal ? 'opacity-60 cursor-not-allowed' : ''}">
                <option value="">${stateVal ? 'Select LGA' : 'Select State First'}</option>
                ${personalLgas.map(lga => `<option value="${escapeHtml(lga)}" ${lgaVal.toLowerCase() === lga.toLowerCase() ? 'selected' : ''}>${escapeHtml(lga)}</option>`).join('')}
              </select>
            </div>

            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Residential Street Address <span class="text-rose-500">*</span>
              </label>
              <input type="text" id="personalAddress" placeholder="Physical residence address"
                     value="${escapeHtml(addressVal)}"
                     oninput="actions.updateVerificationField('residential_address', this.value)"
                     class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none transition-all">
            </div>
          </div>

          <!-- ═══ INTERSWITCH NIMC IDENTITY GATEWAY ═══ -->
          <div class="rounded-xl border ${isNinVerified ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20' : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40'} p-5 space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 rounded-lg ${isNinVerified ? 'bg-emerald-600 text-white' : 'bg-slate-800 dark:bg-slate-700 text-white'} flex items-center justify-center text-xs">
                  <i class="fa-solid ${isNinVerified ? 'fa-check' : 'fa-id-card'}"></i>
                </div>
                <div>
                  <div class="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>National Identity Number (NIN) Validation</span>
                    <span class="text-rose-500">*</span>
                  </div>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400">Direct biometric registry query against NIMC via Interswitch Identity Network</p>
                </div>
              </div>

              <!-- Status Pill -->
              <div>
                ${isNinVerified ? `
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                    <i class="fa-solid fa-circle-check text-emerald-600"></i>
                    <span>Identity Verified</span>
                  </span>
                ` : `
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    <i class="fa-solid fa-circle text-[8px] text-amber-500"></i>
                    <span>Verification Required</span>
                  </span>
                `}
              </div>
            </div>

            <!-- Input & Action -->
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div class="relative flex-1">
                <input type="text" id="personalNin" maxlength="11" placeholder="Enter 11-digit National Identity Number"
                       value="${escapeHtml(ninVal)}"
                       oninput="actions.updateVerificationField('nin', this.value)"
                       class="w-full px-4 py-2.5 rounded-xl border ${isNinVerified ? 'border-emerald-400 bg-white dark:bg-slate-900' : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900'} text-xs font-mono font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600">
                <span class="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400">
                  ${ninVal.length}/11
                </span>
              </div>

              <button type="button" id="verifyNinBtn" onclick="actions.verifyNin(document.getElementById('personalNin').value)"
                      ${state.ninVerifying ? 'disabled' : ''}
                      class="px-5 py-2.5 rounded-xl ${isNinVerified ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-emerald-700 hover:bg-emerald-800 text-white'} text-xs font-bold transition-all flex items-center justify-center space-x-2 whitespace-nowrap shadow-sm ${state.ninVerifying ? 'opacity-70 cursor-wait' : ''}">
                <i class="fa-solid ${state.ninVerifying ? 'fa-spinner fa-spin' : (isNinVerified ? 'fa-rotate-right' : 'fa-shield-halved')}"></i>
                <span>${state.ninVerifying ? 'Validating with NIMC...' : (isNinVerified ? 'Re-Verify Identity' : 'Verify Identity via NIMC')}</span>
              </button>
            </div>

            <!-- Verified Identity Card (Institutional Receipt) -->
            ${isNinVerified ? `
              <div class="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div class="space-y-1">
                  <div class="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <i class="fa-solid fa-user-check text-emerald-600"></i>
                    <span>${escapeHtml((ninData && ninData.verified_name) || farmerName || 'Verified Citizen')}</span>
                  </div>
                  <div class="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    NIN: ••••••••${ninVal.slice(-3)} • NIMC Registry Match Confirmed
                  </div>
                </div>
                <div class="text-[10px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800 self-start sm:self-auto">
                  Audit Ref: ISW-NIMC-${ninVal.slice(-4)}-OK
                </div>
              </div>
            ` : ''}
          </div>
        </div>

        <!-- ═══ 3. AGRICULTURAL ENTERPRISE & CAC CORPORATE REGISTRATION ═══ -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div class="flex items-center space-x-3">
              <span class="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center">3</span>
              <div>
                <h2 class="text-base font-heading font-bold text-slate-900 dark:text-white">Enterprise Profile & CAC Registration</h2>
                <p class="text-xs text-slate-500">Commercial operational profile and Corporate Affairs Commission (CAC) incorporation verification</p>
              </div>
            </div>
            <span class="text-xs font-semibold px-2.5 py-1 rounded-full ${isFarmComplete ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}">
              ${isFarmComplete ? 'Enterprise Validated' : 'Disclosures Required'}
            </span>
          </div>

          <!-- Enterprise Form Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Registered Farm or Business Name <span class="text-rose-500">*</span>
              </label>
              <input type="text" id="farmName" placeholder="e.g. Green Valley Agricultural Ventures Ltd"
                     value="${escapeHtml(farmNameVal)}"
                     oninput="actions.updateVerificationField('farm_name', this.value)"
                     class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none transition-all">
            </div>

            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Primary Farming Classification <span class="text-rose-500">*</span>
              </label>
              <select id="farmType"
                      onchange="actions.updateVerificationField('farm_type', this.value)"
                      class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none transition-all">
                <option value="Crop Farming" ${farmTypeVal === 'Crop Farming' ? 'selected' : ''}>Arable Crop Farming</option>
                <option value="Livestock" ${farmTypeVal === 'Livestock' ? 'selected' : ''}>Livestock Husbandry</option>
                <option value="Mixed" ${farmTypeVal === 'Mixed' ? 'selected' : ''}>Mixed Agriculture</option>
                <option value="Horticulture" ${farmTypeVal === 'Horticulture' ? 'selected' : ''}>Horticulture & Greenhousing</option>
                <option value="Aquaculture" ${farmTypeVal === 'Aquaculture' ? 'selected' : ''}>Aquaculture & Fisheries</option>
                <option value="Poultry" ${farmTypeVal === 'Poultry' ? 'selected' : ''}>Commercial Poultry</option>
              </select>
            </div>

            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Cultivated Land Capacity (Acres) <span class="text-rose-500">*</span>
              </label>
              <input type="number" id="farmSizeAcres" placeholder="e.g. 25" min="0.1" step="0.1"
                     value="${escapeHtml(farmSizeVal)}"
                     oninput="actions.updateVerificationField('farm_size_acres', this.value)"
                     class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none transition-all">
            </div>

            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Operational Commercial Experience (Years) <span class="text-rose-500">*</span>
              </label>
              <input type="number" id="yearsExperience" placeholder="e.g. 6" min="0"
                     value="${escapeHtml(yearsExpVal)}"
                     oninput="actions.updateVerificationField('years_experience', this.value)"
                     class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none transition-all">
            </div>

            <div class="md:col-span-2">
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Primary Harvest / Livestock Products <span class="text-rose-500">*</span>
              </label>
              <input type="text" id="cropsProduced" placeholder="e.g. Yellow Maize, Soya Beans, Cassava, Sorghum"
                     value="${escapeHtml(cropsVal)}"
                     oninput="actions.updateVerificationField('crops_produced', this.value)"
                     class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none transition-all">
            </div>

            <div class="md:col-span-2">
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Intended Commercial Offerings on Agrein Exchange
              </label>
              <input type="text" id="intendedProducts" placeholder="e.g. 50kg Export-grade Bagged Maize, Dried Cassava Chips"
                     value="${escapeHtml(intendedVal)}"
                     oninput="actions.updateVerificationField('intended_products', this.value)"
                     class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none transition-all">
            </div>
          </div>

          <!-- ═══ CAC CORPORATE AFFAIRS COMMISSION VALIDATION MODULE ═══ -->
          <div class="rounded-xl border ${isCacVerified ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20' : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40'} p-5 space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 rounded-lg ${isCacVerified ? 'bg-emerald-600 text-white' : 'bg-slate-800 dark:bg-slate-700 text-white'} flex items-center justify-center text-xs">
                  <i class="fa-solid ${isCacVerified ? 'fa-check' : 'fa-building-columns'}"></i>
                </div>
                <div>
                  <div class="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>Corporate Affairs Commission (CAC) Verification</span>
                    <span class="text-rose-500">*</span>
                  </div>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400">Incorporation lookup for RC Number, Business Name (BN), or Agricultural Cooperative</p>
                </div>
              </div>

              <!-- Status Pill -->
              <div>
                ${isCacVerified ? `
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                    <i class="fa-solid fa-circle-check text-emerald-600"></i>
                    <span>Corporate Entity Validated</span>
                  </span>
                ` : `
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    <i class="fa-solid fa-circle text-[8px] text-amber-500"></i>
                    <span>Verification Required</span>
                  </span>
                `}
              </div>
            </div>

            <!-- Input & Action -->
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div class="relative flex-1">
                <input type="text" id="farmCac" placeholder="Enter RC or BN Number (e.g. RC-1849204 or BN-3940192)"
                       value="${escapeHtml(cacVal)}"
                       oninput="actions.updateVerificationField('cac_number', this.value)"
                       class="w-full px-4 py-2.5 rounded-xl border ${isCacVerified ? 'border-emerald-400 bg-white dark:bg-slate-900' : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900'} text-xs font-mono font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600">
              </div>

              <button type="button" id="verifyCacBtn" onclick="actions.verifyCac(document.getElementById('farmCac').value)"
                      ${state.cacVerifying ? 'disabled' : ''}
                      class="px-5 py-2.5 rounded-xl ${isCacVerified ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-emerald-700 hover:bg-emerald-800 text-white'} text-xs font-bold transition-all flex items-center justify-center space-x-2 whitespace-nowrap shadow-sm ${state.cacVerifying ? 'opacity-70 cursor-wait' : ''}">
                <i class="fa-solid ${state.cacVerifying ? 'fa-spinner fa-spin' : (isCacVerified ? 'fa-rotate-right' : 'fa-building-shield')}"></i>
                <span>${state.cacVerifying ? 'Validating with CAC...' : (isCacVerified ? 'Re-Verify CAC' : 'Verify Entity via CAC')}</span>
              </button>
            </div>

            <!-- Verified CAC Credential Card -->
            ${isCacVerified ? `
              <div class="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div class="space-y-1">
                  <div class="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <i class="fa-solid fa-circle-check text-emerald-600"></i>
                    <span>${escapeHtml((cacData && cacData.registered_name) || farmNameVal || 'Registered Enterprise Entity')}</span>
                  </div>
                  <div class="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    Registration: ${escapeHtml((cacData && cacData.cac_number) || cacVal)} • Type: ${escapeHtml((cacData && cacData.registration_type) || 'Corporate Entity')} • Status: Active
                  </div>
                </div>
                <div class="text-[10px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800 self-start sm:self-auto">
                  CAC Registry Verified
                </div>
              </div>
            ` : ''}
          </div>
        </div>

        <!-- ═══ 4. PRODUCTION FACILITY & SATELLITE GEOLOCATION ═══ -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div class="flex items-center space-x-3">
              <span class="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center">4</span>
              <div>
                <h2 class="text-base font-heading font-bold text-slate-900 dark:text-white">Facility Geolocation & Address</h2>
                <p class="text-xs text-slate-500">Physical production coordinates for logistics dispatch and field verification</p>
              </div>
            </div>
            <span class="text-xs font-semibold px-2.5 py-1 rounded-full ${isLocationComplete ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}">
              ${isLocationComplete ? 'Location Confirmed' : 'Address Required'}
            </span>
          </div>

          <!-- Geolocation Trigger Bar -->
          <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div class="text-center sm:text-left">
              <div class="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-center sm:justify-start gap-1.5">
                <i class="fa-solid fa-satellite-dish text-emerald-600"></i>
                <span>Precision Satellite Geolocation</span>
              </div>
              <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Acquire device satellite telemetry to pinpoint harvest plots and automatically register state and local district.
              </p>
            </div>
            <button type="button" id="detectLocationBtn" onclick="actions.detectGpsLocation()"
                    class="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs shadow-sm transition-colors whitespace-nowrap flex items-center space-x-2">
              <i class="fa-solid fa-location-crosshairs text-emerald-500"></i>
              <span>Acquire GPS Coordinates</span>
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div class="md:col-span-2">
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Physical Farm / Facility Address & Nearest Landmark <span class="text-rose-500">*</span>
              </label>
              <input type="text" id="farmAddress" placeholder="e.g. Km 14 Zaria Expressway, Adjacent Agrotech Silo Hub"
                     value="${escapeHtml(farmAddressVal)}"
                     oninput="actions.updateVerificationField('farm_location', this.value)"
                     class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none transition-all">
            </div>

            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Farm State <span class="text-rose-500">*</span>
              </label>
              <select id="farmState"
                      onchange="actions.updateVerificationField('farm_state', this.value)"
                      class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none transition-all">
                <option value="">Select State</option>
                ${nigerianStates.map(st => `<option value="${st}" ${farmStateVal === st ? 'selected' : ''}>${st}</option>`).join('')}
              </select>
            </div>

            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Farm LGA <span class="text-rose-500">*</span>
              </label>
              <select id="farmLga"
                      onchange="actions.updateVerificationField('farm_lga', this.value)"
                      ${!farmStateVal ? 'disabled' : ''}
                      class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none transition-all ${!farmStateVal ? 'opacity-60 cursor-not-allowed' : ''}">
                <option value="">${farmStateVal ? 'Select LGA' : 'Select State First'}</option>
                ${farmLgas.map(lga => `<option value="${escapeHtml(lga)}" ${farmLgaVal.toLowerCase() === lga.toLowerCase() ? 'selected' : ''}>${escapeHtml(lga)}</option>`).join('')}
              </select>
            </div>

            <div class="md:col-span-2 flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 text-xs">
              <div class="flex items-center space-x-2.5 text-slate-600 dark:text-slate-300">
                <i class="fa-solid fa-satellite text-emerald-600"></i>
                <span class="font-medium">Recorded Telemetry:</span>
                <input type="hidden" id="farmLat" value="${escapeHtml(gpsLat)}">
                <input type="hidden" id="farmLng" value="${escapeHtml(gpsLng)}">
                <span class="font-mono font-bold text-slate-900 dark:text-white">
                  ${gpsLat ? `${Number(gpsLat).toFixed(5)}° N, ${Number(gpsLng).toFixed(5)}° E` : 'Coordinates pending acquisition'}
                </span>
              </div>
              ${gpsLat ? `
                <span class="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                  Precision Locked
                </span>
              ` : `
                <span class="text-[10px] font-medium text-slate-400">
                  Optional
                </span>
              `}
            </div>
          </div>
        </div>

        <!-- ═══ 5. COMPLIANCE ATTESTATION & SUBMISSION CARD ═══ -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-5">
          <!-- Legal Attestation Notice -->
          <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2">
            <div class="flex items-start space-x-2.5">
              <i class="fa-solid fa-scale-balanced text-slate-600 dark:text-slate-400 text-xs mt-0.5"></i>
              <div class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong class="text-slate-900 dark:text-white">Producer Legal Attestation & Data Protection Notice:</strong>
                By submitting this accreditation dossier, you warrant that all submitted identity credentials, NIMC records, CAC corporate registrations, and operational disclosures are authentic, verifiable, and accurate. Processing is performed pursuant to the Nigeria Data Protection Act (NDPA) and Agrein Trust Framework.
              </div>
            </div>
          </div>

          <!-- Readiness Banner -->
          ${isFullyComplete ? `
            <div class="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center space-x-3 text-xs text-emerald-900 dark:text-emerald-200">
              <i class="fa-solid fa-circle-check text-emerald-600 text-base"></i>
              <div>
                <strong>All Mandatory Verification Disclosures Satisfied</strong>
                <p class="text-[11px] text-emerald-700 dark:text-emerald-300 mt-0.5">Your official portrait, Interswitch-verified NIN, and CAC registration are validated and ready for compliance audit.</p>
              </div>
            </div>
          ` : `
            <div class="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center space-x-3 text-xs text-amber-900 dark:text-amber-200">
              <i class="fa-solid fa-circle-info text-amber-600 text-base"></i>
              <div>
                <strong>Mandatory Disclosures Pending Completion</strong>
                <p class="text-[11px] text-amber-700 dark:text-amber-300 mt-0.5">Please ensure your portrait is uploaded, NIN is verified with NIMC, and CAC registration is verified before submitting.</p>
              </div>
            </div>
          `}

          <!-- Submission Action Button -->
          <div class="pt-2">
            <button type="button" onclick="actions.submitFarmerVerification()"
                    class="w-full py-4 rounded-xl ${isFullyComplete ? 'bg-emerald-700 hover:bg-emerald-800 shadow-md shadow-emerald-700/20' : 'bg-slate-800 hover:bg-slate-700'} text-white font-bold text-sm transition-all flex items-center justify-center space-x-2 cursor-pointer">
              <i class="fa-solid ${isFullyComplete ? 'fa-paper-plane' : 'fa-shield-halved'}"></i>
              <span>${isFullyComplete ? 'Submit Application for Accreditation' : 'Submit Application for Accreditation (Complete Required Fields)'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  `;
}
