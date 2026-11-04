import React, { useState, useEffect, useRef } from 'react';
import { useTravel } from '../../context/TravelContext';
import { 
  EXPLORER_DESTINATIONS, 
  HOLIDAY_PACKAGES, 
  MOBILITY_FLEET, 
  formatCurrency 
} from '../../data/travelData';
import { 
  LayoutDashboard, 
  Compass, 
  Bot, 
  Sparkles, 
  Ticket, 
  User, 
  Search, 
  Bell, 
  Heart, 
  Star, 
  ChevronRight, 
  ArrowRight, 
  MapPin, 
  CalendarDays, 
  Plane, 
  Building2, 
  Car, 
  Bike, 
  ShieldCheck, 
  Volume2, 
  Mic, 
  MicOff, 
  Send, 
  CheckCircle2, 
  Share2, 
  Clock, 
  Coins, 
  QrCode, 
  X, 
  PhoneCall, 
  ArrowLeft,
  Navigation,
  Check,
  Tag,
  Luggage,
  Moon,
  Sun,
  Smartphone
} from 'lucide-react';

type MobileTab = 'home' | 'explore' | 'copilot' | 'packages' | 'trips' | 'profile';

export const MobileAppSimulator: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { 
    userProfile, 
    activeTrip, 
    currency, 
    savedDestinations, 
    toggleSaveDestination, 
    addBookingToHistory 
  } = useTravel();

  const [activeTab, setActiveTab] = useState<MobileTab>('home');
  const [mobileTheme, setMobileTheme] = useState<'light' | 'dark'>('light');
  const [showSplash, setShowSplash] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [exploreRegion, setExploreRegion] = useState<'all' | 'india' | 'world' | 'local'>('all');
  const [exploreCategory, setExploreCategory] = useState<string>('all');
  const [mobilityFilter, setMobilityFilter] = useState<'packages' | 'cabs' | 'cars' | 'bikes'>('packages');
  const [likedItems, setLikedItems] = useState<string[]>(['dest-dubai', 'dest-goa']);
  const [selectedPackage, setSelectedPackage] = useState<any | null>(null);
  const [bookingStep, setBookingStep] = useState<'details' | 'payment' | 'confirmed'>('details');
  const [bookingSuccessData, setBookingSuccessData] = useState<any | null>(null);
  const [couponCode, setCouponCode] = useState('INNOVATION27X7');
  const [couponApplied, setCouponApplied] = useState(true);
  const [showBoardingPass, setShowBoardingPass] = useState(false);

  // Copilot state
  const [copilotLang, setCopilotLang] = useState<'en' | 'hi'>('en');
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [mobileMessages, setMobileMessages] = useState<Array<{ id: string; sender: 'user' | 'ai'; text: string; time: string; cards?: any }>>([
    {
      id: 'm-1',
      sender: 'ai',
      text: "Namaste Ranjeet! 👋 I'm your TravelMate AI Copilot. Where would you like to travel next?",
      time: '9:40 AM'
    },
    {
      id: 'm-2',
      sender: 'user',
      text: 'Plan a 10-day trip from Dhanbad to Dubai for ₹97,000.',
      time: '9:41 AM'
    },
    {
      id: 'm-3',
      sender: 'ai',
      text: "Terrific choice! 🌴 I have prepared your Dubai Adventure:\n\n✈️ Flights: Emirates via CCU (₹32,500 roundtrip)\n🏨 Hotels: 4-Star Downtown Dubai (₹4,500/nt)\n🛂 Visa: Pre-approved 30-day tourist eVisa\n💰 Estimated total: ₹97,000\n\nWould you like me to reserve the flights or show Day 1 itinerary?",
      time: '9:41 AM',
      cards: {
        destination: 'Dubai, UAE',
        budget: '₹97,000',
        pnr: 'EK-948123',
        days: 10
      }
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mobileMessages, isTyping]);

  const toggleLike = (id: string) => {
    setLikedItems(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || chatInput).trim();
    if (!text) return;
    const userMsg = {
      id: `u-${Date.now()}`,
      sender: 'user' as const,
      text,
      time: '9:42 AM'
    };
    setMobileMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      let replyText = '';
      if (text.toLowerCase().includes('cab') || text.toLowerCase().includes('car') || text.toLowerCase().includes('ranchi')) {
        replyText = "🚕 Outstation Cab Dhanbad ➔ Ranchi Airport (IXR):\n• AC Sedan (Dzire): ₹2,800\n• AC Ertiga 6-Seater: ₹3,900\n• Pickup: Within 30 minutes with GPS tracking & verified driver.";
      } else if (text.toLowerCase().includes('goa')) {
        replyText = "🏖️ Goa Beach Getaway curated:\n• 4 Days / 3 Nights package from ₹14,999/person.\n• Includes North & South Goa sightseeing, beachfront resort & scooter rental.";
      } else if (copilotLang === 'hi') {
        replyText = `धन्यवाद रंजीत जी! 🌟 आपकी यात्रा योजना पूरी तरह तैयार की जा रही है। हम सबसे सस्ती फ्लाइट्स, बेहतरीन होटल और वीज़ा की जानकारी ला रहे हैं।`;
      } else {
        replyText = `I've analyzed options for "${text}". Autonomous Flight & Hotel agents have synchronized with Amadeus GDS. All deals match your ₹97,000 budget!`;
      }

      setMobileMessages(prev => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai' as const,
          text: replyText,
          time: '9:42 AM'
        }
      ]);
      setIsTyping(false);
    }, 1100);
  };

  // Filtered destinations
  const filteredDestinations = EXPLORER_DESTINATIONS.filter(d => {
    const matchesSearch = searchQuery === '' || 
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      d.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.state?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRegion = 
      exploreRegion === 'all' ? true :
      exploreRegion === 'india' ? d.country === 'India' :
      exploreRegion === 'world' ? d.country !== 'India' :
      d.state === 'Jharkhand' || d.state === 'Bihar' || d.state === 'West Bengal';

    const matchesCat = exploreCategory === 'all' ? true : d.type.toLowerCase().includes(exploreCategory.toLowerCase());

    return matchesSearch && matchesRegion && matchesCat;
  });

  // Handle booking checkout
  const handleConfirmBooking = () => {
    const booking = {
      bookingId: `TM-MOB-${Math.floor(100000 + Math.random() * 900000)}`,
      pnr: `INNOV-${Math.floor(1000 + Math.random() * 9000)}`,
      passengerName: userProfile.name,
      tripTitle: selectedPackage?.title || 'Mobility Service',
      origin: 'Dhanbad, Jharkhand',
      destination: selectedPackage?.destination || selectedPackage?.location || 'Dubai, UAE',
      dates: selectedPackage?.duration || 'Flexible',
      totalPaidINR: (selectedPackage?.priceINR || 2800) - (couponApplied ? 1500 : 0),
      currency: 'INR' as const,
      bookingDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'UPI' as const,
      status: 'Confirmed' as const,
    };
    addBookingToHistory(booking as any);
    setBookingSuccessData(booking);
    setBookingStep('confirmed');
  };

  return (
    <div className="flex flex-col items-center justify-center p-2 sm:p-4 min-h-[92vh]">
      
      {/* ── Top Simulator Toolbar ── */}
      <div className="w-full max-w-[420px] mb-3 flex items-center justify-between px-3 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-xs">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-ai-purple" />
          <span className="font-bold text-midnight-navy dark:text-white">iPhone 16 Pro Simulator</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-500/10 text-ai-purple font-bold">Innovation 27X7</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileTheme(prev => prev === 'light' ? 'dark' : 'light')}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-300 hover:text-ai-purple"
            title="Toggle theme inside phone"
          >
            {mobileTheme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
          </button>
          <button
            onClick={() => setShowSplash(prev => !prev)}
            className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 font-medium text-[11px] text-slate-600 dark:text-slate-300 hover:text-ai-purple"
          >
            {showSplash ? 'Exit Splash' : 'View Splash'}
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-rose-500"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ── Smartphone Chassis (iPhone 16 Pro Dimensions: 390 x 844px) ── */}
      <div className={`relative w-[390px] h-[820px] rounded-[52px] p-[10px] bg-slate-900 shadow-[0_25px_70px_-15px_rgba(16,29,66,0.35)] border-[5px] border-slate-800 transition-all select-none overflow-hidden ${mobileTheme === 'dark' ? 'dark' : ''}`}>
        
        {/* Device Outer Antennas & Gloss */}
        <div className="absolute top-28 -left-[7px] w-[3px] h-10 bg-slate-700 rounded-l-sm" />
        <div className="absolute top-44 -left-[7px] w-[3px] h-12 bg-slate-700 rounded-l-sm" />
        <div className="absolute top-40 -right-[7px] w-[3px] h-14 bg-slate-700 rounded-r-sm" />

        {/* ── Inside Screen Frame ── */}
        <div className="relative w-full h-full rounded-[42px] overflow-hidden flex flex-col bg-[#F5F7FB] dark:bg-[#0A0F1D] text-[#101B35] dark:text-[#F8FAFC] transition-colors duration-200 font-sans">
          
          {/* Dynamic Island & Status Bar */}
          <div className="h-11 px-6 pt-3 flex items-center justify-between text-[13px] font-semibold tracking-tight z-30 shrink-0">
            <span className="font-bold">9:41</span>
            
            {/* Dynamic Island pill */}
            <div className="w-24 h-6 rounded-full bg-black flex items-center justify-between px-2 text-[10px] text-white">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[9px] font-bold text-slate-300">EK 571</span>
              <Plane className="w-2.5 h-2.5 text-sky-400 -rotate-45" />
            </div>

            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <span className="text-[10px] font-bold">5G</span>
              <div className="w-5 h-2.5 rounded-sm border border-current p-0.5 flex items-center">
                <div className="h-full w-[80%] bg-emerald-500 rounded-xs" />
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════
              SPLASH SCREEN (Interactive Overlay)
             ══════════════════════════════════════════════════════════ */}
          {showSplash && (
            <div className="absolute inset-0 z-40 bg-gradient-to-b from-[#101D42] via-[#162758] to-[#0A0F1D] text-white p-6 flex flex-col justify-between animate-fade-in">
              <div className="pt-10 flex justify-end">
                <button
                  onClick={() => setShowSplash(false)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col items-center text-center space-y-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-[#7956F5] via-[#3478F6] to-[#16BFA5] p-0.5 shadow-2xl shadow-purple-500/40 animate-bounce" style={{ animationDuration: '3s' }}>
                    <div className="w-full h-full rounded-3xl bg-[#101D42]/80 backdrop-blur-md flex items-center justify-center">
                      <Plane className="w-12 h-12 text-white -rotate-45" />
                    </div>
                  </div>
                  <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-ai-purple/30 to-ocean-blue/30 blur-xl -z-10 animate-pulse" />
                </div>

                <div>
                  <h1 className="text-3xl font-black tracking-tight leading-tight">
                    TravelMate<span className="text-[#7956F5]">.AI</span>
                  </h1>
                  <p className="text-xs text-slate-300 font-semibold tracking-wider uppercase mt-1">
                    Your World. Your Journey. Your AI Copilot.
                  </p>
                </div>

                <div className="space-y-1.5 text-xs text-slate-400">
                  <p>• Autonomous 13-Agent Travel Swarm</p>
                  <p>• Flights, Hotels, Cabs & Day-by-Day Plans</p>
                  <p className="text-[#16BFA5] font-bold">Team Innovation 27X7</p>
                </div>
              </div>

              <div className="space-y-3 pb-6">
                <button
                  onClick={() => {
                    setShowSplash(false);
                    setActiveTab('home');
                  }}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#7956F5] to-[#3478F6] text-white font-black text-sm shadow-xl shadow-purple-500/30 active:scale-95 transition-transform flex items-center justify-center gap-2"
                >
                  <span>Explore Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              MAIN CONTENT CONTAINER (Scrollable screen body)
             ══════════════════════════════════════════════════════════ */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-none pb-20">
            
            {/* ────────────────────────────────────────────────────────
                TAB 1: HOME DASHBOARD
               ──────────────────────────────────────────────────────── */}
            {activeTab === 'home' && (
              <div className="p-4 space-y-4 animate-page-enter">
                
                {/* Top User Greeting & Location */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={userProfile.avatar}
                      alt={userProfile.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-[#7956F5] shadow-sm"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-black text-midnight-navy dark:text-white">
                          Hi, {userProfile.name}
                        </span>
                        <span className="text-sm animate-bounce" style={{ animationDuration: '2s' }}>👋</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        <MapPin className="w-3 h-3 text-rose-500" />
                        <span>Dhanbad, Jharkhand</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('copilot')}
                      className="p-2 rounded-full bg-purple-500/10 text-[#7956F5] border border-purple-500/20 active:scale-90 transition-transform"
                    >
                      <Bot className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setActiveTab('trips')}
                      className="p-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 relative active:scale-90 transition-transform"
                    >
                      <Bell className="w-4 h-4" />
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    </button>
                  </div>
                </div>

                {/* Instant Search Bar */}
                <div 
                  onClick={() => setActiveTab('explore')}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 shadow-sm cursor-pointer active:scale-[0.98] transition-all"
                >
                  <Search className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="text-xs text-slate-400 font-medium">Search destinations, cabs, hotels...</span>
                </div>

                {/* AI Travel Copilot Promo Banner */}
                <div 
                  onClick={() => setActiveTab('copilot')}
                  className="relative rounded-3xl p-4 bg-gradient-to-r from-[#101D42] via-[#1E2C60] to-[#7956F5] text-white shadow-lg overflow-hidden cursor-pointer group active:scale-[0.98] transition-all"
                >
                  <div className="absolute -right-4 -bottom-6 w-28 h-28 rounded-full bg-white/10 blur-xl pointer-events-none" />
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-wider text-amber-300">
                        <Sparkles className="w-3 h-3" />
                        <span>AI Travel Copilot</span>
                      </div>
                      <h3 className="text-base font-black tracking-tight leading-snug">
                        Where to next? Ask Copilot
                      </h3>
                      <p className="text-[11px] text-slate-200">
                        Autonomous planning with live Amadeus airfares
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30 group-hover:rotate-12 transition-transform">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  {/* Quick Pill Suggestions */}
                  <div className="mt-3 flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-1">
                    <span 
                      onClick={(e) => { e.stopPropagation(); setActiveTab('copilot'); handleSendMessage('Plan a 10-day Dubai trip'); }}
                      className="px-2.5 py-1 rounded-full bg-white/15 text-[10px] font-bold text-white shrink-0 hover:bg-white/25 transition"
                    >
                      ✈️ Dubai 10 Days
                    </span>
                    <span 
                      onClick={(e) => { e.stopPropagation(); setActiveTab('copilot'); handleSendMessage('Book outstation cab Dhanbad to Ranchi'); }}
                      className="px-2.5 py-1 rounded-full bg-white/15 text-[10px] font-bold text-white shrink-0 hover:bg-white/25 transition"
                    >
                      🚕 Ranchi Cab
                    </span>
                    <span 
                      onClick={(e) => { e.stopPropagation(); setActiveTab('copilot'); handleSendMessage('Best budget hotels in Goa'); }}
                      className="px-2.5 py-1 rounded-full bg-white/15 text-[10px] font-bold text-white shrink-0 hover:bg-white/25 transition"
                    >
                      🏖️ Goa Stays
                    </span>
                  </div>
                </div>

                {/* Quick Services Grid (Rounded 20px Cards, active scale 0.97) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                      Quick Services
                    </span>
                    <span className="text-[10px] font-bold text-ai-purple">Team Innovation 27X7</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { id: 'packages', label: 'Holiday Deals', icon: <Luggage className="w-5 h-5 text-purple-500" />, tab: 'packages' as const, sub: 'packages' as const, bg: 'bg-purple-500/10' },
                      { id: 'cabs', label: 'Cabs', icon: <Car className="w-5 h-5 text-sky-500" />, tab: 'packages' as const, sub: 'cabs' as const, bg: 'bg-sky-500/10' },
                      { id: 'cars', label: 'Self Drive', icon: <Navigation className="w-5 h-5 text-emerald-500" />, tab: 'packages' as const, sub: 'cars' as const, bg: 'bg-emerald-500/10' },
                      { id: 'bikes', label: 'Bike Rental', icon: <Bike className="w-5 h-5 text-amber-500" />, tab: 'packages' as const, sub: 'bikes' as const, bg: 'bg-amber-500/10' },
                      { id: 'flights', label: 'Flights', icon: <Plane className="w-5 h-5 text-blue-500" />, tab: 'explore' as const, sub: 'packages' as const, bg: 'bg-blue-500/10' },
                      { id: 'hotels', label: 'Hotels', icon: <Building2 className="w-5 h-5 text-rose-500" />, tab: 'explore' as const, sub: 'packages' as const, bg: 'bg-rose-500/10' },
                    ].map(svc => (
                      <button
                        key={svc.id}
                        onClick={() => {
                          setActiveTab(svc.tab);
                          if (svc.sub) setMobilityFilter(svc.sub);
                        }}
                        className="p-3 rounded-[20px] bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center text-center gap-1.5 active:scale-[0.95] transition-all duration-150 hover:shadow-md"
                      >
                        <div className={`w-10 h-10 rounded-2xl ${svc.bg} flex items-center justify-center`}>
                          {svc.icon}
                        </div>
                        <span className="text-[11px] font-bold text-midnight-navy dark:text-white leading-tight">
                          {svc.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Holiday Packages Horizontal Carousel */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between px-1">
                    <h3 className="text-sm font-black text-midnight-navy dark:text-white">
                      Curated Packages
                    </h3>
                    <button
                      onClick={() => {
                        setActiveTab('packages');
                        setMobilityFilter('packages');
                      }}
                      className="text-xs font-bold text-[#7956F5] flex items-center gap-0.5"
                    >
                      <span>See all</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2 -mx-4 px-4">
                    {HOLIDAY_PACKAGES.slice(0, 4).map(pkg => (
                      <div
                        key={pkg.id}
                        onClick={() => {
                          setSelectedPackage({
                            title: pkg.title,
                            duration: `${pkg.durationDays}D / ${pkg.durationNights}N`,
                            priceINR: pkg.priceINR,
                            destination: pkg.destinations
                          });
                          setBookingStep('details');
                        }}
                        className="w-[240px] shrink-0 rounded-[20px] bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-sm overflow-hidden active:scale-[0.98] transition-all cursor-pointer flex flex-col"
                      >
                        <div className="relative h-28 w-full">
                          <img
                            src={pkg.image}
                            alt={pkg.title}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[9px] font-bold">
                            {pkg.badge || 'Featured'}
                          </span>
                          <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-white/90 dark:bg-slate-900/90 text-midnight-navy dark:text-white text-[10px] font-black shadow">
                            ⭐ {pkg.rating}
                          </span>
                        </div>
                        <div className="p-3 flex-1 flex flex-col justify-between space-y-1.5">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              {pkg.durationDays}D / {pkg.durationNights}N
                            </span>
                            <h4 className="text-xs font-black text-midnight-navy dark:text-white line-clamp-1">{pkg.title}</h4>
                          </div>
                          <div className="flex items-center justify-between pt-1">
                            <div>
                              <span className="text-[9px] text-slate-400 block">From</span>
                              <span className="text-xs font-black text-ai-purple">
                                {formatCurrency(pkg.priceINR, currency)}
                              </span>
                            </div>
                            <span className="px-2 py-1 rounded-xl bg-purple-500/10 text-[#7956F5] text-[10px] font-bold">
                              Book Now
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Popular Destinations List */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between px-1">
                    <h3 className="text-sm font-black text-midnight-navy dark:text-white">
                      Top Destinations
                    </h3>
                    <button
                      onClick={() => setActiveTab('explore')}
                      className="text-xs font-bold text-[#7956F5] flex items-center gap-0.5"
                    >
                      <span>Explore</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {EXPLORER_DESTINATIONS.slice(0, 4).map(dest => {
                      const isLiked = likedItems.includes(dest.id);
                      return (
                        <div
                          key={dest.id}
                          onClick={() => {
                            setActiveTab('copilot');
                            handleSendMessage(`Tell me more about ${dest.name}, ${dest.country}`);
                          }}
                          className="p-2.5 rounded-[20px] bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-sm flex items-center gap-3 cursor-pointer active:scale-[0.98] transition-all"
                        >
                          <img
                            src={dest.image}
                            alt={dest.name}
                            className="w-16 h-16 rounded-2xl object-cover shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-black text-midnight-navy dark:text-white truncate">
                                {dest.name}
                              </h4>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleLike(dest.id);
                                }}
                                className="p-1 text-slate-400 hover:text-rose-500 active:scale-125 transition-transform"
                              >
                                <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                              </button>
                            </div>
                            <p className="text-[10px] text-slate-400 font-medium">{dest.country} • {dest.bestSeason}</p>
                            <div className="flex items-center justify-between pt-1">
                              <span className="text-[10px] font-black text-[#16BFA5]">
                                {formatCurrency(dest.dailyBudgetINR, currency)}/day
                              </span>
                              <span className="text-[10px] font-bold text-amber-500 flex items-center gap-0.5">
                                ⭐ {dest.rating}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}

            {/* ────────────────────────────────────────────────────────
                TAB 2: EXPLORE DESTINATIONS
               ──────────────────────────────────────────────────────── */}
            {activeTab === 'explore' && (
              <div className="p-4 space-y-3.5 animate-page-enter">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-black text-midnight-navy dark:text-white">
                    Explore Destinations
                  </h2>
                  <span className="text-[11px] font-bold text-[#7956F5]">
                    {filteredDestinations.length} Places
                  </span>
                </div>

                {/* Region Filter Buttons */}
                <div className="grid grid-cols-4 gap-1 p-1 rounded-2xl bg-slate-200/70 dark:bg-slate-800 text-xs font-bold">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'local', label: 'Near Me' },
                    { id: 'india', label: 'India' },
                    { id: 'world', label: 'World' },
                  ].map(reg => (
                    <button
                      key={reg.id}
                      onClick={() => setExploreRegion(reg.id as any)}
                      className={`py-1.5 rounded-xl text-center text-[11px] transition-all ${
                        exploreRegion === reg.id
                          ? 'bg-white dark:bg-slate-700 text-midnight-navy dark:text-white shadow-sm font-black'
                          : 'text-slate-500 hover:text-midnight-navy'
                      }`}
                    >
                      {reg.label}
                    </button>
                  ))}
                </div>

                {/* Search input */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search city, state, country..."
                    className="w-full bg-transparent text-xs text-midnight-navy dark:text-white outline-none placeholder:text-slate-400"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="text-slate-400 text-xs">✕</button>
                  )}
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
                  {['all', 'hill', 'beach', 'heritage', 'spiritual'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setExploreCategory(cat)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold capitalize whitespace-nowrap transition-all ${
                        exploreCategory === cat
                          ? 'bg-[#7956F5] text-white shadow-sm'
                          : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {cat === 'all' ? 'All Experiences' : cat}
                    </button>
                  ))}
                </div>

                {/* Destinations Cards Grid */}
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  {filteredDestinations.slice(0, 10).map(dest => {
                    const isLiked = likedItems.includes(dest.id);
                    return (
                      <div
                        key={dest.id}
                        onClick={() => {
                          setActiveTab('copilot');
                          handleSendMessage(`I want to plan a complete trip to ${dest.name}, ${dest.country}`);
                        }}
                        className="rounded-[20px] bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col active:scale-[0.97] transition-all cursor-pointer group"
                      >
                        <div className="relative h-24 w-full">
                          <img
                            src={dest.image}
                            alt={dest.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLike(dest.id);
                            }}
                            className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/40 backdrop-blur-md text-white hover:text-rose-400"
                          >
                            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                          </button>
                          {dest.distanceDhanbadKm > 0 && (
                            <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded-full bg-black/60 text-[8px] font-bold text-white">
                              {dest.distanceDhanbadKm} km away
                            </span>
                          )}
                        </div>
                        <div className="p-2.5 flex-1 flex flex-col justify-between space-y-1">
                          <div>
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-black text-midnight-navy dark:text-white truncate">{dest.name}</h4>
                              <span className="text-[10px] font-bold text-amber-500">⭐ {dest.rating}</span>
                            </div>
                            <span className="text-[9px] text-slate-400 block truncate">{dest.country}</span>
                          </div>
                          <div className="pt-1 flex items-center justify-between">
                            <span className="text-[10px] font-black text-ai-purple">
                              {formatCurrency(dest.dailyBudgetINR, currency)}
                            </span>
                            <span className="text-[9px] font-bold text-slate-400">/day</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            )}

            {/* ────────────────────────────────────────────────────────
                TAB 3: AI TRAVEL COPILOT (Interactive Chat)
               ──────────────────────────────────────────────────────── */}
            {activeTab === 'copilot' && (
              <div className="flex flex-col h-[670px] animate-page-enter">
                
                {/* Copilot Header */}
                <div className="px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#7956F5] to-[#3478F6] flex items-center justify-center text-white shadow-md">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-midnight-navy dark:text-white">AI Copilot</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      </div>
                      <span className="text-[9px] text-slate-400">13 Autonomous Agents</span>
                    </div>
                  </div>

                  {/* Language switch */}
                  <div className="flex items-center gap-1 p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-[10px] font-bold">
                    <button
                      onClick={() => setCopilotLang('en')}
                      className={`px-2 py-0.5 rounded-lg transition ${copilotLang === 'en' ? 'bg-[#7956F5] text-white' : 'text-slate-500'}`}
                    >
                      EN
                    </button>
                    <button
                      onClick={() => setCopilotLang('hi')}
                      className={`px-2 py-0.5 rounded-lg transition ${copilotLang === 'hi' ? 'bg-[#7956F5] text-white' : 'text-slate-500'}`}
                    >
                      हिन्दी
                    </button>
                  </div>
                </div>

                {/* Messages Body */}
                <div className="flex-1 p-3 overflow-y-auto space-y-3">
                  {mobileMessages.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} animate-message-in`}
                    >
                      <div
                        className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                          msg.sender === 'user'
                            ? 'bg-gradient-to-r from-[#7956F5] to-[#3478F6] text-white font-medium rounded-tr-xs shadow-md'
                            : 'bg-white dark:bg-slate-800 text-midnight-navy dark:text-slate-100 border border-slate-200/80 dark:border-slate-700 rounded-tl-xs shadow-xs'
                        }`}
                      >
                        <div className="whitespace-pre-line">{msg.text}</div>

                        {/* Interactive Copilot Card if available */}
                        {msg.cards && (
                          <div className="mt-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                            <div className="flex items-center justify-between text-[11px] font-black text-midnight-navy dark:text-white">
                              <span>{msg.cards.destination}</span>
                              <span className="text-ai-purple">{msg.cards.budget}</span>
                            </div>
                            <div className="text-[10px] text-slate-500">PNR: {msg.cards.pnr} • {msg.cards.days} Days</div>
                            <button
                              onClick={() => {
                                setSelectedPackage({
                                  title: 'Dubai Adventure 10-Day Plan',
                                  priceINR: 97000,
                                  duration: '10 Days / 9 Nights',
                                  destination: 'Dubai, UAE'
                                });
                                setBookingStep('details');
                              }}
                              className="w-full py-1.5 rounded-lg bg-gradient-to-r from-[#7956F5] to-[#3478F6] text-white font-bold text-[10px] text-center"
                            >
                              Reserve This Trip
                            </button>
                          </div>
                        )}
                      </div>
                      <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.time}</span>
                    </div>
                  ))}

                  {/* Typing Dots */}
                  {isTyping && (
                    <div className="flex items-center gap-1 p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 w-16">
                      <div className="w-1.5 h-1.5 rounded-full bg-ai-purple animate-bounce" />
                      <div className="w-1.5 h-1.5 rounded-full bg-ai-purple animate-bounce" style={{ animationDelay: '0.15s' }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-ai-purple animate-bounce" style={{ animationDelay: '0.3s' }} />
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Prompts Bar */}
                <div className="p-2 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                  {[
                    'Plan 10 Days in Dubai',
                    'Dhanbad to Ranchi Cab',
                    'Goa Packages under ₹20k',
                    'Visa for Thailand',
                  ].map(prompt => (
                    <button
                      key={prompt}
                      onClick={() => handleSendMessage(prompt)}
                      className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-semibold text-slate-600 dark:text-slate-300 shrink-0 whitespace-nowrap active:scale-95 transition"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>

                {/* Message Input Box */}
                <div className="p-2.5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsListening(prev => !prev);
                      if (!isListening) {
                        setTimeout(() => {
                          setChatInput('Best flight deals from Kolkata to Dubai');
                          setIsListening(false);
                        }, 1800);
                      }
                    }}
                    className={`p-2 rounded-full transition-transform active:scale-90 ${
                      isListening
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'text-slate-400 hover:text-ai-purple bg-slate-100 dark:bg-slate-800'
                    }`}
                  >
                    <Mic className="w-4 h-4" />
                  </button>

                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={copilotLang === 'hi' ? "यात्रा के बारे में पूछें..." : "Ask TravelMate Copilot..."}
                    className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full px-3.5 py-2 text-xs text-midnight-navy dark:text-white outline-none border border-transparent focus:border-ai-purple"
                  />

                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!chatInput.trim()}
                    className="w-8 h-8 rounded-full bg-gradient-to-r from-[#7956F5] to-[#3478F6] text-white flex items-center justify-center disabled:opacity-40 active:scale-90 transition-transform shadow-md"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            )}

            {/* ────────────────────────────────────────────────────────
                TAB 4: HOLIDAY PACKAGES & MOBILITY
               ──────────────────────────────────────────────────────── */}
            {activeTab === 'packages' && (
              <div className="p-4 space-y-3.5 animate-page-enter">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-black text-midnight-navy dark:text-white">
                    Packages & Rentals
                  </h2>
                  <span className="text-[10px] font-bold text-ai-purple">Direct Instant Booking</span>
                </div>

                {/* Sub-Tabs: Packages / Cabs / Cars / Bikes */}
                <div className="grid grid-cols-4 gap-1 p-1 rounded-2xl bg-slate-200/70 dark:bg-slate-800 text-xs font-bold">
                  {[
                    { id: 'packages', label: 'Packages' },
                    { id: 'cabs', label: 'Cabs' },
                    { id: 'cars', label: 'Self Drive' },
                    { id: 'bikes', label: 'Bikes' },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setMobilityFilter(tab.id as any)}
                      className={`py-1.5 rounded-xl text-center text-[10px] transition-all ${
                        mobilityFilter === tab.id
                          ? 'bg-white dark:bg-slate-700 text-midnight-navy dark:text-white shadow-sm font-black'
                          : 'text-slate-500 hover:text-midnight-navy'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Packages List */}
                {mobilityFilter === 'packages' && (
                  <div className="space-y-3">
                    {HOLIDAY_PACKAGES.map(pkg => (
                      <div
                        key={pkg.id}
                        onClick={() => {
                          setSelectedPackage({
                            title: pkg.title,
                            duration: `${pkg.durationDays}D / ${pkg.durationNights}N`,
                            priceINR: pkg.priceINR,
                            destination: pkg.destinations
                          });
                          setBookingStep('details');
                        }}
                        className="rounded-[20px] bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-sm overflow-hidden active:scale-[0.98] transition-all cursor-pointer"
                      >
                        <div className="relative h-32 w-full">
                          <img
                            src={pkg.image}
                            alt={pkg.title}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-black/60 text-white text-[9px] font-bold backdrop-blur-sm">
                            {pkg.badge || 'Featured'}
                          </span>
                          <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-white text-midnight-navy text-[10px] font-black shadow">
                            ⭐ {pkg.rating}
                          </span>
                        </div>
                        <div className="p-3 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">
                              {pkg.durationDays}D / {pkg.durationNights}N
                            </span>
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                              Verified Deal
                            </span>
                          </div>
                          <h4 className="text-xs font-black text-midnight-navy dark:text-white">{pkg.title}</h4>
                          <p className="text-[10px] text-slate-500 line-clamp-1">{pkg.inclusions}</p>
                          <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-700/60">
                            <div>
                              <span className="text-[9px] text-slate-400 block">All inclusive</span>
                              <span className="text-sm font-black text-ai-purple">
                                {formatCurrency(pkg.priceINR, currency)}
                              </span>
                            </div>
                            <button className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#7956F5] to-[#3478F6] text-white text-[11px] font-bold shadow-sm">
                              Book Package
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Mobility Fleet: Cabs / Cars / Bikes */}
                {mobilityFilter !== 'packages' && (
                  <div className="space-y-3">
                    {MOBILITY_FLEET.filter(m => {
                      if (mobilityFilter === 'cabs') return m.category === 'Cab';
                      if (mobilityFilter === 'cars') return m.category === 'Self-Drive Car';
                      if (mobilityFilter === 'bikes') return m.category === 'Bike Rental';
                      return true;
                    }).map(item => (
                      <div
                        key={item.id}
                        onClick={() => {
                          setSelectedPackage({
                            title: item.name,
                            priceINR: item.baseFareINR,
                            duration: item.category === 'Cab' ? 'Per Ride' : 'Per Day',
                            destination: item.service,
                            badge: item.capacity
                          });
                          setBookingStep('details');
                        }}
                        className="p-3 rounded-[20px] bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-sm flex items-center gap-3 cursor-pointer active:scale-[0.98] transition-all"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 rounded-2xl object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-black text-midnight-navy dark:text-white truncate">{item.name}</h4>
                            <span className="text-[10px] font-bold text-amber-500">⭐ {item.rating}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-medium">{item.service} • {item.capacity}</div>
                          <div className="flex flex-wrap gap-1">
                            {item.features.split(',').slice(0, 2).map((f: string, i: number) => (
                              <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                                {f.trim()}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center justify-between pt-1">
                            <span className="text-xs font-black text-[#16BFA5]">
                              {formatCurrency(item.baseFareINR, currency)}
                              <span className="text-[9px] text-slate-400 font-normal"> base</span>
                            </span>
                            <span className="text-[10px] font-bold text-[#7956F5]">Select</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            )}

            {/* ────────────────────────────────────────────────────────
                TAB 5: MY TRIPS & BOARDING PASS
               ──────────────────────────────────────────────────────── */}
            {activeTab === 'trips' && (
              <div className="p-4 space-y-4 animate-page-enter">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-black text-midnight-navy dark:text-white">
                    My Trips & Passes
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 text-[10px] font-black">
                    1 UPCOMING
                  </span>
                </div>

                {/* Upcoming Trip Card: Dubai */}
                <div className="rounded-[24px] bg-gradient-to-br from-[#101D42] to-[#1E2E62] text-white p-4 shadow-xl space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-black border border-amber-400/30">
                      Confirmed Itinerary
                    </span>
                    <span className="text-[11px] text-sky-200 font-bold">11 Days Away</span>
                  </div>

                  <div>
                    <h3 className="text-lg font-black tracking-tight">{activeTrip.title}</h3>
                    <p className="text-xs text-slate-300 mt-0.5">{activeTrip.startDate} – {activeTrip.endDate}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Flight PNR</span>
                      <span className="font-mono font-black text-sky-300">EK-948123</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Total Budget</span>
                      <span className="font-black text-emerald-300">
                        {formatCurrency(activeTrip.budgetBreakdown.totalINR, currency)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowBoardingPass(true)}
                    className="w-full py-2.5 rounded-xl bg-white text-midnight-navy font-black text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-transform"
                  >
                    <QrCode className="w-3.5 h-3.5 text-ai-purple" />
                    <span>View Digital Boarding Pass</span>
                  </button>
                </div>

                {/* Expense Breakdown */}
                <div className="p-3.5 rounded-[20px] bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-xs font-black text-midnight-navy dark:text-white">
                    <span>Trip Budget Allocation</span>
                    <span className="text-ai-purple">₹97,000 / ₹1,20,000</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                    <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-ai-purple to-ocean-blue" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-1 text-[10px]">
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                      <span className="text-slate-400 block">Flights</span>
                      <span className="font-black text-midnight-navy dark:text-white">₹32,500</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                      <span className="text-slate-400 block">Hotels</span>
                      <span className="font-black text-midnight-navy dark:text-white">₹40,500</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                      <span className="text-slate-400 block">Activities</span>
                      <span className="font-black text-midnight-navy dark:text-white">₹24,000</span>
                    </div>
                  </div>
                </div>

                {/* Past Trips */}
                <div className="space-y-2 pt-1">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Completed Trips</h4>
                  {[
                    { title: 'Goa Coastal Escape', dates: '12 Feb - 16 Feb 2026', pnr: '6E-4019', amount: '₹22,400' },
                    { title: 'Netarhat Weekend Retreat', dates: '05 Jan - 07 Jan 2026', pnr: 'CAB-DHN-882', amount: '₹7,200' },
                  ].map((past, i) => (
                    <div key={i} className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-midnight-navy dark:text-white block">{past.title}</span>
                        <span className="text-[10px] text-slate-400">{past.dates}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-slate-600 dark:text-slate-300 block">{past.amount}</span>
                        <span className="text-[9px] text-emerald-500 font-bold">Completed</span>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* ────────────────────────────────────────────────────────
                TAB 6: PROFILE & WALLET
               ──────────────────────────────────────────────────────── */}
            {activeTab === 'profile' && (
              <div className="p-4 space-y-4 animate-page-enter">
                
                {/* Profile Card */}
                <div className="p-4 rounded-[24px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3.5">
                  <img
                    src={userProfile.avatar}
                    alt={userProfile.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#7956F5]"
                  />
                  <div>
                    <h3 className="text-sm font-black text-midnight-navy dark:text-white flex items-center gap-1.5">
                      <span>{userProfile.name}</span>
                      <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">✓</span>
                    </h3>
                    <p className="text-[11px] text-slate-400">{userProfile.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-purple-500/10 text-ai-purple text-[10px] font-black">
                      Passport Verified (India)
                    </span>
                  </div>
                </div>

                {/* Travel Wallet Balance */}
                <div className="p-4 rounded-[20px] bg-gradient-to-r from-[#7956F5] to-[#3478F6] text-white shadow-lg space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-purple-200">TravelMate Wallet</span>
                    <Coins className="w-4 h-4 text-amber-300" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black">₹4,500</span>
                    <span className="text-[11px] text-purple-200">(4,500 Coins)</span>
                  </div>
                  <p className="text-[10px] text-purple-100">Use on flight, hotel, and cab bookings for instant discount.</p>
                </div>

                {/* Safety & SOS Card */}
                <div className="p-3.5 rounded-[20px] bg-rose-500/10 border border-rose-500/25 space-y-2">
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-black">
                    <PhoneCall className="w-4 h-4" />
                    <span>24/7 Travel Emergency Helpline</span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Team Innovation 27X7 concierge support active with direct Indian Embassy & Amadeus GDS safety link.
                  </p>
                </div>

              </div>
            )}

          </div>

          {/* ══════════════════════════════════════════════════════════
              BOOKING & CHECKOUT MODAL OVERLAY
             ══════════════════════════════════════════════════════════ */}
          {selectedPackage && (
            <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end animate-fade-in">
              <div className="rounded-t-[32px] bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-5 space-y-4 max-h-[90%] overflow-y-auto">
                
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedPackage(null)}
                      className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-black text-midnight-navy dark:text-white">
                      {bookingStep === 'confirmed' ? 'Booking Confirmed' : 'Instant Checkout'}
                    </span>
                  </div>
                  <button onClick={() => setSelectedPackage(null)} className="text-slate-400">✕</button>
                </div>

                {bookingStep === 'details' && (
                  <div className="space-y-3.5 animate-slide-up">
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] font-bold text-ai-purple uppercase">{selectedPackage.duration}</span>
                      <h4 className="text-xs font-black text-midnight-navy dark:text-white">{selectedPackage.title}</h4>
                      <div className="mt-1 flex items-center justify-between text-xs">
                        <span className="text-slate-500">Total Price</span>
                        <span className="font-black text-ai-purple">{formatCurrency(selectedPackage.priceINR || 2800, currency)}</span>
                      </div>
                    </div>

                    {/* Traveler info */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-500">Lead Traveler</label>
                      <input
                        type="text"
                        defaultValue={userProfile.name}
                        className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-midnight-navy dark:text-white"
                      />
                    </div>

                    {/* Coupon */}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Coupon Code"
                        className="flex-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-midnight-navy dark:text-white uppercase"
                      />
                      <button
                        onClick={() => setCouponApplied(true)}
                        className="px-3 py-2.5 rounded-xl bg-emerald-500 text-white font-bold text-xs"
                      >
                        {couponApplied ? 'Applied ✓' : 'Apply'}
                      </button>
                    </div>
                    {couponApplied && (
                      <span className="text-[10px] text-emerald-600 font-bold block">₹1,500 Coupon Discount Applied!</span>
                    )}

                    <button
                      onClick={() => setBookingStep('payment')}
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#7956F5] to-[#3478F6] text-white font-black text-xs shadow-lg active:scale-95 transition-transform"
                    >
                      Proceed to UPI Payment
                    </button>
                  </div>
                )}

                {bookingStep === 'payment' && (
                  <div className="space-y-3.5 animate-slide-up">
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Payable Amount</span>
                        <span className="font-black text-midnight-navy dark:text-white">
                          {formatCurrency((selectedPackage.priceINR || 2800) - (couponApplied ? 1500 : 0), currency)}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">Includes all taxes, fees & 24/7 SOS safety</span>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-slate-500">Select Instant Payment</span>
                      {['UPI (Google Pay / PhonePe / Paytm)', 'Credit / Debit Card', 'TravelMate Coins (₹4,500 available)'].map((method, idx) => (
                        <div key={idx} className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs cursor-pointer hover:border-ai-purple">
                          <span className="font-bold text-midnight-navy dark:text-white">{method}</span>
                          <span className="w-3.5 h-3.5 rounded-full border-2 border-ai-purple flex items-center justify-center">
                            {idx === 0 && <span className="w-2 h-2 rounded-full bg-ai-purple" />}
                          </span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={handleConfirmBooking}
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-xs shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Confirm & Issue Ticket</span>
                    </button>
                  </div>
                )}

                {bookingStep === 'confirmed' && (
                  <div className="space-y-4 text-center py-4 animate-scale-in">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center mx-auto animate-bounce">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-midnight-navy dark:text-white">Booking Confirmed!</h3>
                      <p className="text-xs text-slate-400 mt-0.5">PNR: {bookingSuccessData?.pnr || 'INNOV-9481'}</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-xs text-left space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Passenger:</span>
                        <span className="font-bold text-midnight-navy dark:text-white">{userProfile.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Trip:</span>
                        <span className="font-bold text-midnight-navy dark:text-white">{selectedPackage.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Status:</span>
                        <span className="font-bold text-emerald-500">Confirmed (Amadeus GDS)</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedPackage(null);
                        setActiveTab('trips');
                      }}
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#7956F5] to-[#3478F6] text-white font-black text-xs shadow-md"
                    >
                      View in My Trips
                    </button>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              DIGITAL BOARDING PASS MODAL
             ══════════════════════════════════════════════════════════ */}
          {showBoardingPass && (
            <div className="absolute inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col justify-center p-4 animate-fade-in">
              <div className="rounded-[28px] bg-white text-slate-900 p-5 space-y-4 shadow-2xl relative">
                <button
                  onClick={() => setShowBoardingPass(false)}
                  className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2">
                  <Plane className="w-5 h-5 text-ai-purple -rotate-45" />
                  <span className="font-black text-sm">Boarding Pass • Emirates EK 571</span>
                </div>

                <div className="flex items-center justify-between border-y border-dashed border-slate-200 py-3">
                  <div>
                    <span className="text-2xl font-black">CCU</span>
                    <span className="text-[10px] text-slate-500 block">Kolkata, IN</span>
                  </div>
                  <Plane className="w-4 h-4 text-slate-400" />
                  <div className="text-right">
                    <span className="text-2xl font-black">DXB</span>
                    <span className="text-[10px] text-slate-500 block">Dubai, UAE</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[10px]">
                  <div>
                    <span className="text-slate-400 block">Passenger</span>
                    <span className="font-black text-midnight-navy">{userProfile.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Seat</span>
                    <span className="font-black text-midnight-navy">12A (Window)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Gate</span>
                    <span className="font-black text-midnight-navy">B14</span>
                  </div>
                </div>

                {/* Simulated QR Code */}
                <div className="p-4 rounded-2xl bg-slate-100 flex flex-col items-center justify-center space-y-2">
                  <QrCode className="w-24 h-24 text-slate-900" />
                  <span className="font-mono text-[9px] text-slate-500 tracking-widest">EK948123-CCU-DXB-2026</span>
                </div>

                <button
                  onClick={() => setShowBoardingPass(false)}
                  className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
                >
                  Close Pass
                </button>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              BOTTOM TAB BAR (Premium, Minimal, Modern)
             ══════════════════════════════════════════════════════════ */}
          <nav className="absolute bottom-0 inset-x-0 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-around px-2 z-30">
            
            {/* 1. Home */}
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center justify-center gap-1 transition-all duration-200 ${
                activeTab === 'home'
                  ? 'text-[#7956F5] scale-110 font-black'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="text-[9px]">Home</span>
            </button>

            {/* 2. Explore */}
            <button
              onClick={() => setActiveTab('explore')}
              className={`flex flex-col items-center justify-center gap-1 transition-all duration-200 ${
                activeTab === 'explore'
                  ? 'text-[#7956F5] scale-110 font-black'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              <Compass className="w-5 h-5" />
              <span className="text-[9px]">Explore</span>
            </button>

            {/* 3. AI Copilot (Center floating gradient badge) */}
            <button
              onClick={() => setActiveTab('copilot')}
              className="-mt-5 flex flex-col items-center justify-center group active:scale-90 transition-transform"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#7956F5] via-[#3478F6] to-[#16BFA5] p-0.5 shadow-lg shadow-purple-500/30 group-hover:scale-105 transition">
                <div className="w-full h-full rounded-2xl bg-[#101D42] flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />
                </div>
              </div>
              <span className="text-[9px] font-black text-[#7956F5] mt-1">Copilot</span>
            </button>

            {/* 4. Packages & Mobility */}
            <button
              onClick={() => setActiveTab('packages')}
              className={`flex flex-col items-center justify-center gap-1 transition-all duration-200 ${
                activeTab === 'packages'
                  ? 'text-[#7956F5] scale-110 font-black'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              <Luggage className="w-5 h-5" />
              <span className="text-[9px]">Packages</span>
            </button>

            {/* 5. Trips */}
            <button
              onClick={() => setActiveTab('trips')}
              className={`flex flex-col items-center justify-center gap-1 transition-all duration-200 ${
                activeTab === 'trips'
                  ? 'text-[#7956F5] scale-110 font-black'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              <Ticket className="w-5 h-5" />
              <span className="text-[9px]">My Trips</span>
            </button>

          </nav>

          {/* Home Indicator bar */}
          <div className="absolute bottom-1.5 inset-x-0 flex justify-center pointer-events-none z-40">
            <div className="w-32 h-1 rounded-full bg-slate-400/50" />
          </div>

        </div>
      </div>
    </div>
  );
};
