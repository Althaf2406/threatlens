import os
import sys

# Ensure app can be imported
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.db.database import SessionLocal, engine
from app.db.base import Base
from app.models.user import User
from app.models.project import Project
from app.models.asset import Asset
from app.models.finding import Finding
from app.models.evidence import Evidence
from app.models.event import Event
from app.models.graph import GraphNode, GraphEdge
from app.models.remediation import RemediationTask
from app.models.standard import StandardMapping
from app.models.report import Report
from app.models.detection_rule import DetectionRule
from app.core.security import get_password_hash

def seed():
    Base.metadata.drop_all(bind=engine) # Drop all to cleanly re-seed for the auth phase
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        print("Seeding database...")

        # 1. User
        demo_user = User(
            id="usr-demo",
            name="Demo User",
            email="demo@threatlens.local",
            hashed_password=get_password_hash("password123"),
            role="user",
            plan_name="pro",
            project_limit=5,
            token_limit=10000
        )
        admin_user = User(
            id="usr-admin",
            name="Investigator Admin",
            email="admin@threatlens.local",
            hashed_password=get_password_hash("admin123"),
            role="admin",
            plan_name="pro",
            project_limit=10,
            token_limit=50000
        )
        db.add_all([demo_user, admin_user])
        db.flush()

        # 2. Projects
        proj_1 = Project(id="proj-001", user_id=demo_user.id, name="Demo Web App", environment="Staging", risk_level="High", posture_score=76)
        proj_2 = Project(id="proj-002", user_id=demo_user.id, name="Public API Service", environment="Demo", risk_level="Medium", posture_score=85)
        proj_3 = Project(id="proj-003", user_id=demo_user.id, name="Student Portfolio App", environment="Lab", risk_level="Low", posture_score=95)
        proj_4 = Project(id="proj-004", user_id=admin_user.id, name="Admin Confidential API", environment="Production", risk_level="Medium", posture_score=88)
        db.add_all([proj_1, proj_2, proj_3, proj_4])
        db.flush()

        # 3. Assets
        asset_1 = Asset(id="ast-001", project_id=proj_1.id, name="Main Website", type="Website URL", value="https://demo.threatlens.local")
        asset_2 = Asset(id="ast-002", project_id=proj_1.id, name="Auth API", type="API Endpoint", value="https://api.threatlens.local/auth")
        asset_3 = Asset(id="ast-003", project_id=proj_4.id, name="Core Admin API", type="API Endpoint", value="https://admin.threatlens.local/api")
        db.add_all([asset_1, asset_2, asset_3])
        db.flush()

        # 4. Findings
        finding_1 = Finding(id="fdg-001", project_id=proj_1.id, asset_id=asset_1.id, title="Missing HSTS Header", category="Configuration", severity="Medium", confidence="High", blast_radius="Low", description="The HTTP Strict-Transport-Security response header is missing.")
        finding_2 = Finding(id="fdg-002", project_id=proj_1.id, asset_id=asset_2.id, title="Insecure Cookie Flags", category="Configuration", severity="High", confidence="High", blast_radius="Medium", description="Session cookies are missing the Secure and HttpOnly flags.")
        finding_3 = Finding(id="fdg-003", project_id=proj_4.id, asset_id=asset_3.id, title="Admin Token Leak", category="Secrets", severity="Critical", confidence="High", blast_radius="High", description="Hardcoded admin token found.")
        db.add_all([finding_1, finding_2, finding_3])
        db.flush()

        # 5. Evidence
        evidence_1 = Evidence(id="evd-001", finding_id=finding_1.id, source="Passive Scan", detail="curl -I https://demo.threatlens.local -> Missing Strict-Transport-Security")
        db.add_all([evidence_1])

        # 6. Events
        event_1 = Event(id="evt-001", project_id=proj_1.id, event_type="Failed Login Spike", user_label="unknown", ip_address="192.168.1.100", endpoint="/auth", severity="High", risk_score=85, is_synthetic=True)
        db.add_all([event_1])

        # 7. Graph
        node_1 = GraphNode(id="gn-001", project_id=proj_1.id, label="Demo Web App", type="Asset", risk="Low")
        node_2 = GraphNode(id="gn-002", project_id=proj_1.id, label="Insecure Cookie", type="Finding", risk="High", related_finding_id=finding_1.id)
        db.add_all([node_1, node_2])
        db.flush()
        edge_1 = GraphEdge(id="ge-001", project_id=proj_1.id, source_node_id=node_1.id, target_node_id=node_2.id, relation="has vulnerability")
        db.add_all([edge_1])

        # 8. Remediation
        rem_1 = RemediationTask(id="rem-001", project_id=proj_1.id, finding_id=finding_1.id, title="Enable HSTS in Nginx", status="open", priority="Medium")
        db.add_all([rem_1])

        # 9. Standard Mapping
        std_1 = StandardMapping(id="std-001", finding_id=finding_1.id, framework="OWASP Top 10", control="A05:2021-Security Misconfiguration", description="Missing security headers")
        db.add_all([std_1])

        # 10. Reports
        report_1 = Report(id="rep-001", project_id=proj_1.id, title="Executive Summary Q3", type="Executive", summary="Overall posture is improving.")
        db.add_all([report_1])

        # 10.5. Scans (History)
        from app.models.scan import Scan
        from datetime import datetime, timedelta
        
        now = datetime.utcnow()
        scan_1 = Scan(id="scan-001", project_id=proj_1.id, asset_id=asset_1.id, scan_type="Passive", status="completed", summary="Initial scan.", posture_score=60, total_findings=5, high_findings=3, medium_findings=1, low_findings=1, fixed_findings=0, created_at=now - timedelta(days=14), started_at=now - timedelta(days=14), finished_at=now - timedelta(days=14))
        scan_2 = Scan(id="scan-002", project_id=proj_1.id, asset_id=asset_1.id, scan_type="Passive", status="completed", summary="After first remediation.", posture_score=70, total_findings=3, high_findings=1, medium_findings=1, low_findings=1, fixed_findings=2, created_at=now - timedelta(days=7), started_at=now - timedelta(days=7), finished_at=now - timedelta(days=7))
        scan_3 = Scan(id="scan-003", project_id=proj_1.id, asset_id=asset_1.id, scan_type="Passive", status="completed", summary="Latest posture check.", posture_score=76, total_findings=2, high_findings=1, medium_findings=1, low_findings=0, fixed_findings=3, created_at=now, started_at=now, finished_at=now)
        
        db.add_all([scan_1, scan_2, scan_3])
        
        finding_1.scan_id = scan_3.id
        finding_2.scan_id = scan_3.id

        # 11. Detection Rules
        import json
        rules_data = [
            {"id": "rule-001", "name": "Missing HSTS Header", "key": "missing_hsts_header", "category": "passive_check", "severity": "Medium", "confidence_base": "High", "threshold_json": json.dumps({"required_header": "Strict-Transport-Security"})},
            {"id": "rule-002", "name": "Missing Content Security Policy", "key": "missing_content_security_policy", "category": "passive_check", "severity": "Low", "confidence_base": "High", "threshold_json": None},
            {"id": "rule-003", "name": "Insecure Cookie Flags", "key": "insecure_cookie_flags", "category": "passive_check", "severity": "High", "confidence_base": "High", "threshold_json": None},
            {"id": "rule-004", "name": "Permissive CORS Configuration", "key": "permissive_cors_configuration", "category": "passive_check", "severity": "High", "confidence_base": "Medium", "threshold_json": None},
            {"id": "rule-005", "name": "Failed Login Spike", "key": "failed_login_spike", "category": "auth_anomaly", "severity": "Medium", "confidence_base": "Medium", "threshold_json": json.dumps({"max_failed_attempts": 5, "window_minutes": 10})},
            {"id": "rule-006", "name": "Impossible Travel", "key": "impossible_travel", "category": "auth_anomaly", "severity": "High", "confidence_base": "High", "threshold_json": json.dumps({"max_minutes_between_countries": 30})},
            {"id": "rule-007", "name": "Token Reuse", "key": "token_reuse", "category": "session_anomaly", "severity": "Critical", "confidence_base": "High", "threshold_json": json.dumps({"different_ip_threshold": 2})},
            {"id": "rule-008", "name": "New Device Admin Action", "key": "new_device_admin_action", "category": "session_anomaly", "severity": "High", "confidence_base": "High", "threshold_json": None},
            {"id": "rule-009", "name": "Suspicious Data Export", "key": "suspicious_data_export", "category": "data_activity", "severity": "High", "confidence_base": "Medium", "threshold_json": None},
            {"id": "rule-010", "name": "Insufficient Evidence Guardrail", "key": "insufficient_evidence_guardrail", "category": "guardrail", "severity": "Low", "confidence_base": "Low", "threshold_json": json.dumps({"minimum_evidence_count": 1})}
        ]
        
        for rule in rules_data:
            db.add(DetectionRule(**rule))

        db.commit()
        print("Database seeded successfully with auth data!")

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()
