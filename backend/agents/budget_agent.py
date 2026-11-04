from typing import Dict, Any

class BudgetAgent:
    """Autonomous Budget Agent calculating dynamic travel costs, currency exchange, and savings."""

    def __init__(self):
        self.name = "Budget Agent"
        self.role = "Expense Controller"
        self.rates_to_usd = {
            "USD": 1.0,
            "INR": 87.5,
            "AED": 3.67,
            "EUR": 0.92,
            "GBP": 0.78
        }

    def calculate_budget(
        self, 
        destination: str = "Dubai", 
        duration_days: int = 10, 
        travelers: int = 2, 
        currency: str = "INR"
    ) -> Dict[str, Any]:
        flights_usd = 410 * travelers
        hotel_usd = 110 * (duration_days - 1)
        activities_usd = 320 * travelers
        food_usd = 260 * travelers
        transit_usd = 80 * travelers
        visa_usd = 90 * travelers
        buffer_usd = 100 * travelers

        total_usd = flights_usd + hotel_usd + activities_usd + food_usd + transit_usd + visa_usd + buffer_usd
        rate = self.rates_to_usd.get(currency.upper(), 1.0)
        total_in_currency = round(total_usd * rate)

        return {
            "total_usd": total_usd,
            "currency": currency,
            "total_in_currency": total_in_currency,
            "breakdown_usd": {
                "flights": flights_usd,
                "hotel": hotel_usd,
                "activities": activities_usd,
                "food": food_usd,
                "local_transport": transit_usd,
                "visa_insurance": visa_usd,
                "emergency_buffer": buffer_usd
            },
            "per_person_in_currency": round(total_in_currency / travelers),
            "savings_tips": [
                "Book direct Emirates flights 3 weeks in advance to save up to 15%.",
                "Buy a Silver Nol Card at Airport Station for unlimited affordable Metro Red Line travel.",
                "Bundle Burj Khalifa 124th floor + Aquarium combo ticket to save $25 per adult."
            ]
        }
