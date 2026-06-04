from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.graph import GraphNode, GraphEdge
from app.models.user import User
from app.dependencies.auth import get_current_user
from app.dependencies.ownership import get_owned_project_or_404

router = APIRouter()

@router.get("/projects/{project_id}/graph")
def get_graph(project_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    get_owned_project_or_404(db, project_id, current_user)
    nodes = db.query(GraphNode).filter(GraphNode.project_id == project_id).all()
    edges = db.query(GraphEdge).filter(GraphEdge.project_id == project_id).all()
    return {"nodes": nodes, "edges": edges}
