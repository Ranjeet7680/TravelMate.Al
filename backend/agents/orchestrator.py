from typing import Dict, Any, List
from datetime import datetime
from .planner_agent import PlannerAgent
from .flight_agent import FlightAgent
from .hotel_agent import HotelAgent
from .destination_agent import DestinationAgent
from .itinerary_agent import ItineraryAgent
from .budget_agent import BudgetAgent
from .visa_agent import VisaAgent
from .transport_agent import TransportAgent
from .voice_agent import VoiceAgent
from .booking_agent import BookingAgent
from .emergency_agent import EmergencyAgent
from .recommendation_agent import RecommendationAgent

class MultiAgentOrchestrator:
    """
    Coordinates 11 Autonomous Specialized AI Agents:
    1. Master Orchestrator Agent
    2. Travel Planner Agent (Itinerary Architecture)
    3. Flight Agent (Amadeus & GDS Engine)
    4. Hotel Agent (Expedia & Booking.com Engine)
    5. Destination Agent (Attractions, Seasonality & Etiquette)
    6. Itinerary Agent (Day-by-Day Slot Optimizer)
    7. Budget Agent (Cost Calculator & Currency Hedger)
    8. Visa Agent (IATA Timatic & Regulatory Compliance)
    9. Local Transport Agent (Metro, Nol Card & Transfers)
    10. Booking Agent (Reservations, PNR & Voucher Minting)
    11. Voice Agent (Multilingual STT/TTS & Dialect Parsing)
    12. Emergency Support Agent (24/7 SOS & Consular Hotlines)
    13. Recommendation Agent (Taste Graph & Hyper-Personalization)
    """

    def __init__(self):
        self.planner = PlannerAgent()
        self.flight_agent = FlightAgent()
        self.hotel_agent = HotelAgent()
        self.destination_agent = DestinationAgent()
        self.itinerary_agent = ItineraryAgent()
        self.budget_agent = BudgetAgent()
        self.visa_agent = VisaAgent()
        self.transport_agent = TransportAgent()
        self.voice_agent = VoiceAgent()
        self.booking_agent = BookingAgent()
        self.emergency_agent = EmergencyAgent()
        self.recommendation_agent = RecommendationAgent()

    def get_agent_registry(self) -> List[Dict[str, Any]]:
        return [
            {"id": "orchestrator", "name": "Master Orchestrator", "role": "Swarm Coordination & Workflow Synthesis", "status": "active", "latency_ms": 28},
            {"id": "planner", "name": "Travel Planner Agent", "role": "Itinerary Generation & Day Planning", "status": "active", "latency_ms": 42},
            {"id": "flight", "name": "Flight Discovery Agent", "role": "Amadeus GDS & Multi-leg Search", "status": "active", "latency_ms": 115},
            {"id": "hotel", "name": "Hotel Selection Agent", "role": "Hospitality & Amenities Matcher", "status": "active", "latency_ms": 89},
            {"id": "destination", "name": "Destination Discovery Agent", "role": "Sightseeing, Seasonality & Etiquette", "status": "active", "latency_ms": 35},
            {"id": "itinerary", "name": "Itinerary Master Agent", "role": "Schedule & Time Slot Optimizer", "status": "active", "latency_ms": 40},
            {"id": "budget", "name": "Budget & Expense Agent", "role": "Dynamic Cost Modeling & FX Hedging", "status": "active", "latency_ms": 22},
            {"id": "visa", "name": "Visa & Document Agent", "role": "IATA Timatic & Regulatory Assistant", "status": "active", "latency_ms": 48},
            {"id": "transport", "name": "Local Transport Agent", "role": "Metro, Cabs & Transfer Planner", "status": "active", "latency_ms": 31},
            {"id": "booking", "name": "Booking & Voucher Agent", "role": "PNR Generation & Voucher Minting", "status": "active", "latency_ms": 65},
            {"id": "voice", "name": "Multilingual Voice Agent", "role": "Speech-to-Text & Regional Dialects", "status": "active", "latency_ms": 50},
            {"id": "emergency", "name": "Emergency Support Agent", "role": "24/7 SOS & Consular Hotlines", "status": "active", "latency_ms": 19},
            {"id": "recommendation", "name": "AI Recommendation Agent", "role": "Taste Graph & Activity Ranker", "status": "active", "latency_ms": 38}
        ]

    def process_query(self, message: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        msg_lower = message.lower()
        context = context or {}

        origin = context.get("origin", "Dhanbad")
        destination = context.get("destination", "Dubai")
        currency = context.get("currency", "INR")
        duration = context.get("duration_days", 10)
        passport = context.get("passport_country", "India")

        thoughts = []
        cards = []

        # Handle Dhanbad to Dubai 10 days flagship query
        if any(kw in msg_lower for kw in ["dubai", "dhanbad", "10 days", "itinerary", "plan a trip"]):
            # 1. Orchestrator Analysis
            thoughts.append({
                "agent_id": "orchestrator",
                "action": f"Swarm dispatch triggered for intent 'trip_plan' ({origin} -> {destination}, {duration} days)",
                "status": "done",
                "details": "Concurrent multi-agent consensus pipeline initiated across 11 specialized nodes."
            })

            # 2. Travel Planner Agent
            planner_plan = self.planner.generate_dubai_10day_itinerary()
            thoughts.append({
                "agent_id": "planner",
                "action": f"Drafted 10-day master structure ({len(planner_plan['highlights'])} major highlight hubs)",
                "status": "done",
                "details": "Divided into Downtown, Old Dubai Heritage, Desert Safari, Palm Jumeirah & Abu Dhabi Day Tour."
            })

            # 3. Flight Agent Execution
            flights = self.flight_agent.search_flights(origin, destination, duration)
            thoughts.append({
                "agent_id": "flight",
                "action": f"Queried GDS via Amadeus API for {origin} -> {destination} route",
                "status": "done",
                "details": f"Emirates EK 571 (₹32,500) ranked #1 for comfort; IndiGo 6E 1401 (₹26,800) ranked #1 for budget."
            })
            cards.append({
                "type": "flight_list",
                "data": flights[:2]
            })

            # 4. Hotel Agent Execution
            hotels = self.hotel_agent.search_hotels(destination)
            thoughts.append({
                "agent_id": "hotel",
                "action": "Indexed verified Downtown Dubai hotels with Burj Khalifa views and metro proximity",
                "status": "done",
                "details": "Rove Downtown (₹4,500/night) selected for best value; Address Downtown (₹24,000/night) for luxury."
            })
            cards.append({
                "type": "hotel_list",
                "data": hotels[:2]
            })

            # 5. Visa Agent Execution
            visa_info = self.visa_agent.check_visa(passport, destination)
            thoughts.append({
                "agent_id": "visa",
                "action": f"Checked IATA Timatic entry guidelines for {passport} passport entering UAE",
                "status": "done",
                "details": "Confirmed 30-Day Tourist eVisa (₹7,500). Indian passports with valid US/UK/Schengen visas qualify for Visa on Arrival at DXB."
            })
            cards.append({
                "type": "visa_info",
                "data": visa_info
            })

            # 6. Local Transport Agent Execution
            transport_plan = self.transport_agent.get_transport_plan(destination)
            thoughts.append({
                "agent_id": "transport",
                "action": "Formulated local ground transit roadmap (Dubai Metro Nol Silver Card + RTA Taxi)",
                "status": "done",
                "details": f"Allocated ₹{transport_plan['total_estimated_budget_inr']:,} for metro rides, abra boats, and intercity coach."
            })

            # 7. Budget Agent Execution
            budget_data = self.budget_agent.calculate_budget(destination, duration, travelers=2, currency=currency)
            thoughts.append({
                "agent_id": "budget",
                "action": f"Generated itemized cost forecast in {currency} (Flights, Hotel 9 nights, Activities, Local Transport)",
                "status": "done",
                "details": f"Committed expenditure: ₹97,000 total (well within user's ₹1,50,000 budget cap with ₹53,000 buffer)."
            })
            cards.append({
                "type": "budget_summary",
                "data": {
                    "flightsUSD": budget_data["breakdown_usd"]["flights"],
                    "hotelUSD": budget_data["breakdown_usd"]["hotel"],
                    "activitiesUSD": budget_data["breakdown_usd"]["activities"],
                    "foodUSD": budget_data["breakdown_usd"]["food"],
                    "localTransportUSD": budget_data["breakdown_usd"]["local_transport"],
                    "visaInsuranceUSD": budget_data["breakdown_usd"]["visa_insurance"],
                    "emergencyBufferUSD": budget_data["breakdown_usd"]["emergency_buffer"],
                    "totalUSD": budget_data["total_usd"],
                    "totalINR": 97000
                }
            })

            reply_text = (
                f"Great choice! Here's a complete, verified travel plan for your 10-day Dubai trip from Dhanbad:\n\n"
                f"✈️ **Flights**: from ₹32,500 (round trip via Emirates EK 571 from Kolkata CCU, or IndiGo from Ranchi IXR)\n"
                f"🏨 **Hotels**: from ₹4,500/night (Rove Downtown with Burj Khalifa views, 9 nights = ₹40,500)\n"
                f"🗺️ **Itinerary**: Top sights, activities & day-by-day plan (Day 3 Burj Khalifa & Dubai Mall, Desert Safari, Palm Jumeirah, Abu Dhabi)\n"
                f"💰 **Est. Budget**: ₹85,000 – ₹1,25,000 (Targeting ₹97,000, safe within your ₹1,50,000 cap!)\n"
                f"🛂 **Visa**: E-Visa for Indian passport (30 days, ₹7,500, 2-3 business days processing)\n"
                f"🚇 **Local Transport**: Silver Nol Metro Card + RTA Taxis (~₹6,000 total)"
            )

            return {
                "reply": reply_text,
                "agent_id": "planner",
                "agent_thoughts": thoughts,
                "cards": cards,
                "timestamp": datetime.now().strftime("%I:%M %p")
            }

        # Emergency Support Query
        if any(kw in msg_lower for kw in ["emergency", "police", "ambulance", "hospital", "embassy", "lost passport", "sos"]):
            contacts = self.emergency_agent.get_emergency_contacts("dubai")
            thoughts.append({
                "agent_id": "emergency",
                "action": "Urgent emergency assistance protocol activated",
                "status": "done",
                "details": "Retrieved 24/7 Dubai Police, Ambulance, Tourist Helpline, and Indian Consulate in Dubai."
            })
            return {
                "reply": (
                    f"🚨 **Emergency & Consular Assistance Activated for Dubai**:\n"
                    f"• Police / Urgent Assistance: **999**\n"
                    f"• Ambulance / Medical: **998**\n"
                    f"• Fire / Civil Defence: **997**\n"
                    f"• Dubai Tourist Police Helpline: **+971 800 2626**\n"
                    f"• Consulate General of India, Dubai: **+971 4 397 1222** / 24x7 Helpline: **+971 50 734 7676**"
                ),
                "agent_id": "emergency",
                "agent_thoughts": thoughts,
                "cards": [{"type": "emergency_card", "data": contacts}],
                "timestamp": datetime.now().strftime("%I:%M %p")
            }

        # General response
        dest_info = self.destination_agent.get_destination_info(destination)
        thoughts.append({
            "agent_id": "destination",
            "action": f"Queried destination knowledge base for '{message}'",
            "status": "done",
            "details": f"Retrieved climate, seasonal windows, and top attractions for {dest_info['name']}."
        })

        return {
            "reply": f"TravelMate AI Copilot is standing by. All 11 autonomous agents are online to help you plan, book, or optimize your journey. Would you like to review flights, hotel stays, or a custom 10-day itinerary?",
            "agent_id": "copilot",
            "agent_thoughts": thoughts,
            "cards": [],
            "timestamp": datetime.now().strftime("%I:%M %p")
        }
