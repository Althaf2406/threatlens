from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.project import Project

router = APIRouter()

@router.get("/")
def get_projects(db: Session = Depends(get_db)):
    return db.query(Project).all()

@router.post("/")
def create_project():
    return {"msg": "Project created"}

@router.get("/{project_id}")
def get_project(project_id: str, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.put("/{project_id}")
def update_project(project_id: str):
    return {"msg": "Project updated"}

@router.delete("/{project_id}")
def delete_project(project_id: str):
    return {"msg": "Project deleted"}
