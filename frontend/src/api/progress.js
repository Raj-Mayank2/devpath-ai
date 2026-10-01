const API_URL = "http://127.0.0.1:8000/api/v1";

function getAuthHeaders() {
  const token = localStorage.getItem("access_token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function getProgress(roadmapId) {
  const response = await fetch(
    `${API_URL}/progress/${roadmapId}`,
    {
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch progress");
  }

  return response.json();
}

export async function toggleProgress(roadmapId, topicTitle) {
  const response = await fetch(
    `${API_URL}/progress/toggle`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        roadmap_id: roadmapId,
        topic_title: topicTitle,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update progress");
  }

  return response.json();
}