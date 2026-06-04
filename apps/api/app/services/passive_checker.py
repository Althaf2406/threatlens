import uuid
from typing import Dict, Any, List
from datetime import datetime

class PassiveChecker:
    @staticmethod
    def run_check(project_id: str, asset_id: str, asset_type: str) -> Dict[str, Any]:
        """
        Simulate a passive scan. No real network requests are made.
        """
        findings = []
        scan_id = f"scn-{uuid.uuid4().hex[:6]}"
        
        if asset_type == "Website URL":
            findings.extend([
                {
                    "title": "Missing HSTS Header",
                    "category": "Configuration",
                    "severity": "Medium",
                    "confidence": "High",
                    "blast_radius": "Low",
                    "description": "The HTTP Strict-Transport-Security response header is missing, leaving the asset vulnerable to downgrade attacks.",
                    "evidence": "Simulated passive check detected missing header in HTTP response.",
                    "remediation": "Configure the web server to emit the Strict-Transport-Security header.",
                    "framework": "OWASP Top 10",
                    "control": "A05:2021-Security Misconfiguration"
                },
                {
                    "title": "Missing Content Security Policy",
                    "category": "Configuration",
                    "severity": "Low",
                    "confidence": "High",
                    "blast_radius": "Medium",
                    "description": "No CSP header is present, which may allow XSS attacks.",
                    "evidence": "Simulated passive check detected missing Content-Security-Policy header.",
                    "remediation": "Implement a strict Content-Security-Policy.",
                    "framework": "OWASP Top 10",
                    "control": "A05:2021-Security Misconfiguration"
                }
            ])
        elif asset_type == "API Endpoint":
            findings.extend([
                {
                    "title": "Insecure Cookie Flags",
                    "category": "Configuration",
                    "severity": "High",
                    "confidence": "High",
                    "blast_radius": "Medium",
                    "description": "Session cookies are missing the Secure and HttpOnly flags.",
                    "evidence": "Simulated passive check detected Set-Cookie header missing flags.",
                    "remediation": "Ensure all session cookies are marked Secure and HttpOnly.",
                    "framework": "OWASP Top 10",
                    "control": "A05:2021-Security Misconfiguration"
                },
                {
                    "title": "Permissive CORS Configuration",
                    "category": "Configuration",
                    "severity": "High",
                    "confidence": "Medium",
                    "blast_radius": "High",
                    "description": "The API allows cross-origin requests from any domain.",
                    "evidence": "Simulated passive check detected Access-Control-Allow-Origin: *.",
                    "remediation": "Restrict CORS to explicitly trusted origins.",
                    "framework": "OWASP Top 10",
                    "control": "A05:2021-Security Misconfiguration"
                }
            ])

        return {
            "scan": {
                "id": scan_id,
                "project_id": project_id,
                "asset_id": asset_id,
                "scan_type": "Passive",
                "status": "completed",
                "summary": f"Passive check completed. Found {len(findings)} issues.",
                "finished_at": datetime.utcnow()
            },
            "findings": findings
        }
