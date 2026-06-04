from fastapi import APIRouter, Depends
from typing import List

router = APIRouter()

@router.get("/")
def get_projects():
    return []

@router.post("/")
def create_project():
    return {"msg": "Project created"}

@router.get("/{project_id}")
def get_project(project_id: str):
    return {"id": project_id, "name": "Mock Project"}

@router.put("/{project_id}")
def update_project(project_id: str):
    return {"msg": "Project updated"}

@router.delete("/{project_id}")
def delete_project(project_id: str):
    return {"msg": "Project deleted"}
