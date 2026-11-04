from typing import Dict, Any, List, Optional
import csv
import os

class DestinationAgent:
    """Specialized Destination Discovery Agent for attractions, seasonality, culture, and travel advisories."""

    def __init__(self):
        self.name = "Destination Discovery Agent"
        self.role = "Cultural & Geographic Specialist"
        self.destinations = {}
        self.all_destinations_list = []
        self._load_datasets()

    def _load_datasets(self):
        # 1. Base curated destinations
        self.destinations = {
            "dubai": {
                "name": "Dubai",
                "country": "United Arab Emirates",
                "state": "Dubai",
                "region": "Asia",
                "type": "Luxury",
                "best_season": "November to March (Cool winter: 22°C - 28°C)",
                "currency": "AED (United Arab Emirates Dirham, ~₹22.60)",
                "timezone": "GST (UTC+4)",
                "safety_rating": 4.9,
                "daily_budget_inr": 9700,
                "attractions": [
                    {"name": "Burj Khalifa", "type": "Landmark", "recommended_time": "2-3 hrs", "ticket_price_aed": 179},
                    {"name": "The Dubai Mall & Fountain", "type": "Shopping/Entertainment", "recommended_time": "4-5 hrs", "ticket_price_aed": 0},
                    {"name": "Museum of the Future", "type": "Innovation", "recommended_time": "2 hrs", "ticket_price_aed": 149},
                    {"name": "Lahbab Red Dunes Desert Safari", "type": "Adventure", "recommended_time": "6 hrs", "ticket_price_aed": 220},
                    {"name": "Palm Jumeirah & Atlantis", "type": "Coastal Landmark", "recommended_time": "4 hrs", "ticket_price_aed": 0},
                    {"name": "Dubai Marina & JBR", "type": "Nightlife/Waterfront", "recommended_time": "3 hrs", "ticket_price_aed": 0},
                    {"name": "Old Dubai (Al Fahidi & Gold Souk)", "type": "Heritage", "recommended_time": "3 hrs", "ticket_price_aed": 2}
                ],
                "etiquette_tips": [
                    "Dress modestly in religious areas and malls",
                    "Alcohol permitted only in licensed hotels/restaurants",
                    "Metro fines apply for eating or drinking inside carriages"
                ]
            }
        }

        # 2. Load from datasets/destinations_expanded.csv if exists
        csv_path = os.path.join(os.path.dirname(__file__), "..", "..", "datasets", "destinations_expanded.csv")
        if not os.path.exists(csv_path):
            csv_path = os.path.join(os.path.dirname(__file__), "..", "datasets", "destinations_expanded.csv")

        if os.path.exists(csv_path):
            try:
                with open(csv_path, "r", encoding="utf-8") as f:
                    reader = csv.DictReader(f)
                    for row in reader:
                        city_key = row["city"].lower().strip()
                        item = {
                            "name": row["city"],
                            "city": row["city"],
                            "state": row["state"],
                            "country": row["country"],
                            "region": row["region"],
                            "type": row["type"],
                            "tag": row["tag"],
                            "daily_budget_inr": float(row["daily_budget"]),
                            "best_season": row["best_season"],
                            "distance_from_dhanbad_km": int(row["distance_dhanbad"]),
                            "rating": float(row["rating"]),
                            "reviews": int(row["reviews"]),
                            "image": row["image"],
                            "highlights": [h.strip() for h in row["highlights"].split(",") if h.strip()],
                            "cuisine": row["cuisine"],
                            "visa": row["visa"],
                        }
                        self.destinations[city_key] = item
                        self.all_destinations_list.append(item)
            except Exception as e:
                print(f"[WARN] DestinationAgent could not load CSV: {e}")

    def get_destination_info(self, city: str) -> Dict[str, Any]:
        key = city.lower().strip()
        if key in self.destinations:
            return self.destinations[key]
        for k, v in self.destinations.items():
            if key in k or k in key:
                return v
        return self.destinations.get("dubai", {})

    def search_destinations(self, region: Optional[str] = None, state: Optional[str] = None, 
                            exp_type: Optional[str] = None, max_budget: Optional[float] = None, 
                            max_distance: Optional[int] = None, query: Optional[str] = None) -> List[Dict[str, Any]]:
        results = self.all_destinations_list or list(self.destinations.values())

        if query:
            q = query.lower()
            results = [d for d in results if q in d.get("city", "").lower() or q in d.get("state", "").lower() or q in d.get("country", "").lower()]

        if region and region != "All":
            results = [d for d in results if d.get("region", "").lower() == region.lower()]

        if state and state != "All":
            results = [d for d in results if d.get("state", "").lower() == state.lower()]

        if exp_type and exp_type != "All":
            results = [d for d in results if d.get("type", "").lower() == exp_type.lower()]

        if max_budget:
            results = [d for d in results if d.get("daily_budget_inr", 0) <= max_budget]

        if max_distance:
            results = [d for d in results if d.get("distance_from_dhanbad_km", 99999) <= max_distance]

        return results
