from fastapi import APIRouter, Depends, HTTPException, status, Response, Cookie, BackgroundTasks
from sqlalchemy.orm import Session
from datetime import timedelta, datetime, timezone

from app.db.database import get_db
from app.models.user import User
from app.schemas.auth import UserLogin, UserRegister, Token
from app.schemas.user import User as UserSchema, OnboardingProgressUpdate
from app.core.security import get_password_hash, verify_password, create_access_token
from app.core.config import settings
from app.services.email_verification import EmailVerificationService
from app.services.email_service import EmailService
from pydantic import BaseModel, EmailStr

router = APIRouter()

@router.post("/register", response_model=UserSchema)
def register(user_in: UserRegister, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    token = EmailVerificationService.generate_verification_token()
    token_hash = EmailVerificationService.hash_verification_token(token)
    expires_at = EmailVerificationService.create_verification_expiry()

    user = User(
        id=f"usr-{int(datetime.now().timestamp())}",  # Simple ID generation for MVP
        name=user_in.name,
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        role="user",
        plan_name="free",
        project_limit=3,
        token_limit=0, # Locked until verified
        email_verified=False,
        account_status="pending_verification",
        verification_token_hash=token_hash,
        verification_token_expires_at=expires_at,
        verification_sent_at=datetime.now(timezone.utc)
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    verification_url = EmailVerificationService.create_verification_url(token)
    background_tasks.add_task(EmailService.send_verification_email, user.email, user.name, verification_url)

    return user

class ResendVerificationRequest(BaseModel):
    email: EmailStr

@router.post("/login")
def login(user_in: UserLogin, response: Response, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_in.email).first()
    if not user or not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    
    if not user.email_verified or user.account_status == "pending_verification":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Please verify your email before logging in.",
        )

    if user.account_status in ["suspended", "disabled"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Account is {user.account_status}.",
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
    
    return {
        "msg": "Login successful",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "onboarding_completed": user.onboarding_completed,
            "onboarding_completed_at": user.onboarding_completed_at,
            "onboarding_step": user.onboarding_step
        }
    }

@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(
        key="threatlens_access_token",
        path="/",
        samesite="lax",
        secure=settings.COOKIE_SECURE
    )
    return {"msg": "Successfully logged out"}

@router.get("/verify-email")
def verify_email(token: str, db: Session = Depends(get_db)):
    token_hash = EmailVerificationService.hash_verification_token(token)
    user = db.query(User).filter(User.verification_token_hash == token_hash).first()
    
    if not user:
        raise HTTPException(status_code=400, detail="Invalid verification token")
        
    if user.verification_token_expires_at and user.verification_token_expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="Verification token expired")
        
    user.email_verified = True
    user.email_verified_at = datetime.now(timezone.utc)
    user.account_status = "active"
    user.verification_token_hash = None
    user.verification_token_expires_at = None
    user.token_limit = 1000 # Unlock tokens
    
    db.add(user)
    db.commit()
    return {"msg": "Email verified successfully. You can now log in."}

@router.post("/resend-verification")
def resend_verification(payload: ResendVerificationRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    generic_msg = "If the account exists and is not verified, a verification email has been sent."
    
    if not user or user.email_verified:
        return {"msg": generic_msg}
        
    if not EmailVerificationService.can_resend_verification(user):
        raise HTTPException(status_code=429, detail="Too many verification requests. Please try again later.")
        
    token = EmailVerificationService.generate_verification_token()
    token_hash = EmailVerificationService.hash_verification_token(token)
    expires_at = EmailVerificationService.create_verification_expiry()
    
    user.verification_token_hash = token_hash
    user.verification_token_expires_at = expires_at
    user.verification_sent_at = datetime.now(timezone.utc)
    user.resend_verification_count += 1
    
    db.add(user)
    db.commit()
    
    verification_url = EmailVerificationService.create_verification_url(token)
    background_tasks.add_task(EmailService.send_verification_email, user.email, user.name, verification_url)
    
    return {"msg": generic_msg}

from app.dependencies.auth import get_current_user

@router.get("/me", response_model=UserSchema)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.patch("/onboarding/progress", response_model=UserSchema)
def update_onboarding_progress(
    payload: OnboardingProgressUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    current_user.onboarding_step = payload.step
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user

@router.post("/onboarding/complete", response_model=UserSchema)
def complete_onboarding(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    current_user.onboarding_completed = True
    current_user.onboarding_completed_at = datetime.now(timezone.utc)
    current_user.onboarding_step = "completed"
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user

@router.post("/onboarding/reset", response_model=UserSchema)
def reset_onboarding(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    current_user.onboarding_completed = False
    current_user.onboarding_completed_at = None
    current_user.onboarding_step = None
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user
