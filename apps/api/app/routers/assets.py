from fastapi import APIRouter, Depends
from typing import List

router = APIRouter()

@router.get("/projects/{project_id}/assets")
def get_assets(project_id: str):
    return []

@router.post("/projects/{project_id}/assets")
def create_asset(project_id: str):
    return {"msg": "Asset created"}

@router.put("/{asset_id}")
def update_asset(asset_id: str):
    return {"msg": "Asset updated"}

@router.delete("/{asset_id}")
def delete_asset(asset_id: str):
    return {"msg": "Asset deleted"}

@router.post("/projects/{project_id}/assets/{asset_id}/passive-check")
def passive_check(project_id: str, asset_id: str):
    return {"msg": "Passive check simulated"}
