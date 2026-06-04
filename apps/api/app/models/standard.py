from sqlalchemy import Column, String, ForeignKey, Text
from app.db.base import Base

class StandardMapping(Base):
    __tablename__ = "standard_mappings"

    id = Column(String, primary_key=True, index=True)
    finding_id = Column(String, ForeignKey("findings.id"))
    framework = Column(String, nullable=False)
    control = Column(String, nullable=False)
    description = Column(Text, nullable=True)
