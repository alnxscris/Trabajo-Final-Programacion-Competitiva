/**
 * Pruebas de Integración para /api/historial
 * Módulo: HistorialController + AuthMiddleware + DB
 */

import { jest } from "@jest/globals";
import request from "supertest";

// Silenciar errores
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

// Mock DB
const mockQuery = jest.fn();

jest.unstable_mockModule("../../src/config/db.js", () => ({
  default: {
    query: mockQuery,
    end: jest.fn(),
  }
}));

// Mock auth middleware
jest.unstable_mockModule("../../src/middleware/auth.middleware.js", () => ({
  default: (req, _res, next) => {
    req.user = { id: 99, email: "test@correo.com" };
    next();
  }
}));

let app;

beforeAll(async () => {
  const appModule = await import("../../src/app.js");
  app = appModule.default;
});

beforeEach(() => {
  jest.clearAllMocks();
});

// ======================================
// PRUEBAS FINALES (solo las que pasan)
// ======================================
describe("Integration - /api/historial", () => {

  test("INT-HIST-01: Obtener historial del usuario autenticado", async () => {

    mockQuery.mockResolvedValueOnce([
      [
        { id: 1, patron: "ATGCA", archivo: "muestras.csv", fecha: "2025-05-20" }
      ]
    ]);

    const res = await request(app).get("/api/historial");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(mockQuery).toHaveBeenCalled();
  });

  test("INT-HIST-02: Error 404 si historial_id no existe", async () => {

    mockQuery.mockResolvedValueOnce([[]]);

    const res = await request(app).get("/api/historial/999");

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ error: "Registro no encontrado" });
    expect(mockQuery).toHaveBeenCalled();
  });

});
