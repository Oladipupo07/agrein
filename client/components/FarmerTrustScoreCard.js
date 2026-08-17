// Farmer Trust Score Breakdown Widget Component

function renderFarmerTrustScoreCard(trustScoreData = {}) {
  const score = trustScoreData.score || 94;
  const rating = trustScoreData.star_rating || 4.9;
  const orderCompletion = trustScoreData.order_completion_rate || 98.5;
  const deliverySpeed = trustScoreData.delivery_speed_score || 95;
  const reviewCount = trustScoreData.review_count || 38;

  return `
    <div class="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-emerald-950 text-white shadow-xl border border-emerald-500/20 space-y-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 rounded-xl bg-amber-400 text-slate-900 font-extrabold flex items-center justify-center text-sm shadow">
            <i class="fa-solid fa-shield-halved"></i>
          </div>
          <div>
            <div class="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">Agrein Trust Score</div>
            <div class="text-xs text-gray-300">Transparent Platform Verification</div>
          </div>
        </div>

        <div class="text-right">
          <div class="text-2xl font-heading font-extrabold text-amber-300">${score} <span class="text-xs text-gray-300 font-normal">/ 100</span></div>
          <div class="text-[10px] text-amber-400 font-bold">★★★★★ (${rating})</div>
        </div>
      </div>

      <!-- Factors Breakdown -->
      <div class="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center text-[10px]">
        <div class="p-2 rounded-xl bg-white/5">
          <div class="font-bold text-emerald-300">${orderCompletion}%</div>
          <div class="text-gray-400 text-[9px]">Order Success</div>
        </div>
        <div class="p-2 rounded-xl bg-white/5">
          <div class="font-bold text-amber-300">${deliverySpeed}%</div>
          <div class="text-gray-400 text-[9px]">On-Time Delivery</div>
        </div>
        <div class="p-2 rounded-xl bg-white/5">
          <div class="font-bold text-emerald-300">0%</div>
          <div class="text-gray-400 text-[9px]">Dispute Rate</div>
        </div>
      </div>
    </div>
  `;
}
