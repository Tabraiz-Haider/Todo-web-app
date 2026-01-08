# Backend Setup

## Prerequisites
- Python 3.11+
- Poetry

## Installation

```bash
cd src/backend
poetry install
```

## Neon Database Setup

1. Create a project at [Neon Console](https://console.neon.tech)
2. Copy your connection string from the dashboard
3. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
4. Edit `.env` and replace `DATABASE_URL` with your Neon connection string:
   ```
   DATABASE_URL=postgresql://neondb_owner:password@host:port/neondb?sslmode=require
   ```
5. Update other settings as needed (JWT secret, etc.)

## Running the Server

```bash
poetry run uvicorn app:app --reload
```

The API will be available at `http://localhost:8000`

## Running Tests

```bash
poetry run pytest
```

Tests use an in-memory SQLite database.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Neon PostgreSQL connection string (or SQLite for tests) |
| `JWT_SECRET_KEY` | Secret key for JWT tokens |
| `JWT_ALGORITHM` | JWT algorithm (default: HS256) |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiry time |
| `PROJECT_NAME` | API title |
| `API_PREFIX` | API route prefix |
| `BACKEND_CORS_ORIGINS` | Comma-separated CORS origins |

## Production Deployment

### 1. Configure Environment

Copy the production template and update settings:
```bash
cp .env.production .env
```

Edit `.env` with your production values:
- `DATABASE_URL`: Use PostgreSQL (Neon or other provider)
- `JWT_SECRET_KEY`: Generate a strong random key (32+ characters)
- `BACKEND_CORS_ORIGINS`: Your frontend domain(s)

### 2. Run with Gunicorn (Recommended)

For production, use Gunicorn with multiple workers:
```bash
gunicorn app.main:app -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000 --workers 4
```

### 3. Using systemd (Linux)

Create `/etc/systemd/system/todo-backend.service`:
```ini
[Unit]
Description=Todo Webapp Backend
After=network.target

[Service]
User=www-data
WorkingDirectory=/path/to/todo-app/src/backend
Command=gunicorn app.main:app -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000 --workers 4
Restart=always
Environment="PATH=/path/to/venv/bin"

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl daemon-reload
sudo systemctl enable todo-backend
sudo systemctl start todo-backend
```

### 4. Using Docker

The included Dockerfile builds and runs the container:
```bash
docker build -t todo-backend .
docker run -p 8000:8000 --env-file .env todo-backend
```
