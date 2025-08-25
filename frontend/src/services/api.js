import Constants from "expo-constants";

const API_URL = Constants.expoConfig.extra?.apiUrl || process.env.EXPO_PUBLIC_API_URL;

export async function apiRequest(endpoint, method = "GET", body = null, token = null) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Error en la request");
  }

  return await response.json();
}
