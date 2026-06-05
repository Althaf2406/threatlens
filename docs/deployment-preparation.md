# Deployment Preparation Guide

This document outlines the necessary steps and configurations required to safely deploy ThreatLens to a production environment.

## 1. Environment Variables Configuration

### Frontend (`apps/web/.env.local`)
```env
NEXT_PUBLIC_API_BASE_URL=https://api.threatlens.example.com/api/v1
NEXT_PUBLIC_USE_MOCK_API=false
```

### Backend (`apps/api/.env`)
```env
SECRET_KEY=generate_a_very_long_secure_random_string_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
FRONTEND_ORIGIN=https://threatlens.example.com
COOKIE_SECURE=true
DATABASE_URL=postgresql://user:password@host:port/dbname
```

## 2. CORS Configuration
By default, the backend allows `localhost:3000`. In production, you **must** restrict the CORS origins in `apps/api/app/main.py` (via the `FRONTEND_ORIGIN` env var) to only allow the domain where the frontend is hosted.

## 3. Cookie Configuration
Ensure that the `COOKIE_SECURE` environment variable is set to `true`. This guarantees that the JWT `threatlens_access_token` is only transmitted over HTTPS, preventing interception on insecure networks. The cookie is already set to `HttpOnly` by default.

## 4. Database Limitations
**Local SQLite Limitation**: ThreatLens currently defaults to SQLite. SQLite is NOT suitable for a scalable, highly-available production deployment, nor is it suitable for serverless deployments (where the filesystem is ephemeral).
**Recommendation**: Migrate to a managed PostgreSQL database (e.g., AWS RDS, Supabase, Neon) by configuring the `DATABASE_URL` environment variable.

## 5. Build and Start Commands

### Frontend Deployment (e.g., Vercel, Node server)
**Build**:
```bash
pnpm install
pnpm build
```
**Start**:
```bash
pnpm start
```

### Backend Deployment (e.g., Docker, Render, AWS ECS)
**Install**:
```bash
pip install --prefer-binary -r requirements.txt
```
**Start**:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```
*Note: Use `gunicorn` with `uvicorn` workers for highly concurrent production loads.*

## 6. Defensive Platform Constraints
As a reminder, ThreatLens is explicitly designed for defensive analysis.
- **Do not** expose the API to the public internet without proper rate limiting.
- **Do not** integrate offensive or active exploitation tools into the `passive_checker` pipeline. The platform should remain evidence-based and read-only against scanned assets.
