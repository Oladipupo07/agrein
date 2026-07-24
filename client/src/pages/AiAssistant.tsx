import React, { useState } from 'react';
import { 
  Bot, 
  Upload, 
  Send, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Camera, 
  Sprout, 
  Bug 
} from 'lucide-react';
import { diagnoseCropDisease, askAiAssistant } from '../services/api';

export const AiAssistant: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'diagnostic' | 'chat'>('diagnostic');
  
  // Crop Diagnosis State
  const [cropType, setCropType] = useState('Tomato');
  const [notes, setNotes] = useState('');
  const [diagnosticResult, setDiagnosticResult] = useState<any>(null);
  const [diagnosing, setDiagnosing] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Chat State
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello! I am Agrein AI. Ask me anything about crop diseases, soil nutrients, Interswitch escrow payouts, or market prices.' }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [chatting, setChatting] = useState(false);

  const handleSimulatedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Simulate image preview
      setImagePreview('https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800');
    }
  };

  const runDiagnostic = async () => {
    setDiagnosing(true);
    try {
      const res = await diagnoseCropDisease(cropType, notes, imagePreview || undefined);
      if (res.data) setDiagnosticResult(res.data.result);
    } catch (err) {
      console.error(err);
    } finally {
      setDiagnosing(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    const userText = inputQuery;
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInputQuery('');
    setChatting(true);

    try {
      const res = await askAiAssistant(userText);
      setMessages(prev => [...prev, { sender: 'ai', text: res.reply }]);
    } catch (err) {
      console.error(err);
    } finally {
      setChatting(false);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      
      {/* Header */}
      <div className="glass-panel p-8 rounded-3xl border border-agrein-500/20 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-agrein-400 bg-agrein-500/10 px-3 py-1 rounded-full border border-agrein-500/20">
              AI Agricultural Intelligence
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              AI Crop Diagnostic & <span className="gradient-text">Agronomy Assistant</span>
            </h1>
            <p className="text-gray-300 text-sm">
              Diagnose crop leaf diseases via Computer Vision image recognition or chat directly with our agronomy AI model.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-gray-900 p-1.5 rounded-2xl border border-gray-800 self-start md:self-center">
            <button
              onClick={() => setActiveTab('diagnostic')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'diagnostic' ? 'bg-agrein-500 text-white shadow-glow' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Bug className="w-4 h-4 inline mr-1" /> Crop Diagnostic
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'chat' ? 'bg-agrein-500 text-white shadow-glow' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Bot className="w-4 h-4 inline mr-1" /> Agri Chatbot
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: CROP DIAGNOSTIC */}
      {activeTab === 'diagnostic' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Diagnostic Input Card */}
          <div className="glass-panel p-6 rounded-3xl border border-agrein-500/20 space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Camera className="w-5 h-5 text-agrein-400" /> Upload Affected Crop Leaf Photo
            </h3>

            {/* Upload Area */}
            <div className="relative border-2 border-dashed border-agrein-500/30 rounded-2xl p-6 text-center bg-gray-900/50 hover:bg-gray-900/80 transition-colors">
              {imagePreview ? (
                <div className="space-y-3">
                  <img src={imagePreview} alt="Crop Leaf" className="w-full h-48 object-cover rounded-xl border border-agrein-500/30" />
                  <button onClick={() => setImagePreview(null)} className="text-xs text-rose-400 underline">Remove photo</button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Upload className="w-10 h-10 text-agrein-400 mx-auto" />
                  <div className="text-xs text-gray-300">
                    <label className="text-agrein-400 font-bold cursor-pointer hover:underline">Click to upload image</label> or drag leaf photo here
                  </div>
                  <p className="text-[11px] text-gray-500">Supports JPG, PNG (Max 10MB)</p>
                  <input type="file" onChange={handleSimulatedUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              )}
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-gray-400 mb-1 block font-medium">Select Crop Type:</label>
                <select
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-white focus:border-agrein-500"
                >
                  <option value="Tomato">Tomato (Solanum lycopersicum)</option>
                  <option value="Maize">Maize / Corn (Zea mays)</option>
                  <option value="Cassava">Cassava (Manihot esculenta)</option>
                  <option value="Cocoa">Cocoa (Theobroma cacao)</option>
                </select>
              </div>

              <div>
                <label className="text-gray-400 mb-1 block font-medium">Observed Symptoms / Field Notes:</label>
                <textarea
                  placeholder="e.g. Water-soaked dark spots on leaf edges, wilting lower branches..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-white h-24 focus:border-agrein-500"
                />
              </div>
            </div>

            <button
              onClick={runDiagnostic}
              disabled={diagnosing}
              className="btn-agrein w-full py-3.5 text-xs font-bold"
            >
              {diagnosing ? 'Analyzing Image & Neural Network...' : 'Run AI Crop Disease Diagnostic'}
            </button>
          </div>

          {/* Diagnostic Result Display */}
          <div className="glass-panel p-6 rounded-3xl border border-agrein-500/20 space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" /> AI Diagnostic Analysis Report
            </h3>

            {diagnosticResult ? (
              <div className="space-y-5 animate-in fade-in duration-300">
                <div className="p-4 rounded-2xl bg-gray-900 border border-agrein-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">Identified Disease</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-agrein-500/20 text-agrein-300 text-[11px] font-mono">
                      {(diagnosticResult.confidence * 100).toFixed(0)}% Match Confidence
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-white">{diagnosticResult.diseaseName}</h4>
                  <p className="text-xs text-gray-300">Severity: <strong className="text-amber-400">{diagnosticResult.severity}</strong></p>
                </div>

                <div className="space-y-2 text-xs">
                  <h5 className="font-bold text-white uppercase tracking-wider text-agrein-400">Key Symptoms Identified:</h5>
                  <ul className="space-y-1">
                    {diagnosticResult.symptomsIdentified.map((sym: string, i: number) => (
                      <li key={i} className="text-gray-300 flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-agrein-400 flex-shrink-0" /> {sym}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-agrein-950/60 border border-agrein-500/30 space-y-2 text-xs">
                  <h5 className="font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sprout className="w-4 h-4 text-emerald-400" /> Recommended Action Plan:
                  </h5>
                  <ul className="space-y-1.5 text-gray-300">
                    {diagnosticResult.recommendedTreatment.map((tr: string, i: number) => (
                      <li key={i} className="leading-relaxed">• {tr}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>Estimated Yield Risk: <strong>{diagnosticResult.estimatedYieldImpact}</strong></span>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 text-gray-500 text-xs space-y-2">
                <Bot className="w-12 h-12 text-gray-700 mx-auto" />
                <p>Upload leaf image or click "Run AI Diagnostic" to generate automated disease report.</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 2: AGRI CHATBOT */}
      {activeTab === 'chat' && (
        <div className="glass-panel rounded-3xl border border-agrein-500/20 p-6 max-w-4xl mx-auto space-y-6">
          <div className="h-[450px] overflow-y-auto space-y-4 pr-2">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-xl bg-agrein-500/20 border border-agrein-500/30 flex items-center justify-center text-agrein-400 flex-shrink-0">
                    <Bot className="w-5 h-5" />
                  </div>
                )}
                <div className={`p-4 rounded-2xl max-w-lg text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-agrein-600 text-white rounded-br-none'
                    : 'bg-gray-900 border border-gray-800 text-gray-200 rounded-bl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              placeholder="Ask about NPK fertilizer ratios, tomato prices in Lagos, or Interswitch escrow..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-agrein-500"
            />
            <button type="submit" disabled={chatting} className="btn-agrein px-6 text-xs">
              <Send className="w-4 h-4" /> Send
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
