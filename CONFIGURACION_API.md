# 🔧 Configuración de la API - Guía de Solución de Problemas

## 🚨 Problema Principal
El frontend no puede conectarse al backend porque está usando `localhost`, pero cuando ejecutas la app en un dispositivo móvil o emulador, `localhost` no se refiere a tu computadora.

## 📋 Pasos para Solucionar

### 1. Obtener tu IP Local

#### En Windows:
```bash
ipconfig
```
Busca la línea que dice "IPv4 Address" y copia la IP (ejemplo: 192.168.1.100)

#### En macOS/Linux:
```bash
ifconfig
# o
ip addr show
```

### 2. Configurar la IP en el Frontend

Edita el archivo `frontend/src/config/apiConfig.js` y cambia la IP en la configuración que corresponda:

```javascript
// Para dispositivo físico en la misma red WiFi
physical: {
  API_URL: "http://TU_IP_AQUI:3001/api" // Ejemplo: "http://192.168.1.100:3001/api"
},

// Para desarrollo con Expo en la misma red
expo: {
  API_URL: "http://TU_IP_AQUI:3001/api" // Ejemplo: "http://192.168.1.100:3001/api"
}
```

### 3. Configuraciones por Entorno

#### Para Emulador Android:
```javascript
android: {
  API_URL: "http://10.0.2.2:3001/api" // Esta IP funciona para emulador Android
}
```

#### Para iOS Simulator:
```javascript
ios: {
  API_URL: "http://localhost:3001/api" // Esta IP funciona para iOS Simulator
}
```

#### Para Dispositivo Físico:
```javascript
physical: {
  API_URL: "http://TU_IP_LOCAL:3001/api" // Tu IP real en la red WiFi
}
```

### 4. Verificar que el Backend esté Ejecutándose

1. Asegúrate de que el backend esté corriendo:
```bash
cd backend
npm run dev
```

2. Verifica que esté escuchando en el puerto correcto:
```bash
netstat -an | findstr :3001
```

### 5. Verificar la Conexión de Red

1. **Mismo WiFi**: Asegúrate de que tu computadora y dispositivo móvil estén en la misma red WiFi.

2. **Firewall**: Verifica que el firewall no esté bloqueando el puerto 3001.

3. **Antivirus**: Algunos antivirus pueden bloquear conexiones locales.

### 6. Testing de Conexión

#### Con curl (desde tu computadora):
```bash
curl http://localhost:3001/api/event
```

#### Con Postman:
- URL: `http://TU_IP:3001/api/event`
- Method: GET

### 7. Debugging

#### En el Frontend:
Abre las herramientas de desarrollo de Expo y revisa los logs:
- Busca mensajes que empiecen con 🌐, 📤, 📥, ❌, ✅
- Verifica que la URL sea correcta
- Revisa si hay errores de red

#### En el Backend:
Revisa los logs del servidor para ver si llegan las peticiones:
```bash
cd backend
npm run dev
```

### 8. Configuraciones Comunes

#### Red WiFi Típica:
- IP: `192.168.1.XXX` o `192.168.0.XXX`
- Puerto: `3001`

#### Red de Universidad/Empresa:
- IP: Puede variar, consulta con tu administrador de red
- Puerto: Puede estar bloqueado, usa un puerto diferente

### 9. Solución Rápida

Si no sabes tu IP, puedes usar esta configuración temporal:

```javascript
// En frontend/src/config/apiConfig.js
export const getApiConfig = () => {
  // Cambia esta IP por la tuya
  return {
    API_URL: "http://192.168.1.100:3001/api" // Reemplaza 100 con tu IP
  };
};
```

### 10. Verificación Final

1. ✅ Backend corriendo en puerto 3001
2. ✅ IP configurada correctamente en el frontend
3. ✅ Mismo WiFi para computadora y dispositivo
4. ✅ Firewall permitiendo conexiones
5. ✅ Logs mostrando conexión exitosa

## 🆘 Si Sigue Sin Funcionar

1. **Prueba con Postman** usando la misma IP
2. **Revisa los logs** del backend y frontend
3. **Cambia el puerto** si el 3001 está ocupado
4. **Usa ngrok** para desarrollo temporal:
   ```bash
   npx ngrok http 3001
   ```

## 📞 Comandos Útiles

```bash
# Obtener IP en Windows
ipconfig | findstr "IPv4"

# Obtener IP en macOS/Linux
ifconfig | grep "inet "

# Verificar puerto en uso
netstat -an | findstr :3001

# Test de conexión
curl http://localhost:3001/api/event
```
