import multer from "multer";

/**
 * Archivo: middleware/upload.middleware.js
 *
 * Descripción general:
 *   Middleware que se encarga de recibir y validar archivos CSV enviados
 *   desde el frontend. Utiliza Multer con memoryStorage() para evitar guardar
 *   archivos en disco y procesarlos directamente desde memoria.
 *
 * Configuración clave:
 *   - storage: multer.memoryStorage()
 *       Los archivos se guardan en RAM como Buffer.
 *
 *   - limits.fileSize: 5 MB
 *       Evita que los usuarios envíen archivos excesivamente grandes.
 *
 *   - fileFilter:
 *       Revisa que el archivo tenga extensión .csv (insensible a mayúsculas).
 *       Si no es válido, se genera un error y la ruta no continúa.
 *
 * Middleware exportado:
 *   uploadCSV = upload.single("csv")
 *       Permite recibir únicamente 1 archivo con el campo "csv".
 *
 * Rol dentro del sistema:
 *   - Valida formato y tamaño del archivo.
 *   - Prepara el archivo para que search.controller.js pueda procesarlo.
 */


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

export const uploadCSV = upload.single("csv");
