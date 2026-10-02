from fastapi import APIRouter, Depends

from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.ai import AIChatRequest, AIChatResponse
from app.services.ai_service import AIService


router = APIRouter(
    prefix="/ai",
    tags=["AI"],
)

ai_service = AIService()


@router.post("/chat", response_model=AIChatResponse)
async def chat_with_ai(
    data: AIChatRequest,
    current_user: User = Depends(get_current_user),
):
    response = await ai_service.chat(data)

    return AIChatResponse(
        response=response,
    )