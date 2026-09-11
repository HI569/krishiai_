@echo off
title KrishiAI - 1-Tap Launcher
color 0A
chcp 65001 >nul
cls

echo ================================================================
echo        KRISHIAI - SMART MULTILINGUAL FARMING ASSISTANT          
echo ================================================================
echo  Starting KrishiAI Services...
echo  - Backend API (FastAPI + ML Models): http://127.0.0.1:8001
echo  - Frontend Web UI (Angular 19):      http://localhost:4200
echo ================================================================
echo.

cd /d "%~dp0"

echo [1/3] Launching FastAPI Backend Server...
start "KrishiAI - Backend API (:8001)" cmd /k "title KrishiAI Backend API && color 0B && cd /d ""%~dp0backend"" && python -m uvicorn main:app --host 127.0.0.1 --port 8001 --reload"

echo [2/3] Launching Angular Web Application...
start "KrishiAI - Frontend Web (:4200)" cmd /k "title KrishiAI Frontend && color 0E && cd /d ""%~dp0frontend"" && npm start"

echo [3/3] Waiting for servers to initialize...
timeout /t 5 /nobreak >nul

echo Opening KrishiAI in your default web browser...
start http://localhost:4200

echo.
echo ================================================================
echo  KrishiAI is now running!
echo  Keep the two terminal windows running in the background.
echo  To stop KrishiAI, simply close those two command windows.
echo ================================================================
echo.
pause
