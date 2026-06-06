from sqlalchemy import Column, String, Integer, DateTime, Boolean
from sqlalchemy.sql import func
from app.db.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="user")
    plan_name = Column(String, default="free")
    project_limit = Column(Integer, default=3)
    token_limit = Column(Integer, default=1000)
    token_used = Column(Integer, default=0)
    ai_mode = Column(String, default="template_local")
    onboarding_completed = Column(Boolean, default=False)
    onboarding_completed_at = Column(DateTime(timezone=True), nullable=True)
    onboarding_step = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
