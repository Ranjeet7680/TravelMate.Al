import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_tourism_world_stats():
    res = client.get("/api/tourism/world-stats")
    assert res.status_code == 200
    data = res.json()
    assert data["total_destinations"] > 10
    assert "Asia" in data["continents_covered"]
    assert "Europe" in data["continents_covered"]
    assert data["countries_count"] >= 5

def test_tourism_destinations_list_and_filter():
    res = client.get("/api/tourism/destinations?continent=Europe")
    assert res.status_code == 200
    data = res.json()
    assert len(data["destinations"]) > 0
    for d in data["destinations"]:
        assert d["continent"] == "Europe"

    # Test category filter
    res_wonder = client.get("/api/tourism/destinations?category=wonder")
    assert res_wonder.status_code == 200
    for d in res_wonder.json()["destinations"]:
        assert d["category"] == "wonder"

def test_tourism_destination_detail():
    res = client.get("/api/tourism/destinations/burj-khalifa-dubai")
    assert res.status_code == 200
    data = res.json()
    assert data["name"] == "Burj Khalifa & Downtown Dubai"
    assert data["latitude"] > 25.0
    assert data["longitude"] > 55.0
    assert len(data["images"]) >= 2
    assert "entry_fee_inr" in data

def test_tourism_nearby():
    # Search near Delhi (Lat: 28.6139, Lon: 77.2090)
    res = client.post("/api/tourism/nearby", json={
        "latitude": 28.6139,
        "longitude": 77.2090,
        "radius_km": 1000.0
    })
    assert res.status_code == 200
    data = res.json()
    assert data["count"] > 0
    # Taj Mahal should be close to Delhi (~200 km)
    names = [r["name"] for r in data["results"]]
    assert any("Taj Mahal" in n for n in names)
    assert data["results"][0]["distance_from_user_km"] < 1000.0

def test_tourism_plan_route():
    res = client.post("/api/tourism/plan-route", json={
        "destination_ids": ["burj-khalifa-dubai", "taj-mahal-agra", "eiffel-tower-paris"]
    })
    assert res.status_code == 200
    data = res.json()
    assert data["total_waypoints"] == 3
    assert data["total_distance_km"] > 0
    assert len(data["legs"]) == 2

def test_tourism_ai_recommend():
    res = client.post("/api/tourism/ai-recommend", json={
        "vibe": "romantic",
        "season": "winter"
    })
    assert res.status_code == 200
    data = res.json()
    assert len(data["recommendations"]) > 0
    assert "ai_rationale" in data
