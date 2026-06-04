from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.event import Event
from app.services.synthetic_lab import SyntheticLab

router = APIRouter()

class GenerateRequest(BaseModel):
    scenario_id: str

@router.post("/projects/{project_id}/lab/generate")
def generate_events(project_id: str, req: GenerateRequest, db: Session = Depends(get_db)):
    events_data = SyntheticLab.generate_events(project_id, req.scenario_id)
    created = []
    for ed in events_data:
        ev = Event(**ed)
        db.add(ev)
        created.append(ev)
    db.commit()
    return {"msg": "Synthetic events generated", "events": created}

@router.get("/projects/{project_id}/events")
def get_events(project_id: str, db: Session = Depends(get_db)):
    return db.query(Event).filter(Event.project_id == project_id).all()
