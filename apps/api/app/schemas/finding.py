from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class FindingBase(BaseModel):
    title: str
    category: str
    severity: str
    confidence: str
    blast_radius: str
    description: Optional[str] = None
    status: str = "Open"
    rule_id: Optional[str] = None
    rule_key: Optional[str] = None

class FindingCreate(FindingBase):
    project_id: str
    asset_id: Optional[str] = None
    scan_id: Optional[str] = None

class FindingResponse(FindingBase):
    id: str
    project_id: str
    asset_id: Optional[str] = None
    scan_id: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
