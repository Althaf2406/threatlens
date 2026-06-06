import uuid
from typing import Dict, Any, List
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.scan import Scan
from app.models.finding import Finding
from app.models.project import Project
from app.models.detection_rule import DetectionRule
from app.models.standard import SecurityStandard, SecurityControl, StandardMapping
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
        
        asset_type_clean = asset_type.lower().replace(" ", "_")
        if asset_type_clean in ["website_url", "website"]:
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
                
        elif asset_type_clean in ["api_endpoint", "api"]:
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
        
        from app.models.evidence import Evidence
        
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
            
            # Generate mock evidence
            ev_detail = {"raw_metadata": "Simulated passive scan response"}
            if db_finding.rule_key == "missing_hsts_header":
                ev_detail = {"headers_received": {"Server": "nginx", "Content-Type": "text/html"}, "missing": ["Strict-Transport-Security"]}
            elif db_finding.rule_key == "insecure_cookie_flags":
                ev_detail = {"Set-Cookie": "session_id=12345; Path=/"}
            
            ev = Evidence(
                id=f"evd-{uuid.uuid4().hex[:6]}",
                finding_id=db_finding.id,
                source="Passive Scanner",
                detail=json.dumps(ev_detail)
            )
            db.add(ev)
            
        # Update project posture score
        project = db.query(Project).filter(Project.id == project_id).first()
        if project:
            project.posture_score = posture_score
            project.updated_at = datetime.utcnow()
            
        # Get active standards and their controls to create mappings
        active_standards = db.query(SecurityStandard).filter(SecurityStandard.is_active == True).all()
        controls = db.query(SecurityControl).filter(SecurityControl.standard_id.in_([s.id for s in active_standards])).all() if active_standards else []
        
        # Hardcoded rule_key to control_id logic for demonstration purposes
        rule_to_control_map = {
            "missing_hsts_header": "A05:2021",
            "insecure_cookie_flags": "CWE-1004"
        }

        for db_finding in db_findings:
            if db_finding.rule_key in rule_to_control_map:
                target_control_id = rule_to_control_map[db_finding.rule_key]
                # Find matching control in active standards
                matched_control = next((c for c in controls if c.control_id == target_control_id), None)
                if matched_control:
                    matched_std = next((s for s in active_standards if s.id == matched_control.standard_id), None)
                    if matched_std:
                        mapping = StandardMapping(
                            id=f"map-{uuid.uuid4().hex[:6]}",
                            finding_id=db_finding.id,
                            standard_id=matched_std.id,
                            control_id=matched_control.control_id,
                            framework=matched_std.framework,
                            standard_version=matched_std.version,
                            mapping_reason=f"Matched finding rule '{db_finding.rule_key}' to standard control.",
                            description=matched_control.title
                        )
                        db.add(mapping)
                    
        db.commit()

        return {
            "scan": scan,
            "findings": db_findings
        }
