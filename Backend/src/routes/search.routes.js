import { Router } from "express";
import multer from "multer";
import authMiddleware from "../middleware/auth.middleware.js";
import { ejecutarBusqueda } from "../controllers/search.controller.js";

/**
 * Archivo: routes/search.routes.js
 *
 * Descripción general:
 *   Este archivo define la ruta principal del módulo de búsqueda de ADN.
 *   Aquí se combinan tres elementos fundamentales:
 *     - Autenticación mediante JWT
 *     - Carga y validación de un archivo CSV
 *     - Redirección al controlador que ejecuta la búsqueda usando el .exe
 *
 * Ruta definida:
 *   - POST /search/ejecutar
 *       Permite que un usuario autenticado envíe:
 *         • Un patrón de ADN desde el body
 *         • Un archivo CSV que contiene múltiples cadenas de ADN
 *
 * Funcionamiento interno:
 *   1. authMiddleware:
 *        Verifica que el usuario incluya un token JWT válido.
 *        Si el token es incorrecto, se bloquea el acceso inmediatamente.
 *
 *   2. upload.single("archivo"):
 *        Usa Multer con memoryStorage() para cargar el archivo en RAM.
 *        Evita guardarlo en disco y permite procesarlo directamente.
 *
 *   3. ejecutarBusqueda:
 *        Controlador encargado de:
 *          • Leer el CSV
 *          • Convertirlo en secuencias
 *          • Invocar al algoritmo KMP compilado en C++
 *          • Interpretar resultados
 *          • Guardar el historial en MySQL
 *          • Responder al frontend con un JSON estructurado
 *
 * Rol dentro del sistema:
 *   - Esta ruta es el puente principal entre el frontend y el ejecutable.
 *   - Permite que el usuario haga búsquedas sobre archivos sin exponer
 *     directamente la lógica del algoritmo o del sistema.
 */


const upload = multer({ storage: multer.memoryStorage() });

const router = Router();


router.post(
  "/ejecutar",
  authMiddleware,
  upload.single("archivo"),
  ejecutarBusqueda
);

export default router;
