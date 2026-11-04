import React, { useState } from 'react';
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
  Globe2
} from 'lucide-react';

export const Screen03_Landing: React.FC = () => {
  const { setCurrentScreen, currency, sendUserPrompt, searchFilter, setSearchFilter } = useTravel();

  const [activeTab, setActiveTab] = useState<'flights' | 'hotels' | 'packages' | 'activities'>('flights');
  const [fromCity, setFromCity] = useState(searchFilter.origin);
  const [toCity, setToCity] = useState(searchFilter.destination);
  const [dates, setDates] = useState(searchFilter.dates);
  const [travellers, setTravellers] = useState(searchFilter.travelers);

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

  return (
    <div className="space-y-16 pb-20 select-none">
      {/* Hero Section matching the user's mockup image top-middle */}
      <section className="relative px-4 pt-10 pb-16 overflow-hidden bg-gradient-to-b from-purple-900/10 via-sky-900/5 to-transparent">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Hero text & Visual side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5 text-left">
              {/* Badge matching mockup */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-ai-purple text-xs font-bold shadow-sm">
                <Sparkles className="w-4 h-4 text-ai-purple" />
                <span>AI-Powered Travel Planning</span>
              </div>

              {/* Main Heading matching mockup */}
              <h1 className="text-4xl sm:text-6xl font-black text-midnight-navy dark:text-white tracking-tight leading-tight">
                Plan • Book • Travel <br />
                with <span className="bg-gradient-to-r from-ai-purple via-ocean-blue to-purple-400 bg-clip-text text-transparent">Your AI Copilot</span>
              </h1>

              {/* Subtitle matching mockup */}
              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
                Your personal AI travel agent to discover destinations, create itineraries, find the best flights & hotels, and manage your entire trip — all in one place.
              </p>

              {/* Action Buttons matching mockup */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setCurrentScreen('06-copilot');
                    sendUserPrompt('I want to travel from Dhanbad to Dubai for 10 days.');
                  }}
                  className="btn-primary-gradient px-6 py-3.5 rounded-2xl font-bold text-xs shadow-xl shadow-purple-500/25 transition flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Plan a Trip with AI</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setCurrentScreen('10-destinations')}
                  className="px-6 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900 text-midnight-navy dark:text-slate-200 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Explore Destinations
                </button>
              </div>
            </div>

            {/* Right Traveler Image with "Explore the World with AI" badge */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 aspect-[4/3] group">
                <img
                  src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80"
                  alt="Backpacker exploring world"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-midnight-navy/60 via-transparent to-transparent" />
                
                {/* Floating pill badge matching mockup */}
                <div className="absolute top-4 right-4 bg-midnight-navy/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg">
                  <span>Explore the World with AI</span>
                  <Plane className="w-3.5 h-3.5 text-sky-400 fill-sky-400" />
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="text-[11px] font-semibold text-purple-300 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>Dubai • Bali • Tokyo • Paris</span>
                  </div>
                  <div className="text-sm font-black">Curated by 11 Autonomous AI Agents</div>
                </div>
              </div>
            </div>
          </div>

          {/* Search Engine Bar */}
          <div className="theme-card p-4 sm:p-6 rounded-3xl space-y-4">
            {/* Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              {[
                { id: 'flights', label: 'Flights', icon: <Plane className="w-4 h-4" /> },
                { id: 'hotels', label: 'Hotels', icon: <Building2 className="w-4 h-4" /> },
                { id: 'packages', label: 'Packages', icon: <CalendarDays className="w-4 h-4" /> },
                { id: 'activities', label: 'Activities', icon: <Compass className="w-4 h-4" /> },
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
                <label className="text-[10px] font-bold text-slate-400 uppercase">From (Origin)</label>
                <div className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                  <Plane className="w-3.5 h-3.5 text-sky-500" />
                  <input
                    type="text"
                    value={fromCity}
                    onChange={e => setFromCity(e.target.value)}
                    className="bg-transparent text-xs w-full text-midnight-navy dark:text-white focus:outline-none"
                    placeholder="Dhanbad / CCU"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">To (Destination)</label>
                <div className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <input
                    type="text"
                    value={toCity}
                    onChange={e => setToCity(e.target.value)}
                    className="bg-transparent text-xs w-full text-midnight-navy dark:text-white focus:outline-none"
                    placeholder="Dubai DXB"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Dates & Duration</label>
                <div className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                  <Calendar className="w-3.5 h-3.5 text-amber-500" />
                  <input
                    type="text"
                    value={dates}
                    onChange={e => setDates(e.target.value)}
                    className="bg-transparent text-xs w-full text-midnight-navy dark:text-white focus:outline-none"
                    placeholder="15 Nov - 24 Nov"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Travellers</label>
                <div className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                  <Users className="w-3.5 h-3.5 text-emerald-500" />
                  <select
                    value={travellers}
                    onChange={e => setTravellers(Number(e.target.value))}
                    className="bg-transparent text-xs w-full text-midnight-navy dark:text-white focus:outline-none"
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
                  className="w-full btn-primary-gradient py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Live</span>
                </button>
              </div>
            </form>
          </div>

          {/* Quick 6 Feature Cards along bottom matching mockup */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { title: 'Flights', desc: 'Compare & Book', icon: <Plane className="w-6 h-6 text-sky-500" />, screen: '08-flights' },
              { title: 'Hotels', desc: 'Best Stays', icon: <Building2 className="w-6 h-6 text-teal-500" />, screen: '09-hotels' },
              { title: 'Itineraries', desc: 'AI Trip Plans', icon: <CalendarDays className="w-6 h-6 text-ai-purple" />, screen: '11-itinerary' },
              { title: 'Destinations', desc: 'Explore Places', icon: <MapPin className="w-6 h-6 text-rose-500" />, screen: '10-destinations' },
              { title: 'Visa Guide', desc: 'Rules & Documents', icon: <ShieldCheck className="w-6 h-6 text-cyan-500" />, screen: '13-visa' },
              { title: 'More', desc: 'Transport, Activities...', icon: <Compass className="w-6 h-6 text-amber-500" />, screen: '12-budget' },
            ].map(card => (
              <div
                key={card.title}
                onClick={() => setCurrentScreen(card.screen as any)}
                className="theme-card theme-card-hover p-4 rounded-2xl cursor-pointer text-center flex flex-col items-center justify-center space-y-2 group"
              >
                <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 group-hover:scale-110 transition duration-300">
                  {card.icon}
                </div>
                <div>
                  <div className="font-extrabold text-xs text-midnight-navy dark:text-white">{card.title}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{card.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Curated Destinations */}
      <section className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-ai-purple uppercase tracking-wider">Destination Agent Suggestions</span>
            <h2 className="text-2xl sm:text-3xl font-black text-midnight-navy dark:text-white">
              Trending International Destinations
            </h2>
          </div>
          <button
            onClick={() => setCurrentScreen('10-destinations')}
            className="text-xs font-bold text-ai-purple hover:underline flex items-center gap-1"
          >
            <span>View All Destinations</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {EXPLORER_DESTINATIONS.slice(0, 3).map(dest => (
            <div
              key={dest.id}
              onClick={() => {
                if (dest.name === 'Dubai') {
                  setCurrentScreen('11-itinerary');
                } else {
                  setCurrentScreen('06-copilot');
                  sendUserPrompt(`Plan a 7-day trip to ${dest.name}, ${dest.country}`);
                }
              }}
              className="theme-card theme-card-hover rounded-3xl overflow-hidden cursor-pointer group flex flex-col justify-between"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>{dest.rating}</span>
                  <span className="text-slate-400 font-normal">({dest.reviews})</span>
                </div>
                <div className="absolute top-3 right-3 bg-ai-purple text-white px-2.5 py-1 rounded-full text-[10px] font-bold">
                  {dest.tag}
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-base text-midnight-navy dark:text-white">{dest.name}</h3>
                    <p className="text-xs text-slate-400">{dest.country}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400">Daily Est.</div>
                    <div className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(dest.dailyBudgetINR, currency)}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {dest.highlights.map(h => (
                    <span key={h} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Platform Conversions & Trust Stats */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="p-8 rounded-3xl bg-midnight-navy text-white grid grid-cols-2 lg:grid-cols-4 gap-6 text-center shadow-xl">
          <div className="space-y-1">
            <div className="text-3xl font-black text-sky-400">42%</div>
            <div className="text-xs font-bold">Higher Booking Conversion</div>
            <div className="text-[10px] text-slate-400">Faster than legacy portals</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-black text-purple-400">11 Agents</div>
            <div className="text-xs font-bold">Multi-Agent AI Swarm</div>
            <div className="text-[10px] text-slate-400">Collaborating autonomously</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-black text-emerald-400">180K+</div>
            <div className="text-xs font-bold">Itineraries Generated</div>
            <div className="text-[10px] text-slate-400">Across 140 countries</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-black text-amber-400">24/7 SOS</div>
            <div className="text-xs font-bold">Emergency Guardian</div>
            <div className="text-[10px] text-slate-400">Police & Consulate line</div>
          </div>
        </div>
      </section>
    </div>
  );
};
