import React, { useState } from 'react';
import { Bot, Send, X, Sparkles, MessageSquare, ChevronRight, User, CornerDownLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
}

const PRESET_PROMPTS = [
  'How to prevent grain weevils in stored maize?',
  'Best organic remedy for tomato leaf blight?',
  'What is the ideal harvest time for Cassava?',
  'How to prepare cold-chain storage for fresh peppers?',
];

const KNOWLEDGE_BASE: Record<string, string> = {
  weevil: 'To prevent grain weevils in stored maize:\n1. Ensure moisture content is below 12% before bagging.\n2. Store in PICS (Perforated Inert Container Storage) triple-layer bags.\n3. Add dry Neem leaves or approved organic dust to deter pests.',
  blight: 'For tomato leaf blight treatment:\n1. Prune lower infected leaves to improve air circulation.\n2. Spray copper-based organic fungicide every 7 days.\n3. Avoid overhead watering to keep foliage dry.',
  cassava: 'Cassava reaches optimal maturity between 9 to 12 months after planting. Harvest when leaves turn yellow and begin to shed. Ensure roots are processed within 48 hours to prevent deterioration.',
  storage: 'For fresh peppers & leafy greens, pre-cool immediately after harvest using shade and evaporative cooling. Transport in ventilated crates lined with banana leaves if refrigeration is unavailable.',
  default: 'AgriBot AI Assistant recommends consulting local agricultural extension officers for specific soil testing. Key harvest guidelines: keep moisture levels controlled, handle produce gently during transit, and list your crops early on Agrein for direct buyer pickup!',
};

export const AgriBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: 'Hello! I am AgriBot, your Agrein AI Farming Assistant. Ask me anything about crop protection, pest management, harvest preservation, or market advice!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');

    // Simulate AI response logic
    setTimeout(() => {
      let botResponse = KNOWLEDGE_BASE.default;
      const qLower = query.toLowerCase();

      if (qLower.includes('weevil') || qLower.includes('maize') || qLower.includes('grain')) {
        botResponse = KNOWLEDGE_BASE.weevil;
      } else if (qLower.includes('blight') || qLower.includes('tomato') || qLower.includes('disease')) {
        botResponse = KNOWLEDGE_BASE.blight;
      } else if (qLower.includes('cassava') || qLower.includes('harvest')) {
        botResponse = KNOWLEDGE_BASE.cassava;
      } else if (qLower.includes('pepper') || qLower.includes('cool') || qLower.includes('storage')) {
        botResponse = KNOWLEDGE_BASE.storage;
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: botResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 600);
  };

  return (
    <>
      {/* Floating Action Launcher Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white p-4 rounded-full shadow-2xl flex items-center gap-2 border border-emerald-400/40 hover:scale-105 transition-all group"
      >
        <Sparkles className="w-6 h-6 text-amber-300 animate-spin" />
        <span className="font-semibold text-sm hidden sm:inline">Ask AgriBot AI</span>
      </button>

      {/* Slide-out Modal / Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-full max-w-md bg-emerald-950 border border-emerald-700/60 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[560px]"
          >
            {/* Drawer Header */}
            <div className="bg-gradient-to-r from-emerald-900 to-teal-900 p-4 border-b border-emerald-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-800 border border-emerald-600 flex items-center justify-center text-amber-400 shadow-md">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    AgriBot AI Assistant
                    <span className="bg-emerald-500/20 text-emerald-300 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">Agren AI</span>
                  </h3>
                  <p className="text-xs text-emerald-300/80">Crop Protection & Agronomy Advisor</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-emerald-300/70 hover:text-white p-1.5 rounded-lg hover:bg-emerald-800/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 no-scrollbar bg-emerald-950/80">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'bot' && (
                    <div className="w-8 h-8 rounded-full bg-emerald-800 border border-emerald-600 flex items-center justify-center text-amber-300 shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs sm:text-sm shadow-md whitespace-pre-line ${
                      msg.sender === 'user'
                        ? 'bg-emerald-600 text-white rounded-br-none'
                        : 'bg-emerald-900/90 text-emerald-100 border border-emerald-800/60 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                    <div
                      className={`text-[10px] mt-1.5 ${
                        msg.sender === 'user' ? 'text-emerald-200 text-right' : 'text-emerald-400/70'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              ))}

              {/* Quick Prompts Chips */}
              <div className="pt-2">
                <div className="text-[11px] font-semibold text-emerald-400/80 mb-2 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  Suggested Topics
                </div>
                <div className="flex flex-wrap gap-2">
                  {PRESET_PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(prompt)}
                      className="text-left text-xs bg-emerald-900/50 hover:bg-emerald-800/80 text-emerald-200 px-3 py-1.5 rounded-lg border border-emerald-800 transition-colors flex items-center gap-1.5"
                    >
                      <span>{prompt}</span>
                      <ChevronRight className="w-3 h-3 text-emerald-400 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-emerald-900/90 border-t border-emerald-800/80 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask AgriBot about crops, pests, prices..."
                className="flex-1 bg-emerald-950/90 border border-emerald-700/60 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-emerald-400/50 focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={() => handleSend()}
                className="bg-emerald-600 hover:bg-emerald-500 text-white p-2.5 rounded-xl shadow-md transition-colors shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
