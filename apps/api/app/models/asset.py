from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from app.db.base import Base

class Asset(Base):
    __tablename__ = "assets"

    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("projects.id"))
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)
    value = Column(String, nullable=False)
    environment = Column(String, default="Production")
    description = Column(Text, nullable=True)
    tags_json = Column(Text, nullable=True)
    risk_level = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    ownership_confirmed = Column(Boolean, default=False)
    status = Column(String, default="Ready")
    last_checked_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
