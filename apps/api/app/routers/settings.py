from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.detection_rule import DetectionRule
from app.models.user import User
from app.dependencies.auth import get_current_user
from app.schemas.detection_rule import DetectionRuleUpdate, DetectionRuleResponse
from app.models.standard import SecurityStandard, SecurityControl
from app.schemas.standard import (
    SecurityStandard as SecurityStandardSchema,
    SecurityStandardCreate,
    SecurityStandardUpdate,
    SecurityControl as SecurityControlSchema,
    SecurityControlCreate,
    SecurityControlUpdate,
    SecurityStandardImport
)
import uuid
from typing import List

router = APIRouter()

from pydantic import BaseModel
class AIModeUpdate(BaseModel):
    ai_mode: str

@router.get("/usage")
def get_usage(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return {
        "plan_name": current_user.plan_name,
        "project_limit": current_user.project_limit,
        "token_limit": current_user.token_limit,
        "token_used": current_user.token_used,
        "ai_mode": current_user.ai_mode,
    }

@router.put("/ai-mode")
def update_ai_mode(payload: AIModeUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    valid_modes = ["template_local", "ollama_local", "lm_studio_local", "openai_api", "gemini_api", "groq_api"]
    if payload.ai_mode not in valid_modes:
        raise HTTPException(status_code=400, detail="Invalid AI mode")
    current_user.ai_mode = payload.ai_mode
    db.commit()
    db.refresh(current_user)
    return {"message": "AI mode updated successfully", "ai_mode": current_user.ai_mode}

@router.get("/plans")
def get_plans():
    return {
        "FREE_PLAN": {
            "name": "Free Student",
            "projectLimit": 3,
            "tokenLimit": 1000,
            "price": "Rp0"
        },
        "PRO_PLAN": {
            "name": "Pro",
            "projectLimit": 5,
            "tokenLimit": 10000,
            "price": "optional / later"
        },
        "ADMIN_PLAN": {
            "name": "Admin",
            "projectLimit": 10,
            "tokenLimit": 50000,
            "price": "custom"
        }
    }

@router.get("/detection-rules", response_model=List[DetectionRuleResponse])
def get_detection_rules(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role not in ["admin", "system_admin"]:
        raise HTTPException(status_code=403, detail="Only administrators can view detection rules.")
    return db.query(DetectionRule).all()

@router.get("/detection-rules/{rule_id}", response_model=DetectionRuleResponse)
def get_detection_rule(rule_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role not in ["admin", "system_admin"]:
        raise HTTPException(status_code=403, detail="Only administrators can view detection rules.")
    rule = db.query(DetectionRule).filter(DetectionRule.id == rule_id).first()
    if not rule:
        raise HTTPException(status_code=404, detail="Detection rule not found")
    return rule

@router.put("/detection-rules/{rule_id}", response_model=DetectionRuleResponse)
def update_detection_rule(rule_id: str, update_data: DetectionRuleUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role not in ["admin", "system_admin"]:
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
    if current_user.role not in ["admin", "system_admin"]:
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

# Standards Management Endpoints
@router.get("/security-standards", response_model=List[SecurityStandardSchema])
def get_security_standards(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Everyone might need to list standards, or just admin? The requirement says:
    # admin-only atau read-only untuk user jika diperlukan. We'll allow read-only for all logged in users.
    standards = db.query(SecurityStandard).all()
    # Populate controls manually if needed, or rely on relationship if we add it. 
    # Let's fetch controls for each standard.
    for std in standards:
        std.controls = db.query(SecurityControl).filter(SecurityControl.standard_id == std.id).all()
    return standards

@router.get("/security-standards/{standard_id}", response_model=SecurityStandardSchema)
def get_security_standard(standard_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    std = db.query(SecurityStandard).filter(SecurityStandard.id == standard_id).first()
    if not std:
        raise HTTPException(status_code=404, detail="Standard not found")
    std.controls = db.query(SecurityControl).filter(SecurityControl.standard_id == std.id).all()
    return std

@router.post("/security-standards", response_model=SecurityStandardSchema)
def create_security_standard(payload: SecurityStandardCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role not in ["admin", "system_admin"]:
        raise HTTPException(status_code=403, detail="Only administrators can manage security standards.")
    
    new_std = SecurityStandard(
        id=str(uuid.uuid4()),
        **payload.model_dump()
    )
    db.add(new_std)
    db.commit()
    db.refresh(new_std)
    new_std.controls = []
    return new_std

@router.put("/security-standards/{standard_id}", response_model=SecurityStandardSchema)
def update_security_standard(standard_id: str, payload: SecurityStandardUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role not in ["admin", "system_admin"]:
        raise HTTPException(status_code=403, detail="Only administrators can manage security standards.")
    
    std = db.query(SecurityStandard).filter(SecurityStandard.id == standard_id).first()
    if not std:
        raise HTTPException(status_code=404, detail="Standard not found")
        
    update_data = payload.model_dump(exclude_unset=True)
    for k, v in update_data.items():
        setattr(std, k, v)
        
    db.commit()
    db.refresh(std)
    std.controls = db.query(SecurityControl).filter(SecurityControl.standard_id == std.id).all()
    return std

@router.post("/security-standards/{standard_id}/controls", response_model=SecurityControlSchema)
def add_security_control(standard_id: str, payload: SecurityControlCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role not in ["admin", "system_admin"]:
        raise HTTPException(status_code=403, detail="Only administrators can manage security controls.")
    
    std = db.query(SecurityStandard).filter(SecurityStandard.id == standard_id).first()
    if not std:
        raise HTTPException(status_code=404, detail="Standard not found")
        
    new_ctrl = SecurityControl(
        id=str(uuid.uuid4()),
        standard_id=standard_id,
        **payload.model_dump()
    )
    db.add(new_ctrl)
    db.commit()
    db.refresh(new_ctrl)
    return new_ctrl

@router.put("/security-controls/{control_id}", response_model=SecurityControlSchema)
def update_security_control(control_id: str, payload: SecurityControlUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role not in ["admin", "system_admin"]:
        raise HTTPException(status_code=403, detail="Only administrators can manage security controls.")
        
    ctrl = db.query(SecurityControl).filter(SecurityControl.id == control_id).first()
    if not ctrl:
        raise HTTPException(status_code=404, detail="Control not found")
        
    update_data = payload.model_dump(exclude_unset=True)
    for k, v in update_data.items():
        setattr(ctrl, k, v)
        
    db.commit()
    db.refresh(ctrl)
    return ctrl

@router.post("/security-standards/import", response_model=SecurityStandardSchema)
def import_security_standards(payload: SecurityStandardImport, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role not in ["admin", "system_admin"]:
        raise HTTPException(status_code=403, detail="Only administrators can manage security standards.")
        
    std_data = payload.model_dump(exclude={"controls"})
    new_std = SecurityStandard(
        id=str(uuid.uuid4()),
        **std_data
    )
    db.add(new_std)
    
    controls = []
    for c in payload.controls:
        new_ctrl = SecurityControl(
            id=str(uuid.uuid4()),
            standard_id=new_std.id,
            **c.model_dump()
        )
        db.add(new_ctrl)
        controls.append(new_ctrl)
        
    db.commit()
    db.refresh(new_std)
    new_std.controls = controls
    return new_std

@router.post("/security-standards/{standard_id}/activate")
def activate_security_standard(standard_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role not in ["admin", "system_admin"]:
        raise HTTPException(status_code=403, detail="Only administrators can manage security standards.")
        
    std = db.query(SecurityStandard).filter(SecurityStandard.id == standard_id).first()
    if not std:
        raise HTTPException(status_code=404, detail="Standard not found")
        
    # Deactivate other standards with the same framework
    db.query(SecurityStandard).filter(SecurityStandard.framework == std.framework).update({"is_active": False})
    std.is_active = True
    db.commit()
    
    return {"message": f"Standard {std.framework} {std.version} activated successfully."}
