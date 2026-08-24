// Admin Review Screen — Detailed Farmer Verification Dossier Inspector

function renderAdminReviewScreen(state, actions) {
  const dossier = state.adminReviewDossier || state.mockData.adminVerifications[0] || {};
  const auditLogs = state.mockData.verificationAuditLogs || [];
  const dossierLogs = auditLogs.filter(l => l.verification_id === dossier.id);
  const checklist = dossier.checklist || {};

  const statusBadge = (status) => {
    const map = {
      'APPROVED': { bg: 'bg-emerald-100 dark:bg-emerald-950', text: 'text-emerald-700 dark:text-emerald-300', dot: '🟢' },
      'PENDING_REVIEW': { bg: 'bg-amber-100 dark:bg-amber-950', text: 'text-amber-700 dark:text-amber-300', dot: '🟡' },
      'UNDER_REVIEW': { bg: 'bg-blue-100 dark:bg-blue-950', text: 'text-blue-700 dark:text-blue-300', dot: '🔵' },
      'CHANGES_REQUIRED': { bg: 'bg-orange-100 dark:bg-orange-950', text: 'text-orange-700 dark:text-orange-300', dot: '🟠' },
      'REJECTED': { bg: 'bg-red-100 dark:bg-red-950', text: 'text-red-700 dark:text-red-300', dot: '🔴' },
      'SUSPENDED': { bg: 'bg-red-100 dark:bg-red-950', text: 'text-red-700 dark:text-red-300', dot: '🔴' }
    };
    return map[status] || map['PENDING_REVIEW'];
  };

  const sb = statusBadge(dossier.status);

  return `
    <section class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <!-- Back Button -->
      <button onclick="actions.setView('admin-verification')" class="mb-6 flex items-center space-x-2 text-xs font-bold text-gray-500 hover:text-emerald-600 transition-all">
        <i class="fa-solid fa-arrow-left"></i>
        <span>Back to Verification Queue</span>
      </button>

      <!-- Header -->
      <div class="flex flex-wrap items-center justify-between gap-3 mb-8">
        <div>
          <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Farmer Verification</div>
          <h1 class="text-2xl font-heading font-extrabold text-slate-900 dark:text-white">${dossier.farmer_name || 'Farmer'}</h1>
          <div class="text-xs text-gray-500 mt-1">Farmer ID: <span class="font-bold text-emerald-600">AGR-FRM-${(dossier.id || 'ver-001').slice(-5).toUpperCase()}</span></div>
        </div>
        <span class="px-3 py-1.5 rounded-xl ${sb.bg} ${sb.text} font-extrabold text-xs flex-shrink-0">${sb.dot} ${(dossier.status || 'PENDING_REVIEW').replaceAll('_', ' ')}</span>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left: Personal & Farm Info -->
        <div class="lg:col-span-2 space-y-6">

          <!-- Personal Information -->
          <div class="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm">
            <h3 class="text-xs font-heading font-extrabold text-slate-900 dark:text-white mb-4 flex items-center space-x-2"><i class="fa-solid fa-user text-emerald-500"></i><span>Personal Information</span></h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div><span class="text-gray-400">Name:</span> <span class="font-bold text-slate-900 dark:text-white">${dossier.farmer_name}</span></div>
              <div><span class="text-gray-400">Phone:</span> <span class="font-bold text-slate-900 dark:text-white">${dossier.phone || '+234 803 456 7890'}</span></div>
              <div><span class="text-gray-400">Email:</span> <span class="font-bold text-slate-900 dark:text-white">${dossier.email}</span></div>
              <div><span class="text-gray-400">State:</span> <span class="font-bold text-slate-900 dark:text-white">${dossier.state}, ${dossier.lga}</span></div>
              <div class="sm:col-span-2"><span class="text-gray-400">Address:</span> <span class="font-bold text-slate-900 dark:text-white">${dossier.residential_address || 'N/A'}</span></div>
            </div>
          </div>

          <!-- Farm Information -->
          <div class="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm">
            <h3 class="text-xs font-heading font-extrabold text-slate-900 dark:text-white mb-4 flex items-center space-x-2"><i class="fa-solid fa-tractor text-emerald-500"></i><span>Farm Information</span></h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div><span class="text-gray-400">Farm Name:</span> <span class="font-bold text-slate-900 dark:text-white">${dossier.farm_name}</span></div>
              <div><span class="text-gray-400">Farm Size:</span> <span class="font-bold text-slate-900 dark:text-white">${dossier.farm_size_acres || 0} Acres</span></div>
              <div><span class="text-gray-400">Farm Type:</span> <span class="font-bold text-slate-900 dark:text-white">${dossier.farm_type}</span></div>
              <div><span class="text-gray-400">Experience:</span> <span class="font-bold text-slate-900 dark:text-white">${dossier.years_experience} Years</span></div>
              <div class="sm:col-span-2"><span class="text-gray-400">Products:</span> <span class="font-bold text-slate-900 dark:text-white">${(dossier.crops_produced || []).join(', ')}</span></div>
            </div>
          </div>

          <!-- Farm Location -->
          <div class="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm">
            <h3 class="text-xs font-heading font-extrabold text-slate-900 dark:text-white mb-4 flex items-center space-x-2"><i class="fa-solid fa-map-location-dot text-emerald-500"></i><span>Farm Location</span></h3>
            <div class="w-full h-48 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-gray-200 dark:border-slate-700 mb-3">
              <div class="text-center">
                <i class="fa-solid fa-map text-4xl text-emerald-300/50"></i>
                <div class="text-[10px] text-gray-400 mt-2">GPS: ${dossier.gps_latitude || '9.0820'}°N, ${dossier.gps_longitude || '8.6753'}°E</div>
                <div class="text-xs font-bold text-gray-500 mt-1">${dossier.farm_location || dossier.farm_state}</div>
              </div>
            </div>
          </div>

          <!-- Documents -->
          <div class="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm">
            <h3 class="text-xs font-heading font-extrabold text-slate-900 dark:text-white mb-4 flex items-center space-x-2"><i class="fa-solid fa-file-shield text-emerald-500"></i><span>Documents</span></h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              ${(dossier.documents || []).map(doc => `
                <div class="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
                  <div class="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 text-sm">
                    <i class="fa-solid ${doc.type === 'government_id' ? 'fa-id-card' : (doc.type === 'farm_deed' ? 'fa-file-contract' : 'fa-image')}"></i>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="text-xs font-bold text-slate-900 dark:text-white truncate">${doc.name}</div>
                    <div class="text-[10px] text-gray-400">${doc.type.replace('_', ' ').toUpperCase()}</div>
                  </div>
                  <button class="text-xs text-emerald-600 font-bold hover:underline">View</button>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Farm Photos -->
          <div class="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm">
            <h3 class="text-xs font-heading font-extrabold text-slate-900 dark:text-white mb-4 flex items-center space-x-2"><i class="fa-solid fa-images text-emerald-500"></i><span>Farm Photos</span></h3>
            <div class="grid grid-cols-3 gap-3">
              ${(dossier.documents || []).filter(d => d.type === 'farm_photo').map(p => `
                <div class="aspect-square rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700">
                  <img src="${p.url}" alt="${p.name}" class="w-full h-full object-cover">
                </div>
              `).join('')}
              ${(dossier.documents || []).filter(d => d.type === 'farm_photo').length === 0 ? `
                <div class="col-span-3 py-6 text-center text-xs text-gray-400">No farm photos uploaded</div>
              ` : ''}
            </div>
          </div>
        </div>

        <!-- Right Sidebar: Checklist, Actions & Audit Log -->
        <div class="space-y-6">

          <!-- Verification Checklist -->
          <div class="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm">
            <h3 class="text-xs font-heading font-extrabold text-slate-900 dark:text-white mb-4">Verification Checklist</h3>
            <div class="space-y-2">
              ${[
                { key: 'identityVerified', label: 'Identity verified' },
                { key: 'farmInfoVerified', label: 'Farm information verified' },
                { key: 'locationReviewed', label: 'Farm location reviewed' },
                { key: 'photosReviewed', label: 'Farm photos reviewed' },
                { key: 'documentsReviewed', label: 'Documents reviewed' },
                { key: 'informationLegitimate', label: 'Information appears legitimate' }
              ].map(item => `
                <label class="flex items-center space-x-2 text-xs cursor-pointer">
                  <input type="checkbox" ${checklist[item.key] ? 'checked' : ''} class="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500">
                  <span class="font-medium ${checklist[item.key] ? 'text-slate-900 dark:text-white' : 'text-gray-400'}">${item.label}</span>
                </label>
              `).join('')}
            </div>
          </div>

          <!-- Admin Decision Actions -->
          <div class="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm space-y-3">
            <h3 class="text-xs font-heading font-extrabold text-slate-900 dark:text-white mb-2">Admin Decision</h3>
            
            ${dossier.status !== 'APPROVED' && dossier.status !== 'SUSPENDED' ? `
              <button onclick="actions.adminApproveFarmer('${dossier.id}')" class="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-all flex items-center justify-center space-x-2">
                <i class="fa-solid fa-circle-check"></i><span>Approve Farmer</span>
              </button>
              <button onclick="actions.adminRequestChanges('${dossier.id}')" class="w-full py-2.5 rounded-xl bg-orange-500 text-white font-bold text-xs hover:bg-orange-600 transition-all flex items-center justify-center space-x-2">
                <i class="fa-solid fa-pen-to-square"></i><span>Request Changes</span>
              </button>
              <button onclick="actions.adminRejectFarmer('${dossier.id}')" class="w-full py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition-all flex items-center justify-center space-x-2">
                <i class="fa-solid fa-circle-xmark"></i><span>Reject Application</span>
              </button>
            ` : ''}
            
            ${dossier.status === 'APPROVED' ? `
              <button onclick="actions.adminSuspendFarmer('${dossier.id}')" class="w-full py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition-all flex items-center justify-center space-x-2">
                <i class="fa-solid fa-ban"></i><span>Suspend Farmer</span>
              </button>
            ` : ''}

            ${dossier.status === 'SUSPENDED' ? `
              <button onclick="actions.adminReinstateFarmer('${dossier.id}')" class="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-all flex items-center justify-center space-x-2">
                <i class="fa-solid fa-rotate-left"></i><span>Reinstate Farmer</span>
              </button>
            ` : ''}
          </div>

          <!-- Audit Log -->
          <div class="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm">
            <h3 class="text-xs font-heading font-extrabold text-slate-900 dark:text-white mb-4">Verification History</h3>
            ${dossierLogs.length > 0 ? `
              <div class="space-y-4">
                ${dossierLogs.map(log => `
                  <div class="relative pl-6 border-l-2 border-emerald-200 dark:border-emerald-800 pb-4">
                    <div class="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                    <div class="text-[10px] text-gray-400">${new Date(log.created_at).toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                    <div class="text-[10px] text-gray-500">Admin: ${log.admin_email}</div>
                    <div class="text-xs font-bold text-slate-900 dark:text-white mt-1">${log.action.replaceAll('_', ' ')}</div>
                    ${log.reason ? `<div class="text-[10px] text-gray-500 mt-1 italic">"${log.reason}"</div>` : ''}
                  </div>
                `).join('')}
              </div>
            ` : '<div class="text-xs text-gray-400 text-center py-4">No audit history yet</div>'}
          </div>
        </div>
      </div>
    </section>
  `;
}
