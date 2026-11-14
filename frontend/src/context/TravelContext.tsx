import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  AgentChatMessage, 
  AgentInfo, 
  AgentRole, 
  BookingConfirmation, 
  Currency, 
  FullTripItinerary, 
  LanguageCode, 
  ScreenType, 
  UserProfile 
} from '../types';
import { 
  DEFAULT_USER_PROFILE, 
  DHANBAD_DUBAI_10DAY_ITINERARY, 
  DUBAI_FLIGHT_OPTIONS, 
  DUBAI_HOTEL_OPTIONS, 
  EXPLORER_DESTINATIONS,
  INITIAL_AGENTS 
} from '../data/travelData';

interface TravelNotification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'flight' | 'visa' | 'deal' | 'copilot';
}

interface TravelContextType {
  currentScreen: ScreenType;
  setCurrentScreen: (s: ScreenType) => void;
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
  toggleTheme: () => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  language: LanguageCode;
  setLanguage: (l: LanguageCode) => void;
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  agents: AgentInfo[];
  updateAgentStatus: (id: AgentRole, status: AgentInfo['status'], activity?: string) => void;
  activeTrip: FullTripItinerary;
  setActiveTrip: React.Dispatch<React.SetStateAction<FullTripItinerary>>;
  chatMessages: AgentChatMessage[];
  addChatMessage: (msg: AgentChatMessage) => void;
  sendUserPrompt: (prompt: string) => Promise<void>;
  isVoiceActive: boolean;
  setIsVoiceActive: (active: boolean) => void;
  isSpeaking: boolean;
  speakText: (text: string) => void;
  stopSpeaking: () => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  bookingModalOpen: boolean;
  setBookingModalOpen: (open: boolean) => void;
  notificationModalOpen: boolean;
  setNotificationModalOpen: (open: boolean) => void;
  marketplaceModalOpen: boolean;
  setMarketplaceModalOpen: (open: boolean) => void;
  marketplaceTab: 'packages' | 'cabs' | 'cars' | 'bikes' | 'sightseeing';
  setMarketplaceTab: (tab: 'packages' | 'cabs' | 'cars' | 'bikes' | 'sightseeing') => void;
  openMarketplace: (tab?: 'packages' | 'cabs' | 'cars' | 'bikes' | 'sightseeing') => void;
  viewMode: 'desktop' | 'mobile';
  setViewMode: (v: 'desktop' | 'mobile') => void;
  activeBooking: BookingConfirmation | null;
  setActiveBooking: (b: BookingConfirmation | null) => void;
  bookingHistory: BookingConfirmation[];
  addBookingToHistory: (b: BookingConfirmation) => void;
  savedDestinations: string[];
  toggleSaveDestination: (id: string) => void;
  notifications: TravelNotification[];
  markAllNotificationsRead: () => void;
  searchFilter: {
    origin: string;
    destination: string;
    dates: string;
    travelers: number;
    cabinClass: string;
  };
  setSearchFilter: React.Dispatch<React.SetStateAction<{
    origin: string;
    destination: string;
    dates: string;
    travelers: number;
    cabinClass: string;
  }>>;
}

const TravelContext = createContext<TravelContextType | undefined>(undefined);

export const TravelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Start on 03-landing or 05-dashboard as desired; default to 05-dashboard or 03-landing
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('05-dashboard');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [currency, setCurrency] = useState<Currency>('INR');
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [agents, setAgents] = useState<AgentInfo[]>(INITIAL_AGENTS);
  const [activeTrip, setActiveTrip] = useState<FullTripItinerary>(DHANBAD_DUBAI_10DAY_ITINERARY);
  const [isVoiceActive, setIsVoiceActive] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [bookingModalOpen, setBookingModalOpen] = useState<boolean>(false);
  const [notificationModalOpen, setNotificationModalOpen] = useState<boolean>(false);
  const [marketplaceModalOpen, setMarketplaceModalOpen] = useState<boolean>(false);
  const [marketplaceTab, setMarketplaceTab] = useState<'packages' | 'cabs' | 'cars' | 'bikes' | 'sightseeing'>('packages');
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  const openMarketplace = (tab?: 'packages' | 'cabs' | 'cars' | 'bikes' | 'sightseeing') => {
    if (tab) setMarketplaceTab(tab);
    setMarketplaceModalOpen(true);
  };
  const [activeBooking, setActiveBooking] = useState<BookingConfirmation | null>(null);
  const [savedDestinations, setSavedDestinations] = useState<string[]>(['dest-dubai', 'dest-bali', 'dest-singapore']);

  const [notifications, setNotifications] = useState<TravelNotification[]>([
    {
      id: 'notif-1',
      title: 'Flight Fare Drop Alert',
      description: 'Emirates EK 571 CCU-DXB dropped by ₹3,200 for your travel dates!',
      time: '10m ago',
      read: false,
      type: 'deal',
    },
    {
      id: 'notif-2',
      title: 'Dubai Visa Reminder',
      description: 'Your passport has 3+ years validity. Pre-arranged eVisa can be submitted now.',
      time: '2h ago',
      read: false,
      type: 'visa',
    },
    {
      id: 'notif-3',
      title: 'Copilot Itinerary Ready',
      description: 'Day 3 Burj Khalifa At The Top morning slot confirmed in plan.',
      time: '1d ago',
      read: true,
      type: 'copilot',
    },
  ]);

  const [bookingHistory, setBookingHistory] = useState<BookingConfirmation[]>([
    {
      bookingId: 'TM-DXB-92841',
      pnr: 'EK-948123',
      passengerName: 'Ranjeet',
      tripTitle: 'Dubai Adventure',
      origin: 'Dhanbad (via CCU Kolkata)',
      destination: 'Dubai International (DXB)',
      dates: '15 Nov - 24 Nov 2026',
      flightDetails: DUBAI_FLIGHT_OPTIONS[0],
      hotelDetails: DUBAI_HOTEL_OPTIONS[0],
      totalPaidINR: 97000,
      currency: 'INR',
      bookingDate: '2026-11-04',
      paymentMethod: 'UPI',
      status: 'Confirmed',
    }
  ]);

  const [searchFilter, setSearchFilter] = useState({
    origin: 'Dhanbad (via CCU / IXR)',
    destination: 'Dubai, UAE',
    dates: '15 Nov - 24 Nov (10 Days)',
    travelers: 1,
    cabinClass: 'Economy',
  });

  // Apply dark/light class to <html> element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleSaveDestination = (id: string) => {
    setSavedDestinations(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const [chatMessages, setChatMessages] = useState<AgentChatMessage[]>([
    {
      id: 'init-msg-1',
      sender: 'copilot',
      agentRole: 'orchestrator',
      text: "Hi Ranjeet! 👋 I'm your AI Travel Copilot. Where would you like to travel?",
      timestamp: '10:00 AM',
    },
    {
      id: 'init-msg-2',
      sender: 'user',
      text: 'I want to travel from Dhanbad to Dubai for 10 days.',
      timestamp: '10:01 AM',
    },
    {
      id: 'init-msg-3',
      sender: 'copilot',
      agentRole: 'planner',
      text: `Great choice! 🌴 Here's a quick plan for your 10-day Dubai trip:\n\n` +
        `✈️ **Flights**: from ₹32,500 (round trip)\n` +
        `🏨 **Hotels**: from ₹4,500/night\n` +
        `🗺️ **Itinerary**: Top sights, activities & day plan\n` +
        `💰 **Est. Budget**: ₹85,000 - ₹1,25,000\n` +
        `🛂 **Visa**: E-Visa (for Indian passport)`,
      timestamp: '10:01 AM',
      cards: [
        {
          type: 'itinerary_preview',
          data: DHANBAD_DUBAI_10DAY_ITINERARY,
        }
      ],
      agentThoughtTrace: [
        { agentId: 'flight', action: 'Searched Amadeus: Emirates EK 571 found at ₹32,500 round trip', status: 'done' },
        { agentId: 'hotel', action: 'Matched Rove Downtown at ₹4,500/night with Burj Khalifa view', status: 'done' },
        { agentId: 'budget', action: 'Estimated 10-day expense at ₹97,000 (Fits in ₹85k-₹125k band)', status: 'done' },
        { agentId: 'visa', action: 'Verified 30-Day UAE eVisa for Indian passport', status: 'done' },
      ]
    }
  ]);

  // Voice TTS helper using Web Speech API
  const speakText = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    
    const cleanText = text
      .replace(/[*#_`]/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .slice(0, 320);

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, []);

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const updateAgentStatus = useCallback((id: AgentRole, status: AgentInfo['status'], activity?: string) => {
    setAgents(prev => prev.map(ag => {
      if (ag.id === id) {
        return {
          ...ag,
          status,
          lastActivity: activity || ag.lastActivity,
        };
      }
      return ag;
    }));
  }, []);

  const addChatMessage = useCallback((msg: AgentChatMessage) => {
    setChatMessages(prev => [...prev, msg]);
  }, []);

  const addBookingToHistory = useCallback((b: BookingConfirmation) => {
    setBookingHistory(prev => [b, ...prev]);
  }, []);

  // Multi-agent orchestration handler
  const sendUserPrompt = async (prompt: string) => {
    const userMsgId = `usr-${Date.now()}`;
    const userMsg: AgentChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages(prev => [...prev, userMsg]);

    const lower = prompt.toLowerCase();

    // Check if user requested a specific destination from our 52 locations
    const matchedDest = EXPLORER_DESTINATIONS.find(d => {
      const dName = d.name.toLowerCase();
      const dCity = d.city.toLowerCase();
      const keywords = [
        ...dName.replace(/&/g, '/').split('/'),
        ...dCity.replace(/&/g, '/').split('/'),
        ...(d.state ? [d.state.toLowerCase()] : [])
      ].map(k => k.trim()).filter(k => k.length >= 3);
      return keywords.some(k => lower.includes(k));
    });

    const isDubaiQuery = lower.includes('dubai') || (lower.includes('dhanbad') && lower.includes('10 days'));

    if (isDubaiQuery) {
      updateAgentStatus('orchestrator', 'thinking', 'Delegating intent to 11 agents: Dhanbad ➔ Dubai (10 Days)');
      updateAgentStatus('flight', 'searching', 'Scanning CCU/IXR to DXB flights via Amadeus API...');
      updateAgentStatus('hotel', 'searching', 'Filtering 4★ & 5★ Downtown Dubai hotels...');
      updateAgentStatus('visa', 'searching', 'Validating UAE 30-Day tourist eVisa requirements for Indian passport...');
      updateAgentStatus('budget', 'thinking', 'Modeling estimated total trip budget in INR (₹85k - ₹125k)...');

      await new Promise(r => setTimeout(r, 900));

      updateAgentStatus('planner', 'completed', 'Synthesized 10-day comprehensive itinerary');
      updateAgentStatus('flight', 'completed', 'Found Emirates direct flight starting ₹32,500');
      updateAgentStatus('hotel', 'completed', 'Selected Rove Downtown at ₹4,500/night');
      updateAgentStatus('visa', 'completed', 'Confirmed 30-Day eVisa available (2-3 days processing)');
      updateAgentStatus('budget', 'completed', 'Estimated total: ₹97,000 (Flights + 9 nights + Activities)');

      const responseText = `Great choice! 🌴 Here's a quick plan for your 10-day Dubai trip:\n\n` +
        `✈️ **Flights**: from ₹32,500 (round trip via Emirates / IndiGo)\n` +
        `🏨 **Hotels**: from ₹4,500/night (Rove Downtown with Burj Khalifa views)\n` +
        `🗺️ **Itinerary**: Day-by-day plan covering Burj Khalifa, Desert Safari, Palm Jumeirah & Abu Dhabi\n` +
        `💰 **Est. Budget**: ₹85,000 - ₹1,25,000 (Safe within your ₹1,50,000 cap!)\n` +
        `🛂 **Visa**: 30-Day Tourist eVisa (2–3 business days processing for Indian passport)`;

      const copilotResponse: AgentChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'copilot',
        agentRole: 'planner',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        cards: [
          {
            type: 'itinerary_preview',
            data: DHANBAD_DUBAI_10DAY_ITINERARY,
          },
          {
            type: 'flight_list',
            data: DUBAI_FLIGHT_OPTIONS.slice(0, 2),
          },
          {
            type: 'hotel_list',
            data: DUBAI_HOTEL_OPTIONS.slice(0, 2),
          },
        ],
        agentThoughtTrace: [
          { agentId: 'flight', action: 'Amadeus GDS: Emirates EK 571 direct at ₹32,500 selected', status: 'done' },
          { agentId: 'hotel', action: 'Rove Downtown verified at ₹4,500/night with Burj Khalifa views', status: 'done' },
          { agentId: 'budget', action: 'Tally: Flights (₹32.5k) + Hotel (₹40.5k) + Activities (₹18k) + Transit (₹6k) = ₹97,000', status: 'done' },
          { agentId: 'visa', action: 'IATA Timatic: 30-Day UAE tourist eVisa verified for Indian passport', status: 'done' },
        ]
      };

      setChatMessages(prev => [...prev, copilotResponse]);
      speakText("Great choice! Here is a plan for your 10-day Dubai trip with flights from 32,500 rupees and hotels from 4,500 per night.");
      setActiveTrip(DHANBAD_DUBAI_10DAY_ITINERARY);
    } else if (matchedDest) {
      // Dynamic multi-agent planning for any destination in our 52 locations
      const daysMatch = prompt.match(/(\d+)\s*(days?|दिन)/i);
      const days = daysMatch ? parseInt(daysMatch[1], 10) : (matchedDest.region === 'India' ? (matchedDest.distanceDhanbadKm < 300 ? 3 : 5) : 7);

      let transitAdvice = '';
      let transitCost = 0;
      if (matchedDest.distanceDhanbadKm <= 200) {
        transitAdvice = `Direct AC Outstation Cab or Express Train from Dhanbad (2–4 hours, ~₹2,200 – ₹3,500)`;
        transitCost = 3000;
      } else if (matchedDest.distanceDhanbadKm <= 500) {
        transitAdvice = `Vande Bharat Express / Intercity Train or Dedicated Highway Cab (~₹3,500 – ₹6,000)`;
        transitCost = 4500;
      } else if (matchedDest.region === 'India') {
        transitAdvice = `Direct Flights from Ranchi (IXR) / Kolkata (CCU) or Rajdhani / Vande Bharat Express (from ~₹4,800 round trip)`;
        transitCost = 9000;
      } else {
        transitAdvice = `International Flights departing from Kolkata (CCU) / Delhi (DEL) (from ~₹28,000 round trip)`;
        transitCost = 32000;
      }

      const nightRate = Math.round(matchedDest.dailyBudgetINR * 0.85);
      const totalStay = nightRate * (days - 1);
      const totalEst = Math.round((matchedDest.dailyBudgetINR * days) + transitCost);

      updateAgentStatus('orchestrator', 'thinking', `Delegating itinerary synthesis for ${matchedDest.name} (${days} Days)...`);
      updateAgentStatus('destination', 'searching', `Indexing sightseeing hubs and seasonality for ${matchedDest.name}...`);
      updateAgentStatus('flight', 'searching', `Scanning transit options from Dhanbad base / CCU / IXR...`);
      updateAgentStatus('hotel', 'searching', `Shortlisting rated stays around ${matchedDest.city}...`);
      updateAgentStatus('budget', 'thinking', `Calculating cost matrix in ${currency}...`);
      updateAgentStatus('visa', 'completed', `IATA check: ${matchedDest.visa}`);

      await new Promise(r => setTimeout(r, 900));

      updateAgentStatus('planner', 'completed', `Synthesized ${days}-day custom plan for ${matchedDest.name}`);
      updateAgentStatus('flight', 'completed', `Transit route locked (${transitAdvice.slice(0, 35)}...)`);
      updateAgentStatus('hotel', 'completed', `Found top-rated stays starting ₹${nightRate.toLocaleString('en-IN')}/night`);
      updateAgentStatus('budget', 'completed', `Est. total ₹${totalEst.toLocaleString('en-IN')}`);

      const responseText = `🌟 **${matchedDest.name} AI Travel Plan (${days} Days)**\n` +
        `📍 **Destination**: ${matchedDest.city}, ${matchedDest.state ? matchedDest.state + ', ' : ''}${matchedDest.country} (${matchedDest.tag})\n\n` +
        `✈️ **Transit & Route**: ${transitAdvice}\n` +
        `🏨 **Recommended Stays**: Verified hotels from ₹${nightRate.toLocaleString('en-IN')}/night (${days - 1} nights ~ ₹${totalStay.toLocaleString('en-IN')})\n` +
        `🗺️ **Must-Experience Highlights**:\n${matchedDest.highlights.slice(0, 4).map(h => `• ${h}`).join('\n')}\n` +
        `🍲 **Local Gastronomy**: ${matchedDest.cuisine}\n` +
        `💰 **Est. Total Budget**: ₹${totalEst.toLocaleString('en-IN')} (Includes Travel, Hotel, Activities & Food)\n` +
        `🛂 **Entry & Visa**: ${matchedDest.visa}\n` +
        `☀️ **Best Travel Window**: ${matchedDest.bestSeason}`;

      const copilotResponse: AgentChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'copilot',
        agentRole: 'planner',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        agentThoughtTrace: [
          { agentId: 'orchestrator', action: `Dispatched multi-agent task for ${matchedDest.name} (${days} Days)`, status: 'done' },
          { agentId: 'destination', action: `Retrieved top sights, best season (${matchedDest.bestSeason}) and food guide`, status: 'done' },
          { agentId: 'flight', action: `Transit locked: ${transitAdvice.slice(0, 45)}...`, status: 'done' },
          { agentId: 'hotel', action: `Selected top hospitality starting ₹${nightRate.toLocaleString('en-IN')}/night`, status: 'done' },
          { agentId: 'budget', action: `Estimated trip cost: ₹${totalEst.toLocaleString('en-IN')} across ${days} days`, status: 'done' },
          { agentId: 'visa', action: `Regulatory entry rule: ${matchedDest.visa}`, status: 'done' },
        ]
      };

      setChatMessages(prev => [...prev, copilotResponse]);
      speakText(`Here is your ${days} day travel plan for ${matchedDest.name}. Total estimated budget is ${totalEst.toLocaleString('en-IN')} rupees.`);
    } else {
      updateAgentStatus('orchestrator', 'thinking', `Processing request: "${prompt}"...`);
      updateAgentStatus('destination', 'searching', 'Scanning destination knowledge graph...');
      updateAgentStatus('planner', 'thinking', 'Analyzing travel inquiry and formulating advice...');
      
      await new Promise(r => setTimeout(r, 800));

      updateAgentStatus('planner', 'completed', 'Synthesized personalized travel guidance');
      updateAgentStatus('destination', 'completed', '52 destinations available for instant trip generation');

      let responseText = '';
      if (lower.includes('visa') || lower.includes('passport')) {
        responseText = `🛂 **Visa & Immigration Advisory (IATA Timatic Engine)**\n\n` +
          `• **Domestic Travel (India)**: No visa or passport required. Valid Government ID (Aadhaar / Voter ID / Driving License) is sufficient for all flights and hotel check-ins.\n` +
          `• **Visa-Free / Visa on Arrival for Indian Passports**: Thailand (60 days), Malaysia (30 days), Maldives (30 days VoA), Sri Lanka (ETA).\n` +
          `• **Fast E-Visas (2-4 Days)**: UAE / Dubai (30 Days), Vietnam, Indonesia (Bali e-VoA), Egypt, Turkey.\n` +
          `• **Consular Visas Required**: Schengen States (France, Switzerland, Italy, Greece), United Kingdom, USA (B1/B2).\n\n` +
          `Would you like me to check the exact checklist and embassy processing times for a specific country?`;
      } else if (lower.includes('budget') || lower.includes('cost') || lower.includes('calculate')) {
        responseText = `💰 **AI Budget Optimizer & Dynamic Cost Model**\n\n` +
          `To calculate an accurate budget, I factor in:\n` +
          `1. **Transit**: Outstation Cab vs Train vs Direct Flights (from Dhanbad / Ranchi / Kolkata).\n` +
          `2. **Stay Tier**: Budget homestays (₹1,500/night), 4★ Boutique hotels (₹4,200/night), or 5★ Luxury resorts (₹12,000+/night).\n` +
          `3. **Daily Food & Sightseeing**: Regional averages from ₹800/day to ₹4,500/day.\n` +
          `4. **Forex & Taxes**: 5% TCS buffer + zero-markup currency hedging.\n\n` +
          `Tell me your dream destination and duration (e.g. *'3 days in Kashmir'* or *'5 days in Bali'*), and I will build your itemized cost matrix!`;
      } else {
        responseText = `Hello Ranjeet! 🌴 I am your **TravelMate AI Copilot**, backed by a 13-agent autonomous swarm.\n\n` +
          `I have indexed **52 verified destinations** across India and the globe. I can:\n` +
          `• 🗺️ **Generate Full Itineraries**: Just say *"Plan a 3-day trip to Netarhat"* or *"5 days in Tokyo"*.\n` +
          `• ✈️ **Search Live Transit**: Direct trains, outstation cabs, and flight routes from Dhanbad, Ranchi & Kolkata.\n` +
          `• 🏨 **Shortlist Stays**: Compare verified hotels with transparent night rates.\n` +
          `• 🛂 **Verify Visa Rules**: Instant IATA passport entry checks.\n\n` +
          `Where would you like to travel next?`;
      }

      const copilotResponse: AgentChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'copilot',
        agentRole: 'planner',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages(prev => [...prev, copilotResponse]);
      speakText("I am your AI Travel Copilot. Ready to plan flights, hotels, or custom itineraries for any of our 52 destinations.");
    }
  };

  return (
    <TravelContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        theme,
        setTheme,
        toggleTheme,
        currency,
        setCurrency,
        language,
        setLanguage,
        userProfile,
        setUserProfile,
        agents,
        updateAgentStatus,
        activeTrip,
        setActiveTrip,
        chatMessages,
        addChatMessage,
        sendUserPrompt,
        isVoiceActive,
        setIsVoiceActive,
        isSpeaking,
        speakText,
        stopSpeaking,
        authModalOpen,
        setAuthModalOpen,
        bookingModalOpen,
        setBookingModalOpen,
        notificationModalOpen,
        setNotificationModalOpen,
        marketplaceModalOpen,
        setMarketplaceModalOpen,
        marketplaceTab,
        setMarketplaceTab,
        openMarketplace,
        viewMode,
        setViewMode,
        activeBooking,
        setActiveBooking,
        bookingHistory,
        addBookingToHistory,
        savedDestinations,
        toggleSaveDestination,
        notifications,
        markAllNotificationsRead,
        searchFilter,
        setSearchFilter,
      }}
    >
      {children}
    </TravelContext.Provider>
  );
};

export const useTravel = () => {
  const context = useContext(TravelContext);
  if (!context) {
    throw new Error('useTravel must be used within a TravelProvider');
  }
  return context;
};
