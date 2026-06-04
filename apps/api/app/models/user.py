from sqlalchemy import Column, String, Integer, DateTime
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
    created_at = Column(DateTime(timezone=True), server_default=func.now())
