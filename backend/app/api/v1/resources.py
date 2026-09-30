from fastapi import APIRouter, status

from app.schemas.resource import (
    ResourceCreate,
    ResourceResponse,
)
from app.services.resource_service import (
    ResourceService,
)


router = APIRouter(
    prefix="/resources",
    tags=["Resources"],
)

resource_service = ResourceService()


def resource_to_response(resource):
    return ResourceResponse(
        id=str(resource.id),
        topic_title=resource.topic_title,
        title=resource.title,
        description=resource.description,
        url=resource.url,
        resource_type=resource.resource_type,
    )


@router.post(
    "/",
    response_model=ResourceResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_resource(
    data: ResourceCreate,
):

    resource = await resource_service.create_resource(
        data
    )

    return resource_to_response(resource)


@router.get(
    "/",
    response_model=list[ResourceResponse],
)
async def get_resources():

    resources = await resource_service.get_all_resources()

    return [
        resource_to_response(resource)
        for resource in resources
    ]


@router.get(
    "/topic/{topic_title}",
    response_model=list[ResourceResponse],
)
async def get_resources_by_topic(
    topic_title: str,
):

    resources = (
        await resource_service.get_resources_by_topic(
            topic_title
        )
    )

    return [
        resource_to_response(resource)
        for resource in resources
    ]