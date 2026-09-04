from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .database import init_and_seed_db
from .api import projects, contractors, alerts, inspections, complaints, analytics, ai, admin

# Initialize schema and seed data on import so all clients/tests have tables ready
init_and_seed_db()

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_and_seed_db()
    yield

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="AI-Powered MPLADS Work Monitoring, Contract Intelligence & Early-Warning Platform",
    lifespan=lifespan
)

# Configure CORS for local development and demo access
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routers
app.include_router(projects.router, prefix=settings.API_PREFIX)
app.include_router(contractors.router, prefix=settings.API_PREFIX)
app.include_router(alerts.router, prefix=settings.API_PREFIX)
app.include_router(inspections.router, prefix=settings.API_PREFIX)
app.include_router(complaints.router, prefix=settings.API_PREFIX)
app.include_router(analytics.router, prefix=settings.API_PREFIX)
app.include_router(ai.router, prefix=settings.API_PREFIX)
app.include_router(admin.router, prefix=settings.API_PREFIX)

from .api.v1.router import api_v1_router
app.include_router(api_v1_router)

@app.get("/")
def root():
    return {
        "platform": settings.APP_NAME,
        "tagline": settings.TAGLINE,
        "version": settings.VERSION,
        "status": "OPERATIONAL",
        "demo_mode": settings.DEMO_MODE,
        "documentation": "/docs"
    }

@app.get("/health")
def health():
    return {"status": "healthy", "service": "MPLAD-TRACE-360-BACKEND"}
