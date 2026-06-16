import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings

class EmailService:
    @staticmethod
    def send_verification_email(email: str, name: str, verification_url: str):
        provider = settings.EMAIL_PROVIDER
        
        if provider == "console":
            print("\n" + "="*50)
            print("[DEV EMAIL] Verify your ThreatLens account:")
            print(f"To: {name} <{email}>")
            print(f"URL: {verification_url}")
            print("="*50 + "\n")
        elif provider == "smtp":
            smtp_host = settings.SMTP_HOST
            smtp_port = settings.SMTP_PORT or 587
            smtp_user = settings.SMTP_USER
            smtp_pass = settings.SMTP_PASSWORD
            email_from = settings.EMAIL_FROM or "noreply@threatlens.local"

            msg = MIMEMultipart("alternative")
            msg["Subject"] = "Verify your ThreatLens account"
            msg["From"] = f"ThreatLens <{email_from}>"
            msg["To"] = f"{name} <{email}>"

            text_content = f"Hi {name},\n\nPlease verify your ThreatLens account by clicking the link below:\n{verification_url}\n\nThanks,\nThreatLens Team"
            html_content = f"""
            <html>
                <body>
                    <p>Hi {name},</p>
                    <p>Please verify your ThreatLens account by clicking the link below:</p>
                    <p><a href="{verification_url}">Verify Account</a></p>
                    <br>
                    <p>Thanks,<br>ThreatLens Team</p>
                </body>
            </html>
            """
            
            msg.attach(MIMEText(text_content, "plain"))
            msg.attach(MIMEText(html_content, "html"))

            try:
                server = smtplib.SMTP(smtp_host, smtp_port)
                server.starttls()
                server.login(smtp_user, smtp_pass)
                server.sendmail(email_from, email, msg.as_string())
                server.quit()
                print(f"[SMTP] Verification email sent to {email}")
            except Exception as e:
                print(f"[SMTP ERROR] Failed to send email to {email}: {e}")
        else:
            print(f"[ERROR] Unknown EMAIL_PROVIDER: {provider}")
