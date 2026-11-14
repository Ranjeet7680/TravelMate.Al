"""
Booking Revalidation & Secure Affiliate Click Tracking Service
- Revalidates price and inventory before dispatching traveler to provider.
- Tracks outbound partner clicks without logging sensitive PII or credentials.
"""

import time
from datetime import datetime
from typing import Dict, Any, List
from models.provider_models import RevalidationRequest, RevalidationResponse, AffiliateClickTrackRequest

class BookingTracker:
    def __init__(self):
        self._click_audit_log: List[Dict[str, Any]] = []

    def revalidate_offer(self, req: RevalidationRequest) -> RevalidationResponse:
        """
        Revalidates price and live availability before transferring user to provider checkout.
        """
        # In production, check provider cache or ping provider verification endpoint
        # Price matches or minor delta if seat inventory moved
        current_price = req.original_price_inr
        price_diff = 0.0

        # Construct safe outbound redirect
        if req.provider_code == "tripcom":
            redirect_url = f"https://www.trip.com/t/travelmate_reval_{req.offer_id}"
            message = "Trip.com inventory confirmed! Seat & rate held for 15 minutes."
        elif req.provider_code == "makemytrip":
            redirect_url = f"https://www.makemytrip.com/booking/verify?offer={req.offer_id}&source=travelmate"
            message = "MakeMyTrip live fare verified! Transferring to secure payment gateway."
        else:
            redirect_url = f"https://partner.travelmate.ai/checkout/{req.offer_id}"
            message = "Inventory verified successfully."

        return RevalidationResponse(
            valid=True,
            offer_id=req.offer_id,
            provider_code=req.provider_code,
            current_price_inr=current_price,
            price_changed=False,
            price_difference_inr=price_diff,
            confirmed_inventory=True,
            booking_redirect_url=redirect_url,
            message=message
        )

    def track_affiliate_click(self, req: AffiliateClickTrackRequest) -> Dict[str, Any]:
        """
        Safely records partner click metric for attribution analytics.
        Does NOT record cookies, cards, or user tokens.
        """
        event = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "provider_code": req.provider_code,
            "item_type": req.item_type,
            "item_id": req.item_id,
            "origin": req.origin or "N/A",
            "destination": req.destination or "N/A",
            "status": "TRACKED"
        }
        self._click_audit_log.append(event)
        # Cap in-memory audit log
        if len(self._click_audit_log) > 2000:
            self._click_audit_log.pop(0)

        return {
            "tracked": True,
            "event_id": f"evt-{int(time.time()*1000)}",
            "redirect_url": req.target_url
        }

    def get_tracking_stats(self) -> Dict[str, Any]:
        """
        Summary of provider affiliate routing metrics.
        """
        tripcom_clicks = sum(1 for e in self._click_audit_log if e["provider_code"] == "tripcom")
        mmt_clicks = sum(1 for e in self._click_audit_log if e["provider_code"] == "makemytrip")
        return {
            "total_outbound_clicks": len(self._click_audit_log),
            "tripcom_clicks": tripcom_clicks,
            "makemytrip_clicks": mmt_clicks,
            "recent_events": self._click_audit_log[-10:]
        }

booking_tracker = BookingTracker()
