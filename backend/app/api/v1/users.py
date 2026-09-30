from fastapi import APIRouter, status

from app.schemas.user import UserCreate, UserResponse
from app.services.user_service import UserService


router = APIRouter(
    prefix="/users",
    tags=["Users"],
)

user_service = UserService()


@router.post(
    "/",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_user(data: UserCreate):
    user = await user_service.create_user(data)

    return UserResponse(
        id=str(user.id),
        name=user.name,
        email=user.email,
    )


@router.get(
    "/",
    response_model=list[UserResponse],
)
async def get_users():
    users = await user_service.get_users()

    return [
        UserResponse(
            id=str(user.id),
            name=user.name,
            email=user.email,
        )
        for user in users
    ]