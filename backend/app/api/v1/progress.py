from fastapi import APIRouter, Depends, status

from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.progress import ProgressCreate, ProgressResponse
from app.services.progress_service import ProgressService


router = APIRouter(
    prefix="/progress",
    tags=["Progress"],
)

progress_service = ProgressService()


def progress_to_response(progress):
    return ProgressResponse(
        id=str(progress.id),
        user_id=progress.user_id,
        roadmap_id=progress.roadmap_id,
        topic_title=progress.topic_title,
        completed=progress.completed,
        completed_at=progress.completed_at,
    )


@router.post(
    "/toggle",
    response_model=ProgressResponse,
    status_code=status.HTTP_200_OK,
)
async def toggle_progress(
    data: ProgressCreate,
    current_user: User = Depends(get_current_user),
):
    progress = await progress_service.toggle_topic(
        user_id=str(current_user.id),
        data=data,
    )

    return progress_to_response(progress)


@router.get(
    "/{roadmap_id}",
    response_model=list[ProgressResponse],
)
async def get_progress(
    roadmap_id: str,
    current_user: User = Depends(get_current_user),
):
    progress = await progress_service.get_progress(
        user_id=str(current_user.id),
        roadmap_id=roadmap_id,
    )

    return [
        progress_to_response(item)
        for item in progress
    ]