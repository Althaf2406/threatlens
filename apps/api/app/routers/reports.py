from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.report import Report

router = APIRouter()

@router.get("/projects/{project_id}/reports")
def get_reports(project_id: str, db: Session = Depends(get_db)):
    return db.query(Report).filter(Report.project_id == project_id).all()

@router.post("/projects/{project_id}/reports")
def generate_report(project_id: str):
    return {"msg": "Report generated"}
