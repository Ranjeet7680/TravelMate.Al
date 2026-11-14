import React, { useState, useEffect } from 'react';
import { useTravel } from '../../context/TravelContext';
import { EXPLORER_DESTINATIONS, formatCurrency } from '../../data/travelData';
import { 
  Sparkles, 
  ArrowRight, 
  Plane, 
  Building2, 
  CalendarDays, 
  MapPin, 
  ShieldCheck, 
  Compass, 
  Search, 
  Calendar, 
  Users, 
  Star, 
  ChevronRight, 
  Zap, 
  CheckCircle2,
  TrendingUp,
  Globe2,
  Lock,
  Cpu,
  Fingerprint,
  RefreshCw,
  Sun,
  Activity,
  Check,
  X,
  Play
} from 'lucide-react';

interface AppleShowcaseDest {
  name: string;
  country: string;
  tag: string;
  temp: string;
  dailyINR: number;
  image: string;
  flightFrom: string;
}

const APPLE_FEATURED_DESTINATIONS: AppleShowcaseDest[] = [
  {
    name: 'Dubai',
    country: 'United Arab Emirates',
    tag: 'Future Skyline & Desert Glamour',
    temp: '28°C',
    dailyINR: 9700,
    flightFrom: 'from ₹32,500 round trip',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Tokyo',
    country: 'Japan',
    tag: 'Neon Metropolises & Mt. Fuji',
    temp: '18°C',
    dailyINR: 11200,
    flightFrom: 'from ₹42,000 round trip',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Paris',
    country: 'France',
    tag: 'Eiffel Sunset & Grand Gastronomy',
    temp: '16°C',
    dailyINR: 14500,
    flightFrom: 'from ₹48,000 round trip',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Bali',
    country: 'Indonesia',
    tag: 'Tropical Sanctuaries & Oceans',
    temp: '29°C',
    dailyINR: 4800,
    flightFrom: 'from ₹26,000 round trip',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Santorini',
    country: 'Greece',
    tag: 'Caldera Cliff Villas & Aegean Blue',
    temp: '24°C',
    dailyINR: 16500,
    flightFrom: 'from ₹52,000 round trip',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Netarhat',
    country: 'India (Jharkhand)',
    tag: 'Queen of Chotanagpur & Pine Valleys',
    temp: '21°C',
    dailyINR: 2200,
    flightFrom: 'Direct Cab from Dhanbad',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
  }
];

export const Screen03_Landing: React.FC = () => {
  const { setCurrentScreen, currency, sendUserPrompt, searchFilter, setSearchFilter } = useTravel();

  const [activeTab, setActiveTab] = useState<'flights' | 'hotels' | 'packages' | 'activities'>('flights');
  const [fromCity, setFromCity] = useState(searchFilter.origin);
  const [toCity, setToCity] = useState(searchFilter.destination);
  const [dates, setDates] = useState(searchFilter.dates);
  const [travellers, setTravellers] = useState(searchFilter.travelers);

  // Apple-style location carousel
  const [activeShowcaseIdx, setActiveShowcaseIdx] = useState(0);

  // Swarm Consensus Live Simulator state
  const [simStep, setSimStep] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);

  // Auto-cycle showcase
  useEffect(() => {
    const t = setInterval(() => {
      setActiveShowcaseIdx(prev => (prev + 1) % APPLE_FEATURED_DESTINATIONS.length);
    }, 4500);
    return () => clearInterval(t);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchFilter({
      origin: fromCity,
      destination: toCity,
      dates,
      travelers: travellers,
      cabinClass: 'Economy',
    });
    setCurrentScreen('06-copilot');
    sendUserPrompt(`I want to travel from ${fromCity} to ${toCity} for 10 days.`);
  };

  const runSwarmSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimStep(1);
    setTimeout(() => setSimStep(2), 600);
    setTimeout(() => setSimStep(3), 1200);
    setTimeout(() => setSimStep(4), 1800);
    setTimeout(() => {
      setSimStep(5);
      setIsSimulating(false);
    }, 2400);
  };

  const showcase = APPLE_FEATURED_DESTINATIONS[activeShowcaseIdx];

  return (
    <div className="space-y-24 pb-24 select-none animate-page-enter">

      {/* ── 1. Apple Hero Section: Typography, Lighting & Dynamic Showcase ── */}
      <section className="relative px-4 pt-12 pb-20 overflow-hidden">
        {/* Apple subtle radial lighting glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-ai-purple/20 via-sky-500/10 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Main Headline & Identity */}
          <div className="text-center space-y-5 max-w-4xl mx-auto animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/5 dark:bg-white/10 border border-slate-200/80 dark:border-white/15 backdrop-blur-xl text-ai-purple text-xs font-bold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-ai-purple" />
              <span>Conceived in Intelligence • Team Innovation 27X7</span>
            </div>

            <h1 className="text-5xl sm:text-7xl font-black text-midnight-navy dark:text-white tracking-tight leading-[1.08]">
              The Future of Travel. <br />
              <span className="bg-gradient-to-r from-ai-purple via-sky-500 to-teal-400 bg-clip-text text-transparent">
                Orchestrated in Real Time.
              </span>
            </h1>

            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
              TravelMate AI deploys a swarm of 13 autonomous agents to discover destinations, compare live GDS airfares, verify IATA visas, and manage your entire itinerary from Dhanbad to the globe.
            </p>

            {/* Apple-style CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
              <button
                onClick={() => {
                  setCurrentScreen('06-copilot');
                  sendUserPrompt('I want to travel from Dhanbad to Dubai for 10 days.');
                }}
                className="btn-primary-gradient px-7 py-4 rounded-2xl font-black text-sm shadow-xl shadow-purple-500/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <span>Plan a Trip with AI</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentScreen('04-login')}
                className="px-7 py-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl text-midnight-navy dark:text-white font-black text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <Lock className="w-4 h-4 text-ai-purple" />
                <span>Sign In / Traveler Vault</span>
              </button>

              <button
                onClick={() => setCurrentScreen('10-destinations')}
                className="px-6 py-4 rounded-2xl text-slate-500 dark:text-slate-400 font-bold text-sm hover:text-ai-purple transition"
              >
                Explore 52 Destinations ➔
              </button>
            </div>
          </div>

          {/* ── Apple Interactive Location Showcase Window ── */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/90 dark:border-white/10 group aspect-[16/9] max-h-[500px]">
            <img
              src={showcase.image}
              alt={showcase.name}
              className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
            />
            {/* Apple gradient scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />

            {/* Top Bar inside showcase */}
            <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
              <div className="flex items-center gap-2 bg-black/60 backdrop-blur-xl px-4 py-1.5 rounded-full border border-white/20 text-white text-xs font-bold shadow-lg">
                <Sun className="w-4 h-4 text-amber-400" />
                <span>{showcase.temp} • {showcase.tag}</span>
              </div>

              {/* Destination selector chips */}
              <div className="hidden sm:flex items-center gap-1.5 p-1 rounded-full bg-black/60 backdrop-blur-xl border border-white/20">
                {APPLE_FEATURED_DESTINATIONS.map((d, i) => (
                  <button
                    key={d.name}
                    onClick={() => setActiveShowcaseIdx(i)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                      i === activeShowcaseIdx
                        ? 'bg-white text-midnight-navy shadow-md font-black'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    {d.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Info & Instant Action */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
              <div className="space-y-1">
                <div className="text-xs text-sky-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{showcase.country}</span>
                </div>
                <h3 className="text-3xl sm:text-5xl font-black drop-shadow-md">
                  {showcase.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-200">
                  {showcase.flightFrom} • Est. Daily Budget: {formatCurrency(showcase.dailyINR, currency)}
                </p>
              </div>

              <button
                onClick={() => {
                  setCurrentScreen('06-copilot');
                  sendUserPrompt(`Plan a comprehensive trip to ${showcase.name}. Include transit from Dhanbad, hotel options, top sights, and estimated budget.`);
                }}
                className="btn-primary-gradient px-6 py-3 rounded-xl font-black text-xs shadow-xl flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
              >
                <span>Plan {showcase.name} with AI</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* ── Apple-Style Unified Search Engine Bar ── */}
          <div className="theme-card p-4 sm:p-6 rounded-3xl space-y-4 border border-slate-200/80 dark:border-white/10 shadow-xl backdrop-blur-2xl">
            {/* Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              {[
                { id: 'flights', label: 'Flights', icon: <Plane className="w-4 h-4" /> },
                { id: 'hotels', label: 'Hotels', icon: <Building2 className="w-4 h-4" /> },
                { id: 'packages', label: 'Holiday Packages', icon: <CalendarDays className="w-4 h-4" /> },
                { id: 'activities', label: 'Sightseeing & Cabs', icon: <Compass className="w-4 h-4" /> },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                    activeTab === tab.id
                      ? 'bg-ai-purple text-white shadow-md shadow-purple-500/20'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Inputs */}
            <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">From (Origin)</label>
                <div className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                  <Plane className="w-3.5 h-3.5 text-sky-500" />
                  <input
                    type="text"
                    value={fromCity}
                    onChange={e => setFromCity(e.target.value)}
                    className="bg-transparent text-xs w-full text-midnight-navy dark:text-white focus:outline-none font-bold"
                    placeholder="Dhanbad / CCU"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">To (Destination)</label>
                <div className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <input
                    type="text"
                    value={toCity}
                    onChange={e => setToCity(e.target.value)}
                    className="bg-transparent text-xs w-full text-midnight-navy dark:text-white focus:outline-none font-bold"
                    placeholder="Dubai DXB"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dates & Duration</label>
                <div className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                  <Calendar className="w-3.5 h-3.5 text-amber-500" />
                  <input
                    type="text"
                    value={dates}
                    onChange={e => setDates(e.target.value)}
                    className="bg-transparent text-xs w-full text-midnight-navy dark:text-white focus:outline-none font-bold"
                    placeholder="15 Nov - 24 Nov"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Travellers</label>
                <div className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                  <Users className="w-3.5 h-3.5 text-emerald-500" />
                  <select
                    value={travellers}
                    onChange={e => setTravellers(Number(e.target.value))}
                    className="bg-transparent text-xs w-full text-midnight-navy dark:text-white focus:outline-none font-bold cursor-pointer"
                  >
                    <option value={1}>1 Solo Traveller</option>
                    <option value={2}>2 Adults</option>
                    <option value={4}>Family (4)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full btn-primary-gradient py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Live</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ── 2. Apple Bento Box Grid: Engineered by Team Innovation 27X7 ── */}
      <section className="max-w-7xl mx-auto px-4 space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-black text-ai-purple uppercase tracking-widest">Architectural Superiority</span>
          <h2 className="text-3xl sm:text-5xl font-black text-midnight-navy dark:text-white tracking-tight">
            Engineered for the Modern Journey.
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Every layer of the travel stack unified under a single intelligent multi-agent mesh.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          
          {/* Bento Card 1: 13-Agent Neural Mesh (Spans 2 cols on lg) */}
          <div className="lg:col-span-2 theme-card p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-purple-500/5 via-sky-500/5 to-transparent group">
            <div className="space-y-4 max-w-md relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-ai-purple text-white flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Cpu className="w-6 h-6" />
              </div>
              <span className="text-xs font-black text-ai-purple uppercase tracking-wider">Multi-Agent Consensus Engine</span>
              <h3 className="text-2xl sm:text-3xl font-black text-midnight-navy dark:text-white">
                13 Autonomous Agents Working as One.
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Rather than forcing you through disconnected booking sites, our Master Orchestrator delegates flight discovery, hotel matching, visa checks, and budget hedging to specialized nodes in parallel.
              </p>
            </div>

            <div className="pt-6 relative z-10 flex items-center gap-3">
              <button
                onClick={() => setCurrentScreen('06-copilot')}
                className="btn-primary-gradient px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-md shadow-purple-500/20"
              >
                <span>Watch the Mesh Live</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Sub-400ms Decision Speed</span>
              </span>
            </div>

            {/* Ambient Background Graphic */}
            <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-purple-500/10 blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />
          </div>

          {/* Bento Card 2: Amadeus GDS Airfare Engine */}
          <div className="theme-card p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center shadow-lg shadow-sky-500/30">
                <Plane className="w-6 h-6" />
              </div>
              <span className="text-xs font-black text-sky-500 uppercase tracking-wider">Global Distribution System</span>
              <h3 className="text-xl sm:text-2xl font-black text-midnight-navy dark:text-white">
                Direct GDS Airfare Feeds.
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Connect directly into airline reservation trunks (Emirates, IndiGo, Air India, Singapore Airlines) with guaranteed seat reservations and 24-hour price-lock tracking.
              </p>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 text-xs font-bold text-sky-500 flex items-center justify-between">
              <span>Amadeus API Certified</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Bento Card 3: IATA Timatic Visa Engine */}
          <div className="theme-card p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-xs font-black text-emerald-500 uppercase tracking-wider">Immigration & Entry</span>
              <h3 className="text-xl sm:text-2xl font-black text-midnight-navy dark:text-white">
                Instant IATA Timatic Visa Checks.
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Passport validity requirements, eVisa processing windows, and visa-free access verified for Indian and worldwide travelers in milliseconds.
              </p>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 text-xs font-bold text-emerald-500 flex items-center justify-between">
              <span>195+ Passports Supported</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Bento Card 4: Multi-Currency Treasury */}
          <div className="theme-card p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30">
                <TrendingUp className="w-6 h-6" />
              </div>
              <span className="text-xs font-black text-amber-500 uppercase tracking-wider">Zero-Markup Treasury</span>
              <h3 className="text-xl sm:text-2xl font-black text-midnight-navy dark:text-white">
                Live FX & UPI Price Lock.
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Seamless conversion across INR, USD, AED, and EUR with zero hidden bank surcharges, instant UPI checkout, and dynamic budget envelopes.
              </p>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 text-xs font-bold text-amber-500 flex items-center justify-between">
              <span>Transparent Pricing</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Bento Card 5: Doorstep Mobility & Rentals */}
          <div className="theme-card p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/30">
                <Compass className="w-6 h-6" />
              </div>
              <span className="text-xs font-black text-rose-500 uppercase tracking-wider">Intercity & Local Mobility</span>
              <h3 className="text-xl sm:text-2xl font-black text-midnight-navy dark:text-white">
                Doorstep Cabs, SUVs & Bikes.
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Dedicated outstation sedans from Dhanbad to Kolkata, Ranchi, and Deoghar, plus self-drive SUVs and Royal Enfield bikes for Goa, Manali, and Ladakh.
              </p>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 text-xs font-bold text-rose-500 flex items-center justify-between">
              <span>Verified Chauffeurs & Fleet</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Interactive Swarm Consensus Simulator Section ── */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="theme-card p-8 sm:p-12 rounded-3xl border border-purple-500/30 shadow-2xl bg-gradient-to-br from-slate-900 via-midnight-navy to-slate-950 text-white relative overflow-hidden">
          <div className="max-w-2xl space-y-4">
            <span className="px-3 py-1 rounded-full bg-ai-purple text-white text-[10px] font-black uppercase tracking-wider">
              Live Swarm Telemetry
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Watch the Swarm Formulate Consensus.
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Experience the inner workings of our 13-agent engine as it breaks down a natural language request, queries external networks, and delivers an executable itinerary in real time.
            </p>

            <button
              onClick={runSwarmSimulation}
              disabled={isSimulating}
              className="btn-primary-gradient px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-500/30 disabled:opacity-50"
            >
              {isSimulating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{isSimulating ? 'Agents Debating in Parallel...' : 'Run Swarm Simulation'}</span>
            </button>
          </div>

          {/* Interactive Steps Visualizer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-10">
            {[
              {
                step: 1,
                agent: 'Master Orchestrator',
                action: 'Intent Decomposition',
                detail: 'Analyzed: Dhanbad ➔ Dubai (10 Days, 2 Travelers, ₹97k budget)',
                active: simStep >= 1
              },
              {
                step: 2,
                agent: 'Flight & Hotel Agents',
                action: 'Concurrent GDS Probe',
                detail: 'Emirates EK 571 direct locked + Rove Downtown 4★ with Burj Khalifa views',
                active: simStep >= 2
              },
              {
                step: 3,
                agent: 'Visa & Budget Agents',
                action: 'IATA & FX Hedging',
                detail: '30-Day UAE eVisa confirmed + Total cost locked at ₹97,000 INR',
                active: simStep >= 3
              },
              {
                step: 4,
                agent: 'Fulfillment Engine',
                action: 'Consensus Minted',
                detail: 'Executable itinerary, PNR vouchers, and scannable boarding passes ready',
                active: simStep >= 4
              }
            ].map(item => (
              <div
                key={item.step}
                className={`p-5 rounded-2xl border transition-all duration-500 ${
                  item.active
                    ? 'border-ai-purple bg-white/10 shadow-lg shadow-purple-500/20 translate-y-0 opacity-100'
                    : 'border-white/10 bg-white/5 opacity-50 translate-y-1'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold mb-2">
                  <span className={item.active ? 'text-ai-purple' : 'text-slate-400'}>STEP 0{item.step}</span>
                  {item.active && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </div>
                <div className="font-extrabold text-sm text-white">{item.agent}</div>
                <div className="text-xs text-sky-400 font-semibold mt-0.5">{item.action}</div>
                <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Apple-Style Security & Privacy Fortress Section ── */}
      <section className="max-w-7xl mx-auto px-4 space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">Fortress-Grade Safeguards</span>
          <h2 className="text-3xl sm:text-5xl font-black text-midnight-navy dark:text-white tracking-tight">
            Privacy. Built Right into the Journey.
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Your travel identity, biometric tokens, and government documents are encrypted client-side and never sold.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              icon: Lock,
              title: '256-Bit AES TLS',
              desc: 'End-to-end military grade encryption protecting all booking data in transit and at rest.'
            },
            {
              icon: Fingerprint,
              title: 'Passkeys & Biometrics',
              desc: 'Seamless passwordless authentication with Face ID, Touch ID, and WebAuthn standards.'
            },
            {
              icon: ShieldCheck,
              title: 'Zero-Knowledge Vault',
              desc: 'Passports, boarding passes, and visa vouchers are stored exclusively in your local device enclave.'
            },
            {
              icon: Activity,
              title: '24/7 SOS Satellite Lifeline',
              desc: 'Direct priority links to local embassies, hospitals, and emergency consular services in 195 countries.'
            }
          ].map(sec => (
            <div
              key={sec.title}
              className="theme-card p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-lg space-y-3"
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center font-bold">
                <sec.icon className="w-5 h-5" />
              </div>
              <h3 className="font-black text-base text-midnight-navy dark:text-white">{sec.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{sec.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. Why TravelMate AI vs Traditional Portals (Apple Comparison Matrix) ── */}
      <section className="max-w-7xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-black text-ai-purple uppercase tracking-widest">The Paradigm Shift</span>
          <h2 className="text-3xl sm:text-5xl font-black text-midnight-navy dark:text-white tracking-tight">
            Travel Portals vs TravelMate AI.
          </h2>
        </div>

        <div className="theme-card rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 dark:bg-slate-800/80 text-midnight-navy dark:text-white font-black text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-4 sm:p-5">Capability</th>
                  <th className="p-4 sm:p-5 text-slate-400">Traditional Portals (MMT / Expedia)</th>
                  <th className="p-4 sm:p-5 text-ai-purple bg-purple-500/10">TravelMate AI Copilot</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {[
                  {
                    feature: 'Autonomous Trip Generation',
                    trad: 'Manual fragmented searches across 12 tabs',
                    us: '13-Agent Neural Mesh generates complete day plan'
                  },
                  {
                    feature: 'Live IATA Visa Verification',
                    trad: 'None; redirects to third-party visa agents',
                    us: 'Instant IATA Timatic verification in 400ms'
                  },
                  {
                    feature: 'Dynamic Budget Optimization',
                    trad: 'Static prices + hidden convenience markups',
                    us: 'Zero FX markups with dynamic currency envelopes'
                  },
                  {
                    feature: 'Doorstep Mobility (Cabs & Fleet)',
                    trad: 'Requires separate ride-hailing apps',
                    us: 'Outstation cabs, sedans & self-drive bikes included'
                  },
                  {
                    feature: 'Voice & Multilingual AI',
                    trad: 'Static text input only',
                    us: 'Bilingual voice speech-to-text with dialect awareness'
                  },
                  {
                    feature: '24/7 SOS & Emergency Consular',
                    trad: 'Email ticket support with 24-hr delay',
                    us: 'Instant SOS dispatch with GPS and embassy hotlines'
                  }
                ].map(row => (
                  <tr key={row.feature} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="p-4 sm:p-5 font-bold text-midnight-navy dark:text-white">{row.feature}</td>
                    <td className="p-4 sm:p-5 text-slate-400 flex items-center gap-2">
                      <X className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{row.trad}</span>
                    </td>
                    <td className="p-4 sm:p-5 font-bold text-midnight-navy dark:text-white bg-purple-500/5">
                      <div className="flex items-center gap-2 text-ai-purple font-extrabold">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{row.us}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── 6. Apple-Style Call-to-Action Finale ── */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-tr from-ai-purple via-indigo-700 to-ocean-blue text-white text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <span className="px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider">
              HackGlobal 2026 Submission
            </span>
            <h2 className="text-3xl sm:text-6xl font-black tracking-tight leading-tight">
              Your Next Journey Begins Here.
            </h2>
            <p className="text-slate-100 text-xs sm:text-base leading-relaxed">
              No subscription, no vendor lock-in. Experience true virtual travel assistance powered by Vultr Cloud Compute and 13 autonomous AI agents.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                onClick={() => setCurrentScreen('06-copilot')}
                className="px-8 py-4 rounded-2xl bg-white text-midnight-navy font-black text-sm shadow-2xl hover:bg-slate-100 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <span>Launch AI Copilot</span>
                <ArrowRight className="w-4 h-4 text-ai-purple" />
              </button>

              <button
                onClick={() => setCurrentScreen('05-dashboard')}
                className="px-8 py-4 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/25 text-white font-black text-sm transition-all hover:scale-105 active:scale-95"
              >
                Open Dashboard
              </button>
            </div>
          </div>

          {/* Decorative blur rings */}
          <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-sky-400/20 blur-3xl pointer-events-none" />
        </div>
      </section>

    </div>
  );
};
