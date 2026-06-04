from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    name: str
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: str
    role: str
    plan_name: str
    project_limit: int
    token_limit: int
    created_at: datetime

    class Config:
        from_attributes = True
