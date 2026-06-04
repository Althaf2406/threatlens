import uuid

class ReportGenerator:
    @staticmethod
    def generate(project_id: str, type: str, db) -> dict:
        return {
            "id": f"rep-{uuid.uuid4().hex[:8]}",
            "project_id": project_id,
            "title": f"Generated {type} Report",
            "type": type,
            "summary": "This is a mock generated report."
        }
