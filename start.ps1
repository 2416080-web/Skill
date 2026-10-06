Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  Starting SKILLPROOF Full-Stack Web Platform..." -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# 1. Start Server
Write-Host "`n[1/2] Starting Node.js Backend Server on Port 5000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootDir\server'; npm start"

Start-Sleep -Seconds 3

# 2. Start Client
Write-Host "[2/2] Starting React Frontend on Port 5173..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootDir\client'; npm run dev"

Write-Host "`n✓ SKILLPROOF is running!" -ForegroundColor Green
Write-Host "  Frontend : http://localhost:5173" -ForegroundColor White
Write-Host "  Backend  : http://localhost:5000" -ForegroundColor White

Start-Sleep -Seconds 2
Start-Process "http://localhost:5173"
