const API_URL = "http://127.0.0.1:8000/api/v1";


export async function getResourcesByTopic(topicTitle) {
  const response = await fetch(
    `${API_URL}/resources/topic/${encodeURIComponent(topicTitle)}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch resources");
  }

  return response.json();
}