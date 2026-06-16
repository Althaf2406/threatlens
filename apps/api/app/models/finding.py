from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from app.db.base import Base

class Finding(Base):
    __tablename__ = "findings"

    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("projects.id"))
    asset_id = Column(String, ForeignKey("assets.id"), nullable=True)
    scan_id = Column(String, ForeignKey("scans.id"), nullable=True)
    rule_id = Column(String, ForeignKey("detection_rules.id"), nullable=True)
    rule_key = Column(String, nullable=True)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False)
    severity = Column(String, nullable=False)
    confidence = Column(String, nullable=False)
    blast_radius = Column(String, nullable=False)
    status = Column(String, default="Open")
    description = Column(Text, nullable=True)
    suggested_patch = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
