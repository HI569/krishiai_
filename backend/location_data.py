import json
from pathlib import Path

DATA_FILE = Path(__file__).parent / "data" / "india_locations.json"

with open(DATA_FILE, "r", encoding="utf-8") as f:
    INDIA_LOCATIONS = json.load(f)


def search_locations(query: str, limit: int = 20):
    query = query.strip().lower()

    if not query:
        return []

    exact = []
    starts = []
    contains = []

    for location in INDIA_LOCATIONS:
        name = location["name"].lower()
        state = location["state"].lower()

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
            location["state"],
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
    return min(
        INDIA_LOCATIONS,
        key=lambda location:
        (lat - location["latitude"]) ** 2 +
        (lon - location["longitude"]) ** 2
    )