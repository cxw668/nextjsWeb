import pg from 'pg';

const client = new pg.Client({
  connectionString: "postgresql://postgres:PASSWORD_POSTGRES@8.134.153.58:5432/postgres",
  ssl: false,
});

async function forceCreateSchema() {
  console.log("Connecting to database...");
  try {
    await client.connect();
    console.log("Connected successfully!");
    
    console.log("Dropping existing tables if any...");
    await client.query(`
      DROP TABLE IF EXISTS "account";
      DROP TABLE IF EXISTS "session";
      DROP TABLE IF EXISTS "authenticator";
      DROP TABLE IF EXISTS "verificationToken";
      DROP TABLE IF EXISTS "user" CASCADE;
    `);

    console.log("Creating tables with TEXT IDs...");
    await client.query(`
      CREATE TABLE "user" (
        "id" text PRIMARY KEY,
        "name" text,
        "email" text UNIQUE,
        "emailVerified" timestamp,
        "image" text,
        "hobby" text
      );

      CREATE TABLE "account" (
        "userId" text NOT NULL,
        "type" text NOT NULL,
        "provider" text NOT NULL,
        "providerAccountId" text NOT NULL,
        "refresh_token" text,
        "access_token" text,
        "expires_at" integer,
        "token_type" text,
        "scope" text,
        "id_token" text,
        "session_state" text,
        PRIMARY KEY ("provider", "providerAccountId")
      );

      CREATE TABLE "session" (
        "sessionToken" text PRIMARY KEY NOT NULL,
        "userId" text NOT NULL,
        "expires" timestamp NOT NULL
      );

      CREATE TABLE "verificationToken" (
        "identifier" text NOT NULL,
        "token" text NOT NULL,
        "expires" timestamp NOT NULL,
        PRIMARY KEY ("identifier", "token")
      );

      CREATE TABLE "authenticator" (
        "credentialID" text NOT NULL UNIQUE,
        "userId" text NOT NULL,
        "providerAccountId" text NOT NULL,
        "credentialPublicKey" text NOT NULL,
        "counter" integer NOT NULL,
        "credentialDeviceType" text NOT NULL,
        "credentialBackedUp" boolean NOT NULL,
        "transports" text,
        PRIMARY KEY ("userId", "credentialID")
      );
    `);
    
    console.log("Schema created successfully!");
    await client.end();
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

forceCreateSchema();
