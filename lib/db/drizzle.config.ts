import { defineConfig } from "drizzle-kit";
import path from "path";

const dbPath = process.env.LOCALOS_DB_PATH || path.join(process.cwd(), "localos.db");

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/schema/index.ts",
  out: "./drizzle",
  dbCredentials: {
    url: dbPath,
  },
});
