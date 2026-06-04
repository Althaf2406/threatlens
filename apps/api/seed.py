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

        # 11. Detection Rules
        rule_1 = DetectionRule(id="rule-001", name="Multiple Failed Logins", category="Authentication", enabled=True, threshold=5)
        db.add_all([rule_1])

        db.commit()
        print("Database seeded successfully with auth data!")

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()
