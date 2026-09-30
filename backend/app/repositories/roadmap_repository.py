from app.models.roadmap import Roadmap


class RoadmapRepository:

    async def create(self, roadmap: Roadmap) -> Roadmap:
        return await roadmap.insert()

    async def get_all(self) -> list[Roadmap]:
        return await Roadmap.find_all().to_list()

    async def get_by_id(self, roadmap_id: str) -> Roadmap | None:
        return await Roadmap.get(roadmap_id)