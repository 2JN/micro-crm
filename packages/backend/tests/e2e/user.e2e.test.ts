import request from "supertest";

import app from "../../src";
import { getAdminToken, getAuthToken } from "../helpers/auth";
import users from "../fixtures/user-data.json";

describe("User API (E2E)", () => {
  let userID: string;

  it("non admin should not create a user", async () => {
    const res = await request(app).post("/users").send(users[0]);

    expect(res.statusCode).toBe(401);
  });

  describe("User protected routes", () => {
    let token: string;
    let adminToken: string;

    beforeAll(async () => {
      token = await getAuthToken();
      adminToken = await getAdminToken();
    });

    it("should return the current logged in user", async () => {
      const res = await request(app)
        .get("/users/me")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.user.email).toBe("john2@mail.com");
    });

    it("admin should create a user successfully", async () => {
      const res = await request(app)
        .post("/users")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(users[0]);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("email", users[0].email);
      expect(res.body).toHaveProperty("id");

      userID = res.body.id;
    });

    it("should return 400 if email already exists", async () => {
      await request(app).post("/users").send(users[0]);

      const res = await request(app)
        .post("/users")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(users[0]);

      expect(res.statusCode).toBe(400);
    });

    it("should modify own user account successfully", async () => {
      const {
        body: { token: userToken },
      } = await request(app).post("/auth/login").send(users[0]);

      const res = await request(app)
        .put(`/users/${userID}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          name: "Jane Doe",
          email: "jane@mail.com",
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("name", "Jane Doe");
      expect(res.body).toHaveProperty("email", "jane@mail.com");
    });

    it("should deny access to non-admin users to list all users", async () => {
      const res = await request(app)
        .get("/users")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(403);
    });

    it("should allow admin to list all users", async () => {
      const res = await request(app)
        .get("/users")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});
