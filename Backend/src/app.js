import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import searchRoutes from "./routes/search.routes.js";
import historialRoutes from "./routes/historial.routes.js";

/**
 * Archivo: app.js
 *
 * Descripción general:
 *   Configura la aplicación Express: middlewares globales, manejo de JSON,
 *   CORS, rutas, manejo de archivos y validación de tokens.
 *
 * Configuraciones incluidas:
 *   - Habilita parseo de JSON en solicitudes.
 *   - Habilita CORS para permitir comunicación con el frontend en Next.js.
 *   - Registra las rutas de autenticación, historial y análisis de ADN.
 *   - Maneja errores globales si ocurren durante una solicitud.
 *
 * Rol dentro del sistema:
 *   - Centraliza toda la configuración del backend.
 *   - Mantiene organizado el flujo de peticiones que llegan al servidor.
 */


const app = express();

app.use(cors());
app.use(express.json());


// Rutas del sistema
app.use("/api/auth", authRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/historial", historialRoutes);

export default app;
