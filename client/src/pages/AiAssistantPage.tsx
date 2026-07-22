import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, Leaf, TrendingUp, CloudRain, Bug, BookOpen, HelpCircle, X, Mic, RefreshCw, User, Copy, ThumbsUp, ThumbsDown } from 'lucide-react';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  liked?: boolean;
}

const SUGGESTED_PROMPTS = [
  { icon: Leaf, label: 'Best crop for this season?', prompt: 'What crops should I plant in the current season in Southwest Nigeria based on weather patterns?' },
  { icon: Bug, label: 'Identify pest damage', prompt: 'The leaves of my tomato plants have brown spots and are curling. What pest or disease could this be, and how do I treat it organically?' },
  { icon: TrendingUp, label: 'Market price analysis', prompt: 'What are the current market prices for maize, soybean, and cassava in Lagos? Should I sell now or hold stock?' },
  { icon: CloudRain, label: 'Weather planting advice', prompt: 'It has rained heavily this week in Plateau State. Is it a good time to plant yam or should I wait?' },
  { icon: BookOpen, label: 'How to apply for loan', prompt: 'How can I access a government agricultural loan or CBN Anchor Borrowers Programme funding as a smallholder farmer?' },
  { icon: HelpCircle, label: 'Export requirements', prompt: 'What are the export requirements for sesame seeds from Nigeria to the European Union?' },
];

const AGRIBOT_RESPONSES: Record<string, string> = {
  default: "I'm AgriBot, your AI agricultural advisor powered by Agrein's intelligence network. I can help with crop planning, pest identification, market insights, export guidance, and much more. What would you like to know?",
  season: `Based on current weather patterns in Southwest Nigeria (July 2026), here's what I recommend:\n\n**Top Crops for This Season:**\n- 🌽 **Maize (Yellow Dent)** — Ideal for late planting. Harvest in 90–110 days.\n- 🍅 **Tomatoes (Roma varieties)** — Plant after first heavy rains clear. Best in well-drained loamy soil.\n- 🥬 **Leafy Vegetables (Ugwu, Waterleaf)** — Excellent demand in Lagos. Fast turnaround.\n- 🫘 **Cowpeas** — Nitrogen-fixing, good for soil health and market.\n\n**Avoid:** Cassava during peak wet season due to rot risk. Wait until September.\n\nWould you like planting schedules or input recommendations for any of these?`,
  pest: `Your tomato plants sound like they have **Septoria Leaf Spot** or possibly **Tomato Yellow Leaf Curl Virus (TYLCV)**.\n\n**Identification:**\n- Brown spots with yellow halos → Septoria Leaf Spot (fungal)\n- Curling + yellowing → Possible whitefly-transmitted virus\n\n**Organic Treatment:**\n1. 🧴 **Neem oil spray** (5ml per liter) every 7 days\n2. 🌿 **Copper-based fungicide** (Bordeaux mixture) for fungal spots\n3. ✂️ Remove and burn affected leaves immediately\n4. 🪲 Install yellow sticky traps for whiteflies\n\n**Prevention:**\n- Rotate crops every season\n- Maintain 45cm spacing for airflow\n- Water at the base, avoid wetting leaves\n\nIf symptoms worsen, send a photo via Agrein's verification portal for expert analysis.`,
  price: `**Current Market Price Intelligence (July 2026):**\n\n| Commodity | Lagos Price | 30-Day Trend |\n|-----------|------------|---------------|\n| Maize | ₦42,000/100kg | ↑ +8% |\n| Soybean | ₦68,000/100kg | → Stable |\n| Cassava | ₦18,500/100kg | ↓ -4% |\n| Yam | ₦12,000/tuber (5kg) | ↑ +12% |\n\n**My Recommendation:**\n- **Hold Maize** — AI forecast shows 15% price jump in August due to Eid demand\n- **Sell Soybean now** — market is stable but may soften in 3 weeks\n- **Cassava** — hold if storage allows, prices typically recover by September\n\nWould you like a detailed price forecast for a specific commodity?`,
  export: `**Sesame Export to EU — Step-by-Step Requirements:**\n\n1. **NAFDAC Registration** — Register your product (₦50,000–₦150,000 fee)\n2. **Phytosanitary Certificate** — Issued by NAQS (Nigerian Agricultural Quarantine Service)\n3. **Quality Certification** — EU requires max 5% moisture, <0.1% aflatoxin\n4. **Form M Processing** — Nigerian export documentation through your bank\n5. **Letter of Credit** — EU buyers typically require LC from European banks\n\n**Support:**\nAgrein partners with **NEPC** and licensed clearing agents. Use our Export Marketplace to connect with verified EU importers who handle documentation.\n\n**Estimated Timeline:** 3–6 weeks for first shipment\n\nShall I connect you with our export consultant?`,
};

const getResponse = (input: string): string => {
  const lower = input.toLowerCase();
  if (lower.includes('crop') || lower.includes('plant') || lower.includes('season')) return AGRIBOT_RESPONSES.season;
  if (lower.includes('pest') || lower.includes('disease') || lower.includes('spot') || lower.includes('curl')) return AGRIBOT_RESPONSES.pest;
  if (lower.includes('price') || lower.includes('market') || lower.includes('sell') || lower.includes('maize') || lower.includes('cassava')) return AGRIBOT_RESPONSES.price;
  if (lower.includes('export') || lower.includes('eu') || lower.includes('europe') || lower.includes('sesame')) return AGRIBOT_RESPONSES.export;
  if (lower.includes('loan') || lower.includes('credit') || lower.includes('cbn') || lower.includes('funding')) {
    return `**Agricultural Loan Options in Nigeria:**\n\n1. **CBN Anchor Borrowers Programme**\n   - For smallholder farmers\n   - Single-digit interest rates\n   - Apply through your state's ADP (Agricultural Development Programme)\n\n2. **BOA (Bank of Agriculture)**\n   - Loans from ₦100,000 – ₦5,000,000\n   - 10–12% interest per annum\n   - Requires farm ownership or tenancy documents\n\n3. **NIRSAL (Nigeria Incentive-Based Risk Sharing System)**\n   - Provides credit guarantees to commercial banks\n   - Up to 75% risk coverage for farmers\n\n4. **Agrein Credit Connect** *(coming soon)*\n   - In-app micro-loans for verified Agrein farmers\n   - 8% per annum, repaid from harvest proceeds\n\nWould you like help with the application process for any of these?`;
  }
  if (lower.includes('rain') || lower.includes('weather') || lower.includes('yam') || lower.includes('plateau')) {
    return `**Weather Advisory for Plateau State:**\n\nAfter heavy rainfall this week, here's my recommendation:\n\n**Yam Planting:** ⚠️ Wait 5–7 days. Soil needs to drain to avoid seed-yam rot. Ideal soil moisture for yam: 60–70%.\n\n**What to do now:**\n- Check drainage channels are clear\n- Prepare mounds/ridges while soil is workable\n- Apply base fertilizer (NPK 20:10:10) to mounds today\n\n**Best planting window:** July 25–August 5 based on forecast.\n\n**Expected Harvest:** November–December 2026. Market prices typically peak during Christmas season — plan accordingly!\n\nDo you want the full seasonal planting calendar for Plateau State?`;
  }
  return `That's a great question! As AgriBot, I'm still learning from Agrein's agricultural database, but here's what I can offer:\n\nFor **"${input}"**, I recommend:\n\n1. 🌱 Consult Agrein's Learning Center for detailed guides\n2. 🤝 Post in the Community Forum to get advice from 50,000+ farmers\n3. 📊 Check Market Intelligence for price and demand data\n4. 🧑‍🌾 Contact your local agricultural extension officer\n\nWould you like me to help with a more specific agricultural question?`;
};

export const AiAssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: AGRIBOT_RESPONSES.default,
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [queryCount, setQueryCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = async (text?: string) => {
    const content = (text || input).trim();
    if (!content) return;

    const userMessage: Message = {
      id: String(Date.now()),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setQueryCount(q => q + 1);

    await new Promise(r => setTimeout(r, 1000 + Math.random() * 1000));

    const botResponse = getResponse(content);
    const botMessage: Message = {
      id: String(Date.now() + 1),
      role: 'assistant',
      content: botResponse,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, botMessage]);
    setIsTyping(false);
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard!');
  };

  const formatContent = (content: string) => {
    // Simple markdown-like formatting
    return content
      .split('\n')
      .map((line, i) => {
        if (line.startsWith('**') && line.endsWith('**')) {
          return <p key={i} className="font-bold text-white mb-1">{line.slice(2, -2)}</p>;
        }
        if (line.startsWith('- ')) {
          return <li key={i} className="ml-4 list-disc text-slate-200 text-sm">{line.slice(2)}</li>;
        }
        if (line.match(/^\d+\./)) {
          return <li key={i} className="ml-4 list-decimal text-slate-200 text-sm">{line.replace(/^\d+\.\s/, '')}</li>;
        }
        if (line.includes('|') && line.split('|').length > 2) {
          return null; // table rows handled differently
        }
        if (!line.trim()) return <br key={i} />;
        // Replace inline **bold**
        const parts = line.split(/\*\*(.*?)\*\*/g);
        return (
          <p key={i} className="text-sm text-slate-200 leading-relaxed">
            {parts.map((part, j) => j % 2 === 1 ? <strong key={j} className="text-white font-semibold">{part}</strong> : part)}
          </p>
        );
      });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">

      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border-b border-slate-800 px-4 sm:px-6 py-5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-white text-lg">AgriBot</h1>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">AI</span>
              </div>
              <p className="text-xs text-slate-400">Your personal agricultural intelligence assistant</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-slate-400">Queries used</p>
              <p className="text-sm font-bold text-emerald-400">{queryCount} / 50</p>
            </div>
            <button
              onClick={() => {
                setMessages([{ id: '0', role: 'assistant', content: AGRIBOT_RESPONSES.default, timestamp: new Date() }]);
                setQueryCount(0);
                toast.success('Conversation cleared!');
              }}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-xl transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 gap-6">

        {/* Suggested Prompts — shown when only the initial message exists */}
        {messages.length === 1 && (
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-3 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Suggested Questions
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {SUGGESTED_PROMPTS.map(({ icon: Icon, label, prompt }) => (
                <button
                  key={label}
                  onClick={() => sendMessage(prompt)}
                  className="flex items-center gap-3 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 hover:border-emerald-600/50 rounded-xl p-3.5 text-left transition-all group"
                >
                  <div className="w-8 h-8 bg-emerald-600/20 rounded-xl flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-sm text-slate-300 group-hover:text-white font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 space-y-5 overflow-y-auto">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'assistant' ? 'bg-gradient-to-br from-emerald-500 to-teal-600' : 'bg-slate-600'
              }`}>
                {msg.role === 'assistant' ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-white" />}
              </div>

              <div className={`max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                <div className={`rounded-2xl px-5 py-4 shadow-lg ${
                  msg.role === 'assistant'
                    ? 'bg-slate-800 border border-slate-700 rounded-tl-sm'
                    : 'bg-emerald-700 rounded-tr-sm'
                }`}>
                  <div className="space-y-1">
                    {formatContent(msg.content)}
                  </div>
                </div>

                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-2 pl-1">
                    <span className="text-[10px] text-slate-500">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <button onClick={() => copyMessage(msg.content)} className="p-1 hover:bg-slate-700 rounded text-slate-500 hover:text-white transition-colors">
                      <Copy className="w-3 h-3" />
                    </button>
                    <button className="p-1 hover:bg-slate-700 rounded text-slate-500 hover:text-emerald-400 transition-colors">
                      <ThumbsUp className="w-3 h-3" />
                    </button>
                    <button className="p-1 hover:bg-slate-700 rounded text-slate-500 hover:text-red-400 transition-colors">
                      <ThumbsDown className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-sm px-5 py-4">
                <div className="flex gap-1.5 items-center h-5">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0ms]" />
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-3 flex items-end gap-3 shadow-xl">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Ask AgriBot anything about farming, markets, weather, pests..."
            rows={1}
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 resize-none focus:outline-none min-h-[40px] max-h-32 py-2 px-2"
            style={{ height: 'auto' }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isTyping}
            className="w-10 h-10 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-colors shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        <p className="text-center text-xs text-slate-600">
          AgriBot is AI-powered and may occasionally make mistakes. Verify important agricultural decisions with qualified agronomists.
        </p>
      </div>
    </div>
  );
};
