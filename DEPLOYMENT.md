# 🚀 KrishiAI - Complete Deployment Guide

KrishiAI can be deployed online in 3 simple ways. The **Recommended Method (Option 1)** deploys the entire full-stack app (FastAPI backend + Angular frontend + ML models) as a single, free Web Service on Render with zero CORS issues.

---

## 🌟 Option 1: 1-Click Deploy on Render (Recommended & Free)

Render connects directly to your GitHub repository [`https://github.com/HI569/krishiai_.git`](https://github.com/HI569/krishiai_.git) and automatically builds the Docker container.

### Step-by-Step Instructions:

1. **Push your latest changes to GitHub**:
   ```bash
   git add .
   git commit -m "feat: configure production deployment"
   git push origin master
   ```

2. **Open Render**:
   - Go to [dashboard.render.com](https://dashboard.render.com/) (sign in with GitHub).

3. **Create a New Web Service**:
   - Click **New +** → Select **Web Service**.
   - Select your repository: `HI569/krishiai_`.
   - **Environment**: Select **Docker** (Render will automatically detect the root `Dockerfile`).
   - **Name**: `krishiai` (or your preferred name).
   - **Plan**: Select **Free**.

4. **Add Environment Variables**:
   Under **Environment Variables**, add:
   | Key | Value | Notes |
   | :--- | :--- | :--- |
   | `GEMINI_API_KEY` | *(Your Gemini API Key)* | Required for AI assistant |
   | `GEMINI_MODEL` | `gemini-flash-lite-latest` | Fast, reliable model |

5. **Click "Deploy Web Service"**:
   - Render will build the container, install packages, compile the Angular frontend, and start the app.
   - Once complete, you will receive a free public URL like:
     **`https://krishiai.onrender.com`**

---

## 🐳 Option 2: Run with Docker / Docker Compose

If you have Docker installed on your computer or a cloud VPS (Ubuntu/Debian):

1. **Build and start the container**:
   ```bash
   docker compose up --build -d
   ```

2. **Open your browser**:
   Navigate to [http://localhost:8000](http://localhost:8000)

3. **To stop**:
   ```bash
   docker compose down
   ```

---

## ⚡ Option 3: Split Deployment (Vercel Frontend + Render Backend)

If you prefer hosting the Angular frontend on Vercel and the backend on Render:

### Part A: Deploy Backend to Render
1. Follow Option 1 above, or deploy `backend/` as a Python web service:
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `cd backend && python -m uvicorn main:app --host 0.0.0.0 --port $PORT`
2. Note your backend URL (e.g., `https://krishiai-api.onrender.com`).

### Part B: Deploy Frontend to Vercel
1. Go to [vercel.com](https://vercel.com/) and import `HI569/krishiai_`.
2. Set **Root Directory** to `frontend`.
3. Framework Preset: **Angular**.
4. Deploy! Vercel will give you a domain like `https://krishiai.vercel.app`.

---

## 🩺 Verifying the Deployment
Once deployed, check your live service:
- **Web App**: `https://your-domain.com/` (Should load KrishiAI home dashboard)
- **API Health**: `https://your-domain.com/api/health` (Returns `{"status":"ok","service":"KrishiAI"}`)
- **AI Chat**: Test asking a question via the Assistant page.
- **Yield Estimator**: Test slider calculations and What-If interventions.
