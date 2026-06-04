from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.detection_rule import DetectionRule
from app.models.user import User
from app.dependencies.auth import get_current_user

router = APIRouter()

@router.get("/usage")
def get_usage(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return {"project_limit": current_user.project_limit, "token_limit": current_user.token_limit}

@router.get("/detection-rules")
def get_detection_rules(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(DetectionRule).all()

@router.put("/detection-rules/{rule_id}")
def update_detection_rule(rule_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return {"msg": "Rule updated"}
