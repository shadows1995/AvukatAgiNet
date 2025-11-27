@echo off
echo ===================================
echo AvukatAgi SMS Test Script
echo ===================================
echo.

REM Check if server is running
echo [1/3] Checking if server is running...
powershell -Command "try { Invoke-WebRequest -Uri 'http://localhost:3001' -Method GET -TimeoutSec 2 -ErrorAction Stop | Out-Null; Write-Host '  ✓ Server is running' -ForegroundColor Green } catch { Write-Host '  ✗ Server is NOT running!' -ForegroundColor Red; Write-Host '  → Please run start-server.bat first' -ForegroundColor Yellow; exit 1 }"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Please start the server first by running: start-server.bat
    pause
    exit /b 1
)

echo.
echo [2/3] Testing NetGSM API directly...
node test-sms-direct.js

echo.
echo [3/3] Testing via server endpoint...
node test-with-uuid.js

echo.
echo ===================================
echo Test completed!
echo ===================================
pause
