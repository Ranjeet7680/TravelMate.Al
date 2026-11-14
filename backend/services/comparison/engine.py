"""
Unified Booking Comparison Engine
Provides comprehensive side-by-side analysis, savings metrics, and comparison summary
across Trip.com, MakeMyTrip, and partner providers.
"""

from typing import Dict, Any, List
from models.provider_models import (
    FlightComparisonRequest,
    HotelComparisonRequest,
    UnifiedFlightOption,
    UnifiedHotelOption
)
from services.flights.aggregator import flight_aggregator
from services.hotels.aggregator import hotel_aggregator

class ComparisonEngine:
    def compare_flights(self, req: FlightComparisonRequest) -> Dict[str, Any]:
        options = flight_aggregator.aggregate_flights(
            origin=req.origin,
            destination=req.destination,
            departure_date=req.departure_date,
            passengers=req.passengers,
            cabin_class=req.cabin_class,
            filters=req.filters
        )
        
        if not options:
            return {
                "category": "flights",
                "origin": req.origin,
                "destination": req.destination,
                "count": 0,
                "summary": "No flight options found matching criteria.",
                "options": []
            }

        tc_options = [o for o in options if o.provider_code == "tripcom"]
        mmt_options = [o for o in options if o.provider_code == "makemytrip"]

        cheapest_overall = min(options, key=lambda x: x.price_inr)
        fastest_overall = min(options, key=lambda x: x.duration_minutes)
        recommended = next((o for o in options if o.is_recommended), cheapest_overall)

        # Calculate potential savings
        highest_price = max(o.price_inr for o in options)
        max_savings = highest_price - cheapest_overall.price_inr

        return {
            "category": "flights",
            "origin": req.origin,
            "destination": req.destination,
            "departure_date": req.departure_date,
            "passengers": req.passengers,
            "cabin_class": req.cabin_class,
            "total_options": len(options),
            "providers_compared": list(set(o.provider for o in options)),
            "price_range_inr": {
                "min": cheapest_overall.price_inr,
                "max": highest_price,
                "max_potential_savings": max_savings
            },
            "best_deal": {
                "cheapest": cheapest_overall.model_dump(),
                "fastest": fastest_overall.model_dump(),
                "recommended": recommended.model_dump()
            },
            "provider_breakdown": {
                "tripcom_count": len(tc_options),
                "tripcom_min_price": min((o.price_inr for o in tc_options), default=0),
                "makemytrip_count": len(mmt_options),
                "makemytrip_min_price": min((o.price_inr for o in mmt_options), default=0),
            },
            "options": [o.model_dump() for o in options]
        }

    def compare_hotels(self, req: HotelComparisonRequest) -> Dict[str, Any]:
        options = hotel_aggregator.aggregate_hotels(
            city=req.city,
            checkin_date=req.checkin_date,
            checkout_date=req.checkout_date,
            guests=req.guests,
            rooms=req.rooms,
            filters=req.filters
        )

        if not options:
            return {
                "category": "hotels",
                "city": req.city,
                "count": 0,
                "summary": "No hotel options found matching criteria.",
                "options": []
            }

        tc_options = [o for o in options if o.provider_code == "tripcom"]
        mmt_options = [o for o in options if o.provider_code == "makemytrip"]

        cheapest_overall = min(options, key=lambda x: x.price_per_night_inr)
        best_rated = max(options, key=lambda x: x.rating)
        recommended = next((o for o in options if o.is_recommended), cheapest_overall)

        return {
            "category": "hotels",
            "city": req.city,
            "checkin_date": req.checkin_date,
            "checkout_date": req.checkout_date,
            "guests": req.guests,
            "rooms": req.rooms,
            "total_options": len(options),
            "providers_compared": list(set(o.provider for o in options)),
            "price_range_per_night_inr": {
                "min": cheapest_overall.price_per_night_inr,
                "max": max(o.price_per_night_inr for o in options)
            },
            "best_deal": {
                "cheapest": cheapest_overall.model_dump(),
                "best_rated": best_rated.model_dump(),
                "recommended": recommended.model_dump()
            },
            "provider_breakdown": {
                "tripcom_count": len(tc_options),
                "makemytrip_count": len(mmt_options)
            },
            "options": [o.model_dump() for o in options]
        }

comparison_engine = ComparisonEngine()
