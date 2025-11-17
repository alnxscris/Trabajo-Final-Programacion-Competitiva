import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * Archivo: controllers/auth.controller.js
 *
 * Descripción general:
 *   Implementa la lógica del registro e inicio de sesión de usuarios.
 *   Es el encargado de validar información, cifrar contraseñas y generar tokens JWT.
 *
 * Funciones:
 *   - registrar:
 *        • Valida datos enviados por el frontend.
 *        • Verifica si el email ya existe en la base de datos.
 *        • Cifra la contraseña con bcrypt.
 *        • Inserta un nuevo usuario en MySQL.
 *        • Devuelve mensajes de éxito o error.
 *
 *   - login:
 *        • Verifica si el email está registrado.
 *        • Compara la contraseña cifrada con bcrypt.compare().
 *        • Si es válido, genera un JWT firmado con datos del usuario.
 *        • Devuelve el token al frontend para próximas solicitudes.
 *
 * Rol dentro del sistema:
 *   - Es el único módulo capaz de generar tokens de autenticación.
 *   - Controla la seguridad del sistema gestionando el acceso de usuarios.
 */


export async function registrar(req, res) {
    try {
        const { nombre, email, password } = req.body;

        if (!nombre || !email || !password) {
            return res.status(400).json({ error: "Datos incompletos" });
        }

        const hashed = await bcrypt.hash(password, 10);

        await pool.query(
            "INSERT INTO users (nombre, email, password) VALUES (?, ?, ?)",
            [nombre, email, hashed]
        );

        return res.json({ mensaje: "Usuario registrado correctamente" });

    } catch (error) {
        console.error("Error en registro:", error);
        return res.status(500).json({ error: "Error en el servidor" });
    }
}

// ============================================================
//  LOGIN DE USUARIO   (RF5)
// ============================================================
export async function login(req, res) {
    try {
        const { email, password } = req.body;

        const [rows] = await pool.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (rows.length === 0) {
            return res.status(400).json({ error: "Usuario no existe" });
        }

        const user = rows[0];

        const ok = await bcrypt.compare(password, user.password);

        if (!ok)
            return res.status(400).json({ error: "Credenciales incorrectas" });

        // Generar token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        return res.json({
            mensaje: "Login correcto",
            token,
            user: { id: user.id, nombre: user.nombre, email: user.email }
        });

    } catch (error) {
        console.error("Error en login:", error);
        return res.status(500).json({ error: "Error en el servidor" });
    }
}
