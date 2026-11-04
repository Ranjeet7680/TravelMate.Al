import React, { useState } from 'react';
import { useTravel } from '../../context/TravelContext';
import { CURRENCIES, SUPPORTED_LANGUAGES } from '../../data/travelData';
import { Currency, LanguageCode } from '../../types';
import { 
  User, 
  Mail, 
  Phone, 
  Moon, 
  Sun, 
  ShieldCheck, 
  Globe, 
  Coins, 
  Bell, 
  Lock, 
  Trash2, 
  Check, 
  Sparkles 
} from 'lucide-react';

export const Screen17_Profile: React.FC = () => {
  const { 
    userProfile, 
    setUserProfile, 
    theme, 
    toggleTheme, 
    currency, 
    setCurrency, 
    language, 
    setLanguage 
  } = useTravel();

  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [phone, setPhone] = useState(userProfile.phone);
  const [passport, setPassport] = useState(userProfile.passportCountry);
  const [aiMemory, setAiMemory] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setUserProfile(prev => ({
      ...prev,
      name,
      email,
      phone,
      passportCountry: passport,
    }));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 select-none animate-page-enter">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ai-purple/10 text-ai-purple text-xs font-bold border border-ai-purple/20">
          <User className="w-3.5 h-3.5" />
          <span>Screen 17 • Profile & Account Settings</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-midnight-navy dark:text-white">
          Manage Your Traveler Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Personalize identity, app visual theme, currencies, and AI copilot privacy parameters.
        </p>
      </div>

      <form onSubmit={handleSave} className="theme-card p-6 sm:p-8 rounded-3xl space-y-6">
        {/* User Card */}
        <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
          <img
            src={userProfile.avatar}
            alt={userProfile.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-ai-purple shadow-md"
          />
          <div>
            <h2 className="text-lg font-black text-midnight-navy dark:text-white">{userProfile.name}</h2>
            <p className="text-xs text-slate-400">{userProfile.email}</p>
            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full mt-1 inline-block">
              Verified Gold Explorer
            </span>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-slate-600 dark:text-slate-300 font-bold block mb-1">Full Name</label>
            <div className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
              <User className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="bg-transparent w-full text-midnight-navy dark:text-white focus:outline-none font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-600 dark:text-slate-300 font-bold block mb-1">Email Address</label>
            <div className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
              <Mail className="w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="bg-transparent w-full text-midnight-navy dark:text-white focus:outline-none font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-600 dark:text-slate-300 font-bold block mb-1">Mobile Number</label>
            <div className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
              <Phone className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="bg-transparent w-full text-midnight-navy dark:text-white focus:outline-none font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-600 dark:text-slate-300 font-bold block mb-1">Passport Country</label>
            <div className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
              <Globe className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={passport}
                onChange={e => setPassport(e.target.value)}
                className="bg-transparent w-full text-midnight-navy dark:text-white focus:outline-none font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Preferences Section: Theme, Currency, Language */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
          <h3 className="font-extrabold text-midnight-navy dark:text-white">App Preferences</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Theme switcher */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-midnight-navy dark:text-white block">Visual Theme</span>
                <span className="text-[10px] text-slate-400 capitalize">{theme} Mode Active</span>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-ai-purple" />}
              </button>
            </div>

            {/* Currency switcher */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-1">
              <span className="font-bold text-midnight-navy dark:text-white block">Default Currency</span>
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value as Currency)}
                className="w-full bg-transparent font-bold text-ai-purple focus:outline-none cursor-pointer"
              >
                {Object.keys(CURRENCIES).map(c => (
                  <option key={c} value={c} className="bg-white dark:bg-slate-900 text-midnight-navy dark:text-white">
                    {c} ({CURRENCIES[c].symbol})
                  </option>
                ))}
              </select>
            </div>

            {/* Language switcher */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-1">
              <span className="font-bold text-midnight-navy dark:text-white block">Language</span>
              <select
                value={language}
                onChange={e => setLanguage(e.target.value as LanguageCode)}
                className="w-full bg-transparent font-bold text-ai-purple focus:outline-none cursor-pointer"
              >
                {SUPPORTED_LANGUAGES.map(l => (
                  <option key={l.code} value={l.code} className="bg-white dark:bg-slate-900 text-midnight-navy dark:text-white">
                    {l.flag} {l.native}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* AI Memory & Privacy */}
        <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-between text-xs">
          <div>
            <div className="font-bold text-midnight-navy dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-ai-purple" />
              <span>AI Conversation Memory & Preferences</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Allow TravelMate AI to remember previous trips and dietary preferences for smarter itineraries.
            </p>
          </div>
          <input
            type="checkbox"
            checked={aiMemory}
            onChange={e => setAiMemory(e.target.checked)}
            className="rounded text-ai-purple focus:ring-ai-purple w-4 h-4 cursor-pointer"
          />
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          {savedSuccess && (
            <span className="text-xs text-emerald-500 font-bold flex items-center gap-1">
              <Check className="w-4 h-4" />
              <span>Settings updated successfully!</span>
            </span>
          )}
          <div className="ml-auto">
            <button
              type="submit"
              className="btn-primary-gradient px-8 py-3 rounded-2xl font-bold text-xs shadow-lg shadow-purple-500/25"
            >
              Save Profile Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
