/**
 * ============================================================
 *  search.service.js
 *  Prepara los datos de búsqueda y ejecuta el KMP
 * 
 * ✔ recorre todas las secuencias del CSV
 * ✔ ejecuta el .exe para cada una
 * ✔ devuelve un arreglo json
 * ============================================================
 */

import { ejecutarKMP } from "../utils/runExecutable.js";

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
