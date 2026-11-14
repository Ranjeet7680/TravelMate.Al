import React, { useState, useEffect } from 'react';
import { useTravel } from '../../context/TravelContext';
import { SUPPORTED_LANGUAGES } from '../../data/travelData';
import { LanguageCode } from '../../types';
import { 
  Plane, 
  Compass, 
  Sparkles, 
  ArrowRight, 
  Globe, 
  MapPin, 
  ShieldCheck, 
  Sun, 
  CloudSun, 
  CheckCircle2, 
  Lock, 
  ChevronRight,
  Bot
} from 'lucide-react';

interface ShowcaseLocation {
  city: string;
  country: string;
  region: string;
  tag: string;
  temp: string;
  weather: string;
  flightRoute: string;
  image: string;
  quote: string;
}

const SHOWCASE_LOCATIONS: ShowcaseLocation[] = [
  {
    city: 'Dubai',
    country: 'United Arab Emirates',
    region: 'Middle East',
    tag: 'Desert Luxury & Future Icons',
    temp: '27°C',
    weather: 'Sunny',
    flightRoute: 'CCU/IXR ➔ DXB (Emirates from ₹32,500)',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80',
    quote: 'Burj Khalifa, Desert Safari, and Marina Yachting'
  },
  {
    city: 'Tokyo',
    country: 'Japan',
    region: 'East Asia',
    tag: 'Neon Metropolises & Sacred Temples',
    temp: '18°C',
    weather: 'Clear Sky',
    flightRoute: 'CCU ➔ NRT (Singapore Air from ₹42,000)',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=80',
    quote: 'Mount Fuji, Shibuya Crossing, and Kyoto Shrines'
  },
  {
    city: 'Paris',
    country: 'France',
    region: 'Europe',
    tag: 'City of Lights & Grand Gastronomy',
    temp: '16°C',
    weather: 'Breezy',
    flightRoute: 'DEL ➔ CDG (Air France from ₹48,000)',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=80',
    quote: 'Eiffel Tower Sunset, Louvre Museum, and Seine River'
  },
  {
    city: 'Bali',
    country: 'Indonesia',
    region: 'Southeast Asia',
    tag: 'Tropical Sanctuaries & Volcanic Horizons',
    temp: '29°C',
    weather: 'Tropical',
    flightRoute: 'CCU ➔ DPS (Batik / AirAsia from ₹26,000)',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1600&q=80',
    quote: 'Ubud Rice Terraces, Tanah Lot, and Uluwatu Cliffs'
  },
  {
    city: 'Kashmir & Himalayas',
    country: 'India',
    region: 'India Domestic',
    tag: 'Paradise on Earth & Snow Glaciers',
    temp: '11°C',
    weather: 'Crisp Alpine',
    flightRoute: 'IXR ➔ SXR (IndiGo from ₹8,900)',
    image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1600&q=80',
    quote: 'Gulmarg Gondola, Dal Lake Houseboats, and Pahalgam Pines'
  }
];

const TELEMETRY_STEPS = [
  'Activating 13-Agent Neural Swarm...',
  'Connecting Amadeus GDS Airfare Engine...',
  'Syncing IATA Timatic Visa Regulations...',
  'Configuring 256-Bit Encrypted Traveler Vault...',
  'AI Travel Copilot Ready for Takeoff!'
];

export const Screen01_Splash: React.FC = () => {
  const { setCurrentScreen, language, setLanguage } = useTravel();
  const [progress, setProgress] = useState(15);
  const [locationIndex, setLocationIndex] = useState(0);
  const [telemetryIndex, setTelemetryIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Rotate locations every 3.5 seconds
  useEffect(() => {
    const locTimer = setInterval(() => {
      setLocationIndex(prev => (prev + 1) % SHOWCASE_LOCATIONS.length);
    }, 3500);
    return () => clearInterval(locTimer);
  }, []);

  // Telemetry and progress increment
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsLoaded(true);
          return 100;
        }
        return prev + 10;
      });
    }, 380);

    return () => clearInterval(timer);
  }, []);

  // Auto-navigate to dashboard once loading finishes
  useEffect(() => {
    if (isLoaded) {
      const navTimer = setTimeout(() => {
        setCurrentScreen('05-dashboard');
      }, 700);
      return () => clearTimeout(navTimer);
    }
  }, [isLoaded, setCurrentScreen]);

  // Update telemetry text with progress
  useEffect(() => {
    const step = Math.min(Math.floor((progress / 100) * TELEMETRY_STEPS.length), TELEMETRY_STEPS.length - 1);
    setTelemetryIndex(step);
  }, [progress]);

  const currentLoc = SHOWCASE_LOCATIONS[locationIndex];

  return (
    <div className="animate-page-enter relative min-h-screen flex flex-col justify-between p-4 sm:p-8 overflow-hidden bg-slate-950 text-white select-none">
      
      {/* ── Background Slideshow with Smooth Crossfade ── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {SHOWCASE_LOCATIONS.map((loc, idx) => (
          <div
            key={loc.city}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === locationIndex ? 'opacity-40 scale-105' : 'opacity-0 scale-100'
            } transition-transform duration-10000`}
          >
            <img
              src={loc.image}
              alt={loc.city}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        {/* Apple-style gradient vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/80" />
        <div className="absolute inset-0 bg-radial-vignette opacity-70" />
      </div>

      {/* ── Top Header Navigation ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-ai-purple to-ocean-blue flex items-center justify-center shadow-lg shadow-purple-500/25">
            <Compass className="w-5 h-5 text-white animate-spin" style={{ animationDuration: '30s' }} />
          </div>
          <div>
            <span className="font-black text-lg tracking-tight text-white flex items-center gap-1.5">
              <span>TravelMate<span className="text-ai-purple">.AI</span></span>
            </span>
            <span className="text-[10px] text-slate-400 block -mt-1 font-semibold">Team Innovation 27X7</span>
          </div>
        </div>

        {/* Location selector pills */}
        <div className="hidden md:flex items-center gap-1.5 p-1 rounded-full bg-slate-900/80 backdrop-blur-xl border border-white/10 text-xs">
          {SHOWCASE_LOCATIONS.map((loc, i) => (
            <button
              key={loc.city}
              onClick={() => setLocationIndex(i)}
              className={`px-3 py-1 rounded-full font-bold transition-all text-[11px] ${
                i === locationIndex
                  ? 'bg-gradient-to-r from-ai-purple to-ocean-blue text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {loc.city}
            </button>
          ))}
        </div>

        {/* Language selector & quick skips */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs">
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
            className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 transition backdrop-blur-md"
          >
            Landing Page ➔
          </button>
        </div>
      </div>

      {/* ── Center Stage: Location Spotlight & Loading Telemetry ── */}
      <div className="relative z-10 w-full max-w-4xl mx-auto my-auto flex flex-col items-center text-center space-y-8 py-6">
        
        {/* Dynamic Location Badge Card */}
        <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-4 p-2 sm:p-3 px-4 sm:px-6 rounded-2xl sm:rounded-full bg-slate-900/85 backdrop-blur-2xl border border-white/15 shadow-2xl animate-fade-in">
          <div className="flex items-center gap-2 text-xs font-black text-sky-400">
            <MapPin className="w-4 h-4 text-rose-400 animate-bounce" />
            <span className="text-white text-sm font-black">{currentLoc.city}, {currentLoc.country}</span>
            <span className="text-slate-400 font-normal">({currentLoc.region})</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-slate-700" />
          <div className="flex items-center gap-3 text-xs text-slate-300">
            <span className="flex items-center gap-1">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentLoc.temp} • {currentLoc.weather}</span>
            </span>
            <span>•</span>
            <span className="text-ai-purple font-semibold">{currentLoc.flightRoute}</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-ai-purple text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Generation Travel AI Engine</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            The World. Reimagined <br />
            by <span className="bg-gradient-to-r from-ai-purple via-sky-400 to-teal-300 bg-clip-text text-transparent">13 Autonomous Agents.</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            {currentLoc.quote} — Experience unified trip orchestration from Dhanbad to the globe in under 400 milliseconds.
          </p>
        </div>

        {/* Apple-style Progress Ring & Telemetry Card */}
        <div className="w-full max-w-md p-5 rounded-3xl bg-slate-900/90 backdrop-blur-2xl border border-white/15 shadow-2xl space-y-4">
          <div className="flex items-center justify-between text-xs font-bold">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-ai-purple animate-pulse" />
              <span className="text-slate-300">{TELEMETRY_STEPS[telemetryIndex]}</span>
            </div>
            <span className="text-sky-400 font-black">{progress}%</span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden relative">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-ai-purple via-sky-500 to-teal-400 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>256-Bit Encrypted Vault</span>
            </span>
            <span className="text-slate-500">IATA & Amadeus Live</span>
          </div>
        </div>

        {/* ── Journey Flow Action ── */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md pt-2">
          <button
            onClick={() => setCurrentScreen('05-dashboard')}
            className="w-full sm:w-auto flex-1 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-ai-purple via-indigo-600 to-ocean-blue hover:from-purple-500 hover:to-sky-500 text-white font-extrabold text-xs shadow-xl shadow-purple-500/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            <span>{isLoaded ? 'Entering Dashboard...' : 'Launch Dashboard Now'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setCurrentScreen('03-landing')}
            className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-bold border border-white/15 transition-all hover:scale-105 active:scale-95"
          >
            ← Exit to Landing
          </button>
        </div>
      </div>

      {/* ── Bottom Footer ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 border-t border-white/10 pt-4">
        <div className="flex items-center gap-3">
          <span>© 2026 TravelMate AI</span>
          <span>•</span>
          <span>Team Innovation 27X7</span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>13 Agents Mesh Synced</span>
          </span>
          <span>•</span>
          <span className="text-slate-400">Deployed on Vultr Mumbai Cloud</span>
        </div>
      </div>
    </div>
  );
};
