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
    onboarding_completed: bool
    onboarding_completed_at: Optional[datetime] = None
    onboarding_step: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class OnboardingProgressUpdate(BaseModel):
    step: str
