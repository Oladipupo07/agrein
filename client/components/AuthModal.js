// Authentication Modal Component for Agrein — Registration, Login & Email OTP Verification

function renderAuthModal(state, actions) {
  if (!state.authModalActive) return '';

  const mode = state.authModalMode || 'login'; // 'login', 'register', 'verify-otp', 'forgot-password', 'forgot-password-reset'
  const isLogin = mode === 'login';
  const isOtpView = mode === 'verify-otp';
  const isForgotEmail = mode === 'forgot-password';
  const isForgotReset = mode === 'forgot-password-reset';
  const selectedRole = state.authRegisterRole || 'BUYER';
  const email = state.otpEmail || 'user@example.com';

  return `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div class="modal-fullscreen-mobile relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-emerald-500/20 overflow-hidden animate-modal max-h-[92vh] overflow-y-auto">
        
        <!-- Close -->
        <button onclick="actions.closeAuthModal()" class="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-gray-300 flex items-center justify-center hover:bg-slate-300 transition-all">
          <i class="fa-solid fa-xmark text-sm"></i>
        </button>

        <!-- Header -->
        <div class="bg-gradient-to-r from-emerald-800 to-emerald-900 p-6 text-white text-center">
          <div class="w-12 h-12 rounded-2xl bg-white/20 mx-auto flex items-center justify-center mb-3">
            <i class="fa-solid ${isOtpView ? 'fa-envelope-circle-check' : (isForgotEmail ? 'fa-key' : (isForgotReset ? 'fa-lock' : (isLogin ? 'fa-right-to-bracket' : 'fa-user-plus')))} text-xl text-amber-300"></i>
          </div>
          <h2 class="text-xl font-heading font-extrabold">
            ${isOtpView ? 'Verify Your Email' : (isForgotEmail ? 'Reset Your Password' : (isForgotReset ? 'Set a New Password' : (isLogin ? 'Welcome Back to Agrein' : 'Create your Agrein Account')))}
          </h2>
          <p class="text-xs text-emerald-200 mt-1">
            ${isOtpView ? `We've sent a 6-digit verification code to <strong class="text-amber-300">${email}</strong>.` : (isForgotEmail ? 'Enter your email and we will send a 6-digit reset code' : (isForgotReset ? `Email verified. Choose a new password for <strong class="text-amber-300">${email}</strong>.` : (isLogin ? 'Log in to access your marketplace' : 'Join Africa\'s trusted agricultural marketplace')))}
          </p>
        </div>

        <!-- Body -->
        <div class="p-6 space-y-4">

          ${isForgotReset ? `
            <!-- ═══ FORGOT PASSWORD — NEW PASSWORD ENTRY ═══ -->
            <div class="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 flex items-center space-x-2.5 text-xs text-emerald-700 dark:text-emerald-300">
              <i class="fa-solid fa-circle-check text-emerald-600"></i>
              <span>Email verified. Choose a new password below.</span>
            </div>

            <div>
              <label class="text-xs font-bold text-gray-500 dark:text-gray-400">New Password *</label>
              <div class="relative mt-1">
                <input type="password" id="resetNewPassword" placeholder="••••••••"
                       oninput="actions.checkPasswordRequirements(this.value, 'reset')"
                       class="w-full pl-4 pr-11 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none">
                <button type="button" onclick="actions.togglePasswordVisibility('resetNewPassword', 'resetNewPasswordEye')" class="absolute right-3 top-2.5 text-gray-400 hover:text-emerald-600 transition-colors p-1" title="Toggle password visibility">
                  <i id="resetNewPasswordEye" class="fa-solid fa-eye text-xs"></i>
                </button>
              </div>
            </div>

            <!-- Password Security Checklist -->
            <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 space-y-1.5 text-[11px]">
              <div class="font-bold text-gray-600 dark:text-gray-300 mb-1">Password Requirements:</div>
              <div id="reset_req_len" class="flex items-center space-x-1.5 text-gray-500 transition-all"><i id="reset_ico_len" class="fa-regular fa-circle text-gray-400"></i><span>At least 8 characters long</span></div>
              <div id="reset_req_upper" class="flex items-center space-x-1.5 text-gray-500 transition-all"><i id="reset_ico_upper" class="fa-regular fa-circle text-gray-400"></i><span>At least 1 Uppercase letter (A-Z)</span></div>
              <div id="reset_req_lower" class="flex items-center space-x-1.5 text-gray-500 transition-all"><i id="reset_ico_lower" class="fa-regular fa-circle text-gray-400"></i><span>At least 1 Lowercase letter (a-z)</span></div>
              <div id="reset_req_num" class="flex items-center space-x-1.5 text-gray-500 transition-all"><i id="reset_ico_num" class="fa-regular fa-circle text-gray-400"></i><span>At least 1 Number (0-9)</span></div>
              <div id="reset_req_special" class="flex items-center space-x-1.5 text-gray-500 transition-all"><i id="reset_ico_special" class="fa-regular fa-circle text-gray-400"></i><span>At least 1 Special character (!@#$%^&*)</span></div>
            </div>

            <div>
              <label class="text-xs font-bold text-gray-500 dark:text-gray-400">Confirm New Password *</label>
              <div class="relative mt-1">
                <input type="password" id="resetConfirmPassword" placeholder="••••••••"
                       class="w-full pl-4 pr-11 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none">
                <button type="button" onclick="actions.togglePasswordVisibility('resetConfirmPassword', 'resetConfirmPasswordEye')" class="absolute right-3 top-2.5 text-gray-400 hover:text-emerald-600 transition-colors p-1" title="Toggle password visibility">
                  <i id="resetConfirmPasswordEye" class="fa-solid fa-eye text-xs"></i>
                </button>
              </div>
            </div>

            <button onclick="actions.submitPasswordReset()" class="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-700 to-emerald-900 text-white font-extrabold text-xs shadow-xl hover:shadow-2xl transition-all flex items-center justify-center space-x-2">
              <i class="fa-solid fa-shield-check text-amber-300"></i>
              <span>Reset Password</span>
            </button>

            <div class="text-center pt-2 border-t border-gray-100 dark:border-slate-800">
              <button onclick="actions.openAuthModal('login')" class="text-xs text-gray-500 hover:text-emerald-600 font-bold">Back to Login</button>
            </div>
          ` : isForgotEmail ? `
            <!-- ═══ FORGOT PASSWORD — EMAIL ENTRY ═══ -->
            <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 flex items-center space-x-2.5 text-xs text-gray-600 dark:text-gray-300">
              <i class="fa-solid fa-circle-info text-emerald-600"></i>
              <span>Enter the email on your Agrein account and we'll send a 6-digit reset code.</span>
            </div>

            <div>
              <label class="text-xs font-bold text-gray-500 dark:text-gray-400">Email Address *</label>
              <input type="email" id="forgotEmail" placeholder="you@example.com" class="w-full mt-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none">
            </div>

            <button onclick="actions.requestPasswordReset()" class="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-700 to-emerald-900 text-white font-extrabold text-xs shadow-xl hover:shadow-2xl transition-all flex items-center justify-center space-x-2">
              <i class="fa-solid fa-paper-plane text-amber-300"></i>
              <span>Send Reset Code</span>
            </button>

            <div class="text-center pt-2 border-t border-gray-100 dark:border-slate-800">
              <button onclick="actions.openAuthModal('login')" class="text-xs text-gray-500 hover:text-emerald-600 font-bold">Back to Login</button>
            </div>
          ` : (isOtpView ? `
            ${state.otpSuccess ? `
              <div class="text-center py-6 space-y-4 animate-fade-in">
                <div class="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 text-3xl flex items-center justify-center mx-auto animate-bounce">
                  <i class="fa-solid fa-circle-check"></i>
                </div>
                <h3 class="text-xl font-heading font-extrabold text-slate-900 dark:text-white">✓ Email Verified Successfully</h3>
                <p class="text-xs text-gray-500">Your email address has been confirmed. Redirecting to your account portal...</p>
              </div>
            ` : `
              <!-- Security Notice -->
              <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 flex items-center space-x-2.5 text-xs text-gray-600 dark:text-gray-300">
                <i class="fa-solid fa-lock text-emerald-600"></i>
                <span>Please check your inbox or spam folder for your 6-digit security code.</span>
              </div>

              <!-- Error Banner -->
              ${state.otpError ? `
                <div class="p-3 rounded-xl bg-red-100 dark:bg-red-950/50 border border-red-300 text-red-700 dark:text-red-300 text-xs font-bold flex items-center space-x-2">
                  <i class="fa-solid fa-triangle-exclamation"></i>
                  <span>${state.otpError}</span>
                </div>
              ` : ''}

              <!-- 6 Individual Digit Input Boxes -->
              <div class="space-y-2">
                <label class="text-xs font-bold text-gray-500 dark:text-gray-400 block text-center">Enter 6-Digit Verification Code</label>
                <div class="flex justify-center items-center space-x-2">
                  ${[0, 1, 2, 3, 4, 5].map(idx => `
                    <input type="text" maxlength="1" id="otpDigit_${idx}"
                           value="${(state.otpDigits || [])[idx] || ''}"
                           oninput="actions.handleOtpDigitInput(event, ${idx})"
                           onkeydown="actions.handleOtpKeyDown(event, ${idx})"
                           onfocus="this.select()"
                           class="w-11 h-12 text-center text-lg font-mono font-extrabold rounded-xl border border-gray-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm">
                  `).join('')}
                </div>
              </div>

              <!-- Expiration & Resend Cooldown Controls -->
              <div class="flex items-center justify-between text-xs text-gray-500 pt-2">
                <div class="flex items-center space-x-1.5 font-medium">
                  <i class="fa-regular fa-clock text-emerald-600"></i>
                  <span>Code expires in <strong class="otp-timer-display text-slate-900 dark:text-white font-mono font-bold">${actions.formatOtpTimer(state.otpTimerSeconds || 300)}</strong></span>
                </div>
                ${state.otpCooldownSeconds > 0 ? `
                  <span class="otp-cooldown-display text-[11px] text-gray-400 font-semibold">Resend in ${state.otpCooldownSeconds}s</span>
                ` : `
                  <button onclick="actions.resendEmailOtp()" class="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center space-x-1">
                    <i class="fa-solid fa-rotate-right text-[10px]"></i>
                    <span>Resend Code</span>
                  </button>
                `}
              </div>

              <!-- Submit Verification Button -->
              <button onclick="actions.submitOtpVerification()" class="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-700 to-emerald-900 text-white font-extrabold text-xs shadow-xl hover:shadow-2xl transition-all flex items-center justify-center space-x-2">
                <i class="fa-solid fa-shield-check text-amber-300"></i>
                <span>Verify Email</span>
              </button>

              <div class="text-center pt-2 border-t border-gray-100 dark:border-slate-800">
                <button onclick="actions.openAuthModal('login')" class="text-xs text-gray-500 hover:text-emerald-600 font-bold">Back to Login</button>
              </div>
            `}
          ` : `
            <!-- ═══ REGISTRATION & LOGIN FORM ═══ -->
            ${!isLogin ? `
              <!-- Account Type Selector -->
              <div>
                <label class="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 block">Account Type</label>
                <div class="grid grid-cols-2 gap-2">
                  <button onclick="actions.setAuthRegisterRole('BUYER')" class="p-3 rounded-2xl border-2 transition-all text-center ${selectedRole === 'BUYER' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30' : 'border-gray-200 dark:border-slate-700'}">
                    <i class="fa-solid fa-cart-shopping text-lg ${selectedRole === 'BUYER' ? 'text-emerald-600' : 'text-gray-400'}"></i>
                    <div class="text-xs font-bold mt-1 ${selectedRole === 'BUYER' ? 'text-emerald-700 dark:text-emerald-300' : 'text-gray-500'}">Buyer</div>
                    <div class="text-[10px] text-gray-400">Purchase produce</div>
                  </button>
                  <button onclick="actions.setAuthRegisterRole('FARMER')" class="p-3 rounded-2xl border-2 transition-all text-center ${selectedRole === 'FARMER' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30' : 'border-gray-200 dark:border-slate-700'}">
                    <i class="fa-solid fa-tractor text-lg ${selectedRole === 'FARMER' ? 'text-emerald-600' : 'text-gray-400'}"></i>
                    <div class="text-xs font-bold mt-1 ${selectedRole === 'FARMER' ? 'text-emerald-700 dark:text-emerald-300' : 'text-gray-500'}">Farmer</div>
                    <div class="text-[10px] text-gray-400">Sell your harvest</div>
                  </button>
                </div>
              </div>

              <!-- First Name & Last Name -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label class="text-xs font-bold text-gray-500 dark:text-gray-400">First Name *</label>
                  <input type="text" id="regFirstName" placeholder="Ibrahim" class="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none">
                </div>
                <div>
                  <label class="text-xs font-bold text-gray-500 dark:text-gray-400">Last Name *</label>
                  <input type="text" id="regLastName" placeholder="Bello" class="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none">
                </div>
              </div>
            ` : ''}

            <!-- Email -->
            <div>
              <label class="text-xs font-bold text-gray-500 dark:text-gray-400">Email Address *</label>
              <input type="email" id="authEmail" placeholder="you@example.com" class="w-full mt-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none">
            </div>

            ${!isLogin ? `
              <!-- Phone Number (Strictly Digits Only) -->
              <div>
                <label class="text-xs font-bold text-gray-500 dark:text-gray-400">Phone Number *</label>
                <div class="relative mt-1">
                  <input type="tel" id="regPhone" pattern="[0-9]*" inputmode="numeric" oninput="this.value = this.value.replace(/[^0-9]/g, '')" placeholder="08034567890" class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none">
                  <i class="fa-solid fa-phone absolute left-3 top-3 text-gray-400 text-xs"></i>
                </div>
              </div>
            ` : ''}

            <!-- Password with Show/Hide Eye Toggle -->
            <div>
              <label class="text-xs font-bold text-gray-500 dark:text-gray-400">Password *</label>
              <div class="relative mt-1">
                <input type="password" id="authPassword" placeholder="••••••••"
                       ${!isLogin ? 'oninput="actions.checkPasswordRequirements(this.value, \'reg\')"' : ''}
                       class="w-full pl-4 pr-11 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none">
                <button type="button" onclick="actions.togglePasswordVisibility('authPassword', 'authPasswordEye')" class="absolute right-3 top-2.5 text-gray-400 hover:text-emerald-600 transition-colors p-1" title="Toggle password visibility">
                  <i id="authPasswordEye" class="fa-solid fa-eye text-xs"></i>
                </button>
              </div>
            </div>

            ${!isLogin ? `
              <!-- Interactive Real-Time Password Security Checklist -->
              <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 space-y-1.5 text-[11px]">
                <div class="font-bold text-gray-600 dark:text-gray-300 mb-1">Password Requirements:</div>
                <div id="reg_req_len" class="flex items-center space-x-1.5 text-gray-500 transition-all"><i id="reg_ico_len" class="fa-regular fa-circle text-gray-400"></i><span>At least 8 characters long</span></div>
                <div id="reg_req_upper" class="flex items-center space-x-1.5 text-gray-500 transition-all"><i id="reg_ico_upper" class="fa-regular fa-circle text-gray-400"></i><span>At least 1 Uppercase letter (A-Z)</span></div>
                <div id="reg_req_lower" class="flex items-center space-x-1.5 text-gray-500 transition-all"><i id="reg_ico_lower" class="fa-regular fa-circle text-gray-400"></i><span>At least 1 Lowercase letter (a-z)</span></div>
                <div id="reg_req_num" class="flex items-center space-x-1.5 text-gray-500 transition-all"><i id="reg_ico_num" class="fa-regular fa-circle text-gray-400"></i><span>At least 1 Number (0-9)</span></div>
                <div id="reg_req_special" class="flex items-center space-x-1.5 text-gray-500 transition-all"><i id="reg_ico_special" class="fa-regular fa-circle text-gray-400"></i><span>At least 1 Special character (!@#$%^&*)</span></div>
              </div>

              <!-- Confirm Password with Show/Hide Eye Toggle -->
              <div>
                <label class="text-xs font-bold text-gray-500 dark:text-gray-400">Confirm Password *</label>
                <div class="relative mt-1">
                  <input type="password" id="regConfirmPassword" placeholder="••••••••" class="w-full pl-4 pr-11 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none">
                  <button type="button" onclick="actions.togglePasswordVisibility('regConfirmPassword', 'regConfirmPasswordEye')" class="absolute right-3 top-2.5 text-gray-400 hover:text-emerald-600 transition-colors p-1" title="Toggle password visibility">
                    <i id="regConfirmPasswordEye" class="fa-solid fa-eye text-xs"></i>
                  </button>
                </div>
              </div>
            ` : ''}

            <!-- Submit Button -->
            <button onclick="actions.validateAndSubmitAuth('${isLogin ? 'login' : 'register'}', '${selectedRole}')" class="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-700 to-emerald-900 text-white font-extrabold text-xs shadow-xl hover:shadow-2xl transition-all flex items-center justify-center space-x-2">
              <i class="fa-solid ${isLogin ? 'fa-right-to-bracket' : 'fa-user-plus'} text-amber-300"></i>
              <span>${isLogin ? 'Log In' : 'Create Account'}</span>
            </button>

            ${isLogin ? `
              <div class="text-center">
                <button onclick="actions.openAuthModal('forgot-password')" class="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline">Forgot Password?</button>
              </div>
            ` : ''}

            <!-- Toggle Mode -->
            <div class="text-center pt-2 border-t border-gray-100 dark:border-slate-800">
              <span class="text-xs text-gray-500">${isLogin ? "Don't have an account?" : 'Already have an account?'}</span>
              <button onclick="actions.toggleAuthMode()" class="text-xs text-emerald-600 dark:text-emerald-400 font-bold ml-1 hover:underline">
                ${isLogin ? 'Sign Up' : 'Log In'}
              </button>
            </div>
          `)}

        </div>
      </div>
    </div>
  `;
}
