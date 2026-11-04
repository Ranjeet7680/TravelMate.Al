import React, { useState, useEffect } from 'react';
import { useTravel } from '../../context/TravelContext';
import { SUPPORTED_LANGUAGES } from '../../data/travelData';
import { LanguageCode } from '../../types';
import { Plane, Compass, Sparkles, ArrowRight, Globe } from 'lucide-react';

const TYPING_PHRASES = [
  'Activating AI agents...',
  'Loading travel data...',
  'Preparing your journey...',
  'AI is getting everything ready',
];

export const Screen01_Splash: React.FC = () => {
  const { setCurrentScreen, language, setLanguage } = useTravel();
  const [progress, setProgress] = useState(24);
  const [typingIndex, setTypingIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 12;
      });
    }, 400);

    return () => clearInterval(timer);
  }, []);

  // Typing animation effect cycling through phrases
  useEffect(() => {
    const currentPhrase = TYPING_PHRASES[typingIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && displayedText.length < currentPhrase.length) {
      timeout = setTimeout(() => {
        setDisplayedText(currentPhrase.slice(0, displayedText.length + 1));
      }, 55);
    } else if (!isDeleting && displayedText.length === currentPhrase.length) {
      // Pause at full phrase before deleting
      timeout = setTimeout(() => setIsDeleting(true), 1800);
    } else if (isDeleting && displayedText.length > 0) {
      timeout = setTimeout(() => {
        setDisplayedText(prev => prev.slice(0, -1));
      }, 30);
    } else if (isDeleting && displayedText.length === 0) {
      setIsDeleting(false);
      setTypingIndex(prev => (prev + 1) % TYPING_PHRASES.length);
    }

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, typingIndex]);

  return (
    <div className="animate-page-enter relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-between p-6 overflow-hidden bg-slate-950 text-white select-none">
      {/* Ambient Orbs */}
      <div className="ambient-orb w-72 h-72 bg-purple-600 absolute -top-20 -left-20 opacity-20" style={{ animationDelay: '0s' }} />
      <div className="ambient-orb w-56 h-56 bg-sky-500 absolute top-1/3 -right-16 opacity-15" style={{ animationDelay: '2s' }} />
      <div className="ambient-orb w-40 h-40 bg-teal-400 absolute bottom-20 left-1/4 opacity-10" style={{ animationDelay: '1s' }} />
      <div className="ambient-orb w-32 h-32 bg-indigo-500 absolute bottom-10 right-1/4 opacity-15" style={{ animationDelay: '3s' }} />

      {/* Background Mountain Photo & Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80"
          alt="Travel Landscape"
          className="w-full h-full object-cover opacity-35 scale-105 transition-transform duration-10000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/80" />
      </div>

      {/* Top Header: Language Switch & Skip */}
      <div className="relative z-10 w-full max-w-5xl flex items-center justify-between pt-2">
        <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700/60 text-xs">
          <Globe className="w-3.5 h-3.5 text-sky-400" />
          <select
            value={language}
            onChange={e => setLanguage(e.target.value as LanguageCode)}
            className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer"
          >
            {SUPPORTED_LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code} className="bg-slate-900 text-white">
                {lang.flag} {lang.native}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setCurrentScreen('03-landing')}
          className="px-4 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700/60 transition"
        >
          Skip Intro ➔
        </button>
      </div>

      {/* Center Hero: Logo, Title, Flying Airplane, Progress Circle */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-lg space-y-6 my-auto">
        {/* Animated Brand Emblem with pulse-ring */}
        <div className="relative">
          {/* Pulse ring around emblem */}
          <div className="pulse-ring absolute inset-0 rounded-full border-2 border-sky-400/50 scale-150" />
          <div className="pulse-ring absolute inset-0 rounded-full border border-purple-500/30 scale-125" style={{ animationDelay: '0.5s' }} />

          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-sky-500 via-indigo-600 to-purple-600 p-0.5 shadow-2xl shadow-sky-500/30 flex items-center justify-center animate-pulse">
            <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
              <Compass className="w-10 h-10 text-sky-400 animate-spin" style={{ animationDuration: '20s' }} />
            </div>
          </div>
          {/* Flying Airplane icon */}
          <div className="absolute -top-1 -right-2 animate-bounce">
            <Plane className="w-7 h-7 text-white fill-white transform rotate-45" />
          </div>
        </div>

        {/* Title & Tagline */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            TravelMate <span className="text-sky-400">AI</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-medium">
            Your Virtual Travel Agent & Travel Copilot
          </p>
        </div>

        {/* Circular Progress Indicator */}
        <div className="relative flex items-center justify-center pt-4">
          <svg className="w-16 h-16 transform -rotate-90">
            <circle
              cx="32"
              cy="32"
              r="26"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="4"
              fill="transparent"
            />
            <circle
              cx="32"
              cy="32"
              r="26"
              stroke="#38bdf8"
              strokeWidth="4"
              strokeDasharray={163}
              strokeDashoffset={163 - (163 * progress) / 100}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-300"
            />
          </svg>
          <span className="absolute text-xs font-bold text-sky-300">{progress}%</span>
        </div>

        {/* Typing Loading Subtitle */}
        <div className="space-y-1">
          <p className="text-xs sm:text-sm font-semibold text-white">
            Preparing your travel experience...
          </p>
          <p className="text-xs text-slate-400 min-h-[1.25rem] typing-cursor">
            {displayedText}
          </p>
        </div>

        {/* Quick Launch Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 w-full">
          <button
            onClick={() => setCurrentScreen('02-onboarding')}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs shadow-xl shadow-sky-500/25 transition flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Start Onboarding Wizard</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setCurrentScreen('05-dashboard')}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            Open Dashboard
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="relative z-10 text-[11px] text-slate-400 flex items-center gap-3">
        <span>© TravelMate AI</span>
        <span>•</span>
        <span>Your world. Your journey. Your AI copilot.</span>
      </div>
    </div>
  );
};
