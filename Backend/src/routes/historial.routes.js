import { Router } from "express";
import pool from "../config/db.js";
import authMiddleware from "../middleware/auth.middleware.js";

/**
 * Archivo: routes/historial.routes.js
 *
 * Descripción general:
 *   Rutas para consultar y obtener historial de análisis del usuario autenticado.
 *
 * Rutas:
 *   - GET /historial       → historial general
 *   - GET /historial/:id   → detalle de un análisis
 *
 * Seguridad:
 *   - Ambas rutas requieren JWT.
 *
 * Rol:
 *   - Permite que cada usuario consulte sus análisis previos.
 */


const router = Router();

/**
 * GET /api/historial/
 * Lista general del historial
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await pool.query(
      `SELECT id, fecha, patron, archivo 
       FROM historial 
       WHERE user_id = ? 
       ORDER BY fecha DESC`,
      [userId]
    );

    return res.json(rows);

  } catch (err) {
    console.error("Error obteniendo historial:", err);
    return res.status(500).json({ error: "Error al obtener historial" });
  }
});

/**
 * GET /api/historial/:id
 * Detalle del historial
 */
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const [rows] = await pool.query(
      "SELECT * FROM historial WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Registro no encontrado" });
    }

    const item = rows[0];

    // Convertir el LONGTEXT (string) → Array JSON
    let resultados = [];
    try {
      resultados = JSON.parse(item.resultados);
    } catch {
      resultados = [];
    }

    return res.json({
      registro: {
        id: item.id,
        fecha: item.fecha,
        patron: item.patron,
        archivo: item.archivo,
        resultados,
      },
    });

  } catch (err) {
    console.error("Error obteniendo detalle:", err);
    return res.status(500).json({ error: "Error al obtener detalle" });
  }
});

export default router;
