import mysql from "mysql2/promise";
import dotenv from "dotenv";

/**
 * Archivo: config/db.js
 *
 * Descripción general:
 *   Configura la conexión a la base de datos MySQL utilizando un pool de conexiones,
 *   permitiendo ejecutar consultas de manera eficiente y segura.
 *
 * Funcionalidad:
 *   - Crea un pool que reutiliza conexiones para mejorar el rendimiento.
 *   - Exporta una función para realizar consultas SQL.
 *   - Maneja errores de conexión y los muestra claramente.
 *
 * Rol dentro del sistema:
 *   - Es el módulo responsable de toda la comunicación con MySQL.
 *   - Permite almacenar usuarios, historial de análisis y resultados.
 */


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