import { jest } from "@jest/globals";

jest.unstable_mockModule("../src/utils/runExecutable.js", () => ({
  ejecutarKMP: jest.fn()
}));

const { ejecutarKMP } = await import("../src/utils/runExecutable.js");
import { ejecutarBusqueda } from "../src/services/search.service.js";

describe("SERVICE → ejecutarBusqueda()", () => {

  test("Sin coincidencia devuelve '-1'", async () => {
    ejecutarKMP.mockResolvedValue("-1");

    const r = await ejecutarBusqueda(
      [{ nombre: "A", cadena: "TTT" }],
      "AAA"
    );

    expect(r[0].coincidencias).toBe("-1");
  });

});
