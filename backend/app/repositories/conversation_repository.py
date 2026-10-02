from datetime import datetime, timezone

from app.models.conversation import Conversation, ConversationMessage


class ConversationRepository:

    async def get_or_create(
        self,
        user_id: str,
        roadmap_id: str = "",
        topic_title: str = "",
    ) -> Conversation:

        conversation = await Conversation.find_one(
            Conversation.user_id == user_id,
            Conversation.roadmap_id == roadmap_id,
            Conversation.topic_title == topic_title,
        )

        if conversation:
            return conversation

        conversation = Conversation(
            user_id=user_id,
            roadmap_id=roadmap_id,
            topic_title=topic_title,
        )

        await conversation.insert()

        return conversation

    async def add_message(
        self,
        conversation: Conversation,
        role: str,
        content: str,
    ) -> Conversation:

        conversation.messages.append(
            ConversationMessage(
                role=role,
                content=content,
            )
        )

        conversation.updated_at = datetime.now(timezone.utc)

        await conversation.save()

        return conversation