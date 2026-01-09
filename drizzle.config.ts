import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./server/db/schema.ts",
  dbCredentials: {
    host: '8.134.153.58',
    port: 5432,
    user: 'postgres',
    password: 'PASSWORD_POSTGRES',
    database: 'postgres',
    ssl: false,
  },
  out: "./drizzle",
});
