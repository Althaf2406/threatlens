import uuid
import random
from typing import List, Dict, Any
from datetime import datetime, timedelta

class SyntheticLab:
    SCENARIOS = {
        "failed_login_spike": {
            "name": "Failed Login Spike",
            "events": 5,
            "type": "Authentication",
            "severity": "Medium",
            "risk_base": 40
        },
        "impossible_travel": {
            "name": "Impossible Travel",
            "events": 2,
            "type": "Suspicious Login",
            "severity": "High",
            "risk_base": 85
        },
        "new_device_admin_action": {
            "name": "New Device Admin Action",
            "events": 1,
            "type": "Privileged Access",
            "severity": "High",
            "risk_base": 75
        },
        "token_reuse": {
            "name": "Token Reuse",
            "events": 3,
            "type": "Session Hijacking",
            "severity": "Critical",
            "risk_base": 95
        },
        "suspicious_data_export": {
            "name": "Suspicious Data Export",
            "events": 1,
            "type": "Data Exfiltration",
            "severity": "High",
            "risk_base": 90
        }
    }

    @staticmethod
    def generate_events(project_id: str, scenario_id: str) -> List[Dict[str, Any]]:
        """
        Generate synthetic events for a given scenario.
        No real network requests or attacks are performed.
        """
        if scenario_id not in SyntheticLab.SCENARIOS:
            return []

        scenario = SyntheticLab.SCENARIOS[scenario_id]
        events = []
        now = datetime.utcnow()
        
        users = ["admin", "developer_1", "service_account"]
        endpoints = ["/api/auth", "/api/export", "/admin/settings", "/user/profile"]

        for i in range(scenario["events"]):
            events.append({
                "id": f"syn-evt-{uuid.uuid4().hex[:8]}",
                "project_id": project_id,
                "event_type": scenario["name"],
                "timestamp": now - timedelta(minutes=random.randint(1, 60)),
                "user_label": random.choice(users),
                "ip_address": f"{random.randint(1,255)}.{random.randint(1,255)}.{random.randint(1,255)}.{random.randint(1,255)}",
                "country": random.choice(["US", "UK", "RU", "CN", "BR"]),
                "device": random.choice(["Unknown Device", "Python-urllib", "HeadlessChrome"]),
                "endpoint": random.choice(endpoints),
                "severity": scenario["severity"],
                "risk_score": scenario["risk_base"] + random.randint(-5, 5),
                "is_synthetic": True,
                "scenario_id": scenario_id
            })
            
        return events
