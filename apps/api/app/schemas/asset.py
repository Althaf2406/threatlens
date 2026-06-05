from pydantic import BaseModel, HttpUrl, Field, validator
from typing import Optional, List
from datetime import datetime
import re

class AssetBase(BaseModel):
    name: str
    type: str
    value: str
    environment: str = "Production"
    description: Optional[str] = None
    tags_json: Optional[str] = None
    risk_level: Optional[str] = None
    notes: Optional[str] = None
    ownership_confirmed: bool = False

    @validator('value')
    def validate_value(cls, v, values):
        if 'type' in values:
            if values['type'] in ['website_url', 'api_endpoint']:
                if not re.match(r'^https?://', v):
                    raise ValueError('Must be a valid HTTP/HTTPS URL')
            if not v or v.strip() == "":
                raise ValueError("Value cannot be empty")
        return v

class AssetCreate(AssetBase):
    pass

class AssetUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    value: Optional[str] = None
    environment: Optional[str] = None
    description: Optional[str] = None
    tags_json: Optional[str] = None
    risk_level: Optional[str] = None
    notes: Optional[str] = None
    ownership_confirmed: Optional[bool] = None
    status: Optional[str] = None

class Asset(AssetBase):
    id: str
    project_id: str
    status: str
    last_checked_at: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
