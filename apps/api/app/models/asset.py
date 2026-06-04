from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.db.base import Base

class Asset(Base):
    __tablename__ = "assets"

    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("projects.id"))
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)
    value = Column(String, nullable=False)
    environment = Column(String, default="Production")
    ownership_confirmed = Column(Boolean, default=False)
    status = Column(String, default="Ready")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
