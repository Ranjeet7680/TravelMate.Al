import React, { useState, useEffect, useRef } from 'react';
import { useTravel } from '../../context/TravelContext';
import { EXPLORER_DESTINATIONS, formatCurrency } from '../../data/travelData';
import { 
  Sparkles, 
  Plane, 
  Building2, 
  CalendarDays, 
  ShieldCheck, 
  MapPin, 
  Star, 
  Heart, 
  ArrowRight, 
  Search, 
  Bell, 
  Coins, 
  Ticket,
  ChevronRight,
  TrendingUp,
  Zap,
  Clock,
  Globe2,
  Navigation
} from 'lucide-react';

// ── Animated counter hook ─────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1200, startDelay = 0) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      const steps = 60;
      const increment = target / steps;
      let current = 0;
      let step = 0;
      const id = setInterval(() => {
        step++;
        current = Math.min(Math.round(increment * step), target);
        setCount(current);
        if (step >= steps) clearInterval(id);
      }, duration / steps);
      return () => clearInterval(id);
    }, startDelay);
    return () => clearTimeout(timer);
  }, [target, duration, startDelay]);
  return count;
}

// ── Stat Card with animated counter ──────────────────────────────────────────
const StatCard: React.FC<{
  icon: React.ReactNode;
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  color: string;
  delay?: number;
}> = ({ icon, value, prefix = '', suffix = '', label, color, delay = 0 }) => {
  const animated = useCountUp(value, 1200, delay);
  return (
    <div className={`theme-card rounded-2xl p-4 flex items-center gap-3 card-lift border-l-4 ${color}`}>
      <div className="w-10 h-10 rounded-xl bg-current/10 flex items-center justify-center shrink-0 opacity-80">
        {icon}
      </div>
      <div>
        <div className="text-xl font-black text-midnight-navy dark:text-white leading-none">
          {prefix}{animated.toLocaleString()}{suffix}
        </div>
        <div className="text-[11px] text-slate-400 font-medium mt-0.5">{label}</div>
      </div>
    </div>
  );
};

export const Screen05_Dashboard: React.FC = () => {
  const { 
    userProfile, 
    activeTrip, 
    currency, 
    setCurrentScreen, 
    sendUserPrompt,
    savedDestinations,
    toggleSaveDestination,
    notifications,
    setNotificationModalOpen 
  } = useTravel();

  const unreadCount = notifications.filter(n => !n.read).length;
  const [daysLeft, setDaysLeft] = useState(11);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const quickActions = [
    { id: 'ai', icon: <Sparkles className="w-5 h-5" />, label: 'Plan with AI', color: 'bg-purple-500/15 text-ai-purple', border: 'hover:border-ai-purple', glow: 'hover:shadow-purple-500/20', screen: '06-copilot' as const },
    { id: 'flight', icon: <Plane className="w-5 h-5" />, label: 'Book Flight', color: 'bg-sky-500/15 text-sky-500', border: 'hover:border-sky-500', glow: 'hover:shadow-sky-500/20', screen: '08-flights' as const },
    { id: 'hotel', icon: <Building2 className="w-5 h-5" />, label: 'Book Hotel', color: 'bg-teal-500/15 text-teal-500', border: 'hover:border-teal-500', glow: 'hover:shadow-teal-500/20', screen: '09-hotels' as const },
    { id: 'plan', icon: <CalendarDays className="w-5 h-5" />, label: 'Create Itinerary', color: 'bg-emerald-500/15 text-emerald-500', border: 'hover:border-emerald-500', glow: 'hover:shadow-emerald-500/20', screen: '07-planner' as const },
    { id: 'visa', icon: <ShieldCheck className="w-5 h-5" />, label: 'Check Visa', color: 'bg-blue-500/15 text-ocean-blue', border: 'hover:border-ocean-blue', glow: 'hover:shadow-blue-500/20', screen: '13-visa' as const },
  ];

  return (
    <div className="space-y-7 pb-16 select-none max-w-7xl mx-auto px-4 sm:px-6 animate-page-enter">

      {/* ── Top Welcome Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 animate-slide-up">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-midnight-navy dark:text-white flex items-center gap-2 flex-wrap">
            <span>Hello, {userProfile.name}!</span>
            <span className="text-2xl animate-bounce" style={{ animationDuration: '2s' }}>👋</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Ready for your next adventure? Your Dubai trip is{' '}
            <span className="font-black text-ai-purple">{daysLeft} days away.</span>
          </p>
        </div>

        {/* Top right: search + notification + profile */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setCurrentScreen('10-destinations')}
            className="p-2.5 rounded-full theme-card hover:bg-slate-100 dark:hover:bg-slate-800 transition-all hover:scale-110"
            title="Search destinations"
          >
            <Search className="w-4 h-4 text-slate-500 dark:text-slate-300" />
          </button>

          <button
            onClick={() => setNotificationModalOpen(true)}
            className="p-2.5 rounded-full theme-card hover:bg-slate-100 dark:hover:bg-slate-800 transition-all hover:scale-110 relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4 text-slate-500 dark:text-slate-300" />
            {unreadCount > 0 && (
              <>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
              </>
            )}
          </button>

          <div
            onClick={() => setCurrentScreen('17-profile')}
            className="flex items-center gap-2 px-2 py-1 rounded-full theme-card cursor-pointer hover:border-ai-purple transition-all hover:shadow-md"
          >
            <img
              src={userProfile.avatar}
              alt={userProfile.name}
              className="w-8 h-8 rounded-full object-cover border-2 border-purple-400"
            />
            <span className="text-xs font-black text-midnight-navy dark:text-white hidden sm:inline pr-1">
              {userProfile.name}
            </span>
          </div>
        </div>
      </div>

      {/* ── Hero Trip Card: Dubai Adventure ── */}
      <div
        onClick={() => setCurrentScreen('11-itinerary')}
        className="relative rounded-3xl overflow-hidden shadow-2xl cursor-pointer group transition-all duration-500 hover:shadow-purple-500/20 animate-slide-up"
        style={{ animationDelay: '0.1s' }}
      >
        {/* Background image */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&q=80"
            alt="Dubai Skyline"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          {/* Dynamic gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-midnight-navy/92 via-midnight-navy/55 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-midnight-navy/70 via-transparent to-transparent" />
          
          {/* Ambient glow on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-ai-purple/0 to-ocean-blue/0 group-hover:from-ai-purple/15 group-hover:to-ocean-blue/5 transition-all duration-500" />
        </div>

        {/* Content overlay */}
        <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between text-white">
          {/* Top badge */}
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400/25 text-amber-300 border border-amber-400/40 text-xs font-black backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Your Next Trip</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-xs font-black">
              <Clock className="w-3.5 h-3.5 text-sky-300" />
              <span className="text-sky-200">{daysLeft} Days to Departure</span>
            </div>
          </div>

          {/* Title & metadata */}
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-none group-hover:text-sky-200 transition-colors duration-300">
              {activeTrip.title}
            </h2>
            
            <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-xs">
              <span className="flex items-center gap-1.5 text-slate-200">
                <CalendarDays className="w-4 h-4 text-sky-400" />
                <span>{activeTrip.startDate} – {activeTrip.endDate} (10 Days)</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-200">
                <Navigation className="w-4 h-4 text-rose-400" />
                <span>{activeTrip.origin} ➔ {activeTrip.destination}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-emerald-400" />
                <span className="font-black text-emerald-300 text-sm">Budget: {formatCurrency(activeTrip.budgetBreakdown.totalINR, currency)}</span>
              </span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-sky-300 font-bold flex items-center gap-1.5 group-hover:translate-x-2 transition-transform duration-300">
                <span>View Day-by-Day Master Itinerary</span>
                <ArrowRight className="w-4 h-4" />
              </span>

              {/* Budget progress pill */}
              <div className="flex items-center gap-2">
                <div className="w-24 h-1.5 rounded-full bg-white/20 overflow-hidden">
                  <div className="h-full w-[65%] rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 animate-progress-fill" />
                </div>
                <span className="text-[10px] font-bold text-emerald-300">65% planned</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-slide-up stagger-children" style={{ animationDelay: '0.15s' }}>
        <StatCard icon={<Plane className="w-5 h-5 text-sky-500" />} value={3} suffix=" Flights" label="Saved Flights" color="border-l-sky-400" delay={0} />
        <StatCard icon={<Building2 className="w-5 h-5 text-teal-500" />} value={4} suffix=" Hotels" label="Shortlisted" color="border-l-teal-400" delay={100} />
        <StatCard icon={<Globe2 className="w-5 h-5 text-ai-purple" />} value={10} suffix=" Days" label="Trip Duration" color="border-l-purple-400" delay={200} />
        <StatCard icon={<TrendingUp className="w-5 h-5 text-emerald-500" />} value={97000} prefix="₹" label="Total Budget" color="border-l-emerald-400" delay={300} />
      </div>

      {/* ── Quick Actions Grid ── */}
      <div className="space-y-3 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-accent-gold" />
            Quick Travel Actions
          </h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 stagger-children">
          {quickActions.map(action => (
            <button
              key={action.id}
              onClick={() => {
                if (action.id === 'ai') {
                  setCurrentScreen('06-copilot');
                  sendUserPrompt('I want to travel from Dhanbad to Dubai for 10 days.');
                } else {
                  setCurrentScreen(action.screen);
                }
              }}
              onMouseEnter={() => setHoveredCard(action.id)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`p-4 rounded-2xl theme-card card-lift flex flex-col items-center justify-center text-center space-y-2.5 border transition-all duration-300 hover:shadow-lg ${action.border} ${action.glow} ${action.id === 'visa' ? 'col-span-2 sm:col-span-1' : ''}`}
            >
              <div className={`w-11 h-11 rounded-2xl ${action.color} flex items-center justify-center transition-all duration-300 ${hoveredCard === action.id ? 'scale-110 rotate-6' : ''}`}>
                {action.icon}
              </div>
              <span className="text-xs font-black text-midnight-navy dark:text-white">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Recommended for You ── */}
      <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.25s' }}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-midnight-navy dark:text-white">
            Recommended for You
          </h2>
          <button
            onClick={() => setCurrentScreen('10-destinations')}
            className="text-xs font-bold text-ai-purple hover:underline flex items-center gap-1 group"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Destination Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 stagger-children">
          {EXPLORER_DESTINATIONS.slice(0, 3).map((dest, idx) => {
            const isSaved = savedDestinations.includes(dest.id);
            return (
              <div
                key={dest.id}
                onClick={() => {
                  if (dest.name === 'Dubai') {
                    setCurrentScreen('11-itinerary');
                  } else {
                    setCurrentScreen('06-copilot');
                    sendUserPrompt(`Tell me more about traveling to ${dest.name}, ${dest.country}`);
                  }
                }}
                className="theme-card card-lift rounded-3xl overflow-hidden cursor-pointer group flex flex-col animate-slide-up"
                style={{ animationDelay: `${0.1 + idx * 0.08}s` }}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    style={{ transform: 'scale(1)' }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-midnight-navy/70 via-midnight-navy/10 to-transparent" />

                  {/* Heart button */}
                  <button
                    onClick={e => { e.stopPropagation(); toggleSaveDestination(dest.id); }}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md border transition-all duration-200 ${
                      isSaved
                        ? 'bg-rose-500 border-rose-400 text-white scale-110'
                        : 'bg-black/35 border-white/20 text-white hover:bg-black/55 hover:scale-110'
                    }`}
                  >
                    <Heart className={`w-4 h-4 transition-transform ${isSaved ? 'fill-white scale-110' : ''}`} />
                  </button>

                  {/* Destination info */}
                  <div className="absolute bottom-3 left-3 text-white">
                    <h4 className="font-black text-lg leading-tight">{dest.name}</h4>
                    <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" />
                      {dest.country}
                    </p>
                  </div>

                  {/* Rating badge */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-midnight-navy/60 backdrop-blur-md px-2.5 py-1 rounded-full">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-black text-amber-300">{dest.rating}</span>
                  </div>
                </div>

                {/* Card footer */}
                <div className="p-4 flex items-center justify-between bg-white dark:bg-slate-900">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Est. Daily Budget</span>
                    <span className="font-black text-sm text-midnight-navy dark:text-white">
                      {formatCurrency(dest.dailyBudgetINR, currency)}
                    </span>
                  </div>
                  <span className="text-ai-purple font-bold text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-200">
                    <span>Explore</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── AI Copilot CTA Banner ── */}
      <div
        onClick={() => setCurrentScreen('06-copilot')}
        className="relative overflow-hidden rounded-3xl p-6 cursor-pointer group animate-slide-up"
        style={{ animationDelay: '0.3s' }}
      >
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-ai-purple via-ocean-blue to-travel-teal" />
        <div className="absolute inset-0 opacity-30">
          <div className="ambient-orb w-64 h-64 bg-white top-[-30%] left-[-10%]" style={{ animationDuration: '8s' }} />
          <div className="ambient-orb w-48 h-48 bg-white bottom-[-20%] right-[5%]" style={{ animationDuration: '12s', animationDelay: '3s' }} />
        </div>

        <div className="relative flex items-center justify-between gap-4">
          <div className="text-white space-y-1">
            <div className="flex items-center gap-2 text-sm font-black">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
              <span>Your AI Travel Copilot is ready</span>
            </div>
            <p className="text-xs text-white/75 leading-relaxed max-w-sm">
              Ask anything about your Dubai trip — flights, hotels, visa, itinerary, budget. 13 specialized agents are standing by.
            </p>
          </div>
          <div className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white font-black text-sm transition-all group-hover:translate-x-1 shrink-0">
            <span>Ask Now</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

    </div>
  );
};
