from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routers import (
    auth, projects, assets, scans, findings, 
    timeline, graph, lab, remediation, standards, reports, settings as api_settings,
    ai_investigation, ci_cd
)
from app.db.base import Base
from app.db.database import engine
import app.models  # This ensures models are registered with Base

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_ORIGIN, "http://127.0.0.1:3000", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok"}

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(projects.router, prefix="/projects", tags=["Projects"])
app.include_router(assets.router, tags=["Assets"])
app.include_router(scans.router, tags=["Scans"])
app.include_router(findings.router, tags=["Findings"])
app.include_router(timeline.router, tags=["Timeline"])
app.include_router(graph.router, tags=["Graph"])
app.include_router(lab.router, tags=["Lab"])
app.include_router(remediation.router, tags=["Remediation"])
app.include_router(standards.router, tags=["Standards"])
app.include_router(reports.router, tags=["Reports"])
app.include_router(api_settings.router, prefix="/settings", tags=["Settings"])
app.include_router(ai_investigation.router, prefix="/projects", tags=["AI Investigation"])
app.include_router(ci_cd.router, prefix=f"{settings.API_V1_STR}", tags=["CI/CD Integration"])
