import csv

# 1. Holiday Packages Dataset
packages = [
    {
        "id": "pkg-kashmir-01",
        "title": "Magical Kashmir: Srinagar, Gulmarg & Pahalgam",
        "category": "Domestic",
        "type": "Honeymoon & Family",
        "duration_days": 6,
        "duration_nights": 5,
        "departure_city": "Dhanbad / Kolkata / Delhi",
        "destinations": "Srinagar, Gulmarg, Pahalgam, Sonamarg",
        "price_inr": 28500,
        "original_price_inr": 36000,
        "rating": 4.95,
        "reviews": 1420,
        "image": "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=800&q=80",
        "inclusions": "Houseboat Stay, Gulmarg Gondola Tickets, Shikara Ride, Daily Breakfast & Dinner, Private SUV Cab, Sightseeing Tour Guide",
        "badge": "Best Seller"
    },
    {
        "id": "pkg-dubai-01",
        "title": "Dubai Extravaganza: Burj Khalifa, Palm & Desert Safari",
        "category": "International",
        "type": "Luxury & City",
        "duration_days": 6,
        "duration_nights": 5,
        "departure_city": "Kolkata / Delhi / Mumbai",
        "destinations": "Dubai, Abu Dhabi, Desert Dunes",
        "price_inr": 48900,
        "original_price_inr": 62000,
        "rating": 4.92,
        "reviews": 2180,
        "image": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
        "inclusions": "4-Star Hotel Stay, Burj Khalifa 124th Floor, Desert Safari with BBQ, Dhow Cruise Dinner, Airport Transfer, 30-Day UAE eVisa",
        "badge": "Top Rated"
    },
    {
        "id": "pkg-jharkhand-01",
        "title": "Jharkhand Nature & Tiger Trail: Netarhat & Betla Safari",
        "category": "Weekend",
        "type": "Adventure & Nature",
        "duration_days": 4,
        "duration_nights": 3,
        "departure_city": "Dhanbad / Ranchi",
        "destinations": "Dhanbad, Ranchi Falls, Netarhat Hills, Betla National Park",
        "price_inr": 12800,
        "original_price_inr": 16500,
        "rating": 4.78,
        "reviews": 840,
        "image": "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=800&q=80",
        "inclusions": "Forest Eco Lodge Stay, Jungle Safari Jeep, Sunrise at Magnolia Point, Private Cab from Dhanbad, All Local Meals",
        "badge": "Local Getaway"
    },
    {
        "id": "pkg-bali-01",
        "title": "Bali Bliss: Ubud Rice Terraces, Nusa Penida & Beach Club",
        "category": "International",
        "type": "Honeymoon & Beach",
        "duration_days": 6,
        "duration_nights": 5,
        "departure_city": "Kolkata / Delhi",
        "destinations": "Ubud, Kuta, Nusa Penida, Uluwatu",
        "price_inr": 42000,
        "original_price_inr": 54000,
        "rating": 4.88,
        "reviews": 1950,
        "image": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
        "inclusions": "Private Pool Villa (2 Nights), 4-Star Resort (3 Nights), Nusa Penida Speedboat, Floating Breakfast, Airport Transfers, Balinese Spa",
        "badge": "Trending"
    },
    {
        "id": "pkg-rajasthan-01",
        "title": "Royal Rajasthan: Jaipur Palaces & Jodhpur Forts",
        "category": "Domestic",
        "type": "Heritage & Culture",
        "duration_days": 7,
        "duration_nights": 6,
        "departure_city": "Delhi / Kolkata",
        "destinations": "Jaipur, Jodhpur, Udaipur, Pushkar",
        "price_inr": 31500,
        "original_price_inr": 40000,
        "rating": 4.89,
        "reviews": 1670,
        "image": "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80",
        "inclusions": "Heritage Haveli Stay, Amber Fort Elephant Ride, Lake Pichola Boat, Chokhi Dhani Cultural Night, Private AC Cab",
        "badge": "Cultural Gem"
    },
    {
        "id": "pkg-darjeeling-01",
        "title": "Himalayan Escape: Darjeeling Tea Gardens & Gangtok Monasteries",
        "category": "Domestic",
        "type": "Hill Station",
        "duration_days": 6,
        "duration_nights": 5,
        "departure_city": "Dhanbad / Kolkata / Siliguri",
        "destinations": "Darjeeling, Gangtok, Tsomgo Lake, Kalimpong",
        "price_inr": 23500,
        "original_price_inr": 29800,
        "rating": 4.91,
        "reviews": 1820,
        "image": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
        "inclusions": "Tiger Hill Kanchenjunga Sunrise, Toy Train Ride, Nathula Pass Permits, Tea Estate Tour, Deluxe Hotel Stays",
        "badge": "Popular"
    },
    {
        "id": "pkg-goa-01",
        "title": "Goa Beach Fiesta: Water Sports, Cruises & Beach Shacks",
        "category": "Domestic",
        "type": "Beach & Party",
        "duration_days": 5,
        "duration_nights": 4,
        "departure_city": "Kolkata / Mumbai / Delhi",
        "destinations": "Baga, Calangute, Dudhsagar, South Goa",
        "price_inr": 18900,
        "original_price_inr": 24500,
        "rating": 4.82,
        "reviews": 3100,
        "image": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
        "inclusions": "Resort near Beach with Swimming Pool, Mandovi River Cruise, Jet Ski & Parasailing Combo, Scooter / Cab Rental Included",
        "badge": "Value Deal"
    },
    {
        "id": "pkg-kerala-01",
        "title": "Kerala Backwater Bliss: Munnar Hills & Alleppey Houseboat",
        "category": "Domestic",
        "type": "Nature & Relaxation",
        "duration_days": 6,
        "duration_nights": 5,
        "departure_city": "Bengaluru / Kolkata / Delhi",
        "destinations": "Kochi, Munnar, Thekkady, Alleppey",
        "price_inr": 29800,
        "original_price_inr": 38000,
        "rating": 4.96,
        "reviews": 2350,
        "image": "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
        "inclusions": "Private Deluxe Houseboat, Munnar Tea Valley Cottage, Spice Plantation Tour, Kathakali Show, AC Cab throughout",
        "badge": "Best Seller"
    }
]

# 2. Cabs, Rentals & Mobility Fleet
mobility_vehicles = [
    # Cabs
    {"id": "cab-mini", "category": "Cab", "service": "City / Outstation Cab", "name": "Mini / Hatchback (WagonR / Tiago)", 
     "capacity": "4 Passengers + 2 Bags", "base_fare": 450, "rate_per_km": 11, "hourly_rate": 180, "image": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80",
     "features": "AC, GPS Tracking, Verified Driver, Clean Interior", "rating": 4.8},
    {"id": "cab-sedan", "category": "Cab", "service": "City / Airport / Outstation", "name": "Prime Sedan (Dzire / Etios)", 
     "capacity": "4 Passengers + 3 Bags", "base_fare": 650, "rate_per_km": 14, "hourly_rate": 240, "image": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80",
     "features": "Spacious Boot, Top Rated Chauffeur, Highway Fastag", "rating": 4.9},
    {"id": "cab-suv", "category": "Cab", "service": "Family / Mountain / Outstation", "name": "SUV (Innova Crysta / Ertiga)", 
     "capacity": "6-7 Passengers + 5 Bags", "base_fare": 1100, "rate_per_km": 18, "hourly_rate": 350, "image": "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80",
     "features": "Captain Seats, Rear AC, Extra Legroom, Hill Driver Expert", "rating": 4.94},
    {"id": "cab-tempo", "category": "Cab", "service": "Group Travel / Pilgrimage", "name": "Tempo Traveller (12/17-Seater)", 
     "capacity": "12-17 Passengers + 12 Bags", "base_fare": 2200, "rate_per_km": 24, "hourly_rate": 550, "image": "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=600&q=80",
     "features": "Reclining Pushback Seats, Sound System, Luggage Carrier", "rating": 4.85},

    # Self-Drive Car Rentals
    {"id": "rental-swift", "category": "Self-Drive Car", "service": "Self-Drive Rental", "name": "Maruti Swift / Baleno", 
     "capacity": "5 Seater Petrol/CNG", "base_fare": 1400, "rate_per_km": 0, "hourly_rate": 90, "image": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80",
     "features": "Zero Security Deposit Option, Unlimited KMs, Manual/Automatic", "rating": 4.75},
    {"id": "rental-thar", "category": "Self-Drive Car", "service": "Self-Drive Rental", "name": "Mahindra Thar 4x4 / Creta", 
     "capacity": "4-5 Seater 4WD Diesel", "base_fare": 3200, "rate_per_km": 0, "hourly_rate": 190, "image": "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80",
     "features": "Off-road Capable, Convertible Roof, Apple CarPlay, Comprehensive Insurance", "rating": 4.95},
    {"id": "rental-ev", "category": "Self-Drive Car", "service": "Self-Drive Rental", "name": "Tata Nexon EV Max", 
     "capacity": "5 Seater Electric (400km Range)", "base_fare": 2400, "rate_per_km": 0, "hourly_rate": 140, "image": "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80",
     "features": "Zero Fuel Cost (Free Fast Charging), Automatic, Eco Friendly", "rating": 4.88},

    # Bike & Scooter Rentals
    {"id": "bike-activa", "category": "Bike Rental", "service": "Two-Wheeler Rental", "name": "Honda Activa 6G / Jupiter", 
     "capacity": "2 Riders (Helmet Included)", "base_fare": 450, "rate_per_km": 0, "hourly_rate": 45, "image": "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80",
     "features": "Includes 2 Helmets, Mobile Holder, Full Tank Option", "rating": 4.8},
    {"id": "bike-enfield", "category": "Bike Rental", "service": "Two-Wheeler Rental", "name": "Royal Enfield Classic 350", 
     "capacity": "2 Riders (Touring Seat)", "base_fare": 1100, "rate_per_km": 0, "hourly_rate": 95, "image": "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80",
     "features": "Luggage Saddle Bags, Crash Guard, USB Charger, Ladakh Ready", "rating": 4.92},
    {"id": "bike-himalayan", "category": "Bike Rental", "service": "Two-Wheeler Rental", "name": "Royal Enfield Himalayan 450", 
     "capacity": "Adventure Tourer", "base_fare": 1500, "rate_per_km": 0, "hourly_rate": 130, "image": "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80",
     "features": "Long Travel Suspension, Dual Channel ABS, Tripper Navigation, Panniers", "rating": 4.96}
]

# 3. Sightseeing Tours
tours = [
    {
        "id": "tour-dubai-desert",
        "title": "VIP Dubai Desert Safari with Dune Bashing, Quad Bike & BBQ",
        "city": "Dubai",
        "duration": "6 Hours (3:00 PM – 9:30 PM)",
        "price_inr": 3400,
        "rating": 4.94,
        "reviews": 4200,
        "image": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
        "highlights": "4x4 Land Cruiser Dune Bashing, Camel Ride, Sandboarding, Tanoura & Fire Show, Buffet Dinner"
    },
    {
        "id": "tour-kolkata-heritage",
        "title": "Kolkata Colonial Heritage & River Hooghly Cruise Tour",
        "city": "Kolkata",
        "duration": "Full Day (8 Hours)",
        "price_inr": 1800,
        "rating": 4.85,
        "reviews": 1100,
        "image": "https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=800&q=80",
        "highlights": "Victoria Memorial, St. Pauls Cathedral, Princep Ghat Cruise, College Street Coffee House, Tram Ride"
    },
    {
        "id": "tour-kashmir-shikara",
        "title": "Dal Lake Sunset Shikara Ride & Floating Vegetable Market",
        "city": "Srinagar",
        "duration": "3 Hours",
        "price_inr": 1200,
        "rating": 4.98,
        "reviews": 2800,
        "image": "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=800&q=80",
        "highlights": "Handcrafted Shikara Boat, Chinar Island View, Floating Flower & Kashmiri Saffron Bazar, Kahwa Onboard"
    },
    {
        "id": "tour-dhanbad-dam",
        "title": "Maithon & Panchet Dam Scenic Lake Boating & Temple Tour",
        "city": "Dhanbad",
        "duration": "5 Hours",
        "price_inr": 950,
        "rating": 4.65,
        "reviews": 450,
        "image": "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80",
        "highlights": "Speedboat at Maithon Lake, Kalyaneshwari Mandir Darshan, Sunset Viewpoint, Dam Hydro View"
    }
]

with open("datasets/holiday_packages.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=list(packages[0].keys()))
    writer.writeheader()
    writer.writerows(packages)

with open("datasets/cabs_and_rentals.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=list(mobility_vehicles[0].keys()))
    writer.writeheader()
    writer.writerows(mobility_vehicles)

with open("datasets/sightseeing_tours.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=list(tours[0].keys()))
    writer.writeheader()
    writer.writerows(tours)

print("[OK] Generated holiday_packages.csv, cabs_and_rentals.csv, sightseeing_tours.csv successfully.")
