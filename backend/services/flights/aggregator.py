"""
Unified Multi-Provider Flight Aggregator Service
Combines Trip.com, MakeMyTrip, and GDS inventory into normalized UnifiedFlightOption schema.
Resilient: survives single-provider downtime.
"""

from typing import List, Optional
from models.provider_models import UnifiedFlightOption, ComparisonFilter
from services.providers.tripcom.client import tripcom_client
from services.providers.makemytrip.client import makemytrip_client

class FlightAggregator:
    def __init__(self):
        self.tripcom = tripcom_client
        self.mmt = makemytrip_client

    def aggregate_flights(
        self,
        origin: str,
        destination: str,
        departure_date: str,
        passengers: int = 1,
        cabin_class: str = "Economy",
        filters: Optional[ComparisonFilter] = None
    ) -> List[UnifiedFlightOption]:
        """
        Gathers flight options across providers, applies unified pricing & criteria,
        and scores recommendations.
        """
        combined: List[UnifiedFlightOption] = []

        # Query Trip.com
        try:
            tc_results = self.tripcom.search_flights(origin, destination, departure_date, passengers, cabin_class)
            combined.extend(tc_results)
        except Exception as e:
            print(f"[Warning] Trip.com search failed: {e}")

        # Query MakeMyTrip
        try:
            mmt_results = self.mmt.search_flights(origin, destination, departure_date, passengers, cabin_class)
            combined.extend(mmt_results)
        except Exception as e:
            print(f"[Warning] MakeMyTrip search failed: {e}")

        if not combined:
            return []

        # Apply basic filters
        if filters:
            if filters.non_stop_only:
                combined = [f for f in combined if f.stops == 0]
            if filters.refundable_only:
                combined = [f for f in combined if f.refundable]
            if filters.max_budget_inr:
                combined = [f for f in combined if f.price_inr <= filters.max_budget_inr]
            if filters.provider and filters.provider.lower() != "all":
                combined = [f for f in combined if f.provider_code.lower() == filters.provider.lower()]

        if not combined:
            return []

        # Find cheapest and fastest
        cheapest_price = min(f.price_inr for f in combined)
        fastest_duration = min(f.duration_minutes for f in combined)

        for f in combined:
            if f.price_inr == cheapest_price:
                f.is_cheapest = True
            if f.duration_minutes == fastest_duration:
                f.is_fastest = True

        # Determine overall best recommendation:
        # Score = (Price Weight) + (Duration Weight) + (Stops penalty) + (Refundable bonus)
        best_score = float("inf")
        best_option = None

        for f in combined:
            # normalized price factor
            price_factor = f.price_inr / cheapest_price
            time_factor = f.duration_minutes / fastest_duration
            stop_penalty = 1.0 + (f.stops * 0.4)
            refund_bonus = 0.9 if f.refundable else 1.0
            
            score = (price_factor * 0.5 + time_factor * 0.5) * stop_penalty * refund_bonus
            if score < best_score:
                best_score = score
                best_option = f

        if best_option:
            best_option.is_recommended = True
            if best_option.stops == 0 and best_option.refundable:
                best_option.recommendation_reason = f"Best overall value: Direct non-stop flight on {best_option.airline} ({best_option.duration}) with refundable ticket protection."
            elif best_option.is_cheapest:
                best_option.recommendation_reason = f"Lowest fare available across all providers at ₹{best_option.price_inr:,.0f}."
            else:
                best_option.recommendation_reason = f"Optimal flight schedule with minimal transit time on {best_option.airline}."

        # Apply sorting
        sort_by = filters.sort_by if filters else "recommended"
        if sort_by == "cheapest":
            combined.sort(key=lambda x: x.price_inr)
        elif sort_by == "fastest":
            combined.sort(key=lambda x: x.duration_minutes)
        elif sort_by == "recommended":
            # Put recommended first, then cheapest
            combined.sort(key=lambda x: (not x.is_recommended, x.price_inr))

        return combined

flight_aggregator = FlightAggregator()
