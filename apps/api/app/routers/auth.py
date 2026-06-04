from fastapi import APIRouter, Depends, HTTPException, status, Response, Cookie
from sqlalchemy.orm import Session
from datetime import timedelta, datetime

from app.db.database import get_db
from app.models.user import User
from app.schemas.auth import UserLogin, UserRegister, Token
from app.schemas.user import User as UserSchema
from app.core.security import get_password_hash, verify_password, create_access_token
from app.core.config import settings

router = APIRouter()

@router.post("/register", response_model=UserSchema)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    user = User(
        id=f"usr-{int(datetime.now().timestamp())}",  # Simple ID generation for MVP
        name=user_in.name,
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        role="user",
        plan_name="free",
        project_limit=3,
        token_limit=1000
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.post("/login")
def login(user_in: UserLogin, response: Response, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_in.email).first()
    if not user or not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.id, "email": user.email, "role": user.role},
        expires_delta=access_token_expires
    )
    
    response.set_cookie(
        key="threatlens_access_token",
        value=access_token,
        httponly=True,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        expires=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        samesite="lax",
        secure=settings.COOKIE_SECURE,
        path="/"
    )
    
    return {"msg": "Login successful", "user": {"id": user.id, "name": user.name, "email": user.email, "role": user.role}}

@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(
        key="threatlens_access_token",
        path="/",
        samesite="lax",
        secure=settings.COOKIE_SECURE
    )
    return {"msg": "Successfully logged out"}

from app.dependencies.auth import get_current_user

@router.get("/me", response_model=UserSchema)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
