import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../db";
import { users } from "../schema/users";
import { eq } from "drizzle-orm";
import { createUser } from "./userServices";
import { TokenPayload } from "../types";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function registerUser({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) {
  const newUser = await createUser({ name, email, password });

  const payload: TokenPayload = {
    id: newUser.id,
    email: newUser.email,
    role: newUser.role,
  };

  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });

  return { user: newUser, token };
}

export async function loginUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user) throw new Error("Invalid credentials");

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new Error("Invalid credentials");

  const payload: TokenPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });

  return { user, token };
}
