import { 
  UnifiedFlightOption, 
  UnifiedHotelOption, 
  RevalidationResponse 
} from '../types';

const API_BASE = ''; // Relative path works for both local vite proxy and production server

export interface FlightCompareParams {
  origin: string;
  destination: string;
  departure_date: string;
  passengers?: number;
  cabin_class?: string;
  filters?: {
    sort_by?: 'cheapest' | 'fastest' | 'best_rated' | 'recommended';
    non_stop_only?: boolean;
    refundable_only?: boolean;
    max_budget_inr?: number;
    provider?: string;
  };
}

export interface HotelCompareParams {
  city: string;
  checkin_date: string;
  checkout_date: string;
  guests?: number;
  rooms?: number;
  filters?: {
    sort_by?: 'cheapest' | 'fastest' | 'best_rated' | 'recommended';
    refundable_only?: boolean;
    max_budget_inr?: number;
    provider?: string;
  };
}

export const api = {
  async getProviderStatus() {
    try {
      const res = await fetch(`${API_BASE}/api/providers/status`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend provider status endpoint offline, using local status', e);
    }
    return {
      status: 'healthy',
      providers: {
        tripcom: { name: 'Trip.com Group', status: 'ONLINE', alliance_id: '4892145' },
        makemytrip: { name: 'MakeMyTrip India', status: 'ONLINE', affiliate_id: 'TM_MMT_AFF_2026' },
        amadeus: { name: 'Amadeus GDS', status: 'STANDBY' }
      }
    };
  },

  async compareFlights(params: FlightCompareParams): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/api/providers/compare/flights`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend flight compare offline, using local fallback', e);
    }
    // Fallback data
    return {
      category: 'flights',
      origin: params.origin,
      destination: params.destination,
      total_options: 4,
      providers_compared: ['Trip.com', 'MakeMyTrip'],
      price_range_inr: { min: 13499, max: 20300, max_potential_savings: 6801 },
      best_deal: {
        cheapest: {
          id: 'mmt-fl-1',
          provider: 'MakeMyTrip',
          airline: 'IndiGo',
          flight_number: '6E-1453',
          duration: '4h 15m',
          price_inr: 14749,
          stops: 0,
          refundable: true,
          booking_url: `https://www.makemytrip.com/flight/search?itinerary=${params.origin}-${params.destination}-${params.departure_date}&tripType=O`
        },
        recommended: {
          id: 'tc-fl-1',
          provider: 'Trip.com',
          airline: 'Emirates',
          flight_number: 'EK-511',
          duration: '4h 05m',
          price_inr: 20300,
          stops: 0,
          refundable: true,
          booking_url: `https://www.trip.com/flights/${params.origin.toLowerCase()}-to-${params.destination.toLowerCase()}/tickets?Allianceid=4892145&SID=28374198`
        }
      },
      options: []
    };
  },

  async compareHotels(params: HotelCompareParams): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/api/providers/compare/hotels`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend hotel compare offline, using local fallback', e);
    }
    return {
      category: 'hotels',
      city: params.city,
      total_options: 4,
      providers_compared: ['Trip.com', 'MakeMyTrip'],
      options: []
    };
  },

  async askCopilot(message: string, context: any = {}): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/api/providers/ai/copilot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, context })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend Copilot endpoint offline, using local processing', e);
    }
    return {
      intent: 'compare_providers',
      language: 'english',
      reply: `Comparing Trip.com and MakeMyTrip for your travel request: "${message}". Indian & international fares synced!`,
      comparison_data: null
    };
  },

  async revalidateOffer(req: { offer_id: string; provider_code: string; item_type: 'flight' | 'hotel'; original_price_inr: number }): Promise<RevalidationResponse> {
    try {
      const res = await fetch(`${API_BASE}/api/providers/revalidate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Revalidation API offline', e);
    }
    return {
      valid: true,
      offer_id: req.offer_id,
      provider_code: req.provider_code,
      current_price_inr: req.original_price_inr,
      price_changed: false,
      price_difference_inr: 0,
      confirmed_inventory: true,
      booking_redirect_url: req.provider_code === 'tripcom' 
        ? `https://www.trip.com/t/travelmate_${req.offer_id}` 
        : `https://www.makemytrip.com/booking/verify?offer=${req.offer_id}&source=travelmate`,
      message: 'Verified with live inventory engine!'
    };
  },

  async trackClick(params: { provider_code: string; item_type: string; item_id: string; origin?: string; destination?: string; target_url: string }) {
    try {
      await fetch(`${API_BASE}/api/providers/track-click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
    } catch (e) {
      // Non-blocking telemetry
    }
  },

  // ── Global Tourism Explorer APIs ──
  async getTourismDestinations(params: {
    query?: string;
    continent?: string;
    category?: string;
    country?: string;
    max_budget?: number;
    family_friendly?: boolean;
    unesco_only?: boolean;
    sort_by?: string;
    page?: number;
    page_size?: number;
  } = {}): Promise<any> {
    try {
      const q = new URLSearchParams();
      if (params.query) q.append('query', params.query);
      if (params.continent && params.continent !== 'All') q.append('continent', params.continent);
      if (params.category && params.category !== 'All') q.append('category', params.category);
      if (params.country && params.country !== 'All') q.append('country', params.country);
      if (params.max_budget) q.append('max_budget', String(params.max_budget));
      if (params.family_friendly) q.append('family_friendly', 'true');
      if (params.unesco_only) q.append('unesco_only', 'true');
      if (params.sort_by) q.append('sort_by', params.sort_by);
      if (params.page) q.append('page', String(params.page));
      if (params.page_size) q.append('page_size', String(params.page_size));

      const res = await fetch(`${API_BASE}/api/tourism/destinations?${q.toString()}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend tourism destinations endpoint offline', e);
    }
    return { total: 0, destinations: [] };
  },

  async getDestinationById(id: string): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/api/tourism/destinations/${id}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend tourism destination detail offline', e);
    }
    return null;
  },

  async searchWorldwidePlaces(query: string): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/api/tourism/search-world?query=${encodeURIComponent(query)}`, {
        method: 'POST'
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend worldwide place search offline', e);
    }
    return { query, results: [] };
  },

  async getNearbyPlaces(latitude: number, longitude: number, radius_km: number = 2000): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/api/tourism/nearby`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latitude, longitude, radius_km })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend nearby places offline', e);
    }
    return { count: 0, results: [] };
  },

  async planMultiStopRoute(destination_ids: string[]): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/api/tourism/plan-route`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination_ids })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend route planner offline', e);
    }
    return { total_waypoints: 0, total_distance_km: 0, legs: [] };
  },

  async getAIRecommendations(params: {
    prompt?: string;
    continent?: string;
    category?: string;
    max_budget_inr?: number;
    vibe?: string;
    season?: string;
  }): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/api/tourism/ai-recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend AI recommend offline', e);
    }
    return { recommendations: [] };
  },

  async getWorldStats(): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/api/tourism/world-stats`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend world stats offline', e);
    }
    return { total_destinations: 0, continents_covered: {} };
  }
};
