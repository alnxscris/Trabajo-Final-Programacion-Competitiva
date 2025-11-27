import pool from "../config/db.js";
import { ejecutarKMP } from "../utils/runExecutable.js";

/**
 * Archivo: controllers/search.controller.js
 *
 * Descripción general:
 *   Controlador principal responsable de procesar la búsqueda de coincidencias
 *   de ADN. Aquí ocurre la parte central del sistema:
 *     - Leer el archivo CSV enviado desde el frontend
 *     - Convertirlo a texto usando Buffer
 *     - Extraer secuencias y nombres
 *     - Ejecutar el algoritmo externo compilado en C++ (.exe)
 *     - Interpretar resultados
 *     - Guardar historial en MySQL
 *
 * Flujo detallado del proceso:
 *
 * 1. Validación inicial:
 *       - Verifica que el usuario haya enviado patrón y archivo.
 *
 * 2. Conversión del archivo CSV:
 *       - req.file.buffer.toString() transforma el archivo en texto plano.
 *
 * 3. Limpieza del CSV:
 *       - Se separan las líneas.
 *       - Se eliminan líneas vacías.
 *       - Se omite la fila del encabezado.
 *
 * 4. Extracción de columnas:
 *       - Cada línea se divide por coma.
 *       - Se obtiene:
 *           nombre  → columna 1
 *           cadena → columna 2
 *
 * 5. Preparación de datos:
 *       - Se crea un array solo con las cadenas que será enviado al .exe
 *
 * 6. Ejecución del ejecutable:
 *       - runExecutable(pattern, secuencias)
 *       - El .exe devuelve una cadena donde cada resultado está separado por "|".
 *
 * 7. Interpretación de resultados:
 *       - Se transforma la salida del .exe a JSON estructurado:
 *           [
 *             { nombre, cadena, coincidencias }
 *           ]
 *
 * 8. Guardar en historial:
 *       - Inserta en MySQL:
 *           • Fecha actual
 *           • Patrón utilizado
 *           • Nombre del archivo
 *           • Resultados en JSON.stringify()
 *           • ID del usuario autenticado
 *
 * 9. Respuesta final al frontend:
 *       - Envía un JSON con:
 *           mensaje: "Búsqueda completada"
 *           resultados: [...]
 *
 * Rol dentro del sistema:
 *   - Es el centro de la lógica del proyecto.
 *   - Controla el flujo completo desde la carga del archivo hasta la respuesta.
 *   - Interactúa directamente con el algoritmo KMP implementado en C++.
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

    // 2. Dividir líneas y limpiar
    const lineas = contenido
      .split(/\r?\n/)
      .map(l => l.trim())
      .filter(l => l.length > 0);

    // 3. Extraer columnas (nombre, cadena)
    const secuencias = lineas
      .slice(1)
      .map((fila) => {
        const partes = fila.split(/[;,]/).map(x => x.trim());
        return {
          nombre: partes[0] || "",
          cadena: partes[1] || "",
        };
      });

    // 4. Ejecutar KMP por cada cadena individualmente
    const resultados = [];

    for (const item of secuencias) {
      const salida = await ejecutarKMP(patron, item.cadena);

      resultados.push({
        nombre: item.nombre,
        cadena: item.cadena,
        coincidencias: salida === "" || salida === "-1"
          ? "Sin coincidencia"
          : salida,
      });
    }

    // 5. Guardar historial
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