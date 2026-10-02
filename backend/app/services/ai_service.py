from app.ai.graph import ai_graph
from app.schemas.ai import AIChatRequest


class AIService:

    async def chat(self, data: AIChatRequest) -> str:
        result = await ai_graph.ainvoke(
            {
                "user_message": data.message,
                "response": "",
            }
        )

        return result["response"]