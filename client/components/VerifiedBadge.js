// Verified Farmer Badge Component for Agrein
// Displays the badge ONLY for approved/verified farmers

function renderVerifiedBadge(isVerified, customClass = '') {
  if (!isVerified) return '';

  return `
    <span class="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold shadow-sm border border-emerald-500/20 ${customClass}">
      <i class="fa-solid fa-circle-check text-emerald-500"></i>
      <span>Agrein Verified Farmer</span>
    </span>
  `;
}

// Compact version for product cards and inline use
function renderVerifiedBadgeCompact(isVerified, customClass = '') {
  if (!isVerified) return '';

  return `
    <span class="inline-flex items-center space-x-0.5 text-emerald-500 ${customClass}" title="Agrein Verified Farmer">
      <i class="fa-solid fa-circle-check text-[11px]"></i>
    </span>
  `;
}

// Small pill version for storefront and order info
function renderVerifiedBadgePill(isVerified, customClass = '') {
  if (!isVerified) return '';

  return `
    <span class="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[9px] font-extrabold border border-emerald-200 dark:border-emerald-800/30 ${customClass}">
      <i class="fa-solid fa-circle-check"></i>
      <span>Verified</span>
    </span>
  `;
}
