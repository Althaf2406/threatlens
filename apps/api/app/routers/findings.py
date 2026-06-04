from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.finding import Finding

router = APIRouter()

@router.get("/projects/{project_id}/findings")
def get_findings(project_id: str, db: Session = Depends(get_db)):
    return db.query(Finding).filter(Finding.project_id == project_id).all()

@router.get("/projects/{project_id}/findings/{finding_id}")
def get_finding(project_id: str, finding_id: str, db: Session = Depends(get_db)):
    finding = db.query(Finding).filter(Finding.id == finding_id, Finding.project_id == project_id).first()
    if not finding:
        raise HTTPException(status_code=404, detail="Finding not found in this project")
    return finding
