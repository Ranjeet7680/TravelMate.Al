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
    const isDubaiQuery = lower.includes('dubai') || lower.includes('dhanbad') || lower.includes('10 days');

    if (isDubaiQuery) {
      updateAgentStatus('orchestrator', 'thinking', 'Delegating intent to 11 agents: Dhanbad ➔ Dubai (10 Days)');
      updateAgentStatus('flight', 'searching', 'Scanning CCU/IXR to DXB flights via Amadeus API...');
      updateAgentStatus('hotel', 'searching', 'Filtering 4★ & 5★ Downtown Dubai hotels...');
      updateAgentStatus('visa', 'searching', 'Validating UAE 30-Day tourist eVisa requirements for Indian passport...');
      updateAgentStatus('budget', 'thinking', 'Modeling estimated total trip budget in INR (₹85k - ₹125k)...');

      await new Promise(r => setTimeout(r, 1000));

      updateAgentStatus('planner', 'completed', 'Synthesized 10-day comprehensive itinerary');
      updateAgentStatus('flight', 'completed', 'Found Emirates direct flight starting ₹32,500');
      updateAgentStatus('hotel', 'completed', 'Selected Rove Downtown at ₹4,500/night');
      updateAgentStatus('visa', 'completed', 'Confirmed 30-Day eVisa available (2-3 days processing)');
      updateAgentStatus('budget', 'completed', 'Estimated total: ₹97,000 (Flights + 9 nights + Activities)');

      const responseText = `Great choice! 🌴 Here's a quick plan for your 10-day Dubai trip:\n\n` +
        `✈️ **Flights**: from ₹32,500 (round trip)\n` +
        `🏨 **Hotels**: from ₹4,500/night\n` +
        `🗺️ **Itinerary**: Top sights, activities & day plan\n` +
        `💰 **Est. Budget**: ₹85,000 - ₹1,25,000\n` +
        `🛂 **Visa**: E-Visa (for Indian passport)`;

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
      speakText("Great choice! Here is a quick plan for your 10-day Dubai trip with flights from 32,500 rupees and hotels from 4,500 per night.");
      setActiveTrip(DHANBAD_DUBAI_10DAY_ITINERARY);
    } else {
      updateAgentStatus('orchestrator', 'thinking', `Processing request: "${prompt}"...`);
      updateAgentStatus('destination', 'searching', 'Scanning destination knowledge graph...');
      
      await new Promise(r => setTimeout(r, 700));

      updateAgentStatus('planner', 'completed', 'Recommendation compiled');
      updateAgentStatus('destination', 'completed', 'Attractions indexed');

      const genericResponse: AgentChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'copilot',
        agentRole: 'destination',
        text: `I've analyzed your request: "${prompt}".\n\nOur Destination and Planner agents have curated tailored travel options for you. Would you like me to generate a full day-by-day itinerary, compare live flights, or check entry visa regulations?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages(prev => [...prev, genericResponse]);
      speakText(`I have processed your request for ${prompt}. Let me know if you would like me to generate flights or a day-by-day itinerary.`);
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
