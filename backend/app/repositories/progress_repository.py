from app.models.progress import Progress


class ProgressRepository:

    async def get(
        self,
        user_id: str,
        roadmap_id: str,
        topic_title: str,
    ) -> Progress | None:

        return await Progress.find_one(
            Progress.user_id == user_id,
            Progress.roadmap_id == roadmap_id,
            Progress.topic_title == topic_title,
        )

    async def create(self, progress: Progress) -> Progress:
        return await progress.insert()

    async def get_by_user_and_roadmap(
        self,
        user_id: str,
        roadmap_id: str,
    ) -> list[Progress]:

        return await Progress.find(
            Progress.user_id == user_id,
            Progress.roadmap_id == roadmap_id,
        ).to_list()