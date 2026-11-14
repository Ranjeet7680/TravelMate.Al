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
  Compass,
  Fingerprint,
  ShieldCheck,
  KeyRound,
  RefreshCw,
  Smartphone,
  ShieldAlert
} from 'lucide-react';

export const Screen04_Login: React.FC = () => {
  const { setCurrentScreen, setUserProfile } = useTravel();

  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'otp' | 'passkey'>('login');
  const [emailOrPhone, setEmailOrPhone] = useState('ranjeet.travels@travelmate.ai');
  const [password, setPassword] = useState('TravelMate@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Sign up fields
  const [fullName, setFullName] = useState('Ranjeet Kumar');
  const [country, setCountry] = useState('India');
  const [otpCode, setOtpCode] = useState(['5', '8', '2', '9', '4', '1']);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };
  const passStrength = getPasswordStrength(password);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      setAuthSuccess(true);
      setUserProfile(prev => ({
        ...prev,
        name: fullName || 'Ranjeet Kumar',
        email: emailOrPhone.includes('@') ? emailOrPhone : 'ranjeet.travels@travelmate.ai',
      }));
      setTimeout(() => {
        setCurrentScreen('05-dashboard');
      }, 700);
    }, 800);
  };

  const handleBiometricPasskey = () => {
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      setAuthSuccess(true);
      setUserProfile(prev => ({
        ...prev,
        name: 'Ranjeet (Passkey)',
        email: 'ranjeet.passkey@travelmate.ai',
      }));
      setTimeout(() => {
        setCurrentScreen('05-dashboard');
      }, 700);
    }, 900);
  };

  const handleGoogleLogin = () => {
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      setUserProfile(prev => ({
        ...prev,
        name: 'Ranjeet (Google)',
        email: 'ranjeet.google@travelmate.ai',
      }));
      setCurrentScreen('05-dashboard');
    }, 600);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-8 select-none animate-page-enter">
      <div className="w-full max-w-5xl theme-card rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12 border border-slate-200 dark:border-slate-800">
        
        {/* Left Column: Secure Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 space-y-6 flex flex-col justify-between bg-white dark:bg-slate-900">
          <div className="space-y-5">
            
            {/* Brand Logo & Back to Landing Link */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-ai-purple to-ocean-blue flex items-center justify-center shadow-md shadow-purple-500/20">
                  <Compass className="w-5 h-5 text-white" />
                </div>
                <span className="font-black text-xl text-midnight-navy dark:text-white tracking-tight">
                  TravelMate<span className="text-ai-purple">.AI</span>
                </span>
              </div>

              <button
                onClick={() => setCurrentScreen('03-landing')}
                className="text-xs font-bold text-slate-400 hover:text-ai-purple transition flex items-center gap-1"
              >
                <span>Landing Page</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>256-Bit Encrypted Traveler Vault</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-midnight-navy dark:text-white">
                {activeTab === 'login' ? 'Welcome Back 👋' : activeTab === 'signup' ? 'Create Secure Account 🚀' : 'Two-Factor Verification 🔐'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                {activeTab === 'login'
                  ? 'Sign in to access your itinerary, boarding passes & travel wallet'
                  : 'Join 180,000+ travelers with zero-knowledge encrypted security'}
              </p>
            </div>

            {/* Tab switch */}
            <div className="flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 w-full max-w-sm">
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
                Create Account
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('otp')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === 'otp'
                    ? 'bg-ai-purple text-white shadow-md shadow-purple-500/20'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                2FA OTP
              </button>
            </div>

            {/* ── Biometric Touch ID / Face ID Quick Passkey Option ── */}
            <div className="p-3.5 rounded-2xl border border-purple-500/30 bg-purple-500/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-ai-purple text-white flex items-center justify-center shadow-md">
                  <Fingerprint className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-black text-midnight-navy dark:text-white flex items-center gap-1.5">
                    <span>Touch ID / Face ID Passkey</span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-500/15 text-emerald-500 font-bold">READY</span>
                  </div>
                  <div className="text-[11px] text-slate-400">Instant biometric sign-in without passwords</div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleBiometricPasskey}
                disabled={isAuthenticating}
                className="px-3 py-1.5 rounded-xl bg-ai-purple hover:bg-purple-600 text-white font-bold text-xs transition shadow-sm flex items-center gap-1.5 disabled:opacity-50"
              >
                {isAuthenticating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <span>Authenticate</span>}
              </button>
            </div>

            {/* ── Standard Credentials Form ── */}
            {activeTab !== 'otp' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {activeTab === 'signup' && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Legal Name</label>
                    <div className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                      <User className="w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        required
                        className="bg-transparent text-xs w-full text-midnight-navy dark:text-white focus:outline-none"
                        placeholder="As shown on Passport / Aadhaar"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email or Registered Mobile</label>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={emailOrPhone}
                      onChange={e => setEmailOrPhone(e.target.value)}
                      required
                      className="bg-transparent text-xs w-full text-midnight-navy dark:text-white focus:outline-none"
                      placeholder="name@travelmate.ai or +91 9876543210"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Master Password</label>
                    <span className="text-[10px] text-slate-400">
                      Strength: <strong className={passStrength >= 3 ? 'text-emerald-500' : 'text-amber-500'}>{passStrength >= 3 ? 'Strong' : 'Moderate'}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                    <Lock className="w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      className="bg-transparent text-xs w-full text-midnight-navy dark:text-white focus:outline-none"
                      placeholder="••••••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-ai-purple"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password strength progress bar */}
                  <div className="flex gap-1 pt-1">
                    {[1, 2, 3, 4].map(step => (
                      <div
                        key={step}
                        className={`h-1 flex-1 rounded-full transition-all ${
                          passStrength >= step ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="rounded text-ai-purple focus:ring-ai-purple"
                    />
                    <span>Remember this trusted device</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => alert('Password reset verification dispatched to ' + emailOrPhone)}
                    className="text-ai-purple font-semibold hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="w-full btn-primary-gradient py-3.5 rounded-xl font-bold text-xs shadow-xl shadow-purple-500/25 transition active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {isAuthenticating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Verifying Cryptographic Credentials...</span>
                    </>
                  ) : authSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      <span>Verified! Launching Dashboard...</span>
                    </>
                  ) : (
                    <span>{activeTab === 'login' ? 'Sign In & Launch Dashboard ➔' : 'Create Encrypted Traveler Account ➔'}</span>
                  )}
                </button>
              </form>
            ) : (
              /* ── 2FA OTP Form ── */
              <div className="space-y-4 py-2">
                <div className="text-center space-y-1">
                  <Smartphone className="w-8 h-8 text-ai-purple mx-auto animate-pulse" />
                  <div className="text-sm font-bold text-midnight-navy dark:text-white">Enter 6-Digit Security Code</div>
                  <div className="text-xs text-slate-400">A one-time passcode was sent to your registered mobile ending in ••8912</div>
                </div>

                <div className="flex justify-center gap-2 py-2">
                  {otpCode.map((digit, i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={e => {
                        const newOtp = [...otpCode];
                        newOtp[i] = e.target.value;
                        setOtpCode(newOtp);
                      }}
                      className="w-11 h-12 text-center text-lg font-black rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-midnight-navy dark:text-white focus:ring-2 focus:ring-ai-purple focus:outline-none"
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleBiometricPasskey}
                  className="w-full btn-primary-gradient py-3 rounded-xl font-bold text-xs shadow-md shadow-purple-500/20"
                >
                  Confirm & Open Dashboard
                </button>
              </div>
            )}

            {/* Social Logins */}
            <div className="space-y-3 pt-1">
              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
                <span className="bg-white dark:bg-slate-900 px-3 text-[10px] text-slate-400 uppercase tracking-wider absolute">
                  or authenticate with
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-midnight-navy dark:text-white transition flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-midnight-navy dark:text-white transition flex items-center justify-center gap-2"
                >
                  <KeyRound className="w-4 h-4 text-ai-purple" />
                  <span>Passkey API</span>
                </button>
              </div>
            </div>

            {/* Enterprise Security Badges */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-semibold">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-500" />
                <span>256-Bit TLS</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-sky-500" />
                <span>IATA Accredited</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-purple-500" />
                <span>PCI-DSS L1</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Showcase & Security Features */}
        <div className="lg:col-span-5 relative hidden lg:block overflow-hidden bg-midnight-navy">
          <img
            src="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80"
            alt="Santorini Greece Sunset"
            className="w-full h-full object-cover opacity-65"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-midnight-navy via-midnight-navy/50 to-midnight-navy/30" />

          {/* Security & Feature Card */}
          <div className="absolute bottom-8 left-8 right-8 text-white space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero-Knowledge Traveler Identity</span>
            </div>

            <h2 className="text-2xl font-black leading-tight">
              Your World. <br />
              Completely Protected.
            </h2>

            <div className="space-y-2.5 text-xs text-slate-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Passports & vouchers stored in encrypted device enclave</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Amadeus GDS & IATA verified direct booking</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant 24/7 SOS helpline and consular sync</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero-markup currency conversion & UPI price-lock</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setCurrentScreen('05-dashboard')}
                className="w-full py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs border border-white/20 transition flex items-center justify-center gap-2 backdrop-blur-md"
              >
                <span>Explore Dashboard as Guest</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
