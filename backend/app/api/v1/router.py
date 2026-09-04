from fastapi import APIRouter
from .endpoints.auth import router as auth_router
from .endpoints.projects import router as projects_router
from .endpoints.contractors import router as contractors_router
from .endpoints.alerts import router as alerts_router
from .endpoints.inspections import router as inspections_router
from .endpoints.complaints import router as complaints_router
from .endpoints.documents import router as documents_router
from .endpoints.ai import router as ai_router
from .endpoints.analytics import router as analytics_router

api_v1_router = APIRouter(prefix="/api/v1")

api_v1_router.include_router(auth_router)
api_v1_router.include_router(projects_router)
api_v1_router.include_router(contractors_router)
api_v1_router.include_router(alerts_router)
api_v1_router.include_router(inspections_router)
api_v1_router.include_router(complaints_router)
api_v1_router.include_router(documents_router)
api_v1_router.include_router(ai_router)
api_v1_router.include_router(analytics_router)
