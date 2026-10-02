from app.ai.graph import ai_graph
from app.repositories.conversation_repository import ConversationRepository
from app.schemas.ai import AIChatRequest


class AIService:

    def __init__(self):
        self.conversation_repository = ConversationRepository()

    async def chat(
        self,
        user_id: str,
        data: AIChatRequest,
    ) -> str:

        conversation = await self.conversation_repository.get_or_create(
            user_id=user_id,
            roadmap_id=data.roadmap_id,
            topic_title=data.topic_title,
        )

        conversation_history = [
            {
                "role": message.role,
                "content": message.content,
            }
            for message in conversation.messages
        ]

        result = await ai_graph.ainvoke(
            {
                "user_id": user_id,
                "user_message": data.message,

                "roadmap_id": data.roadmap_id,
                "topic_title": data.topic_title,

                "roadmap_context": "",
                "progress_context": "",

                "conversation_history": conversation_history,

                "response": "",
            }
        )

        response = result["response"]

        await self.conversation_repository.add_message(
            conversation=conversation,
            role="human",
            content=data.message,
        )

        await self.conversation_repository.add_message(
            conversation=conversation,
            role="assistant",
            content=response,
        )

        return response