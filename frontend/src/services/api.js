
const API_URL = import.meta.env.VITE_API_URL || "";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    },
    ...options
  });

  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    const responseText = await response.text();

    throw new Error(
      `API returned non-JSON response (${response.status}). Check the API URL and Netlify Functions configuration.`
    );
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "API request failed");
  }

  return data;
}

export const getTasks = () => request("/api/tasks");

export const createTask = (task) =>
  request("/api/tasks", {
    method: "POST",
    body: JSON.stringify(task)
  });

export const updateTask = (id, updates) =>
  request(`/api/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates)
  });

export const deleteTask = (id) =>
  request(`/api/tasks/${id}`, {
    method: "DELETE"
  });
