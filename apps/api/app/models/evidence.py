from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from app.db.base import Base

class Evidence(Base):
    __tablename__ = "evidences"

    id = Column(String, primary_key=True, index=True)
    finding_id = Column(String, ForeignKey("findings.id"))
    source = Column(String, nullable=False)
    detail = Column(Text, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
