from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.asset import Asset
from app.models.user import User
from app.dependencies.auth import get_current_user
from app.dependencies.ownership import get_owned_project_or_404, get_owned_asset_or_404
from app.services.passive_checker import PassiveChecker

router = APIRouter()

@router.get("/projects/{project_id}/assets")
def get_assets(project_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    get_owned_project_or_404(db, project_id, current_user)
    return db.query(Asset).filter(Asset.project_id == project_id).all()

@router.post("/projects/{project_id}/assets")
def create_asset(project_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    get_owned_project_or_404(db, project_id, current_user)
    return {"msg": "Asset created"}

@router.put("/assets/{asset_id}")
def update_asset(asset_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    get_owned_asset_or_404(db, asset_id, current_user)
    return {"msg": "Asset updated"}

@router.delete("/assets/{asset_id}")
def delete_asset(asset_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    get_owned_asset_or_404(db, asset_id, current_user)
    return {"msg": "Asset deleted"}

@router.post("/projects/{project_id}/assets/{asset_id}/passive-check")
def passive_check(project_id: str, asset_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    get_owned_project_or_404(db, project_id, current_user)
    asset = get_owned_asset_or_404(db, asset_id, current_user)
    if asset.project_id != project_id:
        raise HTTPException(status_code=404, detail="Asset not found in this project")
    
    result = PassiveChecker.run_check(project_id, asset_id, asset.type)
    return result
