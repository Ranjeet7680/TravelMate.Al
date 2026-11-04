import React, { useState, useMemo } from 'react';
import { useTravel } from '../../context/TravelContext';
import { EXPLORER_DESTINATIONS, INDIAN_STATES_DATA, formatCurrency } from '../../data/travelData';
import { DestinationItem } from '../../types';
import { 
  MapPin, 
  Search, 
  Star, 
  Heart, 
  Calendar, 
  Utensils, 
  Coins, 
  ArrowRight, 
  Sparkles, 
  Compass, 
  ShieldCheck,
  Navigation,
  Filter,
  Check,
  Columns,
  X,
  Clock,
  Layers,
  Plane,
  Car,
  ChevronDown,
  Info
} from 'lucide-react';

export const Screen10_DestinationExplorer: React.FC = () => {
  const { 
    currency, 
    setCurrentScreen, 
    sendUserPrompt, 
    savedDestinations, 
    toggleSaveDestination,
    openMarketplace 
  } = useTravel();

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedExperience, setSelectedExperience] = useState<string>('All');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [maxDistance, setMaxDistance] = useState<string>('All');
  const [budgetTier, setBudgetTier] = useState<string>('All');
  const [onlyWeekend, setOnlyWeekend] = useState<boolean>(false);

  // Detail / Comparison Modal state
  const [selectedDest, setSelectedDest] = useState<DestinationItem>(EXPLORER_DESTINATIONS[0]);
  const [compareDest, setCompareDest] = useState<DestinationItem | null>(null);
  const [showComparisonModal, setShowComparisonModal] = useState<boolean>(false);

  // Region options
  const regions = [
    { id: 'All', label: 'All Destinations 🌍' },
    { id: 'India', label: 'India 🇮🇳 (Domestic)' },
    { id: 'Asia', label: 'Asia 🌏' },
    { id: 'Europe', label: 'Europe 🏰' },
    { id: 'Americas', label: 'Americas 🗽' },
  ];

  // Travel experiences
  const experiences = [
    'All',
    'Adventure',
    'Beach',
    'Culture',
    'Nature',
    'Religious',
    'City',
    'Hill Station',
    'Luxury'
  ];

  // Multilingual mapping dictionary for Hindi search queries
  const hindiNameMap: Record<string, string> = {
    'धनबाद': 'dhanbad',
    'रांची': 'ranchi',
    'देवघर': 'deoghar',
    'नेतरहाट': 'netarhat',
    'बेतला': 'betla',
    'कोलकाता': 'kolkata',
    'दार्जिलिंग': 'darjeeling',
    'दीघा': 'digha',
    'बोधगया': 'bodhgaya',
    'राजगीर': 'rajgir',
    'वाराणसी': 'varanasi',
    'काशी': 'varanasi',
    'अयोध्या': 'ayodhya',
    'आगरा': 'agra',
    'दिल्ली': 'delhi',
    'जयपुर': 'jaipur',
    'उदयपुर': 'udaipur',
    'गोवा': 'goa',
    'केरल': 'munnar',
    'मुन्नार': 'munnar',
    'मनाली': 'manali',
    'ऋषिकेश': 'rishikesh',
    'कश्मीर': 'kashmir',
    'श्रीनगर': 'kashmir',
    'लद्दाख': 'leh',
    'लेह': 'leh',
    'गंगटोक': 'gangtok',
    'सिक्किम': 'gangtok',
    'शिलांग': 'shillong',
    'अंडमान': 'andaman',
    'दुबई': 'dubai',
    'बाली': 'bali',
    'सिंगापुर': 'singapore',
    'बैंकॉक': 'bangkok',
    'टोक्यो': 'tokyo',
    'पेरिस': 'paris',
    'स्विट्जरलैंड': 'swiss',
  };

  // Filter logic
  const filtered = useMemo(() => {
    return EXPLORER_DESTINATIONS.filter(d => {
      // 1. Search Query (supports English and Hindi queries)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const hindiTarget = hindiNameMap[q] || '';
        const matchTitle = d.name.toLowerCase().includes(q) || d.city.toLowerCase().includes(q) || d.state.toLowerCase().includes(q) || d.country.toLowerCase().includes(q);
        const matchHighlights = d.highlights.some(h => h.toLowerCase().includes(q));
        const matchHindi = hindiTarget ? (d.id.includes(hindiTarget) || d.city.toLowerCase().includes(hindiTarget)) : false;

        if (!matchTitle && !matchHighlights && !matchHindi) return false;
      }

      // 2. Region Filter
      if (selectedRegion !== 'All' && d.region !== selectedRegion) {
        return false;
      }

      // 3. Experience / Type Filter
      if (selectedExperience !== 'All' && d.type !== selectedExperience) {
        return false;
      }

      // 4. Indian State Filter (only applies if state selected)
      if (selectedState !== 'All' && d.state !== selectedState) {
        return false;
      }

      // 5. Distance Filter from Dhanbad
      if (maxDistance !== 'All') {
        const distLimit = Number(maxDistance);
        if (d.distanceDhanbadKm > distLimit) return false;
      }

      // 6. Weekend Filter (< 350 km)
      if (onlyWeekend && (d.distanceDhanbadKm > 350 || d.distanceDhanbadKm === 0)) {
        return false;
      }

      // 7. Budget Filter
      if (budgetTier !== 'All') {
        if (budgetTier === 'budget' && d.dailyBudgetINR > 2500) return false;
        if (budgetTier === 'standard' && (d.dailyBudgetINR <= 2500 || d.dailyBudgetINR > 5000)) return false;
        if (budgetTier === 'premium' && (d.dailyBudgetINR <= 5000 || d.dailyBudgetINR > 10000)) return false;
        if (budgetTier === 'luxury' && d.dailyBudgetINR <= 10000) return false;
      }

      return true;
    });
  }, [searchQuery, selectedRegion, selectedExperience, selectedState, maxDistance, budgetTier, onlyWeekend]);

  const handlePlanForDest = (destName: string) => {
    if (destName === 'Dubai') {
      setCurrentScreen('11-itinerary');
    } else {
      setCurrentScreen('06-copilot');
      sendUserPrompt(`I want to plan a comprehensive vacation to ${destName}. Please generate the day-by-day itinerary, travel route, flight/train booking options and budget breakdown.`);
    }
  };

  const handleCompareClick = (dest: DestinationItem) => {
    if (!compareDest) {
      setCompareDest(dest);
    } else {
      setSelectedDest(dest);
      setShowComparisonModal(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 select-none animate-page-enter">
      
      {/* ── Top Header matching mockup ── */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold border border-rose-500/20 shadow-sm">
          <Compass className="w-4 h-4 text-rose-500" />
          <span>Screen 10 • Destination Explorer & Worldwide Discovery</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-midnight-navy dark:text-white tracking-tight">
          Explore the World 🌍
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Discover destinations, local travel around Dhanbad & Jharkhand, domestic tourism across 32 Indian states, and worldwide international getaways.
        </p>

        {/* ── Multilingual & Global Search Bar ── */}
        <div className="max-w-xl mx-auto pt-2">
          <div className="flex items-center gap-2.5 p-3 rounded-2xl theme-card border border-slate-200 dark:border-slate-800 shadow-sm focus-within:ring-2 focus-within:ring-ai-purple/50">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search city, state, country or Hindi (e.g. Kashmir, Netarhat, मनाली, Dubai)..."
              className="bg-transparent text-xs sm:text-sm w-full text-midnight-navy dark:text-white focus:outline-none placeholder:text-slate-400"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Filter Ribbons: Region & Experiences ── */}
      <div className="space-y-4 theme-card p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm">
        
        {/* Row 1: Region Selection */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            Choose Region:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {regions.map(r => (
              <button
                key={r.id}
                onClick={() => {
                  setSelectedRegion(r.id);
                  if (r.id !== 'India') setSelectedState('All');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                  selectedRegion === r.id
                    ? 'bg-midnight-navy dark:bg-white text-white dark:text-midnight-navy shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Travel Experience */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            Travel Experience:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {experiences.map(exp => (
              <button
                key={exp}
                onClick={() => setSelectedExperience(exp)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition shrink-0 ${
                  selectedExperience === exp
                    ? 'bg-ai-purple text-white shadow-sm'
                    : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-ai-purple'
                }`}
              >
                {exp === 'All' ? 'All Experiences' : exp}
              </button>
            ))}
          </div>
        </div>

        {/* Row 3: Advanced Dropdowns (State, Near Me Distance, Budget, Weekend Toggle) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          
          {/* Indian State Selector (Dynamic) */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Indian State / UT</label>
            <select
              value={selectedState}
              onChange={e => {
                setSelectedState(e.target.value);
                if (e.target.value !== 'All') setSelectedRegion('India');
              }}
              className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-midnight-navy dark:text-white focus:outline-none"
            >
              <option value="All">All Indian States (32+)</option>
              {Object.keys(INDIAN_STATES_DATA).map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* Near Me & Distance from Dhanbad */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Distance (From Dhanbad)</label>
            <select
              value={maxDistance}
              onChange={e => setMaxDistance(e.target.value)}
              className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-midnight-navy dark:text-white focus:outline-none"
            >
              <option value="All">Any Distance / Global</option>
              <option value="150">📍 Near Me (Within 150 km - Local)</option>
              <option value="350">🚗 Weekend Drive (Within 350 km)</option>
              <option value="600">🚆 Regional (Within 600 km)</option>
              <option value="1500">✈️ National (Within 1500 km)</option>
            </select>
          </div>

          {/* Daily Budget Tier */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Daily Budget Tier</label>
            <select
              value={budgetTier}
              onChange={e => setBudgetTier(e.target.value)}
              className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-midnight-navy dark:text-white focus:outline-none"
            >
              <option value="All">All Budgets</option>
              <option value="budget">Pocket-Friendly (&lt; ₹2,500/day)</option>
              <option value="standard">Standard (₹2,500 - ₹5,000/day)</option>
              <option value="premium">Premium (₹5,000 - ₹10,000/day)</option>
              <option value="luxury">Luxury (&gt; ₹10,000/day)</option>
            </select>
          </div>

          {/* Weekend Trips Quick Toggle & Reset */}
          <div className="flex items-end gap-2">
            <button
              onClick={() => setOnlyWeekend(!onlyWeekend)}
              className={`flex-1 p-2 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 ${
                onlyWeekend
                  ? 'bg-amber-400 text-midnight-navy border-amber-500 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-transparent hover:border-slate-300'
              }`}
            >
              <span>⚡ Weekend Trips (2-3 Days)</span>
            </button>

            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedRegion('All');
                setSelectedExperience('All');
                setSelectedState('All');
                setMaxDistance('All');
                setBudgetTier('All');
                setOnlyWeekend(false);
              }}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 text-xs font-bold"
              title="Reset Filters"
            >
              Reset
            </button>
          </div>

        </div>
      </div>

      {/* ── Active Results Count & Comparison Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-midnight-navy dark:text-white text-sm">
            Showing {filtered.length} Destinations
          </span>
          {selectedRegion !== 'All' && (
            <span className="px-2 py-0.5 rounded-full bg-ai-purple/10 text-ai-purple font-bold text-[10px]">
              {selectedRegion}
            </span>
          )}
          {onlyWeekend && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 font-bold text-[10px]">
              Weekend Escapes (&lt; 350 km)
            </span>
          )}
        </div>

        {/* Comparison Indicator */}
        <div className="flex items-center gap-2">
          {compareDest ? (
            <div className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/25 px-3 py-1.5 rounded-full">
              <span className="text-ai-purple font-bold">Comparing with: {compareDest.name}</span>
              <button
                onClick={() => {
                  setSelectedDest(selectedDest);
                  setShowComparisonModal(true);
                }}
                className="px-2 py-0.5 rounded-md bg-ai-purple text-white font-extrabold text-[10px]"
              >
                View Comparison
              </button>
              <button onClick={() => setCompareDest(null)} className="text-slate-400 hover:text-rose-500">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <span className="text-slate-400 flex items-center gap-1">
              <Columns className="w-3.5 h-3.5" />
              <span>Click "Compare" on any card to compare side-by-side</span>
            </span>
          )}
        </div>
      </div>

      {/* ── Spotlight Hero on Selected Destination ── */}
      <div className="theme-card rounded-3xl overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-12 border border-slate-200/90 dark:border-slate-800 animate-slide-up">
        <div className="lg:col-span-7 relative h-72 lg:h-96">
          <img
            src={selectedDest.image}
            alt={selectedDest.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-midnight-navy/90 via-midnight-navy/30 to-transparent" />
          
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-ai-purple text-white text-[10px] font-black uppercase tracking-wider shadow-md">
              {selectedDest.tag}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-bold border border-white/30">
              {selectedDest.type}
            </span>
          </div>

          <div className="absolute bottom-5 left-5 right-5 text-white space-y-1">
            <h2 className="text-2xl sm:text-4xl font-black">
              {selectedDest.name}, {selectedDest.state ? `${selectedDest.state}, ` : ''}{selectedDest.country}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-200 pt-1">
              <span className="flex items-center gap-1">
                <Navigation className="w-3.5 h-3.5 text-sky-400" />
                <span>
                  {selectedDest.distanceDhanbadKm === 0 
                    ? 'Current City (Dhanbad Base)' 
                    : `${selectedDest.distanceDhanbadKm.toLocaleString()} km from Dhanbad`}
                </span>
              </span>
              <span>•</span>
              <span>Visa: {selectedDest.visa}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 p-6 sm:p-7 space-y-5 flex flex-col justify-between bg-white dark:bg-slate-900">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider">Best Season</span>
                <div className="text-xs font-bold text-midnight-navy dark:text-white flex items-center gap-1.5 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-500" />
                  <span>{selectedDest.bestSeason}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider">Est. Daily Budget</span>
                <div className="text-base font-black text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(selectedDest.dailyBudgetINR, currency)}
                  <span className="text-[10px] text-slate-400 font-normal"> / day</span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider flex items-center gap-1">
                <Utensils className="w-3.5 h-3.5 text-rose-500" />
                <span>Local Food & Cultural Specialties</span>
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                {selectedDest.cuisine}
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">
                Top Sights & Experiences
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedDest.highlights.map(h => (
                  <span key={h} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    {h}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-2.5">
            <button
              onClick={() => toggleSaveDestination(selectedDest.id)}
              className={`w-full sm:w-auto p-3 rounded-xl border transition flex items-center justify-center ${
                savedDestinations.includes(selectedDest.id)
                  ? 'border-rose-500 text-rose-500 bg-rose-50 dark:bg-rose-950/30'
                  : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600'
              }`}
              title="Save to favorites"
            >
              <Heart className={`w-4 h-4 ${savedDestinations.includes(selectedDest.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>

            <button
              onClick={() => openMarketplace('packages')}
              className="w-full sm:w-auto px-4 py-3 rounded-xl border border-purple-500/30 bg-purple-500/10 text-ai-purple font-bold text-xs hover:bg-purple-500/20 transition flex items-center justify-center gap-1.5"
            >
              <Car className="w-4 h-4 text-ai-purple" />
              <span>Book Package / Cabs</span>
            </button>

            <button
              onClick={() => handlePlanForDest(selectedDest.name)}
              className="flex-1 btn-primary-gradient py-3 rounded-xl font-bold text-xs shadow-md shadow-purple-500/20 flex items-center justify-center gap-2 w-full"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Plan {selectedDest.name} with AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Destinations Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
        {filtered.map(dest => {
          const isSelected = selectedDest.id === dest.id;
          const isSaved = savedDestinations.includes(dest.id);
          return (
            <div
              key={dest.id}
              onClick={() => setSelectedDest(dest)}
              className={`theme-card card-lift rounded-3xl overflow-hidden cursor-pointer group flex flex-col justify-between border transition-all duration-300 ${
                isSelected ? 'ring-2 ring-ai-purple border-ai-purple shadow-xl' : 'border-slate-200/80 dark:border-slate-800'
              }`}
            >
              <div>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Top rating */}
                  <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{dest.rating}</span>
                    <span className="text-slate-400 font-normal">({dest.reviews})</span>
                  </div>

                  {/* Distance from Dhanbad */}
                  <div className="absolute top-3 right-3 bg-midnight-navy/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                    <Navigation className="w-3 h-3 text-sky-400" />
                    <span>{dest.distanceDhanbadKm === 0 ? 'Dhanbad Base' : `${dest.distanceDhanbadKm} km`}</span>
                  </div>

                  {/* Title overlay */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h4 className="font-black text-lg leading-snug drop-shadow-md">
                      {dest.name}
                    </h4>
                    <p className="text-xs text-slate-200 drop-shadow-sm flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-rose-400" />
                      <span>{dest.state ? `${dest.state}, ` : ''}{dest.country}</span>
                    </p>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-amber-500" />
                      <span>{dest.bestSeason}</span>
                    </span>

                    <span className="font-black text-sm text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(dest.dailyBudgetINR, currency)}
                      <span className="text-[10px] text-slate-400 font-normal"> / day</span>
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {dest.highlights.slice(0, 3).map(h => (
                      <span
                        key={h}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium"
                      >
                        {h}
                      </span>
                    ))}
                    {dest.highlights.length > 3 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-400">
                        +{dest.highlights.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={e => {
                    e.stopPropagation();
                    handleCompareClick(dest);
                  }}
                  className="text-[11px] font-bold text-slate-500 hover:text-ai-purple flex items-center gap-1"
                >
                  <Columns className="w-3 h-3" />
                  <span>Compare</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      toggleSaveDestination(dest.id);
                    }}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
                  >
                    <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>

                  <button
                    onClick={e => {
                      e.stopPropagation();
                      handlePlanForDest(dest.name);
                    }}
                    className="btn-primary-gradient px-3 py-1.5 rounded-xl font-bold text-[11px] shadow-sm flex items-center gap-1"
                  >
                    <span>Plan AI</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Side-by-Side Destination Comparison Modal ── */}
      {showComparisonModal && compareDest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
              <div className="flex items-center gap-2">
                <Columns className="w-5 h-5 text-ai-purple" />
                <h3 className="font-black text-lg text-midnight-navy dark:text-white">
                  Destination Comparison Matrix
                </h3>
              </div>
              <button
                onClick={() => setShowComparisonModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-2 gap-6">
                
                {/* Destination 1 */}
                <div className="space-y-4 theme-card p-5 rounded-2xl border-2 border-ai-purple">
                  <img
                    src={selectedDest.image}
                    alt={selectedDest.name}
                    className="w-full h-40 object-cover rounded-xl"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-ai-purple uppercase">{selectedDest.type}</span>
                    <h4 className="text-xl font-black text-midnight-navy dark:text-white">{selectedDest.name}</h4>
                    <p className="text-xs text-slate-400">{selectedDest.country}</p>
                  </div>

                  <div className="space-y-2 text-xs divide-y divide-slate-100 dark:divide-slate-800">
                    <div className="pt-2 flex justify-between">
                      <span className="text-slate-400">Daily Budget:</span>
                      <strong className="text-emerald-500">{formatCurrency(selectedDest.dailyBudgetINR, currency)}</strong>
                    </div>
                    <div className="pt-2 flex justify-between">
                      <span className="text-slate-400">Distance:</span>
                      <strong>{selectedDest.distanceDhanbadKm} km</strong>
                    </div>
                    <div className="pt-2 flex justify-between">
                      <span className="text-slate-400">Best Season:</span>
                      <strong>{selectedDest.bestSeason}</strong>
                    </div>
                    <div className="pt-2 flex justify-between">
                      <span className="text-slate-400">Visa Requirements:</span>
                      <strong className="text-ai-purple">{selectedDest.visa}</strong>
                    </div>
                    <div className="pt-2">
                      <span className="text-slate-400 block mb-1">Famous Food:</span>
                      <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300">{selectedDest.cuisine}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setShowComparisonModal(false);
                      handlePlanForDest(selectedDest.name);
                    }}
                    className="w-full btn-primary-gradient py-2.5 rounded-xl font-bold text-xs"
                  >
                    Plan {selectedDest.name}
                  </button>
                </div>

                {/* Destination 2 */}
                <div className="space-y-4 theme-card p-5 rounded-2xl border-2 border-ocean-blue">
                  <img
                    src={compareDest.image}
                    alt={compareDest.name}
                    className="w-full h-40 object-cover rounded-xl"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-ocean-blue uppercase">{compareDest.type}</span>
                    <h4 className="text-xl font-black text-midnight-navy dark:text-white">{compareDest.name}</h4>
                    <p className="text-xs text-slate-400">{compareDest.country}</p>
                  </div>

                  <div className="space-y-2 text-xs divide-y divide-slate-100 dark:divide-slate-800">
                    <div className="pt-2 flex justify-between">
                      <span className="text-slate-400">Daily Budget:</span>
                      <strong className="text-emerald-500">{formatCurrency(compareDest.dailyBudgetINR, currency)}</strong>
                    </div>
                    <div className="pt-2 flex justify-between">
                      <span className="text-slate-400">Distance:</span>
                      <strong>{compareDest.distanceDhanbadKm} km</strong>
                    </div>
                    <div className="pt-2 flex justify-between">
                      <span className="text-slate-400">Best Season:</span>
                      <strong>{compareDest.bestSeason}</strong>
                    </div>
                    <div className="pt-2 flex justify-between">
                      <span className="text-slate-400">Visa Requirements:</span>
                      <strong className="text-ocean-blue">{compareDest.visa}</strong>
                    </div>
                    <div className="pt-2">
                      <span className="text-slate-400 block mb-1">Famous Food:</span>
                      <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300">{compareDest.cuisine}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setShowComparisonModal(false);
                      handlePlanForDest(compareDest.name);
                    }}
                    className="w-full btn-primary-gradient py-2.5 rounded-xl font-bold text-xs"
                  >
                    Plan {compareDest.name}
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
