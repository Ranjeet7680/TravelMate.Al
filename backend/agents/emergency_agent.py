from typing import Dict, Any

class EmergencyAgent:
    """Autonomous 24/7 Safety Guardian providing SOS hotlines, consular guidance, and hospital locators."""

    def __init__(self):
        self.name = "Emergency Agent"
        self.role = "24/7 Safety Guardian"

    def get_emergency_info(self, destination: str = "Dubai", nationality: str = "India") -> Dict[str, Any]:
        return {
            "destination": "Dubai & Abu Dhabi, UAE",
            "emergency_numbers": {
                "police": "999",
                "ambulance": "998",
                "fire": "997",
                "tourist_helpline": "+971 800 4888",
            },
            "consulate": {
                "name": "Consulate General of India, Dubai",
                "address": "Al Hamriya, Diplomatic Enclave, Bur Dubai, UAE",
                "phone": "+971 4 397 1222",
                "emergency_24x7": "+971 50 734 7676",
                "email": "cons.dubai@mea.gov.in"
            },
            "recommended_hospitals": [
                {"name": "Rashid Hospital Trauma Center", "phone": "+971 4 219 2000", "area": "Umm Hurair"},
                {"name": "Aster Hospital Mankhool", "phone": "+971 4 440 0500", "area": "Bur Dubai"}
            ],
            "lost_passport_protocol": [
                "1. File an instant police report via Dubai Police App or at nearest Smart Police Station (SPS).",
                "2. Call Indian Consulate 24/7 Emergency Helpline (+971 50 734 7676).",
                "3. Apply for Emergency Certificate (EC) or Tatkaal replacement passport.",
                "4. Update GDRFA immigration status prior to airport departure."
            ]
        }
