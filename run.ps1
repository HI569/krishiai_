# KrishiAI 1-Tap PowerShell Launcher
Write-Host "================================================================" -ForegroundColor Green
Write-Host "       KRISHIAI - SMART MULTILINGUAL FARMING ASSISTANT          " -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Green
Write-Host "Starting KrishiAI Services..." -ForegroundColor Cyan
Write-Host "- Backend API:  http://127.0.0.1:8001" -ForegroundColor Yellow
Write-Host "- Frontend Web: http://localhost:4200" -ForegroundColor Yellow
Write-Host "================================================================" -ForegroundColor Green

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path

# Start Backend
Start-Process cmd.exe -ArgumentList "/k cd /d `"$Root\backend`" && python -m uvicorn main:app --host 127.0.0.1 --port 8001 --reload"

# Start Frontend
Start-Process cmd.exe -ArgumentList "/k cd /d `"$Root\frontend`" && npm start"

# Wait & Open Browser
Start-Sleep -Seconds 5
Start-Process "http://localhost:4200"

Write-Host "KrishiAI is running! Keep the command windows open." -ForegroundColor Green
