// src/services/api.js
import Constants from "expo-constants";
import axios from "axios";

const API_URL = Constants.expoConfig.extra.apiUrl || process.env.EXPO_PUBLIC_API_URL;

export const apiRequest = async (endpoint, method = "GET", data = null, token = null) => {
  try {
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await axios({
      url: `${API_URL}${endpoint}`,
      method,
      data,
      headers,
    });

    return response.data;
  } catch (error) {
    console.error("Error en apiRequest:", error.message);
    throw error;
  }
};
