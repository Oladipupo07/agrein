import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [sending, setSending] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !msg) return;

    setSending(true);
    setTimeout(() => {
      toast.success('Your message has been sent to Agrein Support! We will reply within 24 hours.');
      setName('');
      setEmail('');
      setMsg('');
      setSending(false);
    }, 1000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 space-y-16 transition-colors duration-300 text-left">

      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">Contact Agrein Support</h1>
        <p className="text-slate-400 text-sm max-w-lg mx-auto">Get in touch with our team for disputes, merchant verifications, or integration support.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

        {/* Contact coordinates */}
        <div className="lg:col-span-1 space-y-8 bg-white dark:bg-forest-900 border border-slate-100 dark:border-forest-800 p-8 rounded-3xl shadow-sm h-fit">
          <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100">Headquarters</h3>

          <div className="space-y-6 text-xs text-slate-500">
            <div className="flex gap-4">
              <div className="p-2.5 bg-forest-50 dark:bg-forest-950 rounded-xl text-forest-600 shrink-0">
                <MapPin className="h-5 w-5 text-mint-500" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200">Address</h4>
                <p className="mt-1 leading-relaxed">Currently working remotely from Nigeria.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="p-2.5 bg-forest-50 dark:bg-forest-950 rounded-xl text-forest-600 shrink-0">
                <Phone className="h-5 w-5 text-mint-500" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200">Phone Numbers</h4>
                <p className="mt-1 leading-relaxed">+234 801 900 7525</p>
                <p className="leading-relaxed">+234 812 910 4771</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="p-2.5 bg-forest-50 dark:bg-forest-950 rounded-xl text-forest-600 shrink-0">
                <Mail className="h-5 w-5 text-mint-500" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200">Email Address</h4>
                <p className="mt-1 leading-relaxed">support@agrein.com</p>
                <p className="leading-relaxed">disputes@agrein.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Support contact form */}
        <div className="lg:col-span-2 bg-white dark:bg-forest-900 border border-slate-100 dark:border-forest-800 p-8 rounded-3xl shadow-sm">
          <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100 mb-6">Send a Message</h3>

          <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1.5">Your Name</label>
                <input
                  type="text"
                  placeholder="Kola"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-forest-850 bg-transparent text-sm focus:border-forest-500 outline-none text-slate-800 dark:text-slate-100"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1.5">Email Address</label>
                <input
                  type="email"
                  placeholder="kola@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-forest-850 bg-transparent text-sm focus:border-forest-500 outline-none text-slate-800 dark:text-slate-100"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-500 uppercase mb-1.5">Message / Inquiry</label>
              <textarea
                rows={5}
                placeholder="Detail your request or dispute reference..."
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                className="w-full border border-slate-200 dark:border-forest-850 bg-transparent rounded-xl p-3 text-sm focus:border-forest-500 outline-none text-slate-850 dark:text-slate-200"
                required
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-forest-600 to-mint-500 hover:from-forest-700 hover:to-mint-600 text-white font-bold py-3.5 rounded-xl text-sm transition-all"
            >
              {sending ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
