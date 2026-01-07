import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

const queryClient = "postgres://postgres:123456@localhost:5432/postgres"
export const db = drizzle(queryClient, { schema });

