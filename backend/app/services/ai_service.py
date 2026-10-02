from app.ai.graph import ai_graph
from app.schemas.ai import AIChatRequest


class AIService:
    async def chat(
        self,
        user_id: str,
        data: AIChatRequest,
    ) -> str:

        result = await ai_graph.ainvoke(
            {
                "user_id": user_id,
                "user_message": data.message,

                "roadmap_id": "",
                "topic_title": "",

                "roadmap_context": "",
                "progress_context": "",
                "response": "",
            }
        )

        return result["response"]