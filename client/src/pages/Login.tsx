import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Sprout, Mail, Lock, ArrowRight } from 'lucide-react';

export const Login: React.FC = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    try {
      await login({ email, password });
      // Redirect dynamically based on role after profile is loaded
      navigate('/');
    } catch (error: any) {
      setErr(error.response?.data?.error || 'Failed to authenticate');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-agriBg-light dark:bg-agriBg-dark px-4 py-12 transition-colors duration-300">
      <div className="w-full max-w-md p-8 rounded-3xl bg-white dark:bg-forest-950 border border-slate-100 dark:border-forest-900 shadow-2xl space-y-6 animate-in fade-in duration-300">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 font-black text-2xl text-forest-700 dark:text-forest-400">
            <Sprout className="h-7 w-7 text-mint-500" />
            <span>Agrein</span>
          </Link>
          <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Welcome Back</h2>
          <p className="text-sm text-slate-400">
            Sign in to access your agricultural marketplace dashboard
          </p>
        </div>

        {err && (
          <div className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-xs font-semibold p-3.5 rounded-xl border border-red-100 dark:border-red-900/50">
            {err}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Email Address</label>
            <div className="relative">
              <input
                type="email"
                placeholder="example@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-forest-800 bg-transparent text-sm focus:border-forest-500 dark:focus:border-mint-500 outline-none text-slate-800 dark:text-slate-100 transition-all"
                required
              />
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 flex justify-between">
              <span>Password</span>
              <a href="#" className="text-xs font-bold text-forest-600 dark:text-mint-400 hover:underline">Forgot?</a>
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-forest-800 bg-transparent text-sm focus:border-forest-500 dark:focus:border-mint-500 outline-none text-slate-800 dark:text-slate-100 transition-all"
                required
              />
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-forest-600 to-mint-500 hover:from-forest-700 hover:to-mint-600 text-white font-bold py-3 rounded-xl transition-all shadow hover:shadow-glow disabled:opacity-50"
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Alert */}
        <div className="p-3.5 rounded-xl bg-forest-50/50 dark:bg-forest-900/20 border border-forest-100/50 dark:border-forest-800/50 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
          <p className="font-bold text-forest-700 dark:text-mint-400">Demo Accounts Available (Password: <span className="font-mono">password123</span>):</p>
          <ul className="list-disc pl-4 space-y-0.5 font-mono">
            <li>Admin: admin@agrein.com</li>
            <li>Farmer: farmer.kole@agrein.com</li>
            <li>Buyer: buyer.emeka@agrein.com</li>
            <li>Delivery: delivery.tunde@agrein.com</li>
          </ul>
        </div>

        {/* Bottom Switch */}
        <p className="text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-forest-600 dark:text-mint-400 hover:underline">
            Register now
          </Link>
        </p>

      </div>
    </div>
  );
};
