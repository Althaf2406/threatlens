from fastapi import APIRouter, Depends
from typing import List

router = APIRouter()

@router.get("/usage")
def get_usage():
    return {"projectLimit": 3, "tokenLimit": 1000}

@router.get("/detection-rules")
def get_detection_rules():
    return []

@router.put("/detection-rules/{rule_id}")
def update_detection_rule(rule_id: str):
    return {"msg": "Rule updated"}
