// Buyer-Farmer Direct Chat & AgriBot 24/7 AI Support Drawer for Agrein

function renderChatDrawer(state, actions) {
  const { chatActive, chatRecipient, chatMessages, chatInputText, chatIsBotTyping } = state;
  if (!chatActive) return '';

  const isAiSupport = !chatRecipient || chatRecipient.toLowerCase().includes('support') || chatRecipient.toLowerCase().includes('agribot') || chatRecipient.toLowerCase().includes('ai');

  const suggestions = [
    'How does Escrow Protection work?',
    'What do I need for Farmer Verification?',
    'How do I track my delivery?',
    'How do I file a dispute for damaged produce?'
  ];

  // Helper to format basic markdown (bold, lists, code) into clean HTML
  const formatMessageText = (text) => {
    if (!text) return '';
    return text
      .replace(/^### (.*$)/gim, '<div class="font-extrabold text-sm text-emerald-600 dark:text-emerald-400 mb-1">$1</div>')
      .replace(/^## (.*$)/gim, '<div class="font-extrabold text-sm text-emerald-600 dark:text-emerald-400 mb-1">$1</div>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^\• (.*$)/gim, '<div class="flex items-start space-x-1.5 ml-1 my-0.5"><span class="text-emerald-500 font-bold">•</span><span>$1</span></div>')
      .replace(/^(?:\d+\.)\s(.*$)/gim, '<div class="flex items-start space-x-1.5 ml-1 my-0.5"><span class="text-emerald-500 font-bold">✓</span><span>$1</span></div>')
      .replace(/\n/g, '<br>');
  };

  return `
    <div class="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div class="w-full max-w-lg bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col justify-between border-l border-emerald-500/30 animate-modal">
        
        <!-- Header -->
        <div class="p-4 bg-gradient-to-r from-emerald-800 to-emerald-950 text-white flex items-center justify-between shadow-md">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-2xl ${isAiSupport ? 'bg-gradient-to-tr from-amber-400 to-emerald-400 text-slate-950 shadow-lg shadow-amber-400/20' : 'bg-emerald-600 text-white'} flex items-center justify-center text-base font-black flex-shrink-0">
              ${isAiSupport ? '<i class="fa-solid fa-robot text-lg"></i>' : (chatRecipient || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <div class="font-extrabold text-xs flex items-center space-x-1.5">
                <span>${isAiSupport ? 'AgriBot AI Support' : chatRecipient}</span>
                ${isAiSupport ? `
                  <span class="px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 text-[9px] font-black tracking-wider uppercase">24/7 Live AI</span>
                ` : `
                  <i class="fa-solid fa-circle-check text-emerald-400 text-[10px]"></i>
                `}
              </div>
              <div class="text-[10px] text-emerald-200/80 flex items-center space-x-1">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block"></span>
                <span>${isAiSupport ? 'Official Agrein Customer Support' : 'Direct Message'}</span>
              </div>
            </div>
          </div>

          <div class="flex items-center space-x-2">
            ${isAiSupport ? `
              <button onclick="actions.clearAiChatHistory()" title="Clear Chat" class="text-emerald-200 hover:text-white p-1.5 text-xs rounded-lg hover:bg-emerald-700/50 transition-all">
                <i class="fa-solid fa-rotate-right"></i>
              </button>
            ` : ''}
            <button onclick="actions.closeChatDrawer()" class="text-emerald-200 hover:text-white p-2 rounded-xl hover:bg-emerald-700/50 transition-all">
              <i class="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>
        </div>

        <!-- Messages Area -->
        <div id="chatMessagesContainer" class="p-4 flex-1 overflow-y-auto space-y-3.5 text-xs bg-slate-50/50 dark:bg-slate-950/50">
          
          <!-- AI Welcome Card if new chat -->
          ${isAiSupport && chatMessages.length === 0 ? `
            <div class="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-emerald-500/20 shadow-sm space-y-2.5">
              <div class="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs">
                <i class="fa-solid fa-sparkles"></i>
                <span>Welcome to Agrein 24/7 AI Support!</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-[11px] leading-relaxed">
                I am **AgriBot**, trained on Agrein's platform policies, escrow protection, KYC verification, and smart logistics. How may I assist you today?
              </p>
            </div>
          ` : ''}

          <!-- Message bubbles -->
          ${chatMessages.map(msg => `
            <div class="flex flex-col ${msg.sender === 'you' ? 'items-end' : 'items-start'} space-y-1">
              <div class="flex items-end space-x-1.5 max-w-[88%]">
                ${msg.sender !== 'you' ? `
                  <div class="w-6 h-6 rounded-full bg-emerald-700 text-white text-[10px] flex items-center justify-center flex-shrink-0 mb-1">
                    <i class="fa-solid ${isAiSupport ? 'fa-robot' : 'fa-user'}"></i>
                  </div>
                ` : ''}
                <div class="px-4 py-3 rounded-2xl shadow-sm text-xs leading-relaxed ${
                  msg.sender === 'you'
                    ? 'bg-emerald-700 text-white rounded-br-none'
                    : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-gray-100 border border-gray-200/80 dark:border-slate-700 rounded-bl-none'
                }">
                  ${msg.sender === 'you' ? msg.text : formatMessageText(msg.text)}
                </div>
              </div>
              <span class="text-[9px] text-gray-400 px-2">${msg.time || 'Just now'}</span>
            </div>
          `).join('')}

          <!-- Typing Indicator -->
          ${chatIsBotTyping ? `
            <div class="flex items-end space-x-1.5 max-w-[85%]">
              <div class="w-6 h-6 rounded-full bg-emerald-700 text-white text-[10px] flex items-center justify-center flex-shrink-0">
                <i class="fa-solid fa-robot"></i>
              </div>
              <div class="px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-slate-500 dark:text-gray-400 rounded-bl-none flex items-center space-x-1.5">
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"></span>
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style="animation-delay: 0.2s"></span>
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style="animation-delay: 0.4s"></span>
                <span class="text-[10px] font-bold text-gray-400 ml-1">AgriBot is typing...</span>
              </div>
            </div>
          ` : ''}
        </div>

        <!-- Quick Suggestion Chips (for AI Mode) -->
        ${isAiSupport ? `
          <div class="px-4 py-2 bg-slate-100/80 dark:bg-slate-800/80 border-t border-gray-200 dark:border-slate-700 overflow-x-auto flex items-center space-x-2">
            ${suggestions.map(s => `
              <button onclick="actions.sendSuggestedPrompt('${s.replace(/'/g, "\\'")}')"
                      class="px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 hover:border-emerald-500 text-slate-800 dark:text-gray-200 text-[10px] font-bold whitespace-nowrap shadow-sm hover:scale-105 transition-all flex items-center space-x-1">
                <i class="fa-solid fa-message text-emerald-500 text-[9px]"></i>
                <span>${s}</span>
              </button>
            `).join('')}
          </div>
        ` : ''}

        <!-- Input Box -->
        <div class="p-4 glass-panel border-t border-gray-200 dark:border-slate-800 flex items-center space-x-2 bg-white dark:bg-slate-900">
          <input type="text"
                 value="${chatInputText || ''}"
                 oninput="actions.setChatInputText(this.value)"
                 onkeydown="if(event.key === 'Enter') actions.sendChatMessage()"
                 placeholder="${isAiSupport ? 'Ask AgriBot anything about Agrein...' : 'Type message...'}"
                 class="flex-1 px-4 py-3 rounded-2xl border border-gray-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner">
          
          <button onclick="actions.sendChatMessage()"
                  class="w-11 h-11 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center text-sm shadow-lg shadow-emerald-700/20 transition-all active:scale-95 flex-shrink-0">
            <i class="fa-solid fa-paper-plane"></i>
          </button>
        </div>

      </div>
    </div>
  `;
}
