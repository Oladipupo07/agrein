// Admin Review Screen — Detailed Farmer Verification Dossier Inspector

function renderAdminReviewScreen(state, actions) {
  const dossier = state.adminReviewDossier || state.mockData.adminVerifications[0] || {};
  const status = dossier.status || 'PENDING_REVIEW';

  const statusBadge = (st) => {
    const map = {
      'APPROVED': { bg: 'bg-emerald-100 dark:bg-emerald-950/60', text: 'text-emerald-700 dark:text-emerald-300', dot: '🟢' },
      'PENDING_REVIEW': { bg: 'bg-amber-100 dark:bg-amber-950/60', text: 'text-amber-700 dark:text-amber-300', dot: '🟡' },
      'UNDER_REVIEW': { bg: 'bg-blue-100 dark:bg-blue-950/60', text: 'text-blue-700 dark:text-blue-300', dot: '🔵' },
      'CHANGES_REQUIRED': { bg: 'bg-orange-100 dark:bg-orange-950/60', text: 'text-orange-700 dark:text-orange-300', dot: '🟠' },
      'REJECTED': { bg: 'bg-red-100 dark:bg-red-950/60', text: 'text-red-700 dark:text-red-300', dot: '🔴' },
      'SUSPENDED': { bg: 'bg-red-100 dark:bg-red-950/60', text: 'text-red-700 dark:text-red-300', dot: '🔴' }
    };
    return map[st] || map['PENDING_REVIEW'];
  };

  const sb = statusBadge(status);

  return `
    <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <!-- Back Header -->
      <div class="flex items-center justify-between">
        <button onclick="actions.setView('admin-dashboard'); actions.setAdminTab('verifications');" class="flex items-center space-x-2 text-xs font-bold text-gray-500 hover:text-emerald-600 transition-all bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm">
          <i class="fa-solid fa-arrow-left"></i>
          <span>Back to Admin Verification Queue</span>
        </button>

        <div class="flex items-center space-x-2">
          <span class="px-3.5 py-1.5 rounded-full ${sb.bg} ${sb.text} font-extrabold text-xs shadow-sm flex items-center space-x-1.5">
            <span>${sb.dot}</span>
            <span>${status.replace('_', ' ')}</span>
          </span>
        </div>
      </div>

      <!-- Dossier Hero Card -->
      <div class="glass-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-xl space-y-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 dark:border-slate-800 pb-6">
          <div class="flex items-center space-x-4">
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-800 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-emerald-700/20">
              ${(dossier.farmer_name || 'F')[0].toUpperCase()}
            </div>
            <div>
              <div class="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Farmer Verification Dossier</div>
              <h1 class="text-2xl font-heading font-extrabold text-slate-900 dark:text-white">${dossier.farmer_name || 'Farmer Details'}</h1>
              <p class="text-xs text-gray-500 font-mono mt-0.5">Application ID: ${dossier.id || 'N/A'}</p>
            </div>
          </div>

          <!-- Quick Decision Actions -->
          <div class="flex items-center space-x-2 flex-wrap gap-2">
            <button onclick="actions.adminApproveFarmer('${dossier.id}')" class="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center space-x-1.5">
              <i class="fa-solid fa-circle-check text-amber-300"></i>
              <span>Approve & Verify</span>
            </button>
            <button onclick="actions.adminPromptRequestChanges('${dossier.id}')" class="px-4 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs shadow-md transition-all flex items-center space-x-1.5">
              <i class="fa-solid fa-pen-to-square"></i>
              <span>Request Corrections</span>
            </button>
            <button onclick="actions.adminPromptReject('${dossier.id}')" class="px-4 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center space-x-1.5">
              <i class="fa-solid fa-circle-xmark"></i>
              <span>Reject</span>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <!-- Left 2 Cols: Data -->
          <div class="lg:col-span-2 space-y-6">
            
            <!-- 1. Personal Info -->
            <div class="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 space-y-3">
              <div class="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
                <i class="fa-solid fa-user"></i>
                <span>1. Personal Information</span>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div><span class="text-gray-400 block text-[10px]">Full Name</span><span class="font-bold text-slate-900 dark:text-white">${dossier.farmer_name || 'N/A'}</span></div>
                <div><span class="text-gray-400 block text-[10px]">Email Address</span><span class="font-bold text-slate-900 dark:text-white font-mono">${dossier.farmer_email || dossier.email || 'N/A'}</span></div>
                <div><span class="text-gray-400 block text-[10px]">Phone Number</span><span class="font-bold text-slate-900 dark:text-white font-mono">${dossier.phone || 'N/A'}</span></div>
                <div><span class="text-gray-400 block text-[10px]">Residential State & LGA</span><span class="font-bold text-slate-900 dark:text-white">${dossier.state || dossier.farm_state || 'N/A'}, ${dossier.lga || dossier.farm_lga || ''}</span></div>
                <div class="sm:col-span-2"><span class="text-gray-400 block text-[10px]">Residential Address</span><span class="font-bold text-slate-900 dark:text-white">${dossier.residential_address || 'N/A'}</span></div>
              </div>
            </div>

            <!-- 2. Farm Operational Profile -->
            <div class="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 space-y-3">
              <div class="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
                <i class="fa-solid fa-tractor"></i>
                <span>2. Farm Operational Details</span>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div><span class="text-gray-400 block text-[10px]">Farm Name</span><span class="font-bold text-slate-900 dark:text-white">${dossier.farm_name || 'N/A'}</span></div>
                <div><span class="text-gray-400 block text-[10px]">Farm Type</span><span class="font-bold text-slate-900 dark:text-white">${dossier.farm_type || 'Crop Farming'}</span></div>
                <div><span class="text-gray-400 block text-[10px]">Farm Size (Acres)</span><span class="font-bold text-slate-900 dark:text-white">${dossier.farm_size_acres || 0} Acres</span></div>
                <div><span class="text-gray-400 block text-[10px]">Years of Experience</span><span class="font-bold text-slate-900 dark:text-white">${dossier.years_experience || 0} Years</span></div>
                <div class="sm:col-span-2"><span class="text-gray-400 block text-[10px]">Crops / Livestock Produced</span><span class="font-bold text-slate-900 dark:text-white">${Array.isArray(dossier.crops_produced) ? dossier.crops_produced.join(', ') : (dossier.crops_produced || 'N/A')}</span></div>
                <div class="sm:col-span-2"><span class="text-gray-400 block text-[10px]">Intended Produce for Sale on Agrein</span><span class="font-bold text-slate-900 dark:text-white">${dossier.intended_products || 'All listed crops'}</span></div>
              </div>
            </div>

            <!-- 3. Farm Location & GPS -->
            <div class="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 space-y-3">
              <div class="flex items-center justify-between">
                <div class="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <i class="fa-solid fa-map-location-dot"></i>
                  <span>3. Farm Physical Location & Satellite Coordinates</span>
                </div>
                ${dossier.gps_latitude && dossier.gps_longitude ? `
                  <a href="https://www.google.com/maps?q=${dossier.gps_latitude},${dossier.gps_longitude}" target="_blank" class="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-[10px] shadow transition-all flex items-center space-x-1">
                    <i class="fa-solid fa-satellite"></i>
                    <span>Open Satellite Maps</span>
                  </a>
                ` : ''}
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div class="sm:col-span-2"><span class="text-gray-400 block text-[10px]">Farm Physical Address / Landmark</span><span class="font-bold text-slate-900 dark:text-white">${dossier.farm_location || 'N/A'}</span></div>
                <div><span class="text-gray-400 block text-[10px]">Farm State & LGA</span><span class="font-bold text-slate-900 dark:text-white">${dossier.farm_state || dossier.state || 'Nigeria'}, ${dossier.farm_lga || dossier.lga || ''}</span></div>
                <div><span class="text-gray-400 block text-[10px]">GPS Coordinates</span><span class="font-mono font-bold text-emerald-600 dark:text-emerald-400">${dossier.gps_latitude || '—'}° N, ${dossier.gps_longitude || '—'}° E</span></div>
              </div>
            </div>

          </div>

          <!-- Right 1 Col: Documents Gallery -->
          <div class="space-y-4">
            <div class="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
              <i class="fa-solid fa-file-shield"></i>
              <span>Uploaded Documents (${(dossier.documents || []).length})</span>
            </div>

            ${(dossier.documents || []).length === 0 ? `
              <div class="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 text-center text-xs text-gray-400">
                No documents uploaded yet.
              </div>
            ` : `
              <div class="space-y-3">
                ${(dossier.documents || []).map(doc => `
                  <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 space-y-2 group">
                    <div class="flex items-center space-x-2.5">
                      <div class="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center text-xs flex-shrink-0">
                        <i class="fa-solid ${doc.type === 'government_id' ? 'fa-id-card' : (doc.type === 'farm_deed' ? 'fa-file-contract' : 'fa-image')}"></i>
                      </div>
                      <div class="min-w-0 flex-1">
                        <div class="text-xs font-extrabold text-slate-900 dark:text-white truncate">${doc.name || doc.type}</div>
                        <div class="text-[10px] text-emerald-600 font-bold uppercase">${doc.type.replace('_', ' ')}</div>
                      </div>
                    </div>

                    ${doc.url && (doc.url.startsWith('data:image') || doc.url.startsWith('http')) ? `
                      <div class="aspect-video rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 cursor-pointer"
                           onclick="actions.openDocumentPreview('${doc.url}', '${(doc.name || '').replace(/'/g, "\\'")}', '${doc.type}')">
                        <img src="${doc.url}" alt="${doc.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                      </div>
                    ` : ''}

                    <button onclick="actions.openDocumentPreview('${doc.url}', '${(doc.name || '').replace(/'/g, "\\'")}', '${doc.type}')"
                            class="w-full py-1.5 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-gray-200 font-bold text-[10px] border border-gray-200 dark:border-slate-700 hover:bg-gray-50 flex items-center justify-center space-x-1">
                      <i class="fa-solid fa-magnifying-glass text-emerald-500"></i>
                      <span>Inspect High-Res</span>
                    </button>
                  </div>
                `).join('')}
              </div>
            `}
          </div>

        </div>

      </div>
    </section>

    <!-- Document Lightbox Modal -->
    ${state.adminDocumentPreviewModal?.active ? `
      <div class="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
        <div class="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full overflow-hidden border border-gray-200 dark:border-slate-800 shadow-2xl space-y-4 p-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-extrabold text-base text-slate-900 dark:text-white">${state.adminDocumentPreviewModal.name || 'Document Preview'}</h3>
              <span class="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">${state.adminDocumentPreviewModal.type || 'DOCUMENT'}</span>
            </div>
            <button onclick="actions.closeDocumentPreview()" class="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-500 hover:text-white flex items-center justify-center">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div class="max-h-[70vh] overflow-auto rounded-2xl bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-2 border border-gray-200 dark:border-slate-800">
            ${state.adminDocumentPreviewModal.url && state.adminDocumentPreviewModal.url.startsWith('data:image') || (state.adminDocumentPreviewModal.url && !state.adminDocumentPreviewModal.url.endsWith('.pdf')) ? `
              <img src="${state.adminDocumentPreviewModal.url}" alt="Preview" class="max-h-[65vh] object-contain rounded-xl shadow">
            ` : `
              <div class="py-16 text-center text-xs text-gray-500">
                <i class="fa-solid fa-file-pdf text-5xl text-red-500 mb-3 block"></i>
                <div class="font-bold text-slate-900 dark:text-white">PDF Document Attached</div>
                <a href="${state.adminDocumentPreviewModal.url}" download="${state.adminDocumentPreviewModal.name}" class="mt-3 inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs shadow hover:bg-emerald-800">
                  <i class="fa-solid fa-download"></i>
                  <span>Download Document</span>
                </a>
              </div>
            `}
          </div>
        </div>
      </div>
    ` : ''}
  `;
}
