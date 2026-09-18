// Application Submitted View — Dedicated Verification Confirmation & Live Status Tracking Page
// Displays immediately upon farmer KYC submission and persists while application is pending review.

function renderApplicationSubmittedView(state, actions) {
  const user = state.currentUser || {};
  const app = state.mockData.farmerVerificationApp || StorageManager.getFarmerVerification() || {};
  const status = app.status || user.verification_status || 'PENDING_REVIEW';

  const referenceCode = app.id ? (app.id.startsWith('ver-') ? 'AGR-' + app.id.replace('ver-', '').slice(-6).toUpperCase() : app.id) : 'AGR-VER-' + Math.floor(100000 + Math.random() * 900000);
  const submittedDate = app.submitted_at ? new Date(app.submitted_at).toLocaleDateString('en-NG', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  }) : 'Just now';

  const docs = Array.isArray(app.documents) ? app.documents : [];
  const hasGovId = docs.some(d => d.type === 'government_id');
  const hasFarmPhoto = docs.some(d => d.type === 'farm_photo');
  const hasProfilePhoto = docs.some(d => d.type === 'profile_photo');

  const cropsFormatted = Array.isArray(app.crops_produced)
    ? app.crops_produced.join(', ')
    : (app.crops_produced || 'Registered Crops');

  const escapeHtml = (str) => {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  };

  return `
    <section class="min-h-screen bg-slate-50/50 dark:bg-slate-900/50 py-8 sm:py-12 px-3 sm:px-6 lg:px-8">
      <div class="max-w-3xl mx-auto space-y-6">

        <!-- Top Navigation Bar -->
        <div class="flex items-center justify-between">
          <button onclick="actions.guardView('farmer-dashboard')" class="inline-flex items-center space-x-2 text-xs font-bold text-gray-500 hover:text-emerald-600 transition-all">
            <i class="fa-solid fa-arrow-left"></i>
            <span>Farmer Dashboard</span>
          </button>
          <div class="flex items-center space-x-2">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300/60 dark:border-amber-700/60 shadow-sm">
              <span class="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
              <span>Pending Admin Review</span>
            </span>
          </div>
        </div>

        <!-- Celebratory Hero Header -->
        <div class="glass-card rounded-3xl p-6 sm:p-10 text-center relative overflow-hidden border border-emerald-500/20 shadow-xl bg-gradient-to-b from-emerald-500/5 via-slate-500/5 to-transparent">
          <!-- Background Ambient Glow -->
          <div class="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <!-- Animated Badge -->
          <div class="relative inline-block mb-4">
            <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center text-3xl sm:text-4xl shadow-2xl shadow-emerald-500/40 relative z-10 mx-auto">
              <i class="fa-solid fa-check"></i>
            </div>
            <div class="absolute inset-0 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-emerald-400/30 animate-ping pointer-events-none mx-auto" style="animation-duration: 2.5s;"></div>
          </div>

          <h1 class="text-2xl sm:text-4xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight">
            Application Submitted Successfully! 🎉
          </h1>
          <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-300 max-w-xl mx-auto mt-2 leading-relaxed">
            Thank you, <span class="font-bold text-emerald-600 dark:text-emerald-400">${escapeHtml(app.farmer_name || user.full_name || 'Farmer')}</span>. Your verification dossier has been securely dispatched to the Agrein Compliance and Trust Audit team.
          </p>

          <!-- Reference & Metadata Tags -->
          <div class="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs">
            <div class="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700/80 font-mono font-bold text-slate-700 dark:text-gray-200 flex items-center space-x-1.5">
              <i class="fa-solid fa-hashtag text-emerald-500"></i>
              <span>Ref: ${escapeHtml(referenceCode)}</span>
            </div>
            <div class="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700/80 font-bold text-slate-700 dark:text-gray-200 flex items-center space-x-1.5">
              <i class="fa-solid fa-calendar-check text-emerald-500"></i>
              <span>${escapeHtml(submittedDate)}</span>
            </div>
            <div class="px-3.5 py-1.5 rounded-xl bg-emerald-100/80 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-extrabold flex items-center space-x-1.5">
              <i class="fa-solid fa-shield-halved text-emerald-600"></i>
              <span>100% Compulsory Data Provided</span>
            </div>
          </div>
        </div>

        <!-- 7-Stage Verification Lifecycle Tracker -->
        <div class="glass-card rounded-3xl p-6 sm:p-8 space-y-4 border border-gray-200/80 dark:border-slate-800 shadow-md">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <i class="fa-solid fa-timeline text-emerald-600 dark:text-emerald-400 text-sm"></i>
              <h2 class="text-sm font-heading font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                Verification Progress Tracker
              </h2>
            </div>
            <span class="text-[11px] font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              Stage 2 of 4 Active
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
            <!-- Stage 1 -->
            <div class="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/60 space-y-1">
              <div class="flex items-center justify-between text-emerald-700 dark:text-emerald-300 text-xs font-extrabold">
                <span>1. Form Submission</span>
                <i class="fa-solid fa-circle-check"></i>
              </div>
              <p class="text-[10px] text-emerald-800/80 dark:text-emerald-300/80 font-medium">Completed & Timestamped</p>
            </div>

            <!-- Stage 2 -->
            <div class="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-400 dark:border-amber-600/70 space-y-1 relative">
              <div class="flex items-center justify-between text-amber-800 dark:text-amber-300 text-xs font-extrabold">
                <span>2. Document Audit</span>
                <i class="fa-solid fa-spinner animate-spin text-amber-600"></i>
              </div>
              <p class="text-[10px] text-amber-800/80 dark:text-amber-300/80 font-medium">Under Compliance Review</p>
            </div>

            <!-- Stage 3 -->
            <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 space-y-1 opacity-70">
              <div class="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs font-bold">
                <span>3. Farm & GPS Check</span>
                <i class="fa-solid fa-clock"></i>
              </div>
              <p class="text-[10px] text-gray-400 font-medium">Satellite & LGA mapping</p>
            </div>

            <!-- Stage 4 -->
            <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 space-y-1 opacity-70">
              <div class="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs font-bold">
                <span>4. Verified Badge</span>
                <i class="fa-solid fa-certificate"></i>
              </div>
              <p class="text-[10px] text-gray-400 font-medium">Full marketplace access</p>
            </div>
          </div>

          <!-- Estimated Resolution Banner -->
          <div class="mt-2 p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex items-center justify-between gap-3 text-xs">
            <div class="flex items-center space-x-2 text-blue-900 dark:text-blue-200 font-bold">
              <i class="fa-solid fa-clock text-blue-600 dark:text-blue-400 text-sm"></i>
              <span>Estimated Decision Turnaround: <strong>18 – 24 Hours</strong></span>
            </div>
            <button onclick="actions.fetchFarmerVerification(); actions.triggerToast('🔄 Checking live verification status...');" class="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-extrabold shadow-sm transition-all whitespace-nowrap">
              <i class="fa-solid fa-arrows-rotate mr-1"></i> Refresh Status
            </button>
          </div>
        </div>

        <!-- Submitted Application Summary Dossier -->
        <div class="glass-card rounded-3xl p-6 sm:p-8 space-y-5 border border-gray-200/80 dark:border-slate-800 shadow-md">
          <div class="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-4">
            <div>
              <h2 class="text-base font-heading font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
                <i class="fa-solid fa-id-card-clip text-emerald-600 dark:text-emerald-400"></i>
                <span>Submitted KYC Summary</span>
              </h2>
              <p class="text-xs text-gray-500 mt-0.5">Details on file for your Agrein Farmer Credential</p>
            </div>
            <button onclick="window.print()" class="px-3 py-1.5 rounded-xl border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center space-x-1.5">
              <i class="fa-solid fa-print"></i>
              <span>Print Slip</span>
            </button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <!-- Full Name -->
            <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-700/60 space-y-1">
              <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Farmer Full Name</div>
              <div class="font-extrabold text-slate-900 dark:text-white truncate">${escapeHtml(app.farmer_name || user.full_name || 'N/A')}</div>
            </div>

            <!-- Phone -->
            <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-700/60 space-y-1">
              <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Phone Number</div>
              <div class="font-extrabold text-slate-900 dark:text-white truncate">${escapeHtml(app.phone || user.phone_number || 'N/A')}</div>
            </div>

            <!-- Email -->
            <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-700/60 space-y-1">
              <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email Address</div>
              <div class="font-extrabold text-slate-900 dark:text-white truncate">${escapeHtml(app.email || user.email || 'N/A')}</div>
            </div>

            <!-- Residential State & LGA -->
            <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-700/60 space-y-1">
              <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Residential State & LGA</div>
              <div class="font-extrabold text-slate-900 dark:text-white truncate">
                ${escapeHtml(app.state || user.state || 'N/A')}${app.lga || user.lga ? ', ' + escapeHtml(app.lga || user.lga) : ''}
              </div>
            </div>

            <!-- Residential Address -->
            <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-700/60 space-y-1 sm:col-span-2">
              <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Residential Street Address</div>
              <div class="font-extrabold text-slate-900 dark:text-white truncate">${escapeHtml(app.residential_address || user.address || 'N/A')}</div>
            </div>

            <!-- Farm / Business Name -->
            <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-700/60 space-y-1">
              <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Farm / Enterprise Name</div>
              <div class="font-extrabold text-slate-900 dark:text-white truncate">${escapeHtml(app.farm_name || 'Agro Farm')}</div>
            </div>

            <!-- Farm Type & Size -->
            <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-700/60 space-y-1">
              <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Farm Type & Size</div>
              <div class="font-extrabold text-slate-900 dark:text-white truncate">
                ${escapeHtml(app.farm_type || 'Crop Farming')} · ${escapeHtml(String(app.farm_size_acres || '0'))} Acres
              </div>
            </div>

            <!-- Farm State & LGA -->
            <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-700/60 space-y-1">
              <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Farm State & LGA</div>
              <div class="font-extrabold text-slate-900 dark:text-white truncate">
                ${escapeHtml(app.farm_state || app.state || 'N/A')}${app.farm_lga || app.lga ? ', ' + escapeHtml(app.farm_lga || app.lga) : ''}
              </div>
            </div>

            <!-- Farm Physical Location / GPS -->
            <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-700/60 space-y-1 sm:col-span-2">
              <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Farm Physical Landmark & Coordinates</div>
              <div class="font-extrabold text-slate-900 dark:text-white truncate">
                ${escapeHtml(app.farm_location || 'Registered Farm Location')}
                ${app.gps_latitude && app.gps_longitude ? ` (${app.gps_latitude}°N, ${app.gps_longitude}°E)` : ''}
              </div>
            </div>

            <!-- Crops Produced -->
            <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-700/60 space-y-1">
              <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Crops / Produce</div>
              <div class="font-extrabold text-slate-900 dark:text-white truncate">${escapeHtml(cropsFormatted)}</div>
            </div>
          </div>

          <!-- Documents Checklist Pills -->
          <div class="pt-2 border-t border-gray-100 dark:border-slate-800">
            <div class="text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-2">Attached Verification Documents:</div>
            <div class="flex flex-wrap gap-2 text-xs">
              <span class="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl ${hasGovId ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' : 'bg-gray-100 text-gray-500'}">
                <i class="fa-solid ${hasGovId ? 'fa-circle-check text-emerald-600' : 'fa-circle-xmark'}"></i>
                <span>Government ID (NIN/Voters Card/Passport)</span>
              </span>
              <span class="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl ${hasFarmPhoto ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' : 'bg-gray-100 text-gray-500'}">
                <i class="fa-solid ${hasFarmPhoto ? 'fa-circle-check text-emerald-600' : 'fa-circle-xmark'}"></i>
                <span>Farm Overview Photograph</span>
              </span>
              <span class="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl ${hasProfilePhoto ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' : 'bg-gray-100 text-gray-500'}">
                <i class="fa-solid ${hasProfilePhoto ? 'fa-circle-check text-emerald-600' : 'fa-circle-xmark'}"></i>
                <span>Farmer Profile Portrait</span>
              </span>
            </div>
          </div>
        </div>

        <!-- Action Center & Next Steps -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Return to Dashboard -->
          <button onclick="actions.guardView('farmer-dashboard')" class="p-5 rounded-3xl glass-card border border-gray-200 dark:border-slate-800 hover:border-emerald-500 transition-all text-left group shadow-sm flex items-center space-x-4">
            <div class="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition-transform">
              <i class="fa-solid fa-gauge-high"></i>
            </div>
            <div>
              <div class="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">Farmer Dashboard</div>
              <div class="text-[11px] text-gray-500 mt-0.5">Explore farm insights, wallet balance, and prepare harvest listings.</div>
            </div>
          </button>

          <!-- Contact Support -->
          <button onclick="actions.openChatDrawer('Agrein Support')" class="p-5 rounded-3xl glass-card border border-gray-200 dark:border-slate-800 hover:border-emerald-500 transition-all text-left group shadow-sm flex items-center space-x-4">
            <div class="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition-transform">
              <i class="fa-solid fa-headset"></i>
            </div>
            <div>
              <div class="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">Verification Support</div>
              <div class="text-[11px] text-gray-500 mt-0.5">Chat directly with an Agrein verification specialist 24/7.</div>
            </div>
          </button>
        </div>

        <!-- FAQ Accordion -->
        <div class="glass-card rounded-3xl p-6 sm:p-8 space-y-4 border border-gray-200/80 dark:border-slate-800 shadow-md">
          <h3 class="text-sm font-heading font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
            <i class="fa-solid fa-circle-question text-amber-500"></i>
            <span>Frequently Asked Questions</span>
          </h3>

          <div class="space-y-2 text-xs">
            <details class="group rounded-2xl border border-gray-100 dark:border-slate-800/80 p-3.5 bg-slate-50/50 dark:bg-slate-800/30">
              <summary class="font-bold text-slate-900 dark:text-white cursor-pointer flex items-center justify-between">
                <span>How long does verification review take?</span>
                <i class="fa-solid fa-chevron-down text-gray-400 group-open:rotate-180 transition-transform text-[10px]"></i>
              </summary>
              <p class="text-[11px] text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                Standard review turnaround is 18 to 24 hours. Applications with clear government IDs and accurate GPS coordinates are prioritized.
              </p>
            </details>

            <details class="group rounded-2xl border border-gray-100 dark:border-slate-800/80 p-3.5 bg-slate-50/50 dark:bg-slate-800/30">
              <summary class="font-bold text-slate-900 dark:text-white cursor-pointer flex items-center justify-between">
                <span>What happens once my verification is approved?</span>
                <i class="fa-solid fa-chevron-down text-gray-400 group-open:rotate-180 transition-transform text-[10px]"></i>
              </summary>
              <p class="text-[11px] text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                You will receive an instant in-app notification and email confirmation. Your profile will automatically display the Verified Farmer badge, and you can immediately publish harvest products for nationwide buyers.
              </p>
            </details>

            <details class="group rounded-2xl border border-gray-100 dark:border-slate-800/80 p-3.5 bg-slate-50/50 dark:bg-slate-800/30">
              <summary class="font-bold text-slate-900 dark:text-white cursor-pointer flex items-center justify-between">
                <span>Can I update my details if I made a typo?</span>
                <i class="fa-solid fa-chevron-down text-gray-400 group-open:rotate-180 transition-transform text-[10px]"></i>
              </summary>
              <p class="text-[11px] text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                If the review officer needs updated documents or clarification, they will flag your application as "Changes Required", which re-enables form editing so you can correct your details instantly.
              </p>
            </details>
          </div>
        </div>

      </div>
    </section>
  `;
}

// Global exposure & backward compatibility
if (typeof window !== 'undefined') {
  window.renderApplicationSubmittedView = renderApplicationSubmittedView;
  window.renderFarmerPendingApprovalView = renderApplicationSubmittedView;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { renderApplicationSubmittedView };
}
