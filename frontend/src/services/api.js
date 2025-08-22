
const API_URL = "http://localhost:3001/api"; // Para iOS Simulator

// Configuración de timeout
const TIMEOUT_DURATION = 30000; // 30 segundos

// Función para crear un timeout promise
function createTimeoutPromise(timeout) {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Request timeout after ${timeout}ms`));
    }, timeout);
  });
}

export async function apiRequest(endpoint, method = "GET", body = null, token = null) {
  try {
    const fullUrl = `${API_URL}${endpoint}`;
    console.log(`🌐 Making ${method} request to: ${fullUrl}`);
    
    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const requestConfig = {
      method,
      headers,
    };

    if (body) {
      requestConfig.body = JSON.stringify(body);
      console.log('📤 Request body:', body);
    }

    // Crear la promise de fetch con timeout
    const fetchPromise = fetch(fullUrl, requestConfig);
    const timeoutPromise = createTimeoutPromise(TIMEOUT_DURATION);
    
    // Competir entre fetch y timeout
    const response = await Promise.race([fetchPromise, timeoutPromise]);
    
    console.log('📥 Response status:', response.status);

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
    if (error.message.includes('timeout')) {
      console.error("⏰ Timeout error - verifica la conexión de red y la URL del backend");
    }
    throw error;
  }
}
