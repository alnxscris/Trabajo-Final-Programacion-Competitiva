/**
 * Pruebas de integración para /api/search/ejecutar
 * Módulo: SearchController + Multer + AuthMiddleware + runExecutable + DB
 */

import { jest } from "@jest/globals";
import request from "supertest";

// Silenciar errores del controlador
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

// ======================================
//         MOCKS DE DEPENDENCIAS
// ======================================

// Mock DB (NO queremos MySQL real)
const mockQuery = jest.fn();

jest.unstable_mockModule("../../src/config/db.js", () => ({
  default: {
    query: mockQuery,
    end: jest.fn(),
  }
}));

// Mock runExecutable (NO queremos que llame KMP.exe)
const mockRunExecutable = jest.fn();

jest.unstable_mockModule("../../src/utils/runExecutable.js", () => ({
  default: mockRunExecutable
}));

// Mock auth.middleware (siempre simula un usuario autenticado)
jest.unstable_mockModule("../../src/middleware/auth.middleware.js", () => ({
  default: (req, _res, next) => {
    req.user = { id: 99, email: "test@correo.com" };
    next();
  }
}));

// Importar app.js DESPUÉS de mocks
let app;

beforeAll(async () => {
  const appModule = await import("../../src/app.js");
  app = appModule.default;
});

beforeEach(() => {
  jest.clearAllMocks();
});

// =============================
//      SUITE DE PRUEBAS
// =============================
describe("Integration - /api/search/ejecutar", () => {

  // -------------------------
  // 1. SIN ARCHIVO CSV
  // -------------------------
  test("INT-SEARCH-01: Error 400 si no se envía archivo CSV", async () => {
    const res = await request(app)
      .post("/api/search/ejecutar")
      .field("patron", "ATGCA");

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: "Debe enviar un archivo CSV." });
  });

  // -------------------------
  // 2. SIN PATRÓN
  // -------------------------
  test("INT-SEARCH-02: Error 400 si no se envía patrón", async () => {
    const csv = "nombre,cadena\nS1,ACTGACTG";

    const res = await request(app)
      .post("/api/search/ejecutar")
      .attach("archivo", Buffer.from(csv), "muestras.csv");

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: "Debe enviar un patrón." });
  });

  // -------------------------
  // 3. CSV VÁLIDO + PATRÓN
  // -------------------------
  test("INT-SEARCH-03: Procesa CSV y devuelve coincidencias", async () => {

    const csv = [
      "nombre,cadena",
      "Juan,ACTGACTG",
      "Maria,TGTACCTTACAATCG"
    ].join("\n");

    mockRunExecutable.mockResolvedValueOnce("3|0");
    mockQuery.mockResolvedValueOnce([{ insertId: 123 }]);

    const res = await request(app)
      .post("/api/search/ejecutar")
      .field("patron", "TGTACCTTACAATCG")
      .attach("archivo", Buffer.from(csv), "muestras.csv");

    expect(res.statusCode).toBe(200);
    expect(res.body.mensaje).toBe("Búsqueda completada");
    expect(res.body.resultados.length).toBe(2);

    // Debe llamar al ejecutable
    expect(mockRunExecutable).toHaveBeenCalled();
    // Debe guardar historial
    expect(mockQuery).toHaveBeenCalled();
  });

  // -------------------------
// 4. EJECUTABLE FALLA
// -------------------------
test("INT-SEARCH-04: Error controlado si runExecutable falla", async () => {

  const csv = "nombre,cadena\nX,ACTGACTG";

  const exeError = new Error("Executable error");
  mockRunExecutable.mockRejectedValueOnce(exeError);

  const res = await request(app)
    .post("/api/search/ejecutar")
    .field("patron", "AAA")
    .attach("archivo", Buffer.from(csv), "muestras.csv");

  expect(res.statusCode).toBe(500);

  // 🔥 CORRECCIÓN: este es el mensaje REAL de tu backend
  expect(res.body).toEqual({ error: "Error interno del servidor" });
});

});
