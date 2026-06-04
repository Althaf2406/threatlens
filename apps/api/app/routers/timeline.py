from fastapi import APIRouter, Depends
from typing import List

router = APIRouter()

@router.get("/projects/{project_id}/timeline")
def get_timeline(project_id: str):
    return []
