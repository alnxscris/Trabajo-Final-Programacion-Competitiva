import { jest } from "@jest/globals";

jest.unstable_mockModule("../src/config/db.js", () => ({
  default: { query: jest.fn() }
}));

const pool = (await import("../src/config/db.js")).default;
const { obtenerHistorialPorId } = await import("../src/controllers/historial.controller.js");

const mockReq = () => ({
  user: { id: 1 },
  params: { id: 1 }
});

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("CONTROLLER → historial", () => {

  test("Devuelve historial", async () => {
    pool.query.mockResolvedValue([[{
      id:1, resultados:"[]", archivo:"file", patron:"P", fecha:"2023-10-10"
    }]]);

    const req = mockReq();
    const res = mockRes();

    await obtenerHistorialPorId(req, res);

    expect(res.json).toHaveBeenCalled();
  });

});
