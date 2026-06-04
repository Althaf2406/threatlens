from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.finding import Finding
from app.models.user import User
from app.dependencies.auth import get_current_user
from app.dependencies.ownership import get_owned_project_or_404, get_owned_finding_or_404

router = APIRouter()

@router.get("/projects/{project_id}/findings")
def get_findings(project_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    get_owned_project_or_404(db, project_id, current_user)
    return db.query(Finding).filter(Finding.project_id == project_id).all()

@router.get("/projects/{project_id}/findings/{finding_id}")
def get_finding(project_id: str, finding_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_owned_finding_or_404(db, project_id, finding_id, current_user)
