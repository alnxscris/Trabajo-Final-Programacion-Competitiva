import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import searchRoutes from "./routes/search.routes.js";
import historialRoutes from "./routes/historial.routes.js";


const app = express();

app.use(cors());
app.use(express.json());


// Rutas del sistema
app.use("/api/auth", authRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/historial", historialRoutes);

export default app;
