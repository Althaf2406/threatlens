# Local Setup Guide

Follow these steps to run the ThreatLens frontend and backend locally from a fresh setup.

## Prerequisites
- Node.js (v18+ recommended)
- pnpm (v8+)
- Python (3.10+ recommended)
- SQLite (included with Python)

## Backend Setup
The backend is built with FastAPI and SQLAlchemy, using a local SQLite database for development.

1. Navigate to the backend directory:
   ```bash
   cd apps/api
   ```
2. Create and activate a virtual environment:
   **Windows (PowerShell):**
   ```bash
   python -m venv .venv
   .venv\Scripts\Activate.ps1
   ```
   **Mac/Linux:**
   ```bash
   python -m venv .venv
   source .venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   python -m pip install --upgrade pip setuptools wheel
   pip install --prefer-binary -r requirements.txt
   ```
4. Setup environment variables:
   Copy `.env.example` to `.env`. Ensure `SECRET_KEY` is set to a secure string if deploying, though the default placeholder is fine for local testing.
5. Seed the database (Creates tables and initial admin/demo users):
   ```bash
   python app/seed.py
   ```
6. Run the FastAPI development server:
   ```bash
   uvicorn app.main:app --reload
   ```
   The backend will be available at [http://localhost:8000](http://localhost:8000). API documentation (Swagger) is available at [http://localhost:8000/docs](http://localhost:8000/docs).

## Frontend Setup
The frontend is a Next.js App Router application built with React and Tailwind CSS.

1. Navigate to the frontend directory:
   ```bash
   cd apps/web
   ```
2. Install dependencies using pnpm:
   ```bash
   pnpm install
   ```
3. Setup environment variables:
   Copy `.env.local.example` to `.env.local`. Ensure `NEXT_PUBLIC_API_BASE_URL` points to your local backend (e.g., `http://localhost:8000/api/v1`).
4. Run the development server:
   ```bash
   pnpm dev
   ```
   The frontend will be available at [http://localhost:3000](http://localhost:3000).

## Default Accounts
The `seed.py` script automatically creates the following default accounts for testing:

- **Demo User** (Regular User)
  - Email: `demo@threatlens.local`
  - Password: `password123`
- **Admin User** (System Admin)
  - Email: `admin@threatlens.local`
  - Password: `admin123`

## Resetting the Database
To completely wipe and reset your local database:
1. Stop the backend server.
2. Delete the SQLite file: `rm threatlens.db`
3. Rerun the seed script: `python app/seed.py`
