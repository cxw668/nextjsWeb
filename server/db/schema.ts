// schema.ts
import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const Users = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name', { length: 256 }),
  hobby: varchar('hobby', { length: 256 }),
})
