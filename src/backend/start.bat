@echo off
REM Production startup script for Todo App Backend
REM Usage: start.bat

echo Starting Todo Webapp Backend...
echo.

REM Check if .env file exists, if not copy from example
if not exist .env (
    if exist .env.example (
        echo Copying .env.example to .env...
        copy .env.example .env
    )
    echo Please configure your .env file before running in production!
    pause
    exit /b 1
)

REM Start the backend server
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000

echo.
echo Backend stopped.
pause
