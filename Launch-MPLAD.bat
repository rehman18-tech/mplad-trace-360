@echo off
title MPLAD-TRACE 360 - Autonomous Infrastructure Platform
color 0F

echo =====================================================================
echo           MPLAD-TRACE 360 | Government of India MoSPI
echo       Autonomous Contract Surveillance ^& Mobile Inspection App
echo =====================================================================
echo.
echo [1/3] Checking environment...
cd /d "%~dp0"

echo [2/3] Launching FastAPI MoSPI Central Backend on port 8000...
start "MPLAD Backend Server" /min cmd /c "py -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000"

echo [3/3] Launching Frontend Web & Mobile PWA on port 5173...
cd frontend
start "MPLAD Frontend PWA" /min cmd /c "npm run dev"

timeout /t 3 /nobreak >nul
echo.
echo Opening browser to: http://localhost:5173
start http://localhost:5173

echo.
echo =====================================================================
echo [SUCCESS] Platform is live!
echo - Web Dashboard ^& Mobile PWA: http://localhost:5173
echo - FastAPI Swagger API Docs:   http://127.0.0.1:8000/docs
echo.
echo You can now minimize this window. Close this window to keep running in background.
echo =====================================================================
pause
