const API_URL = "http://127.0.0.1:8000/api/v1";

export async function registerUser(name, email, password) {
  const response = await fetch(
    `${API_URL}/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Registration failed"
    );
  }

  return data;
}


export async function loginUser(email, password) {
  const response = await fetch(
    `${API_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Login failed"
    );
  }

  localStorage.setItem(
    "access_token",
    data.access_token
  );

  return data;
}


export async function getCurrentUser() {
  const token =
    localStorage.getItem("access_token");

  if (!token) {
    return null;
  }

  const response = await fetch(
    `${API_URL}/auth/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    localStorage.removeItem(
      "access_token"
    );

    return null;
  }

  return response.json();
}


export function logoutUser() {
  localStorage.removeItem(
    "access_token"
  );
}