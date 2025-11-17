import { Router } from "express";
import { registrar, login } from "../controllers/auth.controller.js";

/**
 * Archivo: routes/auth.routes.js
 *
 * Descripción general:
 *   Este archivo define las rutas del módulo de autenticación del backend.
 *   Se encarga de recibir solicitudes HTTP enviadas por el frontend y
 *   delegarlas hacia los controladores especializados que manejan
 *   la lógica del registro y login de usuarios.
 *
 * Rutas definidas:
 *   - POST /auth/register
 *       Crea un nuevo usuario en la base de datos luego de validar
 *       los datos enviados por el cliente. Se encarga de:
 *         • Hash de contraseña
 *         • Verificar email existente
 *         • Registrar al usuario
 *
 *   - POST /auth/login
 *       Valida las credenciales ingresadas por el usuario.
 *       Si son correctas, genera y devuelve un token JWT
 *       que servirá para autenticar futuras solicitudes.
 *
 * Rol dentro del sistema:
 *   - Centraliza y expone todas las rutas relacionadas con autenticación.
 *   - Actúa como puente entre el frontend y los controladores.
 *   - Permite mantener una arquitectura organizada separando rutas,
 *     controladores, servicios y middleware.
 *
 * Importante:
 *   Estas rutas no están protegidas por middleware, ya que permiten
 *   el acceso inicial del usuario al sistema (registro e inicio de sesión).
 */


const router = Router();

// Registro (RF14) 
router.post("/register", registrar);

// Login (RF5)
router.post("/login", login);

export default router;
