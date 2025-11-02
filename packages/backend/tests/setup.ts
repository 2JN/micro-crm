import { beforeAll } from "vitest";

import resetTestDB from "../scripts/reset-test-db";

beforeAll(async () => {
  await resetTestDB();
});
