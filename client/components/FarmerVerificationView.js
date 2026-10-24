// Farmer Verification View — Revamped: Top Profile Photo, Interswitch NIN & CAC (Test) Verification
// Removed old document uploads; streamlined instant verification workflow.

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
    'DRAFT':             { color: 'gray',    icon: 'fa-file-pen',              label: 'Draft Application',  bg: 'bg-gray-100 dark:bg-gray-800',            text: 'text-gray-600 dark:text-gray-300',       dot: '⚪' },
    'NOT_STARTED':       { color: 'gray',    icon: 'fa-file-pen',              label: 'Draft Application',  bg: 'bg-gray-100 dark:bg-gray-800',            text: 'text-gray-600 dark:text-gray-300',       dot: '⚪' },
    'PENDING':           { color: 'amber',   icon: 'fa-clock',                 label: 'Pending Review',     bg: 'bg-amber-50 dark:bg-amber-950/30',        text: 'text-amber-700 dark:text-amber-300',     dot: '🟡' },
    'PENDING_REVIEW':    { color: 'amber',   icon: 'fa-clock',                 label: 'Pending Review',     bg: 'bg-amber-50 dark:bg-amber-950/30',        text: 'text-amber-700 dark:text-amber-300',     dot: '🟡' },
    'UNDER_REVIEW':      { color: 'blue',    icon: 'fa-magnifying-glass',      label: 'Under Review',       bg: 'bg-blue-50 dark:bg-blue-950/30',          text: 'text-blue-700 dark:text-blue-300',       dot: '🔵' },
    'CHANGES_REQUIRED':  { color: 'orange',  icon: 'fa-triangle-exclamation',  label: 'Changes Required',   bg: 'bg-orange-50 dark:bg-orange-950/30',      text: 'text-orange-700 dark:text-orange-300',   dot: '🟠' },
    'APPROVED':          { color: 'emerald', icon: 'fa-circle-check',          label: 'Approved & Verified', bg: 'bg-emerald-50 dark:bg-emerald-950/30',   text: 'text-emerald-700 dark:text-emerald-300', dot: '🟢' },
    'REJECTED':          { color: 'red',     icon: 'fa-circle-xmark',          label: 'Rejected',           bg: 'bg-red-50 dark:bg-red-950/30',            text: 'text-red-700 dark:text-red-300',         dot: '🔴' },
    'SUSPENDED':         { color: 'red',     icon: 'fa-ban',                   label: 'Suspended',          bg: 'bg-red-50 dark:bg-red-950/30',            text: 'text-red-700 dark:text-red-300',         dot: '🔴' }
  };

  const sc = statusConfig[status] || statusConfig['DRAFT'];

  // Current values
  const photoUrl = app.avatar_url || app.profile_photo_url || (state.currentUser && state.currentUser.avatar_url) || '';
  const farmerName = app.farmer_name || (state.currentUser && state.currentUser.full_name) || '';
  const emailVal = app.email || (state.currentUser && state.currentUser.email) || '';
  const phoneVal = app.phone || (state.currentUser && state.currentUser.phone_number) || '';
  const stateVal = app.state || (state.currentUser && state.currentUser.state) || '';
  const lgaVal = app.lga || (state.currentUser && state.currentUser.lga) || '';
  const addressVal = app.residential_address || (state.currentUser && state.currentUser.address) || '';

  // NIN & Interswitch status
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

  // CAC & Interswitch test status
  const cacVal = String(app.cac_number || '').trim();
  const isCacVerified = Boolean(app.cac_verified && cacVal.length >= 3);
  const cacData = app.cac_data || null;

  // Location Details
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

  // Compulsory criteria breakdown (No documents required!)
  const photoItem = { key: 'photo', label: 'Farmer Profile Photo', done: Boolean(photoUrl) };

  const personalItems = [
    { key: 'name', label: 'Full Name', done: Boolean(farmerName.trim()) },
    { key: 'email', label: 'Email Address', done: Boolean(emailVal.trim()) },
    { key: 'phone', label: 'Phone Number', done: Boolean(phoneVal.trim()) },
    { key: 'state', label: 'Residential State', done: Boolean(stateVal) },
    { key: 'lga', label: 'Residential LGA', done: Boolean(lgaVal.trim()) },
    { key: 'address', label: 'Residential Address', done: Boolean(addressVal.trim()) },
    { key: 'nin', label: '11-Digit NIN Number', done: Boolean(ninVal.length === 11) },
    { key: 'nin_verified', label: 'Interswitch NIN Verification', done: isNinVerified }
  ];

  const farmItems = [
    { key: 'farm_name', label: 'Farm / Business Name', done: Boolean(farmNameVal.trim()) },
    { key: 'farm_type', label: 'Farm Type', done: Boolean(farmTypeVal) },
    { key: 'farm_size', label: 'Farm Size in Acres', done: Boolean(farmSizeVal && Number(farmSizeVal) > 0) },
    { key: 'years_exp', label: 'Years of Experience', done: Boolean(yearsExpVal !== '') },
    { key: 'crops', label: 'Crops/Livestock Produced', done: Boolean(cropsVal.trim()) },
    { key: 'cac', label: 'CAC Registration Number', done: Boolean(cacVal.length >= 3) },
    { key: 'cac_verified', label: 'Interswitch CAC Verification (Test)', done: isCacVerified }
  ];

  const locationItems = [
    { key: 'farm_address', label: 'Farm Physical Address', done: Boolean(farmAddressVal.trim()) },
    { key: 'farm_state', label: 'Farm State', done: Boolean(farmStateVal) },
    { key: 'farm_lga', label: 'Farm LGA', done: Boolean(farmLgaVal.trim()) }
  ];

  const allCriteria = [
    photoItem,
    ...personalItems,
    ...farmItems,
    ...locationItems
  ];

  const completedCount = allCriteria.filter(c => c.done).length;
  const totalCount = allCriteria.length;
  const completionPercent = Math.round((completedCount / totalCount) * 100);
  const isFullyComplete = completionPercent === 100;

  const sectionPillars = [
    { key: 'photo', label: 'Profile Photo', icon: 'fa-camera', total: 1, done: photoItem.done ? 1 : 0 },
    { key: 'personal', label: 'Personal & NIN', icon: 'fa-id-card', total: personalItems.length, done: personalItems.filter(i => i.done).length },
    { key: 'farm', label: 'Farm & CAC (Test)', icon: 'fa-building-wheat', total: farmItems.length, done: farmItems.filter(i => i.done).length },
    { key: 'location', label: 'Location & GPS', icon: 'fa-location-dot', total: locationItems.length, done: locationItems.filter(i => i.done).length }
  ];

  return `
    <section class="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 animate-fade-in">

      <!-- Header Title & Lock Notice -->
      <div class="text-center space-y-2">
        <div class="inline-flex w-14 h-14 sm:w-16 sm:h-16 rounded-3xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-amber-500 text-white items-center justify-center shadow-xl shadow-emerald-700/20">
          <i class="fa-solid fa-shield-halved text-2xl sm:text-3xl"></i>
        </div>
        <h1 class="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 dark:text-white">
          Farmer Verification & Registration
        </h1>
        <p class="text-xs sm:text-sm text-gray-500 max-w-xl mx-auto">
          Complete your profile picture, verify your NIN with NIMC via Interswitch, and register your farm entity with CAC testing.
        </p>

        ${userStatus !== 'APPROVED' ? `
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
            <i class="fa-solid fa-bolt text-amber-500"></i>
            <span>Instant Interswitch verification enabled for NIN & CAC (Test Suite)</span>
          </div>
        ` : ''}
      </div>

      <!-- ═══ 1. TOP FARMER PROFILE PICTURE CARD (PROMINENT AT TOP) ═══ -->
      <div class="glass-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-xl relative overflow-hidden">
        <div class="absolute -top-16 -right-16 w-48 h-48 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 rounded-full blur-2xl pointer-events-none"></div>

        <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
          
          <!-- Avatar Box with Camera Upload Badge -->
          <div class="relative group cursor-pointer" onclick="document.getElementById('farmerProfilePhotoInput').click()">
            <div class="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-500 p-1 shadow-2xl shadow-emerald-700/30 group-hover:scale-105 transition-transform duration-300">
              <div class="w-full h-full rounded-[22px] overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center relative">
                ${photoUrl ? `
                  <img src="${escapeHtml(photoUrl)}" alt="Farmer Profile Photo" class="w-full h-full object-cover">
                ` : `
                  <div class="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 p-2 text-center">
                    <i class="fa-solid fa-user text-3xl sm:text-4xl text-emerald-600 dark:text-emerald-400 mb-1"></i>
                    <span class="text-[9px] font-extrabold uppercase tracking-wider text-gray-400">Add Photo</span>
                  </div>
                `}
                <!-- Hover Overlay -->
                <div class="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[11px] font-bold">
                  <i class="fa-solid fa-camera text-base mb-1"></i>
                  <span>${photoUrl ? 'Change' : 'Upload'}</span>
                </div>
              </div>
            </div>

            <!-- Floating Camera Trigger Button -->
            <button type="button" class="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-800 text-white flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-900 group-hover:bg-emerald-500 transition-colors">
              <i class="fa-solid fa-camera text-xs"></i>
            </button>
          </div>

          <!-- Hidden File Input for Profile Photo -->
          <input type="file" id="farmerProfilePhotoInput" accept="image/*" onchange="actions.uploadFarmerProfilePhoto(event)" class="hidden">

          <!-- Farmer Profile Headline & Upload Prompt -->
          <div class="flex-1 text-center sm:text-left space-y-2">
            <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span class="text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full ${photoUrl ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700' : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700'}">
                ${photoUrl ? '✓ Profile Photo Uploaded' : '★ Compulsory: Add Farmer Photo'}
              </span>
              <span class="text-xs font-bold px-3 py-1 rounded-full ${sc.bg} ${sc.text}">
                ${sc.dot} ${sc.label}
              </span>
            </div>

            <h2 class="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 dark:text-white">
              ${escapeHtml(farmerName || 'Agrein Farmer Profile')}
            </h2>
            <p class="text-xs text-gray-500 font-mono">
              ${escapeHtml(emailVal || 'farmer@agrein.ng')} ${phoneVal ? `• ${escapeHtml(phoneVal)}` : ''}
            </p>
            <p class="text-xs text-gray-600 dark:text-gray-400 pt-1 leading-relaxed">
              Your profile photograph will appear on your verified produce listings, supplier storefront, and digital escrow invoices seen by buyers.
            </p>

            <div class="pt-2">
              <button type="button" onclick="document.getElementById('farmerProfilePhotoInput').click()"
                      class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-extrabold text-xs transition-all inline-flex items-center space-x-1.5 shadow-sm">
                <i class="fa-solid fa-cloud-arrow-up text-emerald-600 dark:text-emerald-400"></i>
                <span>${photoUrl ? 'Replace Profile Photo' : 'Choose Headshot Photo'}</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      <!-- ═══ 2. LIVE COMPLETION TRACKER & STATUS PROGRESS ═══ -->
      <div class="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-gray-200 dark:border-slate-800 shadow-sm space-y-4">
        
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-2xl ${sc.text} ${sc.bg} flex items-center justify-center text-lg shadow-sm">
              <i class="fa-solid ${sc.icon}"></i>
            </div>
            <div>
              <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Verification Readiness</div>
              <div class="text-sm font-heading font-extrabold text-slate-900 dark:text-white">
                ${isFullyComplete ? 'Ready for Immediate Verification Submission' : `${totalCount - completedCount} Compulsory Requirement${(totalCount - completedCount) === 1 ? '' : 's'} Remaining`}
              </div>
            </div>
          </div>

          <!-- Percentage Ring / Badge -->
          <div class="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/80 px-4 py-2 rounded-2xl border border-gray-200 dark:border-slate-700">
            <div class="text-right">
              <div class="text-[9px] uppercase tracking-wider font-extrabold text-gray-400">Completion</div>
              <div class="text-lg font-heading font-extrabold ${isFullyComplete ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}">
                ${completionPercent}%
              </div>
            </div>
            <div class="w-9 h-9 rounded-full flex items-center justify-center text-xs font-extrabold ${isFullyComplete ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'}">
              ${isFullyComplete ? '<i class="fa-solid fa-check"></i>' : `${completedCount}/${totalCount}`}
            </div>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="w-full h-3 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-gray-200 dark:border-slate-700">
          <div class="h-full rounded-full transition-all duration-500 ${isFullyComplete ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-500'}"
               style="width: ${completionPercent}%"></div>
        </div>

        <!-- 4 Section Pillars -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-gray-100 dark:border-slate-800">
          ${sectionPillars.map(p => {
            const isDone = p.done === p.total;
            return `
              <div class="p-3 rounded-2xl ${isDone ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300' : 'bg-slate-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800 text-gray-600 dark:text-gray-400'} text-center">
                <div class="flex items-center justify-center space-x-1.5 text-xs font-bold">
                  <i class="fa-solid ${p.icon} text-xs"></i>
                  <span class="truncate">${p.label}</span>
                </div>
                <div class="text-[11px] font-extrabold mt-1 ${isDone ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}">
                  ${p.done}/${p.total} ${isDone ? '✓' : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- ═══ 3. MAIN FORM: PERSONAL INFO & INTERSWITCH NIN VERIFICATION ═══ -->
      <div class="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        
        <div class="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-4">
          <div class="flex items-center space-x-3">
            <span class="w-8 h-8 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-extrabold text-sm flex items-center justify-center">1</span>
            <div>
              <h3 class="text-base sm:text-lg font-heading font-extrabold text-slate-900 dark:text-white">Personal Information & National Identity (NIN)</h3>
              <p class="text-xs text-gray-500">Provide legal identity information and verify your NIN via Interswitch</p>
            </div>
          </div>
          <span class="text-xs font-extrabold ${personalItems.every(i => i.done) ? 'text-emerald-600' : 'text-gray-400'}">
            ${personalItems.filter(i => i.done).length}/${personalItems.length} Complete
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="text-[11px] font-bold text-gray-600 dark:text-gray-400">Full Legal Name <span class="text-red-500">*</span></label>
            <input type="text" id="personalFullName" placeholder="e.g. Ibrahim Bello"
                   value="${escapeHtml(farmerName)}"
                   oninput="actions.updateVerificationField('farmer_name', this.value)"
                   class="w-full mt-1 px-4 py-2.5 rounded-xl border ${farmerName ? 'border-gray-300 dark:border-slate-700' : 'border-amber-300 dark:border-amber-700/60'} bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500">
          </div>

          <div>
            <label class="text-[11px] font-bold text-gray-600 dark:text-gray-400">Email Address <span class="text-red-500">*</span></label>
            <input type="email" id="personalEmail" placeholder="farmer@example.com"
                   value="${escapeHtml(emailVal)}"
                   oninput="actions.updateVerificationField('email', this.value)"
                   class="w-full mt-1 px-4 py-2.5 rounded-xl border ${emailVal ? 'border-gray-300 dark:border-slate-700' : 'border-amber-300 dark:border-amber-700/60'} bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500">
          </div>

          <div>
            <label class="text-[11px] font-bold text-gray-600 dark:text-gray-400">Phone Number <span class="text-red-500">*</span></label>
            <input type="tel" id="personalPhone" placeholder="08034567890"
                   value="${escapeHtml(phoneVal)}"
                   oninput="actions.updateVerificationField('phone', this.value)"
                   class="w-full mt-1 px-4 py-2.5 rounded-xl border ${phoneVal ? 'border-gray-300 dark:border-slate-700' : 'border-amber-300 dark:border-amber-700/60'} bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500">
          </div>

          <div>
            <label class="text-[11px] font-bold text-gray-600 dark:text-gray-400">Residential State <span class="text-red-500">*</span></label>
            <select id="personalState"
                    onchange="actions.updateVerificationField('state', this.value)"
                    class="w-full mt-1 px-4 py-2.5 rounded-xl border ${stateVal ? 'border-gray-300 dark:border-slate-700' : 'border-amber-300 dark:border-amber-700/60'} bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="">Select Residential State</option>
              ${nigerianStates.map(st => `<option value="${st}" ${stateVal === st ? 'selected' : ''}>${st}</option>`).join('')}
            </select>
          </div>

          <div>
            <label class="text-[11px] font-bold text-gray-600 dark:text-gray-400">Residential LGA <span class="text-red-500">*</span></label>
            <select id="personalLga"
                    onchange="actions.updateVerificationField('lga', this.value)"
                    ${!stateVal ? 'disabled' : ''}
                    class="w-full mt-1 px-4 py-2.5 rounded-xl border ${lgaVal ? 'border-gray-300 dark:border-slate-700' : 'border-amber-300 dark:border-amber-700/60'} bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 ${!stateVal ? 'opacity-60 cursor-not-allowed' : ''}">
              <option value="">${stateVal ? 'Select Residential LGA *' : 'Select State First'}</option>
              ${personalLgas.map(lga => `<option value="${escapeHtml(lga)}" ${lgaVal.toLowerCase() === lga.toLowerCase() ? 'selected' : ''}>${escapeHtml(lga)}</option>`).join('')}
            </select>
          </div>

          <div>
            <label class="text-[11px] font-bold text-gray-600 dark:text-gray-400">Residential Street Address <span class="text-red-500">*</span></label>
            <input type="text" id="personalAddress" placeholder="e.g. 14 Market Road, Sabon Gari"
                   value="${escapeHtml(addressVal)}"
                   oninput="actions.updateVerificationField('residential_address', this.value)"
                   class="w-full mt-1 px-4 py-2.5 rounded-xl border ${addressVal ? 'border-gray-300 dark:border-slate-700' : 'border-amber-300 dark:border-amber-700/60'} bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500">
          </div>
        </div>

        <!-- ═══ INTERSWITCH NIN VERIFICATION MODULE ═══ -->
        <div class="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/60 via-slate-50 to-emerald-50/60 dark:from-indigo-950/30 dark:via-slate-800/40 dark:to-emerald-950/30 border-2 ${isNinVerified ? 'border-emerald-500/60' : 'border-indigo-300/80 dark:border-indigo-800/60'} space-y-4">
          
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div class="flex items-center space-x-2.5">
              <div class="w-9 h-9 rounded-xl ${isNinVerified ? 'bg-emerald-600 text-white' : 'bg-indigo-600 text-white'} flex items-center justify-center text-sm shadow-md">
                <i class="fa-solid ${isNinVerified ? 'fa-check' : 'fa-id-card-clip'}"></i>
              </div>
              <div>
                <h4 class="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>National Identity Number (NIN)</span>
                  <span class="text-red-500 font-bold">*</span>
                </h4>
                <p class="text-[11px] text-gray-500">Real-time identity verification against NIMC registry via Interswitch Identity API</p>
              </div>
            </div>

            <!-- Verification Status Pill -->
            <div>
              ${isNinVerified ? `
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 shadow-sm">
                  <i class="fa-solid fa-circle-check text-emerald-600"></i>
                  <span>NIN Verified with Interswitch</span>
                </span>
              ` : `
                <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                  <i class="fa-solid fa-clock text-[10px]"></i>
                  <span>Verification Required</span>
                </span>
              `}
            </div>
          </div>

          <!-- NIN Input & Verify Action Button -->
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div class="relative flex-1">
              <input type="text" id="personalNin" maxlength="11" placeholder="Enter 11-digit NIN (e.g. 12345678901)"
                     value="${escapeHtml(ninVal)}"
                     oninput="actions.updateVerificationField('nin', this.value)"
                     class="w-full px-4 py-3 rounded-xl border ${isNinVerified ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/10' : (ninVal.length === 11 ? 'border-indigo-400' : 'border-gray-300 dark:border-slate-700')} bg-white dark:bg-slate-800 text-xs sm:text-sm font-mono font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500">
              <span class="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-gray-400">
                ${ninVal.length}/11
              </span>
            </div>

            <button type="button" id="verifyNinBtn" onclick="actions.verifyNin(document.getElementById('personalNin').value)"
                    ${state.ninVerifying ? 'disabled' : ''}
                    class="px-5 py-3 rounded-xl ${isNinVerified ? 'bg-emerald-700 hover:bg-emerald-800 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'} font-extrabold text-xs shadow-md transition-all flex items-center justify-center space-x-2 whitespace-nowrap ${state.ninVerifying ? 'opacity-70 cursor-wait' : ''}">
              <i class="fa-solid ${state.ninVerifying ? 'fa-spinner fa-spin' : (isNinVerified ? 'fa-rotate' : 'fa-shield-halved')}"></i>
              <span>${state.ninVerifying ? 'Verifying with Interswitch...' : (isNinVerified ? 'Re-Verify NIN' : 'Verify NIN with Interswitch')}</span>
            </button>
          </div>

          <!-- Verified Identity Details Card -->
          ${isNinVerified ? `
            <div class="p-3.5 rounded-xl bg-emerald-100/60 dark:bg-emerald-950/40 border border-emerald-300/80 dark:border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div class="space-y-0.5">
                <div class="font-extrabold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                  <i class="fa-solid fa-user-check text-emerald-600"></i>
                  <span>${escapeHtml((ninData && ninData.verified_name) || farmerName || 'Verified Citizen')}</span>
                </div>
                <div class="text-[10px] font-mono text-emerald-700 dark:text-emerald-400">
                  NIN: ••••••••${ninVal.slice(-3)} • ${(ninData && ninData.source) || 'Interswitch Identity Service (NIMC Registry)'}
                </div>
              </div>
              <div class="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-white/70 dark:bg-slate-900/60 px-3 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800 self-start sm:self-auto">
                Audited via Interswitch
              </div>
            </div>
          ` : ''}
        </div>

      </div>

      <!-- ═══ 4. FARM DETAILS & INTERSWITCH CAC VERIFICATION (TESTING) ═══ -->
      <div class="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        
        <div class="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-4">
          <div class="flex items-center space-x-3">
            <span class="w-8 h-8 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-extrabold text-sm flex items-center justify-center">2</span>
            <div>
              <h3 class="text-base sm:text-lg font-heading font-extrabold text-slate-900 dark:text-white">Farm Details & CAC Corporate Registration</h3>
              <p class="text-xs text-gray-500">Operational information and corporate CAC registration verified with Interswitch (Test Mode)</p>
            </div>
          </div>
          <span class="text-xs font-extrabold ${farmItems.every(i => i.done) ? 'text-emerald-600' : 'text-gray-400'}">
            ${farmItems.filter(i => i.done).length}/${farmItems.length} Complete
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="text-[11px] font-bold text-gray-600 dark:text-gray-400">Farm / Business Name <span class="text-red-500">*</span></label>
            <input type="text" id="farmName" placeholder="e.g. Green Gold Agro Farms"
                   value="${escapeHtml(farmNameVal)}"
                   oninput="actions.updateVerificationField('farm_name', this.value)"
                   class="w-full mt-1 px-4 py-2.5 rounded-xl border ${farmNameVal ? 'border-gray-300 dark:border-slate-700' : 'border-amber-300 dark:border-amber-700/60'} bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500">
          </div>

          <div>
            <label class="text-[11px] font-bold text-gray-600 dark:text-gray-400">Farm Type <span class="text-red-500">*</span></label>
            <select id="farmType"
                    onchange="actions.updateVerificationField('farm_type', this.value)"
                    class="w-full mt-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="Crop Farming" ${farmTypeVal === 'Crop Farming' ? 'selected' : ''}>Crop Farming</option>
              <option value="Livestock" ${farmTypeVal === 'Livestock' ? 'selected' : ''}>Livestock</option>
              <option value="Mixed" ${farmTypeVal === 'Mixed' ? 'selected' : ''}>Mixed Farming</option>
              <option value="Horticulture" ${farmTypeVal === 'Horticulture' ? 'selected' : ''}>Horticulture</option>
              <option value="Aquaculture" ${farmTypeVal === 'Aquaculture' ? 'selected' : ''}>Aquaculture & Fishery</option>
              <option value="Poultry" ${farmTypeVal === 'Poultry' ? 'selected' : ''}>Poultry</option>
            </select>
          </div>

          <div>
            <label class="text-[11px] font-bold text-gray-600 dark:text-gray-400">Farm Size in Acres <span class="text-red-500">*</span></label>
            <input type="number" id="farmSizeAcres" placeholder="e.g. 50" min="0.1" step="0.1"
                   value="${escapeHtml(farmSizeVal)}"
                   oninput="actions.updateVerificationField('farm_size_acres', this.value)"
                   class="w-full mt-1 px-4 py-2.5 rounded-xl border ${farmSizeVal ? 'border-gray-300 dark:border-slate-700' : 'border-amber-300 dark:border-amber-700/60'} bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500">
          </div>

          <div>
            <label class="text-[11px] font-bold text-gray-600 dark:text-gray-400">Years of Experience <span class="text-red-500">*</span></label>
            <input type="number" id="yearsExperience" placeholder="e.g. 5" min="0"
                   value="${escapeHtml(yearsExpVal)}"
                   oninput="actions.updateVerificationField('years_experience', this.value)"
                   class="w-full mt-1 px-4 py-2.5 rounded-xl border ${yearsExpVal !== '' ? 'border-gray-300 dark:border-slate-700' : 'border-amber-300 dark:border-amber-700/60'} bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500">
          </div>

          <div class="md:col-span-2">
            <label class="text-[11px] font-bold text-gray-600 dark:text-gray-400">Crops / Livestock Produced <span class="text-red-500">*</span></label>
            <input type="text" id="cropsProduced" placeholder="e.g. Yellow Maize, Soya Beans, Cassava, Cattle"
                   value="${escapeHtml(cropsVal)}"
                   oninput="actions.updateVerificationField('crops_produced', this.value)"
                   class="w-full mt-1 px-4 py-2.5 rounded-xl border ${cropsVal ? 'border-gray-300 dark:border-slate-700' : 'border-amber-300 dark:border-amber-700/60'} bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500">
          </div>

          <div class="md:col-span-2">
            <label class="text-[11px] font-bold text-gray-600 dark:text-gray-400">Products Intended for Sale on Agrein</label>
            <input type="text" id="intendedProducts" placeholder="e.g. Bagged Maize (50kg), Cleaned Soya, Cassava Tubers"
                   value="${escapeHtml(intendedVal)}"
                   oninput="actions.updateVerificationField('intended_products', this.value)"
                   class="w-full mt-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500">
          </div>
        </div>

        <!-- ═══ INTERSWITCH CAC VERIFICATION MODULE (TESTING) ═══ -->
        <div class="p-5 rounded-2xl bg-gradient-to-br from-teal-50/60 via-slate-50 to-emerald-50/60 dark:from-teal-950/30 dark:via-slate-800/40 dark:to-emerald-950/30 border-2 ${isCacVerified ? 'border-emerald-500/60' : 'border-teal-300/80 dark:border-teal-800/60'} space-y-4">
          
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div class="flex items-center space-x-2.5">
              <div class="w-9 h-9 rounded-xl ${isCacVerified ? 'bg-emerald-600 text-white' : 'bg-teal-600 text-white'} flex items-center justify-center text-sm shadow-md">
                <i class="fa-solid ${isCacVerified ? 'fa-building-circle-check' : 'fa-building'}"></i>
              </div>
              <div>
                <h4 class="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>Corporate Affairs Commission (CAC) Registration</span>
                  <span class="text-red-500 font-bold">*</span>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300">Testing Mode</span>
                </h4>
                <p class="text-[11px] text-gray-500">Verify your RC Number or Business Name (BN) with Interswitch Corporate API (Test Suite)</p>
              </div>
            </div>

            <!-- CAC Status Pill -->
            <div>
              ${isCacVerified ? `
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 shadow-sm">
                  <i class="fa-solid fa-circle-check text-emerald-600"></i>
                  <span>CAC Verified with Interswitch (Test)</span>
                </span>
              ` : `
                <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                  <i class="fa-solid fa-clock text-[10px]"></i>
                  <span>Test Verification Required</span>
                </span>
              `}
            </div>
          </div>

          <!-- CAC Input & Verify Action Button -->
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div class="relative flex-1">
              <input type="text" id="farmCac" placeholder="Enter RC or BN Number (e.g. RC-1234567 or BN-9876543)"
                     value="${escapeHtml(cacVal)}"
                     oninput="actions.updateVerificationField('cac_number', this.value)"
                     class="w-full px-4 py-3 rounded-xl border ${isCacVerified ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/10' : (cacVal.length >= 3 ? 'border-teal-400' : 'border-gray-300 dark:border-slate-700')} bg-white dark:bg-slate-800 text-xs sm:text-sm font-mono font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500">
            </div>

            <button type="button" id="verifyCacBtn" onclick="actions.verifyCac(document.getElementById('farmCac').value)"
                    ${state.cacVerifying ? 'disabled' : ''}
                    class="px-5 py-3 rounded-xl ${isCacVerified ? 'bg-emerald-700 hover:bg-emerald-800 text-white' : 'bg-teal-600 hover:bg-teal-700 text-white'} font-extrabold text-xs shadow-md transition-all flex items-center justify-center space-x-2 whitespace-nowrap ${state.cacVerifying ? 'opacity-70 cursor-wait' : ''}">
              <i class="fa-solid ${state.cacVerifying ? 'fa-spinner fa-spin' : (isCacVerified ? 'fa-rotate' : 'fa-building-circle-arrow-right')}"></i>
              <span>${state.cacVerifying ? 'Verifying with Interswitch...' : (isCacVerified ? 'Re-Verify CAC (Test)' : 'Verify CAC (Interswitch Test)')}</span>
            </button>
          </div>

          <!-- Verified CAC Details Card -->
          ${isCacVerified ? `
            <div class="p-3.5 rounded-xl bg-teal-100/60 dark:bg-teal-950/40 border border-teal-300/80 dark:border-teal-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div class="space-y-0.5">
                <div class="font-extrabold text-teal-900 dark:text-teal-200 flex items-center gap-1.5">
                  <i class="fa-solid fa-circle-check text-emerald-600"></i>
                  <span>${escapeHtml((cacData && cacData.registered_name) || farmNameVal || 'Agro-Allied Ventures Nigeria Ltd')}</span>
                </div>
                <div class="text-[10px] font-mono text-teal-800 dark:text-teal-400">
                  Registration: ${escapeHtml((cacData && cacData.cac_number) || cacVal)} • Type: ${escapeHtml((cacData && cacData.registration_type) || 'Incorporated Business')} • Status: ACTIVE
                </div>
              </div>
              <div class="text-[10px] font-bold text-teal-800 dark:text-teal-300 bg-white/70 dark:bg-slate-900/60 px-3 py-1 rounded-lg border border-teal-200 dark:border-teal-800 self-start sm:self-auto">
                Interswitch CAC Test Suite
              </div>
            </div>
          ` : ''}

        </div>

      </div>

      <!-- ═══ 5. FARM LOCATION & SATELLITE GPS ═══ -->
      <div class="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        
        <div class="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-4">
          <div class="flex items-center space-x-3">
            <span class="w-8 h-8 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-extrabold text-sm flex items-center justify-center">3</span>
            <div>
              <h3 class="text-base sm:text-lg font-heading font-extrabold text-slate-900 dark:text-white">Farm Physical Location & GPS</h3>
              <p class="text-xs text-gray-500">Provide the physical address where produce is grown and harvested</p>
            </div>
          </div>
          <span class="text-xs font-extrabold ${locationItems.every(i => i.done) ? 'text-emerald-600' : 'text-gray-400'}">
            ${locationItems.filter(i => i.done).length}/${locationItems.length} Complete
          </span>
        </div>

        <!-- GPS Auto-detection Banner -->
        <div class="p-4 rounded-2xl bg-gradient-to-r from-emerald-900/10 via-emerald-800/5 to-amber-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div class="text-center sm:text-left">
            <div class="text-xs font-extrabold text-slate-900 dark:text-white flex items-center justify-center sm:justify-start gap-1.5">
              <i class="fa-solid fa-location-crosshairs text-amber-500"></i>
              <span>Live GPS Satellite Auto-Detection</span>
            </div>
            <p class="text-[11px] text-gray-500 mt-0.5">Click to auto-detect your current coordinates and automatically populate farm state & LGA.</p>
          </div>
          <button type="button" id="detectLocationBtn" onclick="actions.detectGpsLocation()"
                  class="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all whitespace-nowrap flex items-center space-x-1.5">
            <i class="fa-solid fa-location-crosshairs text-amber-300"></i>
            <span>Detect & Auto-fill Location</span>
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="md:col-span-2">
            <label class="text-[11px] font-bold text-gray-600 dark:text-gray-400">Farm Physical Address / Landmark <span class="text-red-500">*</span></label>
            <input type="text" id="farmAddress" placeholder="e.g. Km 12 Zaria-Kano Expressway, Dakace Village"
                   value="${escapeHtml(farmAddressVal)}"
                   oninput="actions.updateVerificationField('farm_location', this.value)"
                   class="w-full mt-1 px-4 py-2.5 rounded-xl border ${farmAddressVal ? 'border-gray-300 dark:border-slate-700' : 'border-amber-300 dark:border-amber-700/60'} bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500">
          </div>

          <div>
            <label class="text-[11px] font-bold text-gray-600 dark:text-gray-400">Farm State <span class="text-red-500">*</span></label>
            <select id="farmState"
                    onchange="actions.updateVerificationField('farm_state', this.value)"
                    class="w-full mt-1 px-4 py-2.5 rounded-xl border ${farmStateVal ? 'border-gray-300 dark:border-slate-700' : 'border-amber-300 dark:border-amber-700/60'} bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="">Select Farm State</option>
              ${nigerianStates.map(st => `<option value="${st}" ${farmStateVal === st ? 'selected' : ''}>${st}</option>`).join('')}
            </select>
          </div>

          <div>
            <label class="text-[11px] font-bold text-gray-600 dark:text-gray-400">Farm LGA <span class="text-red-500">*</span></label>
            <select id="farmLga"
                    onchange="actions.updateVerificationField('farm_lga', this.value)"
                    ${!farmStateVal ? 'disabled' : ''}
                    class="w-full mt-1 px-4 py-2.5 rounded-xl border ${farmLgaVal ? 'border-gray-300 dark:border-slate-700' : 'border-amber-300 dark:border-amber-700/60'} bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 ${!farmStateVal ? 'opacity-60 cursor-not-allowed' : ''}">
              <option value="">${farmStateVal ? 'Select Farm LGA *' : 'Select Farm State First'}</option>
              ${farmLgas.map(lga => `<option value="${escapeHtml(lga)}" ${farmLgaVal.toLowerCase() === lga.toLowerCase() ? 'selected' : ''}>${escapeHtml(lga)}</option>`).join('')}
            </select>
          </div>

          <div class="md:col-span-2 flex items-center space-x-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs text-gray-500">
            <i class="fa-solid fa-satellite text-emerald-600"></i>
            <span>Satellite Coordinates: </span>
            <input type="hidden" id="farmLat" value="${escapeHtml(gpsLat)}">
            <input type="hidden" id="farmLng" value="${escapeHtml(gpsLng)}">
            <span class="font-mono font-bold text-slate-800 dark:text-white">
              ${gpsLat ? `${gpsLat}° N, ${gpsLng}° E` : 'Not recorded yet (use auto-detect above)'}
            </span>
          </div>
        </div>

      </div>

      <!-- ═══ SUBMIT VERIFICATION ACTION FOOTER ═══ -->
      <div class="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
        
        ${isFullyComplete ? `
          <div class="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex items-center space-x-3 text-xs text-emerald-900 dark:text-emerald-200">
            <i class="fa-solid fa-circle-check text-emerald-600 text-lg"></i>
            <div>
              <strong>100% Compulsory Verification Criteria Satisfied!</strong>
              <p class="text-[11px] text-emerald-700 dark:text-emerald-300 mt-0.5">Your profile photo, Interswitch verified NIN, and Interswitch verified CAC (Test) details are ready for submission.</p>
            </div>
          </div>
        ` : `
          <div class="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 flex items-center space-x-3 text-xs text-amber-900 dark:text-amber-200">
            <i class="fa-solid fa-circle-exclamation text-amber-600 text-lg"></i>
            <div>
              <strong>${totalCount - completedCount} Compulsory Requirement${(totalCount - completedCount) === 1 ? '' : 's'} Remaining</strong>
              <p class="text-[11px] text-amber-700 dark:text-amber-300 mt-0.5">Ensure profile photo is set, NIN is verified with Interswitch, and CAC is verified with Interswitch (Test) to unlock submission.</p>
            </div>
          </div>
        `}

        <button type="button" onclick="actions.submitFarmerVerification()"
                class="w-full py-4 rounded-2xl ${isFullyComplete ? 'bg-gradient-to-r from-emerald-700 via-emerald-800 to-teal-800 hover:shadow-2xl shadow-emerald-700/30' : 'bg-slate-700 opacity-90'} text-white font-extrabold text-sm shadow-xl transition-all flex items-center justify-center space-x-2">
          <i class="fa-solid ${isFullyComplete ? 'fa-paper-plane text-amber-300' : 'fa-lock text-amber-300'}"></i>
          <span>${isFullyComplete ? 'Submit Verification Application' : `Submit Verification Application (${completionPercent}% Complete)`}</span>
        </button>

      </div>

    </section>
  `;
}
