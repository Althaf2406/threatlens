from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db
from app.models.user import User
from app.models.project import Project
from app.models.ai_summary import AISummary
from app.schemas.ai_summary import AISummaryResponse, AISummaryCreateRequest
from app.dependencies.auth import get_current_user
from app.dependencies.ownership import get_owned_project_or_404
from app.services.ai_investigator import generate_summary

router = APIRouter()

@router.get("/{project_id}/ai-summaries", response_model=List[AISummaryResponse])
def list_ai_summaries(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    get_owned_project_or_404(db, project_id, current_user)
    summaries = db.query(AISummary).filter(AISummary.project_id == project_id).all()
    return summaries

@router.post("/{project_id}/ai-summaries", response_model=AISummaryResponse)
def create_ai_summary(
    project_id: str,
    request: AISummaryCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    get_owned_project_or_404(db, project_id, current_user)
    
    # Determine cost based on request
    cost = 100 if request.finding_id else 250
    
    # Check tokens
    if current_user.token_used + cost > current_user.token_limit:
        raise HTTPException(status_code=403, detail="Not enough AI tokens. You can use local template mode or reduce report scope.")
    
    try:
        summary = generate_summary(db, project_id, request)
        # Deduct tokens
        current_user.token_used += cost
        project = db.query(Project).filter(Project.id == project_id).first()
        if project:
            if not project.token_used:
                project.token_used = 0
            project.token_used += cost
        db.commit()
        return summary
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{project_id}/ai-summaries/{summary_id}", response_model=AISummaryResponse)
def get_ai_summary(
    project_id: str,
    summary_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    get_owned_project_or_404(db, project_id, current_user)
    summary = db.query(AISummary).filter(AISummary.id == summary_id, AISummary.project_id == project_id).first()
    if not summary:
        raise HTTPException(status_code=404, detail="AI summary not found")
    return summary
