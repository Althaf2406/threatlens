import secrets
import hashlib
import os
from datetime import datetime, timedelta, timezone
from app.models.user import User

FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")
EXPIRE_HOURS = int(os.getenv("EMAIL_VERIFICATION_EXPIRE_HOURS", "24"))
COOLDOWN_SECONDS = int(os.getenv("VERIFICATION_RESEND_COOLDOWN_SECONDS", "60"))
DAILY_LIMIT = int(os.getenv("VERIFICATION_RESEND_DAILY_LIMIT", "5"))

class EmailVerificationService:
    @staticmethod
    def generate_verification_token() -> str:
        return secrets.token_urlsafe(32)

    @staticmethod
    def hash_verification_token(token: str) -> str:
        return hashlib.sha256(token.encode("utf-8")).hexdigest()

    @staticmethod
    def verify_token_hash(raw_token: str, stored_hash: str) -> bool:
        if not stored_hash:
            return False
        return EmailVerificationService.hash_verification_token(raw_token) == stored_hash

    @staticmethod
    def create_verification_expiry() -> datetime:
        return datetime.now(timezone.utc) + timedelta(hours=EXPIRE_HOURS)

    @staticmethod
    def can_resend_verification(user: User) -> bool:
        now = datetime.now(timezone.utc)
        
        # Check cooldown
        if user.verification_sent_at:
            # Ensure timezone awareness matches
            sent_at = user.verification_sent_at
            if sent_at.tzinfo is None:
                sent_at = sent_at.replace(tzinfo=timezone.utc)
            if (now - sent_at).total_seconds() < COOLDOWN_SECONDS:
                return False
                
        # For simplicity in MVP, we just use a generic resend count
        if user.resend_verification_count >= DAILY_LIMIT:
            # Optionally check if 24 hours have passed since last increment to reset it
            return False
            
        return True

    @staticmethod
    def create_verification_url(token: str) -> str:
        return f"{FRONTEND_ORIGIN}/verify-email?token={token}"
