from pydantic import BaseModel


class AIChatRequest(BaseModel):
    message: str
    roadmap_id: str = ""
    topic_title: str = ""


class AIChatResponse(BaseModel):
    response: str