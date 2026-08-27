// Change Password Modal — available from every portal after login
// Mirrors the style of BuyerDisputeModal / AdminActionModal so it matches the
// rest of the Agrein UI shell.

function renderChangePasswordModal(state, actions) {
  if (!state.changePasswordModalActive) return '';

  return `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in" onclick="if (event.target === this) actions.closeChangePasswordModal()">
      <div class="modal-fullscreen-mobile relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-emerald-500/20 overflow-hidden animate-modal">
        <button onclick="actions.closeChangePasswordModal()" class="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-gray-300 flex items-center justify-center hover:bg-slate-300 transition-all">
          <i class="fa-solid fa-xmark text-sm"></i>
        </button>

        <div class="bg-gradient-to-r from-emerald-800 to-emerald-900 p-6 text-white text-center">
          <div class="w-12 h-12 rounded-2xl bg-white/20 mx-auto flex items-center justify-center mb-3">
            <i class="fa-solid fa-lock text-xl text-amber-300"></i>
          </div>
          <h2 class="text-xl font-heading font-extrabold">Change Your Password</h2>
          <p class="text-xs text-emerald-200 mt-1">
            ${state.currentUser ? `Signed in as <strong class="text-amber-300">${state.currentUser.email}</strong>` : 'Update your Agrein account password.'}
          </p>
        </div>

        <div class="p-6 space-y-4">
          <div>
            <label class="text-xs font-bold text-gray-500 dark:text-gray-400">Current Password *</label>
            <div class="relative mt-1">
              <input type="password" id="currentPassword" placeholder="••••••••" class="w-full pl-4 pr-11 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none">
              <button type="button" onclick="actions.togglePasswordVisibility('currentPassword', 'currentPasswordEye')" class="absolute right-3 top-2.5 text-gray-400 hover:text-emerald-600 transition-colors p-1" title="Toggle password visibility">
                <i id="currentPasswordEye" class="fa-solid fa-eye text-xs"></i>
              </button>
            </div>
          </div>

          <div>
            <label class="text-xs font-bold text-gray-500 dark:text-gray-400">New Password *</label>
            <div class="relative mt-1">
              <input type="password" id="newPassword" placeholder="••••••••"
                     oninput="actions.checkPasswordRequirements(this.value, 'chg'); actions.checkPasswordMatch('newPassword', 'confirmNewPassword', 'chgConfirmMatchError');"
                     class="w-full pl-4 pr-11 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none">
              <button type="button" onclick="actions.togglePasswordVisibility('newPassword', 'newPasswordEye')" class="absolute right-3 top-2.5 text-gray-400 hover:text-emerald-600 transition-colors p-1" title="Toggle password visibility">
                <i id="newPasswordEye" class="fa-solid fa-eye text-xs"></i>
              </button>
            </div>
          </div>

          <div>
            <label class="text-xs font-bold text-gray-500 dark:text-gray-400">Confirm New Password *</label>
            <div class="relative mt-1">
              <input type="password" id="confirmNewPassword" placeholder="••••••••"
                     oninput="actions.checkPasswordMatch('newPassword', 'confirmNewPassword', 'chgConfirmMatchError')"
                     class="w-full pl-4 pr-11 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-colors">
              <button type="button" onclick="actions.togglePasswordVisibility('confirmNewPassword', 'confirmNewPasswordEye')" class="absolute right-3 top-2.5 text-gray-400 hover:text-emerald-600 transition-colors p-1" title="Toggle password visibility">
                <i id="confirmNewPasswordEye" class="fa-solid fa-eye text-xs"></i>
              </button>
            </div>
            <p id="chgConfirmMatchError" class="hidden mt-1.5 text-[11px] font-bold text-red-600 dark:text-red-400 flex items-center space-x-1.5">
              <i class="fa-solid fa-circle-xmark"></i>
              <span>Passwords do not match.</span>
            </p>
          </div>

          <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 space-y-1.5 text-[11px]">
            <div class="font-bold text-gray-600 dark:text-gray-300 mb-1">New Password Requirements:</div>
            <div id="chg_req_len" class="flex items-center space-x-1.5 text-gray-500 transition-all"><i id="chg_ico_len" class="fa-regular fa-circle text-gray-400"></i><span>At least 8 characters long</span></div>
            <div id="chg_req_upper" class="flex items-center space-x-1.5 text-gray-500 transition-all"><i id="chg_ico_upper" class="fa-regular fa-circle text-gray-400"></i><span>At least 1 Uppercase letter (A-Z)</span></div>
            <div id="chg_req_lower" class="flex items-center space-x-1.5 text-gray-500 transition-all"><i id="chg_ico_lower" class="fa-regular fa-circle text-gray-400"></i><span>At least 1 Lowercase letter (a-z)</span></div>
            <div id="chg_req_num" class="flex items-center space-x-1.5 text-gray-500 transition-all"><i id="chg_ico_num" class="fa-regular fa-circle text-gray-400"></i><span>At least 1 Number (0-9)</span></div>
            <div id="chg_req_special" class="flex items-center space-x-1.5 text-gray-500 transition-all"><i id="chg_ico_special" class="fa-regular fa-circle text-gray-400"></i><span>At least 1 Special character (!@#$%^&*)</span></div>
          </div>

          <div class="grid grid-cols-2 gap-3 pt-2">
            <button onclick="actions.closeChangePasswordModal()" class="py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 transition-all">Cancel</button>
            <button onclick="actions.submitChangePassword(document.getElementById('currentPassword').value, document.getElementById('newPassword').value, document.getElementById('confirmNewPassword').value)" class="py-2.5 rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-900 text-white text-xs font-extrabold shadow-md hover:opacity-90 transition-all flex items-center justify-center space-x-2">
              <i class="fa-solid fa-shield-halved text-amber-300"></i>
              <span>Update Password</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}