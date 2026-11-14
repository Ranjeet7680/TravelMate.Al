import pytest
from fastapi.testclient import TestClient
from main import app
from models.provider_models import FlightComparisonRequest, HotelComparisonRequest, RevalidationRequest
from services.providers.tripcom.client import tripcom_client
from services.providers.makemytrip.client import makemytrip_client
from services.flights.aggregator import flight_aggregator
from services.hotels.aggregator import hotel_aggregator
from services.comparison.engine import comparison_engine
from services.ai.orchestrator import ai_orchestrator

client = TestClient(app)

def test_provider_status_endpoint():
    res = client.get("/api/providers/status")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert "tripcom" in data["providers"]
    assert "makemytrip" in data["providers"]
    assert data["providers"]["tripcom"]["status"] == "ONLINE"
    assert data["providers"]["makemytrip"]["status"] == "ONLINE"

def test_tripcom_flight_and_hotel_search():
    flights = tripcom_client.search_flights("DEL", "DXB", "2026-11-20", passengers=1)
    assert len(flights) > 0
    assert flights[0].provider == "Trip.com"
    assert "Allianceid=4892145" in flights[0].booking_url
    assert flights[0].price_inr > 0

    hotels = tripcom_client.search_hotels("Dubai", "2026-11-20", "2026-11-25", guests=2)
    assert len(hotels) > 0
    assert hotels[0].provider == "Trip.com"
    assert "Allianceid=4892145" in hotels[0].booking_url

def test_makemytrip_flight_and_hotel_search():
    flights = makemytrip_client.search_flights("DEL", "DXB", "2026-11-20", passengers=1)
    assert len(flights) > 0
    assert flights[0].provider == "MakeMyTrip"
    assert "cmp=TM_MMT_AFF_2026" in flights[0].booking_url
    assert flights[0].price_inr > 0

    hotels = makemytrip_client.search_hotels("Dubai", "2026-11-20", "2026-11-25", guests=2)
    assert len(hotels) > 0
    assert hotels[0].provider == "MakeMyTrip"
    assert "cmp=TM_MMT_AFF_2026" in hotels[0].booking_url

def test_flight_aggregator():
    results = flight_aggregator.aggregate_flights("DEL", "DXB", "2026-11-20", passengers=1)
    assert len(results) >= 4
    providers = set(r.provider for r in results)
    assert "Trip.com" in providers
    assert "MakeMyTrip" in providers
    # Verify cheapest and recommended flags
    assert any(r.is_cheapest for r in results)
    assert any(r.is_recommended for r in results)

def test_comparison_engine_flights():
    req = FlightComparisonRequest(origin="DEL", destination="DXB", departure_date="2026-11-20", passengers=1)
    comp = comparison_engine.compare_flights(req)
    assert comp["total_options"] > 0
    assert "Trip.com" in comp["providers_compared"]
    assert "MakeMyTrip" in comp["providers_compared"]
    assert "best_deal" in comp
    assert comp["best_deal"]["cheapest"]["price_inr"] > 0
    assert comp["price_range_inr"]["max_potential_savings"] >= 0

def test_comparison_api_endpoints():
    res1 = client.post("/api/providers/compare/flights", json={
        "origin": "DEL",
        "destination": "DXB",
        "departure_date": "2026-11-20",
        "passengers": 1
    })
    assert res1.status_code == 200
    assert res1.json()["total_options"] > 0

    res2 = client.post("/api/providers/compare/hotels", json={
        "city": "Dubai",
        "checkin_date": "2026-11-20",
        "checkout_date": "2026-11-25",
        "guests": 2
    })
    assert res2.status_code == 200
    assert res2.json()["total_options"] > 0

def test_revalidation_and_tracking():
    reval_res = client.post("/api/providers/revalidate", json={
        "offer_id": "tripcom-fl-1-DEL-DXB",
        "provider_code": "tripcom",
        "item_type": "flight",
        "original_price_inr": 20300.0
    })
    assert reval_res.status_code == 200
    assert reval_res.json()["valid"] is True
    assert "Trip.com" in reval_res.json()["message"]

    track_res = client.post("/api/providers/track-click", json={
        "provider_code": "tripcom",
        "item_type": "flight",
        "item_id": "tripcom-fl-1-DEL-DXB",
        "origin": "DEL",
        "destination": "DXB",
        "target_url": "https://www.trip.com/flights"
    })
    assert track_res.status_code == 200
    assert track_res.json()["tracked"] is True

def test_ai_multilingual_copilot():
    # English test
    res_en = client.post("/api/providers/ai/copilot", json={"message": "Find cheapest flights from Delhi to Dubai"})
    assert res_en.status_code == 200
    data_en = res_en.json()
    assert data_en["intent"] == "flight_search"
    assert data_en["comparison_data"] is not None
    assert "Trip.com" in data_en["reply"] or "MakeMyTrip" in data_en["reply"]

    # Hinglish test
    res_hi = client.post("/api/providers/ai/copilot", json={"message": "Delhi se Dubai sasti flight batao"})
    assert res_hi.status_code == 200
    data_hi = res_hi.json()
    assert data_hi["language"] == "hinglish"
    assert "Trip.com" in data_hi["reply"] or "MakeMyTrip" in data_hi["reply"]

    # Compare query
    res_comp = client.post("/api/providers/ai/copilot", json={"message": "Compare Trip.com and MakeMyTrip for Dubai hotels"})
    assert res_comp.status_code == 200
    assert "search_hotels" in res_comp.json()["tools_executed"] or "compare_providers" in res_comp.json()["tools_executed"]
