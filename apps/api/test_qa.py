import os
import sys
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import jwt

# Add app to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__))))

from app.main import app
from app.db.database import get_db
from app.db.base import Base
from app.models.user import User

# Use existing DB
engine = create_engine("sqlite:///./threatlens.db", connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

def get_demo_token():
    # Usually generated via login, let's just create one or call login endpoint
    response = client.post(
        "/auth/login",
        json={"email": "demo@threatlens.local", "password": "password123"}
    )
    if response.status_code == 200:
        return response.cookies.get("threatlens_access_token")
    print("Login failed:", response.status_code, response.text)
    return None

def test_qa():
    print("Running QA Tests...")
    token = get_demo_token()
    if not token:
        print("Failed to get token for demo user")
        return
        
    client.cookies.set("threatlens_access_token", token)
    
    # 1. Test Usage Endpoint
    print("\n--- Testing Usage ---")
    res = client.get("/settings/usage")
    print(res.status_code, res.json())
    
    # 2. Test Plans Endpoint
    print("\n--- Testing Plans ---")
    res = client.get("/settings/plans")
    print(res.status_code, list(res.json().keys()))
    
    # 3. Test AI Mode Update
    print("\n--- Testing AI Mode Update ---")
    res = client.put("/settings/ai-mode", json={"ai_mode": "gemini_api"})
    print(res.status_code, res.json())
    res = client.put("/settings/ai-mode", json={"ai_mode": "invalid_mode"})
    print("Invalid mode:", res.status_code, res.json())
    # reset back
    client.put("/settings/ai-mode", json={"ai_mode": "template_local"})

    # 4. Project Limits
    print("\n--- Testing Project Limits ---")
    # First get projects
    res = client.get("/projects/")
    projects = res.json()
    print(f"Current projects: {len(projects)}")
    
    # Try to create projects until limit
    while len(projects) < 3:
        res = client.post("/projects/", json={"name": f"Test Proj {len(projects)}"})
        if res.status_code == 200:
            projects.append(res.json())
            print(f"Created project. Total: {len(projects)}")
        else:
            print("Failed to create:", res.status_code, res.json())
            break
            
    # Try creating one more (should fail)
    res = client.post("/projects/", json={"name": "Excess Proj"})
    print("Excess project attempt:", res.status_code, res.json())

    # 5. AI Summaries & Token Limits
    print("\n--- Testing AI Summaries ---")
    if len(projects) > 0:
        proj_id = projects[0]["id"]
        # Find a finding
        res = client.get(f"/projects/{proj_id}/findings")
        findings = res.json()
        finding_id = findings[0]["id"] if findings else None
        
        # Current tokens
        res = client.get("/settings/usage")
        tokens_before = res.json()["token_used"]
        print(f"Tokens before: {tokens_before}")
        
        # Generate summary
        res = client.post(f"/projects/{proj_id}/ai-summaries", json={"summary_type": "finding", "finding_id": finding_id})
        print("Summary gen:", res.status_code, "Cost should be 100")
        
        # Generate report
        res = client.post(f"/projects/{proj_id}/reports", json={"type": "Compliance"})
        print("Report gen:", res.status_code, "Cost should be 500")
        
        res = client.get("/settings/usage")
        tokens_after = res.json()["token_used"]
        print(f"Tokens after: {tokens_after}")
        
        # Test disclaimer in report
        res = client.get(f"/projects/{proj_id}/reports")
        if res.status_code == 200 and len(res.json()) > 0:
            report_summary = res.json()[-1]["summary"]
            print("Disclaimer present in report:", "defensive-only" in report_summary)
            if "defensive-only" not in report_summary:
                print(report_summary)
    else:
        print("No projects to test summaries.")

if __name__ == "__main__":
    test_qa()
