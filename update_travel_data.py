import re
import csv
import json

with open("datasets/destinations_expanded.csv", "r", encoding="utf-8") as f:
    dest_rows = list(csv.DictReader(f))

with open("datasets/holiday_packages.csv", "r", encoding="utf-8") as f:
    pkg_rows = list(csv.DictReader(f))

with open("datasets/cabs_and_rentals.csv", "r", encoding="utf-8") as f:
    fleet_rows = list(csv.DictReader(f))

with open("datasets/sightseeing_tours.csv", "r", encoding="utf-8") as f:
    tour_rows = list(csv.DictReader(f))

def clean_val(v):
    return v.replace("'", "\\'")

ts_destinations = "export const EXPLORER_DESTINATIONS: DestinationItem[] = [\n"
for r in dest_rows:
    hl_list = [f"'{clean_val(h.strip())}'" for h in r["highlights"].split(",") if h.strip()]
    hl_str = ", ".join(hl_list)
    ts_destinations += f"""  {{
    id: '{r["id"]}',
    name: '{clean_val(r["city"])}',
    city: '{clean_val(r["city"])}',
    state: '{clean_val(r["state"])}',
    country: '{clean_val(r["country"])}',
    region: '{r["region"]}',
    type: '{r["type"]}',
    tag: '{clean_val(r["tag"])}',
    dailyBudgetINR: {r["daily_budget"]},
    bestSeason: '{clean_val(r["best_season"])}',
    distanceDhanbadKm: {r["distance_dhanbad"]},
    rating: {r["rating"]},
    reviews: {r["reviews"]},
    image: '{r["image"]}',
    highlights: [{hl_str}],
    cuisine: '{clean_val(r["cuisine"])}',
    visa: '{clean_val(r["visa"])}',
  }},\n"""
ts_destinations += "];\n\n"

indian_states = {
    "Jharkhand": ["Dhanbad", "Ranchi", "Deoghar", "Jamshedpur", "Netarhat", "Betla National Park"],
    "West Bengal": ["Kolkata", "Darjeeling", "Digha", "Siliguri", "Sundarbans", "Kalimpong"],
    "Bihar": ["Patna", "Bodh Gaya", "Rajgir", "Nalanda", "Vaishali"],
    "Uttar Pradesh": ["Varanasi", "Agra", "Lucknow", "Ayodhya", "Mathura", "Prayagraj"],
    "Delhi": ["New Delhi", "Red Fort", "India Gate", "Qutub Minar"],
    "Rajasthan": ["Jaipur", "Udaipur", "Jodhpur", "Jaisalmer", "Pushkar", "Mount Abu"],
    "Maharashtra": ["Mumbai", "Pune", "Lonavala", "Mahabaleshwar", "Nashik", "Shirdi"],
    "Goa": ["Panaji", "Baga", "Calangute", "Palolem", "Anjuna"],
    "Kerala": ["Kochi", "Munnar", "Alleppey", "Wayanad", "Thekkady", "Varkala"],
    "Tamil Nadu": ["Chennai", "Ooty", "Kodaikanal", "Madurai", "Rameswaram", "Kanyakumari"],
    "Karnataka": ["Bengaluru", "Mysuru", "Coorg", "Hampi", "Gokarna", "Chikmagalur"],
    "Telangana": ["Hyderabad", "Warangal", "Nagarjuna Sagar"],
    "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Tirupati", "Araku Valley", "Amaravati"],
    "Odisha": ["Bhubaneswar", "Puri", "Konark", "Chilika Lake", "Cuttack"],
    "Gujarat": ["Ahmedabad", "Surat", "Somnath", "Dwarka", "Rann of Kutch", "Statue of Unity"],
    "Madhya Pradesh": ["Bhopal", "Indore", "Ujjain", "Khajuraho", "Pachmarhi", "Gwalior"],
    "Punjab": ["Amritsar", "Chandigarh", "Ludhiana", "Anandpur Sahib"],
    "Haryana": ["Gurugram", "Kurukshetra", "Panchkula", "Morni Hills"],
    "Himachal Pradesh": ["Shimla", "Manali", "Dharamshala", "Kasol", "Spiti Valley"],
    "Uttarakhand": ["Dehradun", "Mussoorie", "Rishikesh", "Haridwar", "Nainital", "Auli"],
    "Assam": ["Guwahati", "Kaziranga", "Majuli", "Tezpur"],
    "Meghalaya": ["Shillong", "Cherrapunji", "Dawki", "Mawlynnong"],
    "Arunachal Pradesh": ["Tawang", "Ziro", "Bomdila", "Itanagar"],
    "Sikkim": ["Gangtok", "Pelling", "Lachung", "Yumthang Valley"],
    "Nagaland": ["Kohima", "Dimapur", "Dzukou Valley"],
    "Manipur": ["Imphal", "Loktak Lake"],
    "Mizoram": ["Aizawl", "Reiek"],
    "Tripura": ["Agartala", "Neermahal", "Unakoti"],
    "Jammu & Kashmir": ["Srinagar", "Gulmarg", "Pahalgam", "Sonamarg"],
    "Ladakh": ["Leh", "Nubra Valley", "Pangong Lake", "Tso Moriri"],
    "Andaman & Nicobar": ["Port Blair", "Havelock Island", "Neil Island"],
    "Lakshadweep": ["Agatti", "Bangaram", "Kavaratti"]
}

ts_states = "export const INDIAN_STATES_DATA: Record<string, string[]> = " + json.dumps(indian_states, indent=2) + ";\n\n"

ts_packages = "export const HOLIDAY_PACKAGES: HolidayPackage[] = [\n"
for p in pkg_rows:
    ts_packages += f"""  {{
    id: '{p["id"]}',
    title: '{clean_val(p["title"])}',
    category: '{p["category"]}',
    type: '{clean_val(p["type"])}',
    durationDays: {p["duration_days"]},
    durationNights: {p["duration_nights"]},
    departureCity: '{clean_val(p["departure_city"])}',
    destinations: '{clean_val(p["destinations"])}',
    priceINR: {p["price_inr"]},
    originalPriceINR: {p["original_price_inr"]},
    rating: {p["rating"]},
    reviews: {p["reviews"]},
    image: '{p["image"]}',
    inclusions: '{clean_val(p["inclusions"])}',
    badge: '{p["badge"]}',
  }},\n"""
ts_packages += "];\n\n"

ts_fleet = "export const MOBILITY_FLEET: MobilityOption[] = [\n"
for v in fleet_rows:
    ts_fleet += f"""  {{
    id: '{v["id"]}',
    category: '{v["category"]}',
    service: '{clean_val(v["service"])}',
    name: '{clean_val(v["name"])}',
    capacity: '{clean_val(v["capacity"])}',
    baseFareINR: {v["base_fare"]},
    ratePerKmINR: {v["rate_per_km"]},
    hourlyRateINR: {v["hourly_rate"]},
    image: '{v["image"]}',
    features: '{clean_val(v["features"])}',
    rating: {v["rating"]},
  }},\n"""
ts_fleet += "];\n\n"

ts_tours = "export const SIGHTSEEING_TOURS: SightseeingTour[] = [\n"
for t in tour_rows:
    ts_tours += f"""  {{
    id: '{t["id"]}',
    title: '{clean_val(t["title"])}',
    city: '{clean_val(t["city"])}',
    duration: '{clean_val(t["duration"])}',
    priceINR: {t["price_inr"]},
    rating: {t["rating"]},
    reviews: {t["reviews"]},
    image: '{t["image"]}',
    highlights: '{clean_val(t["highlights"])}',
  }},\n"""
ts_tours += "];\n\n"

helper_code = """// Helper to format currency
export function formatCurrency(amountINR: number, currency: string = 'INR'): string {
  const cfg = CURRENCIES[currency] || CURRENCIES.INR;
  const converted = amountINR * cfg.rateAgainstINR;

  if (currency === 'INR') {
    return `₹${Math.round(converted).toLocaleString('en-IN')}`;
  }
  if (currency === 'AED') {
    return `AED ${Math.round(converted).toLocaleString('en-US')}`;
  }
  if (currency === 'EUR') {
    return `€${Math.round(converted).toLocaleString('de-DE')}`;
  }
  if (currency === 'GBP') {
    return `£${Math.round(converted).toLocaleString('en-GB')}`;
  }
  return `$${Math.round(converted).toLocaleString('en-US')}`;
}
"""

with open("frontend/src/data/travelData.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Cut from "export const EXPLORER_DESTINATIONS" to the end of file
idx = content.find("export const EXPLORER_DESTINATIONS")
if idx == -1:
    print("EXPLORER_DESTINATIONS not found!")
else:
    new_content = content[:idx] + ts_destinations + ts_states + ts_packages + ts_fleet + ts_tours + helper_code
    with open("frontend/src/data/travelData.ts", "w", encoding="utf-8") as f:
        f.write(new_content)
    print("[SUCCESS] Rewrote travelData.ts cleanly!")
