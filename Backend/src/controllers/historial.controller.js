import pool from "../config/db.js";

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
