from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.db.database import get_db
from app.models.report import Report
from app.models.user import User
from app.dependencies.auth import get_current_user
from app.dependencies.ownership import get_owned_project_or_404
from app.services.report_generator import ReportGenerator

router = APIRouter()

class GenerateReportReq(BaseModel):
    type: str

@router.get("/projects/{project_id}/reports")
def get_reports(project_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    get_owned_project_or_404(db, project_id, current_user)
    return db.query(Report).filter(Report.project_id == project_id).all()

@router.post("/projects/{project_id}/reports")
def generate_report(project_id: str, req: GenerateReportReq, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    get_owned_project_or_404(db, project_id, current_user)
    result = ReportGenerator.generate(project_id, req.type, db)
    return result
