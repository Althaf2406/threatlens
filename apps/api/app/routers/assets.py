from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.asset import Asset
from app.models.user import User
from app.schemas.asset import AssetCreate, AssetUpdate, Asset as AssetSchema
from app.dependencies.auth import get_current_user
from app.dependencies.ownership import get_owned_project_or_404, get_owned_asset_or_404
from app.services.passive_checker import PassiveChecker
import uuid
from datetime import datetime

router = APIRouter()

@router.get("/projects/{project_id}/assets", response_model=list[AssetSchema])
def get_assets(project_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    get_owned_project_or_404(db, project_id, current_user)
    return db.query(Asset).filter(Asset.project_id == project_id).all()

@router.post("/projects/{project_id}/assets", response_model=AssetSchema)
def create_asset(project_id: str, asset: AssetCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    get_owned_project_or_404(db, project_id, current_user)
    db_asset = Asset(
        id=f"ast-{uuid.uuid4().hex[:8]}",
        project_id=project_id,
        **asset.dict()
    )
    db.add(db_asset)
    db.commit()
    db.refresh(db_asset)
    return db_asset

@router.get("/projects/{project_id}/assets/{asset_id}", response_model=AssetSchema)
def get_asset(project_id: str, asset_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    get_owned_project_or_404(db, project_id, current_user)
    asset = get_owned_asset_or_404(db, asset_id, current_user)
    if asset.project_id != project_id:
        raise HTTPException(status_code=404, detail="Asset not found in this project")
    return asset

@router.put("/projects/{project_id}/assets/{asset_id}", response_model=AssetSchema)
def update_asset(project_id: str, asset_id: str, asset_update: AssetUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    get_owned_project_or_404(db, project_id, current_user)
    asset = get_owned_asset_or_404(db, asset_id, current_user)
    if asset.project_id != project_id:
        raise HTTPException(status_code=404, detail="Asset not found in this project")
    
    update_data = asset_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(asset, key, value)
    
    db.commit()
    db.refresh(asset)
    return asset

@router.delete("/projects/{project_id}/assets/{asset_id}")
def delete_asset(project_id: str, asset_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    get_owned_project_or_404(db, project_id, current_user)
    asset = get_owned_asset_or_404(db, asset_id, current_user)
    if asset.project_id != project_id:
        raise HTTPException(status_code=404, detail="Asset not found in this project")
    
    db.delete(asset)
    db.commit()
    return {"msg": "Asset deleted"}

@router.post("/projects/{project_id}/assets/{asset_id}/confirm-ownership", response_model=AssetSchema)
def confirm_ownership(project_id: str, asset_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    get_owned_project_or_404(db, project_id, current_user)
    asset = get_owned_asset_or_404(db, asset_id, current_user)
    if asset.project_id != project_id:
        raise HTTPException(status_code=404, detail="Asset not found in this project")
    
    asset.ownership_confirmed = True
    db.commit()
    db.refresh(asset)
    return asset

@router.post("/projects/{project_id}/assets/{asset_id}/passive-check")
def passive_check(project_id: str, asset_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    get_owned_project_or_404(db, project_id, current_user)
    asset = get_owned_asset_or_404(db, asset_id, current_user)
    if asset.project_id != project_id:
        raise HTTPException(status_code=404, detail="Asset not found in this project")
    
    if not asset.ownership_confirmed:
        raise HTTPException(status_code=400, detail="Asset ownership must be confirmed before running passive checks.")
    
    result = PassiveChecker.run_check(db, project_id, asset_id, asset.type)
    
    asset.last_checked_at = datetime.utcnow()
    db.commit()
    
    return result
