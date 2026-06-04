from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.db.database import get_db
from app.models.remediation import RemediationTask
from app.models.user import User
from app.dependencies.auth import get_current_user
from app.dependencies.ownership import get_owned_project_or_404

router = APIRouter()

class StatusUpdate(BaseModel):
    status: str

@router.get("/projects/{project_id}/remediation")
def get_remediation_tasks(project_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    get_owned_project_or_404(db, project_id, current_user)
    return db.query(RemediationTask).filter(RemediationTask.project_id == project_id).all()

@router.put("/projects/{project_id}/remediation/{task_id}")
def update_task_status(project_id: str, task_id: str, req: StatusUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    get_owned_project_or_404(db, project_id, current_user)
    task = db.query(RemediationTask).filter(RemediationTask.id == task_id, RemediationTask.project_id == project_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task.status = req.status
    db.commit()
    return {"msg": "Task updated"}
