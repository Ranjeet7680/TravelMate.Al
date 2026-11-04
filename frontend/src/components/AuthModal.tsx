import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext';
import { X, User, Mail, Lock, ShieldCheck, Sparkles, Check } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { authModalOpen, setAuthModalOpen, userProfile, setUserProfile } = useTravel();
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [password, setPassword] = useState('••••••••••••');
  const [travelStyle, setTravelStyle] = useState(userProfile.travelStyle);
  const [dietary, setDietary] = useState(userProfile.dietaryPreference);
  const [passport, setPassport] = useState(userProfile.passportCountry);

  if (!authModalOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setUserProfile(prev => ({
      ...prev,
      name,
      email,
      travelStyle,
      dietaryPreference: dietary,
      passportCountry: passport,
    }));
    setAuthModalOpen(false);
  };

  const handleGoogleLogin = () => {
    setUserProfile(prev => ({
      ...prev,
      name: 'Aarav Sharma (Google)',
      email: 'aarav.sharma@gmail.com',
    }));
    setAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl space-y-6">
        {/* Close Button */}
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-5 right-5 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 mx-auto flex items-center justify-center shadow-lg shadow-sky-500/20 mb-2">
            <User className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-black text-white">
            {isRegistering ? 'Create Travel Profile' : 'Traveler Profile & Account'}
          </h2>
          <p className="text-xs text-slate-400">
            Customize your AI Copilot recommendations and travel persona
          </p>
        </div>

        {/* Google Demo Login */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-white transition flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-800 w-full" />
          <span className="bg-slate-900 px-3 text-[10px] text-slate-500 uppercase tracking-widest absolute">
            or update details
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1">Travel Style</label>
              <select
                value={travelStyle}
                onChange={e => setTravelStyle(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-white focus:outline-none focus:border-sky-500"
              >
                <option value="luxury">Luxury Elite</option>
                <option value="comfort">Comfort (Balanced)</option>
                <option value="budget">Smart Budget</option>
                <option value="backpacker">Backpacker</option>
                <option value="family">Family Friendly</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Dietary Preference</label>
              <select
                value={dietary}
                onChange={e => setDietary(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-white focus:outline-none focus:border-sky-500"
              >
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="halal">Halal</option>
                <option value="jain">Jain Pure Veg</option>
                <option value="any">No Preference</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Passport Nationality (for Visa Agent)</label>
            <input
              type="text"
              value={passport}
              onChange={e => setPassport(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-sky-500/25 transition"
          >
            Save Preferences & Continue
          </button>
        </form>
      </div>
    </div>
  );
};
