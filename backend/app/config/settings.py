import os
from pydantic import BaseModel

class Settings(BaseModel):
    APP_NAME: str = "MPLAD-TRACE 360"
    VERSION: str = "2.0.0"
    TAGLINE: str = "Track every rupee. Verify every work. Detect every warning."
    API_V1_PREFIX: str = "/api/v1"
    API_PREFIX: str = "/api" # Legacy fallback
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./mplad_trace.db")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "gov_mplad_trace_jwt_secret_key_2026")
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_MINUTES: int = 60 * 24 # 24 hours
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    DEMO_MODE: bool = True
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "*"
    ]

settings = Settings()
