// src/services/authService.js
import { apiRequest } from "./api";

// Registro de usuario
export async function registerUser(userData) {
  return await apiRequest("/user/register", "POST", userData);
}

// Login de usuario
export async function loginUser(credentials) {
  return await apiRequest("/user/login", "POST", credentials);
}
