// Admin Farmer Verification Dashboard — Table & Metrics

function renderAdminVerificationDashboard(state, actions) {
  const verifications = state.mockData.adminVerifications || [];
  const metrics = state.mockData.verificationMetrics || {};
  const deletionRequests = state.deletionRequests || [];

  // Refresh the deletion queue whenever the admin enters this view.
  if (!state.deletionRequestsLoaded) {
    actions.loadAdminDeletionQueue();
  }

  const metricCards = [
    { label: 'Total Farmers', value: metrics.total_farmers || '14,823', icon: 'fa-users', color: 'text-slate-700 dark:text-white', bg: 'bg-slate-50 dark:bg-slate-800' },
    { label: 'Verified', value: metrics.verified_farmers || '13,501', icon: 'fa-circle-check', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
    { label: 'Pending Review', value: metrics.pending_review || '1', icon: 'fa-clock', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/30' },
    { label: 'Under Review', value: metrics.under_review || '0', icon: 'fa-magnifying-glass', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/30' },
    { label: 'Changes Required', value: metrics.changes_required || '1', icon: 'fa-triangle-exclamation', color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-950/30' },
    { label: 'Approval Rate', value: metrics.approval_rate || '94.2%', icon: 'fa-chart-line', color: 'text-violet-600', bg: 'bg-violet-50 dark:bg-violet-950/30' }
  ];

  const statusBadge = (status) => {
    const map = {
      'APPROVED': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
      'PENDING_REVIEW': 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
      'UNDER_REVIEW': 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
      'CHANGES_REQUIRED': 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
      'REJECTED': 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
      'SUSPENDED': 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
    };
    return map[status] || 'bg-gray-100 text-gray-700';
  };

  return `
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-2xl font-heading font-extrabold text-slate-900 dark:text-white">Farmer Verification</h1>
          <p class="text-xs text-gray-500 mt-1">Review, approve, and manage farmer verification applications</p>
        </div>
        <div class="flex items-center space-x-2 text-xs">
          <span class="px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold">Avg Review: ${metrics.avg_review_time || '18 hours'}</span>
        </div>
      </div>

      <!-- Metrics Cards -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        ${metricCards.map(m => `
          <div class="${m.bg} rounded-2xl p-4 border border-gray-100 dark:border-slate-800">
            <div class="flex items-center space-x-2">
              <i class="fa-solid ${m.icon} ${m.color} text-sm"></i>
              <span class="text-[10px] font-bold text-gray-500">${m.label}</span>
            </div>
            <div class="text-xl font-heading font-extrabold ${m.color} mt-2">${m.value}</div>
          </div>
        `).join('')}
      </div>

      <!-- Applications Table -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div class="p-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
          <h3 class="text-sm font-heading font-extrabold text-slate-900 dark:text-white">Applications</h3>
          <div class="flex items-center space-x-2">
            <select onchange="actions.triggerToast('Filter applied')" class="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[10px] font-bold text-slate-900 dark:text-white outline-none">
              <option>All Status</option><option>PENDING_REVIEW</option><option>UNDER_REVIEW</option><option>CHANGES_REQUIRED</option><option>APPROVED</option><option>REJECTED</option><option>SUSPENDED</option>
            </select>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-xs">
            <thead>
              <tr class="bg-slate-50 dark:bg-slate-800/50 text-left">
                <th class="px-4 py-3 font-bold text-gray-500">Farmer</th>
                <th class="px-4 py-3 font-bold text-gray-500 hidden md:table-cell">Farm</th>
                <th class="px-4 py-3 font-bold text-gray-500 hidden sm:table-cell">Location</th>
                <th class="px-4 py-3 font-bold text-gray-500">Status</th>
                <th class="px-4 py-3 font-bold text-gray-500 hidden lg:table-cell">Submitted</th>
                <th class="px-4 py-3 font-bold text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-slate-800">
              ${verifications.map(v => `
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td class="px-4 py-3 min-w-0">
                    <div class="font-bold text-slate-900 dark:text-white truncate max-w-[160px]">${v.farmer_name}</div>
                    <div class="text-[10px] text-gray-400 truncate max-w-[160px] sm:hidden">${v.email}</div>
                  </td>
                  <td class="px-4 py-3 font-medium text-slate-700 dark:text-gray-300 hidden md:table-cell">${v.farm_name}</td>
                  <td class="px-4 py-3 hidden sm:table-cell">
                    <span class="text-gray-500">${v.farm_state}, ${v.farm_lga}</span>
                  </td>
                  <td class="px-4 py-3">
                    <span class="px-2.5 py-1 rounded-lg ${statusBadge(v.status)} text-[10px] font-extrabold whitespace-nowrap">${v.status.replaceAll('_', ' ')}</span>
                  </td>
                  <td class="px-4 py-3 text-gray-500 hidden lg:table-cell">${v.submitted_at ? new Date(v.submitted_at).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' }) : '—'}</td>
                  <td class="px-4 py-3">
                    <button onclick="actions.openAdminReview('${v.id}')" class="px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] hover:bg-emerald-200 transition-all whitespace-nowrap">
                      ${v.status === 'APPROVED' ? 'View' : 'Review'}
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Account Deletion Requests Queue -->
      <div class="mt-8 bg-white dark:bg-slate-900 rounded-2xl border-2 border-red-500/30 shadow-sm overflow-hidden">
        <div class="p-4 border-b border-red-100 dark:border-red-900/40 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div class="inline-flex items-center space-x-2 text-[10px] font-extrabold uppercase tracking-wider text-red-700 dark:text-red-300">
              <i class="fa-solid fa-trash-can"></i>
              <span>Account Deletion Queue</span>
            </div>
            <h3 class="text-sm font-heading font-extrabold text-slate-900 dark:text-white mt-1">Pending Account Removals</h3>
            <p class="text-[11px] text-gray-500 mt-0.5">Users who have requested account deletion. After 14 days without action, approve to permanently remove.</p>
          </div>
          <div class="flex items-center space-x-2">
            <span class="px-3 py-1.5 rounded-xl bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs font-extrabold">
              ${deletionRequests.length} Pending
            </span>
            <button onclick="actions.loadAdminDeletionQueue()" class="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-gray-200 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center space-x-1">
              <i class="fa-solid fa-rotate"></i>
              <span>Refresh</span>
            </button>
          </div>
        </div>

        <div class="p-4">
          ${deletionRequests.length === 0 ? `
            <div class="py-10 text-center text-xs text-gray-400">
              <i class="fa-solid fa-shield-halved text-2xl text-emerald-400 mb-2 block"></i>
              <div class="font-bold text-gray-500">No pending deletion requests.</div>
              <p class="mt-1">All Agrein accounts are in good standing. New requests will appear here automatically.</p>
            </div>
          ` : `
            <div class="space-y-3">
              ${deletionRequests.map(req => {
                const accent = req.role === 'FARMER' ? 'amber' : req.role === 'BUYER' ? 'blue' : 'emerald';
                const pill = accent === 'amber' ? 'bg-amber-600' : accent === 'blue' ? 'bg-blue-600' : 'bg-emerald-600';
                return `
                  <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-700">
                    <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div class="min-w-0 flex-1">
                        <div class="flex flex-wrap items-center gap-2">
                          <span class="font-extrabold text-sm text-slate-900 dark:text-white truncate">${req.full_name || req.email}</span>
                          <span class="px-2 py-0.5 rounded-full ${pill} text-white text-[10px] font-extrabold uppercase tracking-wider">${(req.role || 'USER').toUpperCase()}</span>
                          <span class="px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300 text-[10px] font-extrabold uppercase tracking-wider">Deletion Pending</span>
                        </div>
                        <div class="text-[11px] text-gray-500 truncate mt-0.5">${req.email}</div>
                        <div class="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                          <div class="p-2 rounded-lg bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700">
                            <div class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Requested</div>
                            <div class="font-bold text-slate-900 dark:text-white">${req.deletion_requested_at ? new Date(req.deletion_requested_at).toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}</div>
                          </div>
                          <div class="p-2 rounded-lg bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700">
                            <div class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Scheduled Purge</div>
                            <div class="font-bold text-slate-900 dark:text-white">${req.deletion_scheduled_for ? new Date(req.deletion_scheduled_for).toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}</div>
                          </div>
                          <div class="p-2 rounded-lg bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700">
                            <div class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Days Remaining</div>
                            <div class="font-extrabold ${req.days_remaining !== null && req.days_remaining <= 3 ? 'text-red-600' : 'text-amber-600'}">${req.days_remaining !== null && req.days_remaining !== undefined ? `${req.days_remaining} day${req.days_remaining === 1 ? '' : 's'}` : '—'}</div>
                          </div>
                        </div>
                        <div class="mt-2 p-2 rounded-lg bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 text-[11px]">
                          <div class="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Reason on file</div>
                          <div class="text-gray-700 dark:text-gray-300 italic">"${req.deletion_request_reason || 'No reason provided.'}"</div>
                        </div>
                      </div>
                      <div class="flex sm:flex-col gap-2 sm:gap-2 flex-shrink-0">
                        <button onclick="actions.adminOpenDeletionAction('${req.id}', 'REJECT_DELETION')" class="px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 text-white text-[11px] font-extrabold shadow-md transition-all flex items-center justify-center space-x-1 whitespace-nowrap">
                          <i class="fa-solid fa-rotate-left"></i>
                          <span>Restore</span>
                        </button>
                        <button onclick="actions.adminOpenDeletionAction('${req.id}', 'APPROVE_DELETION')" class="px-3 py-2 rounded-xl bg-gradient-to-r from-red-700 to-red-900 hover:from-red-800 hover:to-red-950 text-white text-[11px] font-extrabold shadow-md transition-all flex items-center justify-center space-x-1 whitespace-nowrap">
                          <i class="fa-solid fa-trash-can"></i>
                          <span>Approve &amp; Purge</span>
                        </button>
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          `}
        </div>
      </div>
    </section>
  `;
}
