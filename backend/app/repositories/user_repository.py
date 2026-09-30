from app.models.user import User


class UserRepository:

    async def create(self, user: User) -> User:
        return await user.insert()

    async def get_by_email(self, email: str) -> User | None:
        return await User.find_one(User.email == email)

    async def get_all(self) -> list[User]:
        return await User.find_all().to_list()