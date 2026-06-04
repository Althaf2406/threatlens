from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class EvidenceBase(BaseModel):
    pass

class EvidenceCreate(EvidenceBase):
    pass

class Evidence(EvidenceBase):
    id: str
    class Config:
        from_attributes = True
