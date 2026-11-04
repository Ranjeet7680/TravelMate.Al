import sys
import os

# Add backend directory to path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_endpoints():
    print("Testing TravelMate AI Backend Endpoints...")

    # 1. Root
    r = client.get("/")
    assert r.status_code == 200, f"Root failed: {r.status_code}"
    print(f"[OK] Root: {r.json()['app']} (Agents online: {r.json()['agents_online']})")

    # 2. Health
    r = client.get("/api/health")
    assert r.status_code == 200, f"Health failed: {r.status_code}"
    print(f"[OK] Health: {r.json()['status']}")

    # 3. Agents Registry
    r = client.get("/api/agents")
    assert r.status_code == 200
    agents = r.json()["agents"]
    assert len(agents) >= 10, f"Expected at least 10 agents, got {len(agents)}"
    print(f"[OK] Agents Registry: {len(agents)} autonomous agents active")

    # 4. Chat Copilot - Dhanbad to Dubai 10 days flagship
    r = client.post("/api/chat", json={
        "message": "I want to travel from Dhanbad to Dubai for 10 days with two people. My total budget is 150000 INR. I prefer comfortable hotels, sightseeing, shopping and adventure activities.",
        "origin": "Dhanbad",
        "destination": "Dubai",
        "duration_days": 10,
        "travelers_count": 2,
        "budget_currency": "INR",
        "passport_country": "India"
    })
    assert r.status_code == 200, f"Chat failed: {r.status_code}"
    chat_resp = r.json()
    assert "reply" in chat_resp
    assert len(chat_resp["agent_thoughts"]) >= 5
    assert len(chat_resp["cards"]) >= 3
    print(f"[OK] Chat Copilot: Received {len(chat_resp['agent_thoughts'])} agent thoughts and {len(chat_resp['cards'])} interactive cards")

    # 5. Flights Search
    r = client.post("/api/flights/search", json={
        "origin": "CCU",
        "destination": "DXB",
        "departure_date": "2026-11-15",
        "return_date": "2026-11-24",
        "passengers": 2
    })
    assert r.status_code == 200
    flights = r.json()
    assert len(flights) >= 2
    fn = flights[0].get("flightNumber") or flights[0].get("flight_number")
    print(f"[OK] Flights Search: Found {len(flights)} flights (Top: {flights[0]['airline']} {fn})")

    # 6. Hotels Search
    r = client.post("/api/hotels/search", json={
        "city": "Dubai",
        "check_in": "2026-11-15",
        "check_out": "2026-11-24",
        "guests": 2
    })
    assert r.status_code == 200
    hotels = r.json()
    assert len(hotels) >= 2
    print(f"[OK] Hotels Search: Found {len(hotels)} hotels (Top: {hotels[0]['name']})")

    # 7. Visa Check
    r = client.post("/api/visa/check", json={
        "passport_country": "India",
        "destination_country": "United Arab Emirates"
    })
    assert r.status_code == 200
    visa = r.json()
    vt = visa.get("type") or visa.get("visa_type")
    print(f"[OK] Visa Check: {vt} (Req: {visa.get('required')})")

    # 8. Budget Calculation
    r = client.post("/api/budget/calculate", json={
        "destination": "Dubai",
        "duration_days": 10,
        "travelers_count": 2,
        "currency": "INR"
    })
    assert r.status_code == 200
    b = r.json()
    print(f"[OK] Budget Calculator: Total {b['currency']} {b['total_in_currency']:,} for 2 travelers")

    # 9. Emergency Contacts
    r = client.get("/api/emergency/contacts?destination=Dubai&nationality=India")
    assert r.status_code == 200
    em = r.json()
    print(f"[OK] Emergency Support: Police {em['emergency_numbers']['police']}, Embassy {em['consulate']['phone']}")

    # 10. Recommendations
    r = client.get("/api/recommendations?interests=Sightseeing,Adventure")
    assert r.status_code == 200
    recs = r.json()
    print(f"[OK] Recommendations: Generated {len(recs)} personalized recommendations")

    # 11. Booking Issue
    r = client.post("/api/bookings/issue?package_id=dubai-10d&traveler_name=Ranjeet%20Kumar&total_inr=97000&payment_method=UPI")
    assert r.status_code == 200
    bkg = r.json()
    print(f"[OK] Booking Agent: Issued PNR {bkg['pnr']} with {len(bkg['digital_passes'])} digital passes")

    # 12. Expanded Destinations Discovery (India & International)
    r = client.get("/api/destinations?region=India")
    assert r.status_code == 200
    ind_dest = r.json()
    assert len(ind_dest) >= 5, f"Expected Indian destinations, got {len(ind_dest)}"
    print(f"[OK] Expanded Destinations: Found {len(ind_dest)} Indian domestic destinations")

    # 13. Holiday Packages
    r = client.get("/api/packages")
    assert r.status_code == 200
    pkgs = r.json()
    assert len(pkgs) >= 4, f"Expected packages, got {len(pkgs)}"
    print(f"[OK] Holiday Packages: {len(pkgs)} packages available (Top: {pkgs[0]['title']})")

    # 14. Cab Booking Search
    r = client.post("/api/cabs/search", json={"pickup": "Dhanbad", "drop": "Kolkata"})
    assert r.status_code == 200
    cabs = r.json()
    assert len(cabs["options"]) >= 3
    print(f"[OK] Cab Search: {cabs['pickup']} -> {cabs['drop']} ({cabs['distance_km']} km) with {len(cabs['options'])} cab tiers")

    # 15. Car & Bike Rentals
    r = client.post("/api/rentals/cars/search", params={"city": "Dhanbad"})
    assert r.status_code == 200
    cars = r.json()
    assert len(cars) >= 2
    print(f"[OK] Car Rentals: {len(cars)} rental vehicles available in Dhanbad")

    # 16. Sightseeing Tours
    r = client.get("/api/sightseeing")
    assert r.status_code == 200
    tours = r.json()
    assert len(tours) >= 3
    print(f"[OK] Sightseeing Tours: {len(tours)} curated activities loaded")

    print("\n[SUCCESS] ALL 16 BACKEND API SUITE TESTS PASSED PERFECTLY!")

if __name__ == "__main__":
    test_endpoints()
