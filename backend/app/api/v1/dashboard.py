from fastapi import APIRouter, Depends

from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.dashboard import DashboardStats
from app.services.dashboard_service import DashboardService


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)

dashboard_service = DashboardService()


@router.get(
    "/stats",
    response_model=DashboardStats,
)
async def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
):
    return await dashboard_service.get_stats(
        user_id=str(current_user.id)
    )