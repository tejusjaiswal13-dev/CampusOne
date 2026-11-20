@echo off
setlocal
cd /d "%~dp0"

echo Starting the CampusOne API and phone-accessible web app...
start "CampusOne API" /D "%~dp0" cmd /k "npm run server"
start "CampusOne Web App" /D "%~dp0" cmd /k "npm run dev -- --host 0.0.0.0 --port 5173 --strictPort"

echo.
echo Leave both new black windows open while using CampusOne.
echo Open http://192.168.31.198:5173 on your phone.
echo If your laptop Wi-Fi IP changed, use that new IP instead.
endlocal
