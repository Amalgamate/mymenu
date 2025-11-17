@echo off
title QR Menu Platform - Development Servers
color 0B

echo.
echo ========================================
echo   QR Menu Platform - Starting Servers
echo ========================================
echo.

cd /d "%~dp0"

echo [1/2] Starting Backend Server...
start "Backend (Port 5000)" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak > nul

echo [2/2] Starting Frontend Server...
start "Frontend (Port 5173)" cmd /k "cd frontend && npm run dev"

timeout /t 2 /nobreak > nul

echo.
echo ========================================
echo   Servers Started Successfully!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Demo Login:
echo   Email:    admin@restaurant.com
echo   Password: Admin123!
echo.
echo Quick Links:
echo   Login:     http://localhost:5173/login
echo   Demo Menu: http://localhost:5173/demo-restaurant
echo.
echo Press any key to open browser...
pause > nul

start http://localhost:5173

echo.
echo To stop servers, close their terminal windows.
echo.
pause
