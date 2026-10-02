from typing import TypedDict


class AIState(TypedDict):
    user_id: str
    user_message: str

    roadmap_id: str
    topic_title: str

    roadmap_context: str
    progress_context: str

    response: str