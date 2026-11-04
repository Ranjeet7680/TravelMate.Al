import csv
import os

os.makedirs("datasets", exist_ok=True)

# 1. Comprehensive Destinations Dataset
destinations = [
    # Jharkhand (Local)
    {"id": "dest-dhanbad", "city": "Dhanbad", "state": "Jharkhand", "country": "India", "region": "India", "type": "City", 
     "tag": "Coal Capital & Heritage", "daily_budget": 1800, "best_season": "Oct - Mar", "distance_dhanbad": 0, "rating": 4.5, "reviews": 1280,
     "image": "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80",
     "highlights": "Topchanchi Lake, Maithon Dam, Bhatinda Falls, Birsa Munda Park", "cuisine": "Litti Chokha, Dhuska, Thekua", "visa": "Not Required"},
    {"id": "dest-ranchi", "city": "Ranchi", "state": "Jharkhand", "country": "India", "region": "India", "type": "Nature",
     "tag": "City of Waterfalls", "daily_budget": 2400, "best_season": "Sep - Mar", "distance_dhanbad": 150, "rating": 4.6, "reviews": 2150,
     "image": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
     "highlights": "Hundru Falls, Jonha Falls, Dassam Falls, Tagor Hill, Rock Garden", "cuisine": "Dhuska with Ghugni, Arsa Roti, Chhena Jalebi", "visa": "Not Required"},
    {"id": "dest-deoghar", "city": "Deoghar", "state": "Jharkhand", "country": "India", "region": "India", "type": "Religious",
     "tag": "Baidyanath Jyotirlinga Shrine", "daily_budget": 1600, "best_season": "Oct - Mar", "distance_dhanbad": 115, "rating": 4.8, "reviews": 3400,
     "image": "https://images.unsplash.com/photo-1600100397608-f010e42f9e42?auto=format&fit=crop&w=800&q=80",
     "highlights": "Baba Baidyanath Temple, Trikut Pahar Ropeway, Naulakha Mandir, Tapovan", "cuisine": "Peda, Belgrami, Tilkut", "visa": "Not Required"},
    {"id": "dest-netarhat", "city": "Netarhat", "state": "Jharkhand", "country": "India", "region": "India", "type": "Hill Station",
     "tag": "Queen of Chotanagpur", "daily_budget": 2200, "best_season": "Oct - Apr", "distance_dhanbad": 290, "rating": 4.7, "reviews": 980,
     "image": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
     "highlights": "Magnolia Sunset Point, Upper Ghaghri Falls, Koel View Point, Pine Forest", "cuisine": "Organic Hill Millets, Bamboo Shoot Curry", "visa": "Not Required"},
    {"id": "dest-betla", "city": "Betla National Park", "state": "Jharkhand", "country": "India", "region": "India", "type": "Adventure",
     "tag": "Tiger Reserve & Forest Safari", "daily_budget": 2500, "best_season": "Nov - May", "distance_dhanbad": 310, "rating": 4.6, "reviews": 1420,
     "image": "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=800&q=80",
     "highlights": "Elephant & Tiger Safari, Palamu Fort Ruins, Mirchaiya Falls, Lodh Falls", "cuisine": "Tribal Thali, Roasted Mutton, Mahua Delicacies", "visa": "Not Required"},
    {"id": "dest-jamshedpur", "city": "Jamshedpur", "state": "Jharkhand", "country": "India", "region": "India", "type": "City",
     "tag": "Steel City & Lake Parks", "daily_budget": 2200, "best_season": "Oct - Mar", "distance_dhanbad": 135, "rating": 4.5, "reviews": 1850,
     "image": "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80",
     "highlights": "Jubilee Park, Dalma Wildlife Sanctuary, Dimna Lake, Tata Steel Zoological Park", "cuisine": "Mutton Biryani, Kebab Rolls, Bengali Sweets", "visa": "Not Required"},

    # West Bengal
    {"id": "dest-kolkata", "city": "Kolkata", "state": "West Bengal", "country": "India", "region": "India", "type": "Culture",
     "tag": "City of Joy & Heritage", "daily_budget": 2800, "best_season": "Oct - Mar", "distance_dhanbad": 270, "rating": 4.8, "reviews": 9800,
     "image": "https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=800&q=80",
     "highlights": "Victoria Memorial, Howrah Bridge, Dakshineswar Kali Temple, Park Street", "cuisine": "Kolkata Biryani, Kathi Roll, Rosogolla, Mishti Doi", "visa": "Not Required"},
    {"id": "dest-darjeeling", "city": "Darjeeling", "state": "West Bengal", "country": "India", "region": "India", "type": "Hill Station",
     "tag": "Queen of the Hills & Tea Gardens", "daily_budget": 3500, "best_season": "Mar - Jun & Sep - Dec", "distance_dhanbad": 580, "rating": 4.9, "reviews": 8450,
     "image": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
     "highlights": "Tiger Hill Sunrise over Kanchenjunga, Himalayan Toy Train, Batasia Loop, Happy Valley Tea", "cuisine": "Thukpa, Momos, Churpee, Darjeeling First Flush Tea", "visa": "Not Required"},
    {"id": "dest-digha", "city": "Digha", "state": "West Bengal", "country": "India", "region": "India", "type": "Beach",
     "tag": "Coastal Bay of Bengal Getaway", "daily_budget": 2000, "best_season": "Oct - Mar", "distance_dhanbad": 380, "rating": 4.4, "reviews": 3200,
     "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
     "highlights": "New Digha Sea Beach, Marine Aquarium, Shankarpur Harbor, Casuarina Groves", "cuisine": "Fried Pomfret, Ilish Fish Curry, Crab Masala", "visa": "Not Required"},

    # Bihar
    {"id": "dest-bodhgaya", "city": "Bodh Gaya", "state": "Bihar", "country": "India", "region": "India", "type": "Religious",
     "tag": "Birthplace of Buddhism & UNESCO World Heritage", "daily_budget": 2200, "best_season": "Oct - Mar", "distance_dhanbad": 195, "rating": 4.9, "reviews": 6120,
     "image": "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=800&q=80",
     "highlights": "Mahabodhi Temple, Bodhi Tree, Great Buddha Statue, International Monasteries", "cuisine": "Tibetan Momos, Magahi Litti, Khaja", "visa": "Not Required"},
    {"id": "dest-rajgir", "city": "Rajgir & Nalanda", "state": "Bihar", "country": "India", "region": "India", "type": "Culture",
     "tag": "Ancient University & Hot Springs", "daily_budget": 2100, "best_season": "Oct - Mar", "distance_dhanbad": 170, "rating": 4.7, "reviews": 2940,
     "image": "https://images.unsplash.com/photo-1600100397608-f010e42f9e42?auto=format&fit=crop&w=800&q=80",
     "highlights": "Nalanda University Ruins, Vishwa Shanti Stupa, Vulture's Peak, Rajgir Glass Bridge", "cuisine": "Silao Ka Khaja, Litti Mutton", "visa": "Not Required"},

    # Uttar Pradesh
    {"id": "dest-varanasi", "city": "Varanasi", "state": "Uttar Pradesh", "country": "India", "region": "India", "type": "Religious",
     "tag": "Spiritual Capital of India", "daily_budget": 2500, "best_season": "Oct - Mar", "distance_dhanbad": 420, "rating": 4.95, "reviews": 12400,
     "image": "https://images.unsplash.com/photo-1561359313-0639aad49ca6?auto=format&fit=crop&w=800&q=80",
     "highlights": "Dashashwamedh Ghat Evening Ganga Aarti, Kashi Vishwanath Temple, Sarnath, Boat Ride at Sunrise", "cuisine": "Banarasi Kachori Jalebi, Malaiyo, Banarasi Paan", "visa": "Not Required"},
    {"id": "dest-agra", "city": "Agra", "state": "Uttar Pradesh", "country": "India", "region": "India", "type": "Culture",
     "tag": "Wonder of the World", "daily_budget": 3200, "best_season": "Oct - Mar", "distance_dhanbad": 890, "rating": 4.9, "reviews": 15800,
     "image": "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80",
     "highlights": "Taj Mahal, Agra Fort, Fatehpur Sikri, Mehtab Bagh", "cuisine": "Agra Petha, Bedmi Puri, Mughlai Mutton Korma", "visa": "Not Required"},
    {"id": "dest-ayodhya", "city": "Ayodhya", "state": "Uttar Pradesh", "country": "India", "region": "India", "type": "Religious",
     "tag": "Sacred Ram Janmabhoomi", "daily_budget": 2400, "best_season": "Oct - Mar", "distance_dhanbad": 540, "rating": 4.9, "reviews": 8900,
     "image": "https://images.unsplash.com/photo-1600100397608-f010e42f9e42?auto=format&fit=crop&w=800&q=80",
     "highlights": "Shri Ram Janmabhoomi Mandir, Hanuman Garhi, Saryu River Aarti, Kanak Bhawan", "cuisine": "Ramdana Ladoo, Peda, Bedmi Jalebi", "visa": "Not Required"},

    # Delhi
    {"id": "dest-delhi", "city": "New Delhi", "state": "Delhi", "country": "India", "region": "India", "type": "City",
     "tag": "Capital of Empires", "daily_budget": 3500, "best_season": "Oct - Mar", "distance_dhanbad": 1150, "rating": 4.8, "reviews": 14200,
     "image": "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80",
     "highlights": "Red Fort, Qutub Minar, India Gate, Humayun's Tomb, Chandni Chowk", "cuisine": "Butter Chicken, Chole Bhature, Dahi Bhalla, Parathas", "visa": "Not Required"},

    # Rajasthan
    {"id": "dest-jaipur", "city": "Jaipur", "state": "Rajasthan", "country": "India", "region": "India", "type": "Culture",
     "tag": "The Regal Pink City", "daily_budget": 3400, "best_season": "Oct - Mar", "distance_dhanbad": 1280, "rating": 4.88, "reviews": 11600,
     "image": "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80",
     "highlights": "Hawa Mahal, Amber Fort, City Palace, Jantar Mantar, Nahargarh Fort", "cuisine": "Dal Baati Churma, Ghevar, Pyaaz Kachori, Laal Maas", "visa": "Not Required"},
    {"id": "dest-udaipur", "city": "Udaipur", "state": "Rajasthan", "country": "India", "region": "India", "type": "Luxury",
     "tag": "City of Lakes & Palaces", "daily_budget": 4200, "best_season": "Sep - Mar", "distance_dhanbad": 1520, "rating": 4.92, "reviews": 9400,
     "image": "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=800&q=80",
     "highlights": "City Palace, Lake Pichola Boat Cruise, Jag Mandir, Saheliyon Ki Bari", "cuisine": "Gatte Ki Sabzi, Ker Sangri, Mewari Thali", "visa": "Not Required"},

    # Goa
    {"id": "dest-goa", "city": "Goa (North & South)", "state": "Goa", "country": "India", "region": "India", "type": "Beach",
     "tag": "Sun, Sand & Portuguese Charm", "daily_budget": 4500, "best_season": "Nov - Feb", "distance_dhanbad": 1950, "rating": 4.85, "reviews": 18200,
     "image": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
     "highlights": "Baga & Calangute Beach, Dudhsagar Falls, Fort Aguada, Palolem Beach, Fontainhas", "cuisine": "Fish Curry Rice, Bebinca, Prawn Balchão, Feni", "visa": "Not Required"},

    # Kerala
    {"id": "dest-munnar", "city": "Munnar & Alleppey", "state": "Kerala", "country": "India", "region": "India", "type": "Nature",
     "tag": "God's Own Country & Backwaters", "daily_budget": 4200, "best_season": "Sep - Mar", "distance_dhanbad": 2100, "rating": 4.94, "reviews": 13900,
     "image": "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
     "highlights": "Alleppey Houseboat Cruise, Munnar Tea Estates, Eravikulam National Park, Mattupetty Dam", "cuisine": "Appam with Stew, Karimeen Pollichathu, Kerala Sadhya", "visa": "Not Required"},

    # Himachal Pradesh
    {"id": "dest-manali", "city": "Manali & Solang", "state": "Himachal Pradesh", "country": "India", "region": "India", "type": "Adventure",
     "tag": "Himalayan Snow & Valley Adventure", "daily_budget": 3800, "best_season": "All Year (Snow: Dec - Feb)", "distance_dhanbad": 1540, "rating": 4.89, "reviews": 14100,
     "image": "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80",
     "highlights": "Solang Valley Paragliding, Rohtang Pass Snow, Atal Tunnel, Hadimba Temple, Old Manali Cafes", "cuisine": "Siddu, Trout Fish, Dham, Apple Cider", "visa": "Not Required"},

    # Uttarakhand
    {"id": "dest-rishikesh", "city": "Rishikesh & Haridwar", "state": "Uttarakhand", "country": "India", "region": "India", "type": "Adventure",
     "tag": "Yoga Capital & White Water Rafting", "daily_budget": 2800, "best_season": "Sep - Jun", "distance_dhanbad": 1210, "rating": 4.87, "reviews": 10500,
     "image": "https://images.unsplash.com/photo-1600100397608-f010e42f9e42?auto=format&fit=crop&w=800&q=80",
     "highlights": "Ganges White Water Rafting, Bungee Jumping, Triveni Ghat Aarti, Lakshman Jhula, Beatles Ashram", "cuisine": "Aloo Puri, Ayurvedic Thali, Chotiwala Meals", "visa": "Not Required"},

    # Jammu & Kashmir
    {"id": "dest-kashmir", "city": "Srinagar & Gulmarg", "state": "Jammu & Kashmir", "country": "India", "region": "India", "type": "Hill Station",
     "tag": "Paradise on Earth & Ski Slopes", "daily_budget": 5200, "best_season": "Apr - Oct (Green) & Dec - Mar (Snow)", "distance_dhanbad": 1890, "rating": 4.96, "reviews": 16500,
     "image": "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=800&q=80",
     "highlights": "Dal Lake Shikara Ride, Gulmarg Gondola Cable Car, Pahalgam Betaab Valley, Mughal Gardens", "cuisine": "Kashmiri Wazwan, Rogan Josh, Kahwa Tea, Modur Pulao", "visa": "Not Required"},

    # Ladakh
    {"id": "dest-leh", "city": "Leh Ladakh", "state": "Ladakh", "country": "India", "region": "India", "type": "Adventure",
     "tag": "Land of High Passes & Blue Lakes", "daily_budget": 5800, "best_season": "May - Sep", "distance_dhanbad": 2050, "rating": 4.97, "reviews": 11200,
     "image": "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80",
     "highlights": "Pangong Tso Lake, Nubra Valley Sand Dunes & Camels, Khardung La Pass, Magnetic Hill", "cuisine": "Thukpa, Butter Tea, Skyu, Tingmo", "visa": "Not Required (Inner Line Permit for Indians)"},

    # Sikkim & Northeast
    {"id": "dest-gangtok", "city": "Gangtok & Pelling", "state": "Sikkim", "country": "India", "region": "India", "type": "Nature",
     "tag": "Monasteries & Kanchenjunga Vistas", "daily_budget": 3900, "best_season": "Mar - Jun & Oct - Dec", "distance_dhanbad": 640, "rating": 4.9, "reviews": 6800,
     "image": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
     "highlights": "Tsomgo Lake, Nathula Pass Indo-China Border, Rumtek Monastery, MG Marg", "cuisine": "Gundruk, Sel Roti, Momos, Sikkimese Noodle Soup", "visa": "Not Required (ILP for Nathula)"},
    {"id": "dest-shillong", "city": "Shillong & Cherrapunji", "state": "Meghalaya", "country": "India", "region": "India", "type": "Nature",
     "tag": "Scotland of the East & Living Root Bridges", "daily_budget": 3600, "best_season": "Sep - May", "distance_dhanbad": 820, "rating": 4.91, "reviews": 5400,
     "image": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
     "highlights": "Double Decker Living Root Bridge, Nohkalikai Falls, Dawki Umngot Crystal River, Mawlynnong", "cuisine": "Jadoh, Dohneiiong, Tungrymbai, Khasi Pineapples", "visa": "Not Required"},

    # Andaman & Nicobar
    {"id": "dest-andaman", "city": "Havelock & Port Blair", "state": "Andaman & Nicobar", "country": "India", "region": "India", "type": "Beach",
     "tag": "Turquoise Waters & Coral Reefs", "daily_budget": 6500, "best_season": "Oct - May", "distance_dhanbad": 1600, "rating": 4.93, "reviews": 8200,
     "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
     "highlights": "Radhanagar Beach (Asia's Best), Cellular Jail Light & Sound, Elephant Beach Snorkeling", "cuisine": "Fresh Grilled Lobster, Fish Amritsari, Coconut Prawns", "visa": "Not Required"},

    # International
    {"id": "dest-dubai", "city": "Dubai", "state": "Dubai", "country": "UAE", "region": "Asia", "type": "Luxury",
     "tag": "Trending Luxury & Desert", "daily_budget": 9700, "best_season": "Nov - Mar", "distance_dhanbad": 3600, "rating": 4.88, "reviews": 19400,
     "image": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
     "highlights": "Burj Khalifa, Desert Safari, The Palm Jumeirah, Dubai Mall & Fountain Show", "cuisine": "Shawarma, Mandi, Gahwa, Kunafa, Camel Burger", "visa": "eVisa (2-3 days)"},
    {"id": "dest-singapore", "city": "Singapore City", "state": "Singapore", "country": "Singapore", "region": "Asia", "type": "City",
     "tag": "Futuristic Garden City", "daily_budget": 8500, "best_season": "All Year", "distance_dhanbad": 3900, "rating": 4.85, "reviews": 14200,
     "image": "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80",
     "highlights": "Marina Bay Sands, Gardens by the Bay, Sentosa Island, Universal Studios, Jewel Changi", "cuisine": "Hainanese Chicken Rice, Chili Crab, Laksa, Satay", "visa": "e-Pass (1-2 days)"},
    {"id": "dest-bali", "city": "Bali", "state": "Bali", "country": "Indonesia", "region": "Asia", "type": "Beach",
     "tag": "Island Sanctuary & Temples", "daily_budget": 5200, "best_season": "Apr - Oct", "distance_dhanbad": 4800, "rating": 4.87, "reviews": 16800,
     "image": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
     "highlights": "Ubud Rice Terraces, Nusa Penida Kelingking, Uluwatu Cliff Temple, Kuta & Seminyak", "cuisine": "Nasi Goreng, Babi Guling, Smoothie Bowls, Luwak Coffee", "visa": "Visa on Arrival (30 days)"},
    {"id": "dest-bangkok", "city": "Bangkok & Phuket", "state": "Bangkok", "country": "Thailand", "region": "Asia", "type": "Beach",
     "tag": "Tropical Islands & Vibrant Markets", "daily_budget": 4800, "best_season": "Nov - Apr", "distance_dhanbad": 2900, "rating": 4.84, "reviews": 18900,
     "image": "https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?auto=format&fit=crop&w=800&q=80",
     "highlights": "Phi Phi Islands, Grand Palace Bangkok, Patong Beach, Floating Market, Wat Pho", "cuisine": "Pad Thai, Tom Yum Goong, Mango Sticky Rice, Green Curry", "visa": "Visa Free / VoA"},
    {"id": "dest-tokyo", "city": "Tokyo & Kyoto", "state": "Kanto", "country": "Japan", "region": "Asia", "type": "Culture",
     "tag": "Cherry Blossoms & High Tech", "daily_budget": 9800, "best_season": "Mar - May & Oct - Nov", "distance_dhanbad": 5800, "rating": 4.96, "reviews": 17400,
     "image": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80",
     "highlights": "Shibuya Crossing, Mount Fuji & Hakone, Fushimi Inari Shrine, Akihabara, Shinkansen Bullet Train", "cuisine": "Ramen, Sushi, Wagyu Beef, Matcha Parfait", "visa": "eVisa (5 days)"},
    {"id": "dest-paris", "city": "Paris", "state": "Île-de-France", "country": "France", "region": "Europe", "type": "Culture",
     "tag": "Art, Romance & Fashion", "daily_budget": 11500, "best_season": "May - Sep", "distance_dhanbad": 7200, "rating": 4.91, "reviews": 16200,
     "image": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
     "highlights": "Eiffel Tower, Louvre Museum, Notre-Dame, Arc de Triomphe, Seine River Cruise", "cuisine": "Croissants, Escargot, Duck Confit, Macarons, Bordeaux Wine", "visa": "Schengen Visa"},
    {"id": "dest-swiss", "city": "Interlaken & Lucerne", "state": "Bern", "country": "Switzerland", "region": "Europe", "type": "Hill Station",
     "tag": "Alpine Snow & Scenic Trains", "daily_budget": 14500, "best_season": "Jun - Aug & Dec - Mar", "distance_dhanbad": 6900, "rating": 4.95, "reviews": 9800,
     "image": "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80",
     "highlights": "Jungfraujoch Top of Europe, Mount Titlis Cliff Walk, Lake Lucerne, Matterhorn", "cuisine": "Cheese Fondue, Rösti, Raclette, Swiss Chocolate", "visa": "Schengen Visa"},
    {"id": "dest-london", "city": "London & Edinburgh", "state": "England", "country": "United Kingdom", "region": "Europe", "type": "City",
     "tag": "Royal Palaces & Historic Streets", "daily_budget": 12800, "best_season": "May - Sep", "distance_dhanbad": 7600, "rating": 4.88, "reviews": 13400,
     "image": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80",
     "highlights": "Big Ben, London Eye, Tower Bridge, Buckingham Palace, Edinburgh Castle", "cuisine": "Fish and Chips, English Breakfast, Afternoon Tea, Shepherd's Pie", "visa": "Standard Visitor Visa"},
    {"id": "dest-rome", "city": "Rome & Amalfi Coast", "state": "Lazio", "country": "Italy", "region": "Europe", "type": "Culture",
     "tag": "Colosseum & Mediterranean Coast", "daily_budget": 10500, "best_season": "Apr - Jun & Sep - Oct", "distance_dhanbad": 6800, "rating": 4.92, "reviews": 14800,
     "image": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80",
     "highlights": "Colosseum, Vatican City, Trevi Fountain, Positano & Amalfi Cliffs", "cuisine": "Pasta Carbonara, Neapolitan Pizza, Gelato, Tiramisu", "visa": "Schengen Visa"},
    {"id": "dest-maldives", "city": "Malé & Maafushi", "state": "Kaafu Atoll", "country": "Maldives", "region": "Asia", "type": "Beach",
     "tag": "Overwater Luxury Villas", "daily_budget": 13500, "best_season": "Nov - Apr", "distance_dhanbad": 2800, "rating": 4.97, "reviews": 11200,
     "image": "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80",
     "highlights": "Water Villa Stay, Whale Shark Snorkeling, Private Sandbank Dinner, Submarine Tour", "cuisine": "Garudhiya, Mas Huni, Fresh Yellowfin Tuna, Coconut Curries", "visa": "Free Visa on Arrival (30 days)"},
    {"id": "dest-newyork", "city": "New York City", "state": "New York", "country": "USA", "region": "Americas", "type": "City",
     "tag": "The City That Never Sleeps", "daily_budget": 15000, "best_season": "Apr - Jun & Sep - Nov", "distance_dhanbad": 12400, "rating": 4.86, "reviews": 21000,
     "image": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80",
     "highlights": "Times Square, Central Park, Statue of Liberty, Empire State Building, Broadway", "cuisine": "NY Bagels, Cheesecake, New York Style Pizza, Pastrami on Rye", "visa": "US B1/B2 Visa"}
]

with open("datasets/destinations_expanded.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=list(destinations[0].keys()))
    writer.writeheader()
    writer.writerows(destinations)

print(f"[OK] Generated datasets/destinations_expanded.csv with {len(destinations)} destinations.")
