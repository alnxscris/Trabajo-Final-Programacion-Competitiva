import { jest } from "@jest/globals";

jest.unstable_mockModule("../src/services/search.service.js", () => ({
  ejecutarBusqueda: jest.fn()
}));

jest.unstable_mockModule("../src/config/db.js", () => ({
  default: { query: jest.fn() }
}));

const pool = (await import("../src/config/db.js")).default;
const { ejecutarBusqueda: ejecutarBusquedaService } = await import("../src/services/search.service.js");
const { ejecutarBusqueda } = await import("../src/controllers/search.controller.js");

const mockReq = (body, file, user = { id: 1 }) => ({ body, file, user });
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("CONTROLLER → search", () => {

  test("Sin patrón", async () => {
    const req = mockReq({ patron: "" }, {});
    const res = mockRes();
    await ejecutarBusqueda(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("Sin archivo", async () => {
    const req = mockReq({ patron: "AAA" }, null);
    const res = mockRes();
    await ejecutarBusqueda(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("Ejecuta service", async () => {
    ejecutarBusquedaService.mockResolvedValue([{ nombre: "A", coincidencias: "0" }]);

    const req = mockReq(
      { patron: "AAA" },
      { originalname: "x.csv", buffer: Buffer.from("nombre;cadena\nA;AAA") }
    );
    const res = mockRes();

    await ejecutarBusqueda(req, res);
    expect(res.json).toHaveBeenCalled();
  });

});
