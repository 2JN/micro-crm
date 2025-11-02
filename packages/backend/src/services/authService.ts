import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../db";
import { users } from "../schema/users";
import { eq } from "drizzle-orm";
import { createUser } from "./userServices";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function registerUser(
  name: string,
  email: string,
  password: string
) {
  const newUser = await createUser({ name, email, password });

  const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, {
    expiresIn: "7d",
  });

  return { user: newUser, token };
}

export async function loginUser(email: string, password: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user) throw new Error("Invalid credentials");

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new Error("Invalid credentials");

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "7d",
  });

  return { user, token };
}
