// Agricultural Community Forum Component for Agrein

function renderCommunityForum(state, actions) {
  const { forumPosts } = state.mockData;

  return `
    <div class="py-12 bg-slate-50/50 dark:bg-slate-900/50 min-h-screen space-y-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <!-- Header -->
        <div class="glass-card rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-l-8 border-l-purple-600">
          <div>
            <div class="inline-flex items-center space-x-2 text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-1">
              <i class="fa-solid fa-comments"></i>
              <span>Agrein Farmer Social Network & Q&A</span>
            </div>
            <h1 class="text-3xl font-heading font-extrabold text-slate-900 dark:text-white">
              Agricultural Community Forum
            </h1>
            <p class="text-xs text-gray-500">Ask questions, share pest control remedies, discuss Interswitch payout speeds, and connect with agronomy experts.</p>
          </div>

          <button onclick="actions.triggerToast('New discussion post modal opened...')" class="px-6 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-lg flex items-center space-x-2">
            <i class="fa-solid fa-plus text-amber-300"></i>
            <span>Start Discussion Post</span>
          </button>
        </div>

        <!-- Forum Channel Tags -->
        <div class="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          ${['🔥 Trending', '🌾 Maize & Cereals', '🥔 Yam & Tubers', '🐛 Pest Control', '💰 Interswitch Payouts', '🌧️ Weather Seeding', '📢 General Discussions'].map((tag, idx) => `
            <button onclick="actions.triggerToast('Filter forum channel: ${tag}')" class="px-4 py-2 rounded-2xl text-xs font-bold flex-shrink-0 transition-all ${idx === 0 ? 'bg-purple-600 text-white shadow-md' : 'glass-panel text-gray-700 dark:text-gray-300 hover:bg-purple-50'}">
              <span>${tag}</span>
            </button>
          `).join('')}
        </div>

        <!-- Forum Posts List -->
        <div class="space-y-4">
          ${forumPosts.map(post => `
            <div class="glass-card rounded-3xl p-6 space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-9 h-9 rounded-full bg-purple-700 text-white font-bold flex items-center justify-center text-xs">
                    ${post.author.charAt(0)}
                  </div>
                  <div>
                    <div class="font-bold text-xs text-slate-900 dark:text-white">${post.author} <span class="text-[10px] text-gray-400 font-normal">(${post.state})</span></div>
                    <div class="text-[10px] text-gray-400">${post.time} • in <strong class="text-purple-600">${post.category}</strong></div>
                  </div>
                </div>
                <span class="px-2.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 text-[10px] font-bold">Q&A</span>
              </div>

              <h3 class="font-heading font-extrabold text-base text-slate-900 dark:text-white">${post.title}</h3>
              <p class="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">${post.content}</p>

              <div class="pt-2 flex items-center justify-between border-t border-gray-100 dark:border-slate-800 text-xs">
                <div class="flex items-center space-x-4">
                  <button onclick="actions.triggerToast('Upvoted discussion!')" class="flex items-center space-x-1 text-gray-500 hover:text-purple-600 font-bold">
                    <i class="fa-solid fa-thumbs-up"></i>
                    <span>${post.upvotes} Upvotes</span>
                  </button>
                  <button onclick="actions.triggerToast('Viewing ${post.replies} replies')" class="flex items-center space-x-1 text-gray-500 hover:text-purple-600 font-bold">
                    <i class="fa-regular fa-comment-dots"></i>
                    <span>${post.replies} Replies</span>
                  </button>
                </div>
                <button onclick="actions.triggerToast('Replying to post')" class="px-3 py-1 rounded-lg bg-purple-100 dark:bg-slate-800 text-purple-800 dark:text-purple-300 text-xs font-bold">Reply</button>
              </div>
            </div>
          `).join('')}
        </div>

      </div>
    </div>
  `;
}
