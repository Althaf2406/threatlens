from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.detection_rule import DetectionRule
from app.models.user import User
from app.dependencies.auth import get_current_user
from app.schemas.detection_rule import DetectionRuleUpdate, DetectionRuleResponse
from typing import List

router = APIRouter()

@router.get("/usage")
def get_usage(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return {"project_limit": current_user.project_limit, "token_limit": current_user.token_limit}

@router.get("/detection-rules", response_model=List[DetectionRuleResponse])
def get_detection_rules(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only administrators can view detection rules.")
    return db.query(DetectionRule).all()

@router.get("/detection-rules/{rule_id}", response_model=DetectionRuleResponse)
def get_detection_rule(rule_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only administrators can view detection rules.")
    rule = db.query(DetectionRule).filter(DetectionRule.id == rule_id).first()
    if not rule:
        raise HTTPException(status_code=404, detail="Detection rule not found")
    return rule

@router.put("/detection-rules/{rule_id}", response_model=DetectionRuleResponse)
def update_detection_rule(rule_id: str, update_data: DetectionRuleUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only administrators can modify detection rules.")
    
    rule = db.query(DetectionRule).filter(DetectionRule.id == rule_id).first()
    if not rule:
        raise HTTPException(status_code=404, detail="Detection rule not found")
        
    update_dict = update_data.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(rule, key, value)
        
    db.commit()
    db.refresh(rule)
    return rule

@router.post("/detection-rules/{rule_id}/reset", response_model=DetectionRuleResponse)
def reset_detection_rule(rule_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only administrators can modify detection rules.")
    
    rule = db.query(DetectionRule).filter(DetectionRule.id == rule_id).first()
    if not rule:
        raise HTTPException(status_code=404, detail="Detection rule not found")
        
    # In a real system, we'd fetch the default from a config or seed data.
    # For now, we'll just enable it and set generic defaults.
    rule.enabled = True
    rule.severity = "Medium"
    rule.confidence_base = "Medium"
    # We leave threshold_json as is or we'd need a default registry.
    
    db.commit()
    db.refresh(rule)
    return rule
