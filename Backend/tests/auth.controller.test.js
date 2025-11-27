import { jest } from "@jest/globals";

jest.unstable_mockModule("../src/config/db.js", () => ({
  default: { query: jest.fn() }
}));

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const pool = (await import("../src/config/db.js")).default;
const { login } = await import("../src/controllers/auth.controller.js");

const mockReq = (body) => ({ body });

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json  = jest.fn().mockReturnValue(res);
  return res;
};

describe("CONTROLLER → auth", () => {

  test("Login exitoso", async () => {
    pool.query.mockResolvedValue([[{ id:1, password:"hash", email:"a@a.com", nombre:"User" }]]);

    jest.spyOn(bcrypt, "compare").mockResolvedValue(true);
    jest.spyOn(jwt, "sign").mockReturnValue("jsonwebtoken");

    const req = mockReq({ email:"a@a.com", password:"1234" });
    const res = mockRes();

    await login(req, res);

    expect(res.json).toHaveBeenCalled();
  });

});
