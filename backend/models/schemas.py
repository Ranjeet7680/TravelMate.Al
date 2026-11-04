from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class ChatRequest(BaseModel):
    message: str
    user_id: Optional[str] = "user_default"
    origin: Optional[str] = "Dhanbad"
    destination: Optional[str] = "Dubai"
    duration_days: Optional[int] = 10
    budget_currency: Optional[str] = "INR"
    travel_style: Optional[str] = "comfort"
    passport_country: Optional[str] = "India"

class AgentThought(BaseModel):
    agent_id: str
    action: str
    status: str = "done"
    details: Optional[str] = None

class FlightSearchRequest(BaseModel):
    origin: str
    destination: str
    departure_date: str
    return_date: Optional[str] = None
    passengers: int = 1
    cabin_class: str = "Economy"

class HotelSearchRequest(BaseModel):
    city: str
    check_in: str
    check_out: str
    guests: int = 2
    min_rating: float = 4.0

class VisaCheckRequest(BaseModel):
    passport_country: str
    destination_country: str

class BudgetCalculationRequest(BaseModel):
    destination: str
    duration_days: int
    travelers_count: int
    travel_style: str = "comfort"
    currency: str = "INR"

class ChatResponse(BaseModel):
    reply: str
    agent_id: str
    agent_thoughts: List[AgentThought] = []
    cards: List[Dict[str, Any]] = []
    timestamp: str
