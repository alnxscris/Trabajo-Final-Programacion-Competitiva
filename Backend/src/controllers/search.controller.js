import pool from "../config/db.js";
import runExecutable from "../utils/runExecutable.js";

/**
 * ============================================================
 *  ejecutarBusqueda
 *  Lee CSV con MULTER + BUFFER + SPLIT
 *  Ejecuta el .exe
 *  Guarda historial
 * ============================================================
 */
export async function ejecutarBusqueda(req, res) {
  try {
    const userId = req.user.id;
    const patron = req.body.patron;
    const archivo = req.file?.originalname;

    if (!patron) return res.status(400).json({ error: "Debe enviar un patrón." });
    if (!req.file) return res.status(400).json({ error: "Debe enviar un archivo CSV." });

    // 1. Convertir Buffer -> texto
    const contenido = req.file.buffer.toString("utf-8");

    // 2. Dividir líneas
    const lineas = contenido
      .split(/\r?\n/)
      .map(l => l.trim())
      .filter(l => l.length > 0);

    // 3. Extraer columnas (nombre, cadena)
    const secuencias = lineas
      .slice(1) // <--- SALTA LA FILA 1 DEL CSV
      .map((fila) => {
        const partes = fila.split(/[;,]/).map(x => x.trim());
        return {
          nombre: partes[0] || "",
          cadena: partes[1] || "",
        };
      });


    // 4. Extraer solo cadenas para enviarlas al exe
    const soloCadenas = secuencias.map(s => s.cadena);

    // 5. Ejecutar .exe
    const salida = await runExecutable(patron, soloCadenas);

    // 6. Transformar salida string -> array JSON
    const resultados = salida.split("|").map((c, i) => ({
      nombre: secuencias[i].nombre,
      cadena: secuencias[i].cadena,
      coincidencias: c === "-1" ? "Sin coincidencia" : c,
    }));

    // 7. Guardar historial
    await pool.query(
      "INSERT INTO historial (fecha, patron, archivo, resultados, user_id) VALUES (NOW(), ?, ?, ?, ?)",
      [patron, archivo, JSON.stringify(resultados), userId]
    );

    return res.json({
      mensaje: "Búsqueda completada",
      resultados,
    });

  } catch (error) {
    console.error("Error en ejecutarBusqueda:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
