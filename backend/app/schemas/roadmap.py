from pydantic import BaseModel, Field


class TopicResponse(BaseModel):
    title: str
    description: str
    order: int
    children: list["TopicResponse"] = Field(default_factory=list)


class RoadmapResponse(BaseModel):
    id: str
    title: str
    description: str
    topics: list[TopicResponse] = Field(default_factory=list)