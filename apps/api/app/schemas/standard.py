from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class StandardMappingBase(BaseModel):
    pass

class StandardMappingCreate(StandardMappingBase):
    pass

class StandardMapping(StandardMappingBase):
    id: str
    class Config:
        from_attributes = True
