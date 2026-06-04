from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.user import User

router = APIRouter()

@router.post("/register")
def register():
    return {"msg": "User registered"}

@router.post("/login")
def login():
    return {"access_token": "mock-token", "token_type": "bearer"}

@router.get("/me")
def get_me(db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == "usr-001").first()
    if user:
        return {"id": user.id, "name": user.name, "email": user.email, "role": user.role}
    return {"id": "usr-001", "name": "Investigator Admin", "role": "admin"}
