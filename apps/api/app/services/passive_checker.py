import uuid
from typing import Dict, Any, List
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.scan import Scan
from app.models.finding import Finding
from app.models.project import Project
from app.models.detection_rule import DetectionRule
import json

class PassiveChecker:
    @staticmethod
    def run_check(db: Session, project_id: str, asset_id: str, asset_type: str) -> Dict[str, Any]:
        """
        Simulate a passive scan. No real network requests are made.
        Only generates findings if the corresponding detection rule is enabled.
        """
        rules = {r.key: r for r in db.query(DetectionRule).all()}
        
        findings_data = []
        scan_id = f"scn-{uuid.uuid4().hex[:6]}"
        
        if asset_type == "Website URL":
            rule = rules.get("missing_hsts_header")
            if rule and rule.enabled:
                findings_data.append({
                    "title": rule.name,
                    "category": rule.category,
                    "severity": rule.severity,
                    "confidence": rule.confidence_base,
                    "blast_radius": "Low",
                    "description": "The HTTP Strict-Transport-Security response header is missing, leaving the asset vulnerable to downgrade attacks.",
                    "rule_id": rule.id,
                    "rule_key": rule.key
                })
                
            rule = rules.get("missing_content_security_policy")
            if rule and rule.enabled:
                findings_data.append({
                    "title": rule.name,
                    "category": rule.category,
                    "severity": rule.severity,
                    "confidence": rule.confidence_base,
                    "blast_radius": "Medium",
                    "description": "No CSP header is present, which may allow XSS attacks.",
                    "rule_id": rule.id,
                    "rule_key": rule.key
                })
                
        elif asset_type == "API Endpoint":
            rule = rules.get("insecure_cookie_flags")
            if rule and rule.enabled:
                findings_data.append({
                    "title": rule.name,
                    "category": rule.category,
                    "severity": rule.severity,
                    "confidence": rule.confidence_base,
                    "blast_radius": "Medium",
                    "description": "Session cookies are missing the Secure and HttpOnly flags.",
                    "rule_id": rule.id,
                    "rule_key": rule.key
                })
                
            rule = rules.get("permissive_cors_configuration")
            if rule and rule.enabled:
                findings_data.append({
                    "title": rule.name,
                    "category": rule.category,
                    "severity": rule.severity,
                    "confidence": rule.confidence_base,
                    "blast_radius": "High",
                    "description": "The API allows cross-origin requests from any domain.",
                    "rule_id": rule.id,
                    "rule_key": rule.key
                })

        high = sum(1 for f in findings_data if f["severity"] == "High" or f["severity"] == "Critical")
        medium = sum(1 for f in findings_data if f["severity"] == "Medium")
        low = sum(1 for f in findings_data if f["severity"] == "Low")
        total = len(findings_data)
        
        # Calculate posture score purely for simulation (starts at 100, subtracts based on severity)
        posture_score = max(0, 100 - (high * 15) - (medium * 5) - (low * 2))
        
        scan = Scan(
            id=scan_id,
            project_id=project_id,
            asset_id=asset_id,
            scan_type="Passive",
            status="completed",
            summary=f"Passive check completed. Found {total} issues.",
            posture_score=posture_score,
            total_findings=total,
            high_findings=high,
            medium_findings=medium,
            low_findings=low,
            fixed_findings=0,
            finished_at=datetime.utcnow()
        )
        db.add(scan)
        
        db_findings = []
        for f in findings_data:
            db_finding = Finding(
                id=f"fdg-{uuid.uuid4().hex[:6]}",
                project_id=project_id,
                asset_id=asset_id,
                scan_id=scan_id,
                title=f["title"],
                category=f["category"],
                severity=f["severity"],
                confidence=f["confidence"],
                blast_radius=f["blast_radius"],
                description=f["description"],
                status="Open",
                rule_id=f.get("rule_id"),
                rule_key=f.get("rule_key")
            )
            db.add(db_finding)
            db_findings.append(db_finding)
            
        # Update project posture score
        project = db.query(Project).filter(Project.id == project_id).first()
        if project:
            project.posture_score = posture_score
            project.updated_at = datetime.utcnow()
            
        db.commit()

        return {
            "scan": scan,
            "findings": db_findings
        }
