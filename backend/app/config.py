import os
from pydantic import BaseModel

class Settings(BaseModel):
    APP_NAME: str = "MPLAD-TRACE 360"
    VERSION: str = "1.0.0"
    TAGLINE: str = "Track every rupee. Verify every work. Detect every warning."
    API_PREFIX: str = "/api"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./mplad_trace.db")
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "*"
    ]
    DEMO_MODE: bool = True
    JWT_SECRET: str = "mplad-trace-super-secret-key-2024-gov-in"
    JWT_ALGORITHM: str = "HS256"
    
settings = Settings()
