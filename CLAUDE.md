# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack Todo application with FastAPI backend (Python 3.11+) and Next.js 14 frontend (TypeScript). Uses PostgreSQL for data storage and JWT for authentication.

## Tech Stack

- **Backend**: FastAPI, SQLAlchemy, Pydantic v2, python-jose (JWT), passlib/bcrypt
- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS, Axios, React Hook Form + Zod
- **Database**: PostgreSQL (Neon for production, SQLite for tests)

## Common Commands

### Backend
```bash
cd src/backend

# Install dependencies (requires Poetry)
poetry install

# Run development server with hot reload
poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Run tests (uses in-memory SQLite)
poetry run pytest

# Lint code
poetry run ruff check .
```

### Frontend
```bash
cd src/frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run production server
npm run start
```

### All Services (Windows)
```bash
start-all.bat  # Starts both backend and frontend
```

## Architecture

### Backend Structure (`src/backend/app/`)
- `main.py` - FastAPI app with CORS middleware
- `core/config.py` - Environment settings via Pydantic Settings
- `core/security.py` - JWT token creation, password hashing with bcrypt
- `models/` - SQLAlchemy models (User, Task with FK relationship)
- `schemas/` - Pydantic v2 models with `model_config = {"from_attributes": True}`
- `api/v1/routes/` - Endpoint handlers (auth.py, tasks.py, health.py)
- `crud/` - Database operations
- `deps.py` - Dependency injection for `get_current_user()`

### Frontend Structure (`src/frontend/src/`)
- `app/` - Next.js App Router pages (login, register, dashboard, logout)
- `components/` - auth-form.tsx, task-form.tsx, task-list.tsx
- `lib/api-client.ts` - Axios instance with automatic Authorization header injection
- `lib/auth.ts` - Token storage in localStorage, expiry validation

### Authentication Flow
1. User registers: `POST /api/auth/register` → creates user with bcrypt-hashed password
2. User logs in: `POST /api/auth/login` → returns JWT token with 60-min expiry
3. Token stored in localStorage (`todo_token`, `todo_token_expiry`)
4. `api-client.ts` interceptor adds `Authorization: Bearer <token>` to all requests
5. `deps.py:get_current_user()` validates JWT and returns user for protected routes

### API Endpoints
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Get JWT token (form-urlencoded)
- `GET /api/tasks` - List user's tasks (protected)
- `POST /api/tasks` - Create task (protected)
- `PUT /api/tasks/{id}` - Update task (protected)
- `DELETE /api/tasks/{id}` - Delete task (protected)
- `GET /health` - Health check (no auth)

## Database

**Models**:
- `User` - id, email, hashed_password, created_at, relationship to tasks
- `Task` - id, user_id (FK), title, description, is_completed, timestamps

**Environment**:
- Backend: `DATABASE_URL` (PostgreSQL or SQLite)
- Frontend: `NEXT_PUBLIC_API_URL` (backend URL for API calls)

## Deployment

### Railway (Docker recommended)
- Backend: Use `src/backend/Dockerfile`
- Root directory: `src/backend`
- Environment: `PORT=8000`, `JWT_SECRET_KEY`, `DATABASE_URL`, `BACKEND_CORS_ORIGINS`
- Health check: `/health`

### Vercel (Frontend)
- Root directory: `src/frontend`
- Build: `npm run build`
- Start: `npm run start`
- Env var: `NEXT_PUBLIC_API_URL` = backend URL

See `DEPLOYMENT.md` for detailed deployment instructions.

## Key Configuration Files

| File | Purpose |
|------|---------|
| `src/backend/.env` | Backend environment (DATABASE_URL, JWT_SECRET_KEY, etc.) |
| `src/frontend/.env.local` | Frontend environment (NEXT_PUBLIC_API_URL) |
| `src/backend/pyproject.toml` | Python dependencies (Poetry) |
| `src/frontend/package.json` | Node dependencies |
| `docker-compose.yml` | Local container orchestration |
| `railway.json` | Railway deployment config |
