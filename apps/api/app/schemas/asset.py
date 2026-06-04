from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class AssetBase(BaseModel):
    pass

class AssetCreate(AssetBase):
    pass

class Asset(AssetBase):
    id: str
    class Config:
        from_attributes = True
