from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class RemediationTaskBase(BaseModel):
    pass

class RemediationTaskCreate(RemediationTaskBase):
    pass

class RemediationTask(RemediationTaskBase):
    id: str
    class Config:
        from_attributes = True
