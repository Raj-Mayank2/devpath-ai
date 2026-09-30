import asyncio

from app.db.database import init_database
from app.models.roadmap import Roadmap, Topic


async def seed():

    await init_database()

    existing = await Roadmap.find_one(
        Roadmap.title == "Backend Development"
    )

    if existing:
        print("Backend Development roadmap already exists.")
        return

    roadmap = Roadmap(
        title="Backend Development",
        description="A structured roadmap for learning backend development.",
        topics=[
            Topic(
                title="Programming Fundamentals",
                description="Build strong programming fundamentals.",
                order=1,
                children=[
                    Topic(
                        title="Python",
                        description="Learn Python programming fundamentals.",
                        order=1,
                    ),
                    Topic(
                        title="Data Structures",
                        description="Learn common data structures and their use cases.",
                        order=2,
                    ),
                    Topic(
                        title="Object-Oriented Programming",
                        description="Understand classes, objects, inheritance and composition.",
                        order=3,
                    ),
                ],
            ),
            Topic(
                title="Web Fundamentals",
                description="Understand how the web and APIs work.",
                order=2,
                children=[
                    Topic(
                        title="HTTP",
                        description="Understand HTTP requests, responses and status codes.",
                        order=1,
                    ),
                    Topic(
                        title="REST APIs",
                        description="Learn how RESTful APIs are designed.",
                        order=2,
                    ),
                    Topic(
                        title="JSON",
                        description="Understand JSON and data exchange between applications.",
                        order=3,
                    ),
                ],
            ),
            Topic(
                title="FastAPI",
                description="Build modern APIs using FastAPI.",
                order=3,
                children=[
                    Topic(
                        title="Routing",
                        description="Create API routes and endpoints.",
                        order=1,
                    ),
                    Topic(
                        title="Dependencies",
                        description="Understand FastAPI dependency injection.",
                        order=2,
                    ),
                    Topic(
                        title="Pydantic",
                        description="Validate and serialize application data.",
                        order=3,
                    ),
                ],
            ),
            Topic(
                title="Databases",
                description="Learn how backend applications store and retrieve data.",
                order=4,
                children=[
                    Topic(
                        title="SQL",
                        description="Understand relational databases and SQL.",
                        order=1,
                    ),
                    Topic(
                        title="MongoDB",
                        description="Learn document-oriented database design.",
                        order=2,
                    ),
                    Topic(
                        title="Redis",
                        description="Learn caching and in-memory data storage.",
                        order=3,
                    ),
                ],
            ),
            Topic(
                title="Authentication",
                description="Learn how backend applications authenticate users.",
                order=5,
                children=[
                    Topic(
                        title="JWT",
                        description="Implement token-based authentication.",
                        order=1,
                    ),
                    Topic(
                        title="OAuth",
                        description="Understand delegated authorization.",
                        order=2,
                    ),
                ],
            ),
            Topic(
                title="Deployment",
                description="Learn how to deploy backend applications.",
                order=6,
                children=[
                    Topic(
                        title="Docker",
                        description="Containerize backend applications.",
                        order=1,
                    ),
                    Topic(
                        title="CI/CD",
                        description="Automate testing and deployment.",
                        order=2,
                    ),
                    Topic(
                        title="Cloud",
                        description="Deploy applications to cloud infrastructure.",
                        order=3,
                    ),
                ],
            ),
        ],
    )

    await roadmap.insert()

    print("Backend Development roadmap created successfully.")


if __name__ == "__main__":
    asyncio.run(seed())