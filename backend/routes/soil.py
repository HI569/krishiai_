from fastapi import APIRouter, HTTPException
from weather_cache import fetch_soil_weather

router = APIRouter()


@router.get("/analyze")
async def analyze_soil(lat: float, lon: float):
    """
    Get live weather and modelled soil conditions
    for the supplied GPS coordinates.
    """

    if not (-90 <= lat <= 90):
        raise HTTPException(status_code=400, detail="Invalid latitude")

    if not (-180 <= lon <= 180):
        raise HTTPException(status_code=400, detail="Invalid longitude")

    result = await fetch_soil_weather(lat, lon)

    if not result["success"]:
        raise HTTPException(
            status_code=502,
            detail=f"Weather service unavailable: {result['error']}"
        )

    data = result["data"]

    return {
        "success": True,
        "location": {
            "latitude": lat,
            "longitude": lon,
            "timezone": data.get("timezone"),
            "elevation": data.get("elevation"),
        },
        "current": data.get("current", {}),
        "daily": data.get("daily", {}),
        "soil": {
            "soil_temperature_0cm":
                data.get("current", {}).get("soil_temperature_0cm"),

            "soil_temperature_6cm":
                data.get("current", {}).get("soil_temperature_6cm"),

            "soil_temperature_18cm":
                data.get("current", {}).get("soil_temperature_18cm"),

            "soil_temperature_54cm":
                data.get("current", {}).get("soil_temperature_54cm"),

            "soil_moisture_0_to_1cm":
                data.get("current", {}).get("soil_moisture_0_to_1cm"),

            "soil_moisture_1_to_3cm":
                data.get("current", {}).get("soil_moisture_1_to_3cm"),

            "soil_moisture_3_to_9cm":
                data.get("current", {}).get("soil_moisture_3_to_9cm"),

            "soil_moisture_9_to_27cm":
                data.get("current", {}).get("soil_moisture_9_to_27cm"),

            "soil_moisture_27_to_81cm":
                data.get("current", {}).get("soil_moisture_27_to_81cm"),
        },

        # Important:
        # These are NOT fake measurements.
        # They are deliberately marked unavailable until
        # SoilGrids/WCS is connected.
        "mapped_soil": {
            "status": "not_connected",
            "message":
                "Mapped soil properties require a SoilGrids/WCS query.",
            "ph": None,
            "sand": None,
            "silt": None,
            "clay": None,
            "organic_carbon": None,
        }
    }