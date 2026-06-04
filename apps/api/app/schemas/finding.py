from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class FindingBase(BaseModel):
    pass

class FindingCreate(FindingBase):
    pass

class Finding(FindingBase):
    id: str
    class Config:
        from_attributes = True
