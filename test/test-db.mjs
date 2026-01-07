import pg from 'pg';

const client = new pg.Client({
  connectionString: "postgresql://postgres:123456@localhost:5432/postgres",
  ssl: false,
});

console.log("Connecting to database...");
try {
  await client.connect();
  console.log("Connected successfully!");
  const res = await client.query('SELECT NOW()');
  console.log("Query result:", res.rows[0]);
  await client.end();
} catch (err) {
  console.error("Connection failed:", err.message);
  process.exit(1);
}
