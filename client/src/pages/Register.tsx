import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Sprout, Mail, Lock, User, Phone, MapPin, Building, ArrowRight } from 'lucide-react';

export const Register: React.FC = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState<'buyer' | 'farmer' | 'delivery_partner'>('buyer');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  // Farmer Specific Fields
  const [farmName, setFarmName] = useState('');
  const [farmAddress, setFarmAddress] = useState('');
  const [state, setState] = useState('');

  // Buyer Specific Fields
  const [deliveryAddress, setDeliveryAddress] = useState('');

  const [err, setErr] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');

    const payload: any = {
      email,
      password,
      fullName,
      phoneNumber,
      role
    };

    if (role === 'farmer') {
      if (!farmName || !farmAddress || !state) {
        setErr('Please fill in all farm profile fields.');
        return;
      }
      payload.farmName = farmName;
      payload.farmAddress = farmAddress;
      payload.state = state;
    } else if (role === 'buyer') {
      payload.deliveryAddress = deliveryAddress;
      payload.state = state;
    }

    try {
      await register(payload);
      navigate('/');
    } catch (error: any) {
      setErr(error.response?.data?.error || 'Registration failed. Try again.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-agriBg-light dark:bg-agriBg-dark px-4 py-12 transition-colors duration-300">
      <div className="w-full max-w-lg p-8 rounded-3xl bg-white dark:bg-forest-950 border border-slate-100 dark:border-forest-900 shadow-2xl space-y-6 animate-in fade-in duration-300">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 font-black text-2xl text-forest-700 dark:text-forest-400">
            <Sprout className="h-7 w-7 text-mint-500" />
            <span>Agrein</span>
          </Link>
          <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Create Your Account</h2>
          <p className="text-sm text-slate-400">Join the direct farm-to-table digital trade network</p>
        </div>

        {err && (
          <div className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-xs font-semibold p-3.5 rounded-xl border border-red-100 dark:border-red-900/50">
            {err}
          </div>
        )}

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 dark:bg-forest-900 rounded-xl">
          <button
            type="button"
            onClick={() => { setRole('buyer'); setErr(''); }}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${role === 'buyer' ? 'bg-gradient-to-r from-forest-600 to-mint-500 text-white shadow' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
          >
            Buyer
          </button>
          <button
            type="button"
            onClick={() => { setRole('farmer'); setErr(''); }}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${role === 'farmer' ? 'bg-gradient-to-r from-forest-600 to-mint-500 text-white shadow' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
          >
            Farmer / Seller
          </button>
          <button
            type="button"
            onClick={() => { setRole('delivery_partner'); setErr(''); }}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${role === 'delivery_partner' ? 'bg-gradient-to-r from-forest-600 to-mint-500 text-white shadow' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
          >
            Delivery Rider
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Grid fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Kola Ade"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-forest-800 bg-transparent text-sm focus:border-forest-500 dark:focus:border-mint-500 outline-none text-slate-800 dark:text-slate-100"
                  required
                />
                <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Phone Number</label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="+234..."
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-forest-800 bg-transparent text-sm focus:border-forest-500 dark:focus:border-mint-500 outline-none text-slate-800 dark:text-slate-100"
                  required
                />
                <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Email Address</label>
            <div className="relative">
              <input
                type="email"
                placeholder="kola@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-forest-800 bg-transparent text-sm focus:border-forest-500 dark:focus:border-mint-500 outline-none text-slate-800 dark:text-slate-100"
                required
              />
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Password</label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-forest-800 bg-transparent text-sm focus:border-forest-500 dark:focus:border-mint-500 outline-none text-slate-800 dark:text-slate-100"
                required
              />
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            </div>
          </div>

          {/* DYNAMIC FARMER DETAILS */}
          {role === 'farmer' && (
            <div className="border-t border-dashed border-slate-200 dark:border-forest-850 pt-4 space-y-4">
              <h3 className="text-xs font-bold text-forest-600 dark:text-mint-400 uppercase tracking-wider">Farm Business Profile</h3>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Farm / Cooperative Name</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Green Horizons Farm Coop"
                    value={farmName}
                    onChange={(e) => setFarmName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-forest-800 bg-transparent text-sm focus:border-forest-500 dark:focus:border-mint-500 outline-none text-slate-800 dark:text-slate-100"
                    required
                  />
                  <Building className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Farm Settlement Address</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="KM 5, Shagamu Road"
                      value={farmAddress}
                      onChange={(e) => setFarmAddress(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-forest-800 bg-transparent text-sm focus:border-forest-500 dark:focus:border-mint-500 outline-none text-slate-800 dark:text-slate-100"
                      required
                    />
                    <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">State (Nigeria)</label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-forest-800 bg-white dark:bg-forest-950 text-sm focus:border-forest-500 dark:focus:border-mint-500 outline-none text-slate-800 dark:text-slate-100"
                    required
                  >
                    <option value="">Select...</option>
                    <option value="Lagos">Lagos</option>
                    <option value="Kano">Kano</option>
                    <option value="Ogun">Ogun</option>
                    <option value="Kaduna">Kaduna</option>
                    <option value="Oyo">Oyo</option>
                    <option value="Edo">Edo</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* DYNAMIC BUYER DETAILS */}
          {role === 'buyer' && (
            <div className="border-t border-dashed border-slate-200 dark:border-forest-850 pt-4 space-y-4">
              <h3 className="text-xs font-bold text-forest-600 dark:text-mint-400 uppercase tracking-wider">Delivery Coordinates</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Default Delivery Address</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. Flat 3, 20 Lekki Avenue"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-forest-800 bg-transparent text-sm focus:border-forest-500 dark:focus:border-mint-500 outline-none text-slate-800 dark:text-slate-100"
                    />
                    <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">State</label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-forest-800 bg-white dark:bg-forest-950 text-sm focus:border-forest-500 dark:focus:border-mint-500 outline-none text-slate-800 dark:text-slate-100"
                  >
                    <option value="">Select...</option>
                    <option value="Lagos">Lagos</option>
                    <option value="Kano">Kano</option>
                    <option value="Ogun">Ogun</option>
                    <option value="Kaduna">Kaduna</option>
                    <option value="Oyo">Oyo</option>
                    <option value="Edo">Edo</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-forest-600 to-mint-500 hover:from-forest-700 hover:to-mint-600 text-white font-bold py-3 rounded-xl transition-all shadow hover:shadow-glow disabled:opacity-50"
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Bottom Switch */}
        <p className="text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-forest-600 dark:text-mint-400 hover:underline">
            Log In
          </Link>
        </p>

      </div>
    </div>
  );
};
