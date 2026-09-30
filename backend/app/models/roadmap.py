from beanie import Document
from pydantic import BaseModel, Field


class Topic(BaseModel):
    title: str
    description: str = ""
    order: int
    children: list["Topic"] = Field(default_factory=list)


class Roadmap(Document):
    title: str
    description: str
    topics: list[Topic] = Field(default_factory=list)

    class Settings:
        name = "roadmaps"