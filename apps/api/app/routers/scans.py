from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models.user import User
from app.models.scan import Scan
from app.models.asset import Asset
from app.models.finding import Finding
from app.schemas.scan import Scan as ScanSchema
from app.dependencies.auth import get_current_user
from app.dependencies.ownership import get_owned_project_or_404

router = APIRouter()

@router.get("/projects/{project_id}/scans", response_model=List[ScanSchema])
def get_project_scans(project_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    get_owned_project_or_404(db, project_id, current_user)
    scans = db.query(Scan).filter(Scan.project_id == project_id).order_by(Scan.created_at.desc()).all()
    return scans

@router.get("/projects/{project_id}/scans/{scan_id}")
def get_project_scan(project_id: str, scan_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    get_owned_project_or_404(db, project_id, current_user)
    scan = db.query(Scan).filter(Scan.id == scan_id, Scan.project_id == project_id).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
        
    asset = db.query(Asset).filter(Asset.id == scan.asset_id).first()
    findings = db.query(Finding).filter(Finding.scan_id == scan_id).all()
    
    return {
        "scan": scan,
        "asset": asset,
        "findings": findings
    }

@router.post("/projects/{project_id}/scans/compare")
def compare_scans(project_id: str, data: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    get_owned_project_or_404(db, project_id, current_user)
    before_scan_id = data.get("before_scan_id")
    after_scan_id = data.get("after_scan_id")
    
    if not before_scan_id or not after_scan_id:
        raise HTTPException(status_code=400, detail="Missing before_scan_id or after_scan_id")
        
    before_scan = db.query(Scan).filter(Scan.id == before_scan_id, Scan.project_id == project_id).first()
    after_scan = db.query(Scan).filter(Scan.id == after_scan_id, Scan.project_id == project_id).first()
    
    if not before_scan or not after_scan:
        raise HTTPException(status_code=404, detail="One or both scans not found")
        
    posture_score_delta = (after_scan.posture_score or 0) - (before_scan.posture_score or 0)
    total_findings_delta = (after_scan.total_findings or 0) - (before_scan.total_findings or 0)
    high_findings_delta = (after_scan.high_findings or 0) - (before_scan.high_findings or 0)
    
    improvement_summary = "No Significant Change"
    if posture_score_delta > 0 or high_findings_delta < 0:
        improvement_summary = "Improved"
    elif posture_score_delta < 0 or high_findings_delta > 0:
        improvement_summary = "Regression"
        
    return {
        "before_scan": before_scan,
        "after_scan": after_scan,
        "posture_score_delta": posture_score_delta,
        "total_findings_delta": total_findings_delta,
        "high_findings_delta": high_findings_delta,
        "fixed_findings_count": after_scan.fixed_findings or 0,
        "improvement_summary": improvement_summary
    }

@router.get("/projects/{project_id}/security-improvement")
def get_security_improvement(project_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    get_owned_project_or_404(db, project_id, current_user)
    scans = db.query(Scan).filter(Scan.project_id == project_id).order_by(Scan.created_at.asc()).all()
    
    if len(scans) < 2:
        return {
            "status": "insufficient_data",
            "message": "At least two scans are required to show security improvement."
        }
        
    latest_scan = scans[-1]
    previous_scan = scans[-2]
    
    delta = (latest_scan.posture_score or 0) - (previous_scan.posture_score or 0)
    
    trend = []
    for scan in scans:
        trend.append({
            "scan_id": scan.id,
            "created_at": scan.created_at,
            "posture_score": scan.posture_score,
            "total_findings": scan.total_findings,
            "high_findings": scan.high_findings,
            "fixed_findings": scan.fixed_findings
        })
        
    return {
        "status": "available",
        "latest_posture_score": latest_scan.posture_score,
        "previous_posture_score": previous_scan.posture_score,
        "delta": delta,
        "latest_scan_time": latest_scan.created_at,
        "trend": trend
    }
