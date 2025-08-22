// src/services/eventService.js
import { apiRequest } from "./api";

// Obtener todos los eventos
export async function getEvents(filters = {}, token) {
  const queryParams = new URLSearchParams();
  if (filters.name) queryParams.append('name', filters.name);
  
  const endpoint = `/event${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
  return await apiRequest(endpoint, "GET", null, token);
}

// Obtener evento por ID
export async function getEventById(id, token) {
  return await apiRequest(`/event/${id}`, "GET", null, token);
}

// Crear evento
export async function createEvent(eventData, token) {
  return await apiRequest("/event", "POST", eventData, token);
}

// Actualizar evento
export async function updateEvent(eventData, token) {
  return await apiRequest("/event", "PUT", eventData, token);
}

// Eliminar evento
export async function deleteEvent(id, token) {
  return await apiRequest(`/event/${id}`, "DELETE", null, token);
}

// Inscribirse a un evento
export async function enrollToEvent(eventId, token) {
  return await apiRequest(`/event/${eventId}/enrollment`, "POST", null, token);
}

// Cancelar inscripción a un evento
export async function unenrollFromEvent(eventId, token) {
  return await apiRequest(`/event/${eventId}/enrollment`, "DELETE", null, token);
}
