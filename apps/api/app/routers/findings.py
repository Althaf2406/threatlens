from fastapi import APIRouter, Depends
from typing import List

router = APIRouter()

@router.get("/projects/{project_id}/findings")
def get_findings(project_id: str):
    return []

@router.get("/projects/{project_id}/findings/{finding_id}")
def get_finding(project_id: str, finding_id: str):
    return {"id": finding_id}
