const API_URL = "http://127.0.0.1:8000/api/v1";

export async function getRoadmaps() {
  const response = await fetch(`${API_URL}/roadmaps/`);

  if (!response.ok) {
    throw new Error("Failed to fetch roadmaps");
  }

  return response.json();
}