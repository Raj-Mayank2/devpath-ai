from app.models.resource import Resource
from app.repositories.resource_repository import (
    ResourceRepository,
)
from app.schemas.resource import ResourceCreate


class ResourceService:

    def __init__(self):
        self.repository = ResourceRepository()


    async def create_resource(
        self,
        data: ResourceCreate,
    ) -> Resource:

        resource = Resource(
            topic_title=data.topic_title,
            title=data.title,
            description=data.description,
            url=data.url,
            resource_type=data.resource_type,
        )

        return await self.repository.create(resource)


    async def get_resources_by_topic(
        self,
        topic_title: str,
    ) -> list[Resource]:

        return await self.repository.get_by_topic(
            topic_title
        )


    async def get_all_resources(
        self,
    ) -> list[Resource]:

        return await self.repository.get_all()