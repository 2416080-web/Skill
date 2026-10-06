@echo off
echo ==================================================
echo   Starting SKILLPROOF Full-Stack Web Platform...
echo ==================================================
echo.

cd /d "%~dp0"

echo [1/2] Starting Node.js Backend Server on Port 5000...
start "SkillProof Backend (Port 5000)" cmd /k "cd server && npm start"

timeout /t 3 /nobreak >nul

echo [2/2] Starting React.js Frontend on Port 5173...
start "SkillProof Frontend (Port 5173)" cmd /k "cd client && npm run dev"

echo.
echo ==================================================
echo   SKILLPROOF is now running!
echo   Frontend : http://localhost:5173
echo   Backend  : http://localhost:5000
echo ==================================================
echo Opening browser...
timeout /t 2 /nobreak >nul
start http://localhost:5173
