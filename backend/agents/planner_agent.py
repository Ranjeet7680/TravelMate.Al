from typing import Dict, Any, List

class PlannerAgent:
    """Autonomous Travel Planner Agent synthesizing day-by-day itineraries."""

    def __init__(self):
        self.name = "Travel Planner Agent"
        self.role = "Itinerary Architect"

    def generate_dubai_10day_itinerary(self) -> Dict[str, Any]:
        return {
            "title": "Dhanbad to Dubai 10-Day Grand Experience",
            "duration_days": 10,
            "origin": "Dhanbad, Jharkhand (via CCU Kolkata / IXR Ranchi)",
            "destination": "Dubai & Abu Dhabi, UAE",
            "highlights": [
                "Burj Khalifa & Dubai Fountain",
                "Museum of the Future",
                "Old Dubai Creek, Spice & Gold Souks",
                "Red Dunes Desert Safari & Bedouin Camp",
                "The Palm Jumeirah & Aquaventure",
                "Full-Day Abu Dhabi Grand Mosque & Louvre",
                "Miracle Garden & Global Village",
                "JBR Beach & Dubai Marina Sunset Yacht"
            ]
        }
