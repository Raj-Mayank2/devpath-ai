from fastapi import HTTPException, status

from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserCreate


class UserService:

    def __init__(self):
        self.repository = UserRepository()

    async def create_user(self, data: UserCreate) -> User:
        existing_user = await self.repository.get_by_email(data.email)

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="User with this email already exists",
            )

        user = User(
            name=data.name,
            email=data.email,
        )

        return await self.repository.create(user)

    async def get_users(self) -> list[User]:
        return await self.repository.get_all()