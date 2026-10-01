from pydantic import BaseModel


class RoadmapProgress(BaseModel):
    roadmap_id: str
    title: str
    total_topics: int
    completed_topics: int
    progress_percentage: int


class DashboardStats(BaseModel):
    total_roadmaps: int
    total_topics: int
    completed_topics: int
    overall_progress: int
    roadmaps: list[RoadmapProgress]