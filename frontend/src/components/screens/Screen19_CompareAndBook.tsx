import React, { useState, useEffect } from 'react';
import { 
  ArrowRightLeft, 
  Plane, 
  Building2, 
  Search, 
  Filter, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  Luggage, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Zap, 
  SlidersHorizontal,
  ChevronRight,
  TrendingDown,
  Coffee,
  Star,
  RefreshCw,
  Info
} from 'lucide-react';
import { useTravel } from '../../context/TravelContext';
import { api } from '../../services/api';
import { UnifiedFlightOption, UnifiedHotelOption, RevalidationResponse } from '../../types';

export const Screen19_CompareAndBook: React.FC = () => {
  const { currentTrip, formatPrice } = useTravel();
  
  const [activeTab, setActiveTab] = useState<'flights' | 'hotels'>('flights');
  const [loading, setLoading] = useState(false);
  const [revalidatingId, setRevalidatingId] = useState<string | null>(null);
  const [revalidationModal, setRevalidationModal] = useState<RevalidationResponse | null>(null);

  // Flight search params
  const [origin, setOrigin] = useState('DEL');
  const [destination, setDestination] = useState('DXB');
  const [departureDate, setDepartureDate] = useState('2026-11-20');
  const [passengers, setPassengers] = useState(1);
  const [cabinClass, setCabinClass] = useState('Economy');

  // Hotel search params
  const [city, setCity] = useState('Dubai');
  const [checkinDate, setCheckinDate] = useState('2026-11-20');
  const [checkoutDate, setCheckoutDate] = useState('2026-11-25');
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);

  // Filter states
  const [sortBy, setSortBy] = useState<'recommended' | 'cheapest' | 'fastest' | 'best_rated'>('recommended');
  const [nonStopOnly, setNonStopOnly] = useState(false);
  const [refundableOnly, setRefundableOnly] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<'all' | 'tripcom' | 'makemytrip'>('all');
  const [maxBudget, setMaxBudget] = useState<number>(30000);

  // Results
  const [flightResults, setFlightResults] = useState<UnifiedFlightOption[]>([]);
  const [hotelResults, setHotelResults] = useState<UnifiedHotelOption[]>([]);
  const [comparisonSummary, setComparisonSummary] = useState<any>(null);

  const fetchFlightComparison = async () => {
    setLoading(true);
    try {
      const data = await api.compareFlights({
        origin,
        destination,
        departure_date: departureDate,
        passengers,
        cabin_class: cabinClass,
        filters: {
          sort_by: sortBy,
          non_stop_only: nonStopOnly,
          refundable_only: refundableOnly,
          max_budget_inr: maxBudget,
          provider: selectedProvider
        }
      });
      setComparisonSummary(data);
      if (data && data.options) {
        setFlightResults(data.options);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHotelComparison = async () => {
    setLoading(true);
    try {
      const data = await api.compareHotels({
        city,
        checkin_date: checkinDate,
        checkout_date: checkoutDate,
        guests,
        rooms,
        filters: {
          sort_by: sortBy,
          refundable_only: refundableOnly,
          max_budget_inr: maxBudget,
          provider: selectedProvider
        }
      });
      setComparisonSummary(data);
      if (data && data.options) {
        setHotelResults(data.options);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'flights') {
      fetchFlightComparison();
    } else {
      fetchHotelComparison();
    }
  }, [activeTab, sortBy, nonStopOnly, refundableOnly, selectedProvider]);

  const handleBookingClick = async (option: UnifiedFlightOption | UnifiedHotelOption, type: 'flight' | 'hotel') => {
    setRevalidatingId(option.id);
    try {
      // Step 1: Revalidate with backend provider tracker
      const price = 'price_inr' in option ? option.price_inr : option.total_price_inr;
      const reval = await api.revalidateOffer({
        offer_id: option.id,
        provider_code: option.provider_code,
        item_type: type,
        original_price_inr: price
      });

      // Step 2: Track affiliate click
      await api.trackClick({
        provider_code: option.provider_code,
        item_type: type,
        item_id: option.id,
        origin: 'origin_code' in option ? option.origin_code : undefined,
        destination: 'destination_code' in option ? option.destination_code : ('city' in option ? option.city : undefined),
        target_url: option.booking_url
      });

      setRevalidationModal(reval);
    } catch (e) {
      window.open(option.booking_url, '_blank', 'noopener,noreferrer');
    } finally {
      setRevalidatingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-fade-in">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white p-6 md:p-8 shadow-xl border border-white/10">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Unified OTA Aggregator & Handoff
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Compare & Book Across Global OTAs
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Cross-check live inventory and fares from <strong>Trip.com</strong>, <strong>MakeMyTrip</strong>, and Global Distribution Systems with transparent pricing, zero hidden fees, and verified booking handoffs.
            </p>
          </div>

          {/* Active Provider Badges */}
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-bold text-white">Trip.com</span>
              <span className="text-emerald-300 text-[10px] bg-emerald-950/60 px-1.5 py-0.5 rounded">Partner Live</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-bold text-white">MakeMyTrip</span>
              <span className="text-blue-300 text-[10px] bg-blue-950/60 px-1.5 py-0.5 rounded">Handoff Active</span>
            </div>
          </div>
        </div>

        {/* Ambient background blur */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl w-fit border border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveTab('flights')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'flights'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Plane className="w-4 h-4" />
          Compare Flights
        </button>
        <button
          onClick={() => setActiveTab('hotels')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'hotels'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Compare Hotels
        </button>
      </div>

      {/* Search Bar & Route Configuration */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 md:p-6 shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
        {activeTab === 'flights' ? (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Origin (Airport)</label>
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value.toUpperCase())}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="DEL"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Destination</label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value.toUpperCase())}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="DXB"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Departure Date</label>
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Passengers</label>
              <select
                value={passengers}
                onChange={(e) => setPassengers(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={1}>1 Passenger</option>
                <option value={2}>2 Passengers</option>
                <option value={3}>3 Passengers</option>
                <option value={4}>4+ Passengers</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={fetchFlightComparison}
                disabled={loading}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/20"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                Compare Fares
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Destination City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Dubai"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Check-in</label>
              <input
                type="date"
                value={checkinDate}
                onChange={(e) => setCheckinDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Check-out</label>
              <input
                type="date"
                value={checkoutDate}
                onChange={(e) => setCheckoutDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Guests & Rooms</label>
              <div className="grid grid-cols-2 gap-1.5">
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full px-2 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white"
                >
                  <option value={1}>1 Guest</option>
                  <option value={2}>2 Guests</option>
                  <option value={4}>4 Guests</option>
                </select>
                <select
                  value={rooms}
                  onChange={(e) => setRooms(Number(e.target.value))}
                  className="w-full px-2 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white"
                >
                  <option value={1}>1 Room</option>
                  <option value={2}>2 Rooms</option>
                </select>
              </div>
            </div>
            <div className="flex items-end">
              <button
                onClick={fetchHotelComparison}
                disabled={loading}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/20"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                Compare Hotels
              </button>
            </div>
          </div>
        )}

        {/* Filter Toolbar */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter by:
            </span>
            <button
              onClick={() => setSortBy('recommended')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                sortBy === 'recommended'
                  ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-700'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Recommended
            </button>
            <button
              onClick={() => setSortBy('cheapest')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                sortBy === 'cheapest'
                  ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-700'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Cheapest
            </button>
            {activeTab === 'flights' ? (
              <button
                onClick={() => setSortBy('fastest')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  sortBy === 'fastest'
                    ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-700'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                Fastest
              </button>
            ) : (
              <button
                onClick={() => setSortBy('best_rated')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  sortBy === 'best_rated'
                    ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-700'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                Top Rated
              </button>
            )}

            {/* Quick check toggles */}
            {activeTab === 'flights' && (
              <label className="flex items-center gap-1.5 cursor-pointer ml-2 text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={nonStopOnly}
                  onChange={(e) => setNonStopOnly(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                Non-stop Only
              </label>
            )}
            <label className="flex items-center gap-1.5 cursor-pointer ml-2 text-slate-600 dark:text-slate-300">
              <input
                type="checkbox"
                checked={refundableOnly}
                onChange={(e) => setRefundableOnly(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              Free Cancellation
            </label>
          </div>

          {/* Provider Filter */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400">OTA Provider:</span>
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value as any)}
              className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200"
            >
              <option value="all">All Providers</option>
              <option value="tripcom">Trip.com Only</option>
              <option value="makemytrip">MakeMyTrip Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Comparison Summary Banner if available */}
      {comparisonSummary && comparisonSummary.price_range_inr && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">Cheapest Cross-OTA Deal</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {formatPrice(comparisonSummary.price_range_inr.min)}
              </span>
            </div>
            <div className="p-3 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">Max Savings Potential</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {formatPrice(comparisonSummary.price_range_inr.max_potential_savings)}
              </span>
            </div>
            <div className="p-3 bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl">
              <Zap className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider block">OTA Providers Synced</span>
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                Trip.com + MakeMyTrip
              </span>
            </div>
            <div className="p-3 bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
        </div>
      )}

      {/* Main Results Listing */}
      {activeTab === 'flights' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 px-1">
            <span>Showing {flightResults.length} flight options across partners</span>
            <span className="flex items-center gap-1 text-slate-400">
              <Clock className="w-3 h-3" /> Real-time pricing & availability
            </span>
          </div>

          {flightResults.map((flight) => (
            <div 
              key={flight.id}
              className={`p-5 md:p-6 rounded-3xl bg-white dark:bg-slate-900 border transition-all hover:shadow-lg ${
                flight.is_recommended 
                  ? 'border-blue-500/50 shadow-md shadow-blue-500/5 dark:border-blue-500/40 ring-1 ring-blue-500/20'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              {/* Badges Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Provider Pill */}
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                    flight.provider_code === 'tripcom'
                      ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                      : 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    {flight.provider}
                  </span>

                  {flight.is_recommended && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Best Value AI Pick
                    </span>
                  )}

                  {flight.is_cheapest && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      Cheapest Fare
                    </span>
                  )}

                  {flight.is_fastest && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                      Fastest Direct
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-400">
                  Ref: <code className="text-slate-500">{flight.flight_number}</code>
                </div>
              </div>

              {/* Main Flight Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                {/* Airline & Timings */}
                <div className="md:col-span-2 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 text-sm">
                    {flight.airline_code}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      {flight.airline}
                      <span className="text-xs font-normal text-slate-400">({flight.flight_number})</span>
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span>{flight.departure_time.split(' ')[1]} {flight.origin_code}</span>
                      <ArrowRightLeft className="w-3.5 h-3.5 text-slate-300" />
                      <span>{flight.arrival_time.split(' ')[1]} {flight.destination_code}</span>
                      <span className="text-slate-400">•</span>
                      <span>{flight.duration}</span>
                      <span className="text-slate-400">•</span>
                      <span className={flight.stops === 0 ? 'text-emerald-600 font-semibold' : 'text-amber-600'}>
                        {flight.stop_details}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Baggage & Policy */}
                <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Luggage className="w-3.5 h-3.5 text-slate-400" />
                    <span>{flight.baggage}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{flight.cancellation_policy}</span>
                  </div>
                </div>

                {/* Pricing & CTA */}
                <div className="flex flex-col md:items-end justify-center gap-2">
                  <div className="text-right">
                    <span className="text-2xl font-black text-slate-900 dark:text-white block">
                      {formatPrice(flight.price_inr)}
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      Incl. {formatPrice(flight.taxes_and_fees_inr)} taxes & fees
                    </span>
                  </div>

                  <button
                    onClick={() => handleBookingClick(flight, 'flight')}
                    disabled={revalidatingId === flight.id}
                    className="w-full md:w-auto px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
                  >
                    {revalidatingId === flight.id ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Revalidating...
                      </>
                    ) : (
                      <>
                        Book on {flight.provider}
                        <ExternalLink className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Recommendation explanation footnote */}
              {flight.recommendation_reason && (
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{flight.recommendation_reason}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 px-1">
            <span>Showing {hotelResults.length} hotels in {city}</span>
            <span className="flex items-center gap-1 text-slate-400">
              <Clock className="w-3 h-3" /> Revalidated with Trip.com & MakeMyTrip
            </span>
          </div>

          {hotelResults.map((hotel) => (
            <div 
              key={hotel.id}
              className={`p-5 md:p-6 rounded-3xl bg-white dark:bg-slate-900 border transition-all hover:shadow-lg ${
                hotel.is_recommended 
                  ? 'border-blue-500/50 shadow-md shadow-blue-500/5 dark:border-blue-500/40 ring-1 ring-blue-500/20'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                {/* Hotel Image & Basic Info */}
                <div className="md:col-span-2 flex items-center gap-4">
                  <img 
                    src={hotel.image_url} 
                    alt={hotel.name}
                    className="w-24 h-24 rounded-2xl object-cover flex-shrink-0 shadow-sm"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        hotel.provider_code === 'tripcom'
                          ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                          : 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300'
                      }`}>
                        {hotel.provider}
                      </span>
                      {hotel.is_recommended && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                          AI Top Pick
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {hotel.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">{hotel.location}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs">
                        <Star className="w-3 h-3 fill-current" /> {hotel.rating}
                      </span>
                      <span className="text-xs text-slate-400">({hotel.reviews_count.toLocaleString()} verified reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Amenities & Room Type */}
                <div className="text-xs space-y-1.5 text-slate-600 dark:text-slate-300">
                  <p className="font-semibold text-slate-900 dark:text-white">{hotel.room_type}</p>
                  {hotel.breakfast_included && (
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                      <Coffee className="w-3.5 h-3.5" />
                      <span>Complimentary Breakfast</span>
                    </div>
                  )}
                  {hotel.free_cancellation && (
                    <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{hotel.cancellation_deadline}</span>
                    </div>
                  )}
                </div>

                {/* Price & CTA */}
                <div className="flex flex-col md:items-end justify-center gap-2">
                  <div className="text-right">
                    <span className="text-2xl font-black text-slate-900 dark:text-white block">
                      {formatPrice(hotel.price_per_night_inr)}
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      per night • total {formatPrice(hotel.total_price_inr)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleBookingClick(hotel, 'hotel')}
                    disabled={revalidatingId === hotel.id}
                    className="w-full md:w-auto px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
                  >
                    {revalidatingId === hotel.id ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Revalidating...
                      </>
                    ) : (
                      <>
                        Book on {hotel.provider}
                        <ExternalLink className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {hotel.recommendation_reason && (
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{hotel.recommendation_reason}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pre-Booking Revalidation Modal */}
      {revalidationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-800 space-y-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Inventory & Rate Confirmed!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {revalidationModal.message}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-left text-xs space-y-2 border border-slate-100 dark:border-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-400">OTA Provider:</span>
                <span className="font-bold text-slate-800 dark:text-white capitalize">{revalidationModal.provider_code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Verified Fare:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatPrice(revalidationModal.current_price_inr)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Inventory Status:</span>
                <span className="font-semibold text-blue-600">Reserved for Checkout</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setRevalidationModal(null)}
                className="w-1/2 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300"
              >
                Close
              </button>
              <a
                href={revalidationModal.booking_redirect_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setRevalidationModal(null)}
                className="w-1/2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20"
              >
                Proceed to Checkout
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
