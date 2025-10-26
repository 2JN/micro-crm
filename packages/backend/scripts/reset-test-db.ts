import { config } from "dotenv";
import { execSync } from "child_process";
import { Pool } from "pg";

config({ path: ".env.test", override: true });

const dbUrl = process.env.DATABASE_URL!;
console.log("🧹 Dropping test schema...");

const pool = new Pool({ connectionString: dbUrl });
pool.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;").then(() => pool.end().then(() => {
  console.log("📦 Running migrations...");
  execSync(`pnpm drizzle-kit push --config=drizzle.config.test.ts`, {
    stdio: "inherit",
  });

  console.log("✅ Test database ready.");
})).catch((err) => {
  console.error("❌ Failed to reset test database:", err);
});