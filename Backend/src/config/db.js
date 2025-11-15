/**
 * ============================================================
 *  
 *  Configuración de conexión a MySQL usando mysql2/promise
 *
 *  Esta conexión será utilizada por:
 *    - Autenticación (login y registro) -> RF5, RF14
 *    - Módulo de historial (guardar y leer) -> RF12, RF17
 *    - Módulo de búsqueda (guardar resultados) -> RF8
 *
 *  El pool permite manejar múltiples conexiones simultáneas.
 * ============================================================
 */

import mysql from "mysql2/promise";
import dotenv from "dotenv";

// Cargar variables del archivo .env
dotenv.config();

// Crear pool de conexiones
const pool = mysql.createPool({
    host: process.env.DB_HOST,     // Host (local o remoto)
    user: process.env.DB_USER,     // Usuario MySQL
    password: process.env.DB_PASS, // Contraseña MySQL
    database: process.env.DB_NAME, // Base de datos
    port: process.env.DB_PORT,     // Puerto de MySQL
    waitForConnections: true,
    connectionLimit: 10,           // Máximo de conexiones simultáneas
    queueLimit: 0
});

console.log("MySQL conectado correctamente.");

export default pool;