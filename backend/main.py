from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from typing import Optional, List, Dict, Any
import os
from config import settings
from models.schemas import (
    ChatRequest, 
    ChatResponse, 
    FlightSearchRequest, 
    HotelSearchRequest, 
    VisaCheckRequest, 
    BudgetCalculationRequest
)
from agents.orchestrator import MultiAgentOrchestrator
from agents.flight_agent import FlightAgent
from agents.hotel_agent import HotelAgent
from agents.visa_agent import VisaAgent
from agents.budget_agent import BudgetAgent
from agents.emergency_agent import EmergencyAgent
from agents.destination_agent import DestinationAgent
from agents.transport_agent import TransportAgent
from agents.booking_agent import BookingAgent
from agents.voice_agent import VoiceAgent
from agents.recommendation_agent import RecommendationAgent

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="Production Multi-Agent Service for TravelMate AI – Virtual Travel Agent & Travel Copilot (Team Innovation 27X7)."
)

# Enable CORS for frontend clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

orchestrator = MultiAgentOrchestrator()
flight_agent = FlightAgent()
hotel_agent = HotelAgent()
visa_agent = VisaAgent()
budget_agent = BudgetAgent()
emergency_agent = EmergencyAgent()
destination_agent = DestinationAgent()
transport_agent = TransportAgent()
booking_agent = BookingAgent()
voice_agent = VoiceAgent()
recommendation_agent = RecommendationAgent()

@app.get("/")
def root():
    return {
        "status": "online",
        "team": "Innovation 27X7",
        "app": settings.APP_NAME,
        "version": settings.VERSION,
        "agents_online": 13,
        "documentation": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "TravelMate AI Backend Multi-Agent Mesh",
        "swarm_status": "synced"
    }

@app.get("/api/agents")
def list_agents():
    return {
        "count": len(orchestrator.get_agent_registry()),
        "agents": orchestrator.get_agent_registry()
    }

@app.post("/api/chat", response_model=ChatResponse)
def handle_copilot_chat(req: ChatRequest):
    try:
        result = orchestrator.process_query(
            message=req.message,
            context={
                "origin": req.origin,
                "destination": req.destination,
                "duration_days": req.duration_days,
                "currency": req.budget_currency,
                "passport_country": req.passport_country,
                "travel_style": req.travel_style,
            }
        )
        return ChatResponse(
            reply=result["reply"],
            agent_id=result["agent_id"],
            agent_thoughts=result["agent_thoughts"],
            cards=result["cards"],
            timestamp=result["timestamp"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/flights/search")
def search_flights(req: FlightSearchRequest):
    return flight_agent.search_flights(req.origin, req.destination)

@app.post("/api/hotels/search")
def search_hotels(req: HotelSearchRequest):
    return hotel_agent.search_hotels(req.city)

@app.post("/api/visa/check")
def check_visa(req: VisaCheckRequest):
    return visa_agent.check_visa(req.passport_country, req.destination_country)

@app.post("/api/budget/calculate")
def calculate_budget(req: BudgetCalculationRequest):
    return budget_agent.calculate_budget(
        destination=req.destination,
        duration_days=req.duration_days,
        travelers=req.travelers_count,
        currency=req.currency
    )

@app.get("/api/destinations")
def list_destinations(
    region: Optional[str] = None,
    state: Optional[str] = None,
    travel_type: Optional[str] = None,
    max_budget: Optional[float] = None,
    max_distance: Optional[int] = None,
    search: Optional[str] = None
):
    """Filter and discover Indian domestic and international destinations."""
    return destination_agent.search_destinations(
        region=region,
        state=state,
        exp_type=travel_type,
        max_budget=max_budget,
        max_distance=max_distance,
        query=search
    )

@app.get("/api/destinations/{city}")
def get_destination_details(city: str):
    return destination_agent.get_destination_info(city)

@app.get("/api/packages")
def get_holiday_packages(category: Optional[str] = None):
    csv_path = os.path.join(os.path.dirname(__file__), "..", "datasets", "holiday_packages.csv")
    if not os.path.exists(csv_path):
        csv_path = os.path.join(os.path.dirname(__file__), "datasets", "holiday_packages.csv")
    pkgs = []
    if os.path.exists(csv_path):
        import csv
        with open(csv_path, "r", encoding="utf-8") as f:
            pkgs = list(csv.DictReader(f))
    if category and category != "All":
        pkgs = [p for p in pkgs if p.get("category", "").lower() == category.lower()]
    return pkgs

@app.post("/api/packages/search")
def search_packages(payload: Dict[str, Any]):
    dest = payload.get("destination", "").lower()
    pkgs = get_holiday_packages()
    if dest:
        pkgs = [p for p in pkgs if dest in p.get("destinations", "").lower() or dest in p.get("title", "").lower()]
    return pkgs

@app.post("/api/packages/{package_id}/book")
def book_package(package_id: str, payload: Dict[str, Any]):
    traveler = payload.get("traveler_name", "Ranjeet Kumar")
    phone = payload.get("phone", "+91 98765 43210")
    passengers = payload.get("passengers", 2)
    return {
        "status": "Confirmed",
        "booking_id": f"TM-PKG-{package_id[-4:]}-8912",
        "package_id": package_id,
        "traveler": traveler,
        "phone": phone,
        "passengers": passengers,
        "confirmation_timestamp": "2026-11-04T15:45:00Z",
        "message": "Official holiday package voucher issued with travel insurance & local guide."
    }

@app.post("/api/cabs/search")
def search_cabs(payload: Dict[str, Any]):
    pickup = payload.get("pickup", "Dhanbad")
    drop = payload.get("drop", "Kolkata")
    return {
        "pickup": pickup,
        "drop": drop,
        "distance_km": 270,
        "options": [
            {"type": "Hatchback (WagonR)", "fare_inr": 3450, "eta_mins": 10, "rating": 4.8},
            {"type": "Prime Sedan (Dzire)", "fare_inr": 4200, "eta_mins": 8, "rating": 4.9},
            {"type": "SUV (Innova Crysta)", "fare_inr": 5800, "eta_mins": 12, "rating": 4.95},
            {"type": "Tempo Traveller 12-Seater", "fare_inr": 8500, "eta_mins": 25, "rating": 4.85}
        ]
    }

@app.post("/api/cabs/book")
def book_cab(payload: Dict[str, Any]):
    cab_type = payload.get("cab_type", "Prime Sedan (Dzire)")
    pickup = payload.get("pickup", "Dhanbad Junction")
    return {
        "status": "Confirmed",
        "ride_id": "CAB-TM-9182",
        "cab_type": cab_type,
        "driver_name": "Suresh Verma",
        "driver_phone": "+91 98351 22441",
        "vehicle_number": "JH-10-BX-4482",
        "pickup": pickup,
        "otp": "4819",
        "message": "Cab driver assigned and en route with live GPS."
    }

@app.post("/api/rentals/cars/search")
def search_car_rentals(city: str = "Dhanbad", mode: str = "self_drive"):
    return [
        {"model": "Maruti Baleno / Swift", "daily_rate_inr": 1400, "fuel_policy": "Full to Full", "unlimited_km": True},
        {"model": "Mahindra Thar 4x4", "daily_rate_inr": 3200, "fuel_policy": "Full to Full", "unlimited_km": True},
        {"model": "Tata Nexon EV Max", "daily_rate_inr": 2400, "fuel_policy": "Free Charging", "unlimited_km": True}
    ]

@app.post("/api/rentals/bikes/search")
def search_bike_rentals(city: str = "Dhanbad"):
    return [
        {"model": "Honda Activa 6G", "daily_rate_inr": 450, "helmets_included": 2},
        {"model": "Royal Enfield Classic 350", "daily_rate_inr": 1100, "helmets_included": 2},
        {"model": "Royal Enfield Himalayan 450", "daily_rate_inr": 1500, "helmets_included": 2}
    ]

@app.get("/api/sightseeing")
def get_sightseeing(city: Optional[str] = None):
    csv_path = os.path.join(os.path.dirname(__file__), "..", "datasets", "sightseeing_tours.csv")
    if not os.path.exists(csv_path):
        csv_path = os.path.join(os.path.dirname(__file__), "datasets", "sightseeing_tours.csv")
    tours = []
    if os.path.exists(csv_path):
        import csv
        with open(csv_path, "r", encoding="utf-8") as f:
            tours = list(csv.DictReader(f))
    if city:
        tours = [t for t in tours if city.lower() in t.get("city", "").lower()]
    return tours

@app.get("/api/transport/{city}")
def get_transport_guide(city: str):
    return transport_agent.get_transport_plan(city)

@app.get("/api/recommendations")
def get_recommendations(interests: Optional[str] = "Sightseeing,Adventure", budget_tier: str = "Standard"):
    interest_list = [i.strip() for i in interests.split(",")]
    return recommendation_agent.recommend_for_user(interest_list, budget_tier)

@app.post("/api/bookings/issue")
def issue_booking(package_id: str = "dubai-10d-pkg", traveler_name: str = "Ranjeet Kumar", total_inr: float = 97000.0, payment_method: str = "UPI"):
    return booking_agent.issue_booking(package_id, traveler_name, total_inr, payment_method)

@app.post("/api/voice/process")
def process_voice(transcript: str, locale: str = "en-US"):
    return voice_agent.process_voice_transcript(transcript, locale)

@app.get("/api/emergency/contacts")
def get_emergency_contacts(destination: str = "Dubai", nationality: str = "India"):
    return emergency_agent.get_emergency_info(destination, nationality)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
