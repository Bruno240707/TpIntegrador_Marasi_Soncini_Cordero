import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import EventRouter from "./src/controllers/event-controller.js";
import UserRouter from "./src/controllers/user-controller.js";
import EventLocationRouter from "./src/controllers/event-location-controller.js";

dotenv.config();

const app = express();

// CORS: permitir llamadas desde cualquier origen (para Expo)
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Healthcheck rápido para probar la conexión desde el móvil
app.get("/api/ping", (_req, res) => {
  res.status(200).json({ ok: true, message: "pong" });
});

// Routers
app.use("/api/event", EventRouter);
app.use("/api/user", UserRouter);
app.use("/api/event-location", EventLocationRouter);

// Escuchar en 0.0.0.0 para aceptar conexiones desde la LAN / Tunnel
const PORT = process.env.PORT || 3001;
const HOST = "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`✅ Server escuchando en http://${HOST}:${PORT}`);
  console.log("ℹ️  Con Expo Tunnel, tu teléfono podrá acceder sin IP local");
});
