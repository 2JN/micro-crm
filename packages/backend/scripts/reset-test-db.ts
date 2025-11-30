import { config } from "dotenv";
import { reset } from "drizzle-seed";

import { db } from "../src/db";
import { users } from "../src/schema/users";

config({ path: ".env.test", override: true });

export default async function resetTestDB() {
  console.log("🧹 Dropping test schema...");
  await reset(db, { users });
}

if (require.main === module) {
  (async () => {
    await resetTestDB();
  })();
}
