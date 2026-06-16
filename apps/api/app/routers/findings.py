from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.finding import Finding
from app.models.user import User
from app.dependencies.auth import get_current_user
from app.dependencies.ownership import get_owned_project_or_404, get_owned_finding_or_404
from app.models.standard import StandardMapping

router = APIRouter()

@router.get("/projects/{project_id}/findings")
def get_findings(project_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    get_owned_project_or_404(db, project_id, current_user)
    return db.query(Finding).filter(Finding.project_id == project_id).all()

@router.get("/projects/{project_id}/findings/{finding_id}")
def get_finding(project_id: str, finding_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    finding = get_owned_finding_or_404(db, project_id, finding_id, current_user)
    
    # Convert to dict to append dynamic fields
    finding_dict = {c.name: getattr(finding, c.name) for c in finding.__table__.columns}
    
    # Fetch standard mappings
    standards = db.query(StandardMapping).filter(StandardMapping.finding_id == finding.id).all()
    finding_dict["standards"] = [
        {
            "id": s.id,
            "standard_id": s.standard_id,
            "control_id": s.control_id,
            "framework": s.framework,
            "standard_version": s.standard_version,
            "mapping_reason": s.mapping_reason,
            "description": s.description
        } for s in standards
    ]
    
    # Fetch evidence
    from app.models.evidence import Evidence
    evidences = db.query(Evidence).filter(Evidence.finding_id == finding.id).all()
    finding_dict["evidence"] = [
        {
            "id": e.id,
            "source": e.source,
            "detail": e.detail,
            "timestamp": e.timestamp.isoformat() if e.timestamp else None
        } for e in evidences
    ]
    
    finding_dict["remediation_tasks"] = []
    
    return finding_dict

import json
from app.services.sarif_parser import parse_sarif_and_save

@router.post("/projects/{project_id}/scans/import/sarif")
async def import_sarif(project_id: str, file: UploadFile = File(...), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    get_owned_project_or_404(db, project_id, current_user)
    
    if not file.filename.endswith(".sarif") and not file.filename.endswith(".json"):
        raise HTTPException(status_code=400, detail="Invalid file type. Must be .sarif or .json")
        
    try:
        content = await file.read()
        sarif_data = json.loads(content)
        findings = parse_sarif_and_save(db, project_id, sarif_data)
        return {"message": f"Successfully imported {len(findings)} findings."}
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON format.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
