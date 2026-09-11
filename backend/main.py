import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

from routes.crop import router as crop_router
from routes.soil import router as soil_router
from routes.disease import router as disease_router
from routes.ai import router as ai_router
from routes.weather import router as weather_router
from routes.knowledge import router as knowledge_router
from routes.yield_api import router as yield_router
from routes import disaster

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
    allow_origins=["*"],
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

app.include_router(disaster.router, prefix="/api/disaster")
app.include_router(yield_router, prefix="/api/yield", tags=["Yield Prediction"])


# --------------------------------------------------
# HEALTH CHECK
# --------------------------------------------------

@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "service": "KrishiAI"
    }


# --------------------------------------------------
# PRODUCTION FRONTEND SERVING (SPA)
# --------------------------------------------------

FRONTEND_PATHS = [
    os.path.join(os.path.dirname(__file__), "..", "frontend", "dist", "krishiai", "browser"),
    os.path.join(os.path.dirname(__file__), "static"),
    os.path.join(os.getcwd(), "frontend", "dist", "krishiai", "browser"),
    os.path.join(os.getcwd(), "dist", "krishiai", "browser"),
    os.path.join(os.getcwd(), "static"),
]

FRONTEND_DIST = None
for p in FRONTEND_PATHS:
    if os.path.exists(p) and os.path.isfile(os.path.join(p, "index.html")):
        FRONTEND_DIST = os.path.abspath(p)
        break

if FRONTEND_DIST:
    print(f"Serving compiled Angular frontend from: {FRONTEND_DIST}")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        # Serve static file if it exists (css, js, png, ico, etc.)
        target = os.path.join(FRONTEND_DIST, full_path)
        if full_path and os.path.isfile(target):
            return FileResponse(target)
        # Otherwise fallback to index.html for Angular client-side routing
        return FileResponse(os.path.join(FRONTEND_DIST, "index.html"))


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    print(f"Starting KrishiAI Server on port {port}...")
    uvicorn.run(app, host="0.0.0.0", port=port)
