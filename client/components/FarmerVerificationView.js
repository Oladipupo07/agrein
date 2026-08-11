// Farmer Verification View — Complete 7-Stage Status Lifecycle & Application Wizard

function renderFarmerVerificationView(state, actions) {
  const app = state.mockData.farmerVerificationApp || {};
  const status = app.status || 'DRAFT';

  const statusConfig = {
    'DRAFT':             { color: 'gray',    icon: 'fa-file-pen',              label: 'Draft',              bg: 'bg-gray-100 dark:bg-gray-800',            text: 'text-gray-600 dark:text-gray-300',       dot: '⚪', step: 0 },
    'PENDING_REVIEW':    { color: 'amber',   icon: 'fa-clock',                 label: 'Pending Review',     bg: 'bg-amber-50 dark:bg-amber-950/30',        text: 'text-amber-700 dark:text-amber-300',     dot: '🟡', step: 1 },
    'UNDER_REVIEW':      { color: 'blue',    icon: 'fa-magnifying-glass',      label: 'Under Review',       bg: 'bg-blue-50 dark:bg-blue-950/30',          text: 'text-blue-700 dark:text-blue-300',       dot: '🔵', step: 2 },
    'CHANGES_REQUIRED':  { color: 'orange',  icon: 'fa-triangle-exclamation',  label: 'Changes Required',   bg: 'bg-orange-50 dark:bg-orange-950/30',      text: 'text-orange-700 dark:text-orange-300',   dot: '🟠', step: 2 },
    'APPROVED':          { color: 'emerald', icon: 'fa-circle-check',          label: 'Approved',           bg: 'bg-emerald-50 dark:bg-emerald-950/30',    text: 'text-emerald-700 dark:text-emerald-300', dot: '🟢', step: 3 },
    'REJECTED':          { color: 'red',     icon: 'fa-circle-xmark',          label: 'Rejected',           bg: 'bg-red-50 dark:bg-red-950/30',            text: 'text-red-700 dark:text-red-300',         dot: '🔴', step: -1 },
    'SUSPENDED':         { color: 'red',     icon: 'fa-ban',                   label: 'Suspended',          bg: 'bg-red-50 dark:bg-red-950/30',            text: 'text-red-700 dark:text-red-300',         dot: '🔴', step: -2 }
  };

  const sc = statusConfig[status] || statusConfig['DRAFT'];

  // Dynamic section completion tracking
  const sectionChecks = app.sectionCompletion || {};
  const sections = [
    { key: 'personal',  label: 'Personal Information', icon: 'fa-user',             done: sectionChecks.personal !== false },
    { key: 'farm',      label: 'Farm Information',     icon: 'fa-tractor',          done: sectionChecks.farm !== false },
    { key: 'location',  label: 'Farm Location',        icon: 'fa-map-location-dot', done: sectionChecks.location !== false },
    { key: 'documents', label: 'Identity Documents',   icon: 'fa-id-card',          done: sectionChecks.documents !== false },
    { key: 'photos',    label: 'Farm Photos',          icon: 'fa-images',           done: sectionChecks.photos !== false }
  ];

  const completedCount = sections.filter(s => s.done).length;
  const progressPercent = Math.round((completedCount / sections.length) * 100);

  // Status timeline steps
  const timelineSteps = [
    { label: 'Application',  icon: 'fa-file-pen',         key: 'DRAFT' },
    { label: 'Submitted',    icon: 'fa-paper-plane',       key: 'PENDING_REVIEW' },
    { label: 'Under Review', icon: 'fa-magnifying-glass',  key: 'UNDER_REVIEW' },
    { label: 'Decision',     icon: 'fa-gavel',             key: 'APPROVED' }
  ];

  const currentStep = sc.step;

  return `
    <section class="max-w-4xl mx-auto px-4 py-10">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-heading font-extrabold text-slate-900 dark:text-white">Farmer Verification</h1>
        <p class="text-sm text-gray-500 mt-2">Complete your farm verification to start selling on Agrein</p>
      </div>

      <!-- ═══ STATUS TIMELINE TRACKER ═══ -->
      ${status !== 'DRAFT' ? `
        <div class="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 mb-8 shadow-sm">
          <h3 class="text-xs font-heading font-extrabold text-slate-900 dark:text-white mb-5">Verification Progress</h3>
          <div class="relative">
            <!-- Progress Bar Background -->
            <div class="absolute top-4 left-0 right-0 h-1 bg-gray-200 dark:bg-slate-700 rounded-full mx-8"></div>
            <!-- Progress Bar Fill -->
            <div class="absolute top-4 left-0 h-1 rounded-full mx-8 transition-all duration-700 ${status === 'REJECTED' ? 'bg-red-500' : status === 'SUSPENDED' ? 'bg-red-500' : 'bg-emerald-500'}"
                 style="width: ${status === 'REJECTED' || status === 'SUSPENDED' ? '100' : Math.max(0, Math.min(100, (currentStep / 3) * 100))}%"></div>

            <div class="relative flex justify-between">
              ${timelineSteps.map((step, idx) => {
                let stepState = 'upcoming';
                if (status === 'REJECTED' || status === 'SUSPENDED') {
                  stepState = 'error';
                } else if (idx < currentStep) {
                  stepState = 'completed';
                } else if (idx === currentStep) {
                  stepState = 'active';
                } else if (status === 'CHANGES_REQUIRED' && idx === 2) {
                  stepState = 'warning';
                }

                const styles = {
                  completed: 'bg-emerald-500 text-white border-emerald-500 shadow-emerald-500/30',
                  active: 'bg-blue-500 text-white border-blue-500 shadow-blue-500/30 animate-pulse',
                  warning: 'bg-orange-500 text-white border-orange-500 shadow-orange-500/30',
                  error: 'bg-red-500 text-white border-red-500 shadow-red-500/30',
                  upcoming: 'bg-gray-200 dark:bg-slate-700 text-gray-400 dark:text-slate-500 border-gray-300 dark:border-slate-600'
                };

                return `
                  <div class="flex flex-col items-center" style="width: 25%;">
                    <div class="w-9 h-9 rounded-full flex items-center justify-center text-xs border-2 shadow-md ${styles[stepState]} transition-all duration-500">
                      ${stepState === 'completed' ? '<i class="fa-solid fa-check"></i>' : `<i class="fa-solid ${step.icon}"></i>`}
                    </div>
                    <span class="text-[10px] font-bold mt-2 ${stepState === 'upcoming' ? 'text-gray-400' : 'text-slate-700 dark:text-gray-200'}">${step.label}</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      ` : ''}

      <!-- ═══ STATUS BANNER ═══ -->
      <div class="${sc.bg} rounded-2xl p-6 mb-8 border border-${sc.color}-200 dark:border-${sc.color}-800/30">
        <div class="flex items-center space-x-3">
          <div class="w-12 h-12 rounded-2xl ${sc.text} bg-white dark:bg-slate-900 flex items-center justify-center text-xl shadow-md">
            <i class="fa-solid ${sc.icon}"></i>
          </div>
          <div>
            <div class="text-xs font-bold text-gray-500">Verification Status</div>
            <div class="text-lg font-heading font-extrabold ${sc.text}">${sc.dot} ${sc.label}</div>
          </div>
        </div>

        <!-- DRAFT: Show prompt to complete application -->
        ${status === 'DRAFT' ? `
          <div class="mt-4 p-4 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700">
            <div class="flex items-center space-x-2 text-gray-600 dark:text-gray-300 font-bold text-xs mb-2">
              <i class="fa-solid fa-info-circle"></i>
              <span>Getting Started</span>
            </div>
            <p class="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">Complete all 5 sections of the verification form below, then submit your application. Our team typically reviews applications within 18–24 hours.</p>
            <div class="mt-3 flex items-center space-x-3">
              <div class="flex-1 bg-gray-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                <div class="h-full bg-emerald-500 rounded-full transition-all duration-500" style="width: ${progressPercent}%"></div>
              </div>
              <span class="text-[10px] font-extrabold text-gray-500">${completedCount}/${sections.length} sections</span>
            </div>
          </div>
        ` : ''}

        <!-- PENDING_REVIEW: Application submitted, awaiting admin -->
        ${status === 'PENDING_REVIEW' ? `
          <div class="mt-4 p-4 rounded-xl bg-amber-100 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700/40">
            <div class="flex items-center space-x-2 text-amber-700 dark:text-amber-300 font-bold text-xs mb-2">
              <i class="fa-solid fa-hourglass-half"></i>
              <span>Application Submitted</span>
            </div>
            <p class="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">Your verification application has been submitted successfully. Our admin team will begin reviewing your documents within 18–24 hours. You will be notified once the review begins.</p>
            ${app.submitted_at ? `
              <div class="mt-2 text-[10px] text-amber-600 dark:text-amber-400">
                <strong>Submitted:</strong> ${new Date(app.submitted_at).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
            ` : ''}
          </div>
        ` : ''}

        <!-- UNDER_REVIEW: Admin is actively reviewing -->
        ${status === 'UNDER_REVIEW' ? `
          <div class="mt-4 p-4 rounded-xl bg-blue-100 dark:bg-blue-950/50 border border-blue-300 dark:border-blue-700/40">
            <div class="flex items-center space-x-2 text-blue-700 dark:text-blue-300 font-bold text-xs mb-2">
              <i class="fa-solid fa-magnifying-glass animate-pulse"></i>
              <span>Active Review in Progress</span>
            </div>
            <p class="text-xs text-blue-800 dark:text-blue-200 leading-relaxed">An Agrein verification administrator is currently reviewing your application, documents, and farm location data. This process typically takes 4–12 hours. Please do not resubmit your application.</p>
            ${app.reviewed_by ? `
              <div class="mt-2 text-[10px] text-blue-600 dark:text-blue-400">
                <strong>Reviewer:</strong> Agrein Verification Team
              </div>
            ` : ''}
          </div>
        ` : ''}

        <!-- CHANGES_REQUIRED: Admin needs corrections -->
        ${status === 'CHANGES_REQUIRED' ? `
          <div class="mt-4 p-4 rounded-xl bg-orange-100 dark:bg-orange-950/50 border border-orange-300 dark:border-orange-700/40">
            <div class="flex items-center space-x-2 text-orange-700 dark:text-orange-300 font-bold text-xs mb-1">
              <i class="fa-solid fa-triangle-exclamation"></i>
              <span>Admin Feedback — Action Required</span>
            </div>
            <p class="text-xs text-orange-800 dark:text-orange-200 leading-relaxed mt-2">"${app.changes_requested_notes || 'Please upload a clearer image of your government-issued ID.'}"</p>
            ${app.reviewed_at ? `
              <div class="mt-2 text-[10px] text-orange-600 dark:text-orange-400">
                <strong>Feedback received:</strong> ${new Date(app.reviewed_at).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            ` : ''}
            <button onclick="actions.resubmitVerification()" class="mt-3 px-5 py-2.5 rounded-xl bg-orange-600 text-white font-bold text-xs shadow hover:bg-orange-700 transition-all inline-flex items-center space-x-2">
              <i class="fa-solid fa-pen-to-square"></i>
              <span>Update & Resubmit Application</span>
            </button>
          </div>
        ` : ''}

        <!-- APPROVED: Farmer verified -->
        ${status === 'APPROVED' ? `
          <div class="mt-4 p-4 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-700/40 text-center">
            <div class="flex items-center justify-center space-x-2 text-emerald-700 dark:text-emerald-300 font-extrabold text-sm mb-2">
              <i class="fa-solid fa-circle-check"></i>
              <span>You are an Agrein Verified Farmer</span>
            </div>
            <p class="text-xs text-emerald-800 dark:text-emerald-200">Your farm has been successfully verified. You can now list products on the marketplace.</p>
            ${app.reviewed_at ? `
              <div class="mt-2 text-[10px] text-emerald-600 dark:text-emerald-400">
                <strong>Verified on:</strong> ${new Date(app.reviewed_at).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            ` : ''}
            <button onclick="actions.setView('farmer-dashboard')" class="mt-3 px-6 py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs shadow hover:bg-emerald-800 transition-all">
              <i class="fa-solid fa-store mr-1"></i> Start Listing Products
            </button>
          </div>
        ` : ''}

        <!-- REJECTED: Application denied -->
        ${status === 'REJECTED' ? `
          <div class="mt-4 p-4 rounded-xl bg-red-100 dark:bg-red-950/50 border border-red-300 dark:border-red-700/40">
            <div class="flex items-center space-x-2 text-red-700 dark:text-red-300 font-bold text-xs mb-2">
              <i class="fa-solid fa-circle-xmark"></i>
              <span>Application Rejected</span>
            </div>
            <p class="text-xs text-red-800 dark:text-red-200 leading-relaxed"><strong>Reason:</strong> ${app.rejection_reason || 'Application did not meet verification criteria.'}</p>
            ${app.reviewed_at ? `
              <div class="mt-2 text-[10px] text-red-600 dark:text-red-400">
                <strong>Decision date:</strong> ${new Date(app.reviewed_at).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            ` : ''}
            <div class="mt-3 flex items-center space-x-3">
              <button onclick="actions.reapplyVerification()" class="px-5 py-2.5 rounded-xl bg-slate-700 text-white font-bold text-xs shadow hover:bg-slate-800 transition-all inline-flex items-center space-x-2">
                <i class="fa-solid fa-rotate-right"></i>
                <span>Submit New Application</span>
              </button>
              <button onclick="actions.openChatDrawer('Agrein Support')" class="px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-gray-200 font-bold text-xs border border-gray-300 dark:border-slate-600 hover:bg-gray-50 transition-all inline-flex items-center space-x-2">
                <i class="fa-solid fa-headset"></i>
                <span>Contact Support</span>
              </button>
            </div>
          </div>
        ` : ''}

        <!-- SUSPENDED: Previously approved farmer restricted -->
        ${status === 'SUSPENDED' ? `
          <div class="mt-4 p-4 rounded-xl bg-red-100 dark:bg-red-950/50 border border-red-300 dark:border-red-700/40">
            <div class="flex items-center space-x-2 text-red-700 dark:text-red-300 font-bold text-xs mb-2">
              <i class="fa-solid fa-ban"></i>
              <span>Account Suspended</span>
            </div>
            <p class="text-xs text-red-800 dark:text-red-200 leading-relaxed">Your farmer account has been temporarily suspended. Product listings have been unpublished and you cannot accept new orders during this period.</p>
            ${app.admin_notes ? `
              <div class="mt-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800/30">
                <p class="text-[10px] text-red-700 dark:text-red-300"><strong>Reason:</strong> ${app.admin_notes}</p>
              </div>
            ` : ''}
            <button onclick="actions.openChatDrawer('Agrein Support')" class="mt-3 px-5 py-2.5 rounded-xl bg-red-700 text-white font-bold text-xs shadow hover:bg-red-800 transition-all inline-flex items-center space-x-2">
              <i class="fa-solid fa-headset"></i>
              <span>Appeal Suspension</span>
            </button>
          </div>
        ` : ''}
      </div>

      <!-- ═══ APPLICATION SECTIONS CHECKLIST ═══ -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 mb-8 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-heading font-extrabold text-slate-900 dark:text-white">Application Sections</h3>
          <span class="px-2.5 py-1 rounded-lg text-[10px] font-extrabold ${completedCount === sections.length ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-gray-400'}">${completedCount}/${sections.length} Complete</span>
        </div>
        <div class="space-y-3">
          ${sections.map(s => `
            <div class="flex items-center justify-between py-2 px-3 rounded-xl ${s.done ? 'bg-emerald-50 dark:bg-emerald-950/20' : 'bg-gray-50 dark:bg-slate-800'}">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 rounded-lg ${s.done ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600' : 'bg-gray-200 dark:bg-slate-700 text-gray-400'} flex items-center justify-center text-xs">
                  <i class="fa-solid ${s.icon}"></i>
                </div>
                <span class="text-xs font-bold ${s.done ? 'text-slate-900 dark:text-white' : 'text-gray-500'}">${s.label}</span>
              </div>
              ${s.done ? '<i class="fa-solid fa-circle-check text-emerald-500 text-sm"></i>' : '<i class="fa-regular fa-circle text-gray-300 text-sm"></i>'}
            </div>
          `).join('')}
        </div>

        ${app.submitted_at ? `
          <div class="mt-4 pt-4 border-t border-gray-100 dark:border-slate-800 text-xs text-gray-500 space-y-1">
            <p><strong>Application submitted:</strong> ${new Date(app.submitted_at).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            ${status === 'PENDING_REVIEW' ? '<p><strong>Expected action:</strong> Your application is being reviewed by Agrein.</p>' : ''}
            ${status === 'UNDER_REVIEW' ? '<p><strong>Status:</strong> An admin is currently reviewing your application.</p>' : ''}
          </div>
        ` : ''}
      </div>

      <!-- ═══ VERIFICATION APPLICATION FORM (DRAFT or CHANGES_REQUIRED) ═══ -->
      ${status === 'DRAFT' || status === 'CHANGES_REQUIRED' || !app.id ? `
        <div class="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-heading font-extrabold text-slate-900 dark:text-white">Verify Your Farm</h3>
            ${status === 'CHANGES_REQUIRED' ? `
              <span class="px-3 py-1 rounded-lg bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 text-[10px] font-extrabold">
                <i class="fa-solid fa-pen mr-1"></i>Update Required
              </span>
            ` : ''}
          </div>

          <!-- Personal Info -->
          <div class="space-y-3">
            <div class="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1"><i class="fa-solid fa-user"></i><span>Personal Information</span></div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input type="text" placeholder="Full Name" value="${app.farmer_name || ''}" class="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500">
              <input type="email" placeholder="Email Address" value="${app.email || ''}" class="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500">
              <input type="tel" placeholder="Phone Number" value="${app.phone || ''}" class="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500">
              <select class="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none">
                <option>State</option><option>Kaduna</option><option>Benue</option><option>Oyo</option><option>Plateau</option><option>Lagos</option><option>Kano</option>
              </select>
              <input type="text" placeholder="LGA" value="${app.lga || ''}" class="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500">
              <input type="text" placeholder="Residential Address" value="${app.residential_address || ''}" class="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500">
            </div>
          </div>

          <!-- Farm Information -->
          <div class="space-y-3">
            <div class="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1"><i class="fa-solid fa-tractor"></i><span>Farm Information</span></div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input type="text" placeholder="Farm Name" value="${app.farm_name || ''}" class="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500">
              <select class="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none">
                <option>Farm Type</option><option>Crop Farming</option><option>Livestock</option><option>Mixed</option><option>Horticulture</option><option>Aquaculture</option>
              </select>
              <input type="number" placeholder="Farm Size (Acres)" value="${app.farm_size_acres || ''}" class="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500">
              <input type="number" placeholder="Years of Experience" value="${app.years_experience || ''}" class="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500">
              <input type="text" placeholder="Crops / Livestock Produced" value="${(app.crops_produced || []).join(', ')}" class="md:col-span-2 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500">
              <input type="text" placeholder="Products Intended for Sale" value="${app.intended_products || ''}" class="md:col-span-2 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500">
            </div>
          </div>

          <!-- Farm Location & GPS Coordinates -->
          <div class="space-y-3">
            <div class="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1"><i class="fa-solid fa-map-location-dot"></i><span>Farm Location & GPS Coordinates</span></div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input type="text" placeholder="Farm Physical Address" value="${app.farm_location || ''}" class="md:col-span-2 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500">
              <select class="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none">
                <option>Farm State</option><option>Kaduna</option><option>Benue</option><option>Oyo</option><option>Plateau</option><option>Lagos</option><option>Kano</option>
              </select>
              <input type="text" placeholder="Farm LGA" value="${app.farm_lga || ''}" class="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500">
              <input type="text" id="farmLat" placeholder="GPS Latitude (e.g. 11.1500° N)" value="${app.gps_latitude || '11.1500'}" class="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500">
              <input type="text" id="farmLng" placeholder="GPS Longitude (e.g. 7.6500° E)" value="${app.gps_longitude || '7.6500'}" class="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500">
            </div>

            <!-- Map Location Selector Box -->
            <div class="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 text-center space-y-2">
              <div class="flex items-center justify-center space-x-2 text-xs font-extrabold text-emerald-700 dark:text-emerald-300">
                <i class="fa-solid fa-location-crosshairs text-amber-500"></i>
                <span>Interactive Map Location Selector</span>
              </div>
              <p class="text-[10px] text-gray-500">Click to pin exact GPS land boundary coordinates for admin satellite verification.</p>
              <button onclick="actions.detectGpsLocation()" class="px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs shadow hover:bg-emerald-800 transition-all inline-flex items-center space-x-1.5">
                <i class="fa-solid fa-location-crosshairs"></i>
                <span>Detect / Pin Farm Location</span>
              </button>
            </div>
          </div>

          <!-- Documents Upload -->
          <div class="space-y-3">
            <div class="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1"><i class="fa-solid fa-file-arrow-up"></i><span>Verification Documents Upload</span></div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <label class="p-3.5 rounded-xl border-2 border-dashed border-gray-300 dark:border-slate-700 text-center cursor-pointer hover:border-emerald-500 transition-all block relative">
                <input type="file" accept="image/*,.pdf" onchange="actions.handleDocumentUpload('government_id', event)" class="hidden">
                <i class="fa-solid fa-id-card text-xl text-emerald-600 mb-1"></i>
                <div class="text-xs font-bold text-gray-700 dark:text-gray-200">Government ID</div>
                <div class="text-[11px] text-gray-400">NIN Slip, Voter's Card, Driver's License</div>
              </label>

              <label class="p-3.5 rounded-xl border-2 border-dashed border-gray-300 dark:border-slate-700 text-center cursor-pointer hover:border-emerald-500 transition-all block relative">
                <input type="file" accept="image/*" onchange="actions.handleDocumentUpload('farm_photo', event)" class="hidden">
                <i class="fa-solid fa-image text-xl text-emerald-600 mb-1"></i>
                <div class="text-xs font-bold text-gray-700 dark:text-gray-200">Farm Photos</div>
                <div class="text-[11px] text-gray-400">Overview, Crops, Infrastructure</div>
              </label>

              <label class="p-3.5 rounded-xl border-2 border-dashed border-gray-300 dark:border-slate-700 text-center cursor-pointer hover:border-emerald-500 transition-all block relative">
                <input type="file" accept="image/*" onchange="actions.handleDocumentUpload('profile_photo', event)" class="hidden">
                <i class="fa-solid fa-user-gear text-xl text-emerald-600 mb-1"></i>
                <div class="text-xs font-bold text-gray-700 dark:text-gray-200">Profile Photo</div>
                <div class="text-[11px] text-gray-400">Clear headshot photograph</div>
              </label>

              <label class="p-3.5 rounded-xl border-2 border-dashed border-gray-300 dark:border-slate-700 text-center cursor-pointer hover:border-emerald-500 transition-all block relative">
                <input type="file" accept="image/*,.pdf" onchange="actions.handleDocumentUpload('farm_deed', event)" class="hidden">
                <i class="fa-solid fa-file-contract text-xl text-emerald-600 mb-1"></i>
                <div class="text-xs font-bold text-gray-700 dark:text-gray-200">Proof of Ownership / Lease</div>
                <div class="text-[11px] text-gray-400">Land Title, C-of-O, or Lease Deed</div>
              </label>

              <label class="p-3.5 rounded-xl border-2 border-dashed border-gray-300 dark:border-slate-700 text-center cursor-pointer hover:border-emerald-500 transition-all block relative">
                <input type="file" accept="image/*,.pdf" onchange="actions.handleDocumentUpload('agricultural_cert', event)" class="hidden">
                <i class="fa-solid fa-award text-xl text-emerald-600 mb-1"></i>
                <div class="text-xs font-bold text-gray-700 dark:text-gray-200">Agricultural Certification</div>
                <div class="text-[11px] text-gray-400">Organic, GAP, or Harvest Certificate</div>
              </label>

              <label class="p-3.5 rounded-xl border-2 border-dashed border-gray-300 dark:border-slate-700 text-center cursor-pointer hover:border-emerald-500 transition-all block relative">
                <input type="file" accept="image/*,.pdf" onchange="actions.handleDocumentUpload('coop_proof', event)" class="hidden">
                <i class="fa-solid fa-people-group text-xl text-emerald-600 mb-1"></i>
                <div class="text-xs font-bold text-gray-700 dark:text-gray-200">Cooperative Proof</div>
                <div class="text-[11px] text-gray-400">Membership ID or Letter</div>
              </label>
            </div>
          </div>

          <!-- Submit -->
          <button onclick="actions.submitFarmerVerification()" class="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-700 to-emerald-900 text-white font-extrabold text-xs shadow-xl hover:shadow-2xl transition-all flex items-center justify-center space-x-2">
            <i class="fa-solid fa-paper-plane text-amber-300"></i>
            <span>${status === 'CHANGES_REQUIRED' ? 'Resubmit Updated Application' : 'Submit Verification Application'}</span>
          </button>
        </div>
      ` : ''}

      <!-- ═══ SUBMITTED APPLICATION SUMMARY (read-only for non-editable statuses) ═══ -->
      ${(status === 'PENDING_REVIEW' || status === 'UNDER_REVIEW' || status === 'APPROVED') && app.id ? `
        <div class="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
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
          <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 flex items-center space-x-3">
            <div class="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600">
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
              <div class="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-2">Uploaded Documents</div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                ${(app.documents || []).map(doc => `
                  <div class="flex items-center space-x-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
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
