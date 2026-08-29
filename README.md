# KrishiAI — Intelligent AI & ML Platform for Smart Farming

A production-oriented Angular + FastAPI reference application that unifies crop recommendation, soil analysis, plant disease detection, geographic context and a LangGraph/RAG agricultural assistant.

## Included
- Responsive farmer-first Angular UI
- FastAPI REST API with separated routes/services/ML/RAG folders
- Crop recommendation scoring adapter ready for Random Forest/XGBoost
- Disease image upload endpoint ready for CNN/transfer learning
- LangGraph-compatible RAG workflow with local demo knowledge base
- Demo farm data and graceful fallbacks when external services/models are unavailable
- Location permission flow and map-style farm panel
- AI assistant with conversation context, suggested prompts, language selector and browser voice input
- Soil health dashboard and knowledge center

## Run locally

### Backend (Python 3.11 recommended)
```bash
cd backend
python -m venv .venv
# Windows PowerShell: .venv\Scripts\Activate.ps1
# If execution policy blocks activation, use a process-scoped bypass or run the venv python directly.
pip install -r requirements.txt
copy .env.example .env   # Windows; use cp on macOS/Linux
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm start
```
Open `http://localhost:4200`.

## API
- POST `/api/crop/recommend`
- POST `/api/soil/analyze`
- POST `/api/disease/predict`
- POST `/api/ai/chat`
- POST `/api/ai/voice`
- GET `/api/weather?lat=...&lon=...`
- GET `/api/location`
- GET `/api/knowledge`
- GET `/api/health`

## Production hardening
- Use PostgreSQL + pgvector (or another vector DB) for RAG.
- Store secrets only in backend environment variables / secret manager.
- Add authentication, rate limiting, audit logging and role-based access.
- Add real weather/geographic/soil providers through backend adapters.
- Train and calibrate crop/disease models on validated regional datasets.
- Add image quality checks, model monitoring and human-review escalation.
- Never present pesticide/fertilizer instructions as universally safe; follow labels and local expert guidance.

## Architecture
Angular UI → typed services → FastAPI → domain services → ML / RAG / data adapters → response. The UI is not responsible for model logic or API secrets.
