from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ProjectBase(BaseModel):
    pass

class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase):
    id: str
    class Config:
        from_attributes = True
