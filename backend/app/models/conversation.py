from datetime import datetime, timezone

from beanie import Document
from pydantic import BaseModel, Field


class ConversationMessage(BaseModel):
    role: str
    content: str
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )


class Conversation(Document):
    user_id: str
    roadmap_id: str = ""
    topic_title: str = ""

    messages: list[ConversationMessage] = Field(default_factory=list)

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

    class Settings:
        name = "conversations"