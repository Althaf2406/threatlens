from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.remediation import RemediationTask

router = APIRouter()

@router.get("/projects/{project_id}/remediation")
def get_remediation_tasks(project_id: str, db: Session = Depends(get_db)):
    return db.query(RemediationTask).filter(RemediationTask.project_id == project_id).all()

@router.put("/projects/{project_id}/remediation/{task_id}")
def update_remediation_task(project_id: str, task_id: str, db: Session = Depends(get_db)):
    task = db.query(RemediationTask).filter(RemediationTask.id == task_id, RemediationTask.project_id == project_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found in this project")
    task.status = "closed"
    db.commit()
    return task
