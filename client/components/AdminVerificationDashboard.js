// Admin Farmer Verification Dashboard — Table & Metrics

function renderAdminVerificationDashboard(state, actions) {
  const verifications = state.mockData.adminVerifications || [];
  const metrics = state.mockData.verificationMetrics || {};

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
    <section class="max-w-7xl mx-auto px-4 py-10">
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
                <th class="px-4 py-3 font-bold text-gray-500">Farm</th>
                <th class="px-4 py-3 font-bold text-gray-500">Location</th>
                <th class="px-4 py-3 font-bold text-gray-500">Status</th>
                <th class="px-4 py-3 font-bold text-gray-500">Submitted</th>
                <th class="px-4 py-3 font-bold text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-slate-800">
              ${verifications.map(v => `
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td class="px-4 py-3">
                    <div class="font-bold text-slate-900 dark:text-white">${v.farmer_name}</div>
                    <div class="text-[10px] text-gray-400">${v.email}</div>
                  </td>
                  <td class="px-4 py-3 font-medium text-slate-700 dark:text-gray-300">${v.farm_name}</td>
                  <td class="px-4 py-3">
                    <span class="text-gray-500">${v.farm_state}, ${v.farm_lga}</span>
                  </td>
                  <td class="px-4 py-3">
                    <span class="px-2.5 py-1 rounded-lg ${statusBadge(v.status)} text-[10px] font-extrabold">${v.status.replaceAll('_', ' ')}</span>
                  </td>
                  <td class="px-4 py-3 text-gray-500">${v.submitted_at ? new Date(v.submitted_at).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' }) : '—'}</td>
                  <td class="px-4 py-3">
                    <button onclick="actions.openAdminReview('${v.id}')" class="px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] hover:bg-emerald-200 transition-all">
                      ${v.status === 'APPROVED' ? 'View' : 'Review'}
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `;
}
