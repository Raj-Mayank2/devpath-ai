from app.models.resource import Resource


class ResourceRepository:

    async def create(
        self,
        resource: Resource,
    ) -> Resource:

        return await resource.insert()


    async def get_by_topic(
        self,
        topic_title: str,
    ) -> list[Resource]:

        return await Resource.find(
            Resource.topic_title == topic_title
        ).to_list()


    async def get_all(
        self,
    ) -> list[Resource]:

        return await Resource.find_all().to_list()