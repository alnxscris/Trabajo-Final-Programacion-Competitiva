// Backend/middlewares/upload.middleware.js
import multer from "multer";

// Guardar el archivo en memoria (Buffer)
const storage = multer.memoryStorage();

// Configuración de multer
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    if (!file.originalname.toLowerCase().endsWith(".csv")) {
      return cb(new Error("Solo se permiten archivos CSV (.csv)."));
    }
    cb(null, true);
  },
});

// Middleware que usaremos en la ruta
export const uploadCSV = upload.single("csv");
