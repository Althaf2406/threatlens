from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.standard import StandardMapping
from app.models.finding import Finding
from app.models.user import User
from app.dependencies.auth import get_current_user
from app.dependencies.ownership import get_owned_project_or_404

router = APIRouter()

@router.get("/projects/{project_id}/standards")
def get_standards(project_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    get_owned_project_or_404(db, project_id, current_user)
    return db.query(StandardMapping).join(Finding, StandardMapping.finding_id == Finding.id).filter(Finding.project_id == project_id).all()
