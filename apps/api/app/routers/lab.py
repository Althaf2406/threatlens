from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.db.database import get_db
from app.models.event import Event
from app.models.user import User
from app.dependencies.auth import get_current_user
from app.dependencies.ownership import get_owned_project_or_404
from app.services.synthetic_lab import SyntheticLab

router = APIRouter()

class GenerateRequest(BaseModel):
    scenario_id: str

@router.post("/projects/{project_id}/lab/generate")
def generate_lab_data(project_id: str, req: GenerateRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    get_owned_project_or_404(db, project_id, current_user)
    events = SyntheticLab.generate_events(db, project_id, req.scenario_id)
    # Save the generated events to DB
    for evt_data in events:
        new_event = Event(**evt_data)
        db.add(new_event)
    db.commit()
    return events

@router.get("/projects/{project_id}/events")
def get_events(project_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    get_owned_project_or_404(db, project_id, current_user)
    return db.query(Event).filter(Event.project_id == project_id).all()
