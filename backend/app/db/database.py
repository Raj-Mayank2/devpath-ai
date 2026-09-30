from pymongo import AsyncMongoClient
from beanie import init_beanie

from app.core.config import settings
from app.models.user import User


client = AsyncMongoClient(settings.mongodb_url)


async def init_database():
    print("Starting MongoDB connection...")

    database = client[settings.mongodb_database]

    await client.admin.command("ping")

    print("MongoDB ping successful")

    await init_beanie(
        database=database,
        document_models=[User],
    )

    print("Beanie initialized")
    print("MongoDB connected successfully")