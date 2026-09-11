import csv
import json
from pathlib import Path

BASE = Path(__file__).parent
DATA = BASE / "data"

# -----------------------------------------
# Load Indian state names
# -----------------------------------------

admin1 = {}

with open(DATA / "admin1CodesASCII.txt", encoding="utf-8") as f:
    for line in f:
        parts = line.rstrip("\n").split("\t")

        if len(parts) >= 2 and parts[0].startswith("IN."):
            admin1[parts[0]] = parts[1]

# -----------------------------------------
# Read GeoNames India data
# -----------------------------------------

locations = []

with open(DATA / "india" / "IN.txt", encoding="utf-8") as f:
    reader = csv.reader(f, delimiter="\t")

    for row in reader:

        if len(row) < 19:
            continue

        # GeoNames columns:
        # row[0]  = geonameid
        # row[1]  = name
        # row[2]  = asciiname
        # row[3]  = alternate names
        # row[4]  = latitude
        # row[5]  = longitude
        # row[6]  = feature class
        # row[7]  = feature code
        # row[8]  = country code
        # row[9]  = country code 2
        # row[10] = admin1 code
        # row[11] = admin2 code
        # row[12] = admin3 code
        # row[13] = admin4 code
        # row[14] = population
        # row[15] = elevation
        # row[16] = DEM
        # row[17] = timezone
        # row[18] = modification date

        # Keep populated places
        if row[6] != "P":
            continue

        name = row[1].strip()

        if not name:
            continue

        # IMPORTANT:
        # Admin1/state code is row[10], NOT row[9]
        admin1_code = row[10].strip()

        admin_code = ""

        if admin1_code:
            admin_code = f"IN.{admin1_code}"

        state = admin1.get(admin_code, admin1_code)

        try:
            latitude = float(row[4])
            longitude = float(row[5])
        except ValueError:
            continue

        try:
            population = int(row[14] or 0)
        except ValueError:
            population = 0

        locations.append({
            "name": name,
            "state": state,
            "country": "India",
            "latitude": latitude,
            "longitude": longitude,
            "population": population
        })

# -----------------------------------------
# Sort locations
# -----------------------------------------

locations.sort(
    key=lambda x: (-x["population"], x["name"].lower())
)

# -----------------------------------------
# Save JSON database
# -----------------------------------------

output = DATA / "india_locations.json"

with open(output, "w", encoding="utf-8") as f:
    json.dump(
        locations,
        f,
        ensure_ascii=False
    )

print("------------------------------------")
print("India location database created")
print("------------------------------------")
print(f"Created: {output}")
print(f"Locations: {len(locations)}")

# -----------------------------------------
# Verify Ludhiana
# -----------------------------------------

ludhiana = [
    location
    for location in locations
    if location["name"].lower() == "ludhiana"
]

if ludhiana:
    print("\nLudhiana verification:")

    for location in ludhiana[:5]:
        print(
            f"  {location['name']}, "
            f"{location['state']}, "
            f"{location['country']}"
        )
else:
    print("\nLudhiana was not found.")