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
    token_used: int
    ai_mode: str
    onboarding_completed: bool
    onboarding_completed_at: Optional[datetime] = None
    onboarding_step: Optional[str] = None
    email_verified: bool
    account_status: str
    created_at: datetime

    class Config:
        from_attributes = True

class OnboardingProgressUpdate(BaseModel):
    step: str
