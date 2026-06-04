from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.project import Project
from app.models.user import User
from app.dependencies.auth import get_current_user
from app.dependencies.ownership import get_owned_project_or_404

router = APIRouter()

@router.get("/")
def get_projects(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role in ["admin", "system_admin"]:
        return db.query(Project).all()
    return db.query(Project).filter(Project.user_id == current_user.id).all()

@router.post("/")
def create_project(current_user: User = Depends(get_current_user)):
    return {"msg": "Project created"}

@router.get("/{project_id}")
def get_project(project_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_owned_project_or_404(db, project_id, current_user)

@router.put("/{project_id}")
def update_project(project_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    project = get_owned_project_or_404(db, project_id, current_user)
    return {"msg": "Project updated"}

@router.delete("/{project_id}")
def delete_project(project_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    project = get_owned_project_or_404(db, project_id, current_user)
    return {"msg": "Project deleted"}
