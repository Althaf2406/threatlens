from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.detection_rule import DetectionRule
from app.models.user import User

router = APIRouter()

@router.get("/usage")
def get_usage(db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == "usr-001").first()
    if user:
        return {"project_limit": user.project_limit, "token_limit": user.token_limit}
    return {"project_limit": 3, "token_limit": 1000}

@router.get("/detection-rules")
def get_detection_rules(db: Session = Depends(get_db)):
    return db.query(DetectionRule).all()

@router.put("/detection-rules/{rule_id}")
def update_detection_rule(rule_id: str):
    return {"msg": "Rule updated"}
