from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ScanBase(BaseModel):
    scan_type: str
    status: Optional[str] = "pending"
    summary: Optional[str] = None
    posture_score: Optional[int] = 100
    total_findings: Optional[int] = 0
    high_findings: Optional[int] = 0
    medium_findings: Optional[int] = 0
    low_findings: Optional[int] = 0
    fixed_findings: Optional[int] = 0

class ScanCreate(ScanBase):
    project_id: str
    asset_id: Optional[str] = None

class Scan(ScanBase):
    id: str
    project_id: str
    asset_id: Optional[str] = None
    started_at: Optional[datetime] = None
    finished_at: Optional[datetime] = None
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
