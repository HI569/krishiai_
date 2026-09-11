from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, Dict

router = APIRouter()

CROP_PROFILES = {
    "wheat": {"name": "Wheat", "hindi_name": "गेहूं", "emoji": "🌾", "base_yield": 1.60, "temp_min": 18, "temp_max": 26, "rain_min": 450, "rain_max": 750, "price": 22750},
    "rice": {"name": "Rice / Paddy", "hindi_name": "धान", "emoji": "🌾", "base_yield": 2.20, "temp_min": 24, "temp_max": 35, "rain_min": 1000, "rain_max": 1800, "price": 23000},
    "maize": {"name": "Maize", "hindi_name": "मक्का", "emoji": "🌽", "base_yield": 2.40, "temp_min": 21, "temp_max": 30, "rain_min": 500, "rain_max": 900, "price": 20900},
    "tomato": {"name": "Tomato", "hindi_name": "टमाटर", "emoji": "🍅", "base_yield": 12.0, "temp_min": 20, "temp_max": 29, "rain_min": 600, "rain_max": 1100, "price": 15000},
    "cotton": {"name": "Cotton", "hindi_name": "कपास", "emoji": "🌱", "base_yield": 0.95, "temp_min": 25, "temp_max": 35, "rain_min": 600, "rain_max": 1000, "price": 71200},
    "potato": {"name": "Potato", "hindi_name": "आलू", "emoji": "🥔", "base_yield": 9.50, "temp_min": 15, "temp_max": 24, "rain_min": 400, "rain_max": 700, "price": 14000},
    "soybean": {"name": "Soybean", "hindi_name": "सोयाबीन", "emoji": "🌿", "base_yield": 0.90, "temp_min": 20, "temp_max": 30, "rain_min": 600, "rain_max": 1000, "price": 46000},
    "sugarcane": {"name": "Sugarcane", "hindi_name": "गन्ना", "emoji": "🎋", "base_yield": 35.0, "temp_min": 25, "temp_max": 36, "rain_min": 1200, "rain_max": 2000, "price": 3400}
}

class YieldRequest(BaseModel):
    crop: str = "wheat"
    farm_area: float = 2.5
    soil_condition: str = "loamy"
    irrigation_type: str = "tubewell"
    fertilizer_level: str = "balanced"
    temperature: float = 24.0
    rainfall: float = 650.0
    interventions: Optional[Dict[str, bool]] = None

@router.get("/crops")
def get_crops():
    return [{"key": k, **v} for k, v in CROP_PROFILES.items()]

@router.post("/predict")
def predict_yield(req: YieldRequest):
    crop_key = req.crop.lower().strip()
    profile = CROP_PROFILES.get(crop_key, CROP_PROFILES["wheat"])

    soil_map = {"loamy": 1.08, "black": 1.06, "alluvial": 1.10, "red": 0.95, "sandy": 0.82, "clay": 0.90}
    soil_mult = soil_map.get(req.soil_condition.lower(), 1.0)

    water_map = {"drip": 1.15, "tubewell": 1.04, "sprinkler": 1.08, "limited": 0.88, "rainfed": 0.72}
    water_mult = water_map.get(req.irrigation_type.lower(), 1.0)

    fert_map = {"balanced": 1.10, "standard": 1.02, "organic": 1.04, "low": 0.85}
    fert_mult = fert_map.get(req.fertilizer_level.lower(), 1.0)

    clim_score = 1.0
    if profile["temp_min"] <= req.temperature <= profile["temp_max"]:
        clim_score += 0.04
    elif abs(req.temperature - profile["temp_min"]) > 7 or abs(req.temperature - profile["temp_max"]) > 7:
        clim_score -= 0.12

    if profile["rain_min"] <= req.rainfall <= profile["rain_max"]:
        clim_score += 0.04
    elif req.rainfall < profile["rain_min"] * 0.6:
        clim_score -= 0.15

    net_mult = soil_mult * water_mult * fert_mult * clim_score
    per_acre_tonnes = round(profile["base_yield"] * net_mult, 2)
    total_tonnes = round(per_acre_tonnes * req.farm_area, 2)
    revenue = round(total_tonnes * profile["price"], 0)

    if req.irrigation_type.lower() == "rainfed" or req.soil_condition.lower() == "sandy":
        confidence = "Low"
    elif req.irrigation_type.lower() == "drip" and req.fertilizer_level.lower() == "balanced" and clim_score >= 1.0:
        confidence = "High"
    else:
        confidence = "Moderate"

    # Simulation interventions
    interventions = req.interventions or {"drip": True, "soil_test": True, "bio": False, "seeds": True}
    boost = 1.0
    cost = 0.0
    if interventions.get("drip"):
        boost += 0.16
        cost += 4500 * req.farm_area
    if interventions.get("soil_test"):
        boost += 0.12
        cost += 1200 * req.farm_area
    if interventions.get("bio"):
        boost += 0.08
        cost += 1000 * req.farm_area
    if interventions.get("seeds"):
        boost += 0.10
        cost += 1500 * req.farm_area

    sim_total = round(total_tonnes * boost, 2)
    sim_revenue = round(sim_total * profile["price"], 0)
    net_gain = round(sim_revenue - revenue - cost, 0)
    roi_percent = round(((sim_revenue - revenue - cost) / max(cost, 1)) * 100, 1)

    return {
        "crop": profile["name"],
        "hindi_name": profile["hindi_name"],
        "emoji": profile["emoji"],
        "farm_area_acres": req.farm_area,
        "estimated_total_tonnes": total_tonnes,
        "estimated_per_acre_tonnes": per_acre_tonnes,
        "estimated_revenue_inr": revenue,
        "confidence": confidence,
        "multipliers": {
            "soil": round(soil_mult, 2),
            "irrigation": round(water_mult, 2),
            "fertilizer": round(fert_mult, 2),
            "climate": round(clim_score, 2)
        },
        "simulation": {
            "simulated_total_tonnes": sim_total,
            "simulated_revenue_inr": sim_revenue,
            "simulated_cost_inr": cost,
            "net_gain_inr": net_gain,
            "roi_percent": roi_percent
        },
        "disclaimer": "Call it an estimate, not a guaranteed prediction. Real yields vary with microclimate and farm practices."
    }
