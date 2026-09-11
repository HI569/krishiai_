
from fastapi import APIRouter, HTTPException
from location_data import search_locations, nearest_location
from weather_cache import fetch_weather
router = APIRouter()

INDIAN_LOCATIONS = [
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
]


def clamp(value, minimum=0, maximum=100):
    return max(minimum, min(maximum, value))


def risk_level(score):
    if score >= 70:
        return "HIGH"
    if score >= 40:
        return "MODERATE"
    return "LOW"


def build_risk(score, reasons, actions):
    return {
        "score": round(clamp(score), 1),
        "level": risk_level(score),
        "reasons": reasons,
        "actions": actions,
    }


@router.get("/search")
async def search_location(query: str):
    query = query.strip()

    if not query:
        raise HTTPException(
            status_code=400,
            detail="Please enter a location name."
        )

    return {
        "success": True,
        "results": search_locations(query, limit=20)
    }
    query = query.strip().lower()

    if not query:
        raise HTTPException(
            status_code=400,
            detail="Please enter a location name."
        )

    results = []

    for location in INDIAN_LOCATIONS:
        searchable = (
            f"{location['name']} "
            f"{location['state']} "
            f"{location['country']}"
        ).lower()

        if query in searchable:
            results.append(location)

    return {
        "success": True,
        "results": results
    }


@router.get("/location")
async def reverse_location(lat: float, lon: float):

    if not (-90 <= lat <= 90):
        raise HTTPException(
            status_code=400,
            detail="Invalid latitude."
        )

    if not (-180 <= lon <= 180):
        raise HTTPException(
            status_code=400,
            detail="Invalid longitude."
        )

    nearest = nearest_location(lat, lon)

    city = nearest.get("name", "")
    state = nearest.get("state", "")
    country = nearest.get("country", "India")

    # Clean display name
    parts = [
        part.strip()
        for part in [city, state, country]
        if part and part.strip()
    ]

    display_name = ", ".join(parts)

    return {
        "success": True,
        "latitude": lat,
        "longitude": lon,
        "location": display_name,
        "city": city,
        "state": state,
        "country": country,
        "display_name": display_name
    }

@router.get("/predict")
async def predict_disaster(lat: float, lon: float):
    if not (-90 <= lat <= 90):
        raise HTTPException(status_code=400, detail="Invalid latitude.")

    if not (-180 <= lon <= 180):
        raise HTTPException(status_code=400, detail="Invalid longitude.")

    result = await fetch_weather(lat, lon)

    if not result["success"]:
        raise HTTPException(
            status_code=502,
            detail=f"Weather service unavailable: {result['error']}"
        )

    data = result["data"]

    current = data.get("current", {})
    daily = data.get("daily", {})

    temperature = float(current.get("temperature_2m") or 0)
    humidity = float(current.get("relative_humidity_2m") or 0)
    precipitation = float(current.get("precipitation") or 0)
    rain = float(current.get("rain") or 0)
    wind = float(current.get("wind_speed_10m") or 0)

    max_temp = [
        float(x or 0)
        for x in daily.get("temperature_2m_max", [])
    ]

    min_temp = [
        float(x or 0)
        for x in daily.get("temperature_2m_min", [])
    ]

    rainfall = [
        float(x or 0)
        for x in daily.get("precipitation_sum", [])
    ]

    max_wind = [
        float(x or 0)
        for x in daily.get("wind_speed_10m_max", [])
    ]

    total_rainfall = sum(rainfall)
    highest_temp = max(max_temp) if max_temp else temperature
    lowest_temp = min(min_temp) if min_temp else temperature
    highest_wind = max(max_wind) if max_wind else wind

    # FLOOD
    flood_score = 0
    flood_reasons = []

    if total_rainfall >= 150:
        flood_score = 90
        flood_reasons.append(
            f"Very high rainfall forecast: {total_rainfall:.1f} mm."
        )
    elif total_rainfall >= 100:
        flood_score = 75
        flood_reasons.append(
            f"Heavy rainfall forecast: {total_rainfall:.1f} mm."
        )
    elif total_rainfall >= 60:
        flood_score = 50
        flood_reasons.append(
            f"Moderate rainfall forecast: {total_rainfall:.1f} mm."
        )
    elif total_rainfall >= 30:
        flood_score = 25
        flood_reasons.append(
            f"Some rainfall forecast: {total_rainfall:.1f} mm."
        )
    else:
        flood_reasons.append(
            "No major rainfall accumulation forecast."
        )

    if precipitation >= 20 or rain >= 20:
        flood_score += 20
        flood_reasons.append(
            "Significant rainfall is occurring currently."
        )

    flood = build_risk(
        flood_score,
        flood_reasons,
        [
            "Check field drainage.",
            "Avoid unnecessary irrigation during heavy rain.",
            "Move equipment and harvested crops to safer areas.",
            "Monitor local flood warnings."
        ]
    )

    # DROUGHT
    drought_score = 0
    drought_reasons = []

    if total_rainfall < 10:
        drought_score += 50
        drought_reasons.append(
            "Very little rainfall is forecast."
        )
    elif total_rainfall < 25:
        drought_score += 30
        drought_reasons.append(
            "Low rainfall is forecast."
        )

    if highest_temp >= 40:
        drought_score += 35
        drought_reasons.append(
            f"Very high temperatures up to {highest_temp:.1f}°C."
        )
    elif highest_temp >= 35:
        drought_score += 20
        drought_reasons.append(
            f"High temperatures up to {highest_temp:.1f}°C."
        )

    if humidity < 35:
        drought_score += 20
        drought_reasons.append(
            f"Low current humidity: {humidity:.0f}%."
        )

    if not drought_reasons:
        drought_reasons.append(
            "No strong short-term drought signal detected."
        )

    drought = build_risk(
        drought_score,
        drought_reasons,
        [
            "Use irrigation efficiently.",
            "Check soil moisture before irrigation.",
            "Use mulch to reduce water loss.",
            "Monitor crops for moisture stress."
        ]
    )

    # HEATWAVE
    if highest_temp >= 45:
        heat_score = 95
        heat_reasons = [
            f"Extreme heat forecast up to {highest_temp:.1f}°C."
        ]
    elif highest_temp >= 42:
        heat_score = 80
        heat_reasons = [
            f"Severe heat forecast up to {highest_temp:.1f}°C."
        ]
    elif highest_temp >= 40:
        heat_score = 65
        heat_reasons = [
            f"Very high temperature forecast up to {highest_temp:.1f}°C."
        ]
    elif highest_temp >= 37:
        heat_score = 45
        heat_reasons = [
            f"High temperature forecast up to {highest_temp:.1f}°C."
        ]
    else:
        heat_score = 0
        heat_reasons = [
            "No significant heatwave signal detected."
        ]

    heatwave = build_risk(
        heat_score,
        heat_reasons,
        [
            "Irrigate during cooler parts of the day.",
            "Protect sensitive crops from direct heat.",
            "Monitor plants for heat stress.",
            "Provide shade where appropriate."
        ]
    )

    # STRONG WIND
    if highest_wind >= 80:
        wind_score = 95
    elif highest_wind >= 60:
        wind_score = 75
    elif highest_wind >= 40:
        wind_score = 50
    elif highest_wind >= 25:
        wind_score = 25
    else:
        wind_score = 0

    if wind_score:
        wind_reasons = [
            f"Maximum forecast wind: {highest_wind:.1f} km/h."
        ]
    else:
        wind_reasons = [
            "No significant strong-wind signal detected."
        ]

    wind_risk = build_risk(
        wind_score,
        wind_reasons,
        [
            "Secure loose farm equipment.",
            "Support young or tall plants.",
            "Check greenhouse and shade structures.",
            "Avoid spraying during strong winds."
        ]
    )

    # FROST
    if lowest_temp <= 0:
        frost_score = 90
    elif lowest_temp <= 5:
        frost_score = 65
    elif lowest_temp <= 10:
        frost_score = 30
    else:
        frost_score = 0

    if frost_score:
        frost_reasons = [
            f"Lowest forecast temperature: {lowest_temp:.1f}°C."
        ]
    else:
        frost_reasons = [
            "No significant frost signal detected."
        ]

    frost = build_risk(
        frost_score,
        frost_reasons,
        [
            "Protect frost-sensitive crops.",
            "Monitor overnight temperatures.",
            "Use suitable crop covers.",
            "Protect sensitive seedlings."
        ]
    )

    risks = {
        "flood": flood,
        "drought": drought,
        "heatwave": heatwave,
        "strong_wind": wind_risk,
        "frost": frost
    }

    overall_score = max(
        risk["score"] for risk in risks.values()
    )

    highest_risks = [
        name
        for name, risk in risks.items()
        if risk["score"] == overall_score
    ]

    return {
        "success": True,
        "location": {
            "latitude": lat,
            "longitude": lon,
            "timezone": data.get("timezone"),
            "elevation": data.get("elevation")
        },
        "overall": {
            "score": round(overall_score, 1),
            "level": risk_level(overall_score),
            "highest_risks": highest_risks
        },
        "risks": risks,
        "current_weather": {
            "temperature": temperature,
            "humidity": humidity,
            "precipitation": precipitation,
            "rain": rain,
            "wind_speed": wind,
            "weather_code": current.get("weather_code")
        },
        "forecast": {
            "dates": daily.get("time", []),
            "max_temperature": max_temp,
            "min_temperature": min_temp,
            "rainfall": rainfall,
            "max_wind": max_wind
        },
        "model": "KrishiAI Weather Risk Engine",
        "data_source": "wttr.in / Open-Meteo",
        "warning": (
            "This is a weather-based risk estimate for early warning. "
            "It is not a guaranteed prediction of a disaster."
        )
    }
