from beanie import Document


class Resource(Document):
    topic_title: str
    title: str
    description: str = ""
    url: str
    resource_type: str

    class Settings:
        name = "resources"