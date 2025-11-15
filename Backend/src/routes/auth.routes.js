import { Router } from "express";
import { registrar, login } from "../controllers/auth.controller.js";

const router = Router();

// Registro (RF14) 
router.post("/register", registrar);

// Login (RF5)
router.post("/login", login);

export default router;
