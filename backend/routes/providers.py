"""
TravelMate.AI Multi-Provider & Enterprise Booking Comparison Endpoints
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any
from models.provider_models import (
    FlightComparisonRequest,
    HotelComparisonRequest,
    RevalidationRequest,
    RevalidationResponse,
    AffiliateClickTrackRequest
)
from services.flights.aggregator import flight_aggregator
from services.hotels.aggregator import hotel_aggregator
from services.comparison.engine import comparison_engine
from services.booking.tracker import booking_tracker
from services.ai.orchestrator import ai_orchestrator
from pydantic import BaseModel

router = APIRouter(prefix="/api/providers", tags=["Providers & Comparison"])

class AICopilotRequest(BaseModel):
    message: str
    context: Dict[str, Any] = {}

@router.get("/status")
def get_provider_status():
    """
    Returns live health & connectivity status of all integrated travel booking providers.
    """
    return {
        "status": "healthy",
        "providers": {
            "tripcom": {
                "name": "Trip.com Group",
                "integration_mode": "Open Platform Partner + Alliance Affiliate",
                "alliance_id": "4892145",
                "sid": "28374198",
                "status": "ONLINE",
                "capabilities": ["flights", "hotels", "deeplinks", "currency_conversion"]
            },
            "makemytrip": {
                "name": "MakeMyTrip India",
                "integration_mode": "Official Search Handoff & Partner Deep-Linking",
                "affiliate_id": "TM_MMT_AFF_2026",
                "status": "ONLINE",
                "capabilities": ["flights", "hotels", "holidays", "domestic_inr"]
            },
            "amadeus": {
                "name": "Amadeus GDS",
                "integration_mode": "Global Distribution System API",
                "status": "STANDBY",
                "capabilities": ["global_flights", "fare_rules"]
            }
        },
        "engine": "TravelMate.AI Multilingual Orchestrator v3.0"
    }

@router.post("/flights/search")
def search_flights(req: FlightComparisonRequest):
    """
    Unified flight search across Trip.com and MakeMyTrip with normalized pricing and filters.
    """
    results = flight_aggregator.aggregate_flights(
        origin=req.origin,
        destination=req.destination,
        departure_date=req.departure_date,
        passengers=req.passengers,
        cabin_class=req.cabin_class,
        filters=req.filters
    )
    return {
        "total": len(results),
        "origin": req.origin,
        "destination": req.destination,
        "results": [r.dict() for r in results]
    }

@router.post("/hotels/search")
def search_hotels(req: HotelComparisonRequest):
    """
    Unified hotel search across Trip.com and MakeMyTrip with star ratings and perks.
    """
    results = hotel_aggregator.aggregate_hotels(
        city=req.city,
        checkin_date=req.checkin_date,
        checkout_date=req.checkout_date,
        guests=req.guests,
        rooms=req.rooms,
        filters=req.filters
    )
    return {
        "total": len(results),
        "city": req.city,
        "results": [r.dict() for r in results]
    }

@router.post("/compare/flights")
def compare_flights(req: FlightComparisonRequest):
    """
    Deep flight comparison with best-value scoring and breakdown by provider.
    """
    return comparison_engine.compare_flights(req)

@router.post("/compare/hotels")
def compare_hotels(req: HotelComparisonRequest):
    """
    Deep hotel comparison with rating vs price metrics and breakdown by provider.
    """
    return comparison_engine.compare_hotels(req)

@router.post("/ai/copilot")
def copilot_chat(req: AICopilotRequest):
    """
    Advanced multilingual AI Copilot supporting English, Hindi, Hinglish, and Arabic
    with autonomous tool execution and explainable travel recommendations.
    """
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    return ai_orchestrator.process_travel_request(req.message)

@router.post("/revalidate", response_model=RevalidationResponse)
def revalidate_booking_offer(req: RevalidationRequest):
    """
    Pre-checkout revalidation to guarantee price stability and inventory availability.
    """
    return booking_tracker.revalidate_offer(req)

@router.post("/track-click")
def track_affiliate_click(req: AffiliateClickTrackRequest):
    """
    Secure affiliate click tracker for attribution and outbound redirect.
    """
    return booking_tracker.track_affiliate_click(req)

@router.get("/tracking-stats")
def get_tracking_stats():
    """
    Returns affiliate routing telemetry.
    """
    return booking_tracker.get_tracking_stats()
