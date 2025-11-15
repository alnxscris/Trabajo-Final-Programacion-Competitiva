import { Router } from "express";
import multer from "multer";
import authMiddleware from "../middleware/auth.middleware.js";
import { ejecutarBusqueda } from "../controllers/search.controller.js";

// Multer para recibir CSV desde el frontend (memoria)
const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

/**
 * ============================================================
 *  POST /api/search/ejecutar
 *  Recibe:
 *     - archivo CSV (req.file)
 *     - patrón de ADN (req.body.patron)
 *
 *  Middleware:
 *     - authMiddleware → verifica JWT
 *     - upload.single("archivo") → recibe CSV
 *     - ejecutarBusqueda → proceso completo
 *
 *  RF8 → Recibir patrón y cadenas
 *  RF9 → Ejecutar búsqueda
 *  RF10 → Devolver coincidencias
 *  RF11 → JSON al frontend
 *  RF12 → Guardar historial
 * ============================================================
 */
router.post(
  "/ejecutar",
  authMiddleware,
  upload.single("archivo"),
  ejecutarBusqueda
);

export default router;
