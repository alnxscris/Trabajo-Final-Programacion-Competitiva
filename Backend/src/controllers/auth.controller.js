/**
 * ============================================================
 *  
 *  Controlador encargado de:
 *    Registrar usuarios (RF14)
 *    Iniciar sesión (RF5)
 *
 *  Utiliza:
 *    - Hash de contraseñas con bcryptjs
 *    - JWT para autenticación segura
 * ============================================================
 */

import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ============================================================
//  REGISTRO DE USUARIO   (RF14)
// ============================================================
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
