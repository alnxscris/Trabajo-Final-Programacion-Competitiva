import { jest } from "@jest/globals";

jest.unstable_mockModule("child_process", () => ({
  execFile: jest.fn()
}));

const { execFile } = await import("child_process");
const { ejecutarKMP } = await import("../src/utils/runExecutable.js");

describe("UTILS → ejecutarKMP", () => {

  // Limpia console.error para que Jest no lo muestre
  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn(); // silenciar
  });
  afterAll(() => {
    console.error = originalError; // restaurar
  });

  test("Retorna índice", async () => {
    execFile.mockImplementation((p, args, cb) => cb(null, "0"));
    const r = await ejecutarKMP("AAA", "AAAT");
    expect(r).toBe("0");
  });

  test("Retorna error", async () => {
    execFile.mockImplementation((p, args, cb) => cb(new Error("fail")));

    await expect(ejecutarKMP("A", "B")).rejects.toThrow("fail");
  });

});
