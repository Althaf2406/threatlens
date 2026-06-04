from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ScanBase(BaseModel):
    pass

class ScanCreate(ScanBase):
    pass

class Scan(ScanBase):
    id: str
    class Config:
        from_attributes = True
