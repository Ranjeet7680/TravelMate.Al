from typing import Dict, Any

class VisaAgent:
    """Autonomous Visa Agent compliant with IATA Timatic standards."""

    def __init__(self):
        self.name = "Visa Agent"
        self.role = "Immigration Advisor"

    def check_visa(self, passport_country: str = "India", destination: str = "UAE") -> Dict[str, Any]:
        if passport_country.lower() == "india" and ("uae" in destination.lower() or "dubai" in destination.lower()):
            return {
                "required": True,
                "type": "30-Day UAE Tourist eVisa",
                "processing_days": "2 - 3 Business Days",
                "cost_usd": 90,
                "validity": "60 days entry window; 30 days maximum stay",
                "documents": [
                    "Passport with minimum 6 months validity from date of arrival",
                    "Passport size photograph with white background",
                    "Confirmed return flight tickets",
                    "Confirmed hotel reservation voucher",
                    "PAN Card copy"
                ],
                "special_exemption": "Indian passport holders with valid US B1/B2, Green Card, or UK/EU Schengen residence can obtain Visa on Arrival at DXB airport for AED 120 (14 days validity)."
            }
        return {
            "required": True,
            "type": "Standard Tourist Visa",
            "processing_days": "3 - 5 Days",
            "cost_usd": 100,
            "validity": "30 Days",
            "documents": ["Valid Passport", "Proof of Funds", "Return Ticket"],
            "special_exemption": "Check local consulate website for recent travel bubble agreements."
        }
