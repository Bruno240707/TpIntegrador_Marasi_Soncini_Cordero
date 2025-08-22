// src/services/api.js
import { API_URL, DEFAULT_HEADERS, getHeadersWithToken, logApiConfig } from '../config/apiConfig.js';

// Log de configuración al cargar el módulo
logApiConfig();

export async function apiRequest(endpoint, method = "GET", body = null, token = null) {
  try {
    const fullUrl = `${API_URL}${endpoint}`;
    console.log(`🌐 Making ${method} request to: ${fullUrl}`);
    
    const headers = token ? getHeadersWithToken(token) : DEFAULT_HEADERS;

    const requestConfig = {
      method,
      headers,
    };

    if (body) {
      requestConfig.body = JSON.stringify(body);
      console.log('📤 Request body:', body);
    }

    console.log('🔧 Request config:', {
      method: requestConfig.method,
      headers: requestConfig.headers,
      hasBody: !!requestConfig.body
    });

    const response = await fetch(fullUrl, requestConfig);

    console.log('📥 Response status:', response.status);
    console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error response:', errorText);
      throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Response data:', data);
    return data;
  } catch (error) {
    console.error("❌ Error en apiRequest:", error);
    console.error("❌ Error details:", {
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
}
