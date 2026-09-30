from fastapi import APIRouter, status

from app.models.roadmap import Roadmap, Topic
from app.schemas.roadmap import RoadmapResponse, TopicResponse
from app.services.roadmap_service import RoadmapService


router = APIRouter(
    prefix="/roadmaps",
    tags=["Roadmaps"],
)

roadmap_service = RoadmapService()


def topic_to_response(topic: Topic) -> TopicResponse:
    return TopicResponse(
        title=topic.title,
        description=topic.description,
        order=topic.order,
        children=[
            topic_to_response(child)
            for child in topic.children
        ],
    )


def roadmap_to_response(roadmap: Roadmap) -> RoadmapResponse:
    return RoadmapResponse(
        id=str(roadmap.id),
        title=roadmap.title,
        description=roadmap.description,
        topics=[
            topic_to_response(topic)
            for topic in roadmap.topics
        ],
    )


@router.post(
    "/",
    response_model=RoadmapResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_roadmap(roadmap: Roadmap):
    created = await roadmap_service.create_roadmap(roadmap)

    return roadmap_to_response(created)


@router.get(
    "/",
    response_model=list[RoadmapResponse],
)
async def get_roadmaps():
    roadmaps = await roadmap_service.get_roadmaps()

    return [
        roadmap_to_response(roadmap)
        for roadmap in roadmaps
    ]


@router.get(
    "/{roadmap_id}",
    response_model=RoadmapResponse,
)
async def get_roadmap(roadmap_id: str):
    roadmap = await roadmap_service.get_roadmap(roadmap_id)

    return roadmap_to_response(roadmap)