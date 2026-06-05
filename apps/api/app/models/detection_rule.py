from sqlalchemy import Column, String, Boolean, Text, DateTime
from sqlalchemy.sql import func
from app.db.base import Base

class DetectionRule(Base):
    __tablename__ = "detection_rules"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    key = Column(String, nullable=False, unique=True, index=True)
    category = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    enabled = Column(Boolean, default=True)
    severity = Column(String, default="Medium")
    confidence_base = Column(String, default="Medium")
    threshold_json = Column(Text, nullable=True) # Storing JSON string
    defensive_only = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
