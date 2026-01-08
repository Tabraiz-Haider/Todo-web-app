#!/bin/bash
set -e

echo "Installing Python dependencies..."
cd src/backend
pip install -r requirements.txt

echo "Starting backend server..."
exec uvicorn app.main:app --host 0.0.0.0 --port $PORT
