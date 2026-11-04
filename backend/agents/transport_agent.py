from typing import Dict, Any, List

class TransportAgent:
    """Specialized Local Transportation Agent for metro, taxis, intercity transit, and transfers."""

    def __init__(self):
        self.name = "Local Transport Agent"
        self.role = "Ground Transit & Mobility Specialist"

    def get_transport_plan(self, city: str = "Dubai") -> Dict[str, Any]:
        return {
            "city": city,
            "recommended_modes": [
                {
                    "mode": "Dubai Metro (Red & Green Lines)",
                    "type": "Public Rapid Transit",
                    "card": "Silver Nol Card (AED 25 preloaded)",
                    "cost_per_ride_aed": "AED 3 - 7.50 depending on zones",
                    "best_for": "DXB Airport to Downtown, Burj Khalifa, Mall of the Emirates, Dubai Marina"
                },
                {
                    "mode": "RTA Taxis / Careem App",
                    "type": "On-demand Cab",
                    "flag_drop_aed": "AED 12 (street) / AED 25 (airport)",
                    "per_km_aed": "AED 2.19/km",
                    "best_for": "Late night, desert trips, door-to-door group transit"
                },
                {
                    "mode": "Dubai Abra (Traditional Wooden Boat)",
                    "type": "Ferry",
                    "cost_per_ride_aed": "AED 1.00 cash",
                    "best_for": "Crossing Dubai Creek between Bur Dubai and Deira Gold Souk"
                },
                {
                    "mode": "Intercity Bus E100/E101",
                    "type": "Coach to Abu Dhabi",
                    "cost_per_ride_aed": "AED 25 via Nol Card",
                    "frequency": "Every 15-20 minutes from Al Ghubaiba or Ibn Battuta Station"
                }
            ],
            "total_estimated_budget_inr": 6000
        }
