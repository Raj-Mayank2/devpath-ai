const API_URL = "http://127.0.0.1:8000/api/v1";


export async function getProgress(
  userId,
  roadmapId
) {
  const response = await fetch(
    `${API_URL}/progress/${userId}/${roadmapId}`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch progress"
    );
  }

  return response.json();
}


export async function toggleProgress(
  userId,
  roadmapId,
  topicTitle
) {
  const response = await fetch(
    `${API_URL}/progress/toggle`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        user_id: userId,
        roadmap_id: roadmapId,
        topic_title: topicTitle,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to update progress"
    );
  }

  return response.json();
}