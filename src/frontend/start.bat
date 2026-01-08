@echo off
REM Production startup script for Todo App Frontend
REM Usage: start.bat

echo Starting Todo Webapp Frontend...
echo.

REM Check if .env.local file exists
if not exist .env.local (
    echo Warning: .env.local not found. Using default values.
)

REM Start the frontend server on port 3000
echo Frontend will be available at http://localhost:3000
npm run start

echo.
echo Frontend stopped.
pause
