import { jest } from "@jest/globals";

// Mock de multer para no depender de la función fileFilter real
jest.unstable_mockModule("multer", () => ({
  default: () => ({
    single: () => (req, res, next) => next()
  })
}));

import { uploadCSV } from "../src/middleware/upload.middleware.js";

describe("MIDDLEWARE → uploadCSV", () => {

  test("Middleware existe", () => {
    expect(typeof uploadCSV).toBe("function");
  });

});
