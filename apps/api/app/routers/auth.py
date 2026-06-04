from fastapi import APIRouter, Depends
from typing import List

router = APIRouter()

@router.post("/register")
def register():
    return {"msg": "User registered"}

@router.post("/login")
def login():
    return {"access_token": "mock-token", "token_type": "bearer"}

@router.get("/me")
def get_me():
    return {"id": "usr-001", "name": "Investigator Admin"}
