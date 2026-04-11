const API_URL = "http://localhost:3000/api"; // this needs to change

async function apiRequest(endpoint, method = "GET", body = null) {
  const res = await fetch(API_URL + endpoint, {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("token")
    },
    body: body ? JSON.stringify(body) : null
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "API error");
  }

  return data;
}