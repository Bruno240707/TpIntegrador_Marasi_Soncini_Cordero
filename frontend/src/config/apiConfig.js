// Configuración de la API para diferentes entornos de desarrollo

// Detectar el entorno de desarrollo
const isDevelopment = __DEV__;

// Configuraciones para diferentes entornos
const configs = {
  // Para emulador Android
  android: {
    API_URL: "http://10.0.2.2:3001/api"
  },
  
  // Para iOS Simulator
  ios: {
    API_URL: "http://localhost:3001/api"
  },
  
  // Para dispositivo físico en la misma red WiFi
  physical: {
    API_URL: "http://192.168.1.100:3001/api" // Cambia esta IP
  },
  
  // Para desarrollo con Expo en la misma red
  expo: {
    API_URL: "http://192.168.0.100:3001/api" // Cambia esta IP
  }
};

// Función para obtener la configuración según el entorno
export const getApiConfig = () => {
  // Por defecto, usar la configuración de Android (más común)
  return configs.android;
};

// Configuración actual
export const API_CONFIG = getApiConfig();

// URL de la API
export const API_URL = API_CONFIG.API_URL;

// Configuración de timeout
export const API_TIMEOUT = 10000; // 10 segundos

// Headers por defecto
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

// Función para obtener headers con token
export const getHeadersWithToken = (token) => {
  return {
    ...DEFAULT_HEADERS,
    'Authorization': `Bearer ${token}`
  };
};

// Función para debug
export const logApiConfig = () => {
  console.log('🔧 API Configuration:');
  console.log('API_URL:', API_URL);
  console.log('Environment:', isDevelopment ? 'Development' : 'Production');
  console.log('Timeout:', API_TIMEOUT);
};
