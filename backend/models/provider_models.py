from typing import List, Optional, Dict, Any, Literal
from pydantic import BaseModel, Field

class UnifiedFlightOption(BaseModel):
    id: str
    provider: Literal["Trip.com", "MakeMyTrip", "Amadeus GDS", "Direct Airline"]
    provider_code: Literal["tripcom", "makemytrip", "amadeus", "direct"]
    provider_badge: str = "Official Partner"
    airline: str
    airline_code: str
    flight_number: str
    origin_code: str
    origin_city: str
    destination_code: str
    destination_city: str
    departure_time: str
    arrival_time: str
    duration: str
    duration_minutes: int
    stops: int = 0
    stop_details: str = "Non-stop"
    cabin_class: str = "Economy"
    baggage: str = "7kg Cabin + 20kg Check-in"
    refundable: bool = True
    cancellation_policy: str = "Partially refundable up to 24h before departure"
    price_inr: float
    price_usd: float
    price_aed: float
    taxes_and_fees_inr: float = 0.0
    currency: str = "INR"
    booking_url: str
    revalidation_token: str
    availability_timestamp: str
    is_cheapest: bool = False
    is_fastest: bool = False
    is_recommended: bool = False
    recommendation_reason: Optional[str] = None

class UnifiedHotelOption(BaseModel):
    id: str
    provider: Literal["Trip.com", "MakeMyTrip", "Amadeus GDS", "Direct Hotel"]
    provider_code: Literal["tripcom", "makemytrip", "amadeus", "direct"]
    provider_badge: str = "Official Partner"
    name: str
    city: str
    location: str
    stars: int = 4
    rating: float = 4.5
    reviews_count: int = 1200
    room_type: str = "Deluxe King Room"
    price_per_night_inr: float
    total_price_inr: float
    price_usd: float
    price_aed: float
    currency: str = "INR"
    breakfast_included: bool = True
    free_cancellation: bool = True
    cancellation_deadline: Optional[str] = "Free cancellation up to 48 hours before check-in"
    amenities: List[str] = []
    image_url: str
    booking_url: str
    revalidation_token: str
    availability_timestamp: str
    is_cheapest: bool = False
    is_best_rated: bool = False
    is_recommended: bool = False
    recommendation_reason: Optional[str] = None

class ComparisonFilter(BaseModel):
    sort_by: Literal["cheapest", "fastest", "best_rated", "recommended"] = "recommended"
    non_stop_only: bool = False
    refundable_only: bool = False
    max_budget_inr: Optional[float] = None
    provider: Optional[str] = "all"

class FlightComparisonRequest(BaseModel):
    origin: str = "DEL"
    destination: str = "DXB"
    departure_date: str = "2026-11-20"
    return_date: Optional[str] = None
    passengers: int = 1
    cabin_class: str = "Economy"
    filters: Optional[ComparisonFilter] = None

class HotelComparisonRequest(BaseModel):
    city: str = "Dubai"
    checkin_date: str = "2026-11-20"
    checkout_date: str = "2026-11-25"
    guests: int = 2
    rooms: int = 1
    filters: Optional[ComparisonFilter] = None

class RevalidationRequest(BaseModel):
    offer_id: str
    provider_code: str
    item_type: Literal["flight", "hotel"]
    original_price_inr: float

class RevalidationResponse(BaseModel):
    valid: bool
    offer_id: str
    provider_code: str
    current_price_inr: float
    price_changed: bool
    price_difference_inr: float = 0.0
    confirmed_inventory: bool = True
    booking_redirect_url: str
    message: str

class AffiliateClickTrackRequest(BaseModel):
    provider_code: str
    item_type: str
    item_id: str
    origin: Optional[str] = None
    destination: Optional[str] = None
    target_url: str
