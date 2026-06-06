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

from pydantic import BaseModel
from typing import Optional

class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    environment: Optional[str] = "Development"
    risk_level: Optional[str] = "Low"

@router.post("/")
def create_project(project_in: ProjectCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Check project limit
    current_projects_count = db.query(Project).filter(Project.user_id == current_user.id).count()
    if current_projects_count >= current_user.project_limit:
        # Determine plan type for the error message
        plan_desc = "Free plan supports up to 3 projects." if current_user.plan_name == "free" else "Project limit reached."
        raise HTTPException(status_code=403, detail=f"Project limit reached for your current plan. {plan_desc}")
    
    from datetime import datetime
    import time
    new_project = Project(
        id=f"proj-{int(time.time()*1000)}",
        user_id=current_user.id,
        name=project_in.name,
        environment=project_in.environment,
        risk_level=project_in.risk_level,
        posture_score=100
    )
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    
    return new_project

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
