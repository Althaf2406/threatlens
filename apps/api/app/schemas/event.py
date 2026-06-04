from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class EventBase(BaseModel):
    pass

class EventCreate(EventBase):
    pass

class Event(EventBase):
    id: str
    class Config:
        from_attributes = True
