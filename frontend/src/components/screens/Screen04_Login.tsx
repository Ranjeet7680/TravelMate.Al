import React, { useState } from 'react';
import { useTravel } from '../../context/TravelContext';
import { 
  Sparkles, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Phone, 
  User, 
  Globe, 
  CheckCircle2, 
  ArrowRight,
  Compass 
} from 'lucide-react';

export const Screen04_Login: React.FC = () => {
  const { setCurrentScreen, setUserProfile } = useTravel();

  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [emailOrPhone, setEmailOrPhone] = useState('ranjeet.travels@travelmate.ai');
  const [password, setPassword] = useState('TravelMate@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Sign up fields
  const [fullName, setFullName] = useState('Ranjeet');
  const [country, setCountry] = useState('India');
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserProfile(prev => ({
      ...prev,
      name: fullName || 'Ranjeet',
      email: emailOrPhone.includes('@') ? emailOrPhone : 'ranjeet.travels@travelmate.ai',
    }));
    setCurrentScreen('05-dashboard');
  };

  const handleGoogleLogin = () => {
    setUserProfile(prev => ({
      ...prev,
      name: 'Ranjeet (Google)',
      email: 'ranjeet.google@travelmate.ai',
    }));
    setCurrentScreen('05-dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-8 select-none">
      <div className="w-full max-w-5xl theme-card rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12 border border-slate-200 dark:border-slate-800">
        {/* Left Column: Form matching mockup top-right */}
        <div className="lg:col-span-7 p-6 sm:p-10 space-y-6 flex flex-col justify-between bg-white dark:bg-slate-900">
          <div className="space-y-4">
            {/* Brand Logo matching mockup */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-ai-purple to-ocean-blue flex items-center justify-center shadow-md">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <span className="font-black text-xl text-midnight-navy dark:text-white tracking-tight">
                TravelMate<span className="text-ai-purple">.AI</span>
              </span>
            </div>

            {/* Welcome Back Header matching mockup */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-midnight-navy dark:text-white">
                {activeTab === 'login' ? 'Welcome Back 👋' : 'Create an Account 🚀'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                {activeTab === 'login'
                  ? 'Sign in to continue your travel journey'
                  : 'Join 180,000+ travelers with your personal AI travel agent'}
              </p>
            </div>

            {/* Tab switch matching mockup */}
            <div className="flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 w-full max-w-xs">
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === 'login'
                    ? 'bg-ai-purple text-white shadow-md shadow-purple-500/20'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('signup')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === 'signup'
                    ? 'bg-ai-purple text-white shadow-md shadow-purple-500/20'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleLoginSubmit} className="space-y-4 pt-2">
              {activeTab === 'signup' && (
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                    Full Name
                  </label>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950">
                    <User className="w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="e.g. Ranjeet Kumar"
                      className="bg-transparent text-xs w-full text-midnight-navy dark:text-white focus:outline-none"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Email / Phone matching mockup */}
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  Email or Phone
                </label>
                <div className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={emailOrPhone}
                    onChange={e => setEmailOrPhone(e.target.value)}
                    placeholder="name@example.com or mobile"
                    className="bg-transparent text-xs w-full text-midnight-navy dark:text-white focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Password matching mockup with eye toggle */}
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  Password
                </label>
                <div className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950">
                  <Lock className="w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="bg-transparent text-xs w-full text-midnight-navy dark:text-white focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember me & Forgot password matching mockup */}
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-ai-purple focus:ring-ai-purple"
                  />
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => alert('Password reset link dispatched to ' + emailOrPhone)}
                  className="text-ai-purple font-semibold hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit CTA Button matching mockup */}
              <button
                type="submit"
                className="w-full btn-primary-gradient py-3.5 rounded-xl font-bold text-xs shadow-xl shadow-purple-500/25 transition active:scale-[0.98]"
              >
                {activeTab === 'login' ? 'Log In' : 'Create Account'}
              </button>
            </form>

            {/* Social logins matching mockup */}
            <div className="space-y-3 pt-2">
              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
                <span className="bg-white dark:bg-slate-900 px-3 text-[11px] text-slate-400 uppercase tracking-wider absolute">
                  or continue with
                </span>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-midnight-navy dark:text-white transition flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-midnight-navy dark:text-white transition flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                  <span>Continue with GitHub</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Santorini Photo Banner matching mockup top-right */}
        <div className="lg:col-span-5 relative hidden lg:block overflow-hidden bg-midnight-navy">
          <img
            src="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80"
            alt="Santorini Greece Sunset"
            className="w-full h-full object-cover opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-midnight-navy via-midnight-navy/40 to-transparent" />

          {/* Feature checklist matching mockup top-right */}
          <div className="absolute bottom-8 left-8 right-8 text-white space-y-4">
            <h2 className="text-xl font-black">Your AI Travel Copilot</h2>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold">Personalized trip plans</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold">Best flight & hotel deals</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold">Real-time travel updates</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold">Visa & document guidance</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
