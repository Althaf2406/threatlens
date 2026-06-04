from fastapi import APIRouter, Depends
from typing import List

router = APIRouter()

@router.get("/projects/{project_id}/graph")
def get_graph(project_id: str):
    return {"nodes": [], "edges": []}
