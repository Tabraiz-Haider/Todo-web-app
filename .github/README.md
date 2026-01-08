# GitHub Actions Workflows

## Status Badges

Add these badges to your `README.md`:

```markdown
![Backend CI](https://github.com/yourusername/yourrepo/actions/workflows/backend-ci.yml/badge.svg)
![Frontend CI](https://github.com/yourusername/yourrepo/actions/workflows/frontend-ci.yml/badge.svg)
![Deploy](https://github.com/yourusername/yourrepo/actions/workflows/deploy.yml/badge.svg)
```

## Workflows

### 1. `backend-ci.yml`
Runs on changes to `src/backend/**`:
- Installs Python dependencies via Poetry
- Runs `ruff` linter
- Executes pytest with coverage
- Builds Docker image on `main` branch push
- Pushes image to GitHub Container Registry

### 2. `frontend-ci.yml`
Runs on changes to `src/frontend/**`:
- Installs Node.js dependencies
- Runs ESLint
- Type-checks with TypeScript
- Builds Next.js application
- Builds and pushes Docker image

### 3. `deploy.yml`
Triggers on:
- Push to `main` branch
- Manual workflow dispatch

Deploys both services to Railway (configurable for Render/Docker Hub).

### 4. `full-ci.yml`
Runs on all PRs and pushes to `main/develop`:
- Runs backend checks (lint + test)
- Runs frontend checks (lint + type-check + build)
- Builds both Docker images
- Quick integration test with Docker

## Required Secrets

Add these in GitHub repository Settings → Secrets and variables → Actions:

| Secret | Required For | Description |
|--------|--------------|-------------|
| `GITHUB_TOKEN` | Automatic | GitHub Actions token |
| `CODECOV_TOKEN` | Backend CI | Codecov upload token |
| `RAILWAY_TOKEN` | Deploy | Railway API token |
| `RAILWAY_PROJECT_ID` | Deploy | Railway project ID |
| `DATABASE_URL` | Deploy | Neon connection string |
| `JWT_SECRET_KEY` | Deploy | JWT signing key |
| `BACKEND_CORS_ORIGINS` | Deploy | Frontend domain(s) |
| `NEXT_PUBLIC_API_URL` | Deploy | Backend API URL |

## Setting Up Codecov

1. Sign up at https://codecov.io
2. Add repository
3. Copy token to `CODECOV_TOKEN` secret

## Setting Up Railway Deployment

1. Install Railway CLI: `npm i -g @railway/cli`
2. Login: `railway login`
3. Create project and link: `railway init`
4. Add secrets to GitHub

## Branch Protection Rules

Recommended branch protection for `main`:

- Require status checks to pass before merging
  - `backend-ci` / `frontend-ci` / `full-ci`
- Require reviews: 1 approval
- Require signed commits
- Restrict who can push to main
