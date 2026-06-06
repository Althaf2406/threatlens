import os

class EmailService:
    @staticmethod
    def send_verification_email(email: str, name: str, verification_url: str):
        provider = os.getenv("EMAIL_PROVIDER", "console")
        
        if provider == "console":
            print("\n" + "="*50)
            print("[DEV EMAIL] Verify your ThreatLens account:")
            print(f"To: {name} <{email}>")
            print(f"URL: {verification_url}")
            print("="*50 + "\n")
        else:
            # SMTP integration goes here in the future
            print(f"[SMTP MODE NOT IMPLEMENTED] Would send to {email}: {verification_url}")
