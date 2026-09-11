import json
from pathlib import Path

DATA_FILE = Path(__file__).parent / "data" / "india_locations.json"

DEFAULT_LOCATIONS = [
    {"name": "Ludhiana", "state": "Punjab", "country": "India", "latitude": 30.9010, "longitude": 75.8573},
    {"name": "Amritsar", "state": "Punjab", "country": "India", "latitude": 31.6340, "longitude": 74.8723},
    {"name": "Patiala", "state": "Punjab", "country": "India", "latitude": 30.3398, "longitude": 76.3869},
    {"name": "Jalandhar", "state": "Punjab", "country": "India", "latitude": 31.3260, "longitude": 75.5762},
    {"name": "Bathinda", "state": "Punjab", "country": "India", "latitude": 30.2110, "longitude": 74.9455},
    {"name": "Delhi", "state": "Delhi", "country": "India", "latitude": 28.6139, "longitude": 77.2090},
    {"name": "Chandigarh", "state": "Chandigarh", "country": "India", "latitude": 30.7333, "longitude": 76.7794},
    {"name": "Jaipur", "state": "Rajasthan", "country": "India", "latitude": 26.9124, "longitude": 75.7873},
    {"name": "Lucknow", "state": "Uttar Pradesh", "country": "India", "latitude": 26.8467, "longitude": 80.9462},
    {"name": "Kanpur", "state": "Uttar Pradesh", "country": "India", "latitude": 26.4499, "longitude": 80.3319},
    {"name": "Mumbai", "state": "Maharashtra", "country": "India", "latitude": 19.0760, "longitude": 72.8777},
    {"name": "Pune", "state": "Maharashtra", "country": "India", "latitude": 18.5204, "longitude": 73.8567},
    {"name": "Nagpur", "state": "Maharashtra", "country": "India", "latitude": 21.1458, "longitude": 79.0882},
    {"name": "Bengaluru", "state": "Karnataka", "country": "India", "latitude": 12.9716, "longitude": 77.5946},
    {"name": "Hyderabad", "state": "Telangana", "country": "India", "latitude": 17.3850, "longitude": 78.4867},
    {"name": "Chennai", "state": "Tamil Nadu", "country": "India", "latitude": 13.0827, "longitude": 80.2707},
    {"name": "Kolkata", "state": "West Bengal", "country": "India", "latitude": 22.5726, "longitude": 88.3639},
    {"name": "Bhopal", "state": "Madhya Pradesh", "country": "India", "latitude": 23.2599, "longitude": 77.4126},
    {"name": "Ahmedabad", "state": "Gujarat", "country": "India", "latitude": 23.0225, "longitude": 72.5714},
    {"name": "Bhubaneswar", "state": "Odisha", "country": "India", "latitude": 20.2961, "longitude": 85.8245},
    {"name": "Guwahati", "state": "Assam", "country": "India", "latitude": 26.1445, "longitude": 91.7362},
    {"name": "Patna", "state": "Bihar", "country": "India", "latitude": 25.5941, "longitude": 85.1376},
    {"name": "Karnal", "state": "Haryana", "country": "India", "latitude": 29.6857, "longitude": 76.9905},
    {"name": "Indore", "state": "Madhya Pradesh", "country": "India", "latitude": 22.7196, "longitude": 75.8577},
    {"name": "Nashik", "state": "Maharashtra", "country": "India", "latitude": 19.9975, "longitude": 73.7898}
]

INDIA_LOCATIONS = None

def get_locations():
    global INDIA_LOCATIONS
    if INDIA_LOCATIONS is None:
        try:
            if DATA_FILE.exists():
                with open(DATA_FILE, "r", encoding="utf-8") as f:
                    INDIA_LOCATIONS = json.load(f)
            else:
                INDIA_LOCATIONS = DEFAULT_LOCATIONS
        except Exception:
            INDIA_LOCATIONS = DEFAULT_LOCATIONS
    return INDIA_LOCATIONS


def search_locations(query: str, limit: int = 20):
    query = query.strip().lower()

    if not query:
        return []

    locations = get_locations()
    exact = []
    starts = []
    contains = []

    for location in locations:
        name = location["name"].lower()
        state = location.get("state", "").lower()

        if name == query:
            exact.append(location)
        elif name.startswith(query):
            starts.append(location)
        elif query in name or query in state:
            contains.append(location)

    results = exact + starts + contains

    # Remove duplicates while preserving ranking
    unique = []
    seen = set()

    for location in results:
        key = (
            location["name"],
            location.get("state", ""),
            location["latitude"],
            location["longitude"]
        )

        if key not in seen:
            seen.add(key)
            unique.append(location)

        if len(unique) >= limit:
            break

    return unique


def nearest_location(lat: float, lon: float):
    locations = get_locations()
    return min(
        locations,
        key=lambda location:
        (lat - location["latitude"]) ** 2 +
        (lon - location["longitude"]) ** 2
    )