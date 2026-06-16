import uuid
import datetime
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.models.finding import Finding
from app.models.scan import Scan

def parse_sarif_and_save(db: Session, project_id: str, sarif_data: Dict[str, Any]) -> List[Finding]:
    """
    Parses a SARIF JSON dictionary and saves the results as Findings in the database.
    Creates a new Scan record.
    """
    scan_id = f"scan-{uuid.uuid4().hex[:8]}"
    new_scan = Scan(
        id=scan_id,
        project_id=project_id,
        scan_type="SARIF Import",
        status="completed",
        finished_at=datetime.datetime.utcnow(),
        summary="Imported via SARIF"
    )
    db.add(new_scan)
    
    findings = []
    runs = sarif_data.get("runs", [])
    for run in runs:
        tool_name = run.get("tool", {}).get("driver", {}).get("name", "SARIF Tool")
        results = run.get("results", [])
        
        for result in results:
            rule_id = result.get("ruleId", "UNKNOWN_RULE")
            message = result.get("message", {}).get("text", "No description provided.")
            
            level = result.get("level", "warning")
            severity_map = {
                "error": "High",
                "warning": "Medium",
                "note": "Low",
                "none": "Info"
            }
            severity = severity_map.get(level, "Medium")
            
            finding_id = f"fin-{uuid.uuid4().hex[:8]}"
            new_finding = Finding(
                id=finding_id,
                project_id=project_id,
                scan_id=scan_id,
                rule_key=rule_id,
                title=f"[{tool_name}] {rule_id}",
                category="Static Analysis",
                severity=severity,
                confidence="High",
                blast_radius="Unknown",
                status="Open",
                description=message
            )
            findings.append(new_finding)
            db.add(new_finding)
            
    db.commit()
    for f in findings:
        db.refresh(f)
        
    return findings
