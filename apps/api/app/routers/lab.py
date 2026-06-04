from fastapi import APIRouter, Depends
from typing import List

router = APIRouter()

@router.post("/projects/{project_id}/lab/generate")
def generate_events(project_id: str):
    return {"msg": "Synthetic events generated"}

@router.get("/projects/{project_id}/events")
def get_events(project_id: str):
    return []
