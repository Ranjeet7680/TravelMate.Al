from typing import List, Dict, Any

class FlightAgent:
    """Autonomous Flight Agent responsible for flight queries, pricing, and baggage policies."""
    
    def __init__(self):
        self.name = "Flight Agent"
        self.role = "Airfare Strategist"

    def search_flights(self, origin: str, destination: str, duration_days: int = 10) -> List[Dict[str, Any]]:
        # Heuristic routing for Dhanbad / Eastern India to Dubai
        return [
            {
                "id": "fl-ek-571",
                "airline": "Emirates",
                "airlineCode": "EK",
                "flightNumber": "EK 571",
                "origin": {"city": "Dhanbad via CCU Kolkata", "code": "CCU", "terminal": "T2"},
                "destination": {"city": "Dubai", "code": "DXB", "terminal": "T3"},
                "departureTime": "08:45 AM",
                "arrivalTime": "12:20 PM",
                "duration": "5h 05m (Direct)",
                "stops": 0,
                "priceUSD": 410,
                "cabinClass": "Economy",
                "baggage": "30 kg Check-in + 7 kg Cabin",
                "refundable": True,
            },
            {
                "id": "fl-6e-024",
                "airline": "IndiGo Airlines",
                "airlineCode": "6E",
                "flightNumber": "6E 1305",
                "origin": {"city": "Dhanbad via IXR Ranchi", "code": "IXR", "terminal": "T1"},
                "destination": {"city": "Dubai", "code": "DXB", "terminal": "T1"},
                "departureTime": "11:15 AM",
                "arrivalTime": "06:40 PM",
                "duration": "7h 55m (1 stop DEL)",
                "stops": 1,
                "stopCity": "Delhi (DEL)",
                "priceUSD": 295,
                "cabinClass": "Economy",
                "baggage": "30 kg Check-in + 7 kg Cabin",
                "refundable": True,
            },
            {
                "id": "fl-fz-448",
                "airline": "flydubai",
                "airlineCode": "FZ",
                "flightNumber": "FZ 448",
                "origin": {"city": "Dhanbad via CCU Kolkata", "code": "CCU", "terminal": "T2"},
                "destination": {"city": "Dubai", "code": "DXB", "terminal": "T2"},
                "departureTime": "02:30 AM",
                "arrivalTime": "06:15 AM",
                "duration": "5h 15m (Direct Red-Eye)",
                "stops": 0,
                "priceUSD": 330,
                "cabinClass": "Economy",
                "baggage": "25 kg Check-in + 7 kg Cabin",
                "refundable": False,
            }
        ]
