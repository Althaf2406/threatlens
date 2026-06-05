from sqlalchemy import Column, String, ForeignKey, Text, DateTime
from datetime import datetime
from app.db.base import Base

class AISummary(Base):
    __tablename__ = "ai_summaries"

    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    finding_id = Column(String, ForeignKey("findings.id"), nullable=True)
    title = Column(String, nullable=False)
    summary_type = Column(String, nullable=False)  # "project" | "finding" | "report"
    claim_status = Column(String, nullable=False)  # "confirmed" | "suspected" | "informational" | "insufficient_evidence"
    executive_summary = Column(Text, nullable=False)
    what_happened = Column(Text, nullable=False)
    evidence_considered_json = Column(Text, nullable=False)
    confidence_explanation = Column(Text, nullable=False)
    impact_blast_radius = Column(Text, nullable=False)
    recommended_remediation_json = Column(Text, nullable=False)
    unknowns_and_limitations = Column(Text, nullable=False)
    safety_boundary = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
