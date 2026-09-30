import asyncio

from app.db.database import init_database
from app.models.resource import Resource


RESOURCES = [
    {
        "topic_title": "Python",
        "title": "Python Official Documentation",
        "description": "Official Python documentation and language reference.",
        "url": "https://docs.python.org/3/",
        "resource_type": "documentation",
    },
    {
        "topic_title": "Python",
        "title": "Python Tutorial",
        "description": "Official Python tutorial covering Python fundamentals.",
        "url": "https://docs.python.org/3/tutorial/",
        "resource_type": "tutorial",
    },
    {
        "topic_title": "HTTP",
        "title": "MDN HTTP Overview",
        "description": "Learn how HTTP requests and responses work.",
        "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP",
        "resource_type": "documentation",
    },
    {
        "topic_title": "REST APIs",
        "title": "MDN HTTP Methods",
        "description": "Understand HTTP methods commonly used by REST APIs.",
        "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods",
        "resource_type": "documentation",
    },
    {
        "topic_title": "FastAPI",
        "title": "FastAPI Documentation",
        "description": "Official FastAPI documentation.",
        "url": "https://fastapi.tiangolo.com/",
        "resource_type": "documentation",
    },
    {
        "topic_title": "Pydantic",
        "title": "Pydantic Documentation",
        "description": "Learn data validation and serialization with Pydantic.",
        "url": "https://docs.pydantic.dev/",
        "resource_type": "documentation",
    },
    {
        "topic_title": "MongoDB",
        "title": "MongoDB Documentation",
        "description": "Official MongoDB documentation and database concepts.",
        "url": "https://www.mongodb.com/docs/",
        "resource_type": "documentation",
    },
    {
        "topic_title": "Redis",
        "title": "Redis Documentation",
        "description": "Learn Redis data structures and caching concepts.",
        "url": "https://redis.io/docs/",
        "resource_type": "documentation",
    },
    {
        "topic_title": "Docker",
        "title": "Docker Documentation",
        "description": "Learn containers and Docker fundamentals.",
        "url": "https://docs.docker.com/",
        "resource_type": "documentation",
    },
    {
        "topic_title": "JWT",
        "title": "JWT Introduction",
        "description": "Understand JSON Web Tokens and their structure.",
        "url": "https://jwt.io/introduction",
        "resource_type": "documentation",
    },
]


async def seed():
    await init_database()

    created = 0

    for resource_data in RESOURCES:

        existing = await Resource.find_one(
            Resource.topic_title == resource_data["topic_title"],
            Resource.title == resource_data["title"],
        )

        if existing:
            print(
                f"Already exists: "
                f"{resource_data['title']}"
            )
            continue

        resource = Resource(
            **resource_data
        )

        await resource.insert()

        created += 1

        print(
            f"Created: {resource_data['title']}"
        )

    print(
        f"\nCreated {created} new resources."
    )


if __name__ == "__main__":
    asyncio.run(seed())