from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.standard import StandardMapping
from app.models.finding import Finding

router = APIRouter()

@router.get("/projects/{project_id}/standards")
def get_standards(project_id: str, db: Session = Depends(get_db)):
    findings = db.query(Finding.id).filter(Finding.project_id == project_id).subquery()
    return db.query(StandardMapping).filter(StandardMapping.finding_id.in_(findings)).all()
