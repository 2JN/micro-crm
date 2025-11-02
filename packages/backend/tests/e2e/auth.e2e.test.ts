import request from "supertest";

import app from "../../src";
import resetTestDB from "../../scripts/reset-test-db";

describe("Auth API (E2E)", () => {
  let token: string;

  it("should register a user", async () => {
    const res = await request(app).post("/auth/register").send({
      name: "John Doe",
      email: "johnd@mail.com",
      password: "secret123",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("user");
    expect(res.body).toHaveProperty("token");

    token = res.body.token;
  });

  it("should login a user", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "johnd@mail.com",
      password: "secret123",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("user");
    expect(res.body).toHaveProperty("token");
  });
});
