"""
Global Tourism Explorer Endpoints
"""

from fastapi import APIRouter, HTTPException, Query
from typing import Dict, Any, List, Optional
from pydantic import BaseModel
from services.tourism.database import (
    GLOBAL_DESTINATIONS,
    search_global_destinations,
    get_destination_by_id
)
from services.tourism.geo_engine import (
    find_nearby_destinations,
    query_global_places,
    calculate_multi_stop_route
)

router = APIRouter(prefix="/api/tourism", tags=["Global Tourism Explorer"])

class NearbySearchRequest(BaseModel):
    latitude: float
    longitude: float
    radius_km: float = 3000.0

class MultiStopRouteRequest(BaseModel):
    destination_ids: List[str]

class AIRecommendationRequest(BaseModel):
    prompt: Optional[str] = None
    continent: Optional[str] = "All"
    category: Optional[str] = "All"
    max_budget_inr: Optional[float] = None
    vibe: Optional[str] = "romantic"  # romantic, adventure, family, culture, luxury
    season: Optional[str] = "winter"

@router.get("/destinations")
def list_destinations(
    query: Optional[str] = None,
    continent: Optional[str] = None,
    category: Optional[str] = None,
    country: Optional[str] = None,
    max_budget: Optional[float] = None,
    family_friendly: bool = False,
    unesco_only: bool = False,
    sort_by: str = "popularity",
    page: int = 1,
    page_size: int = 50
):
    """
    Search and filter worldwide tourist destinations with category and continent filtering.
    """
    filtered = search_global_destinations(
        query=query,
        continent=continent,
        category=category,
        country=country,
        max_budget_inr=max_budget,
        family_friendly_only=family_friendly,
        unesco_only=unesco_only,
        sort_by=sort_by
    )

    total = len(filtered)
    start = (page - 1) * page_size
    paged = filtered[start:start + page_size]

    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "destinations": paged
    }

@router.get("/destinations/{dest_id}")
def get_destination(dest_id: str):
    """
    Returns complete tourist destination dossier including photos, ticket prices, timings, and transit.
    """
    dest = get_destination_by_id(dest_id)
    if not dest:
        raise HTTPException(status_code=404, detail="Destination not found")
    return dest

@router.post("/search-world")
def search_world_places(query: str = Query(..., min_length=2)):
    """
    Dynamic worldwide geocoding and tourist POI discovery for ANY city, region, or attraction on Earth.
    """
    return {
        "query": query,
        "results": query_global_places(query)
    }

@router.post("/nearby")
def get_nearby_places(req: NearbySearchRequest):
    """
    Finds tourist destinations near the user's current GPS position or selected coordinates.
    """
    places = find_nearby_destinations(req.latitude, req.longitude, req.radius_km)
    return {
        "user_coords": {"latitude": req.latitude, "longitude": req.longitude},
        "radius_km": req.radius_km,
        "count": len(places),
        "results": places
    }

@router.post("/plan-route")
def plan_multi_stop_route(req: MultiStopRouteRequest):
    """
    Computes distances, recommended travel modes, and cost estimates between multiple destinations.
    """
    return calculate_multi_stop_route(req.destination_ids)

@router.post("/ai-recommend")
def ai_recommend_destinations(req: AIRecommendationRequest):
    """
    AI-driven destination recommendations matching user preferences, budget, season, and travel style.
    """
    all_d = list(GLOBAL_DESTINATIONS)
    scored = []

    for d in all_d:
        score = d["rating"] * 2.0  # base score

        # Continent match
        if req.continent and req.continent != "All" and d["continent"].lower() == req.continent.lower():
            score += 3.0

        # Category match
        if req.category and req.category != "All" and d["category"].lower() == req.category.lower():
            score += 3.0

        # Budget match
        if req.max_budget_inr and d["estimated_daily_budget_inr"] <= req.max_budget_inr:
            score += 2.5

        # Vibe matching
        v = (req.vibe or "").lower()
        if v in ["honeymoon", "romantic"] and d["category"] in ["beach", "wonder"]:
            score += 4.0
        elif v in ["adventure", "trekking"] and d["category"] in ["mountain", "waterfall"]:
            score += 4.0
        elif v in ["family"] and d.get("family_friendly", False):
            score += 4.0
        elif v in ["culture", "history"] and (d.get("unesco_heritage", False) or d["category"] in ["religious", "wonder"]):
            score += 4.0

        # Season matching
        s = (req.season or "").lower()
        if s in ["winter", "december", "january", "february"] and any(m in d["best_season"].lower() for m in ["nov", "dec", "jan", "feb", "mar", "winter"]):
            score += 3.0

        scored.append((score, d))

    scored.sort(key=lambda x: -x[0])
    top_picks = [item[1] for item in scored[:6]]

    return {
        "vibe": req.vibe,
        "recommended_count": len(top_picks),
        "recommendations": top_picks,
        "ai_rationale": f"Curated {len(top_picks)} worldwide destinations matching your {req.vibe or 'leisure'} travel preferences and budget criteria."
    }

@router.get("/world-stats")
def get_world_stats():
    """
    Aggregated global tourism metrics.
    """
    continents = {}
    categories = {}
    for d in GLOBAL_DESTINATIONS:
        c = d["continent"]
        cat = d["category"]
        continents[c] = continents.get(c, 0) + 1
        categories[cat] = categories.get(cat, 0) + 1

    return {
        "total_destinations": len(GLOBAL_DESTINATIONS),
        "continents_covered": continents,
        "categories_covered": categories,
        "countries_count": len(set(d["country"] for d in GLOBAL_DESTINATIONS))
    }
