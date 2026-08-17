// Buyer-Farmer Direct Chat Drawer Component for Agrein

function renderChatDrawer(state, actions) {
  const { chatActive, chatRecipient, chatMessages, chatInputText } = state;
  if (!chatActive) return '';

  return `
    <div class="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div class="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col justify-between border-l border-emerald-500/20 animate-modal">
        
        <!-- Header -->
        <div class="p-4 glass-panel flex items-center justify-between border-b border-gray-200 dark:border-slate-800">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-full bg-emerald-700 text-white font-extrabold flex items-center justify-center text-sm shadow-md">
              ${chatRecipient.charAt(0)}
            </div>
            <div>
              <div class="font-bold text-xs text-slate-900 dark:text-white flex items-center space-x-1">
                <span>${chatRecipient}</span>
                <i class="fa-solid fa-circle-check text-emerald-500 text-[10px]"></i>
              </div>
              <div class="text-[10px] text-gray-500">Agrein Direct Message • Online</div>
            </div>
          </div>

          <button onclick="actions.closeChatDrawer()" class="text-gray-400 hover:text-slate-900 dark:hover:text-white p-2">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <!-- Messages Area -->
        <div class="p-4 flex-1 overflow-y-auto space-y-3 text-xs">
          ${chatMessages.map(msg => `
            <div class="flex flex-col ${msg.sender === 'you' ? 'items-end' : 'items-start'} space-y-1">
              <div class="px-4 py-2.5 rounded-2xl max-w-[85%] ${msg.sender === 'you' ? 'bg-emerald-700 text-white rounded-br-none' : 'bg-gray-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-none'}">
                ${msg.text}
              </div>
              <span class="text-[9px] text-gray-400 px-1">${msg.time}</span>
            </div>
          `).join('')}
        </div>

        <!-- Input Box -->
        <div class="p-4 glass-panel border-t border-gray-200 dark:border-slate-800 flex items-center space-x-2">
          <input type="text" value="${chatInputText}" oninput="actions.setChatInputText(this.value)" onkeypress="if(event.key === 'Enter') actions.sendChatMessage()" placeholder="Type inquiry to farmer..." class="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
          <button onclick="actions.sendChatMessage()" class="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center text-sm shadow-md">
            <i class="fa-solid fa-paper-plane"></i>
          </button>
        </div>

      </div>
    </div>
  `;
}
