# ==============================================================================
# KrishiAI Production Multi-Stage Dockerfile
# Stage 1: Build Angular Frontend
# Stage 2: Serve FastAPI Backend with Static Frontend
# ==============================================================================

# STAGE 1: Frontend Build
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install --legacy-peer-deps

COPY frontend/ ./
RUN npm run build

# STAGE 2: Python Backend Runtime
FROM python:3.11-slim
WORKDIR /app

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8000

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential curl && \
    rm -rf /var/lib/apt/lists/*

# Install backend Python packages
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy backend application code
COPY backend/ ./backend/

# Copy compiled Angular distribution from frontend builder stage
COPY --from=frontend-builder /app/frontend/dist/krishiai/browser ./frontend/dist/krishiai/browser

WORKDIR /app/backend

EXPOSE 8000

# Start Uvicorn bound to 0.0.0.0 and dynamic $PORT (default 8000)
CMD ["sh", "-c", "python -m uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
