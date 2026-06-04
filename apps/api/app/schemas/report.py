from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ReportBase(BaseModel):
    pass

class ReportCreate(ReportBase):
    pass

class Report(ReportBase):
    id: str
    class Config:
        from_attributes = True
