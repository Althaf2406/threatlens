from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.user import User
from app.models.project import Project
from app.models.asset import Asset
from app.models.finding import Finding

def get_owned_project_or_404(db: Session, project_id: str, current_user: User) -> Project:
    project = db.query(Project).filter(Project.id == project_id).first()
    
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
        
    if current_user.role not in ["admin", "system_admin"] and project.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
        
    return project

def get_owned_asset_or_404(db: Session, asset_id: str, current_user: User) -> Asset:
    asset = db.query(Asset).filter(Asset.id == asset_id).first()
    
    if not asset:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Asset not found")
        
    # verify project ownership
    get_owned_project_or_404(db, asset.project_id, current_user)
    
    return asset

def get_owned_finding_or_404(db: Session, project_id: str, finding_id: str, current_user: User) -> Finding:
    finding = db.query(Finding).filter(Finding.id == finding_id, Finding.project_id == project_id).first()
    
    if not finding:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Finding not found")
        
    # verify project ownership
    get_owned_project_or_404(db, project_id, current_user)
    
    return finding
