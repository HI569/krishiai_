"""
Shared weather-data cache with retry logic for Open-Meteo API.

Caches responses for 10 minutes per (lat, lon, params) key.
Retries with exponential backoff on 429 Too Many Requests.
Returns cached/fallback data when API is unreachable.
"""

import asyncio
import hashlib
import json
import time
from typing import Any, Dict, Optional

import httpx

OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"

# In-memory cache: key -> (timestamp, data)
_cache: Dict[str, tuple] = {}
CACHE_TTL = 600  # 10 minutes


def _cache_key(lat: float, lon: float, params: dict) -> str:
    """Create a stable cache key from coordinates + query params."""
    # Round coordinates to 2 decimal places (~1.1 km precision)
    # so that nearby requests share the same cache entry
    rounded = f"{lat:.2f},{lon:.2f}"
    param_str = json.dumps(
        {k: v for k, v in sorted(params.items()) if k not in ("latitude", "longitude")},
        sort_keys=True
    )
    raw = f"{rounded}:{param_str}"
    return hashlib.md5(raw.encode()).hexdigest()


def _is_fresh(key: str) -> bool:
    """Check if a cache entry exists and is still fresh."""
    if key not in _cache:
        return False
    ts, _ = _cache[key]
    return (time.time() - ts) < CACHE_TTL


def _get_cached(key: str) -> Optional[dict]:
    """Return cached data if available (even if stale, for fallback)."""
    if key in _cache:
        _, data = _cache[key]
        return data
    return None


def _store(key: str, data: dict):
    """Store data in cache with current timestamp."""
    _cache[key] = (time.time(), data)
    # Evict old entries if cache grows too large (keep RAM low on Render)
    if len(_cache) > 200:
        oldest_key = min(_cache, key=lambda k: _cache[k][0])
        del _cache[oldest_key]


async def fetch_weather(
    lat: float,
    lon: float,
    params: dict,
    max_retries: int = 3,
) -> Dict[str, Any]:
    """
    Fetch weather data from Open-Meteo with caching and retry.

    Args:
        lat: Latitude
        lon: Longitude
        params: Query parameters for the API (should NOT include lat/lon)
        max_retries: Number of retries on 429/5xx errors

    Returns:
        dict with keys: success, data, source ("live" | "cache" | "fallback"), error

    Raises:
        Nothing — always returns a dict. Caller decides how to handle errors.
    """
    full_params = {"latitude": lat, "longitude": lon, **params}
    key = _cache_key(lat, lon, full_params)

    # 1) Return fresh cache hit immediately
    if _is_fresh(key):
        return {
            "success": True,
            "data": _get_cached(key),
            "source": "cache",
            "error": None,
        }

    # 2) Try live API with retry + exponential backoff
    last_error = None
    for attempt in range(max_retries):
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.get(OPEN_METEO_URL, params=full_params)

                if response.status_code == 429:
                    # Rate limited — back off and retry
                    wait = min(2 ** attempt * 2, 30)  # 2s, 4s, 8s max 30s
                    last_error = "Rate limited (429)"
                    await asyncio.sleep(wait)
                    continue

                response.raise_for_status()
                data = response.json()
                _store(key, data)
                return {
                    "success": True,
                    "data": data,
                    "source": "live",
                    "error": None,
                }

        except httpx.HTTPError as exc:
            last_error = str(exc)
            if attempt < max_retries - 1:
                await asyncio.sleep(2 ** attempt)
            continue
        except Exception as exc:
            last_error = str(exc)
            break

    # 3) All retries failed — try stale cache
    stale = _get_cached(key)
    if stale is not None:
        return {
            "success": True,
            "data": stale,
            "source": "cache",
            "error": f"Using cached data (API: {last_error})",
        }

    # 4) No cache at all — return fallback
    return {
        "success": False,
        "data": None,
        "source": "fallback",
        "error": last_error,
    }
