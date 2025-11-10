import request from "supertest";

import app from "../../src";
import { getAdminToken, getAuthToken } from "../helpers/auth";

describe("User API (E2E)", () => {
  let userID: string;

  it("should create a user successfully", async () => {
    const res = await request(app).post("/users").send({
      name: "John Doe",
      email: "john@mail.com",
      password: "secret123",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("email", "john@mail.com");
    expect(res.body).toHaveProperty("id");

    userID = res.body.id;
  });

  it("should modify a user successfully", async () => {
    const res = await request(app).put(`/users/${userID}`).send({
      name: "Jane Doe",
      email: "jane@mail.com",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("name", "Jane Doe");
    expect(res.body).toHaveProperty("email", "jane@mail.com");
  });

  it("should return 400 if email already exists", async () => {
    await request(app)
      .post("/users")
      .send({ name: "John", email: "duplicate@mail.com", password: "123" });

    const res = await request(app)
      .post("/users")
      .send({ name: "John", email: "duplicate@mail.com", password: "123" });

    expect(res.statusCode).toBe(400);
  });

  describe("User protected routes", () => {
    let token: string;

    beforeAll(async () => {
      token = await getAuthToken();
    });

    it("should return the current logged in user", async () => {
      const res = await request(app)
        .get("/users/me")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.user.email).toBe("john2@mail.com");
    });

    it("should deny access to non-admin users", async () => {
      const res = await request(app)
        .get("/users")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(403);
    });

    it("should allow admin to list all users", async () => {
      const adminToken = await getAdminToken();

      const res = await request(app)
        .get("/users")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});
