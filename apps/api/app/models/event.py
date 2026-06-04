from sqlalchemy import Column, String, Boolean, DateTime, Integer, ForeignKey
from sqlalchemy.sql import func
from app.db.base import Base

class Event(Base):
    __tablename__ = "events"

    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("projects.id"))
    event_type = Column(String, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    user_label = Column(String, nullable=True)
    ip_address = Column(String, nullable=True)
    country = Column(String, nullable=True)
    device = Column(String, nullable=True)
    endpoint = Column(String, nullable=True)
    severity = Column(String, nullable=True)
    risk_score = Column(Integer, default=0)
    is_synthetic = Column(Boolean, default=False)
    scenario_id = Column(String, nullable=True)
