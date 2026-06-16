from fastapi import APIRouter, Depends, HTTPException, Security, UploadFile, File
from fastapi.security.api_key import APIKeyHeader
from sqlalchemy.orm import Session
import json

from app.db.database import get_db
from app.models.api_key import ApiKey
from app.services.sarif_parser import parse_sarif_and_save

router = APIRouter()

API_KEY_NAME = "X-API-Key"
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=True)

def get_project_from_api_key(api_key_header: str = Security(api_key_header), db: Session = Depends(get_db)):
    # Note: In a real implementation, we would hash the header and compare it with the key_hash.
    # For this MVP, we assume the header is the key_hash directly.
    api_key = db.query(ApiKey).filter(ApiKey.key_hash == api_key_header, ApiKey.is_active == True).first()
    if not api_key:
        raise HTTPException(status_code=403, detail="Could not validate API Key")
    return api_key.project_id

@router.post("/ci/upload/sarif")
async def upload_sarif_via_ci(file: UploadFile = File(...), db: Session = Depends(get_db), project_id: str = Depends(get_project_from_api_key)):
    """
    Endpoint intended for CI/CD pipelines to upload SARIF results.
    Authenticates via X-API-Key header.
    """
    if not file.filename.endswith(".sarif") and not file.filename.endswith(".json"):
        raise HTTPException(status_code=400, detail="Invalid file type. Must be .sarif or .json")
        
    try:
        content = await file.read()
        sarif_data = json.loads(content)
        findings = parse_sarif_and_save(db, project_id, sarif_data)
        return {"status": "success", "imported_findings": len(findings)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
