from typing import List, Dict, Any

class HotelAgent:
    """Autonomous Hotel Agent responsible for finding verified accommodations."""

    def __init__(self):
        self.name = "Hotel Agent"
        self.role = "Hospitality Scout"

    def search_hotels(self, city: str = "Dubai") -> List[Dict[str, Any]]:
        return [
            {
                "id": "ht-address-downtown",
                "name": "Address Downtown Dubai",
                "city": "Dubai",
                "location": "Downtown Dubai (Direct Burj Khalifa View)",
                "rating": 4.9,
                "stars": 5,
                "pricePerNightUSD": 290,
                "amenities": ["Infinity Pool", "Luxury Spa", "Complimentary Breakfast", "Butler Service"],
                "distanceToCenter": "0.2 km from Dubai Mall",
                "freeCancellation": True,
            },
            {
                "id": "ht-rove-downtown",
                "name": "Rove Downtown Hotel",
                "city": "Dubai",
                "location": "Zabeel 2, Downtown Dubai",
                "rating": 4.8,
                "stars": 4,
                "pricePerNightUSD": 110,
                "amenities": ["Outdoor Pool", "24/7 Gym", "Metro Shuttle"],
                "distanceToCenter": "0.8 km from Burj Khalifa",
                "freeCancellation": True,
            },
            {
                "id": "ht-atlantis-palm",
                "name": "Atlantis The Palm, Dubai",
                "city": "Dubai",
                "location": "Crescent Road, The Palm Jumeirah",
                "rating": 4.9,
                "stars": 5,
                "pricePerNightUSD": 450,
                "amenities": ["Aquaventure Waterpark", "The Lost Chambers", "Private Beach"],
                "distanceToCenter": "Palm Jumeirah Boardwalk",
                "freeCancellation": True,
            }
        ]
