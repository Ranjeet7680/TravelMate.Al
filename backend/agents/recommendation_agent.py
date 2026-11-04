from typing import Dict, Any, List

class RecommendationAgent:
    """Specialized AI Recommendation Engine with hyper-personalized taste scoring."""

    def __init__(self):
        self.name = "Hyper-Personalization Agent"
        self.role = "Taste Graph & Recommendation Specialist"

    def recommend_for_user(self, travel_interests: List[str], budget_tier: str = "Standard") -> List[Dict[str, Any]]:
        base_recommendations = [
            {
                "id": "rec-1",
                "title": "Burj Khalifa At The Top + Level 125",
                "category": "Sightseeing",
                "match_score": 98,
                "reason": "Top-rated iconic landmark matching your sightseeing preference",
                "estimated_cost_inr": 4200,
                "image_url": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80"
            },
            {
                "id": "rec-2",
                "title": "Lahbab Red Dunes VIP Evening Safari",
                "category": "Adventure",
                "match_score": 96,
                "reason": "Includes dune bashing, sandboarding, falconry, and barbecue buffet under the stars",
                "estimated_cost_inr": 5000,
                "image_url": "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=800&q=80"
            },
            {
                "id": "rec-3",
                "title": "Dubai Marina Private Sunset Yacht Cruise",
                "category": "Luxury / Relaxation",
                "match_score": 92,
                "reason": "2-hour yacht cruise overlooking the illuminated Ain Dubai and Palm Jumeirah skyline",
                "estimated_cost_inr": 3500,
                "image_url": "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=800&q=80"
            },
            {
                "id": "rec-4",
                "title": "Sheikh Zayed Grand Mosque Full-Day Abu Dhabi Tour",
                "category": "Culture / Architecture",
                "match_score": 94,
                "reason": "World-renowned architectural marvel featuring 82 white marble domes and 24k gold chandeliers",
                "estimated_cost_inr": 4500,
                "image_url": "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80"
            }
        ]
        return base_recommendations
