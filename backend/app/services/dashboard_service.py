from app.models.progress import Progress
from app.models.roadmap import Roadmap


class DashboardService:

    async def get_stats(self, user_id: str):
        roadmaps = await Roadmap.find_all().to_list()

        total_topics = 0
        completed_topics = 0

        roadmap_progress = []

        for roadmap in roadmaps:

            roadmap_total = self._count_topics(
                roadmap.topics
            )

            progress = await Progress.find(
                Progress.user_id == user_id,
                Progress.roadmap_id == str(roadmap.id),
                Progress.completed == True,
            ).to_list()

            roadmap_completed = len(progress)

            roadmap_percentage = (
                0
                if roadmap_total == 0
                else round(
                    (roadmap_completed / roadmap_total)
                    * 100
                )
            )

            total_topics += roadmap_total
            completed_topics += roadmap_completed

            roadmap_progress.append(
                {
                    "roadmap_id": str(roadmap.id),
                    "title": roadmap.title,
                    "total_topics": roadmap_total,
                    "completed_topics": roadmap_completed,
                    "progress_percentage": roadmap_percentage,
                }
            )

        overall_progress = (
            0
            if total_topics == 0
            else round(
                (completed_topics / total_topics)
                * 100
            )
        )

        return {
            "total_roadmaps": len(roadmaps),
            "total_topics": total_topics,
            "completed_topics": completed_topics,
            "overall_progress": overall_progress,
            "roadmaps": roadmap_progress,
        }

    def _count_topics(self, topics) -> int:
        count = 0

        for topic in topics:
            count += 1

            if topic.children:
                count += self._count_topics(
                    topic.children
                )

        return count