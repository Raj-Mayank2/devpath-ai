const API_URL = "http://127.0.0.1:8000/api/v1";

export async function sendAIMessage(message) {
  const token = localStorage.getItem("access_token");

  const response = await fetch(`${API_URL}/ai/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      message,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to get AI response");
  }

  return data;
}