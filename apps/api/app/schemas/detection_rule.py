from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class DetectionRuleBase(BaseModel):
    name: str
    key: str
    category: str
    description: Optional[str] = None
    enabled: bool = True
    severity: str = "Medium"
    confidence_base: str = "Medium"
    threshold_json: Optional[str] = None
    defensive_only: bool = True

class DetectionRuleUpdate(BaseModel):
    description: Optional[str] = None
    enabled: Optional[bool] = None
    severity: Optional[str] = None
    confidence_base: Optional[str] = None
    threshold_json: Optional[str] = None

class DetectionRuleResponse(DetectionRuleBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
