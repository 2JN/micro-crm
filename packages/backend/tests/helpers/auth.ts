import request from "supertest";
import { eq } from "drizzle-orm";

import app from "../../src/index";
import { db } from "../../src/db";
import { users } from "../../src/schema/users";

export async function getAuthToken() {
  const res = await request(app).post("/auth/register").send({
    name: "John Doe",
    email: "john2@mail.com",
    password: "secret123",
  });

  return res.body.token;
}

export async function getAdminToken() {
  const email = "admin@test.com";
  const password = "admin123";

  await request(app).post("/auth/register").send({
    name: "Test Admin",
    email,
    password,
  });

  // Promote user to admin
  await db.update(users).set({ role: "admin" }).where(eq(users.email, email));

  // Log in again to get token with updated role
  const res = await request(app).post("/auth/login").send({ email, password });

  return res.body.token;
}
