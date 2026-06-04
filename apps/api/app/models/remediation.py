from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.db.base import Base

class RemediationTask(Base):
    __tablename__ = "remediation_tasks"

    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("projects.id"))
    finding_id = Column(String, ForeignKey("findings.id"))
    title = Column(String, nullable=False)
    status = Column(String, default="open")
    priority = Column(String, default="Medium")
    due_date = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
