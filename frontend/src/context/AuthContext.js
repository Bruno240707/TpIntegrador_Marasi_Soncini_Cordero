import Constants from "expo-constants";

const API_URL = Constants.expoConfig.extra.apiUrl || process.env.EXPO_PUBLIC_API_URL;

export const loginUser = async ({ username, password }) => {
  try {
    const res = await fetch(`${API_URL}/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    return await res.json();
  } catch (err) {
    console.error("Error loginUser:", err);
    return { success: false, message: "No se pudo conectar al servidor" };
  }
};

export const registerUser = async (userData) => {
  try {
    const res = await fetch(`${API_URL}/user/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    return await res.json();
  } catch (err) {
    console.error("Error registerUser:", err);
    return { success: false, message: "No se pudo conectar al servidor" };
  }
};
