from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from app.db.base import Base

class Scan(Base):
    __tablename__ = "scans"

    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("projects.id"))
    asset_id = Column(String, ForeignKey("assets.id"), nullable=True)
    scan_type = Column(String, nullable=False)
    status = Column(String, default="pending")
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    finished_at = Column(DateTime(timezone=True), nullable=True)
    summary = Column(Text, nullable=True)
