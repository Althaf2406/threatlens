from sqlalchemy import Column, String, ForeignKey, Text, Boolean, DateTime
from datetime import datetime
from app.db.base import Base

class SecurityStandard(Base):
    __tablename__ = "security_standards"

    id = Column(String, primary_key=True, index=True)
    framework = Column(String, nullable=False)
    version = Column(String, nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    source_url = Column(String, nullable=True)
    is_active = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class SecurityControl(Base):
    __tablename__ = "security_controls"

    id = Column(String, primary_key=True, index=True)
    standard_id = Column(String, ForeignKey("security_standards.id"), nullable=False)
    control_id = Column(String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String, nullable=True)
    severity_hint = Column(String, nullable=True)
    defensive_guidance = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class StandardMapping(Base):
    __tablename__ = "standard_mappings"

    id = Column(String, primary_key=True, index=True)
    finding_id = Column(String, ForeignKey("findings.id"))
    standard_id = Column(String, ForeignKey("security_standards.id"), nullable=True)
    control_id = Column(String, nullable=False)
    framework = Column(String, nullable=False)
    standard_version = Column(String, nullable=True)
    mapping_reason = Column(Text, nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
