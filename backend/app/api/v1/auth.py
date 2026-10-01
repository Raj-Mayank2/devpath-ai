from fastapi import APIRouter, Depends, status

from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.auth import LoginRequest, TokenResponse
from app.schemas.user import UserCreate, UserResponse
from app.services.auth_service import AuthService


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)

auth_service = AuthService()


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
async def register(data: UserCreate):
    user = await auth_service.register_user(data)

    return UserResponse(
        id=str(user.id),
        name=user.name,
        email=user.email,
    )


@router.post(
    "/login",
    response_model=TokenResponse,
)
async def login(data: LoginRequest):
    access_token = await auth_service.login_user(
        email=data.email,
        password=data.password,
    )

    return TokenResponse(
        access_token=access_token,
    )

@router.get(
    "/me",
    response_model=UserResponse,
)
async def get_me(
    current_user: User = Depends(get_current_user),
):
    return UserResponse(
        id=str(current_user.id),
        name=current_user.name,
        email=current_user.email,
    )