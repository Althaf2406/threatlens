from fastapi import APIRouter, Depends
from typing import List

router = APIRouter()

@router.get("/projects/{project_id}/standards")
def get_standards(project_id: str):
    return []
