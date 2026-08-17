// Account Settings — self-service profile, security, and account deletion (14-day grace).
// All copy is mirror-consistent with the rest of the Agrein shell.

function renderAccountSettings(state, actions) {
  const user = state.currentUser;
  if (!user) {
    return `
      <section class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div class="glass-card rounded-3xl p-8 sm:p-12 space-y-4">
          <i class="fa-solid fa-lock text-3xl text-emerald-500"></i>
          <h1 class="text-2xl font-heading font-extrabold text-slate-900 dark:text-white">Account Settings</h1>
          <p class="text-sm text-gray-500">Please log in to manage your account.</p>
          <button onclick="actions.openAuthModal('login')" class="px-6 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold">Log In</button>
        </div>
      </section>
    `;
  }

  const roleAccent = (role) => {
    if (role === 'BUYER') return { pill: 'bg-blue-600', avatar: 'bg-blue-600' };
    if (role === 'FARMER') return { pill: 'bg-amber-600', avatar: 'bg-amber-600' };
    if (role === 'ADMIN') return { pill: 'bg-purple-600', avatar: 'bg-purple-600' };
    return { pill: 'bg-emerald-600', avatar: 'bg-emerald-600' };
  };
  const initialsFor = (name) => {
    if (!name) return '👤';
    const parts = name.trim().split(/\s+/);
    return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
  };

  const backView = (user.role || '').toUpperCase() === 'BUYER' ? 'buyer-dashboard'
    : (user.role || '').toUpperCase() === 'ADMIN' ? 'admin-dashboard'
    : 'farmer-dashboard';

  const joined = user.created_at ? new Date(user.created_at).toLocaleDateString('en-NG', {
    year: 'numeric', month: 'long', day: 'numeric'
  }) : 'Recently';

  const isPending = !!user.deletion_pending;
  const scheduledDate = user.deletion_scheduled_for ? new Date(user.deletion_scheduled_for) : null;
  const requestedDate = user.deletion_requested_at ? new Date(user.deletion_requested_at) : null;
  const daysRemaining = scheduledDate ? Math.max(0, Math.ceil((scheduledDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000))) : null;
  const accent = roleAccent(user.role);

  const formatDate = (d) => d ? d.toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' }) : '—';

  return `
    <section class="py-8 sm:py-10 bg-slate-50/50 dark:bg-slate-900/50 min-h-screen">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        <!-- Back Button -->
        <button onclick="actions.guardView('${backView}')" class="flex items-center space-x-2 text-xs font-bold text-gray-500 hover:text-emerald-600 transition-all">
          <i class="fa-solid fa-arrow-left"></i>
          <span>Back to Dashboard</span>
        </button>

        <!-- Header -->
        <div class="glass-card rounded-3xl p-6 sm:p-8 border-l-8 border-l-emerald-600">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div class="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                <i class="fa-solid fa-user-gear"></i>
                <span>Agrein Account Settings</span>
              </div>
              <h1 class="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 dark:text-white mt-1">
                Profile, Security &amp; Data
              </h1>
              <p class="text-xs text-gray-500 mt-1">Manage your identity, password, and request account deletion.</p>
            </div>
          </div>
        </div>

        <!-- Identity Panel -->
        <div class="glass-card rounded-3xl p-6 sm:p-8 space-y-4">
          <h2 class="text-sm font-heading font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
            <i class="fa-solid fa-id-card text-emerald-500 mr-1"></i> Identity
          </h2>
          <div class="flex items-center space-x-4">
            <div class="w-14 h-14 rounded-2xl ${accent.avatar} text-white text-lg font-extrabold flex items-center justify-center flex-shrink-0">
              ${initialsFor(user.full_name)}
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-base font-extrabold text-slate-900 dark:text-white truncate">${user.full_name || user.email}</div>
              <div class="text-xs text-gray-500 truncate">${user.email}</div>
              <div class="mt-1 flex flex-wrap items-center gap-2">
                <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${accent.pill} text-white">
                  ${(user.role || 'USER').toUpperCase()}
                </span>
                ${user.verification_status ? `
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                    user.verification_status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                    user.verification_status === 'REJECTED' ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300' :
                    'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }">
                    ${user.verification_status.replaceAll('_', ' ')}
                  </span>
                ` : ''}
              </div>
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-gray-100 dark:border-slate-800 text-xs">
            <div class="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-800">
              <span class="text-gray-500 font-bold">Member Since</span>
              <span class="font-extrabold text-slate-900 dark:text-white">${joined}</span>
            </div>
            <div class="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-800">
              <span class="text-gray-500 font-bold">Account ID</span>
              <span class="font-extrabold text-slate-900 dark:text-white">${user.id || '—'}</span>
            </div>
          </div>
        </div>

        <!-- Security Panel -->
        <div class="glass-card rounded-3xl p-6 sm:p-8 space-y-4">
          <h2 class="text-sm font-heading font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
            <i class="fa-solid fa-shield-halved text-emerald-500 mr-1"></i> Security
          </h2>
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-700">
            <div>
              <div class="text-sm font-bold text-slate-900 dark:text-white">Password</div>
              <div class="text-[11px] text-gray-500">Update your sign-in password. Required every 90 days for compliance.</div>
            </div>
            <button onclick="actions.openChangePasswordModal()" class="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold shadow-md transition-all flex items-center space-x-2">
              <i class="fa-solid fa-lock text-amber-300"></i>
              <span>Change Password</span>
            </button>
          </div>
        </div>

        <!-- Danger Zone -->
        <div class="rounded-3xl p-6 sm:p-8 space-y-5 border-2 border-red-500/40 bg-red-50/40 dark:bg-red-950/20">
          <div>
            <div class="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-red-700 dark:text-red-400">
              <i class="fa-solid fa-triangle-exclamation"></i>
              <span>Danger Zone</span>
            </div>
            <h2 class="text-xl font-heading font-extrabold text-red-800 dark:text-red-300 mt-1">Delete Account</h2>
            <p class="text-xs text-red-700/80 dark:text-red-300/80 mt-1">
              Deleting your Agrein account is a serious action. We will hold your account for
              <strong>14 days</strong> before permanently removing your data. You can cancel this request any time during the grace period by signing back in. An Agrein administrator will review and approve the deletion.
            </p>
          </div>

          ${(user.role || '').toUpperCase() === 'ADMIN' ? `
            <div class="p-4 rounded-2xl bg-amber-100 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/40 text-xs text-amber-900 dark:text-amber-200">
              <div class="flex items-center space-x-2 font-extrabold mb-1">
                <i class="fa-solid fa-shield-halved"></i>
                <span>Administrator accounts cannot self-delete.</span>
              </div>
              <p>To preserve platform governance, administrator accounts must be removed by another administrator through the Admin Deletion Queue. Please contact the Agrein operations team.</p>
            </div>
          ` : isPending ? `
            <div class="p-4 rounded-2xl bg-red-100 dark:bg-red-950/50 border border-red-300 dark:border-red-700/40 space-y-3">
              <div class="flex items-start space-x-3">
                <i class="fa-solid fa-circle-exclamation text-red-600 text-lg mt-0.5"></i>
                <div class="flex-1">
                  <div class="text-sm font-extrabold text-red-800 dark:text-red-200">Deletion is pending.</div>
                  <p class="text-xs text-red-700 dark:text-red-300 mt-1">
                    Your account is scheduled for permanent removal on
                    <strong>${formatDate(scheduledDate)}</strong>
                    ${daysRemaining !== null ? ` (in <strong>${daysRemaining} day${daysRemaining === 1 ? '' : 's'}</strong>)` : ''}.
                    Until then, you can cancel this request and your account will be fully restored.
                  </p>
                </div>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div class="p-3 rounded-xl bg-white/60 dark:bg-slate-900/40 border border-red-200/60 dark:border-red-800/40">
                  <div class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Requested</div>
                  <div class="font-bold text-red-800 dark:text-red-200">${formatDate(requestedDate)}</div>
                </div>
                <div class="p-3 rounded-xl bg-white/60 dark:bg-slate-900/40 border border-red-200/60 dark:border-red-800/40">
                  <div class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Scheduled Purge</div>
                  <div class="font-bold text-red-800 dark:text-red-200">${formatDate(scheduledDate)}</div>
                </div>
              </div>
              <div class="p-3 rounded-xl bg-white/60 dark:bg-slate-900/40 border border-red-200/60 dark:border-red-800/40 text-xs">
                <div class="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Reason on file</div>
                <div class="text-red-900 dark:text-red-100 italic">"${user.deletion_request_reason || 'No reason provided.'}"</div>
              </div>
              <div class="flex flex-col sm:flex-row gap-2 pt-2">
                <button onclick="actions.cancelAccountDeletion()" class="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 text-white text-xs font-extrabold shadow-md transition-all flex items-center justify-center space-x-2">
                  <i class="fa-solid fa-rotate-left"></i>
                  <span>Cancel Deletion Request</span>
                </button>
                <button onclick="actions.guardView('${backView}')" class="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all">
                  Go Back
                </button>
              </div>
            </div>
          ` : `
            <div class="space-y-3">
              <div>
                <label class="text-xs font-bold text-red-800 dark:text-red-300 mb-1 block">
                  Why are you leaving? (Optional, kept private)
                </label>
                <textarea id="deletionReason" rows="3" oninput="actions.setDeletionReason(this.value)" placeholder="e.g. Switched to a different platform, closing my farm, etc." class="w-full p-3 rounded-xl border border-red-300 dark:border-red-800/60 bg-white dark:bg-slate-900 text-xs font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-red-500">${state.deletionReasonText || ''}</textarea>
              </div>
              <div class="p-3 rounded-xl bg-white/60 dark:bg-slate-900/40 border border-red-200/60 dark:border-red-800/40 text-[11px] text-red-900 dark:text-red-200">
                <div class="flex items-center space-x-2 font-extrabold mb-1">
                  <i class="fa-solid fa-clock"></i>
                  <span>14-day grace window</span>
                </div>
                <p>Once you submit this request, your account enters a 14-day cooling-off period. During this time you can sign back in and cancel the request. If you do not cancel, an Agrein administrator will review and approve the permanent deletion.</p>
              </div>
              <button onclick="actions.requestAccountDeletion(document.getElementById('deletionReason').value)" ${state.deletionSubmitting ? 'disabled' : ''} class="w-full py-3 rounded-xl bg-gradient-to-r from-red-700 to-red-900 hover:from-red-800 hover:to-red-950 disabled:opacity-60 text-white text-xs font-extrabold shadow-lg transition-all flex items-center justify-center space-x-2">
                <i class="fa-solid fa-trash-can"></i>
                <span>${state.deletionSubmitting ? 'Submitting…' : 'Request Account Deletion'}</span>
              </button>
            </div>
          `}
        </div>

      </div>
    </section>
  `;
}
