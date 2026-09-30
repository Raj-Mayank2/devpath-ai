from pydantic import BaseModel


class ResourceCreate(BaseModel):
    topic_title: str
    title: str
    description: str = ""
    url: str
    resource_type: str


class ResourceResponse(BaseModel):
    id: str
    topic_title: str
    title: str
    description: str
    url: str
    resource_type: str