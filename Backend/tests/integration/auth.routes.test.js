/**
 * Pruebas de integración para /api/auth
 */
import { jest } from "@jest/globals";
import request from "supertest";

// Silenciar errores del controlador
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

// ============ MOCKS ============

// mock de DB (NO queremos conectar al MySQL real)
const mockQuery = jest.fn();

jest.unstable_mockModule("../../src/config/db.js", () => ({
  default: {
    query: mockQuery,
    end: jest.fn(),
  }
}));

// mock de bcrypt
const mockHash = jest.fn();
const mockCompare = jest.fn();

jest.unstable_mockModule("bcryptjs", () => ({
  default: {
    hash: mockHash,
    compare: mockCompare,
  }
}));

// mock de JWT
const mockSign = jest.fn();

jest.unstable_mockModule("jsonwebtoken", () => ({
  default: {
    sign: mockSign,
  }
}));

// Importar app.js DESPUÉS de los mocks
let app;

beforeAll(async () => {
  const appModule = await import("../../src/app.js");
  app = appModule.default;
});

beforeEach(() => {
  jest.clearAllMocks();
});

// ===================================
// SUITE DE INTEGRACIÓN
// ===================================
describe("Integration - /api/auth", () => {

  // ---------------------------
  // TEST 1: REGISTER SUCCESS
  // ---------------------------
  test("INT-AUTH-01: POST /api/auth/register crea usuario", async () => {
    mockHash.mockResolvedValueOnce("hash-123");

    // pool.query → debe devolver [{ insertId: X }]
    mockQuery.mockResolvedValueOnce([{ insertId: 1 }]);

    const res = await request(app)
      .post("/api/auth/register")
      .send({
        nombre: "Sebastian",
        email: "sebas@test.com",
        password: "123456",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      mensaje: "Usuario registrado correctamente",
    });

    expect(mockHash).toHaveBeenCalled();
    expect(mockQuery).toHaveBeenCalledTimes(1);
  });

  // ---------------------------
  // TEST 2: REGISTER DUPLICADO
  // ---------------------------
  test("INT-AUTH-02: POST /api/auth/register devuelve 500 si correo duplicado", async () => {
    mockHash.mockResolvedValueOnce("hash-dup");

    const dupError = new Error("Duplicate entry");
    dupError.code = "ER_DUP_ENTRY";
    mockQuery.mockRejectedValueOnce(dupError);

    const res = await request(app)
      .post("/api/auth/register")
      .send({
        nombre: "Test",
        email: "existe@test.com",
        password: "123",
      });

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: "Error en el servidor" });
  });

  // ---------------------------
  // TEST 3: LOGIN USUARIO NO EXISTE
  // ---------------------------
  test("INT-AUTH-03: POST /api/auth/login devuelve 400 si usuario no existe", async () => {
    mockQuery.mockResolvedValueOnce([[]]); // rows vacío

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "noexiste@test.com",
        password: "123456",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: "Usuario no existe" });
  });

  // ---------------------------
  // TEST 4: LOGIN CORRECTO
  // ---------------------------
  test("INT-AUTH-04: POST /api/auth/login correcto devuelve token", async () => {
    mockQuery.mockResolvedValueOnce([
      [
        {
          id: 10,
          nombre: "Usuario",
          email: "user@test.com",
          password: "hash-db",
        }
      ]
    ]);

    mockCompare.mockResolvedValueOnce(true);
    mockSign.mockReturnValueOnce("TOKEN_FAKE");

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "user@test.com",
        password: "123456",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBe("TOKEN_FAKE");
    expect(res.body.mensaje).toBe("Login correcto");
  });

});
