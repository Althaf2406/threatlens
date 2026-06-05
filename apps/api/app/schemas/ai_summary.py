from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class AISummaryBase(BaseModel):
    title: str
    summary_type: str
    claim_status: str
    executive_summary: str
    what_happened: str
    evidence_considered_json: str
    confidence_explanation: str
    impact_blast_radius: str
    recommended_remediation_json: str
    unknowns_and_limitations: str
    safety_boundary: str

class AISummaryResponse(AISummaryBase):
    id: str
    project_id: str
    finding_id: Optional[str] = None
    created_at: datetime

    class Config:
        orm_mode = True

class AISummaryCreateRequest(BaseModel):
    summary_type: str
    finding_id: Optional[str] = None
