import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useTravel } from '../../context/TravelContext';
import { api } from '../../services/api';
import { GlobalTourismItem, MultiStopRoutePlan } from '../../types';
import { GlobalWorldMap } from '../tourism/GlobalWorldMap';
import { 
  Compass, 
  Search, 
  MapPin, 
  Star, 
  Heart, 
  Navigation, 
  Sparkles, 
  Calendar, 
  Clock, 
  DollarSign, 
  ShieldCheck, 
  ExternalLink, 
  Layers, 
  Filter, 
  ChevronRight, 
  X, 
  Globe, 
  Utensils, 
  Hotel, 
  Car, 
  Train, 
  Plane, 
  Share2, 
  Printer, 
  Plus, 
  Trash2, 
  ArrowRight, 
  Check, 
  SlidersHorizontal,
  Bookmark,
  CheckCircle2,
  TrendingUp,
  RefreshCw
} from 'lucide-react';

export const Screen10_DestinationExplorer: React.FC = () => {
  const { 
    currency, 
    formatPrice, 
    setCurrentScreen, 
    sendUserPrompt,
    savedDestinations,
    toggleSaveDestination
  } = useTravel();

  // Navigation tab inside explorer
  type ExplorerNavTab = 'explore' | 'continents' | 'wonders' | 'nearby' | 'ai' | 'saved' | 'itinerary';
  const [activeNavTab, setActiveNavTab] = useState<ExplorerNavTab>('explore');

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContinent, setSelectedContinent] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [budgetTier, setBudgetTier] = useState<string>('All');
  const [familyFriendlyOnly, setFamilyFriendlyOnly] = useState(false);
  const [unescoOnly, setUnescoOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'popularity' | 'rating' | 'budget_low'>('popularity');

  // Geolocation & Nearby
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [nearbyRadiusKm, setNearbyRadiusKm] = useState<number>(500);
  const [locatingUser, setLocatingUser] = useState(false);

  // Data states
  const [allDestinations, setAllDestinations] = useState<GlobalTourismItem[]>([]);
  const [selectedDest, setSelectedDest] = useState<GlobalTourismItem | null>(null);
  const [loading, setLoading] = useState(false);

  // Multi-Stop Smart Trip Planner State
  const [tripPlanDestinations, setTripPlanDestinations] = useState<GlobalTourismItem[]>([]);
  const [routePlanData, setRoutePlanData] = useState<MultiStopRoutePlan | null>(null);
  const [planningRoute, setPlanningRoute] = useState(false);
  const [printModalOpen, setPrintModalOpen] = useState(false);

  // AI Recommendation State
  const [aiVibe, setAiVibe] = useState<'romantic' | 'adventure' | 'family' | 'culture' | 'luxury'>('romantic');
  const [aiSeason, setAiSeason] = useState<'winter' | 'summer' | 'monsoon' | 'autumn'>('winter');
  const [aiRecommendations, setAiRecommendations] = useState<GlobalTourismItem[]>([]);
  const [aiRationale, setAiRationale] = useState<string>('');

  // Fetch initial destinations from backend
  const loadDestinations = async () => {
    setLoading(true);
    try {
      const data = await api.getTourismDestinations({
        query: searchQuery,
        continent: selectedContinent,
        category: selectedCategory,
        max_budget: budgetTier === 'budget' ? 3500 : budgetTier === 'moderate' ? 8000 : undefined,
        family_friendly: familyFriendlyOnly,
        unesco_only: unescoOnly,
        sort_by: sortBy
      });
      if (data && data.destinations && data.destinations.length > 0) {
        setAllDestinations(data.destinations);
        if (!selectedDest) {
          setSelectedDest(data.destinations[0]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDestinations();
  }, [selectedContinent, selectedCategory, budgetTier, familyFriendlyOnly, unescoOnly, sortBy]);

  // Search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      loadDestinations();
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Request user geolocation
  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setLocatingUser(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
        setUserLocation(coords);
        setLocatingUser(false);
        setActiveNavTab('nearby');
        fetchNearby(coords.latitude, coords.longitude, nearbyRadiusKm);
      },
      (err) => {
        console.warn("Geolocation denied or unavailable:", err.message);
        // Fallback to Dhanbad / Delhi coordinates for seamless experience
        const fallback = { latitude: 23.7957, longitude: 86.4304 };
        setUserLocation(fallback);
        setLocatingUser(false);
        setActiveNavTab('nearby');
        fetchNearby(fallback.latitude, fallback.longitude, nearbyRadiusKm);
      },
      { timeout: 8000 }
    );
  };

  const fetchNearby = async (lat: number, lon: number, radius: number) => {
    try {
      const res = await api.getNearbyPlaces(lat, lon, radius);
      if (res && res.results) {
        setAllDestinations(res.results);
        if (res.results.length > 0) {
          setSelectedDest(res.results[0]);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Trigger AI Recommendation
  const handleFetchAIRecommendations = async (vibe = aiVibe, season = aiSeason) => {
    setLoading(true);
    try {
      const res = await api.getAIRecommendations({
        vibe,
        season,
        continent: selectedContinent,
        category: selectedCategory
      });
      if (res && res.recommendations) {
        setAiRecommendations(res.recommendations);
        setAiRationale(res.ai_rationale || '');
        setAllDestinations(res.recommendations);
        if (res.recommendations.length > 0) {
          setSelectedDest(res.recommendations[0]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Add / Remove from Multi-Stop Trip Planner
  const handleAddToTripPlan = (dest: GlobalTourismItem) => {
    if (!tripPlanDestinations.some(d => d.id === dest.id)) {
      const updated = [...tripPlanDestinations, dest];
      setTripPlanDestinations(updated);
      calculateRoute(updated);
    }
  };

  const handleRemoveFromTripPlan = (destId: string) => {
    const updated = tripPlanDestinations.filter(d => d.id !== destId);
    setTripPlanDestinations(updated);
    if (updated.length >= 2) {
      calculateRoute(updated);
    } else {
      setRoutePlanData(null);
    }
  };

  const calculateRoute = async (destList: GlobalTourismItem[]) => {
    if (destList.length < 2) return;
    setPlanningRoute(true);
    try {
      const ids = destList.map(d => d.id);
      const plan = await api.planMultiStopRoute(ids);
      setRoutePlanData(plan);
    } catch (e) {
      console.error(e);
    } finally {
      setPlanningRoute(false);
    }
  };

  // Filter categories
  const categories = [
    { id: 'All', label: 'All Places', icon: '🌍' },
    { id: 'wonder', label: 'World Wonders', icon: '🌟' },
    { id: 'monument', label: 'Monuments', icon: '🏛️' },
    { id: 'beach', label: 'Beaches & Islands', icon: '🏖️' },
    { id: 'mountain', label: 'Mountains & Trekking', icon: '🏔️' },
    { id: 'wildlife', label: 'Wildlife & Safaris', icon: '🦁' },
    { id: 'waterfall', label: 'Waterfalls & Lakes', icon: '🌊' },
    { id: 'religious', label: 'Sacred & Spiritual', icon: '🛕' },
  ];

  const continents = ['All', 'Asia', 'Europe', 'North America', 'South America', 'Africa', 'Oceania'];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-fade-in select-none">
      
      {/* ── TOP HERO BANNER ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-6 md:p-8 shadow-2xl border border-white/10">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold uppercase tracking-wider mb-2">
              <Compass className="w-3.5 h-3.5 text-blue-400 animate-spin-slow" />
              Global Tourism Explorer & 3D Discovery
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
              Explore Every Corner of the World 🌍
            </h1>
            <p className="text-slate-300 text-xs md:text-sm mt-1 max-w-2xl leading-relaxed">
              Interactive 3D globe & world map showcasing iconic UNESCO World Heritage sites, beaches, mountain summits, wildlife reserves, and sacred monuments with live route planning and GPS proximity explorer.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRequestLocation}
              disabled={locatingUser}
              className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all"
            >
              <Navigation className={`w-3.5 h-3.5 ${locatingUser ? 'animate-spin' : ''}`} />
              <span>{locatingUser ? 'Locating...' : 'Explore Near Me'}</span>
            </button>
            <button
              onClick={() => {
                setActiveNavTab('itinerary');
              }}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white text-xs font-bold flex items-center gap-2 transition-all"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>Trip Planner ({tripPlanDestinations.length})</span>
            </button>
          </div>
        </div>

        {/* Subtle background glow */}
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* ── MAIN WORKSPACE: 3-PANEL LAYOUT ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ── LEFT SUB-SIDEBAR: NAVIGATION & FILTERS (3 Cols) ── */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Main Navigation Pill Menu */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-3 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 py-1.5">
              Explorer Modes
            </div>
            {[
              { id: 'explore', label: 'Global Explorer', icon: <Globe className="w-4 h-4 text-blue-500" /> },
              { id: 'continents', label: 'Continents & Regions', icon: <Compass className="w-4 h-4 text-emerald-500" /> },
              { id: 'wonders', label: 'World Wonders', icon: <Sparkles className="w-4 h-4 text-amber-500" /> },
              { id: 'nearby', label: 'Nearby Explorer (GPS)', icon: <Navigation className="w-4 h-4 text-cyan-500" /> },
              { id: 'ai', label: 'AI Recommendations', icon: <TrendingUp className="w-4 h-4 text-purple-500" /> },
              { id: 'saved', label: 'Saved Favorites', icon: <Heart className="w-4 h-4 text-rose-500" />, badge: savedDestinations.length },
              { id: 'itinerary', label: 'Smart Trip Planner', icon: <Calendar className="w-4 h-4 text-amber-500" />, badge: tripPlanDestinations.length },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveNavTab(tab.id as ExplorerNavTab);
                  if (tab.id === 'wonders') {
                    setSelectedCategory('wonder');
                  } else if (tab.id === 'explore') {
                    setSelectedCategory('All');
                    setSelectedContinent('All');
                  }
                }}
                className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between ${
                  activeNavTab === tab.id
                    ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-700 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {tab.icon}
                  <span>{tab.label}</span>
                </div>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-600 text-white">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Continents Filter Drawer */}
          {activeNavTab === 'continents' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                Filter Continent
              </span>
              <div className="space-y-1">
                {continents.map(c => (
                  <button
                    key={c}
                    onClick={() => setSelectedContinent(c)}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-between ${
                      selectedContinent === c
                        ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{c}</span>
                    {selectedContinent === c && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Nearby Radius Controls */}
          {activeNavTab === 'nearby' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">Proximity Radius</span>
                <span className="text-xs font-black text-blue-600 dark:text-blue-400">{nearbyRadiusKm} km</span>
              </div>
              <input
                type="range"
                min="50"
                max="3000"
                step="50"
                value={nearbyRadiusKm}
                onChange={(e) => {
                  const r = Number(e.target.value);
                  setNearbyRadiusKm(r);
                  if (userLocation) {
                    fetchNearby(userLocation.latitude, userLocation.longitude, r);
                  }
                }}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400 leading-tight">
                Showing tourist places within {nearbyRadiusKm} km of your GPS location.
              </p>
            </div>
          )}

          {/* AI Vibe Selector */}
          {activeNavTab === 'ai' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                Travel Style & Vibe
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                {(['romantic', 'adventure', 'family', 'culture', 'luxury'] as const).map(v => (
                  <button
                    key={v}
                    onClick={() => {
                      setAiVibe(v);
                      handleFetchAIRecommendations(v, aiSeason);
                    }}
                    className={`px-2.5 py-1.5 rounded-xl capitalize font-semibold transition ${
                      aiVibe === v
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Filter Attributes */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-2.5 text-xs">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
              Filter Criteria
            </span>
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={unescoOnly}
                onChange={e => setUnescoOnly(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span>UNESCO World Heritage Only</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={familyFriendlyOnly}
                onChange={e => setFamilyFriendlyOnly(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span>Family Friendly</span>
            </label>
          </div>
        </div>

        {/* ── CENTER AREA: MAP & FLOATING CONTROLS (6 Cols) ── */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Floating Search Bar */}
          <div className="relative">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search any destination, country, monument or city in the world..."
                className="bg-transparent text-xs sm:text-sm w-full text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-400"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="p-1 text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Category Ribbon */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800 hover:border-blue-400'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Interactive World Map Canvas */}
          <GlobalWorldMap
            destinations={allDestinations}
            selectedDestination={selectedDest}
            onSelectDestination={(dest) => setSelectedDest(dest)}
            routeWaypoints={tripPlanDestinations}
            userLocation={userLocation}
            className="h-[520px]"
          />

          {/* Multi-Stop Itinerary Route Summary (if 2+ waypoints) */}
          {routePlanData && tripPlanDestinations.length >= 2 && (
            <div className="p-4 rounded-3xl bg-gradient-to-br from-amber-500/10 via-slate-900 to-indigo-950 border border-amber-500/30 text-white shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    Smart Multi-Stop Route Computed
                  </span>
                </div>
                <button
                  onClick={() => setPrintModalOpen(true)}
                  className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition"
                >
                  <Printer className="w-3.5 h-3.5" /> Print / PDF
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-[10px] text-slate-400 block">Total Distance</span>
                  <span className="text-base font-extrabold text-white">{routePlanData.total_distance_km.toLocaleString()} km</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-[10px] text-slate-400 block">Transit Time</span>
                  <span className="text-base font-extrabold text-white">{routePlanData.estimated_transit_hours} hrs</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-[10px] text-slate-400 block">Est. Transit Cost</span>
                  <span className="text-base font-extrabold text-emerald-400">{formatPrice(routePlanData.estimated_transit_cost_inr)}</span>
                </div>
              </div>

              {/* Legs list */}
              <div className="space-y-1.5 pt-1 text-xs">
                {routePlanData.legs.map((leg, idx) => (
                  <div key={idx} className="flex items-center justify-between text-slate-300 py-1 border-b border-white/5">
                    <span className="font-semibold text-white truncate max-w-[55%]">
                      {idx + 1}. {leg.from_name} ➔ {leg.to_name}
                    </span>
                    <span className="text-amber-300 font-mono text-[11px]">
                      {leg.distance_km} km ({leg.recommended_mode})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT DOCKED INSPECTOR: DESTINATION DOSSIER (3 Cols) ── */}
        <div className="lg:col-span-3 space-y-4">
          {selectedDest ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-lg border border-slate-200 dark:border-slate-800 space-y-4 animate-scale-in">
              {/* Photo Showcase */}
              <div className="relative rounded-2xl overflow-hidden aspect-[16/10] shadow-md group">
                <img 
                  src={selectedDest.images[0]} 
                  alt={selectedDest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <button
                    onClick={() => toggleSaveDestination(selectedDest.id)}
                    className="p-2 rounded-full bg-slate-900/80 backdrop-blur-md text-white hover:text-rose-400 shadow-md transition"
                  >
                    <Heart className={`w-4 h-4 ${savedDestinations.includes(selectedDest.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                </div>
                <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-[11px] font-bold text-white flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>{selectedDest.rating}</span>
                  <span className="text-slate-400 font-normal">({selectedDest.reviews_count.toLocaleString()})</span>
                </div>
              </div>

              {/* Title & Location */}
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-0.5">
                  {selectedDest.continent} • {selectedDest.category}
                </span>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white leading-snug">
                  {selectedDest.name}
                </h2>
                {selectedDest.local_name && (
                  <p className="text-xs text-slate-400 font-medium">{selectedDest.local_name}</p>
                )}
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>{selectedDest.city}, {selectedDest.country}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-h-36 overflow-y-auto pr-1">
                {selectedDest.description}
              </p>

              {/* Practical Facts Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 block font-semibold">Entry Ticket</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {selectedDest.entry_fee_inr === 0 ? 'Free Entry' : formatPrice(selectedDest.entry_fee_inr)}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 block font-semibold">Best Season</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedDest.best_season}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 block font-semibold">Visit Duration</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedDest.visit_duration}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 block font-semibold">Est. Daily Budget</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {formatPrice(selectedDest.estimated_daily_budget_inr)}
                  </span>
                </div>
              </div>

              {/* Transit & Nearby Highlights */}
              <div className="text-xs space-y-1.5 border-t border-slate-100 dark:border-slate-800 pt-3">
                <div className="text-slate-500 dark:text-slate-400">
                  <strong className="text-slate-900 dark:text-white">Transit:</strong> {selectedDest.transport_options}
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedDest.tags.map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => handleAddToTripPlan(selectedDest)}
                  disabled={tripPlanDestinations.some(d => d.id === selectedDest.id)}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>
                    {tripPlanDestinations.some(d => d.id === selectedDest.id) ? 'Added to Itinerary' : 'Add to Multi-Stop Itinerary'}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setCurrentScreen('06-copilot');
                    sendUserPrompt(`Plan a trip to ${selectedDest.name} in ${selectedDest.city}, ${selectedDest.country}. What are the best flights, stays and 3-day itinerary?`);
                  }}
                  className="w-full py-2.5 rounded-xl border border-purple-500/30 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 text-purple-700 dark:text-purple-300 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                  <span>Plan with AI Copilot</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 text-center text-slate-400 text-xs border border-slate-200 dark:border-slate-800">
              Select any marker on the world map to view detailed travel dossier.
            </div>
          )}
        </div>
      </div>

      {/* ── PRINT / PDF ITINERARY EXPORT MODAL ── */}
      {printModalOpen && routePlanData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">TravelMate.AI Export</span>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Worldwide Multi-Destination Itinerary</h2>
              </div>
              <button onClick={() => setPrintModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300">
              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Total Stops</span>
                  <strong className="text-base text-slate-900 dark:text-white">{routePlanData.total_waypoints} Destinations</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Distance</span>
                  <strong className="text-base text-slate-900 dark:text-white">{routePlanData.total_distance_km.toLocaleString()} km</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Est. Transit Cost</span>
                  <strong className="text-base text-emerald-600 dark:text-emerald-400">{formatPrice(routePlanData.estimated_transit_cost_inr)}</strong>
                </div>
              </div>

              {/* Waypoint Schedule */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                  Waypoint Schedule & Route Legs:
                </h4>
                {tripPlanDestinations.map((d, i) => (
                  <div key={d.id} className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-slate-900 dark:text-white">{d.name}</strong>
                        <span className="text-slate-400">{d.city}, {d.country}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{d.description.slice(0, 140)}...</p>
                      <div className="flex items-center gap-3 mt-2 text-[10px] font-medium text-slate-400">
                        <span>Best: {d.best_season}</span>
                        <span>•</span>
                        <span>Ticket: {d.entry_fee_inr === 0 ? 'Free' : formatPrice(d.entry_fee_inr)}</span>
                        <span>•</span>
                        <span>Budget: {formatPrice(d.estimated_daily_budget_inr)}/day</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setPrintModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-500/20"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Itinerary / Save as PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
