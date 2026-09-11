"""
Weather data fetcher with caching.

Primary source : wttr.in  (free, no API key, no rate limits)
Fallback source: Open-Meteo (free, may rate-limit on shared IPs)

All responses are normalised to the same dict shape so callers
don't need to know which source was used:

  {
    "current": {
      "temperature_2m": float,          # °C
      "relative_humidity_2m": float,    # %
      "precipitation": float,           # mm (current hour)
      "rain": float,                    # mm
      "wind_speed_10m": float,          # km/h
      "weather_code": int,
    },
    "daily": {
      "time":                 [str, ...],
      "temperature_2m_max":   [float, ...],
      "temperature_2m_min":   [float, ...],
      "precipitation_sum":    [float, ...],
      "wind_speed_10m_max":   [float, ...],
    },
    "timezone": str | None,
    "elevation": float | None,
  }

Cache TTL is 10 minutes per (lat, lon) pair.
"""

import asyncio
import hashlib
import time
from typing import Any, Dict, Optional

import httpx

# ── cache ──────────────────────────────────────────────────────────────
_cache: Dict[str, tuple] = {}   # key -> (timestamp, normalised_data)
CACHE_TTL = 600                  # 10 minutes


def _cache_key(lat: float, lon: float) -> str:
    """Stable key rounded to ~1 km precision."""
    return hashlib.md5(f"{lat:.2f},{lon:.2f}".encode()).hexdigest()


def _is_fresh(key: str) -> bool:
    if key not in _cache:
        return False
    ts, _ = _cache[key]
    return (time.time() - ts) < CACHE_TTL


def _get_cached(key: str) -> Optional[dict]:
    if key in _cache:
        return _cache[key][1]
    return None


def _store(key: str, data: dict):
    _cache[key] = (time.time(), data)
    # Evict oldest if cache grows large (keep Render RAM low)
    if len(_cache) > 200:
        oldest = min(_cache, key=lambda k: _cache[k][0])
        del _cache[oldest]


# ── wttr.in ─────────────────────────────────────────────────────────────
async def _fetch_wttr(lat: float, lon: float) -> dict:
    """
    Fetch from wttr.in and normalise to our internal format.
    wttr.in provides current conditions + 3-day forecast.
    No API key. No rate limit. Free forever.
    """
    url = f"https://wttr.in/{lat:.4f},{lon:.4f}?format=j1"
    headers = {"User-Agent": "KrishiAI-WeatherBot/1.0"}

    async with httpx.AsyncClient(timeout=15.0) as client:
        resp = await client.get(url, headers=headers)
        resp.raise_for_status()
        raw = resp.json()

    cc = raw.get("current_condition", [{}])[0]
    forecast = raw.get("weather", [])

    # ── current ──
    temperature   = float(cc.get("temp_C", 0) or 0)
    humidity      = float(cc.get("humidity", 0) or 0)
    precipitation = float(cc.get("precipMM", 0) or 0)
    wind          = float(cc.get("windspeedKmph", 0) or 0)
    weather_code  = int(cc.get("weatherCode", 0) or 0)

    # ── daily (3 days from wttr.in) ──
    dates, max_temps, min_temps, precip_sums, max_winds = [], [], [], [], []

    for day in forecast:
        dates.append(day.get("date", ""))
        max_temps.append(float(day.get("maxtempC", 0) or 0))
        min_temps.append(float(day.get("mintempC", 0) or 0))

        hourly = day.get("hourly", [])
        daily_precip = sum(float(h.get("precipMM", 0) or 0) for h in hourly)
        precip_sums.append(daily_precip)

        daily_max_wind = max(
            (float(h.get("windspeedKmph", 0) or 0) for h in hourly),
            default=wind
        )
        max_winds.append(daily_max_wind)

    return {
        "current": {
            "temperature_2m":       temperature,
            "relative_humidity_2m": humidity,
            "precipitation":        precipitation,
            "rain":                 precipitation,
            "wind_speed_10m":       wind,
            "weather_code":         weather_code,
        },
        "daily": {
            "time":               dates,
            "temperature_2m_max": max_temps,
            "temperature_2m_min": min_temps,
            "precipitation_sum":  precip_sums,
            "wind_speed_10m_max": max_winds,
        },
        "timezone": raw.get("nearest_area", [{}])[0].get("country", [{}])[0].get("value"),
        "elevation": None,
    }


# ── Open-Meteo fallback ──────────────────────────────────────────────────
OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"

async def _fetch_open_meteo(lat: float, lon: float) -> dict:
    """
    Fallback: Open-Meteo 7-day forecast.
    May be rate-limited on shared IPs but used only if wttr.in fails.
    """
    params = {
        "latitude":  lat,
        "longitude": lon,
        "current":   "temperature_2m,relative_humidity_2m,precipitation,rain,wind_speed_10m,weather_code",
        "daily":     "temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max",
        "forecast_days": 7,
        "timezone":  "auto",
    }
    async with httpx.AsyncClient(timeout=15.0) as client:
        resp = await client.get(OPEN_METEO_URL, params=params)
        resp.raise_for_status()
        raw = resp.json()

    # Open-Meteo already uses our internal key names — return as-is
    return {
        "current":   raw.get("current", {}),
        "daily":     raw.get("daily", {}),
        "timezone":  raw.get("timezone"),
        "elevation": raw.get("elevation"),
    }


# ── Soil weather (Open-Meteo only, has soil-moisture fields) ─────────────
_soil_cache: Dict[str, tuple] = {}

async def fetch_soil_weather(lat: float, lon: float) -> Dict[str, Any]:
    """
    Fetch soil + weather data from Open-Meteo.
    Returns {"success": bool, "data": dict|None, "error": str|None}
    """
    key = _cache_key(lat, lon)

    if key in _soil_cache:
        ts, data = _soil_cache[key]
        if (time.time() - ts) < CACHE_TTL:
            return {"success": True, "data": data, "error": None}

    params = {
        "latitude":  lat,
        "longitude": lon,
        "current": ",".join([
            "temperature_2m", "relative_humidity_2m", "precipitation",
            "rain", "wind_speed_10m", "weather_code",
            "soil_temperature_0cm", "soil_temperature_6cm",
            "soil_temperature_18cm", "soil_temperature_54cm",
            "soil_moisture_0_to_1cm", "soil_moisture_1_to_3cm",
            "soil_moisture_3_to_9cm", "soil_moisture_9_to_27cm",
            "soil_moisture_27_to_81cm",
        ]),
        "daily": ",".join([
            "temperature_2m_max", "temperature_2m_min",
            "precipitation_sum", "precipitation_hours", "wind_speed_10m_max",
        ]),
        "timezone": "auto",
        "forecast_days": 7,
    }

    last_error = None
    for attempt in range(3):
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                resp = await client.get(OPEN_METEO_URL, params=params)
                if resp.status_code == 429:
                    last_error = "Rate limited (429)"
                    await asyncio.sleep(2 ** attempt * 2)
                    continue
                resp.raise_for_status()
                data = resp.json()
                _soil_cache[key] = (time.time(), data)
                return {"success": True, "data": data, "error": None}
        except httpx.HTTPError as exc:
            last_error = str(exc)
            if attempt < 2:
                await asyncio.sleep(2 ** attempt)

    # Try stale cache
    if key in _soil_cache:
        return {"success": True, "data": _soil_cache[key][1], "error": f"Stale cache ({last_error})"}

    return {"success": False, "data": None, "error": last_error}


# ── Public API ───────────────────────────────────────────────────────────
async def fetch_weather(
    lat: float,
    lon: float,
    params: dict = None,          # kept for backward-compat, ignored
    max_retries: int = 3,
) -> Dict[str, Any]:
    """
    Fetch normalised weather data.

    Tries wttr.in first (unlimited, no key).
    Falls back to Open-Meteo if wttr.in is unreachable.
    Caches results for 10 minutes.

    Returns:
        {
          "success": bool,
          "data":    dict | None,
          "source":  "cache" | "wttr" | "open-meteo" | "fallback",
          "error":   str | None,
        }
    """
    key = _cache_key(lat, lon)

    # 1) Fresh cache hit
    if _is_fresh(key):
        return {"success": True, "data": _get_cached(key), "source": "cache", "error": None}

    last_error = None

    # 2) Try wttr.in (primary — unlimited free)
    for attempt in range(max_retries):
        try:
            data = await _fetch_wttr(lat, lon)
            _store(key, data)
            return {"success": True, "data": data, "source": "wttr", "error": None}
        except Exception as exc:
            last_error = f"wttr.in: {exc}"
            if attempt < max_retries - 1:
                await asyncio.sleep(1)

    # 3) Try Open-Meteo fallback
    for attempt in range(2):
        try:
            data = await _fetch_open_meteo(lat, lon)
            _store(key, data)
            return {"success": True, "data": data, "source": "open-meteo", "error": None}
        except Exception as exc:
            last_error = f"open-meteo: {exc}"
            if attempt < 1:
                await asyncio.sleep(2)

    # 4) Stale cache
    stale = _get_cached(key)
    if stale is not None:
        return {"success": True, "data": stale, "source": "cache", "error": f"Stale ({last_error})"}

    return {"success": False, "data": None, "source": "fallback", "error": last_error}
