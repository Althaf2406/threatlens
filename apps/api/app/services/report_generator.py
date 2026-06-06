import uuid

class ReportGenerator:
    @staticmethod
    def generate(project_id: str, type: str, db) -> dict:
        from app.models.finding import Finding
        from app.models.detection_rule import DetectionRule
        from app.models.standard import StandardMapping
        
        findings = db.query(Finding).filter(Finding.project_id == project_id).all()
        
        summary = f"This is an automated {type} Report.\n\n"
        summary += f"Total Findings: {len(findings)}\n"
        
        high_risk = [f for f in findings if f.severity in ["High", "Critical"]]
        if high_risk:
            summary += f"High/Critical Risk Findings: {len(high_risk)}\n\n"
            summary += "Detection Context:\n"
            for f in high_risk:
                rule_info = f.rule_key if f.rule_key else "Unknown Rule"
                mapping = db.query(StandardMapping).filter(StandardMapping.finding_id == f.id).first()
                if mapping:
                    std_info = f"{mapping.framework} {mapping.standard_version} - {mapping.control_id}"
                else:
                    std_info = "No direct mapping available."
                summary += f"- {f.title} (Triggered by: {rule_info})\n  Standard Mapping: {std_info}\n"
        else:
            summary += "No High/Critical risk findings detected based on current active rules.\n"
            
        summary += "\nNote: All findings are based strictly on active defensive detection rules. "
        summary += "Rules can be managed by Administrators in the Settings console.\n"
        summary += "Disclaimer: This summary is defensive-only. No offensive payloads, credentials, exploit instructions, brute force steps, or authentication bypass guidance are generated. This report is for remediation and learning, not formal compliance certification."
        
        return {
            "id": f"rep-{uuid.uuid4().hex[:8]}",
            "project_id": project_id,
            "title": f"Generated {type} Report",
            "type": type,
            "summary": summary
        }
