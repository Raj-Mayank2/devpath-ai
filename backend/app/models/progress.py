from datetime import datetime

from beanie import Document


class Progress(Document):
    user_id:str
    roadmap_id:str
    topic_title:str
    completed:bool=False
    completed_at:datetime | None=None

    class Settings:
        name="progress"
        