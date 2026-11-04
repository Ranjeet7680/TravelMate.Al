export type ScreenType = 
  | '01-welcome'
  | '02-onboarding'
  | '03-landing'
  | '04-login'
  | '05-dashboard'
  | '06-copilot'
  | '07-planner'
  | '08-flights'
  | '09-hotels'
  | '10-destinations'
  | '11-itinerary'
  | '12-budget'
  | '13-visa'
  | '14-payment'
  | '15-wallet'
  | '16-voice'
  | '17-profile'
  | '18-admin';

export type AgentRole = 
  | 'orchestrator'
  | 'planner'
  | 'flight'
  | 'hotel'
  | 'destination'
  | 'budget'
  | 'visa'
  | 'booking'
  | 'voice'
  | 'emergency'
  | 'recommendation';

export interface AgentInfo {
  id: AgentRole;
  name: string;
  title: string;
  icon: string;
  color: string;
  description: string;
  status: 'idle' | 'thinking' | 'searching' | 'completed' | 'error';
  lastActivity?: string;
}

export type Currency = 'INR' | 'USD' | 'EUR' | 'AED' | 'GBP';

export interface CurrencyConfig {
  code: Currency;
  symbol: string;
  rateAgainstINR: number; // 1 INR = rate
}

export type LanguageCode = 'en' | 'hi' | 'bn' | 'ta' | 'te' | 'mr' | 'es' | 'fr' | 'ar';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  native: string;
  flag: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  nationality: string;
  passportCountry: string;
  travelStyle: 'luxury' | 'comfort' | 'budget' | 'backpacker' | 'adventure' | 'family' | 'solo';
  budgetPreference: 'budget' | 'standard' | 'premium' | 'luxury';
  dietaryPreference: 'any' | 'vegetarian' | 'vegan' | 'halal' | 'jain' | 'kosher';
  loyaltyPrograms: {
    airline?: string;
    hotel?: string;
  };
  preferredCurrency: Currency;
  language: LanguageCode;
  interests: string[];
  departureCity: string;
}

export interface FlightOption {
  id: string;
  airline: string;
  airlineCode: string;
  flightNumber: string;
  origin: {
    city: string;
    airport: string;
    code: string;
    terminal?: string;
  };
  destination: {
    city: string;
    airport: string;
    code: string;
    terminal?: string;
  };
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  stopCity?: string;
  priceINR: number;
  cabinClass: 'Economy' | 'Premium Economy' | 'Business' | 'First';
  baggage: string;
  refundable: boolean;
  carbonEmissionsKg?: number;
}

export interface HotelOption {
  id: string;
  name: string;
  city: string;
  location: string;
  rating: number; // 1 - 5
  reviewCount: number;
  stars: number;
  pricePerNightINR: number;
  imageUrl: string;
  amenities: string[];
  distanceToCenter: string;
  freeCancellation: boolean;
  breakfastIncluded: boolean;
  roomType: string;
}

export interface ItineraryActivity {
  id: string;
  time: string;
  period: 'Morning' | 'Afternoon' | 'Evening';
  title: string;
  description: string;
  location: string;
  coordinates?: [number, number];
  estimatedCostINR: number;
  category: 'sightseeing' | 'food' | 'transport' | 'adventure' | 'culture' | 'leisure';
  durationHours: number;
  tips?: string;
  transportAdvice?: string;
  completed?: boolean;
}

export interface ItineraryDay {
  dayNumber: number;
  dateStr: string;
  theme: string;
  summary: string;
  city: string;
  activities: ItineraryActivity[];
  dayBudgetINR: number;
  heroImage?: string;
  weatherForecast?: {
    tempC: number;
    condition: string;
    icon: string;
  };
}

export interface FullTripItinerary {
  id: string;
  title: string;
  origin: string;
  destination: string;
  durationDays: number;
  startDate: string;
  endDate: string;
  status: 'planning' | 'booked' | 'completed';
  travelersCount: number;
  days: ItineraryDay[];
  selectedFlight?: FlightOption;
  selectedHotel?: HotelOption;
  budgetBreakdown: {
    flightsINR: number;
    hotelINR: number;
    activitiesINR: number;
    foodINR: number;
    localTransportINR: number;
    visaInsuranceINR: number;
    emergencyBufferINR: number;
    totalINR: number;
  };
  visaRequirements: {
    required: boolean;
    type: string;
    processingDays: string;
    costINR: number;
    documents: string[];
    validity: string;
    notes: string;
  };
  localTransportAdvice: string[];
  emergencyContacts: {
    police: string;
    ambulance: string;
    fire: string;
    touristHelpline: string;
    consulatePhone: string;
    consulateAddress: string;
    hospitalName: string;
  };
}

export interface AgentChatMessage {
  id: string;
  sender: 'user' | 'copilot' | 'agent';
  agentRole?: AgentRole;
  text: string;
  timestamp: string;
  cards?: {
    type: 'flight_list' | 'hotel_list' | 'itinerary_preview' | 'budget_summary' | 'visa_info' | 'emergency_card';
    data: any;
  }[];
  agentThoughtTrace?: {
    agentId: AgentRole;
    action: string;
    status: 'in_progress' | 'done';
    details?: string;
  }[];
}

export interface BookingConfirmation {
  bookingId: string;
  pnr: string;
  passengerName: string;
  tripTitle: string;
  origin: string;
  destination: string;
  dates: string;
  flightDetails: FlightOption;
  hotelDetails: HotelOption;
  totalPaidINR: number;
  currency: Currency;
  bookingDate: string;
  paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'International';
  status: 'Confirmed' | 'Pending' | 'Completed';
  packageDetails?: HolidayPackage;
  mobilityDetails?: MobilityOption;
  tourDetails?: SightseeingTour;
}

export interface DestinationItem {
  id: string;
  name: string;
  city: string;
  state: string;
  country: string;
  region: 'India' | 'Asia' | 'Europe' | 'Americas' | 'Africa' | 'Oceania';
  type: 'Adventure' | 'Beach' | 'Culture' | 'Nature' | 'Religious' | 'City' | 'Hill Station' | 'Luxury';
  tag: string;
  dailyBudgetINR: number;
  bestSeason: string;
  distanceDhanbadKm: number;
  rating: number;
  reviews: number;
  image: string;
  highlights: string[];
  cuisine: string;
  visa: string;
}

export interface HolidayPackage {
  id: string;
  title: string;
  category: 'Domestic' | 'International' | 'Weekend' | 'Honeymoon' | 'Family' | 'Adventure' | 'Luxury';
  type: string;
  durationDays: number;
  durationNights: number;
  departureCity: string;
  destinations: string;
  priceINR: number;
  originalPriceINR: number;
  rating: number;
  reviews: number;
  image: string;
  inclusions: string;
  badge?: string;
}

export interface MobilityOption {
  id: string;
  category: 'Cab' | 'Self-Drive Car' | 'Bike Rental';
  service: string;
  name: string;
  capacity: string;
  baseFareINR: number;
  ratePerKmINR: number;
  hourlyRateINR: number;
  image: string;
  features: string;
  rating: number;
}

export interface SightseeingTour {
  id: string;
  title: string;
  city: string;
  duration: string;
  priceINR: number;
  rating: number;
  reviews: number;
  image: string;
  highlights: string;
}
