from datetime import datetime

from pydantic import BaseModel


class ProgressCreate(BaseModel):
    user_id: str
    roadmap_id: str
    topic_title: str


class ProgressResponse(BaseModel):
    id: str
    user_id: str
    roadmap_id: str
    topic_title: str
    completed: bool
    completed_at: datetime | None