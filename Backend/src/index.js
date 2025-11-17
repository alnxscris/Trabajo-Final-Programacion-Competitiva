import dotenv from "dotenv";
import app from "./app.js";

/**
 * Archivo: index.js
 *
 * Descripción general:
 *   Este archivo es el punto de entrada del backend. Se encarga de inicializar
 *   el servidor Express, cargar la configuración del proyecto y levantar el
 *   servicio REST que será consumido por el frontend en Next.js.
 *
 * Funcionalidades:
 *   - Importa app.js, donde está configurada toda la aplicación Express.
 *   - Obtiene el puerto desde variables de entorno.
 *   - Inicia el servidor y confirma que está en ejecución.
 *
 * Rol dentro del sistema:
 *   - Es la puerta principal del backend.
 *   - Aquí comienza toda la comunicación entre clientes y el servidor.
 */


dotenv.config();

const PORT = process.env.PORT || 4000;

// Iniciar servidor
app.listen(PORT, () => {
  console.log(` Servidor backend corriendo en http://localhost:${PORT}`);
});
