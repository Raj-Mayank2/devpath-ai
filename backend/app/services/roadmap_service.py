from bson import ObjectId
from fastapi import HTTPException, status

from app.models.roadmap import Roadmap
from app.repositories.roadmap_repository import RoadmapRepository


class RoadmapService:

    def __init__(self):
        self.repository = RoadmapRepository()

    async def create_roadmap(self, roadmap: Roadmap) -> Roadmap:
        return await self.repository.create(roadmap)

    async def get_roadmaps(self) -> list[Roadmap]:
        return await self.repository.get_all()

    async def get_roadmap(self, roadmap_id: str) -> Roadmap:

        if not ObjectId.is_valid(roadmap_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid roadmap ID",
            )

        roadmap = await self.repository.get_by_id(roadmap_id)

        if not roadmap:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Roadmap not found",
            )

        return roadmap