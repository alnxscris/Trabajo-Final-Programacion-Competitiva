import pool from "../config/db.js";

/**
 * Archivo: controllers/historial.controller.js
 *
 * Descripción general:
 *   Este controlador obtiene un registro específico del historial de búsquedas
 *   de ADN perteneciente al usuario autenticado. Permite visualizar resultados
 *   anteriores sin necesidad de ejecutar nuevamente el algoritmo.
 *
 * Flujo detallado:
 *
 * 1. Extraer IDs:
 *       - userId se obtiene del JWT (authMiddleware)
 *       - historialId se obtiene de los parámetros de la URL
 *
 * 2. Consulta en MySQL:
 *       SELECT * FROM historial WHERE id = ? AND user_id = ?
 *       - Garantiza que los usuarios solo puedan ver su propio historial.
 *
 * 3. Validación:
 *       - Si no se encuentra el registro → error 404.
 *
 * 4. Parseo:
 *       - Los resultados están guardados como JSON, se hace JSON.parse().
 *       - Si el parseo falla, devuelve un array vacío para evitar errores.
 *
 * 5. Respuesta al frontend:
 *       Se retorna:
 *         {
 *           id,
 *           fecha,
 *           archivo,
 *           patron,
 *           resultados: [...]
 *         }
 *
 * Rol dentro del sistema:
 *   - Permite revisar búsquedas pasadas.
 *   - Evita recalcular coincidencias usando el ejecutable.
 *   - Mantiene la trazabilidad del uso del sistema.
 */


export async function obtenerHistorialPorId(req, res) {
  try {
    const userId = req.user.id;
    const historialId = req.params.id;

    const [rows] = await pool.query(
      "SELECT * FROM historial WHERE id = ? AND user_id = ?",
      [historialId, userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Registro no encontrado" });
    }

    const registro = rows[0];

    let resultadosParseados = [];
    try {
      resultadosParseados = JSON.parse(registro.resultados);
    } catch (e) {
      resultadosParseados = [];
    }

    return res.json({
      registro: {
        id: registro.id,
        fecha: registro.fecha,
        archivo: registro.archivo,
        patron: registro.patron,
        resultados: resultadosParseados,
      },
    });

  } catch (error) {
    console.error("Error en obtenerHistorialPorId:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
}
