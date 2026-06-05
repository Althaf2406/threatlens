from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

# Security Control
class SecurityControlBase(BaseModel):
    control_id: str
    title: str
    description: Optional[str] = None
    category: Optional[str] = None
    severity_hint: Optional[str] = None
    defensive_guidance: Optional[str] = None

class SecurityControlCreate(SecurityControlBase):
    pass

class SecurityControlUpdate(BaseModel):
    control_id: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    severity_hint: Optional[str] = None
    defensive_guidance: Optional[str] = None

class SecurityControl(SecurityControlBase):
    id: str
    standard_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Security Standard
class SecurityStandardBase(BaseModel):
    framework: str
    version: str
    name: str
    description: Optional[str] = None
    source_url: Optional[str] = None
    is_active: bool = False

class SecurityStandardCreate(SecurityStandardBase):
    pass

class SecurityStandardUpdate(BaseModel):
    framework: Optional[str] = None
    version: Optional[str] = None
    name: Optional[str] = None
    description: Optional[str] = None
    source_url: Optional[str] = None
    is_active: Optional[bool] = None

class SecurityStandard(SecurityStandardBase):
    id: str
    created_at: datetime
    updated_at: datetime
    controls: List[SecurityControl] = []

    class Config:
        from_attributes = True

# Standard Mapping
class StandardMappingBase(BaseModel):
    finding_id: str
    standard_id: Optional[str] = None
    control_id: str
    framework: str
    standard_version: Optional[str] = None
    mapping_reason: Optional[str] = None
    description: Optional[str] = None

class StandardMappingCreate(StandardMappingBase):
    pass

class StandardMapping(StandardMappingBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

# Import Schema
class SecurityStandardImport(SecurityStandardBase):
    controls: List[SecurityControlCreate]
