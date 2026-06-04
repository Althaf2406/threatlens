from sqlalchemy import Column, String, Boolean, Integer, Text
from app.db.base import Base

class DetectionRule(Base):
    __tablename__ = "detection_rules"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    enabled = Column(Boolean, default=True)
    threshold = Column(Integer, default=50)
    description = Column(Text, nullable=True)
