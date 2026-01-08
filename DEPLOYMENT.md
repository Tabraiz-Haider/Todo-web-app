# Deployment Guide

## Prerequisites

- [Docker](https://docker.com) installed locally
- [Railway](https://railway.app) or [Render](https://render.com) account
- Neon PostgreSQL database URL

---

## Quick Local Production Test

### Start Both Services

```bash
# Windows
start-all.bat

# Or manually:
# Terminal 1 - Backend
cd src/backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000

# Terminal 2 - Frontend
cd src/frontend
npm run build
npm run start
```

Access at http://localhost:3000

---

## Option 1: Deploy to Railway

### Step 1: Prepare Your Repository

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Add Docker configuration"
   git push
   ```

### Step 2: Create Neon Database

1. Go to [Neon Console](https://console.neon.tech)
2. Create a new project
3. Copy the connection string (format: `postgresql://user:password@host:5432/dbname?sslmode=require`)

### Step 3: Deploy on Railway

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository

### Step 4: Add Environment Variables

In Railway project settings, add these variables:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Your Neon connection string |
| `JWT_SECRET_KEY` | Generate a secure random key |
| `BACKEND_CORS_ORIGINS` | `https://your-app.up.railway.app` |
| `NEXT_PUBLIC_API_URL` | `https://your-backend.up.railway.app/api` |

### Step 5: Configure Service Ports

**Backend Service:**
- Port: `8000`
- Health Check: `/health`

**Frontend Service:**
- Port: `3000`
- Start Command: `node server.js`

### Step 6: Add Persistent Storage (Optional)

If you need file storage, add a Railway volume mount for `/app/data`

---

## Option 2: Deploy to Render

### Step 1: Create Neon Database

1. Go to [Neon Console](https://console.neon.tech)
2. Create a new project
3. Copy the connection string

### Step 2: Deploy Backend as Web Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:

| Setting | Value |
|---------|-------|
| Name | `todo-backend` |
| Root Directory | `src/backend` |
| Build Command | `poetry install` |
| Start Command | `poetry run uvicorn app:app --host 0.0.0.0 --port $PORT` |
| Environment | `Python 3.11` |

5. Add Environment Variables:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Your Neon connection string |
| `JWT_SECRET_KEY` | Generate a secure random key |
| `BACKEND_CORS_ORIGINS` | `https://your-app.onrender.com` |

6. Click "Create Web Service"

### Step 3: Deploy Frontend as Web Service

1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:

| Setting | Value |
|---------|-------|
| Name | `todo-frontend` |
| Root Directory | `src/frontend` |
| Build Command | `npm install && npm run build` |
| Start Command | `npm run start` |
| Environment | `Node` |
| Node Version | `20` |

4. Add Environment Variables:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `https://todo-backend.onrender.com/api` |

5. Click "Create Web Service"

### Step 4: Configure Health Checks

- Backend Health Check: `https://todo-backend.onrender.com/health`
- Response should be `{"status": "ok"}`

---

## Option 3: Deploy with Docker Compose (Railway/Render)

Create a `railway.json` for Railway deployment:

```json
{
  "$schema": "https://railway.app/schema.json",
  "build": {
    "builder": "DOCKERFILE"
  },
  "deploy": {
    "numReplicas": 1,
    "restartPolicy": {
      "policy": "ON_FAILURE"
    }
  }
}
```

For Render, use the Docker runtime option when creating services.

---

## Verifying Deployment

### Test Backend Health
```bash
curl https://your-backend-domain/health
# Expected: {"status":"ok"}
```

### Test API Endpoints
```bash
# Register
curl -X POST https://your-backend-domain/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Login
curl -X POST https://your-backend-domain/api/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=test@example.com&password=password123"
```

### Access Frontend
Open `https://your-frontend-domain` in your browser

---

## Troubleshooting

### CORS Errors
- Ensure `BACKEND_CORS_ORIGINS` includes your frontend domain
- Check that the origin is exactly as it appears in requests (no trailing slashes)

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Ensure Neon allows connections from your deployment IP
- Check SSL requirement (`?sslmode=require`)

### Build Failures
- Check build logs for specific errors
- Ensure all dependencies are in `pyproject.toml` or `package.json`
- Verify Dockerfiles are in correct directories

### JWT Token Issues
- Ensure `JWT_SECRET_KEY` is consistent across deployments
- Check token expiration settings

---

## Security Checklist

- [ ] Use strong, unique `JWT_SECRET_KEY`
- [ ] Enable SSL/TLS (automatic on Railway/Render)
- [ ] Keep dependencies updated
- [ ] Rotate database credentials periodically
- [ ] Use environment variables for all secrets
- [ ] Restrict CORS origins to known domains
- [ ] Set up monitoring and alerts

---

## Quick Commands Reference

```bash
# Railway CLI
npm i -g @railway/cli
railway login
railway init
railway up
railway status
railway logs

# Render CLI (install via npm)
npm i -g render-cli
render login
render deploy
```
