import { ejecutarKMP } from "../utils/runExecutable.js";

/**
 * Archivo: services/search.service.js
 *
 * Descripción general:
 *   Contiene funciones auxiliares relacionadas al procesamiento del archivo CSV,
 *   transformación de datos y preparación de la entrada para el algoritmo KMP.
 *
 * Funcionalidad:
 *   - Parsear CSV a un arreglo de secuencias.
 *   - Construir cadenas con formato requerido por el ejecutable C++.
 *   - Limpiar y normalizar datos antes del análisis.
 *
 * Rol:
 *   - Mantiene el controlador search limpio y modular.
 *   - Reutiliza lógica de procesamiento en distintas partes del backend.
 */
 
export async function ejecutarBusqueda(secuencias, patron) {
    const resultados = [];

    for (const item of secuencias) {
        const nombre = item.nombre || item.Name || item.NOMBRE;
        const cadena = item.cadena || item.Sequence || item.SECUENCIA;

        // Ejecutar KMP para esta cadena
        const salida = await ejecutarKMP(cadena, patron);

        resultados.push({
            nombre,
            cadena,
            coincidencias: salida === "" ? "SIN COINCIDENCIA" : salida,
        });
    }

    return resultados;
}
