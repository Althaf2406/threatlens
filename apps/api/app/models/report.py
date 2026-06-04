from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from app.db.base import Base

class Report(Base):
    __tablename__ = "reports"

    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("projects.id"))
    title = Column(String, nullable=False)
    type = Column(String, nullable=False)
    summary = Column(Text, nullable=True)
    status = Column(String, default="Ready")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
