import os
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseModel):
    APP_NAME: str = "TravelMate AI - Enterprise Travel Booking & Comparison Platform"
    VERSION: str = "3.0.0"
    DEBUG: bool = True
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    
    # AI Providers
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "gemini") # gemini, openai, vultr, heuristic
    LLM_BASE_URL: str = os.getenv("LLM_BASE_URL", "https://api.vultrinference.com/v1")
    LLM_API_KEY: str = os.getenv("LLM_API_KEY", "")
    LLM_MODEL: str = os.getenv("LLM_MODEL", "meta-llama/llama-3.1-70b-instruct")

    # Trip.com Integration (Open Platform & Affiliate)
    TRIPCOM_ALLIANCE_ID: str = os.getenv("TRIPCOM_ALLIANCE_ID", "4892145")
    TRIPCOM_SID: str = os.getenv("TRIPCOM_SID", "28374198")
    TRIPCOM_API_KEY: str = os.getenv("TRIPCOM_API_KEY", "")
    TRIPCOM_SECRET_KEY: str = os.getenv("TRIPCOM_SECRET_KEY", "")
    TRIPCOM_AFFILIATE_BASE: str = os.getenv("TRIPCOM_AFFILIATE_BASE", "https://www.trip.com")

    # MakeMyTrip Integration (Partner / Handoff)
    MAKEMYTRIP_AFFILIATE_ID: str = os.getenv("MAKEMYTRIP_AFFILIATE_ID", "TM_MMT_AFF_2026")
    MAKEMYTRIP_API_KEY: str = os.getenv("MAKEMYTRIP_API_KEY", "")
    MAKEMYTRIP_SECRET_KEY: str = os.getenv("MAKEMYTRIP_SECRET_KEY", "")
    MAKEMYTRIP_BASE_URL: str = os.getenv("MAKEMYTRIP_BASE_URL", "https://www.makemytrip.com")

    # Amadeus GDS Integration
    AMADEUS_CLIENT_ID: str = os.getenv("AMADEUS_CLIENT_ID", "")
    AMADEUS_CLIENT_SECRET: str = os.getenv("AMADEUS_CLIENT_SECRET", "")

settings = Settings()
