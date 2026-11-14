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
  ChevronLeft,
  TrendingDown,
  Coffee,
  Star,
  RefreshCw,
  Info,
  CreditCard,
  QrCode,
  Smartphone,
  Check,
  Copy,
  Download,
  Lock,
  User,
  Mail,
  Phone,
  Ticket,
  X,
  Calendar
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateETicketPDF } from '../../utils/pdfTicketGenerator';
import { useTravel } from '../../context/TravelContext';
import { api } from '../../services/api';
import { UnifiedFlightOption, UnifiedHotelOption, RevalidationResponse, BookingConfirmation } from '../../types';

export const Screen19_CompareAndBook: React.FC = () => {
  const { currentTrip, formatPrice, userProfile, addBookingToHistory, currency, setCurrentScreen } = useTravel();
  
  const [activeTab, setActiveTab] = useState<'flights' | 'hotels'>('flights');
  const [loading, setLoading] = useState(false);
  const [revalidatingId, setRevalidatingId] = useState<string | null>(null);
  const [revalidationModal, setRevalidationModal] = useState<RevalidationResponse | null>(null);

  // Active Booking & Fast Checkout state
  const [activeBookingSession, setActiveBookingSession] = useState<{
    option: UnifiedFlightOption | UnifiedHotelOption;
    type: 'flight' | 'hotel';
    reval: RevalidationResponse;
  } | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<'review' | 'payment' | 'processing' | 'confirmed'>('review');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'gpay' | 'netbanking'>('upi');
  const [passengerName, setPassengerName] = useState(userProfile?.name || 'Ranjeet Kumar');
  const [passengerEmail, setPassengerEmail] = useState(userProfile?.email || 'ranjeet.travels@travelmate.ai');
  const [passengerPhone, setPassengerPhone] = useState(userProfile?.phone || '+91 98765 43210');
  const [passengerGovId, setPassengerGovId] = useState('V2849102');
  const [seatPreference, setSeatPreference] = useState('14A (Window)');
  const [mealPreference, setMealPreference] = useState('Vegetarian');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('782');
  const [confirmedBooking, setConfirmedBooking] = useState<BookingConfirmation | null>(null);
  const [processingStage, setProcessingStage] = useState(1);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [priceLockSeconds, setPriceLockSeconds] = useState(600); // 10 minutes price lock

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

      setActiveBookingSession({
        option,
        type,
        reval
      });
      setCheckoutStep('review');
      setRevalidationModal(reval);
      setPriceLockSeconds(600);
    } catch (e) {
      window.open(option.booking_url, '_blank', 'noopener,noreferrer');
    } finally {
      setRevalidatingId(null);
    }
  };

  // 10-minute price lock countdown
  useEffect(() => {
    if (!revalidationModal || checkoutStep === 'confirmed') return;
    const interval = setInterval(() => {
      setPriceLockSeconds(prev => (prev > 0 ? prev - 1 : 600));
    }, 1000);
    return () => clearInterval(interval);
  }, [revalidationModal, checkoutStep]);

  // Instant in-app fast payment simulation
  const handleConfirmPayment = () => {
    if (!activeBookingSession) return;
    setCheckoutStep('processing');
    setProcessingStage(1);

    setTimeout(() => {
      setProcessingStage(2);
    }, 700);

    setTimeout(() => {
      setProcessingStage(3);
    }, 1400);

    setTimeout(() => {
      const isFlight = activeBookingSession.type === 'flight';
      const flightOpt = isFlight ? (activeBookingSession.option as UnifiedFlightOption) : null;
      const hotelOpt = !isFlight ? (activeBookingSession.option as UnifiedHotelOption) : null;
      const verifiedPrice = activeBookingSession.reval.current_price_inr;
      const finalPrice = Math.max(1, verifiedPrice - 1000);

      const booking: BookingConfirmation = {
        bookingId: `${activeBookingSession.reval.provider_code.toUpperCase().slice(0, 3)}-DXB-${Math.floor(10000 + Math.random() * 90000)}`,
        pnr: `${flightOpt ? flightOpt.flight_number.split(' ')[0] : 'DXB'}-${Math.floor(100000 + Math.random() * 900000)}`,
        passengerName: passengerName || 'Ranjeet Kumar',
        tripTitle: isFlight 
          ? `Flight: ${flightOpt?.origin_code || 'DEL'} to ${flightOpt?.destination_code || 'DXB'}` 
          : `Hotel Stay: ${hotelOpt?.name || 'Rove Downtown Dubai'}`,
        origin: flightOpt?.origin_code || 'DEL',
        destination: flightOpt?.destination_code || hotelOpt?.city || 'DXB',
        dates: isFlight ? `${departureDate}` : `${checkinDate} - ${checkoutDate}`,
        flightDetails: {
          id: flightOpt?.id || 'fl-confirmed',
          airline: flightOpt?.airline || 'Emirates',
          airlineCode: flightOpt?.airline_code || 'EK',
          flightNumber: flightOpt?.flight_number || 'EK-571',
          origin: {
            city: flightOpt?.origin_city || 'Delhi',
            airport: 'Indira Gandhi International Airport',
            code: flightOpt?.origin_code || 'DEL',
            terminal: 'Terminal 3'
          },
          destination: {
            city: flightOpt?.destination_city || 'Dubai',
            airport: 'Dubai International Airport',
            code: flightOpt?.destination_code || 'DXB',
            terminal: 'Terminal 3'
          },
          departureTime: flightOpt?.departure_time || '09:45 AM',
          arrivalTime: flightOpt?.arrival_time || '01:20 PM',
          duration: flightOpt?.duration || '4h 15m',
          stops: flightOpt?.stops || 0,
          priceINR: finalPrice,
          cabinClass: (flightOpt?.cabin_class as any) || 'Economy',
          baggage: flightOpt?.baggage || '30kg Check-in + 7kg Cabin',
          refundable: flightOpt?.refundable ?? true
        },
        hotelDetails: {
          id: hotelOpt?.id || 'ht-confirmed',
          name: hotelOpt?.name || 'Rove Downtown Dubai',
          city: hotelOpt?.city || 'Dubai',
          location: hotelOpt?.location || 'Downtown Dubai',
          roomType: hotelOpt?.room_type || 'Rover Room (Burj Khalifa View)',
          rating: hotelOpt?.rating || 4.8,
          reviewCount: hotelOpt?.reviews_count || 1240,
          stars: hotelOpt?.stars || 4,
          pricePerNightINR: hotelOpt?.price_per_night_inr || 4500,
          imageUrl: hotelOpt?.image_url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80',
          amenities: hotelOpt?.amenities || ['Free Wi-Fi', 'Breakfast Included', 'Pool View'],
          distanceToCenter: '0.8 km',
          freeCancellation: hotelOpt?.free_cancellation ?? true,
          breakfastIncluded: hotelOpt?.breakfast_included ?? true
        },
        totalPaidINR: finalPrice,
        currency: currency || 'INR',
        bookingDate: new Date().toISOString().split('T')[0],
        paymentMethod: paymentMethod === 'upi' ? 'UPI' : paymentMethod === 'card' ? 'Card' : 'NetBanking',
        status: 'Confirmed'
      };

      setConfirmedBooking(booking);
      addBookingToHistory(booking);
      setCheckoutStep('confirmed');

      try {
        confetti({
          particleCount: 130,
          spread: 85,
          origin: { y: 0.6 },
          colors: ['#7956f5', '#10b981', '#3b82f6', '#f59e0b']
        });
      } catch (err) {}
    }, 2200);
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

      {/* Enterprise Pre-Booking Revalidation & Fast Checkout Modal */}
      {revalidationModal && activeBookingSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 max-w-xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 text-left relative max-h-[92vh] overflow-y-auto custom-scrollbar">
            
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">
                  {activeBookingSession.reval.provider_code} Verified GDS Inventory
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  Fare Locked
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg">
                  <Clock className="w-3 h-3" />
                  <span>
                    {Math.floor(priceLockSeconds / 60).toString().padStart(2, '0')}:{(priceLockSeconds % 60).toString().padStart(2, '0')}
                  </span>
                </div>
                <button
                  onClick={() => setRevalidationModal(null)}
                  className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* ── STEP 1: REVIEW & INVENTORY CONFIRMATION ──────────────── */}
            {checkoutStep === 'review' && (
              <div className="space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-midnight-navy dark:text-white">
                      Inventory & Rate Confirmed!
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      {activeBookingSession.reval.message}
                    </p>
                  </div>
                </div>

                {/* Offer Details Card */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
                  {activeBookingSession.type === 'flight' ? (
                    <div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-midnight-navy dark:text-white flex items-center gap-1.5">
                          <Plane className="w-3.5 h-3.5 text-blue-500" />
                          {(activeBookingSession.option as UnifiedFlightOption).airline} • {(activeBookingSession.option as UnifiedFlightOption).flight_number}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-500/10 text-ai-purple uppercase">
                          {(activeBookingSession.option as UnifiedFlightOption).cabin_class}
                        </span>
                      </div>

                      <div className="flex items-center justify-between my-2 py-2 border-y border-slate-200/60 dark:border-slate-700/60">
                        <div>
                          <div className="text-base font-black text-midnight-navy dark:text-white">
                            {(activeBookingSession.option as UnifiedFlightOption).origin_code}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {(activeBookingSession.option as UnifiedFlightOption).departure_time}
                          </div>
                        </div>

                        <div className="flex flex-col items-center">
                          <span className="text-[10px] font-semibold text-slate-400">
                            {(activeBookingSession.option as UnifiedFlightOption).duration}
                          </span>
                          <div className="w-20 h-0.5 bg-blue-500/40 relative my-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 absolute -top-0.5 left-1/2 -translate-x-1/2" />
                          </div>
                          <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                            {(activeBookingSession.option as UnifiedFlightOption).stops === 0 ? 'Non-Stop Direct' : '1-Stop'}
                          </span>
                        </div>

                        <div className="text-right">
                          <div className="text-base font-black text-midnight-navy dark:text-white">
                            {(activeBookingSession.option as UnifiedFlightOption).destination_code}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {(activeBookingSession.option as UnifiedFlightOption).arrival_time}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Luggage className="w-3.5 h-3.5 text-travel-teal" />
                          <span>{(activeBookingSession.option as UnifiedFlightOption).baggage}</span>
                        </span>
                        <span>{(activeBookingSession.option as UnifiedFlightOption).cancellation_policy}</span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between text-xs font-bold text-midnight-navy dark:text-white">
                        <span className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-blue-500" />
                          {(activeBookingSession.option as UnifiedHotelOption).name}
                        </span>
                        <span className="text-amber-500 font-bold">
                          ★ {(activeBookingSession.option as UnifiedHotelOption).rating}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {(activeBookingSession.option as UnifiedHotelOption).room_type} • {(activeBookingSession.option as UnifiedHotelOption).city}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        <span>✓ Free Breakfast</span>
                        <span>✓ Free Cancellation</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Base Fare & Airline Charges:</span>
                    <span>{formatPrice(activeBookingSession.reval.current_price_inr - 1950)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Airport Taxes & Fuel Surcharge:</span>
                    <span>{formatPrice(1950)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>TravelMate Copilot Promo (COPILOT1000):</span>
                    <span>-₹1,000</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-baseline">
                    <span className="font-extrabold text-midnight-navy dark:text-white text-sm">
                      Total Payable Amount:
                    </span>
                    <span className="text-base font-black text-ai-purple">
                      {formatPrice(Math.max(1, activeBookingSession.reval.current_price_inr - 1000))}
                    </span>
                  </div>
                </div>

                {/* Dual Action Options */}
                <div className="space-y-2 pt-1">
                  <button
                    onClick={() => setCheckoutStep('payment')}
                    className="w-full py-3 bg-gradient-to-r from-ai-purple to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]"
                  >
                    <Zap className="w-4 h-4 fill-current text-amber-300" />
                    <span>Instant Fast Checkout & Issue E-Ticket</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <a
                    href={activeBookingSession.reval.booking_redirect_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setRevalidationModal(null)}
                    className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5 transition text-center"
                  >
                    <span>Or Complete on {activeBookingSession.reval.provider_code.toUpperCase()}.com (Official Portal)</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                  </a>
                </div>
              </div>
            )}

            {/* ── STEP 2: FAST-TRACK PAYMENT & PASSENGER DETAILS ───────── */}
            {checkoutStep === 'payment' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setCheckoutStep('review')}
                    className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-ai-purple transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back to Summary</span>
                  </button>
                  <span className="text-xs font-black text-ai-purple">
                    Payable: {formatPrice(Math.max(1, activeBookingSession.reval.current_price_inr - 1000))}
                  </span>
                </div>

                {/* Passenger Form */}
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Primary Passenger Vault:
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[10px] text-slate-400 font-semibold block mb-0.5">Full Name (as per Passport)</label>
                      <input
                        type="text"
                        value={passengerName}
                        onChange={e => setPassengerName(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-midnight-navy dark:text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 font-semibold block mb-0.5">Passport / Gov ID No.</label>
                      <input
                        type="text"
                        value={passengerGovId}
                        onChange={e => setPassengerGovId(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-midnight-navy dark:text-white font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Select Instant Payment Method:
                  </span>
                  <div className="grid grid-cols-4 gap-1.5 text-xs font-bold">
                    <button
                      onClick={() => setPaymentMethod('upi')}
                      className={`p-2 rounded-xl border transition flex flex-col items-center gap-1 ${
                        paymentMethod === 'upi'
                          ? 'border-ai-purple bg-purple-500/10 text-ai-purple'
                          : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <QrCode className="w-4 h-4" />
                      <span className="text-[10px]">UPI & QR</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('gpay')}
                      className={`p-2 rounded-xl border transition flex flex-col items-center gap-1 ${
                        paymentMethod === 'gpay'
                          ? 'border-ai-purple bg-purple-500/10 text-ai-purple'
                          : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Smartphone className="w-4 h-4" />
                      <span className="text-[10px]">GPay / PhonePe</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('card')}
                      className={`p-2 rounded-xl border transition flex flex-col items-center gap-1 ${
                        paymentMethod === 'card'
                          ? 'border-ai-purple bg-purple-500/10 text-ai-purple'
                          : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span className="text-[10px]">Debit/Credit</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('netbanking')}
                      className={`p-2 rounded-xl border transition flex flex-col items-center gap-1 ${
                        paymentMethod === 'netbanking'
                          ? 'border-ai-purple bg-purple-500/10 text-ai-purple'
                          : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span className="text-[10px]">NetBanking</span>
                    </button>
                  </div>
                </div>

                {/* Payment Detail Section */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/70">
                  {paymentMethod === 'upi' && (
                    <div className="flex items-center gap-4">
                      {/* Dynamic Scannable QR Code */}
                      <div className="p-2 bg-white rounded-xl shadow-md shrink-0 border border-slate-200 flex flex-col items-center">
                        <div className="w-20 h-20 bg-slate-900 rounded-lg p-1 flex items-center justify-center">
                          <QrCode className="w-16 h-16 text-white" />
                        </div>
                        <span className="text-[8px] font-bold text-slate-500 mt-1">BHIM UPI Verified</span>
                      </div>

                      <div className="space-y-1.5 flex-1 text-xs">
                        <div className="font-extrabold text-midnight-navy dark:text-white">
                          Scan with any UPI App
                        </div>
                        <p className="text-[10px] text-slate-400">
                          Google Pay, PhonePe, Paytm, BHIM, Cred supported.
                        </p>
                        <div className="flex items-center gap-1 text-[10px] font-mono bg-white dark:bg-slate-900 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                          <span>travelmate.pay@icici</span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText('travelmate.pay@icici');
                              setCopiedUpi(true);
                              setTimeout(() => setCopiedUpi(false), 2000);
                            }}
                            className="ml-auto text-ai-purple hover:underline font-bold"
                          >
                            {copiedUpi ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'gpay' && (
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">
                        Choose 1-Tap Mobile Wallet:
                      </span>
                      <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                        <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1 text-blue-600">
                          <Smartphone className="w-3.5 h-3.5" />
                          <span>Google Pay</span>
                        </div>
                        <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1 text-purple-600">
                          <Zap className="w-3.5 h-3.5" />
                          <span>PhonePe</span>
                        </div>
                        <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1 text-sky-500">
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Paytm UPI</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'card' && (
                    <div className="space-y-2 text-xs">
                      <div>
                        <label className="text-[10px] text-slate-400 font-semibold block mb-0.5">Card Number</label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={e => setCardNumber(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-midnight-navy dark:text-white"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-slate-400 font-semibold block mb-0.5">Expiry</label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={e => setCardExpiry(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-midnight-navy dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 font-semibold block mb-0.5">CVV / CVC</label>
                          <input
                            type="password"
                            value={cardCvv}
                            onChange={e => setCardCvv(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-midnight-navy dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'netbanking' && (
                    <div className="grid grid-cols-4 gap-1.5 text-[11px] font-bold text-center">
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-ai-purple cursor-pointer">HDFC</div>
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-ai-purple cursor-pointer">ICICI</div>
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-ai-purple cursor-pointer">SBI</div>
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-ai-purple cursor-pointer">Axis</div>
                    </div>
                  )}
                </div>

                {/* Pay & Confirm CTA */}
                <button
                  onClick={handleConfirmPayment}
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>
                    Authorize Payment & Issue Ticket ({formatPrice(Math.max(1, activeBookingSession.reval.current_price_inr - 1000))})
                  </span>
                </button>
              </div>
            )}

            {/* ── STEP 3: PROCESSING STAGES ────────────────────────────── */}
            {checkoutStep === 'processing' && (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-purple-500/10 text-ai-purple flex items-center justify-center mx-auto animate-pulse">
                  <RefreshCw className="w-8 h-8 animate-spin" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-midnight-navy dark:text-white">
                    Processing Reservation & E-Ticket
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {processingStage === 1 && `Verifying live fare with ${activeBookingSession.reval.provider_code.toUpperCase()} GDS Engine...`}
                    {processingStage === 2 && 'Allocating Airline PNR & Biometric Smart E-Gate Token...'}
                    {processingStage === 3 && 'Cryptographically sealing E-Ticket & Boarding Pass...'}
                  </p>
                </div>
                <div className="w-48 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mx-auto overflow-hidden">
                  <div
                    className="h-full bg-ai-purple transition-all duration-700"
                    style={{ width: `${processingStage * 33}%` }}
                  />
                </div>
              </div>
            )}

            {/* ── STEP 4: CONFIRMED & DOWNLOAD E-TICKET ─────────────────── */}
            {checkoutStep === 'confirmed' && confirmedBooking && (
              <div className="space-y-4 text-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="text-xl font-black text-midnight-navy dark:text-white">
                    Booking Confirmed!
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Your reservation has been confirmed through {activeBookingSession.reval.provider_code.toUpperCase()} GDS inventory.
                  </p>
                </div>

                {/* Confirmed Details Badge */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-left text-xs space-y-2 border border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Booking Reference:</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-white">{confirmedBooking.bookingId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Airline PNR:</span>
                    <span className="font-mono font-bold text-ai-purple">{confirmedBooking.pnr}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Passenger Name:</span>
                    <span className="font-bold text-slate-800 dark:text-white">{confirmedBooking.passengerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">DXB Smart Gates:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">✓ PASS APPROVED</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-1">
                  <button
                    onClick={() => generateETicketPDF(confirmedBooking)}
                    className="w-full py-3 bg-ai-purple hover:bg-ai-purple-light text-white font-extrabold text-xs rounded-xl shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 transition"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Official E-Ticket & Boarding Pass (PDF)</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setRevalidationModal(null);
                        setCurrentScreen('15-wallet');
                      }}
                      className="py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-midnight-navy dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                      View in My Trips & Wallet
                    </button>
                    <button
                      onClick={() => setRevalidationModal(null)}
                      className="py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                    >
                      Done / Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
