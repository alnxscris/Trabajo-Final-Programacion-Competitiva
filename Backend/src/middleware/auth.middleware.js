import jwt from "jsonwebtoken";

/**
 * Archivo: middleware/auth.middleware.js
 *
 * Descripción general:
 *   Middleware encargado de validar si una solicitud HTTP incluye un
 *   token JWT válido. Solo permite continuar a rutas protegidas cuando
 *   el usuario realmente está autenticado.
 *
 * ¿Qué es JWT?
 *   JWT (JSON Web Token) es un estándar que permite autenticar usuarios
 *   mediante un token firmado digitalmente. El backend genera un token 
 *   durante el login y el cliente lo envía en cada solicitud posterior.
 *
 * Funcionamiento del middleware:
 *   1. Obtiene el header Authorization enviado por el frontend.
 *        Ejemplo:  Authorization: Bearer eyJhbGciOi...
 *
 *   2. Si el header no existe → responde 401 (No autorizado).
 *
 *   3. Extrae el token real separando: "Bearer" + token.
 *
 *   4. Verifica la firma del token con jwt.verify() usando JWT_SECRET.
 *        - Si el token es válido, se decodifica y se adjunta al objeto req:
 *              req.user = { id, email }
 *
 *   5. Llama a next() para permitir el acceso a la ruta protegida.
 *
 *   6. Si el token es inválido o expiró → responde 401 con error.
 *
 * Rol dentro del sistema:
 *   - Es un escudo que protege todas las rutas que requieren sesión activa.
 *   - Evita que usuarios no autenticados accedan al historial o al módulo de búsqueda.
 */


export default function authMiddleware(req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email }
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido" });
  }
}
