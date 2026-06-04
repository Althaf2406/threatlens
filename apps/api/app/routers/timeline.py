from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.event import Event

router = APIRouter()

@router.get("/projects/{project_id}/timeline")
def get_timeline(project_id: str, db: Session = Depends(get_db)):
    return db.query(Event).filter(Event.project_id == project_id).order_by(Event.timestamp.desc()).all()
