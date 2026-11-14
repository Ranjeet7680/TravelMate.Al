"""
Unified Multi-Provider Hotel Aggregator Service
Combines Trip.com and MakeMyTrip hotel inventories into normalized UnifiedHotelOption schema.
Resilient: survives single-provider downtime.
"""

from typing import List, Optional
from models.provider_models import UnifiedHotelOption, ComparisonFilter
from services.providers.tripcom.client import tripcom_client
from services.providers.makemytrip.client import makemytrip_client

class HotelAggregator:
    def __init__(self):
        self.tripcom = tripcom_client
        self.mmt = makemytrip_client

    def aggregate_hotels(
        self,
        city: str,
        checkin_date: str,
        checkout_date: str,
        guests: int = 2,
        rooms: int = 1,
        filters: Optional[ComparisonFilter] = None
    ) -> List[UnifiedHotelOption]:
        """
        Gathers hotel options across providers, applies unified pricing & criteria,
        and scores recommendations.
        """
        combined: List[UnifiedHotelOption] = []

        # Query Trip.com
        try:
            tc_results = self.tripcom.search_hotels(city, checkin_date, checkout_date, guests, rooms)
            combined.extend(tc_results)
        except Exception as e:
            print(f"[Warning] Trip.com hotel search failed: {e}")

        # Query MakeMyTrip
        try:
            mmt_results = self.mmt.search_hotels(city, checkin_date, checkout_date, guests, rooms)
            combined.extend(mmt_results)
        except Exception as e:
            print(f"[Warning] MakeMyTrip hotel search failed: {e}")

        if not combined:
            return []

        # Apply basic filters
        if filters:
            if filters.refundable_only:
                combined = [h for h in combined if h.free_cancellation]
            if filters.max_budget_inr:
                combined = [h for h in combined if h.price_per_night_inr <= filters.max_budget_inr]
            if filters.provider and filters.provider.lower() != "all":
                combined = [h for h in combined if h.provider_code.lower() == filters.provider.lower()]

        if not combined:
            return []

        cheapest_night = min(h.price_per_night_inr for h in combined)
        best_rating = max(h.rating for h in combined)

        for h in combined:
            if h.price_per_night_inr == cheapest_night:
                h.is_cheapest = True
            if h.rating == best_rating:
                h.is_best_rated = True

        # Determine overall best recommendation:
        # Score = Rating / (Price factor)
        best_score = -1.0
        best_option = None

        for h in combined:
            price_norm = h.price_per_night_inr / cheapest_night
            # Bonus for breakfast included & free cancel
            extra_multiplier = (1.15 if h.breakfast_included else 1.0) * (1.10 if h.free_cancellation else 1.0)
            score = (h.rating / (price_norm ** 0.4)) * extra_multiplier
            if score > best_score:
                best_score = score
                best_option = h

        if best_option:
            best_option.is_recommended = True
            perks = []
            if best_option.breakfast_included:
                perks.append("breakfast included")
            if best_option.free_cancellation:
                perks.append("free cancellation")
            perk_str = f" with {', '.join(perks)}" if perks else ""
            best_option.recommendation_reason = (
                f"Top guest favorite: {best_option.rating}★ rating ({best_option.reviews_count:,} reviews) at ₹{best_option.price_per_night_inr:,.0f}/night{perk_str}."
            )

        # Apply sorting
        sort_by = filters.sort_by if filters else "recommended"
        if sort_by == "cheapest":
            combined.sort(key=lambda x: x.price_per_night_inr)
        elif sort_by == "best_rated":
            combined.sort(key=lambda x: (-x.rating, x.price_per_night_inr))
        elif sort_by == "recommended":
            combined.sort(key=lambda x: (not x.is_recommended, -x.rating, x.price_per_night_inr))

        return combined

hotel_aggregator = HotelAggregator()
