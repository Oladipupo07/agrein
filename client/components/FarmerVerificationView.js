// Farmer Verification View — Complete 7-Stage Status Lifecycle & Application Wizard with Live Completion Tracking

function renderFarmerVerificationView(state, actions) {
  const app = state.mockData.farmerVerificationApp || {};
  const userStatus = (state.currentUser && state.currentUser.verification_status) || 'NOT_STARTED';
  const status = app.status || 'DRAFT';

  const statusConfig = {
    'DRAFT':             { color: 'gray',    icon: 'fa-file-pen',              label: 'Draft',              bg: 'bg-gray-100 dark:bg-gray-800',            text: 'text-gray-600 dark:text-gray-300',       dot: '⚪', step: 0 },
    'NOT_STARTED':       { color: 'gray',    icon: 'fa-file-pen',              label: 'Draft',              bg: 'bg-gray-100 dark:bg-gray-800',            text: 'text-gray-600 dark:text-gray-300',       dot: '⚪', step: 0 },
    'PENDING':           { color: 'amber',   icon: 'fa-clock',                 label: 'Pending Review',     bg: 'bg-amber-50 dark:bg-amber-950/30',        text: 'text-amber-700 dark:text-amber-300',     dot: '🟡', step: 1 },
    'PENDING_REVIEW':    { color: 'amber',   icon: 'fa-clock',                 label: 'Pending Review',     bg: 'bg-amber-50 dark:bg-amber-950/30',        text: 'text-amber-700 dark:text-amber-300',     dot: '🟡', step: 1 },
    'UNDER_REVIEW':      { color: 'blue',    icon: 'fa-magnifying-glass',      label: 'Under Review',       bg: 'bg-blue-50 dark:bg-blue-950/30',          text: 'text-blue-700 dark:text-blue-300',       dot: '🔵', step: 2 },
    'CHANGES_REQUIRED':  { color: 'orange',  icon: 'fa-triangle-exclamation',  label: 'Changes Required',   bg: 'bg-orange-50 dark:bg-orange-950/30',      text: 'text-orange-700 dark:text-orange-300',   dot: '🟠', step: 2 },
    'APPROVED':          { color: 'emerald', icon: 'fa-circle-check',          label: 'Approved',           bg: 'bg-emerald-50 dark:bg-emerald-950/30',    text: 'text-emerald-700 dark:text-emerald-300', dot: '🟢', step: 3 },
    'REJECTED':          { color: 'red',     icon: 'fa-circle-xmark',          label: 'Rejected',           bg: 'bg-red-50 dark:bg-red-950/30',            text: 'text-red-700 dark:text-red-300',         dot: '🔴', step: -1 },
    'SUSPENDED':         { color: 'red',     icon: 'fa-ban',                   label: 'Suspended',          bg: 'bg-red-50 dark:bg-red-950/30',            text: 'text-red-700 dark:text-red-300',         dot: '🔴', step: -2 }
  };

  const sc = statusConfig[status] || statusConfig['DRAFT'];

  // Compulsory Fields & Real-time Completion Rate Calculation
  const docs = app.documents || [];
  const hasGovId = docs.some(d => d.type === 'government_id');
  const hasFarmPhoto = docs.some(d => d.type === 'farm_photo');
  const hasProfilePhoto = docs.some(d => d.type === 'profile_photo');

  const farmerName = app.farmer_name || (state.currentUser && state.currentUser.full_name) || '';
  const emailVal = app.email || (state.currentUser && state.currentUser.email) || '';
  const phoneVal = app.phone || (state.currentUser && state.currentUser.phone_number) || '';
  const stateVal = app.state || (state.currentUser && state.currentUser.state) || '';
  const lgaVal = app.lga || (state.currentUser && state.currentUser.lga) || '';
  const addressVal = app.residential_address || (state.currentUser && state.currentUser.address) || '';

  const farmNameVal = app.farm_name || '';
  const farmTypeVal = app.farm_type || 'Crop Farming';
  const farmSizeVal = app.farm_size_acres || '';
  const yearsExpVal = app.years_experience !== undefined && app.years_experience !== null ? app.years_experience : '';
  const cropsVal = Array.isArray(app.crops_produced) ? app.crops_produced.join(', ') : (app.crops_produced || '');

  const farmAddressVal = app.farm_location || '';
  const farmStateVal = app.farm_state || app.state || '';
  const farmLgaVal = app.farm_lga || app.lga || '';
  const farmLatVal = app.gps_latitude || '';
  const farmLngVal = app.gps_longitude || '';

  const personalItems = [
    { key: 'name', label: 'Full Name', done: Boolean(farmerName.trim()) },
    { key: 'email', label: 'Email Address', done: Boolean(emailVal.trim()) },
    { key: 'phone', label: 'Phone Number', done: Boolean(phoneVal.trim()) },
    { key: 'state', label: 'Residential State', done: Boolean(stateVal) },
    { key: 'lga', label: 'Residential LGA', done: Boolean(lgaVal.trim()) },
    { key: 'address', label: 'Residential Address', done: Boolean(addressVal.trim()) }
  ];

  const farmItems = [
    { key: 'farm_name', label: 'Farm / Business Name', done: Boolean(farmNameVal.trim()) },
    { key: 'farm_type', label: 'Farm Type', done: Boolean(farmTypeVal) },
    { key: 'farm_size', label: 'Farm Size in Acres', done: Boolean(farmSizeVal && Number(farmSizeVal) > 0) },
    { key: 'years_exp', label: 'Years of Experience', done: Boolean(yearsExpVal !== '') },
    { key: 'crops', label: 'Crops/Livestock Produced', done: Boolean(cropsVal.trim()) }
  ];

  const locationItems = [
    { key: 'farm_address', label: 'Farm Physical Address', done: Boolean(farmAddressVal.trim()) },
    { key: 'farm_state', label: 'Farm State', done: Boolean(farmStateVal) },
    { key: 'farm_lga', label: 'Farm LGA', done: Boolean(farmLgaVal.trim()) },
    { key: 'farm_coords', label: 'GPS Coordinates (Lat & Lng)', done: Boolean(farmLatVal && farmLngVal) }
  ];

  const docItems = [
    { key: 'government_id', label: 'Government ID Document', done: hasGovId },
    { key: 'farm_photo', label: 'Farm Overview Photo', done: hasFarmPhoto },
    { key: 'profile_photo', label: 'Farmer Profile Photo', done: hasProfilePhoto }
  ];

  const allCriteria = [
    ...personalItems,
    ...farmItems,
    ...locationItems,
    ...docItems
  ];

  const completedCount = allCriteria.filter(c => c.done).length;
  const totalCount = allCriteria.length;
  const completionPercent = Math.round((completedCount / totalCount) * 100);
  const isFullyComplete = completionPercent === 100;

  const sections = [
    { key: 'personal', label: 'Personal Information', icon: 'fa-user', total: personalItems.length, done: personalItems.filter(i => i.done).length },
    { key: 'farm', label: 'Farm Information', icon: 'fa-tractor', total: farmItems.length, done: farmItems.filter(i => i.done).length },
    { key: 'location', label: 'Farm Location & GPS', icon: 'fa-map-location-dot', total: locationItems.length, done: locationItems.filter(i => i.done).length },
    { key: 'documents', label: 'Compulsory Documents & Photos', icon: 'fa-file-shield', total: docItems.length, done: docItems.filter(i => i.done).length }
  ];

  // Status timeline steps
  const timelineSteps = [
    { label: 'Application',  icon: 'fa-file-pen',         key: 'DRAFT' },
    { label: 'Submitted',    icon: 'fa-paper-plane',       key: 'PENDING_REVIEW' },
    { label: 'Under Review', icon: 'fa-magnifying-glass',  key: 'UNDER_REVIEW' },
    { label: 'Decision',     icon: 'fa-gavel',             key: 'APPROVED' }
  ];

  const currentStep = sc.step;

  return `
    <section class="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div class="text-center mb-6 sm:mb-8">
        <div class="inline-flex w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-amber-500 text-white items-center justify-center mb-3 sm:mb-4 shadow-xl shadow-emerald-700/20">
          <i class="fa-solid fa-shield-halved text-xl sm:text-2xl"></i>
        </div>
        <h1 class="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 dark:text-white">Farmer Verification</h1>
        <p class="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">Complete all compulsory verification criteria to start selling on Agrein</p>

        <!-- Standalone lock indicator -->
        ${userStatus !== 'APPROVED' ? `
          <div class="mt-3 sm:mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-700/40 text-amber-800 dark:text-amber-300 text-[11px] sm:text-xs font-bold">
            <i class="fa-solid fa-lock text-[10px]"></i>
            <span>Platform selling access unlocks once an Agrein admin reviews and approves your farm.</span>
          </div>
        ` : ''}
      </div>

      <!-- ═══ STATUS TIMELINE TRACKER ═══ -->
      ${status !== 'DRAFT' ? `
        <div class="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-4 sm:p-6 mb-6 sm:mb-8 shadow-sm">
          <h3 class="text-xs font-heading font-extrabold text-slate-900 dark:text-white mb-4 sm:mb-5">Verification Progress</h3>
          <div class="relative">
            <div class="absolute top-4 left-0 right-0 h-1 bg-gray-200 dark:bg-slate-700 rounded-full mx-8"></div>
            <div class="absolute top-4 left-0 h-1 rounded-full mx-8 transition-all duration-700 ${status === 'REJECTED' || status === 'SUSPENDED' ? 'bg-red-500' : 'bg-emerald-500'}"
                 style="width: ${status === 'REJECTED' || status === 'SUSPENDED' ? '100' : Math.max(0, Math.min(100, (currentStep / 3) * 100))}%"></div>

            <div class="relative flex justify-between">
              ${timelineSteps.map((step, idx) => {
                let stepState = 'upcoming';
                if (status === 'REJECTED' || status === 'SUSPENDED') stepState = 'error';
                else if (idx < currentStep) stepState = 'completed';
                else if (idx === currentStep) stepState = 'active';
                else if (status === 'CHANGES_REQUIRED' && idx === 2) stepState = 'warning';

                const styles = {
                  completed: 'bg-emerald-500 text-white border-emerald-500 shadow-emerald-500/30',
                  active: 'bg-blue-500 text-white border-blue-500 shadow-blue-500/30 animate-pulse',
                  warning: 'bg-orange-500 text-white border-orange-500 shadow-orange-500/30',
                  error: 'bg-red-500 text-white border-red-500 shadow-red-500/30',
                  upcoming: 'bg-gray-200 dark:bg-slate-700 text-gray-400 dark:text-slate-500 border-gray-300 dark:border-slate-600'
                };

                return `
                  <div class="flex flex-col items-center" style="width: 25%;">
                    <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-[11px] sm:text-xs border-2 shadow-md ${styles[stepState]} transition-all duration-500">
                      ${stepState === 'completed' ? '<i class="fa-solid fa-check"></i>' : `<i class="fa-solid ${step.icon}"></i>`}
                    </div>
                    <span class="text-[9px] sm:text-[10px] font-bold mt-1.5 sm:mt-2 text-center ${stepState === 'upcoming' ? 'text-gray-400' : 'text-slate-700 dark:text-gray-200'}">${step.label}</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      ` : ''}

      <!-- ═══ LIVE COMPLETION RATE TRACKER & STATUS BANNER ═══ -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-200 dark:border-slate-800 shadow-sm space-y-4 sm:space-y-5">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl ${sc.text} ${sc.bg} flex items-center justify-center text-lg sm:text-xl shadow-sm">
              <i class="fa-solid ${sc.icon}"></i>
            </div>
            <div>
              <div class="text-[10px] sm:text-xs font-bold text-gray-500">Application Status</div>
              <div class="text-sm sm:text-base font-heading font-extrabold ${sc.text}">${sc.dot} ${sc.label}</div>
            </div>
          </div>

          <!-- Live Completion Rate Badge -->
          <div class="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-3 bg-slate-50 dark:bg-slate-800/80 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-slate-700">
            <div class="text-left sm:text-right">
              <div class="text-[9px] sm:text-[10px] uppercase tracking-wider font-extrabold text-gray-400">Completion Rate</div>
              <div class="text-base sm:text-lg font-heading font-extrabold ${isFullyComplete ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}">
                ${completionPercent}%
              </div>
            </div>
            <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs font-extrabold ${isFullyComplete ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'}">
              ${isFullyComplete ? '<i class="fa-solid fa-check text-sm sm:text-base"></i>' : `${completedCount}/${totalCount}`}
            </div>
          </div>
        </div>

        <!-- Real-time Progress Bar -->
        <div>
          <div class="flex items-center justify-between text-xs font-bold mb-2">
            <span class="text-slate-700 dark:text-gray-300 flex items-center gap-1.5">
              <i class="fa-solid fa-list-check text-emerald-600"></i>
              <span>Compulsory Verification Criteria</span>
            </span>
            <span class="${isFullyComplete ? 'text-emerald-600 font-extrabold' : 'text-gray-500'}">
              ${completedCount} of ${totalCount} compulsory requirements filled
            </span>
          </div>
          <div class="w-full h-3 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-gray-200 dark:border-slate-700">
            <div class="h-full rounded-full transition-all duration-500 ${isFullyComplete ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' : 'bg-gradient-to-r from-amber-500 to-emerald-500'}"
                 style="width: ${completionPercent}%"></div>
          </div>
        </div>

        <!-- Section Pillars Breakdown -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-gray-100 dark:border-slate-800">
          ${sections.map(s => {
            const isSecDone = s.done === s.total;
            return `
              <div class="p-2.5 rounded-xl ${isSecDone ? 'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40' : 'bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800'} text-center">
                <div class="flex items-center justify-center space-x-1.5 text-xs font-bold ${isSecDone ? 'text-emerald-700 dark:text-emerald-300' : 'text-gray-600 dark:text-gray-400'}">
                  <i class="fa-solid ${s.icon} text-[11px]"></i>
                  <span class="truncate">${s.label.split(' ')[0]}</span>
                </div>
                <div class="mt-1 text-[11px] font-extrabold ${isSecDone ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500'}">
                  ${s.done}/${s.total} ${isSecDone ? '✓' : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>

        ${!isFullyComplete && (status === 'DRAFT' || status === 'CHANGES_REQUIRED') ? `
          <div class="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 flex items-start space-x-2.5 text-xs text-amber-800 dark:text-amber-200">
            <i class="fa-solid fa-triangle-exclamation text-amber-600 mt-0.5"></i>
            <div>
              <strong>Compulsory Submission Requirement:</strong> All mandatory fields marked with an asterisk (<span class="text-red-500 font-bold">*</span>) including Government ID, Farm Photo, and Profile Photo must be provided before submission is enabled.
            </div>
          </div>
        ` : isFullyComplete && (status === 'DRAFT' || status === 'CHANGES_REQUIRED') ? `
          <div class="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 flex items-center space-x-2.5 text-xs text-emerald-800 dark:text-emerald-200 font-bold animate-fade-in">
            <i class="fa-solid fa-circle-check text-emerald-600 text-sm"></i>
            <span>🎉 100% Complete! All compulsory verification details have been filled. You can now submit your application below.</span>
          </div>
        ` : ''}
      </div>

      <!-- ═══ STATUS NOTICE BANNERS ═══ -->
      ${status === 'PENDING_REVIEW' ? `
        <div class="mb-8 p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40">
          <div class="flex items-center space-x-2 text-amber-700 dark:text-amber-300 font-bold text-xs mb-1">
            <i class="fa-solid fa-hourglass-half"></i>
            <span>Application Submitted — Pending Admin Review</span>
          </div>
          <p class="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">Your verification application has been submitted successfully. Our admin team will begin reviewing your documents within 18–24 hours.</p>
        </div>
      ` : status === 'UNDER_REVIEW' ? `
        <div class="mb-8 p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/40">
          <div class="flex items-center space-x-2 text-blue-700 dark:text-blue-300 font-bold text-xs mb-1">
            <i class="fa-solid fa-magnifying-glass animate-pulse"></i>
            <span>Active Review in Progress</span>
          </div>
          <p class="text-xs text-blue-800 dark:text-blue-200 leading-relaxed">An Agrein administrator is currently reviewing your documents, farm GPS location, and farmer credentials.</p>
        </div>
      ` : status === 'CHANGES_REQUIRED' ? `
        <div class="mb-8 p-5 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/40">
          <div class="flex items-center space-x-2 text-orange-700 dark:text-orange-300 font-bold text-xs mb-1">
            <i class="fa-solid fa-triangle-exclamation"></i>
            <span>Admin Feedback — Action Required</span>
          </div>
          <p class="text-xs text-orange-800 dark:text-orange-200 leading-relaxed mt-1">"${app.changes_requested_notes || 'Please upload a clearer image of your government ID or update farm details.'}"</p>
        </div>
      ` : status === 'REJECTED' ? `
        <div class="mb-8 p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40 space-y-3">
          <div class="flex items-center space-x-2 text-rose-700 dark:text-rose-300 font-bold text-sm">
            <i class="fa-solid fa-circle-xmark text-lg text-rose-600"></i>
            <span>Verification Application Rejected</span>
          </div>
          <div class="p-3.5 rounded-xl bg-white dark:bg-rose-900/30 border border-rose-100 dark:border-rose-800/50">
            <div class="text-[10px] font-bold uppercase tracking-wider text-rose-500 mb-1">Reason for Rejection:</div>
            <p class="text-xs text-rose-900 dark:text-rose-200 font-medium leading-relaxed">"${app.rejection_reason || app.admin_notes || 'The submitted documents or farm information could not be verified by the admin team.'}"</p>
          </div>
          <p class="text-xs text-rose-700 dark:text-rose-300">You can review your inputs, make necessary corrections, and re-apply for verification.</p>
          <button onclick="actions.reapplyVerification()" class="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-lg shadow-rose-600/20 transition-all flex items-center space-x-1.5">
            <i class="fa-solid fa-rotate mr-1"></i>
            <span>Update & Re-apply for Verification</span>
          </button>
        </div>
      ` : status === 'SUSPENDED' ? `
        <div class="mb-8 p-6 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/40 space-y-3">
          <div class="flex items-center space-x-2 text-red-700 dark:text-red-300 font-bold text-sm">
            <i class="fa-solid fa-ban text-lg text-red-600"></i>
            <span>Farmer Account Suspended</span>
          </div>
          <p class="text-xs text-red-800 dark:text-red-200 font-medium">"${app.admin_notes || 'Your verified status has been temporarily suspended by an administrator.'}"</p>
          <button onclick="actions.reapplyVerification()" class="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow transition-all">
            <span>Request Account Reinstatement</span>
          </button>
        </div>
      ` : status === 'APPROVED' ? `
        <div class="mb-8 p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-center space-y-2">
          <div class="inline-flex w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 items-center justify-center text-xl">
            <i class="fa-solid fa-circle-check"></i>
          </div>
          <h3 class="text-base font-heading font-extrabold text-emerald-800 dark:text-emerald-200">You are an Agrein Verified Farmer</h3>
          <p class="text-xs text-emerald-700 dark:text-emerald-300">Your farm has been verified. You can now create and manage product listings on the marketplace.</p>
          <button onclick="actions.setView('farmer-dashboard')" class="mt-3 px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow transition-all">
            <i class="fa-solid fa-store mr-1.5"></i>Start Listing Produce
          </button>
        </div>
      ` : ''}

      <!-- ═══ VERIFICATION APPLICATION FORM (Fillable & Editable) ═══ -->
      ${status !== 'APPROVED' ? `
        <div class="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-8">
          
          <div class="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-4">
            <div>
              <h3 class="text-lg font-heading font-extrabold text-slate-900 dark:text-white">Farm Verification Application</h3>
              <p class="text-xs text-gray-500 mt-0.5">Please fill all mandatory sections accurately. All fields with <span class="text-red-500 font-bold">*</span> are compulsory.</p>
            </div>
            <span class="px-3 py-1 rounded-xl text-xs font-extrabold ${isFullyComplete ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'}">
              ${completionPercent}% Complete
            </span>
          </div>

          <!-- Section 1: Personal Info -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div class="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 flex items-center space-x-2">
                <span class="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-[10px]">1</span>
                <span>Personal Information (Compulsory)</span>
              </div>
              <span class="text-[10px] font-bold ${personalItems.every(i => i.done) ? 'text-emerald-600' : 'text-gray-400'}">
                ${personalItems.filter(i => i.done).length}/${personalItems.length} Filled
              </span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label class="text-[11px] font-bold text-gray-500 dark:text-gray-400">Full Name <span class="text-red-500">*</span></label>
                <input type="text" id="personalFullName" placeholder="e.g. Ibrahim Bello"
                       value="${farmerName}"
                       oninput="actions.updateVerificationField('farmer_name', this.value)"
                       class="w-full mt-1 px-4 py-2.5 rounded-xl border ${farmerName ? 'border-gray-300 dark:border-slate-700' : 'border-amber-300 dark:border-amber-700/60'} bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500">
              </div>

              <div>
                <label class="text-[11px] font-bold text-gray-500 dark:text-gray-400">Email Address <span class="text-red-500">*</span></label>
                <input type="email" id="personalEmail" placeholder="farmer@example.com"
                       value="${emailVal}"
                       oninput="actions.updateVerificationField('email', this.value)"
                       class="w-full mt-1 px-4 py-2.5 rounded-xl border ${emailVal ? 'border-gray-300 dark:border-slate-700' : 'border-amber-300 dark:border-amber-700/60'} bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500">
              </div>

              <div>
                <label class="text-[11px] font-bold text-gray-500 dark:text-gray-400">Phone Number <span class="text-red-500">*</span></label>
                <input type="tel" id="personalPhone" placeholder="08034567890"
                       value="${phoneVal}"
                       oninput="actions.updateVerificationField('phone', this.value)"
                       class="w-full mt-1 px-4 py-2.5 rounded-xl border ${phoneVal ? 'border-gray-300 dark:border-slate-700' : 'border-amber-300 dark:border-amber-700/60'} bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500">
              </div>

              <div>
                <label class="text-[11px] font-bold text-gray-500 dark:text-gray-400">Residential State <span class="text-red-500">*</span></label>
                <select id="personalState"
                        onchange="actions.updateVerificationField('state', this.value)"
                        class="w-full mt-1 px-4 py-2.5 rounded-xl border ${stateVal ? 'border-gray-300 dark:border-slate-700' : 'border-amber-300 dark:border-amber-700/60'} bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500">
                  <option value="">Select Residential State</option>
                  ${[
                    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
                    'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT - Abuja', 'Gombe',
                    'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
                    'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto',
                    'Taraba', 'Yobe', 'Zamfara'
                  ].map(st => `<option value="${st}" ${stateVal === st ? 'selected' : ''}>${st}</option>`).join('')}
                </select>
              </div>

              <div>
                <label class="text-[11px] font-bold text-gray-500 dark:text-gray-400">Residential LGA <span class="text-red-500">*</span></label>
                <input type="text" id="personalLga" placeholder="e.g. Zaria"
                       value="${lgaVal}"
                       oninput="actions.updateVerificationField('lga', this.value)"
                       class="w-full mt-1 px-4 py-2.5 rounded-xl border ${lgaVal ? 'border-gray-300 dark:border-slate-700' : 'border-amber-300 dark:border-amber-700/60'} bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500">
              </div>

              <div>
                <label class="text-[11px] font-bold text-gray-500 dark:text-gray-400">Residential Street Address <span class="text-red-500">*</span></label>
                <input type="text" id="personalAddress" placeholder="e.g. 14 Market Road"
                       value="${addressVal}"
                       oninput="actions.updateVerificationField('residential_address', this.value)"
                       class="w-full mt-1 px-4 py-2.5 rounded-xl border ${addressVal ? 'border-gray-300 dark:border-slate-700' : 'border-amber-300 dark:border-amber-700/60'} bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500">
              </div>
            </div>
          </div>

          <!-- Section 2: Farm Information -->
          <div class="space-y-4 pt-4 border-t border-gray-100 dark:border-slate-800">
            <div class="flex items-center justify-between">
              <div class="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 flex items-center space-x-2">
                <span class="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-[10px]">2</span>
                <span>Farm Details (Compulsory)</span>
              </div>
              <span class="text-[10px] font-bold ${farmItems.every(i => i.done) ? 'text-emerald-600' : 'text-gray-400'}">
                ${farmItems.filter(i => i.done).length}/${farmItems.length} Filled
              </span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label class="text-[11px] font-bold text-gray-500 dark:text-gray-400">Farm / Business Name <span class="text-red-500">*</span></label>
                <input type="text" id="farmName" placeholder="e.g. Green Gold Agro Farms"
                       value="${farmNameVal}"
                       oninput="actions.updateVerificationField('farm_name', this.value)"
                       class="w-full mt-1 px-4 py-2.5 rounded-xl border ${farmNameVal ? 'border-gray-300 dark:border-slate-700' : 'border-amber-300 dark:border-amber-700/60'} bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500">
              </div>

              <div>
                <label class="text-[11px] font-bold text-gray-500 dark:text-gray-400">Farm Type <span class="text-red-500">*</span></label>
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
                <label class="text-[11px] font-bold text-gray-500 dark:text-gray-400">Farm Size in Acres <span class="text-red-500">*</span></label>
                <input type="number" id="farmSizeAcres" placeholder="e.g. 50"
                       value="${farmSizeVal}"
                       oninput="actions.updateVerificationField('farm_size_acres', this.value)"
                       class="w-full mt-1 px-4 py-2.5 rounded-xl border ${farmSizeVal ? 'border-gray-300 dark:border-slate-700' : 'border-amber-300 dark:border-amber-700/60'} bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500">
              </div>

              <div>
                <label class="text-[11px] font-bold text-gray-500 dark:text-gray-400">Years of Experience <span class="text-red-500">*</span></label>
                <input type="number" id="yearsExperience" placeholder="e.g. 6"
                       value="${yearsExpVal}"
                       oninput="actions.updateVerificationField('years_experience', this.value)"
                       class="w-full mt-1 px-4 py-2.5 rounded-xl border ${yearsExpVal !== '' ? 'border-gray-300 dark:border-slate-700' : 'border-amber-300 dark:border-amber-700/60'} bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500">
              </div>

              <div class="md:col-span-2">
                <label class="text-[11px] font-bold text-gray-500 dark:text-gray-400">Crops / Livestock Produced <span class="text-red-500">*</span></label>
                <input type="text" id="cropsProduced" placeholder="e.g. Yellow Maize, Soya Beans, Cassava, Cattle"
                       value="${cropsVal}"
                       oninput="actions.updateVerificationField('crops_produced', this.value)"
                       class="w-full mt-1 px-4 py-2.5 rounded-xl border ${cropsVal ? 'border-gray-300 dark:border-slate-700' : 'border-amber-300 dark:border-amber-700/60'} bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500">
              </div>

              <div class="md:col-span-2">
                <label class="text-[11px] font-bold text-gray-500 dark:text-gray-400">Products Intended for Sale on Agrein</label>
                <input type="text" id="intendedProducts" placeholder="e.g. Bagged Maize (50kg), Fresh Soya Beans"
                       value="${app.intended_products || ''}"
                       oninput="actions.updateVerificationField('intended_products', this.value)"
                       class="w-full mt-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500">
              </div>
            </div>
          </div>

          <!-- Section 3: Farm Location & GPS -->
          <div class="space-y-4 pt-4 border-t border-gray-100 dark:border-slate-800">
            <div class="flex items-center justify-between">
              <div class="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 flex items-center space-x-2">
                <span class="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-[10px]">3</span>
                <span>Farm Location & GPS Coordinates (Compulsory)</span>
              </div>
              <span class="text-[10px] font-bold ${locationItems.every(i => i.done) ? 'text-emerald-600' : 'text-gray-400'}">
                ${locationItems.filter(i => i.done).length}/${locationItems.length} Filled
              </span>
            </div>

            <!-- Auto-detect Action Box -->
            <div class="p-4 rounded-2xl bg-gradient-to-r from-emerald-900/10 via-emerald-800/5 to-amber-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div class="text-center sm:text-left">
                <div class="text-xs font-extrabold text-slate-900 dark:text-white flex items-center justify-center sm:justify-start gap-1.5">
                  <i class="fa-solid fa-location-crosshairs text-amber-500"></i>
                  <span>Live GPS Location Auto-Detection</span>
                </div>
                <p class="text-[11px] text-gray-500 mt-0.5">Click to auto-detect your current position and populate GPS coordinates, Farm State, and LGA.</p>
              </div>
              <button type="button" id="detectLocationBtn" onclick="actions.detectGpsLocation()"
                      class="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all whitespace-nowrap flex items-center space-x-1.5">
                <i class="fa-solid fa-location-crosshairs text-amber-300"></i>
                <span>Detect & Auto-fill Location</span>
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div class="md:col-span-2">
                <label class="text-[11px] font-bold text-gray-500 dark:text-gray-400">Farm Physical Address / Landmark <span class="text-red-500">*</span></label>
                <input type="text" id="farmAddress" placeholder="e.g. Km 12 Zaria-Kano Expressway, Kaduna"
                       value="${farmAddressVal}"
                       oninput="actions.updateVerificationField('farm_location', this.value)"
                       class="w-full mt-1 px-4 py-2.5 rounded-xl border ${farmAddressVal ? 'border-gray-300 dark:border-slate-700' : 'border-amber-300 dark:border-amber-700/60'} bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500">
              </div>

              <div>
                <label class="text-[11px] font-bold text-gray-500 dark:text-gray-400">Farm State <span class="text-red-500">*</span></label>
                <select id="farmState"
                        onchange="actions.updateVerificationField('farm_state', this.value)"
                        class="w-full mt-1 px-4 py-2.5 rounded-xl border ${farmStateVal ? 'border-gray-300 dark:border-slate-700' : 'border-amber-300 dark:border-amber-700/60'} bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500">
                  <option value="">Select Farm State *</option>
                  ${[
                    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
                    'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT - Abuja', 'Gombe',
                    'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
                    'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto',
                    'Taraba', 'Yobe', 'Zamfara'
                  ].map(st => `<option value="${st}" ${farmStateVal === st ? 'selected' : ''}>${st}</option>`).join('')}
                </select>
              </div>

              <div>
                <label class="text-[11px] font-bold text-gray-500 dark:text-gray-400">Farm LGA <span class="text-red-500">*</span></label>
                <input type="text" id="farmLga" placeholder="e.g. Zaria"
                       value="${farmLgaVal}"
                       oninput="actions.updateVerificationField('farm_lga', this.value)"
                       class="w-full mt-1 px-4 py-2.5 rounded-xl border ${farmLgaVal ? 'border-gray-300 dark:border-slate-700' : 'border-amber-300 dark:border-amber-700/60'} bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500">
              </div>

              <div>
                <label class="text-[11px] font-bold text-gray-500 dark:text-gray-400">GPS Latitude <span class="text-red-500">*</span></label>
                <input type="text" id="farmLat" placeholder="e.g. 11.150000"
                       value="${farmLatVal}"
                       oninput="actions.updateVerificationField('gps_latitude', this.value)"
                       class="w-full mt-1 px-4 py-2.5 rounded-xl border ${farmLatVal ? 'border-gray-300 dark:border-slate-700' : 'border-amber-300 dark:border-amber-700/60'} bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500">
              </div>

              <div>
                <label class="text-[11px] font-bold text-gray-500 dark:text-gray-400">GPS Longitude <span class="text-red-500">*</span></label>
                <input type="text" id="farmLng" placeholder="e.g. 7.650000"
                       value="${farmLngVal}"
                       oninput="actions.updateVerificationField('gps_longitude', this.value)"
                       class="w-full mt-1 px-4 py-2.5 rounded-xl border ${farmLngVal ? 'border-gray-300 dark:border-slate-700' : 'border-amber-300 dark:border-amber-700/60'} bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500">
              </div>
            </div>
          </div>

          <!-- Section 4: Documents Upload -->
          <div class="space-y-4 pt-4 border-t border-gray-100 dark:border-slate-800">
            <div class="flex items-center justify-between">
              <div class="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 flex items-center space-x-2">
                <span class="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-[10px]">4</span>
                <span>Verification Documents & Photos (Compulsory)</span>
              </div>
              <span class="text-[10px] font-bold text-gray-400 bg-gray-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">Max 3MB per file</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              ${[
                { type: 'government_id', label: 'Government ID', desc: "NIN Slip, Voter's Card, Driver's License", icon: 'fa-id-card', compulsory: true },
                { type: 'farm_photo', label: 'Farm Overview Photos', desc: 'Overview, crops, infrastructure', icon: 'fa-image', compulsory: true },
                { type: 'profile_photo', label: 'Farmer Profile Photo', desc: 'Clear headshot photograph', icon: 'fa-user-gear', compulsory: true },
                { type: 'farm_deed', label: 'Proof of Ownership / Lease', desc: 'Land Title, C-of-O, or Lease Deed', icon: 'fa-file-contract', compulsory: false },
                { type: 'agricultural_cert', label: 'Agricultural Certification', desc: 'Organic, GAP, or Harvest Certificate', icon: 'fa-award', compulsory: false },
                { type: 'coop_proof', label: 'Cooperative Proof', desc: 'Membership ID or Letter', icon: 'fa-people-group', compulsory: false }
              ].map(slot => {
                const isUploading = state.documentUploads && state.documentUploads[slot.type] && state.documentUploads[slot.type].isUploading;
                const uploadedDoc = (app.documents || []).find(d => d.type === slot.type);
                const progress = isUploading ? (state.documentUploads[slot.type].progress || 0) : 0;

                return `
                  <label class="p-3.5 rounded-2xl border-2 border-dashed ${uploadedDoc ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20' : (slot.compulsory ? 'border-amber-400/80 bg-amber-50/20 dark:bg-amber-950/10 dark:border-amber-700/60' : 'border-gray-300 dark:border-slate-700')} text-center cursor-pointer hover:border-emerald-500 transition-all block relative ${isUploading ? 'opacity-60 pointer-events-none' : ''}">
                    <input type="file" accept="image/*,.pdf" onchange="actions.handleDocumentUpload('${slot.type}', event)" class="hidden" ${isUploading ? 'disabled' : ''}>
                    
                    ${isUploading ? `
                      <div class="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-emerald-50/95 dark:bg-emerald-950/90 backdrop-blur-sm p-3">
                        <div class="text-xs font-bold text-emerald-700 dark:text-emerald-300 mb-1">Uploading...</div>
                        <div class="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                          <div class="h-full bg-emerald-500 rounded-full transition-all" style="width: ${progress}%"></div>
                        </div>
                        <div class="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">${progress}%</div>
                      </div>
                    ` : uploadedDoc ? `
                      <div class="flex items-center justify-center mb-1 text-emerald-600">
                        <i class="fa-solid fa-circle-check text-xl"></i>
                      </div>
                      <div class="text-xs font-bold text-emerald-700 dark:text-emerald-300 truncate">${slot.label}</div>
                      <div class="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium truncate mt-0.5">${uploadedDoc.name}</div>
                      <div class="mt-1.5 text-[9px] text-gray-400 hover:text-emerald-600 font-bold"><i class="fa-solid fa-rotate mr-1"></i>Click to change</div>
                    ` : `
                      <div class="flex items-center justify-center gap-1.5 text-emerald-600 mb-1">
                        <i class="fa-solid ${slot.icon} text-lg"></i>
                        ${slot.compulsory ? '<span class="text-red-500 font-bold text-xs">*</span>' : ''}
                      </div>
                      <div class="text-xs font-bold text-gray-700 dark:text-gray-200">${slot.label} ${slot.compulsory ? '<span class="text-red-500 text-[10px] font-bold">(Compulsory)</span>' : ''}</div>
                      <div class="text-[10px] text-gray-400 mt-0.5">${slot.desc}</div>
                    `}
                  </label>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Submit Verification Button -->
          <div class="pt-4 border-t border-gray-100 dark:border-slate-800 space-y-3">
            <button onclick="actions.submitFarmerVerification()"
                    class="w-full py-4 rounded-2xl ${isFullyComplete ? 'bg-gradient-to-r from-emerald-700 to-emerald-900 hover:shadow-2xl shadow-emerald-700/30' : 'bg-gradient-to-r from-slate-700 to-slate-800 opacity-90'} text-white font-extrabold text-xs shadow-xl transition-all flex items-center justify-center space-x-2">
              <i class="fa-solid ${isFullyComplete ? 'fa-paper-plane text-amber-300' : 'fa-lock text-amber-300'}"></i>
              <span>${isFullyComplete ? (status === 'CHANGES_REQUIRED' ? 'Resubmit Corrected Application' : (status === 'PENDING_REVIEW' || status === 'UNDER_REVIEW' ? 'Update & Save Verification Application' : (status === 'REJECTED' ? 'Submit Revised Application' : 'Submit Verification Application'))) : `Submit Verification Application (${completionPercent}% Complete — ${totalCount - completedCount} items remaining)`}</span>
            </button>

            ${!isFullyComplete ? `
              <p class="text-[11px] text-center text-gray-500 dark:text-gray-400 font-medium">
                Please complete all compulsory items (${completionPercent}%) to submit your verification to Agrein administrators.
              </p>
            ` : ''}
          </div>
        </div>
      ` : ''}

      <!-- ═══ SUBMITTED APPLICATION SUMMARY (For Approved Farmers) ═══ -->
      ${status === 'APPROVED' && app.id ? `
        <div class="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
          <h3 class="text-sm font-heading font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
            <i class="fa-solid fa-file-lines text-emerald-500"></i>
            <span>Submitted Application Details</span>
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div class="space-y-2">
              <div class="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Personal Information</div>
              <div><span class="text-gray-400">Name:</span> <span class="font-bold text-slate-900 dark:text-white">${app.farmer_name || 'N/A'}</span></div>
              <div><span class="text-gray-400">Email:</span> <span class="font-bold text-slate-900 dark:text-white">${app.email || 'N/A'}</span></div>
              <div><span class="text-gray-400">Phone:</span> <span class="font-bold text-slate-900 dark:text-white">${app.phone || 'N/A'}</span></div>
              <div><span class="text-gray-400">Location:</span> <span class="font-bold text-slate-900 dark:text-white">${app.state || 'N/A'}, ${app.lga || 'N/A'}</span></div>
            </div>
            <div class="space-y-2">
              <div class="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Farm Information</div>
              <div><span class="text-gray-400">Farm:</span> <span class="font-bold text-slate-900 dark:text-white">${app.farm_name || 'N/A'}</span></div>
              <div><span class="text-gray-400">Type:</span> <span class="font-bold text-slate-900 dark:text-white">${app.farm_type || 'N/A'}</span></div>
              <div><span class="text-gray-400">Size:</span> <span class="font-bold text-slate-900 dark:text-white">${app.farm_size_acres || 0} Acres</span></div>
              <div><span class="text-gray-400">Experience:</span> <span class="font-bold text-slate-900 dark:text-white">${app.years_experience || 0} Years</span></div>
              <div><span class="text-gray-400">Crops:</span> <span class="font-bold text-slate-900 dark:text-white">${(app.crops_produced || []).join(', ') || 'N/A'}</span></div>
            </div>
          </div>

          <!-- GPS Location Summary -->
          <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600">
              <i class="fa-solid fa-map-location-dot"></i>
            </div>
            <div>
              <div class="text-xs font-bold text-slate-900 dark:text-white">${app.farm_location || app.farm_state || 'Farm Location'}</div>
              <div class="text-[10px] text-gray-400 font-mono">GPS: ${app.gps_latitude || '—'}°N, ${app.gps_longitude || '—'}°E</div>
            </div>
          </div>

          <!-- Documents Summary -->
          ${(app.documents || []).length > 0 ? `
            <div>
              <div class="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-2">Uploaded Verification Documents</div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                ${(app.documents || []).map(doc => `
                  <div class="flex items-center space-x-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
                    <i class="fa-solid ${doc.type === 'government_id' ? 'fa-id-card' : (doc.type === 'farm_deed' ? 'fa-file-contract' : 'fa-image')} text-emerald-500 text-xs"></i>
                    <span class="text-[10px] font-bold text-slate-700 dark:text-gray-300 truncate">${doc.name}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      ` : ''}
    </section>
  `;
}
