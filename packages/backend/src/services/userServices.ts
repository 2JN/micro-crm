import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

import { db } from "../db";
import { users } from "../schema/users";

type User = Omit<
  typeof users.$inferInsert,
  "passwordHash" | "updatedAt" | "createdAt"
> & {
  password?: string;
};

export async function createUser({ password, ...data }: User) {
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password!, saltRounds);

  const [newUser] = await db
    .insert(users)
    .values({
      ...data,
      passwordHash,
    })
    .returning();

  return newUser;
}

export async function getUsers() {
  return db.select().from(users);
}

export async function getUser(id: string) {
  const [user] = await db.select().from(users).where(eq(users.id, id));

  return user;
}

export async function updateUser({ password, ...data }: Partial<User>) {
  let passwordHash;
  if (password) {
    const saltRounds = 10;
    passwordHash = await bcrypt.hash(password, saltRounds);
  }

  const [user] = await db
    .update(users)
    .set({
      ...data,
      passwordHash,
    })
    .where(eq(users.id, data.id!))
    .returning();

  return user;
}
