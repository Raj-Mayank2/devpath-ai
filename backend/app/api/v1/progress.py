from fastapi import APIRouter, status

from app.schemas.progress import (
    ProgressCreate,
    ProgressResponse,
)
from app.services.progress_service import ProgressService


router = APIRouter(
    prefix="/progress",
    tags=["Progress"],
)

progress_service = ProgressService()


@router.post(
    "/toggle",
    response_model=ProgressResponse,
    status_code=status.HTTP_200_OK,
)
async def toggle_progress(data: ProgressCreate):

    progress = await progress_service.toggle_topic(data)

    return ProgressResponse(
        id=str(progress.id),
        user_id=progress.user_id,
        roadmap_id=progress.roadmap_id,
        topic_title=progress.topic_title,
        completed=progress.completed,
        completed_at=progress.completed_at,
    )


@router.get(
    "/{user_id}/{roadmap_id}",
    response_model=list[ProgressResponse],
)
async def get_progress(
    user_id: str,
    roadmap_id: str,
):

    progress = await progress_service.get_progress(
        user_id=user_id,
        roadmap_id=roadmap_id,
    )

    return [
        ProgressResponse(
            id=str(item.id),
            user_id=item.user_id,
            roadmap_id=item.roadmap_id,
            topic_title=item.topic_title,
            completed=item.completed,
            completed_at=item.completed_at,
        )
        for item in progress
    ]