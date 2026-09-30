from datetime import datetime

from app.models.progress import Progress
from app.repositories.progress_repository import ProgressRepository
from app.schemas.progress import ProgressCreate


class ProgressService:

    def __init__(self):
        self.repository = ProgressRepository()

    async def toggle_topic(
        self,
        data: ProgressCreate,
    ) -> Progress:

        existing = await self.repository.get(
            user_id=data.user_id,
            roadmap_id=data.roadmap_id,
            topic_title=data.topic_title,
        )

        if existing:

            existing.completed = not existing.completed

            if existing.completed:
                existing.completed_at = datetime.utcnow()
            else:
                existing.completed_at = None

            await existing.save()

            return existing

        progress = Progress(
            user_id=data.user_id,
            roadmap_id=data.roadmap_id,
            topic_title=data.topic_title,
            completed=True,
            completed_at=datetime.utcnow(),
        )

        return await self.repository.create(progress)

    async def get_progress(
        self,
        user_id: str,
        roadmap_id: str,
    ) -> list[Progress]:

        return await self.repository.get_by_user_and_roadmap(
            user_id=user_id,
            roadmap_id=roadmap_id,
        )