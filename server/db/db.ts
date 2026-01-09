import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = "postgresql://postgres:PASSWORD_POSTGRES@8.134.153.58:5432/postgres"
const client = postgres(connectionString)
export const db = drizzle(client, { schema });

