from sqlalchemy import Column, String, ForeignKey
from app.db.base import Base

class GraphNode(Base):
    __tablename__ = "graph_nodes"

    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("projects.id"))
    label = Column(String, nullable=False)
    type = Column(String, nullable=False)
    risk = Column(String, nullable=True)
    related_finding_id = Column(String, ForeignKey("findings.id"), nullable=True)

class GraphEdge(Base):
    __tablename__ = "graph_edges"

    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("projects.id"))
    source_node_id = Column(String, ForeignKey("graph_nodes.id"))
    target_node_id = Column(String, ForeignKey("graph_nodes.id"))
    relation = Column(String, nullable=False)
    evidence_id = Column(String, ForeignKey("evidences.id"), nullable=True)
