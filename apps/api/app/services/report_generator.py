import uuid

class ReportGenerator:
    @staticmethod
    def generate(project_id: str, type: str, db) -> dict:
        from app.models.finding import Finding
        from app.models.detection_rule import DetectionRule
        
        findings = db.query(Finding).filter(Finding.project_id == project_id).all()
        
        summary = f"This is an automated {type} Report.\n\n"
        summary += f"Total Findings: {len(findings)}\n"
        
        high_risk = [f for f in findings if f.severity in ["High", "Critical"]]
        if high_risk:
            summary += f"High/Critical Risk Findings: {len(high_risk)}\n\n"
            summary += "Detection Context:\n"
            for f in high_risk:
                rule_info = f.rule_key if f.rule_key else "Unknown Rule"
                summary += f"- {f.title} (Triggered by: {rule_info})\n"
        else:
            summary += "No High/Critical risk findings detected based on current active rules.\n"
            
        summary += "\nNote: All findings are based strictly on active defensive detection rules. "
        summary += "Rules can be managed by Administrators in the Settings console."
        
        return {
            "id": f"rep-{uuid.uuid4().hex[:8]}",
            "project_id": project_id,
            "title": f"Generated {type} Report",
            "type": type,
            "summary": summary
        }
