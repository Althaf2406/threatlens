from fastapi import APIRouter, Depends
from typing import List

router = APIRouter()

@router.get("/projects/{project_id}/reports")
def get_reports(project_id: str):
    return []

@router.post("/projects/{project_id}/reports")
def generate_report(project_id: str):
    return {"msg": "Report generated"}
