import { config } from "dotenv";
import { defineConfig } from "vitest/config";

config({ path: ".env.test" });

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["tests/**/*.test.ts"],
    setupFiles: ["./tests/setup.ts"],
    coverage: {
      reporter: ["text", "html"],
    },
  },
});
