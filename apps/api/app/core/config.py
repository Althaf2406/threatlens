from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "ThreatLens API"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "supersecretkey-please-change-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    DATABASE_URL: str = "sqlite:///./threatlens.db"
    COOKIE_SECURE: bool = False
    FRONTEND_ORIGIN: str = "http://localhost:3000"
    
    EMAIL_PROVIDER: str = "console"
    SMTP_HOST: str | None = None
    SMTP_PORT: int | None = None
    SMTP_USER: str | None = None
    SMTP_PASSWORD: str | None = None
    EMAIL_FROM: str | None = None

    class Config:
        env_file = ".env"

settings = Settings()
