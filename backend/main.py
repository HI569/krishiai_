from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.crop import router as crop_router
from routes.soil import router as soil_router
from routes.disease import router as disease_router
from routes.ai import router as ai_router
from routes.weather import router as weather_router
from routes.knowledge import router as knowledge_router


app = FastAPI(
    title="KrishiAI API",
    version="1.0.0",
    description="Unified AI/ML farming assistant API"
)


# --------------------------------------------------
# CORS
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:4200",
        "http://127.0.0.1:4200",
        "http://localhost:56819",
        "http://127.0.0.1:56819",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# API ROUTES
# --------------------------------------------------

app.include_router(
    crop_router,
    prefix="/api/crop",
    tags=["Crop ML"]
)

app.include_router(
    soil_router,
    prefix="/api/soil",
    tags=["Soil"]
)

app.include_router(
    disease_router,
    prefix="/api/disease",
    tags=["Disease ML"]
)

app.include_router(
    ai_router,
    prefix="/api/ai",
    tags=["AI Assistant"]
)

app.include_router(
    weather_router,
    prefix="/api",
    tags=["Geo & Weather"]
)

app.include_router(
    knowledge_router,
    prefix="/api",
    tags=["Knowledge"]
)


# --------------------------------------------------
# HEALTH CHECK
# --------------------------------------------------

@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "service": "KrishiAI"
    }