import { jest } from "@jest/globals";

jest.unstable_mockModule("jsonwebtoken", () => ({
  default: {
    verify: jest.fn()
  }
}));

const jwt = (await import("jsonwebtoken")).default;
const authMiddleware = (await import("../src/middleware/auth.middleware.js")).default;

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("MIDDLEWARE → auth", () => {

  test("Token válido", () => {
    const req = { headers: { authorization: "Bearer tokentest" } };
    const res = mockRes();
    const next = jest.fn();

    jwt.verify.mockReturnValue({ id: 1 });

    authMiddleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test("Token inválido", () => {
    const req = { headers: { authorization: "Bearer x" } };
    const res = mockRes();
    const next = jest.fn();

    jwt.verify.mockImplementation(() => { throw new Error(); });

    authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });

});
