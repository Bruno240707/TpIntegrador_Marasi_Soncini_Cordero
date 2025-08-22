# 🎉 Sistema de Gestión de Eventos

Una aplicación completa de gestión de eventos con backend en Node.js/Express y frontend en React Native.

## 📋 Características

### Backend (Node.js/Express)
- ✅ Autenticación JWT
- ✅ Gestión de usuarios (registro/login)
- ✅ CRUD completo de eventos
- ✅ Sistema de inscripciones a eventos
- ✅ Gestión de ubicaciones de eventos
- ✅ Base de datos PostgreSQL
- ✅ Validaciones y manejo de errores

### Frontend (React Native)
- ✅ Pantalla de login con diseño moderno
- ✅ Pantalla de registro de usuarios
- ✅ Pantalla principal con vista previa de eventos
- ✅ Lista completa de eventos con búsqueda
- ✅ Sistema de inscripción/cancelación de eventos
- ✅ Navegación fluida entre pantallas
- ✅ Persistencia de sesión con AsyncStorage
- ✅ Diseño responsive y moderno

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (v16 o superior)
- PostgreSQL
- Expo CLI (para el frontend)

### ⚠️ IMPORTANTE: Configuración de Red
**Antes de continuar, lee el archivo `CONFIGURACION_API.md` para configurar correctamente la IP del backend.**

### 1. Configuración de la Base de Datos

1. Crea una base de datos PostgreSQL llamada `eventos_db`
2. Ejecuta el script SQL: `database_setup.sql`

### 2. Configuración del Backend

1. Navega al directorio del backend:
```bash
cd backend
```

2. Instala las dependencias:
```bash
npm install
```

3. Crea un archivo `.env` en el directorio `backend` con la siguiente configuración:
```env
DB_HOST=localhost
DB_DATABASE=eventos_db
DB_USER=postgres
DB_PASSWORD=tu_password
DB_PORT=5432
JWT_SECRET=tu_jwt_secret_super_seguro_2024
```

4. Inicia el servidor:
```bash
npm run dev
```

El backend estará disponible en `http://localhost:3001`

### 3. Configuración del Frontend

1. Navega al directorio del frontend:
```bash
cd frontend
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia la aplicación:
```bash
npm start
```

4. Escanea el código QR con la app Expo Go en tu dispositivo móvil

## 📱 Uso de la Aplicación

### Registro de Usuario
1. Abre la aplicación
2. Toca "¿No tienes cuenta? Regístrate"
3. Completa el formulario con:
   - Nombre
   - Apellido
   - Nombre de usuario
   - Contraseña
4. Toca "Registrarse"

### Inicio de Sesión
1. En la pantalla de login, ingresa:
   - Nombre de usuario
   - Contraseña
2. Toca "Iniciar Sesión"

### Navegación Principal
- **Pantalla de Inicio**: Muestra una vista previa de los eventos disponibles
- **Ver Todos los Eventos**: Accede a la lista completa de eventos
- **Búsqueda**: Filtra eventos por nombre o descripción
- **Inscripción**: Inscríbete o cancela tu inscripción a eventos

## 🔧 Estructura del Proyecto

```
TpIntegrador_Marasi_Soncini_Cordero/
├── backend/
│   ├── database/
│   │   └── db.js
│   ├── src/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── repositories/
│   │   └── services/
│   ├── index.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── context/
│   │   ├── screens/
│   │   └── services/
│   ├── App.js
│   └── package.json
└── README.md
```

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js**: Runtime de JavaScript
- **Express.js**: Framework web
- **PostgreSQL**: Base de datos relacional
- **JWT**: Autenticación de tokens
- **bcrypt**: Encriptación de contraseñas
- **CORS**: Configuración de acceso cruzado

### Frontend
- **React Native**: Framework móvil
- **Expo**: Plataforma de desarrollo
- **React Navigation**: Navegación entre pantallas
- **AsyncStorage**: Almacenamiento local
- **Fetch API**: Comunicación con el backend

## 🔐 Endpoints de la API

### Autenticación
- `POST /api/user/register` - Registro de usuario
- `POST /api/user/login` - Inicio de sesión

### Eventos
- `GET /api/event` - Listar eventos
- `GET /api/event/:id` - Obtener evento por ID
- `POST /api/event` - Crear evento (requiere autenticación)
- `PUT /api/event` - Actualizar evento (requiere autenticación)
- `DELETE /api/event/:id` - Eliminar evento (requiere autenticación)
- `POST /api/event/:id/enrollment` - Inscribirse a evento
- `DELETE /api/event/:id/enrollment` - Cancelar inscripción

### Ubicaciones
- `GET /api/event-location` - Listar ubicaciones del usuario
- `GET /api/event-location/:id` - Obtener ubicación por ID

## 🎨 Características de Diseño

- **Diseño Moderno**: Interfaz limpia y profesional
- **Responsive**: Adaptable a diferentes tamaños de pantalla
- **UX Intuitiva**: Navegación clara y fácil de usar
- **Feedback Visual**: Indicadores de carga y estados
- **Accesibilidad**: Contraste adecuado y tamaños de texto legibles

## 🚨 Solución de Problemas

### 🔧 Problemas de Conexión API (MÁS COMÚN)
**Si las requests no funcionan desde el frontend pero sí desde Postman:**

1. **Lee `CONFIGURACION_API.md`** - Guía completa de configuración
2. **Ejecuta el script de prueba:**
   ```bash
   node test_api_connection.js
   ```
3. **Verifica tu IP local:**
   ```bash
   # Windows
   ipconfig | findstr "IPv4"
   
   # macOS/Linux
   ifconfig | grep "inet "
   ```
4. **Actualiza la IP en `frontend/src/config/apiConfig.js`**

### Error de Conexión a la Base de Datos
- Verifica que PostgreSQL esté ejecutándose
- Confirma las credenciales en el archivo `.env`
- Asegúrate de que la base de datos `eventos_db` exista

### Error de Conexión del Frontend
- Verifica que el backend esté ejecutándose en `localhost:3001`
- Confirma que no haya problemas de red
- Revisa la configuración de CORS en el backend

### Problemas con Expo
- Asegúrate de tener Expo CLI instalado globalmente
- Verifica que tu dispositivo y computadora estén en la misma red
- Revisa los logs de Expo para errores específicos

### 🔍 Debugging Avanzado
1. **Revisa los logs del frontend** (mensajes con emojis 🌐📤📥❌✅)
2. **Verifica los logs del backend** para ver si llegan las peticiones
3. **Prueba con Postman** usando la misma IP que configuraste
4. **Usa ngrok** para desarrollo temporal:
   ```bash
   npx ngrok http 3001
   ```

## 📞 Soporte

Para reportar problemas o solicitar nuevas características, por favor crea un issue en el repositorio del proyecto.

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

---

**Desarrollado con ❤️ por el equipo de desarrollo**
