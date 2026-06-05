from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.project import Project
from app.models.user import User
from app.models.finding import Finding
from app.models.standard import StandardMapping
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

@router.get("/{project_id}/standards")
def get_project_standards(project_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    project = get_owned_project_or_404(db, project_id, current_user)
    
    # Get all standard mappings for findings in this project
    mappings = db.query(StandardMapping).join(Finding, StandardMapping.finding_id == Finding.id).filter(Finding.project_id == project_id).all()
    
    result = []
    for mapping in mappings:
        finding = db.query(Finding).filter(Finding.id == mapping.finding_id).first()
        result.append({
            "id": mapping.id,
            "finding_id": mapping.finding_id,
            "finding_title": finding.title if finding else "Unknown",
            "finding_severity": finding.severity if finding else "Unknown",
            "standard_id": mapping.standard_id,
            "control_id": mapping.control_id,
            "framework": mapping.framework,
            "standard_version": mapping.standard_version,
            "mapping_reason": mapping.mapping_reason,
            "description": mapping.description,
            "created_at": mapping.created_at
        })
    return result
