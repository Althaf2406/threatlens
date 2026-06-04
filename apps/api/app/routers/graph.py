from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.graph import GraphNode, GraphEdge

router = APIRouter()

@router.get("/projects/{project_id}/graph")
def get_graph(project_id: str, db: Session = Depends(get_db)):
    nodes = db.query(GraphNode).filter(GraphNode.project_id == project_id).all()
    edges = db.query(GraphEdge).filter(GraphEdge.project_id == project_id).all()
    return {"nodes": nodes, "edges": edges}
