@echo off
REM Combined startup script for Todo App (Backend + Frontend)
REM Usage: start-all.bat

echo ============================================
echo   Todo Webapp - Starting All Services
echo ============================================
echo.

REM Start backend in a new window
echo [1/2] Starting Backend on port 8000...
start "Todo Backend" cmd /c "cd %~dp0src\backend && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000"

REM Wait for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend in current window
echo [2/2] Starting Frontend on port 3000...
cd %~dp0src\frontend
npm run start

echo.
echo ============================================
echo   Todo Webapp Stopped
echo ============================================
pause
